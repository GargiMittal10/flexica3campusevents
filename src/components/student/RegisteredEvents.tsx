import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import backendService from "@/services/backendService";

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
    try {
      // Note: This would need proper backend API support
      // For now, showing placeholder message
      setEvents([]);
      toast({
        title: "Info",
        description: "Registered events feature requires backend implementation",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load events",
        variant: "destructive",
      });
    }
    setLoading(false);
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
          <p className="text-muted-foreground text-center py-8">
            Register for events to see them here
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisteredEvents;
