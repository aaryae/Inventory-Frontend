import { FilePlus, Plus, Settings, UserPlus } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Add New Item",
      description: "Add a new product to inventory",
      icon: Plus,
      color: "bg-gradient-to-br from-indigo-500 to-cyan-500",
      href: "/admin/inventory/add",
    },
    {
      id: 2,
      title: "Create User",
      description: "Add a new user account",
      icon: UserPlus,
      color: "bg-gradient-to-br from-green-400 to-cyan-400",
      href: "/admin/users/add",
    },
    {
      id: 3,
      title: "Generate Report",
      description: "Create inventory report",
      icon: FilePlus,
      color: "bg-gradient-to-br from-purple-500 to-indigo-500",
      href: "/admin/reports",
    },
    {
      id: 4,
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      color: "bg-gradient-to-br from-yellow-400 to-orange-400",
      href: "/admin/settings",
    },
  ];

  return (
    <div
      className="rounded-2xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="p-6 border-b border-[#21222d]">
        <h3 className="text-lg font-semibold text-slate-100">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="flex items-center gap-3 p-4 rounded-xl transition-colors border border-transparent hover:border-cyan-500 shadow-md"
                style={{ background: "#21222d" }}
              >
                <div
                  className={`p-2 rounded-lg shadow-md ${action.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
