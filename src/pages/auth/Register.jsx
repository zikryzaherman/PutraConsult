import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [idCode, setIdCode] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!idCode.trim()) {
      setError(`Please enter your valid identification code.`);
      return;
    }
    const res = await register(email, password, name, role, idCode);
    if (res.error) {
      setError(res.error);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-800 tracking-wide">Putra Consult</h2>
          <p className="text-xs text-gray-500 font-mono mt-1">ACCOUNT REGISTRATION</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-4 font-mono">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">FULL NAME</label>
            <input type="text" placeholder="As per official registry" className="w-full p-2.5 border rounded" onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">UPM SYSTEM ROLE</label>
            <select className="w-full p-2.5 border rounded bg-white" value={role} onChange={e => { setRole(e.target.value); setIdCode(""); }}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              {role === "student" ? "MATRICS NUMBER" : "STAFF NUMBER"}
            </label>
            <input type="text" placeholder={role === "student" ? "e.g. 214589" : "e.g. SF8841"} value={idCode} className="w-full p-2.5 border rounded font-mono uppercase" onChange={e => setIdCode(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">UPM EMAIL ADRESS</label>
            <input type="email" placeholder="username@upm.edu.my" className="w-full p-2.5 border rounded" onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">PASSWORD</label>
            <input type="password" placeholder="••••••••" className="w-full p-2.5 border rounded" onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-red-800 text-white p-3 rounded font-bold hover:bg-red-900 transition mt-2 tracking-wider">REGISTER</button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">Already registered? <Link to="/login" className="text-red-800 underline font-bold">Login</Link></p>
      </div>
    </div>
  );
}