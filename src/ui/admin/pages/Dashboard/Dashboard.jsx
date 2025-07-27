import { Boxes, CheckCircle, Clock, Users } from "lucide-react";
import Chart from "../../components/Dashboard/Chart";
import QuickActions from "../../components/Dashboard/QuickActions";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import StatCard from "../../components/Dashboard/StatCard";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Resource(Class)",
      value: "5,678",
      icon: Boxes,
      color: "green",
    },
    {
      title: "Resource Assigned",
      value: "45,678",
      icon: CheckCircle,
      color: "purple",
    },
    {
      title: "Resource Not Assigned",
      value: "892",
      icon: Clock,
      color: "yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-[edf3ff] text-white">
      {/* Page Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-4xl  font-bold">Dashboard</h1>
        <p className=" mt-2 text-[#ffffffbd]">
          Welcome back! Here's what's happening with your inventory.
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Additional Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Count Chart */}
          <div className="lg:col-span-2">
            <Chart title="Resource Counts by Category" />
          </div>
        </div>
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
