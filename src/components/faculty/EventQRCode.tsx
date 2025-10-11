import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface EventQRCodeProps {
  facultyId: string;
}

const EventQRCode = ({ facultyId }: EventQRCodeProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedEventData, setSelectedEventData] = useState<any>(null);

  useEffect(() => {
    loadEvents();
  }, [facultyId]);

  useEffect(() => {
    if (selectedEvent) {
      const event = events.find(e => e.id === selectedEvent);
      setSelectedEventData(event);
    } else {
      setSelectedEventData(null);
    }
  }, [selectedEvent, events]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", facultyId)
      .order("event_date", { ascending: false });

    setEvents(data || []);
  };

  const handleDownload = () => {
    const canvas = document.getElementById("event-qr-code") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${selectedEventData?.title}-qr-code.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const canvas = document.getElementById("event-qr-code") as HTMLCanvasElement;
    
    if (printWindow && canvas) {
      const imageUrl = canvas.toDataURL("image/png");
      printWindow.document.write(`
        <html>
          <head>
            <title>Event QR Code - ${selectedEventData?.title}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              h1 { margin-bottom: 10px; }
              p { color: #666; margin-bottom: 20px; }
              img { border: 2px solid #000; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${selectedEventData?.title}</h1>
              <p>Scan this QR code to register for the event</p>
              <img src="${imageUrl}" alt="Event QR Code" />
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate QR data for event registration
  const generateQRData = () => {
    if (!selectedEventData) return "";
    return `EVENT:${selectedEventData.id}:${selectedEventData.title}:${new Date().getTime()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Event QR Code Generator
        </CardTitle>
        <CardDescription>Generate QR codes for students to register for events</CardDescription>
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
                  {event.title} - {new Date(event.event_date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEventData && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
              <div className="bg-white p-4 rounded-lg" id="qr-container">
                <QRCodeSVG
                  id="event-qr-code"
                  value={generateQRData()}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{selectedEventData.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEventData.event_date).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{selectedEventData.location}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print QR Code
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Students can scan this QR code to quickly register for this event. 
                Display it at your event venue or share it digitally.
              </p>
            </div>
          </div>
        )}

        {!selectedEventData && (
          <div className="text-center py-12 text-muted-foreground">
            Select an event to generate its QR code
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventQRCode;
