import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2, Layout } from "lucide-react";
import { postApi } from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await postApi(
        "auth/forgot-password",
        { email },
        null,
        false,
      );
      if (response.success) {
        setSubmitted(true);
      } else {
        setError(
          response.message?.detail ||
            "Failed to send reset link. Please try again.",
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 bg-white animate-in fade-in duration-1000">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-[3rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase leading-none italic">
                Check Inbox
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Instructional Dispatch Sent
              </p>
            </div>

            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
              We've dispatched a recovery link to <br />
              <span className="text-black font-black underline decoration-2 underline-offset-4">
                {email}
              </span>
              .
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black hover:underline underline-offset-8 transition-all pt-4"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              Back to Terminal
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
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-black tracking-tighter uppercase leading-none italic">
              Recover Password
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              Initiate Password Reset
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-6 px-4 border border-transparent rounded-full shadow-2xl shadow-black/20 text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-8 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Request Reset Link</span>
                  <Send
                    size={18}
                    strokeWidth={2.5}
                    className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black transition-all group"
        >
          <ArrowLeft
            size={16}
            strokeWidth={3}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Terminal
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
