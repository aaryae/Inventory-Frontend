import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../config/axios";

const Hero = () => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No token found. Please log in.");
        return;
      }

      try {
        const response = await axiosInstance.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.email || "User");
        setErrorMessage("");
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
          setErrorMessage("Unauthorized access. Please log in again.");
          // Optionally, clear invalid token here
          // localStorage.removeItem("token");
        } else if (status === 403) {
          setErrorMessage("Access forbidden: you don't have permission to view this.");
        } else {
          setErrorMessage("Error fetching user data.");
        }
        console.error("API Error:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto text-center mt-16 px-6">
        <h1 className="text-3xl mt-20 font-bold mb-4">
          Welcome to the Inventory Management System
        </h1>
        {errorMessage ? (
          <p className="text-red-600 text-xl font-semibold">{errorMessage}</p>
        ) : (
          <p className="text-xl text-gray-700">
            Hello, <span className="font-semibold">{username}</span>!
          </p>
        )}
      </div>
    </main>
  );
};

export default Hero;
