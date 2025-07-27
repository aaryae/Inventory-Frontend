import { ChevronDown } from "lucide-react";
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
      <nav className="bg-white text-black/70 w-full fixed top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 px-4">
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="font-bold uppercase text-sm">
              Home
            </Link>

            {/* Blog Dropdown */}
            <div className="relative group">
              <div className="font-bold uppercase text-sm flex items-center gap-1 cursor-pointer">
                Blog <ChevronDown size={16} />
              </div>
              <ul
                className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50
                  opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0
                  transition-all duration-200 ease-in-out"
              >
                {["Food", "Technology", "Business", "Politics"].map((category) => (
                  <li key={category}>
                    <Link
                      to={`/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition duration-150 ease-in-out"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

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
