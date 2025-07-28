import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../common/Logo";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="bg-[black] text-white w-full fixed top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 px-4">
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="font-bold uppercase text-sm">
              Home
            </Link>

            <Link to="/contactus" className="font-bold uppercase text-sm">
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            &#9776;
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </>
  );
}
