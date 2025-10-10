import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { Users, Calendar, TrendingUp, Award, Activity, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventAnalyticsProps {
  events: any[];
  attendance: any[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  description?: string;
}

const StatCard = ({ title, value, icon, trend, description }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {trend && (
        <Badge variant="secondary" className="mt-2">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </Badge>
      )}
    </CardContent>
  </Card>
);

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#FFBB28', '#FF8042', '#8884d8', '#00C49F'];

export const EventAnalytics = ({ events, attendance }: EventAnalyticsProps) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    fetchProfiles();
    fetchRegistrations();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const fetchRegistrations = async () => {
    const { data } = await supabase.from('event_registrations').select('*');
    setRegistrations(data || []);
  };

  // Key Metrics
  const totalEvents = events.length;
  const totalAttendance = attendance.length;
  const totalRegistrations = registrations.length;
  const averageAttendance = totalEvents > 0 ? (totalAttendance / totalEvents).toFixed(1) : 0;
  const engagementRate = totalRegistrations > 0 ? ((totalAttendance / totalRegistrations) * 100).toFixed(1) : 0;
  const upcomingEvents = events.filter(e => new Date(e.event_date) > new Date()).length;
  
  // Calculate attendance statistics
  const eventAttendanceData = events
    .map(event => {
      const eventAttendance = attendance.filter(a => a.event_id === event.id);
      const eventRegistrations = registrations.filter(r => r.event_id === event.id);
      return {
        name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
        fullName: event.title,
        attendance: eventAttendance.length,
        registrations: eventRegistrations.length,
        date: new Date(event.event_date).toLocaleDateString(),
        engagementRate: eventRegistrations.length > 0 
          ? ((eventAttendance.length / eventRegistrations.length) * 100).toFixed(0)
          : 0
      };
    })
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 10);

  // Top performing events
  const topEvents = [...eventAttendanceData]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);

  // Calculate daily attendance trend (last 30 days)
  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyTrendData = last30Days.map(date => {
    const count = attendance.filter(a => 
      a.marked_at.split('T')[0] === date
    ).length;
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      attendance: count
    };
  });

  // Monthly attendance trend
  const monthlyData = attendance.reduce((acc: any, curr: any) => {
    const month = new Date(curr.marked_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {});

  const monthlyAttendanceData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    attendance: count
  }));

  // Event distribution
  const pastEvents = totalEvents - upcomingEvents;
  const eventDistribution = [
    { name: 'Upcoming', value: upcomingEvents },
    { name: 'Completed', value: pastEvents }
  ];

  // Faculty performance
  const facultyPerformance = events.reduce((acc: any, event) => {
    const eventAttendance = attendance.filter(a => a.event_id === event.id).length;
    if (!acc[event.created_by]) {
      acc[event.created_by] = {
        events: 0,
        totalAttendance: 0,
        facultyId: event.created_by
      };
    }
    acc[event.created_by].events++;
    acc[event.created_by].totalAttendance += eventAttendance;
    return acc;
  }, {});

  const facultyStats = Object.values(facultyPerformance).map((f: any) => ({
    name: profiles.find(p => p.id === f.facultyId)?.full_name || 'Unknown',
    events: f.events,
    attendance: f.totalAttendance,
    avgAttendance: (f.totalAttendance / f.events).toFixed(1)
  })).sort((a, b) => Number(b.avgAttendance) - Number(a.avgAttendance));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={<Calendar className="h-4 w-4" />}
          description={`${upcomingEvents} upcoming`}
        />
        <StatCard
          title="Total Attendance"
          value={totalAttendance}
          icon={<Users className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="Avg Attendance"
          value={averageAttendance}
          icon={<Activity className="h-4 w-4" />}
          description="Per event"
        />
        <StatCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Attended vs registered"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Attendance Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Attendance Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyTrendData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {eventDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top 5 Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.fullName}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{event.attendance} attendees</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance by Event */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance vs Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventAttendanceData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#FFBB28" name="Registered" />
                <Bar dataKey="attendance" fill="hsl(var(--primary))" name="Attended" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        {monthlyAttendanceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Faculty Performance */}
      {facultyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Faculty Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facultyStats.slice(0, 5).map((faculty, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{faculty.name}</p>
                    <p className="text-sm text-muted-foreground">{faculty.events} events organized</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{faculty.avgAttendance}</p>
                    <p className="text-xs text-muted-foreground">avg attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
