import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "../../../services/auth/authService";
import { axiosInstance } from "../../../config/axios";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!login.email || !login.password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn(login);
      if (res.success && res.data) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("role", res.data.role);
        toast.success("Login successful");

        setTimeout(() => {
          if (res.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        }, 1000);
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!register.username || !register.email || !register.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Registered as ${register.email}`);
        setIsLogin(true);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-10 shadow-lg">
        <h2 className="text-center text-4xl font-bold text-[#052535] mb-8">
          {isLogin ? "Login" : "Register"}
        </h2>
        <Toaster position="top-right" reverseOrder={false} />
        <form
          onSubmit={isLogin ? handleSubmitLogin : handleSubmitRegister}
          className="flex flex-col gap-6"
        >
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="font-semibold text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={register.username}
                onChange={handleRegisterChange}
                placeholder="Enter your username"
                className="h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={isLogin ? login.email : register.email}
              onChange={isLogin ? handleLoginChange : handleRegisterChange}
              placeholder="Enter your email"
              className="h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={isLogin ? login.password : register.password}
              onChange={isLogin ? handleLoginChange : handleRegisterChange}
              placeholder="Enter your password"
              className="h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
              required
            />
            {isLogin && location.pathname === "/login" && (
              <div className="text-right text-sm  mt-1">
                Forgot password? 
                <a href="/forgot-password" className="hover:underline text-blue-600 mx-1">
                   Click Here
                </a>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#052535] text-white text-lg font-bold py-3 rounded-full hover:bg-[#03415a] transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          {isLogin ? "Not registered?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
