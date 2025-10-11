import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, QrCode, BarChart3, LogOut, MessageSquare, QrCodeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventManagement from "@/components/faculty/EventManagement";
import QRScanner from "@/components/faculty/QRScanner";
import AnalyticsDashboard from "@/components/faculty/AnalyticsDashboard";
import EventQRCode from "@/components/faculty/EventQRCode";
import EventFeedbackView from "@/components/faculty/EventFeedbackView";

const FacultyDashboard = () => {
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

    if (profileData.role !== "faculty") {
      navigate("/student-dashboard");
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
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="qr-generator">
              <QrCodeIcon className="h-4 w-4 mr-2" />
              QR Generator
            </TabsTrigger>
            <TabsTrigger value="scanner">
              <QrCode className="h-4 w-4 mr-2" />
              Scanner
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

          <TabsContent value="qr-generator">
            <EventQRCode facultyId={profile?.id} />
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
