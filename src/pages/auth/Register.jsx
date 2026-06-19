import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [idCode, setIdCode] = useState("");
  const [department, setDepartment] = useState("Software Engineering"); // New Department State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation Checks
    if (!idCode.trim()) {
      setError("Please enter your valid identification code.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Pass the new department state to your AuthContext register function
      const res = await register(email, password, name, role, idCode, department);
      if (res.error) {
        setError(res.error);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans animate-fade-in py-12">
      
      {/* --- REGISTRATION CARD --- */}
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-50 text-red-900 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm border border-red-100">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Join PutraConsult today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-6 text-center border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Ali Bin Abu"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              required
              placeholder="student@upm.edu.my"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role & ID Grouping */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all cursor-pointer"
                value={role} 
                onChange={(e) => {
                  setRole(e.target.value);
                  setIdCode(""); 
                }}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 truncate">
                {role === "student" ? "Matric Number" : "Staff Number"}
              </label>
              <input 
                type="text" 
                required
                placeholder={role === "student" ? "e.g. 214589" : "e.g. SF8841"}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 uppercase focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
                value={idCode}
                onChange={(e) => setIdCode(e.target.value)}
              />
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            <select
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all cursor-pointer"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Network">Network</option>
              <option value="Multimedia">Multimedia</option>
              <option value="Computer Science">Computer Science</option>
            </select>
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
                placeholder="Create a password"
                className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              placeholder="Confirm your password"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#7B1822] hover:bg-[#5f131a] text-white font-bold py-4 rounded-xl mt-4 shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 tracking-wide cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin text-xl leading-none">⏳</span>
            ) : (
              "SIGN UP"
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7B1822] hover:text-[#5f131a] font-bold transition-colors">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}