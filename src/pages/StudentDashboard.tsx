import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode as QrCodeIcon, Calendar, BarChart3, LogOut, CalendarClock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeDisplay from "@/components/student/QRCodeDisplay";
import RegisteredEvents from "@/components/student/RegisteredEvents";
import AttendanceStats from "@/components/student/AttendanceStats";
import UpcomingEvents from "@/components/student/UpcomingEvents";
import EventFeedback from "@/components/student/EventFeedback";
import Navbar from "@/components/Navbar";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profileData) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      return;
    }

    if (profileData.role !== "student") {
      navigate("/faculty-dashboard");
      return;
    }

    setProfile(profileData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {profile?.full_name}</h1>
            <p className="text-muted-foreground mt-2">Student ID: {profile?.student_id}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="qr">
              <QrCodeIcon className="h-4 w-4 mr-2" />
              My QR Code
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <CalendarClock className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              My Events
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <QRCodeDisplay profile={profile} />
          </TabsContent>

          <TabsContent value="upcoming">
            <UpcomingEvents studentId={profile?.id} />
          </TabsContent>

          <TabsContent value="events">
            <RegisteredEvents studentId={profile?.id} />
          </TabsContent>

          <TabsContent value="stats">
            <AttendanceStats studentId={profile?.id} />
          </TabsContent>

          <TabsContent value="feedback">
            <EventFeedback studentId={profile?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
