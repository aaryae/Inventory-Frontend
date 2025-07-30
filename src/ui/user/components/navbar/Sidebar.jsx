import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-black text-white z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out p-5 md:hidden shadow-lg`}
    >
      {/* Close button */}
      <button
        className="text-3xl absolute right-4 top-4"
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>

      {/* Profile section */}
      <div className="mt-20 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-white" />
          <span className="text-sm font-semibold uppercase">Profile</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
