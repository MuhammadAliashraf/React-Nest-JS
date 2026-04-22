import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Layout,
} from "lucide-react";
import { postApi } from "../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or expired token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await postApi(
        "auth/reset-password",
        { token, password },
        null,
        false,
      );
      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 5000);
      } else {
        setError(response.message?.detail || "Reset failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 bg-white animate-in fade-in duration-1000">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-[3rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase leading-none italic">
                Reset Complete
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Credentials Have Been Updated
              </p>
            </div>

            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
              Your security keys have been successfully re-encoded.
              <br />
              Redirecting to authentication terminal...
            </p>

            <Link
              to="/login"
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-full shadow-2xl shadow-black/20 text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 bg-white animate-in fade-in duration-1000">
      <div className="max-w-md w-full space-y-12">
        {/* Brand Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-black text-white mb-4 shadow-2xl shadow-black/20 animate-in zoom-in duration-700">
            <Layout size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-black tracking-tighter uppercase leading-none italic">
              Update
              <br />
              Credentials
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              Authentication Code Required
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* New Password */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">
                New Access Key
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-14 py-5 border-2 border-gray-50 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="NEW_SECRET_KEY"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-black transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2.5} />
                  ) : (
                    <Eye size={18} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">
                Verify New Key
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-6 py-5 border-2 border-gray-50 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="CONFIRM_NEW_KEY"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-100 p-5 rounded-3xl animate-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}

            {!token && (
              <div className="bg-amber-50 border-2 border-amber-100 p-5 rounded-3xl">
                <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest text-center italic">
                  Invalid Auth Token
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex items-center justify-center gap-4 py-6 px-4 border border-transparent rounded-full shadow-2xl shadow-black/20 text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-8 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign New Credentials</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
