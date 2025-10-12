import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, TrendingUp, Play, Square } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import backendService from "@/services/backendService";

interface EventFeedbackViewProps {
  facultyId: string;
}

const EventFeedbackView = ({ facultyId }: EventFeedbackViewProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [activeFeedbackSession, setActiveFeedbackSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    loadEvents();
  }, [facultyId]);

  useEffect(() => {
    if (selectedEvent) {
      loadFeedback();
      checkActiveFeedbackSession();
    }
  }, [selectedEvent]);

  const checkActiveFeedbackSession = async () => {
    try {
      const data = await backendService.getActiveFeedbackSession(selectedEvent);
      setActiveFeedbackSession(data);
    } catch (error) {
      setActiveFeedbackSession(null);
    }
  };

  const handleStartFeedback = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      await backendService.startFeedbackSession(selectedEvent);
      toast({
        title: "Feedback Enabled",
        description: "Students can now submit feedback for this event",
      });
      checkActiveFeedbackSession();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start feedback collection",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEndFeedback = async () => {
    if (!activeFeedbackSession) return;

    setLoading(true);
    try {
      await backendService.endFeedbackSession(selectedEvent);
      toast({
        title: "Feedback Disabled",
        description: "Students can no longer submit feedback for this event",
      });
      setActiveFeedbackSession(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to end feedback collection",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const loadEvents = async () => {
    try {
      const data = await backendService.getAllEvents();
      const facultyEvents = data.filter(event => event.createdBy === facultyId);
      setEvents(facultyEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const loadFeedback = async () => {
    try {
      const data = await backendService.getEventFeedback(selectedEvent);
      setFeedbacks(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to load feedback:", error);
      setFeedbacks([]);
    }
  };

  const calculateStats = (feedbackData: any[]) => {
    if (feedbackData.length === 0) {
      setStats({
        averageRating: 0,
        totalFeedback: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
      return;
    }

    const total = feedbackData.length;
    const sum = feedbackData.reduce((acc, fb) => acc + fb.rating, 0);
    const average = sum / total;

    const distribution = feedbackData.reduce((acc, fb) => {
      acc[fb.rating] = (acc[fb.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    setStats({
      averageRating: Number(average.toFixed(1)),
      totalFeedback: total,
      ratingDistribution: distribution,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Event Feedback
          </CardTitle>
          <CardDescription>View and analyze student feedback for your events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Event</label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} - {new Date(event.eventDate).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && (
            <div className="flex items-center gap-2 pt-2">
              {activeFeedbackSession ? (
                <>
                  <Badge className="bg-green-500">Feedback Active</Badge>
                  <Button
                    onClick={handleEndFeedback}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    className="ml-auto"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Feedback
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStartFeedback}
                  disabled={loading}
                  size="sm"
                  className="ml-auto"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Enable Feedback
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedEvent && feedbacks.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{stats.averageRating}</span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Out of 5 stars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{stats.totalFeedback}</span>
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Student feedback</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {stats.totalFeedback > 0
                      ? Math.round((stats.averageRating / 5) * 100)
                      : 0}
                    %
                  </span>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Overall satisfaction</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No feedback received yet</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">Student</p>
                          <p className="text-xs text-muted-foreground">ID: {feedback.studentId}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={feedback.rating >= 4 ? "default" : feedback.rating >= 3 ? "secondary" : "destructive"}>
                            {feedback.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                          </Badge>
                        </div>
                      </div>
                      {feedback.comment && (
                        <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(feedback.submittedAt), "PPp")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EventFeedbackView;
