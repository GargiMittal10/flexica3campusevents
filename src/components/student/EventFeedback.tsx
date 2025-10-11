import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EventFeedbackProps {
  studentId: string;
}

const EventFeedback = ({ studentId }: EventFeedbackProps) => {
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [submittedFeedbackIds, setSubmittedFeedbackIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAttendedEvents();
  }, [studentId]);

  const loadAttendedEvents = async () => {
    // Get events the student has attended
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select(`
        event_id,
        marked_at,
        events (
          id,
          title,
          description,
          event_date,
          location
        )
      `)
      .eq("student_id", studentId)
      .order("marked_at", { ascending: false });

    // Get submitted feedback
    const { data: feedbackData } = await supabase
      .from("feedback")
      .select("event_id")
      .eq("student_id", studentId);

    const submittedIds = new Set(feedbackData?.map(f => f.event_id) || []);

    setAttendedEvents(attendanceData || []);
    setSubmittedFeedbackIds(submittedIds);
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
        {attendedEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            You haven't attended any events yet
          </p>
        ) : (
          <div className="space-y-4">
            {attendedEvents.map((attendance) => {
              const event = attendance.events;
              const hasFeedback = submittedFeedbackIds.has(event.id);

              return (
                <FeedbackCard
                  key={event.id}
                  event={event}
                  studentId={studentId}
                  hasFeedback={hasFeedback}
                  onFeedbackSubmitted={() => {
                    setSubmittedFeedbackIds(prev => new Set([...prev, event.id]));
                  }}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface FeedbackCardProps {
  event: any;
  studentId: string;
  hasFeedback: boolean;
  onFeedbackSubmitted: () => void;
}

const FeedbackCard = ({ event, studentId, hasFeedback, onFeedbackSubmitted }: FeedbackCardProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("feedback")
      .insert({
        event_id: event.id,
        student_id: studentId,
        rating,
        comment: comment.trim() || null,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Success!",
      description: "Feedback submitted successfully",
    });

    onFeedbackSubmitted();
    setSubmitting(false);
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{event.title}</h3>
              {hasFeedback && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Feedback Submitted
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(event.event_date), "PPP")} • {event.location}
            </p>
          </div>
        </div>

        {!hasFeedback && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`comment-${event.id}`}>Comments (Optional)</Label>
              <Textarea
                id={`comment-${event.id}`}
                placeholder="Share your thoughts about this event..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="w-full"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFeedback;
