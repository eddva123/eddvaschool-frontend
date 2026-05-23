import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
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

=======
import { ArrowRight, CheckCircle2, Globe, Lock, Mail, Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { EddvaLogo, InstituteLogo, StatusBadge } from '../../components/admin/Brand';
import { useAuth } from '../../context/AuthContext';
import { buildTenantAuthCompleteUrl, finishAuthRedirect, getBaseAppUrl, getPortalType, getTenantDomainFromHostname, isTenantHost } from '../../utils/tenantRedirect';

>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
export default function Login() {
  const navigate = useNavigate();
  const portalType = getPortalType();
  const tenantDomain = getTenantDomainFromHostname();
  const tenantMode = isTenantHost();
  const [tenantInstitute, setTenantInstitute] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(tenantMode);
<<<<<<< HEAD
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
=======
  const [selectedTab, setSelectedTab] = useState(() => {
    if (portalType === 'SUPER_ADMIN') return 'super_admin';
    if (portalType === 'STUDENT' || portalType === 'PARENT') return 'student';
    return 'institute';
  });
  const [email, setEmail] = useState(portalType === 'SUPER_ADMIN' ? 'admin@gmail.com' : '');
  const [password, setPassword] = useState(portalType === 'SUPER_ADMIN' ? 'admin123' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('eddva-theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('eddva-theme', theme);
  }, [theme]);

  const rolePillLabel = useMemo(() => {
    if (selectedTab === 'super_admin') return 'SUPER ADMIN';
    if (selectedTab === 'institute') return 'INSTITUTE';
    if (selectedTab === 'student') return 'STUDENT / PARENT';
    return 'SIGN IN';
  }, [selectedTab]);

  useEffect(() => {
    if (!tenantMode) return;

    let ignore = false;

    async function loadTenant() {
      try {
        const res = await api.get('/institutes/tenant/current');
        if (!ignore) setTenantInstitute(res.data);
      } catch {
        if (!ignore) setError('Tenant workspace was not found. Check the subdomain or contact the Super Admin.');
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
      } finally {
        if (!ignore) setTenantLoading(false);
      }
    }
<<<<<<< HEAD
    loadTenant();
    return () => { ignore = true; };
  }, [tenantMode]);

  const roleLabel = useMemo(() => (selectedRole === 'TEACHER' ? 'TEACHER OTP LOGIN' : 'INSTITUTE OTP LOGIN'), [selectedRole]);
  const headline = useMemo(() => {
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
=======

    loadTenant();
    return () => {
      ignore = true;
    };
  }, [tenantMode]);

  const headline = useMemo(() => {
    if (selectedTab === 'super_admin') return 'Super Admin Login';
    if (selectedTab === 'institute') {
      if (tenantMode) {
        return tenantInstitute?.name
          ? `${tenantInstitute.name} — Teacher & Staff Login`
          : 'Institute Staff Login';
      }
      return 'Institute Admin Login';
    }
    if (selectedTab === 'student') return 'Student / Parent Login';
    return 'Sign in';
  }, [tenantInstitute, tenantMode, selectedTab]);

  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      const { user, tenantDomain: nextTenantDomain, token, institute } = data;

      const allowedRolesByPortal = {
        SUPER_ADMIN: ['SUPER_ADMIN'],
        INSTITUTE: ['INSTITUTE_ADMIN', 'TEACHER'],
        STUDENT: ['STUDENT'],
        PARENT: ['PARENT'],
      };
      const allowedRoles = allowedRolesByPortal[portalType] || [];
      if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
        throw new Error('This account is not allowed in this portal. Use the correct login portal for your role.');
      }

      if (user?.role === 'INSTITUTE_ADMIN' && !tenantMode) {
        const handoffUrl = buildTenantAuthCompleteUrl(nextTenantDomain, {
          token,
          user,
          institute,
          tenantDomain: nextTenantDomain,
        });
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
        if (handoffUrl) {
          window.location.assign(handoffUrl);
          return;
        }
      }

<<<<<<< HEAD
      finishAuthRedirect(nextTenantDomain || tenantDomain, navigate, normalizedRole);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'OTP verification failed';
      setError(message);
      toast.error(message);
=======
      finishAuthRedirect(nextTenantDomain, navigate, user.role);
    } catch (err) {
      console.error('Login error full:', err);
      console.error('Error response:', err?.response);
      console.error('Error response data:', err?.response?.data);
      console.error('Error message property:', err?.response?.data?.message);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Login failed';
      console.error('Final error message:', errorMsg);
      setError(errorMsg);
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
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
                <div className="flex gap-3">
                  {[{ id: 'INSTITUTE_ADMIN', label: 'INSTITUTE LOGIN' }, { id: 'TEACHER', label: 'TEACHER LOGIN' }].map((item) => (
                    <button key={item.id} type="button" onClick={() => setSelectedRole(item.id)} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold tracking-wide transition ${selectedRole === item.id ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg' : 'bg-white border border-gray-200 text-slate-700'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400" />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={selectedRole === 'TEACHER' ? 'teacher@school.edu' : 'admin@institute.edu'} className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-sky-100" />
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
=======
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left marketing */} 
        <section className="relative hidden overflow-hidden bg-eddva-hero text-white lg:flex">
          <div className="pointer-events-none absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(1000px 500px at 20% 0%, rgba(255,255,255,0.20), transparent 55%), radial-gradient(800px 400px at 90% 10%, rgba(139,92,246,0.22), transparent 55%)' }} />
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2270%22%20height%3D%2270%22%20viewBox%3D%220%200%2070%2070%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M42%2040v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM42%206V2h-2v4h-4v2h4v4h2V8h4V6h-4zM8%2040v-4H6v4H2v2h4v4h2v-4h4v-2H8zM8%206V2H6v4H2v2h4v4h2V8h4V6H8z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-45" />
          <div className="relative flex h-full w-full flex-col justify-between p-10">
            <div className="flex items-center justify-between">
              <EddvaLogo className="[&_*]:text-white" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                AI-powered education platform
              </span>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="font-display text-5xl font-extrabold leading-tight">
                Transforming Education with AI‑Powered Learning & Smart Institute Management
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-sky-100">
                Empower educators, automate operations, and unlock realtime analytics with EDDVA’s next‑gen school OS.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
                  Trusted by 10,000+ institutes worldwide
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  AI insights · Realtime dashboards
                </div>
              </div>

              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-sky-100">Dashboard overview</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { t: 'Total Students', v: '12,842' },
                      { t: 'Attendance Rate', v: '95.8%' },
                      { t: 'Live Classes', v: '156' },
                      { t: 'Fees Collection', v: '₹3.45 Cr' },
                    ].map((x) => (
                      <div key={x.t} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                        <p className="text-[11px] font-bold text-sky-100/90">{x.t}</p>
                        <p className="mt-1 font-display text-2xl font-extrabold">{x.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-sky-100">AI Recommendation</p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-sky-50">
                    15 students need extra attention in Mathematics. Auto‑create study plan and notify guardians.
                  </p>
                  <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-sm font-extrabold text-blue-700">
                    View students
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-sky-100/90">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Secure login · 256‑bit encryption
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                End‑to‑end data protection
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                AI powered — smart & efficient
              </div>
            </div>
          </div>
        </section>

        {/* Right login card */} 
        <main className="relative flex items-center justify-center p-5 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_-10%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(700px_450px_at_90%_10%,rgba(139,92,246,0.12),transparent_55%)]" />

          <div className="relative w-full max-w-md">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <EddvaLogo />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  className="rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/85 p-2 text-slate-600 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/85 p-2 text-slate-600 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                  aria-label="Language"
                >
                  <Globe className="h-5 w-5" />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-premium rounded-3xl p-6 shadow-2xl sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {portalType === 'SUPER_ADMIN' && (
                    <span className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25">Super Admin</span>
                  )}
                  {portalType === 'INSTITUTE' && (
                    <span className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25">Institute</span>
                  )}
                  {(portalType === 'STUDENT' || portalType === 'PARENT') && (
                    <span className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25">Student / Parent</span>
                  )}
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    type="button"
                    onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    className="rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/85 p-2 text-slate-600 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/85 p-2 text-slate-600 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                    aria-label="Language"
                  >
                    <Globe className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-start gap-4">
                {tenantMode ? <InstituteLogo institute={tenantInstitute} size="lg" /> : <EddvaLogo compact />}
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {tenantMode && tenantInstitute?.status && <StatusBadge status={tenantInstitute.status} />}
                    {!tenantMode && (
                      <span className="inline-flex items-center rounded-full border border-[rgba(37,99,235,0.18)] bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-200">
                        {rolePillLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">Welcome Back!</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Sign in to access your institute dashboard.</p>
                </div>
              </div>

              {tenantMode && tenantInstitute?.status === 'PENDING' && (
                <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-semibold text-sky-800 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-200">
                  This institute is registered and waiting for Super Admin approval.
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-extrabold text-slate-700 dark:text-slate-200">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/90 py-3 pl-10 pr-4 text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"
                      placeholder={selectedTab === 'super_admin' ? 'admin@gmail.com' : selectedTab === 'institute' ? 'admin@institute.edu' : 'student@school.edu'}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-extrabold text-slate-700 dark:text-slate-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/90 py-3 pl-10 pr-4 text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" title="Reset your password" disabled={loading} className="text-sm font-extrabold text-blue-700 hover:text-blue-800 dark:text-sky-300">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  disabled={loading || tenantLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>



              <div className="mt-5 rounded-2xl border border-[rgba(37,99,235,0.12)] bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                {tenantMode ? (
                  <Link className="inline-flex w-full items-center justify-between font-extrabold text-blue-700 hover:text-blue-800 dark:text-sky-300" to="/register">
                    Register another institute
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <Link className="inline-flex w-full items-center justify-between font-extrabold text-blue-700 hover:text-blue-800 dark:text-sky-300" to="/register">
                    Register your institute
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                )}

                {tenantMode && (
                  <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 dark:text-slate-300" href={`${getBaseAppUrl()}/login`}>
                    <Sparkles className="h-4 w-4" />
                    Switch workspace login
                  </a>
                )}

                {!tenantMode && (
                  <Link 
                    to="/super-admin/login" 
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all"
                  >
                    <ShieldCheck size={14} /> System Administrator Access
                  </Link>
                )}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
                  Secure Login
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
                  End‑to‑End
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
                  AI Powered
                </div>
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
