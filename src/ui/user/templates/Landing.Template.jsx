import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Usersidebar from "../../admin/components/userSidebar/side";
import Footer from "../components/footer/Footer";

const LandingTemplate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const name = localStorage.getItem("username") || "User";
    setUsername(name);
  }, []);

  return (
    <div className="flex h-screen" style={{ background: "#171821" }}>
      <Usersidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "#21222d" }}>
          <div className="w-full min-h-full mt-10 text-white">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingTemplate;
