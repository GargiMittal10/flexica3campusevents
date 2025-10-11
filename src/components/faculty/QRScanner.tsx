import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraOff, CheckCircle } from "lucide-react";

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      checkActiveSession();
    }
  }, [selectedEvent]);

  const checkActiveSession = async () => {
    const { data } = await supabase
      .from("attendance_sessions")
      .select("*")
      .eq("event_id", selectedEvent)
      .eq("is_active", true)
      .single();

    setActiveSession(data);
  };

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true });

    setEvents(data || []);
  };

  const startAttendanceSession = async () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event first",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("attendance_sessions")
      .insert({
        event_id: selectedEvent,
        created_by: user?.id || "",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start attendance session",
        variant: "destructive",
      });
    } else {
      setActiveSession(data);
      toast({
        title: "Success",
        description: "Attendance session started. Students can now show their QR codes.",
      });
    }
  };

  const endAttendanceSession = async () => {
    if (!activeSession) return;

    const { error } = await supabase
      .from("attendance_sessions")
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", activeSession.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to end attendance session",
        variant: "destructive",
      });
    } else {
      setActiveSession(null);
      if (scanning) {
        await stopScanning();
      }
      toast({
        title: "Success",
        description: "Attendance session ended",
      });
    }
  };

  const startScanning = async () => {
    if (!activeSession) {
      toast({
        title: "Error",
        description: "Please start an attendance session first",
        variant: "destructive",
      });
      return;
    }

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      setScanner(html5QrCode);

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Error",
        description: "Failed to start camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      await scanner.stop();
      setScanning(false);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      const parts = decodedText.split(":");
      if (parts[0] !== "STUDENT") {
        toast({
          title: "Invalid QR Code",
          description: "This is not a valid student QR code",
          variant: "destructive",
        });
        return;
      }

      const studentId = parts[1];
      const { data: { user } } = await supabase.auth.getUser();

      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("event_id", selectedEvent)
        .eq("student_id", studentId)
        .single();

      if (existing) {
        toast({
          title: "Already Marked",
          description: "This student's attendance is already marked",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("attendance").insert({
        event_id: selectedEvent,
        student_id: studentId,
        marked_by: user?.id || "",
        qr_data: decodedText,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Attendance marked successfully",
        });
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const onScanError = (err: string) => {
    // Ignore scan errors (they happen frequently during scanning)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Scan student QR codes to mark attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Event</label>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEvent && (
          <div className="space-y-2">
            {!activeSession ? (
              <Button onClick={startAttendanceSession} className="w-full" variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Attendance Session
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Attendance session is active
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Students can now show their QR codes
                  </p>
                </div>
                <Button onClick={endAttendanceSession} variant="outline" className="w-full">
                  End Attendance Session
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />

          {!scanning ? (
            <Button onClick={startScanning} className="w-full" disabled={!activeSession}>
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
