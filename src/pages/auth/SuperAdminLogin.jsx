import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.user.role !== 'SUPER_ADMIN') {
        toast.error('Access Denied: Only Super Admins can access this panel.');
        setLoading(false);
        return;
      }

      setAuthSession({
        token: res.data.token,
        user: res.data.user,
        institute: res.data.institute || null,
        tenantDomain: null,
      });
      toast.success('Welcome back, System Administrator');
      navigate('/super-admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-6">
              <Shield className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Super Admin</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">System Access Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                  placeholder="admin@eddva.system"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">Secure Token</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-blue-600/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authorize Entry
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Protected by EDDVA Security Core
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="mt-8 w-full text-center text-slate-400 hover:text-white transition-colors font-bold text-sm"
        >
          Return to Portal Login
        </button>
      </motion.div>
    </div>
  );
}
