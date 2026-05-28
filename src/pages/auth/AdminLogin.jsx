import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, ShieldCheck, Sparkles, TimerReset, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { buildTenantAuthCompleteUrl, finishAuthRedirect, getBaseAppUrl, getPortalType, getTenantDomainFromHostname, isTenantHost } from '../../utils/tenantRedirect';

const OTP_DURATION = 300;

function normalizeRole(role) {
  if (!role) return '';
  const value = String(role).toUpperCase().replace(/[-\s]+/g, '_');
  return value === 'ADMIN' ? 'INSTITUTE_ADMIN' : value;
}

export default function Login() {
  const navigate = useNavigate();
  const portalType = getPortalType();
  const tenantDomain = getTenantDomainFromHostname();
  const tenantMode = isTenantHost();
  const [tenantInstitute, setTenantInstitute] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(tenantMode);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [selectedRole, setSelectedRole] = useState('INSTITUTE_ADMIN');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('eddva-theme') || 'light');
  const { setAuthSession } = useAuth();

  useEffect(() => { localStorage.setItem('eddva-theme', theme); }, [theme]);

  useEffect(() => {
    if (remaining <= 0) return undefined;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining]);

  useEffect(() => {
    if (!tenantMode) return undefined;
    let ignore = false;
    async function loadTenant() {
      try {
        if (!tenantDomain) {
          throw new Error('Missing tenant domain');
        }
        const res = await api.get(`/tenants/resolve/${tenantDomain}`);
        if (!ignore) setTenantInstitute(res.data);
      } catch {
        if (!ignore) setError('Tenant workspace was not found. Check the subdomain or contact support.');
      } finally {
        if (!ignore) setTenantLoading(false);
      }
    }
    loadTenant();
    return () => { ignore = true; };
  }, [tenantMode]);

  const roleLabel = useMemo(() => {
    if (selectedRole === 'STUDENT') return 'STUDENT OTP LOGIN';
    if (selectedRole === 'TEACHER') return 'TEACHER OTP LOGIN';
    return 'INSTITUTE OTP LOGIN';
  }, [selectedRole]);
  const headline = useMemo(() => {
    if (selectedRole === 'STUDENT') return 'Student Portal';
    if (selectedRole === 'TEACHER') return 'Teacher Access';
    return tenantMode ? (tenantInstitute?.name ? `${tenantInstitute.name} Staff Access` : 'Institute Staff Access') : 'Institute Access';
  }, [selectedRole, tenantInstitute, tenantMode]);

  async function sendOtp() {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/otp/send', { email, role: selectedRole });
      setStep('otp');
      setRemaining(OTP_DURATION);
      toast.success('OTP sent to your email');
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || 'Failed to send OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/otp/verify', { email, otp, role: selectedRole });
      const payload = res.data?.data ?? res.data ?? {};
      const { user, token, accessToken, institute, tenantDomain: nextTenantDomain } = payload;
      const sessionToken = token || accessToken;
      const normalizedRole = normalizeRole(user?.role);
      const allowedRole = normalizeRole(selectedRole);

      if (!normalizedRole || normalizedRole !== allowedRole) {
        throw new Error('This email belongs to a different role. Use the correct login portal.');
      }

      setAuthSession({
        token: sessionToken,
        user,
        institute: institute || null,
        tenantDomain: nextTenantDomain || tenantDomain || null,
      });

      toast.success('Login verified successfully');

      if (normalizedRole === 'INSTITUTE_ADMIN' && !tenantMode) {
        const handoffUrl = buildTenantAuthCompleteUrl(nextTenantDomain, { token: sessionToken, user, institute, tenantDomain: nextTenantDomain });
        if (handoffUrl) {
          window.location.assign(handoffUrl);
          return;
        }
      }

      finishAuthRedirect(nextTenantDomain || tenantDomain, navigate, normalizedRole);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'OTP verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 'email') return sendOtp();
    return verifyOtp();
  }

  async function handleResendOtp() {
    if (remaining > 0 || loading) return;
    await sendOtp();
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left info / marketing with institute photo background */}
        <section
          className="hidden lg:flex flex-col justify-between gap-8 overflow-hidden border-r border-gray-100 p-12"
          style={{
            // lighter white overlay so background appears clear and bright
            backgroundImage: `linear-gradient(rgba(255,255,255,0.30), rgba(250,250,255,0.30)), url('/institute-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="relative max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-sky-50/20 to-white/30" />
            <div className="relative z-10">
              <p className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700 shadow-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Premium Authentication
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900">Secure access for institutes & teachers</h1>
              <p className="mt-4 text-lg text-slate-600 max-w-lg">Modern OTP authentication with enterprise-grade security and role-based access.</p>

              <div className="mt-6 grid grid-cols-2 gap-6 lg:gap-8 relative z-10 lg:translate-x-16">
                <div className="rounded-2xl border border-white/30 bg-white/30 p-5 shadow-md backdrop-blur-sm backdrop-saturate-110">
                  <p className="text-sm font-extrabold text-blue-700 uppercase">JWT Security</p>
                  <p className="mt-2 text-sm text-gray-700">Secure sessions and JWT-based protection.</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/30 p-5 shadow-md backdrop-blur-sm backdrop-saturate-110">
                  <p className="text-sm font-extrabold text-blue-700 uppercase">OTP Verification</p>
                  <p className="mt-2 text-sm text-gray-700">5-minute OTP validity for maximum security.</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/30 p-5 shadow-md backdrop-blur-sm backdrop-saturate-110">
                  <p className="text-sm font-extrabold text-blue-700 uppercase">Role-Based Access</p>
                  <p className="mt-2 text-sm text-gray-700">Separate dashboards for institutes & teachers.</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/30 p-5 shadow-md backdrop-blur-sm backdrop-saturate-110">
                  <p className="text-sm font-extrabold text-blue-700 uppercase">Enterprise Protection</p>
                  <p className="mt-2 text-sm text-gray-700">Bank-level encryption and data protection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-gray-600">Trusted by 1000+ institutions • 99.9% Uptime • ISO 27001 Certified</div>
        </section>

        {/* Right login card */}
        <main className="flex items-center justify-center p-8">
          <div className="relative w-full max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-10 shadow-2xl relative z-30 -ml-6 lg:-ml-20">
              {/* Large centered logo */}
              <div className="-mt-12 flex justify-center">
                <div className="rounded-full bg-white p-4 shadow-lg">
                  <img src="/logo.png" alt="EDDVA" className="w-48 h-48 object-contain" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back!</h2>
                <p className="mt-2 text-sm text-gray-500">Enter your email address to receive a secure OTP</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="flex gap-2">
                  {[
                    { id: 'INSTITUTE_ADMIN', label: 'INSTITUTE' },
                    { id: 'TEACHER', label: 'TEACHER' },
                    { id: 'STUDENT', label: 'STUDENT' }
                  ].map((item) => (
                    <button key={item.id} type="button" onClick={() => setSelectedRole(item.id)} className={`flex-1 rounded-2xl px-2 py-3 text-sm font-bold tracking-wide transition ${selectedRole === item.id ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg' : 'bg-white border border-gray-200 text-slate-700'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400" />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={selectedRole === 'STUDENT' ? 'student@school.edu' : selectedRole === 'TEACHER' ? 'teacher@school.edu' : 'admin@institute.edu'} className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-sky-100" />
                  </div>
                </div>

                {step === 'otp' && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>One-time code</span>
                      <span>{remaining > 0 ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : 'Expired'}</span>
                    </div>
                    <div className="relative">
                      <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400" />
                      <input required inputMode="numeric" maxLength={6} value={otp} onChange={(ev) => setOtp(ev.target.value.replace(/\D/g, ''))} className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-center text-2xl font-extrabold tracking-[0.35em] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100" placeholder="123456" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">OTP sent to {email}. It expires in 5 minutes.</p>
                  </div>
                )}

                <button type="submit" disabled={loading || tenantLoading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500 px-5 py-4 text-sm font-extrabold text-white shadow-xl transition hover:scale-[1.01] disabled:opacity-60">
                  {loading ? 'Processing...' : step === 'email' ? 'Send OTP' : 'Verify OTP'}
                  <ArrowRight className="h-5 w-5" />
                </button>

                {step === 'otp' && (
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={handleResendOtp} disabled={remaining > 0 || loading} className="text-blue-600 font-bold disabled:opacity-50">Resend OTP</button>
                    <button type="button" onClick={() => { setStep('email'); setOtp(''); setRemaining(0); }} className="text-gray-500">Change email</button>
                  </div>
                )}
              </form>

              <div className="mt-6 flex items-center justify-between gap-4">
                <Link to="/super-admin/login" className="text-sm font-bold text-gray-700">Go to Super Admin Login</Link>
                {tenantMode && <a href={`${getBaseAppUrl()}/login`} className="text-sm text-gray-500">Switch Workspace</a>}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2">Secure</span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2">Resend Protected</span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2">JWT Enabled</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
