import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QRCodeDisplayProps {
  profile: any;
}

const QRCodeDisplay = ({ profile }: QRCodeDisplayProps) => {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveSessions();
    
    // Subscribe to attendance session changes
    const channel = supabase
      .channel('attendance-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_sessions',
          filter: 'is_active=eq.true',
        },
        () => {
          loadActiveSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadActiveSessions = async () => {
    const { data } = await supabase
      .from("attendance_sessions")
      .select("*, events(title, location, event_date)")
      .eq("is_active", true)
      .order("started_at", { ascending: false });

    setActiveSessions(data || []);
    setLoading(false);
  };

  const downloadQR = () => {
    const svg = document.getElementById("student-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${profile.student_id}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading active sessions...</div>
        </CardContent>
      </Card>
    );
  }

  if (activeSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>
            Your QR code will be available when faculty starts an attendance session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Active Attendance Sessions</AlertTitle>
            <AlertDescription>
              Faculty has not started any attendance sessions yet. Your QR code will appear here when a session is active.
            </AlertDescription>
          </Alert>
          <div className="text-center py-8 text-muted-foreground">
            <p>Check back when you're at an event and faculty has started attendance marking.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription>
          Show this QR code to faculty members to mark your attendance at events
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Active Attendance Sessions</AlertTitle>
          <AlertDescription>
            {activeSessions.length} event{activeSessions.length > 1 ? 's are' : ' is'} currently taking attendance:
            <ul className="list-disc list-inside mt-2">
              {activeSessions.map((session: any) => (
                <li key={session.id}>{session.events?.title}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <QRCodeSVG
            id="student-qr-code"
            value={profile?.qr_code_data || ""}
            size={256}
            level="H"
            includeMargin
          />
        </div>
        <div className="text-center space-y-2">
          <p className="font-semibold text-lg">{profile?.full_name}</p>
          <p className="text-muted-foreground">Student ID: {profile?.student_id}</p>
        </div>
        <Button onClick={downloadQR} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
