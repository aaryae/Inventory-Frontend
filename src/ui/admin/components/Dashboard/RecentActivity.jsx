import { AlertTriangle, Boxes, User } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "user",
      message: "New user registered: John Doe",
      time: "2 minutes ago",
      icon: User,
      color: "text-blue-400",
    },
    {
      id: 2,
      type: "inventory",
      message: "Item #1234 stock updated",
      time: "5 minutes ago",
      icon: Boxes,
      color: "text-green-400",
    },
    {
      id: 3,
      type: "warning",
      message: "Low stock alert: Item #5678",
      time: "10 minutes ago",
      icon: AlertTriangle,
      color: "text-yellow-400",
    },
  ];

  return (
    <div
      className="rounded-2xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="p-6 border-b border-[#21222d]">
        <h3 className="text-lg font-semibold text-slate-100">
          Recent Activity
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${activity.color}`}
                  style={{ background: "#21222d" }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-100">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#21222d]">
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            View all activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
