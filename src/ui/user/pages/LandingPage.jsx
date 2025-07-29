import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

const LandingTemplate = () => {
  return (
    <div className="pt-20 flex flex-col min-h-screen justify-between">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This will render nested routes like Hero */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingTemplate;
