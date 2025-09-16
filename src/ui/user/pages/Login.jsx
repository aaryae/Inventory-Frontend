import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../../config/schema/auth/login.schema";
import { signIn } from "../../../services/auth/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token")
  console.log("Response:", localStorage.getItem("token"));
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = async () => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    setLoading(true);
    try {
      const res = await signIn(formData);
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("ram", "ram");
      toast.success(`Welcome back, ${res.data.username}! 🎉`);
      localStorage.setItem("username", res.data.username);

      if (res.data.role === "USER") {
        navigate("/user");
      } else if (res.data.username === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f1018]">
      <div className="max-w-lg w-full">
      
        <div className="text-center mb-10">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-slate-100">Welcome back</h2>
          <p className="text-lg text-slate-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>
 <div className="rounded-2xl border border-[#21222d] bg-[#171821]/90 backdrop-blur-lg shadow-2xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-300 mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-3 text-lg rounded-xl border ${
                  errors.email
                    ? "border-red-500 bg-red-50 text-red-900"
                    : "border-[#2a2b36] bg-[#21222d] text-white placeholder-slate-500"
                } focus:ring-2 focus:ring-indigo-500`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-slate-300 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 pr-12 text-lg rounded-xl border ${
                    errors.password
                      ? "border-red-500 bg-red-50 text-red-900"
                      : "border-[#2a2b36] bg-[#21222d] text-white placeholder-slate-500"
                  } focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 text-xl"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 px-6 rounded-xl shadow-lg hover:scale-[1.03] transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

       <div className="mt-4 text-center">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-cyan-400 font-medium hover:text-cyan-300 transition"
  >
    Forgot Password?
  </button>
</div>

        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-lg">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
