import { useState } from "react";

const Hero = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem("username");

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