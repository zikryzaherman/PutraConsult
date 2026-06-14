import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎓</div>
          <h2 className="text-3xl font-extrabold text-red-800">PutraConsult</h2>
          <p className="text-gray-500 mt-1 text-sm">UPM Consultation Management Portal</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="UPM Staff / Student Email" className="w-full p-3 border rounded-xl" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-red-700 text-white p-3 rounded-xl font-bold hover:bg-red-800 transition">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">First time using the app? <Link to="/register" className="text-blue-600 font-semibold underline">Create an account</Link></p>
      </div>
    </div>
  );
}