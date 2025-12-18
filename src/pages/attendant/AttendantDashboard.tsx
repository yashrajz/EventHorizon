import { motion } from "framer-motion";
import { Users, Calendar, CheckSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Conference Attendant Dashboard
 * 
 * For users managing conference events, registrations, and attendees
 */
const AttendantDashboard = () => {
  const stats = [
    {
      title: "Total Attendees",
      value: "342",
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Upcoming Events",
      value: "8",
      change: "+2",
      icon: Calendar,
      color: "text-green-500",
    },
    {
      title: "Check-ins Today",
      value: "127",
      change: "+23%",
      icon: CheckSquare,
      color: "text-purple-500",
    },
    {
      title: "Registration Rate",
      value: "89%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Conference Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your conference events, attendees, and registrations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for conference management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Conference management features coming soon:
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Check-in attendees</li>
              <li>Manage event schedules</li>
              <li>Send notifications</li>
              <li>View registration reports</li>
              <li>Export attendee lists</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendantDashboard;
