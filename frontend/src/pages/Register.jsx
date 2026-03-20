import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isAdminMode && !email.endsWith('@admin.com')) {
      setError("Admin accounts must be registered using an @admin.com email domain.");
      return;
    }
    if (isAdminMode && !phone) {
      setError("Mobile number is required for secure Admin OTP verification.");
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { name, email, password };
      if (isAdminMode) {
        payload.phone = phone;
      }
      
      await api.post('/auth/register', payload);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration call failed:', err);
      if (!err.response) {
        setError('Connection refused. Please ensure the backend is running and matches VITE_API_URL.');
      } else {
        setError(err.response.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)' }}></div>
      </div>
      {/* Gradient Glow */}
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/25 to-cyan-500/15 blur-[160px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1"></div>

      <div className="relative z-10 w-full max-w-[460px] mx-4 animate-fade-in mt-24 mb-10">
        <div className="login-card w-full bg-[#0f172a]/40 backdrop-blur-2xl rounded-[30px] shadow-[0_50px_120px_rgba(0,0,0,0.65)] px-10 py-12">

          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-14 h-14 bg-gradient-to-br transition-all duration-300 ${isAdminMode ? 'from-[#19bcfd] to-blue-600 shadow-[0_10px_30px_rgba(25,188,253,0.4)]' : 'from-[#00e97a] to-[#19bcfd] shadow-[0_10px_30px_rgba(0,233,122,0.4)]'} rounded-2xl flex items-center justify-center mb-4`}>
              <i className={`fas ${isAdminMode ? 'fa-shield-alt text-white' : 'fa-user-plus text-black'} text-2xl`}></i>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Join Nex<span className={isAdminMode ? "text-[#19bcfd]" : "text-emerald-400"}>Bank</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">
              {isAdminMode ? 'Register Operator Account' : 'Start your digital journey'}
            </p>
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${!isAdminMode ? 'bg-[#00e97a] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setIsAdminMode(false); setError(''); setSuccess(''); }}
            >
              Register as User
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${isAdminMode ? 'bg-[#19bcfd] text-white shadow-[#19bcfd]/30 shadow-md' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setIsAdminMode(true); setError(''); setSuccess(''); }}
            >
              Register as Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm flex items-center animate-fade-in">
              <i className="fas fa-exclamation-circle mr-3 text-lg"></i> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm flex items-center animate-fade-in">
              <i className="fas fa-check-circle mr-3 text-lg"></i> {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="reg-name" className="block text-gray-200 text-xs font-semibold tracking-wide mb-2 uppercase">Full Name</label>
              <div className="relative">
                <i className="far fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e97a]/30 transition"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-gray-200 text-xs font-semibold tracking-wide mb-2 uppercase">Email Address</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder={isAdminMode ? "name@admin.com" : "name@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isAdminMode && (
              <div className="animate-fade-in">
                <label htmlFor="reg-phone" className="block text-gray-200 text-xs font-semibold tracking-wide mb-2 uppercase">Mobile Number <span className="text-[#19bcfd] lowercase font-normal ml-1">(for OTP)</span></label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-[#19bcfd] text-sm"></i>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="text"
                    className="w-full bg-[#19bcfd]/5 border border-[#19bcfd]/20 rounded-xl px-10 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19bcfd]/40 transition"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={isAdminMode}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="reg-password" className="block text-gray-200 text-xs font-semibold tracking-wide mb-2 uppercase">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password || (isAdminMode && !phone)}
              className={`w-full mt-8 font-semibold py-4 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-[#19bcfd] to-blue-500 text-white shadow-[0_15px_40px_rgba(25,188,253,0.3)] hover:shadow-[0_20px_60px_rgba(25,188,253,0.5)]'
                  : 'bg-gradient-to-r from-[#00e97a] to-[#19bcfd] text-black shadow-[0_15px_40px_rgba(0,233,122,0.45)] hover:shadow-[0_20px_60px_rgba(0,233,122,0.6)]'
              }`}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : isAdminMode ? "Create Admin Credentials" : "Create Secure Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-200 text-sm">
            Already have an account? <Link to="/login" className="text-[#00e97a] font-semibold transition hover:text-[#19bcfd] ml-1" style={{ textDecoration: 'none' }}>Sign in instead</Link>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-300 text-xs">
          By registering, you agree to our <a href="#" className="text-emerald-400 hover:text-emerald-300 transition" style={{ textDecoration: 'none' }}>Terms of Service</a> & <a href="#" className="text-emerald-400 hover:text-emerald-300 transition" style={{ textDecoration: 'none' }}>Privacy Policy</a>.
        </div>
      </div>

      <style>{`
          @keyframes subtleGlow {
              0% { box-shadow: 0 50px 120px rgba(0,0,0,0.65); }
              50% { box-shadow: 0 50px 120px rgba(0,0,0,0.65), 0 0 50px rgba(0,233,122,0.15); }
              100% { box-shadow: 0 50px 120px rgba(0,0,0,0.65); }
          }
          .login-card {
              animation: subtleGlow 6s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default Register;
