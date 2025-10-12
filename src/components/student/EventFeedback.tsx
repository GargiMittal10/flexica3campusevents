import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import backendService from "@/services/backendService";

interface EventFeedbackProps {
  studentId: string;
}

const EventFeedback = ({ studentId }: EventFeedbackProps) => {
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [submittedFeedbackIds, setSubmittedFeedbackIds] = useState<Set<string>>(new Set());
  const [activeFeedbackSessions, setActiveFeedbackSessions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAttendedEvents();
    loadActiveFeedbackSessions();
  }, [studentId]);

  const loadActiveFeedbackSessions = async () => {
    try {
      // Note: Would need backend API support
      setActiveFeedbackSessions(new Set());
    } catch (error) {
      console.error("Failed to load feedback sessions:", error);
    }
  };

  const loadAttendedEvents = async () => {
    try {
      // Note: Would need proper backend API
      setAttendedEvents([]);
      setSubmittedFeedbackIds(new Set());
    } catch (error: any) {
      toast({
        title: "Info",
        description: "Feedback feature requires backend implementation",
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Event Feedback
        </CardTitle>
        <CardDescription>Provide feedback for events you've attended</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Attend events to provide feedback
        </p>
      </CardContent>
    </Card>
  );
};

export default EventFeedback;
