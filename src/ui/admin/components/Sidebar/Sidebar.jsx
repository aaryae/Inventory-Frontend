import { Boxes, CheckCircle2, Home, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../common/Logo";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Inventory", icon: Boxes, path: "/admin/inventory" },
    { name: "assignment", icon: CheckCircle2, path: "/admin/assignment" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 text-slate-100 shadow-2xl shadow-black/40 border-r border-[#21222d] z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "#171821" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6  py-3 border-b border-[#21222d]">
          <div className="flex items-center space-x-3">
            {/* <span className="text-xl font-bold tracking-wide">Admin</span> */}
            <Logo />
          </div>

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-[#21222d] focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${
                        active
                          ? "bg-gradient-to-r from-indigo-600/80 to-cyan-500/80 text-white shadow-lg border-l-4 border-indigo-400"
                          : "text-slate-300 hover:bg-[#21222d] hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-[#21222d] bg-gradient-to-t from-[#171821] to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-400 truncate">
                admin@hotmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
