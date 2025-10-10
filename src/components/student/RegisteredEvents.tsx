import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface RegisteredEventsProps {
  studentId: string;
}

const RegisteredEvents = ({ studentId }: RegisteredEventsProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRegisteredEvents();
  }, [studentId]);

  const loadRegisteredEvents = async () => {
    const { data, error } = await supabase
      .from("event_registrations")
      .select(`
        id,
        registered_at,
        events (
          id,
          title,
          description,
          event_date,
          location
        )
      `)
      .eq("student_id", studentId)
      .order("registered_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const checkAttendance = async (eventId: string) => {
    const { data } = await supabase
      .from("attendance")
      .select("id")
      .eq("event_id", eventId)
      .eq("student_id", studentId)
      .single();

    return !!data;
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Registered Events</CardTitle>
          <CardDescription>Events you've registered for</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No registered events yet</p>
          ) : (
            <div className="space-y-4">
              {events.map((registration) => (
                <EventCard
                  key={registration.id}
                  event={registration.events}
                  registeredAt={registration.registered_at}
                  studentId={studentId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EventCard = ({ event, registeredAt, studentId }: any) => {
  const [attended, setAttended] = useState(false);

  useEffect(() => {
    checkAttendance();
  }, []);

  const checkAttendance = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("id")
      .eq("event_id", event.id)
      .eq("student_id", studentId)
      .single();

    setAttended(!!data);
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              {attended ? (
                <Badge className="bg-green-500">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Attended
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <UserX className="h-3 w-3 mr-1" />
                  Not Attended
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{event.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(event.event_date), "PPP")}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredEvents;
