import { Bell, Menu, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const name = localStorage.getItem("username") || "User";
  console.log("Username:", name);
  const [notifications] = useState([
    { id: 1, message: "New user registered", time: "2 min ago", unread: true },
    {
      id: 2,
      message: "Inventory low on item #123",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "System backup completed",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className="text-slate-100 shadow-md border-b border-[#21222d]"
      style={{ background: "#171821" }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-[#21222d] focus:outline-none"
          >
            <Menu className="w-6 h-6 text-indigo-400" />
          </button>
        </div>   
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md hover:bg-[#21222d] focus:outline-none"
            >
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#171821]">
                  {unreadCount}
                </span>
              )}
            </button>
         
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-[#21222d] z-50"
                style={{ background: "#21222d" }}
              >
                <div className="p-4 border-b border-[#21222d]">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#21222d] hover:bg-[#171821] cursor-pointer ${
                        notification.unread ? "bg-[#21222d]" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-cyan-400" : "bg-slate-600"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-[#21222d]">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex  items-center space-x-2 p-2 rounded-md hover:bg-[#21222d] focus:outline-none "
            >
              <UserCircle className="w-8 h-8 text-white" />
            </button>
        {showUserMenu && (
  <div
    className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border border-[#21222d] z-50"
    style={{ background: "#21222d" }}
  >
    <div className="py-3 px-4 border-b border-[#2a2b36]">
      <p className="block px-4 py-2 text-sm text-slate-300 hover:bg-[#171821]"> {name}</p>
    
    </div>
    <div className="py-2">
      <Link
        to="/admin"
        className="block px-4 py-2 text-sm text-slate-300 hover:bg-[#171821]"
      >
        Dashboard
      </Link>
      <Link
        to="/admin/users"
        className="block px-4 py-2 text-sm text-slate-300 hover:bg-[#171821]"
      >
        Users
      </Link>
      <Link
        to="/admin/inventory"
        className="block px-4 py-2 text-sm text-slate-300 hover:bg-[#171821]"
      >
        Inventory
      </Link>
      <Link
        to="/admin/assignment"
        className="block px-4 py-2 text-sm text-slate-300 hover:bg-[#171821]"
      >
        Assignment
      </Link>
      <hr className="border-[#21222d] my-1" />
      <a
        onClick={handleLogout}
        className="block px-4 py-2 text-sm text-red-400 hover:bg-[#171821] cursor-pointer"
      >
        Logout
      </a>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
