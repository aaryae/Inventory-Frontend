import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { requestReset, verifyReset } from "../../services/auth/authService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await requestReset(email);
      toast.success(res.message || "Reset code sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!code || !newPassword) {
      toast.error("Please enter the code and new password");
      setLoading(false);
      return;
    }

    try {
      const res = await verifyReset({ email, code, newPassword });
      toast.success(res.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-[#052535] mb-6">
          Forgot Password
        </h2>
        <Toaster position="top-right" reverseOrder={false} />

        {step === 1 && (
          <form onSubmit={handleRequestReset} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
                Enter your email
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#052535] text-white text-lg font-bold py-3 rounded-full hover:bg-[#03415a] transition-colors"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyReset} className="flex flex-col gap-5">
            <div>
              <label htmlFor="code" className="block font-semibold text-gray-700 mb-1">
                Enter verification code
              </label>
              <input
                id="code"
                type="text"
                className="w-full h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block font-semibold text-gray-700 mb-1">
                Enter new password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full h-12 px-5 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#052535]"
                placeholder="New secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#052535] text-white text-lg font-bold py-3 rounded-full hover:bg-[#03415a] transition-colors"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
