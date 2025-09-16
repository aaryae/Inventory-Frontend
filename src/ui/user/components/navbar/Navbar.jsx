import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import Logo from "../../../common/Logo";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("profile-dropdown");
      const toggleBtn = document.getElementById("profile-toggle");

      if (
        dropdownOpen &&
        dropdown &&
        !dropdown.contains(event.target) &&
        toggleBtn &&
        !toggleBtn.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0  z-40 md:hidden bg-#171821"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

   <nav
  className="text-white w-full fixed top-0 z-30 shadow-md"
  style={{ backgroundColor: "#171821" }}
>
  <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 px-4">
 <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 px-4">
    <div className="hidden">
        <Logo />
    </div>
</div>

    <div className="hidden md:flex items-center gap-7 relative">
      <button
        id="profile-toggle"
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-transparent text-white border-none cursor-pointer"
      >
        <UserCircle className="w-8 h-12 text-white" />
        <span className="text-sm font-semibold uppercase">Profile</span>
      </button>

      {dropdownOpen && (
        <div
          id="profile-dropdown"
          className="absolute top-full mt-5 right-0 w-48 bg-white text-black rounded-md shadow-lg z-50"
        >
          <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">
            {username ? ` ${username}` : "Guest"}
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>

  
    <button
      className="md:hidden text-2xl cursor-pointer"
      onClick={() => setIsSidebarOpen(true)}
    >
      &#9776;
    </button>
  </div>
</nav>


      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </>
  );
}
