import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [devOtpCode, setDevOtpCode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email || !password || !phone) {
      setError("Email, password, and mobile number are required to request OTP.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/send-admin-otp', { email, password, phone });
      setOtpSent(true);
      setTimer(120); // 2 minutes
      if (res.data.devOtp) {
        setDevOtpCode(res.data.devOtp);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isAdminMode && !otp) {
      setError("Please request and enter your OTP first.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = { email, password };
      if (isAdminMode) {
        payload.otp = otp;
      }

      const res = await api.post('/auth/login', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('userRole', res.data.role);

      if (res.data.role === 'admin') {
        navigate('/admin'); // Route admins to SuperAdmin dashboard
      } else {
        if (res.data.hasKyc === false) {
           navigate('/add'); // First time users must submit KYC
        } else {
           navigate('/dashboard'); // Established users go to regular dashboard
        }
      }

    } catch (err) {
      if (err.response?.data?.requireOtp) {
        setError("Admin accounts require SMS verification. Please request an OTP.");
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
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

      <div className="relative z-10 w-full max-w-[460px] mx-4 animate-fade-in mt-16 pb-12">
        <div className="login-card w-full bg-[#0f172a]/40 backdrop-blur-2xl rounded-[30px] shadow-[0_50px_120px_rgba(0,0,0,0.65)] px-10 py-12">

          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-14 h-14 bg-gradient-to-br transition-all duration-300 ${isAdminMode ? 'from-[#19bcfd] to-blue-600 shadow-[0_10px_30px_rgba(25,188,253,0.4)]' : 'from-[#00e97a] to-[#19bcfd] shadow-[0_10px_30px_rgba(0,233,122,0.4)]'} rounded-2xl flex items-center justify-center mb-4`}>
              <i className={`fas ${isAdminMode ? 'fa-shield-alt text-white' : 'fa-landmark text-black'} text-2xl`}></i>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Sign In to Nex<span className={isAdminMode ? "text-[#19bcfd]" : "text-emerald-400"}>Bank</span>
            </h2>
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${!isAdminMode ? 'bg-[#00e97a] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setIsAdminMode(false); setOtpSent(false); setError(''); }}
            >
              Sign In as User
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${isAdminMode ? 'bg-[#19bcfd] text-white shadow-[#19bcfd]/30 shadow-md' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setIsAdminMode(true); setError(''); }}
            >
              Sign In as Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-3 text-lg"></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-200 text-xs font-semibold tracking-wide mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  type="email"
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder={isAdminMode ? "admin@nexbank.com" : "name@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-xs font-semibold tracking-wide mb-2">PASSWORD</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
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

            {isAdminMode && (
              <div>
                <label className="block text-gray-200 text-xs font-semibold tracking-wide mb-2">MOBILE NUMBER</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-none rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19bcfd]/30 transition"
                      placeholder="+1 234 567 8900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={isAdminMode}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={timer > 0 || loading || !email || !password || !phone}
                    className="bg-white/10 hover:bg-white/20 text-[#19bcfd] px-4 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:hover:bg-white/10 whitespace-nowrap"
                  >
                    {timer > 0 ? `Wait ${timer}s` : otpSent ? 'Resend' : 'Get OTP'}
                  </button>
                </div>
              </div>
            )}

            {isAdminMode && otpSent && (
              <div className="animate-fade-in">
                <label className="block text-[#19bcfd] text-xs font-semibold tracking-wide mb-2">ENTER OTP</label>
                <div className="relative">
                  <i className="fas fa-key absolute left-5 top-1/2 -translate-y-1/2 text-[#19bcfd]"></i>
                  <input
                    type="text"
                    className="w-full bg-[#19bcfd]/10 border border-[#19bcfd]/30 rounded-xl px-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19bcfd]/50 transition"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required={isAdminMode}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full mt-8 font-semibold py-4 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-[#19bcfd] to-blue-500 text-white shadow-[0_15px_40px_rgba(25,188,253,0.3)] hover:shadow-[0_20px_60px_rgba(25,188,253,0.5)]'
                  : 'bg-gradient-to-r from-[#00e97a] to-[#19bcfd] text-black shadow-[0_15px_40px_rgba(0,233,122,0.45)] hover:shadow-[0_20px_60px_rgba(0,233,122,0.6)]'
              }`}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : isAdminMode ? "Verify Admin Authentication" : "Sign In to NexBank"}
            </button>
          </form>

          {!isAdminMode && (
            <div className="mt-8 text-center text-gray-200 text-sm">
              Don't have an account? <Link to="/register" className="text-[#00e97a] font-semibold transition hover:text-[#19bcfd] ml-1" style={{ textDecoration: 'none' }}>Create one free</Link>
            </div>
          )}
        </div>
      </div>

      {/* Simulated Dev OTP Popup (Bottom Left) */}
      {devOtpCode && timer > 0 && (
        <div className="fixed bottom-8 left-8 z-50 animate-slide-in-left">
          <div className="bg-[#0f172a]/90 backdrop-blur-2xl border border-[#19bcfd]/40 text-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(25,188,253,0.3)] flex items-center gap-4 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-[#19bcfd]/20 flex items-center justify-center flex-shrink-0 border border-[#19bcfd]/30">
              <i className="fas fa-comment-sms text-[#19bcfd] text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.15em] mb-1">SIMULATED SMS MESSAGE</p>
              <p className="text-sm font-medium text-gray-200">
                Your NexBank Admin Verification Code is: <br/>
                <span className="text-[#19bcfd] font-bold text-2xl tracking-[0.2em]">{devOtpCode}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes subtleGlow {
          0% { box-shadow: 0 40px 100px rgba(0,0,0,0.6); }
          50% { box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(0,233,122,0.15); }
          100% { box-shadow: 0 40px 100px rgba(0,0,0,0.6); }
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

        .animate-slide-in-left {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;

