import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { putApi } from "../../services/api";
import { Shield, Camera, Save, CheckCircle2 } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
      });
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await putApi(`users/${user.userId}`, {
        name: form.name,
        avatar: form.avatar,
        address: form.address,
        city: form.city,
        zipCode: form.zipCode,
        country: form.country,
      });

      if (res.success) {
        updateUser(res.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setPasswordError("");

    try {
      const res = await putApi(`auth/change-password`, {
        old_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });

      if (res.success) {
        setPasswordSuccess(true);
        setShowPasswordChange(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(res.message?.detail || "Failed to update password.");
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="space-y-2 lg:space-y-4 mb-4">
        <div className="flex items-center gap-4 text-gray-400">
          <Shield size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Secure Profile
          </span>
        </div>
        <h2 className="text-2xl lg:text-4xl font-black text-black tracking-tight uppercase leading-none">
          Personal Details
        </h2>
        <p className="text-gray-400 font-medium text-xs lg:text-sm max-w-lg">
          Manage your identity and account security settings. Your privacy is
          our priority.
        </p>
      </section>

      {/* Avatar Section */}
      <section className="flex flex-col items-center sm:items-start gap-8">
        <div className="relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-black flex items-center justify-center text-white text-4xl lg:text-5xl font-black ring-8 ring-white shadow-2xl overflow-hidden cursor-pointer group-hover:opacity-90 transition-all border-4 border-gray-100"
          >
            {form.avatar ? (
              <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{form.name?.charAt(0) || "U"}</span>
            )}
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={32} className="text-white" />
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg font-black text-black uppercase tracking-tight">Profile Picture</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">JPG, PNG, OR GIF • MAX 5MB</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-[10px] font-black text-black underline underline-offset-4 hover:text-gray-600 transition-colors uppercase tracking-widest"
          >
            Change Image
          </button>
        </div>
      </section>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-4">
          {/* Name */}
          <div className="group space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-black transition-colors">
              Name
            </label>
            <input
              type="text"
              className="w-full px-0 py-2 px-2 rounded border-b-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg placeholder-gray-200 text-gray-600"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email - Read Only */}
          <div className="group space-y-3 col-span-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Email Address / Account ID
            </label>
            <div className="flex items-center gap-4">
              <input
                type="email"
                disabled
                className="flex-1 px-2 py-2 border-b-2 border-gray-50 bg-white rounded shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg cursor-not-allowed opacity-60 text-gray-600"
                value={form.email}
              />
              <div className="bg-gray-50 w-[80px] flex items-center justify-center py-2 rounded-full border border-gray-100">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                  Verified
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">
              Email cannot be changed via the dashboard.
            </p>
          </div>

          {/* Address */}
          <div className="group space-y-3 col-span-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-black transition-colors">
              Shipping Address
            </label>
            <input
              type="text"
              className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg placeholder-gray-200 text-gray-600"
              placeholder="Street Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* City & Zip */}
          <div className="group space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-black transition-colors">
              City
            </label>
            <input
              type="text"
              className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg placeholder-gray-200 text-gray-600"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="group space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-black transition-colors">
              Zip Code
            </label>
            <input
              type="text"
              className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg placeholder-gray-200 text-gray-600"
              placeholder="Zip Code"
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
            />
          </div>

          {/* Country */}
          <div className="group space-y-3 col-span-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-black transition-colors">
              Country
            </label>
            <input
              type="text"
              className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/50 focus:outline-none focus:border-black transition-all font-black text-lg placeholder-gray-200 text-gray-600"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center gap-8 border-b border-gray-100 pb-20">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-4 bg-black text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 group cursor-pointer"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
            ) : (
              <>
                <Save
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Save Profile</span>
              </>
            )}
          </button>

          {success && (
            <div className="flex items-center gap-3 text-green-500 font-black text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-left-4">
              <CheckCircle2 size={18} />
              <span>Identity Updated Successfully</span>
            </div>
          )}
        </div>
      </form>

      {/* Security Tip Card & Password Change */}
      <section className="pt-10 lg:pt-0">
        <div className="bg-white p-6 lg:p-12 rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-gray-200/50 flex flex-col gap-6 lg:gap-10 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-black shrink-0">
              <Shield size={28} lg={32} strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg lg:text-xl font-black text-black uppercase tracking-tight mb-2">
                Account Security
              </h4>
              <p className="text-gray-400 font-medium text-xs lg:text-sm leading-relaxed">
                Always ensure your password is unique and high-strength. We
                recommend using a digital vault for maximum security.
              </p>
            </div>
            {!showPasswordChange && (
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full md:w-auto px-8 py-4 text-black border-2 border-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all whitespace-nowrap cursor-pointer"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordChange && (
            <div className="pt-10 border-t border-gray-100 animate-in slide-in-from-top-4 duration-500">
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white focus:outline-none focus:border-black transition-all font-black text-lg"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white focus:outline-none focus:border-black transition-all font-black text-lg"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full py-2 px-2 rounded border-b-2 border-gray-100 bg-white focus:outline-none focus:border-black transition-all font-black text-lg"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{passwordError}</p>
                )}

                <div className="flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    Update Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-3 text-green-500 font-black text-[10px] uppercase tracking-widest animate-in fade-in">
              <CheckCircle2 size={18} />
              <span>Security Key Updated</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
