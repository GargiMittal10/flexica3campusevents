import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EventAnalyticsProps {
  events: any[];
  attendance: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const EventAnalytics = ({ events, attendance }: EventAnalyticsProps) => {
  // Calculate attendance statistics
  const eventAttendanceData = events.map(event => {
    const eventAttendance = attendance.filter(a => a.event_id === event.id);
    return {
      name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
      attendance: eventAttendance.length,
      date: new Date(event.event_date).toLocaleDateString()
    };
  });

  // Calculate total attendance by month
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

  // Calculate event type distribution
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.event_date) > new Date()).length;
  const pastEvents = totalEvents - upcomingEvents;

  const eventDistribution = [
    { name: 'Upcoming', value: upcomingEvents },
    { name: 'Completed', value: pastEvents }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Event Distribution</CardTitle>
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
                fill="#8884d8"
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

      <Card>
        <CardHeader>
          <CardTitle>Attendance by Event</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {monthlyAttendanceData.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
