import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogOut, CheckCircle, XCircle, Clock, FileText, BarChart3, Calendar, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAnalytics } from "@/components/admin/EventAnalytics";
import { EventManagementTable } from "@/components/admin/EventManagementTable";
import { EventHistory } from "@/components/admin/EventHistory";

interface PendingApproval {
  id: string;
  full_name: string;
  email: string;
  student_id: string;
  id_card_url: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [idCardUrl, setIdCardUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("approvals");

  useEffect(() => {
    checkAdminAccess();
    fetchPendingApprovals();
    fetchEvents();
    fetchAttendance();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/admin-login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({
        title: "Access Denied",
        description: "Admin privileges required",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from("pending_faculty_approvals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingApprovals(data || []);
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

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*");

      if (error) throw error;
      setAttendance(data || []);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
    }
  };

  const viewIdCard = async (approval: PendingApproval) => {
    setSelectedApproval(approval);
    
    const { data } = await supabase.storage
      .from("faculty-id-cards")
      .createSignedUrl(approval.id_card_url, 300);

    if (data?.signedUrl) {
      setIdCardUrl(data.signedUrl);
    }
  };

  const handleApproval = async (approvalId: string, approved: boolean) => {
    try {
      const approval = pendingApprovals.find(a => a.id === approvalId);
      if (!approval) return;

      if (approved) {
        // Call edge function to create user and approve
        const { error: functionError } = await supabase.functions.invoke("approve-faculty", {
          body: { approvalId },
        });

        if (functionError) throw functionError;

        toast({
          title: "Faculty Approved",
          description: `${approval.full_name} has been approved and can now login`,
        });
      } else {
        // Reject the approval
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from("pending_faculty_approvals")
          .update({
            status: "rejected",
            reviewed_at: new Date().toISOString(),
            reviewed_by: user?.id,
          })
          .eq("id", approvalId);

        if (error) throw error;

        toast({
          title: "Faculty Rejected",
          description: `${approval.full_name}'s application has been rejected`,
        });
      }

      setSelectedApproval(null);
      fetchPendingApprovals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">System Management & Analytics</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="approvals" className="gap-2">
              <FileText className="h-4 w-4" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No pending faculty approvals
                </CardContent>
              </Card>
            ) : (
              pendingApprovals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{approval.full_name}</CardTitle>
                      <CardDescription className="mt-1">
                        {approval.email} • ID: {approval.student_id}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        Applied: {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(approval.status)}
                  </div>
                </CardHeader>
                {approval.status === "pending" && (
                  <CardContent className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => viewIdCard(approval)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View ID Card
                    </Button>
                    <Button
                      onClick={() => handleApproval(approval.id, true)}
                      className="gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval(approval.id, false)}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </CardContent>
                )}
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="events">
            <EventManagementTable events={events} onRefresh={fetchEvents} />
          </TabsContent>

          <TabsContent value="analytics">
            <EventAnalytics events={events} attendance={attendance} />
          </TabsContent>

          <TabsContent value="history">
            <EventHistory events={events} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Faculty ID Card</DialogTitle>
            <DialogDescription>
              Review the ID card for {selectedApproval?.full_name}
            </DialogDescription>
          </DialogHeader>
          {idCardUrl && (
            <div className="mt-4">
              <img
                src={idCardUrl}
                alt="Faculty ID Card"
                className="w-full rounded-lg border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
