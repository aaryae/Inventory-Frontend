import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { axiosInstance } from "../../../config/axios";

export default function LandingPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="pt-20 flex flex-col min-h-screen justify-between">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto text-center mt-16 px-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to the Inventory Management System
          </h1>
          <p className="text-xl text-gray-700">
            Hello, <span className="font-semibold">{username || "User"}</span>!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
