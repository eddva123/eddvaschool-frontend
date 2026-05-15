import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, Key, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise(r => setTimeout(r, 1500));
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to verify OTP
      await new Promise(r => setTimeout(r, 1500));
      setStep(3);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-8 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                    <Key size={32} />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Forgot Password?</h1>
                  <p className="text-slate-500 text-sm font-medium">No worries, we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-all font-semibold"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Reset Password <ArrowRight size={20} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-8 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Check your email</h1>
                  <p className="text-slate-500 text-sm font-medium">We sent a 6-digit code to {email}</p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-center text-xl font-black text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Continue'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Password Reset</h1>
                <p className="text-slate-500 text-sm font-medium mb-10">Your password has been successfully reset. You can now login with your new credentials.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === 1 && (
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <ArrowRight size={16} className="rotate-180" /> Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
