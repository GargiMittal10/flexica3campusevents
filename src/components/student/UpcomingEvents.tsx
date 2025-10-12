import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import backendService from "@/services/backendService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, UserPlus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UpcomingEventsProps {
  studentId: string;
}

const UpcomingEvents = ({ studentId }: UpcomingEventsProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUpcomingEvents();
  }, [studentId]);

  const loadUpcomingEvents = async () => {
    try {
      const eventsData = await backendService.getAllEvents();
      // Filter upcoming events on frontend
      const upcomingEvents = eventsData.filter(event => 
        new Date(event.eventDate) >= new Date()
      );
      
      // Note: Registration check would need backend API support
      // For now, we'll show all events
      setEvents(upcomingEvents);
      setRegisteredEventIds(new Set());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load upcoming events",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    try {
      await backendService.registerForEvent(eventId);
      toast({
        title: "Success!",
        description: "Successfully registered for the event",
      });
      // Update registered events
      setRegisteredEventIds(prev => new Set([...prev, eventId]));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading upcoming events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Events scheduled by faculty members</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No upcoming events scheduled</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const isRegistered = registeredEventIds.has(event.id);
              return (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {isRegistered && (
                            <Badge className="bg-green-500 hover:bg-green-600 mt-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.event_date), "PPP")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(event.event_date), "p")}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    
                    {!isRegistered && (
                      <Button
                        onClick={() => handleRegister(event.id)}
                        size="sm"
                        className="shrink-0"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
