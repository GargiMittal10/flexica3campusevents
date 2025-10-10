import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventHistoryProps {
  events: any[];
}

export const EventHistory = ({ events }: EventHistoryProps) => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendees = async (eventId: string) => {
    setLoading(true);
    try {
      const { data: attendanceData, error } = await supabase
        .from("attendance")
        .select(`
          *,
          student:student_id(full_name, student_id, email),
          marker:marked_by(full_name, email)
        `)
        .eq("event_id", eventId);

      if (error) throw error;

      setAttendees(attendanceData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttendees = async (event: any) => {
    setSelectedEvent(event);
    await fetchAttendees(event.id);
  };

  const exportToCSV = () => {
    if (!selectedEvent || attendees.length === 0) return;

    const headers = ["Student Name", "Student ID", "Email", "Marked At", "Marked By"];
    const rows = attendees.map((a) => [
      a.student?.full_name || "N/A",
      a.student?.student_id || "N/A",
      a.student?.email || "N/A",
      new Date(a.marked_at).toLocaleString(),
      a.marker?.full_name || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedEvent.title}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Attendance exported successfully",
    });
  };

  const pastEvents = events.filter((e) => new Date(e.event_date) < new Date());

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No past events found
                  </TableCell>
                </TableRow>
              ) : (
                pastEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.location || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAttendees(event)}
                        className="gap-2"
                      >
                        <Users className="h-4 w-4" />
                        View Attendees
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Attendance for {selectedEvent?.title}</span>
              <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </DialogTitle>
            <DialogDescription>
              Total Attendees: {attendees.length}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">Loading attendees...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Marked At</TableHead>
                    <TableHead>Marked By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No attendees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>{attendee.student?.full_name || "N/A"}</TableCell>
                        <TableCell>{attendee.student?.student_id || "N/A"}</TableCell>
                        <TableCell>{attendee.student?.email || "N/A"}</TableCell>
                        <TableCell>{new Date(attendee.marked_at).toLocaleString()}</TableCell>
                        <TableCell>{attendee.marker?.full_name || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
