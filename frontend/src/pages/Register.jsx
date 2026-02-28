import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration call failed:', err);
      // If there's no response, it's a network error (like ERR_CONNECTION_REFUSED)
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
        <div className="login-card w-full bg-[#0f172a]/40 backdrop-blur-2xl rounded-[30px] shadow-[0_50px_120px_rgba(0,0,0,0.65)] px-12 py-14">

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00e97a] to-[#19bcfd] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,233,122,0.4)]">
              <i className="fas fa-user-plus text-black text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mt-6 tracking-tight">
              Join Nex<span className="text-emerald-400">Bank</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">
              Start your digital journey
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-3 text-lg"></i> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm flex items-center">
              <i className="fas fa-check-circle mr-3 text-lg"></i> {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-200 text-xs font-semibold tracking-wide mb-2">FULL NAME</label>
              <div className="relative">
                <i className="far fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  type="text"
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-xs font-semibold tracking-wide mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  type="email"
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder="name@company.com"
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
                  className="w-full bg-white/5 border-none rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password}
              className="w-full mt-8 bg-gradient-to-r from-[#00e97a] to-[#19bcfd] text-black font-semibold py-4 rounded-xl shadow-[0_15px_40px_rgba(0,233,122,0.45)] hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,233,122,0.6)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Secure Account"}
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
      `}</style>
    </div>
  );
};

export default Register;
