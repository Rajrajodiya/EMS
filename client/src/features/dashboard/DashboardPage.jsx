import EmployeeTaskList from "@/components/shared/EmployeeTaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Building, Clock, IndianRupee, ListChecks, FileText, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Dashboard data with realistic metrics
const dashboardData = {
  adminStats: {
    totalSalary: 850000,
    employeeCount: 24,
    departmentCount: 5,
    onLeaveToday: [
      { name: "Rahul Sharma", type: "Sick Leave" },
      { name: "Priya Patel", type: "Personal Leave" },
    ],
  },
  employeeStats: {
    tasksCompleted: 12,
    pendingTasks: 3,
    leavesAvailable: 12,
    upcomingReviews: [
      { type: "Quarterly Review", date: "15 Oct 2023" },
      { type: "Skill Assessment", date: "30 Nov 2023" }
    ]
  },
  departmentDistribution: [
    { name: "Engineering", count: 12, color: "bg-blue-500" },
    { name: "Marketing", count: 4, color: "bg-purple-500" },
    { name: "HR", count: 3, color: "bg-green-500" },
    { name: "Finance", count: 3, color: "bg-yellow-500" },
    { name: "Operations", count: 2, color: "bg-red-500" },
  ],
  recentActivity: [
    { action: "New hire", name: "Amit Kumar", time: "2 hours ago" },
    { action: "Leave approved", name: "Neha Gupta", time: "Yesterday" },
    { action: "Promotion", name: "Rajesh Iyer", time: "2 days ago" },
  ],
};

export default function DashboardPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {isAdmin ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}

// Admin Dashboard View
function AdminDashboard() {
  return (
    <>
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Organization overview and management
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Button>
      </div>

      {/* Admin Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Salary
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{dashboardData.adminStats.totalSalary.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.adminStats.employeeCount}
            </div>
            <p className="text-xs text-muted-foreground">
              +3 new hires this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData.adminStats.departmentCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Engineering largest (12)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On Leave Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData.adminStats.onLeaveToday.length}
            </div>
            <div className="text-xs space-y-1 mt-2">
              {dashboardData.adminStats.onLeaveToday.map((emp, i) => (
                <div key={i} className="flex justify-between">
                  <span className="truncate max-w-[100px]">{emp.name}</span>
                  <span className="text-muted-foreground">{emp.type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Data Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <div className="h-full flex flex-col justify-between">
                {dashboardData.departmentDistribution.map((dept, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-24 text-sm">{dept.name}</div>
                    <div className="flex-1 flex items-center">
                      <div
                        className={`h-6 rounded-md ${dept.color}`}
                        style={{
                          width: `${
                            (dept.count / dashboardData.adminStats.employeeCount) *
                            100
                          }%`,
                        }}
                      >
                        <span className="ml-2 text-xs text-white">
                          {dept.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Task List Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Team Tasks</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View All
              </Button>
              <Button size="sm">Create Task</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmployeeTaskList />
        </CardContent>
      </Card>
    </>
  );
}

// Employee Dashboard View
function EmployeeDashboard() {
  return (
    <>
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">
            Your work overview and activities
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Button>
      </div>

      {/* Employee Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData.employeeStats.tasksCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Tasks
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData.employeeStats.pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              1 high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leaves Available
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.employeeStats.leavesAvailable}
            </div>
            <p className="text-xs text-muted-foreground">
              5 casual, 7 sick
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Reviews
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData.employeeStats.upcomingReviews.length}
            </div>
            <div className="text-xs space-y-1 mt-2">
              {dashboardData.employeeStats.upcomingReviews.map((review, i) => (
                <div key={i} className="flex justify-between">
                  <span className="truncate max-w-[100px]">{review.type}</span>
                  <span className="text-muted-foreground">{review.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Task List Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Tasks</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmployeeTaskList />
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Request Leave</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Upload Files</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Training Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Materials</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
