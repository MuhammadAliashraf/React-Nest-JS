import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Layout,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { postApi } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await postApi(
        "auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        null,
        false,
      );

      if (response.success) {
        // Assume API returns { user, access, refresh, roles }
        login(response.data);
        const redirectTo = searchParams.get("redirect") || "/";
        navigate(redirectTo, { replace: true });
      } else {
        setError(
          response.message?.detail || "Registration failed. Please try again.",
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 bg-white animate-in fade-in duration-1000">
      <div className="max-w-xl w-full space-y-12">
        {/* Brand Header */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-5xl lg:text-7xl font-black text-black tracking-tighter uppercase leading-none italic">
              Signup
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              Initialize Account Credentials
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full -translate-y-24 translate-x-24 blur-3xl opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name Fields Grid */}

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">
                Name
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="FIRST"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">
                Identification
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-14 pr-6 py-5 border-2 border-gray-50 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="EMAIL_ADDRESS"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">
                Secure Password
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-14 py-5 border-2 border-gray-50 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="CREATE_PASSWORD"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
                Confirm Password
              </label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-black transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-14 py-5 border-2 border-gray-50 rounded-3xl bg-gray-50/30 focus:bg-white focus:outline-none focus:ring-8 focus:ring-black/5 focus:border-black transition-all text-sm font-bold text-black"
                  placeholder="CONFIRM_PASSWORD"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-100 p-5 rounded-3xl animate-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 py-6 px-4 border border-transparent rounded-full shadow-2xl shadow-black/20 text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-8 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Signup</span>
                    <ArrowRight
                      size={18}
                      strokeWidth={2.5}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Already have credentials?{" "}
            <Link
              to="/login"
              className="text-black hover:underline underline-offset-4 decoration-2"
            >
              Sign in
            </Link>
          </p>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-loose">
            By creating an account, you accept our{" "}
            <Link
              to="/terms"
              className="text-gray-400 hover:text-black underline"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-black underline"
            >
              Privacy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
