import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, QrCode, BarChart3, LogOut, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventManagement from "@/components/faculty/EventManagement";
import QRScanner from "@/components/faculty/QRScanner";
import AnalyticsDashboard from "@/components/faculty/AnalyticsDashboard";
import EventFeedbackView from "@/components/faculty/EventFeedbackView";
import authService from "@/services/authService";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate("/faculty-login");
      return;
    }

    if (user.role !== "FACULTY") {
      if (user.role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      }
      return;
    }

    setProfile({
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      student_id: user.id,
      role: user.role
    });
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome, {profile?.full_name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="scanner">
              <QrCode className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventManagement facultyId={profile?.id} />
          </TabsContent>

          <TabsContent value="scanner">
            <QRScanner />
          </TabsContent>

          <TabsContent value="feedback">
            <EventFeedbackView facultyId={profile?.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FacultyDashboard;
