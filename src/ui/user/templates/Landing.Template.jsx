import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/navbar/Sidebar";

const LandingTemplate = () => {
  return (
    <div className="flex flex-col h-screen ">
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LandingTemplate;
