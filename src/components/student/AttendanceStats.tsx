import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Award, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import backendService from "@/services/backendService";

interface AttendanceStatsProps {
  studentId: string;
}

const AttendanceStats = ({ studentId }: AttendanceStatsProps) => {
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalAttended: 0,
    percentage: 0,
  });
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, [studentId]);

  const loadStats = async () => {
    try {
      const data = await backendService.getStudentAttendancePercentage(studentId);
      setStats({
        totalRegistered: data.totalRegistered || 0,
        totalAttended: data.totalAttended || 0,
        percentage: data.percentage || 0,
      });
      setAttendanceHistory(data.history || []);
    } catch (error: any) {
      toast({
        title: "Info",
        description: "Unable to load attendance statistics",
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Overall Attendance
          </CardTitle>
          <CardDescription>Your attendance percentage across all events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-primary">{stats.percentage}%</div>
          <Progress value={stats.percentage} className="h-3" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{stats.totalAttended} attended</span>
            <span>{stats.totalRegistered} registered</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Event Statistics
          </CardTitle>
          <CardDescription>Your event participation breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Registered Events</p>
              <p className="text-3xl font-bold">{stats.totalRegistered}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Events Attended</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalAttended}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Attendance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.percentage >= 75 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">Excellent Attendance!</p>
                <p className="text-sm text-green-600 dark:text-green-500">Keep up the great work!</p>
              </div>
            </div>
          ) : stats.percentage >= 50 ? (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <BarChart3 className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">Good Progress</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">Try to attend more events to improve!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <Calendar className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400">Needs Improvement</p>
                <p className="text-sm text-red-600 dark:text-red-500">Attend more events to boost your attendance!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Attendance History
          </CardTitle>
          <CardDescription>Your complete attendance record for all events</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No attendance records yet</p>
          ) : (
            <div className="space-y-3">
              {attendanceHistory.map((record: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{record.title}</p>
                      {record.attended ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Absent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Event Date: {format(new Date(record.eventDate), "PPP")}</span>
                      {record.attended && record.markedAt && (
                        <span>Marked: {format(new Date(record.markedAt), "PPp")}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{record.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
