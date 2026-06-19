import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login, Firebase auth state listener will handle routing
        navigate("/");
      }
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      
      {/* --- LOGIN CARD --- */}
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-50 text-red-900 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm border border-red-100">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome Back!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Sign in to PutraConsult to continue
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-6 text-center border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              User ID / Email
            </label>
            <input 
              type="email" 
              required
              placeholder="e.g. student@upm.edu.my or dr.ahmad"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Enter your password"
                className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.581c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#7B1822] hover:bg-[#5f131a] text-white font-bold py-4 rounded-xl mt-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 tracking-wide cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin text-xl leading-none">⏳</span>
            ) : (
              "LOGIN"
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#7B1822] hover:text-[#5f131a] font-bold transition-colors">
            SIGN UP
          </Link>
        </div>

      </div>
    </div>
  );
}