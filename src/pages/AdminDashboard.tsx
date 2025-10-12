import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogOut, CheckCircle, XCircle, Clock, FileText, BarChart3, Calendar, History, Key } from "lucide-react";
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

  const checkAdminAccess = () => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate("/admin-login");
      return;
    }

    if (user.role !== "ADMIN") {
      toast({
        title: "Access Denied",
        description: "Admin privileges required",
        variant: "destructive",
      });
      if (user.role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (user.role === "FACULTY") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/");
      }
    }
  };

  const fetchPendingApprovals = async () => {
    // TODO: Implement with MySQL backend API
    setLoading(false);
  };

  const fetchEvents = async () => {
    // TODO: Implement with MySQL backend API
  };

  const fetchAttendance = async () => {
    // TODO: Implement with MySQL backend API
  };

  const viewIdCard = async (approval: PendingApproval) => {
    // TODO: Implement with MySQL backend API
  };

  const handleApproval = async (approvalId: string, approved: boolean) => {
    // TODO: Implement with MySQL backend API
  };

  const handleResetPassword = async (email: string, fullName: string) => {
    // TODO: Implement with MySQL backend API
  };

  const handleLogout = () => {
    authService.logout();
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
                <CardContent className="flex gap-2">
                  {approval.status === "pending" && (
                    <>
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
                    </>
                  )}
                  {approval.status === "approved" && (
                    <Button
                      variant="outline"
                      onClick={() => handleResetPassword(approval.email, approval.full_name)}
                      className="gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Reset Password
                    </Button>
                  )}
                </CardContent>
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
