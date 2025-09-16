import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

const AdminTemplate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen" style={{ background: "#171821" }}>
   
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <Header toggleSidebar={toggleSidebar} />
        
        
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "#21222d" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminTemplate;
