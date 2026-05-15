import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ImagePlus,
  Lock,
  Mail,
  MapPin,
  Phone,
  UploadCloud,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { EddvaLogo, InstituteLogo } from '../../components/admin/Brand';
import { formatTenantUrl } from '../../utils/tenantRedirect';

const steps = [
  { id: 1, title: 'Institute' },
  { id: 2, title: 'Admin' },
  { id: 3, title: 'Location' },
  { id: 4, title: 'Logo' },
];

const inputClass =
  'w-full rounded-lg border border-surface-200 bg-surface-50 px-4 py-3 text-surface-950 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100';
const iconInputClass = `${inputClass} pl-10`;

function readLogoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (!file.type.startsWith('image/')) return reject(new Error('Please upload an image file.'));
    if (file.size > 2 * 1024 * 1024) return reject(new Error('Logo must be smaller than 2MB.'));

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Logo could not be read.'));
    reader.readAsDataURL(file);
  });
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    instituteName: '',
    principalName: '',
    registrationNo: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    plotNo: '',
    streetName: '',
    landMark: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    logo: '',
  });

  const logoInstitute = useMemo(() => ({ name: formData.instituteName || 'Institute', logo: formData.logo }), [formData.instituteName, formData.logo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError('');
    if (currentStep === 2 && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLogo = async (event) => {
    try {
      const logo = await readLogoFile(event.target.files?.[0]);
      setFormData((prev) => ({ ...prev, logo: logo || '' }));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const tenantUrl = formatTenantUrl(success.tenantDomain);
    return (
      <div className="grid min-h-screen place-items-center bg-panel-gradient p-5">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-lg border border-surface-200 bg-white p-8 text-center shadow-glass">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-surface-950">Registration Submitted</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-surface-600">
            {success.institute?.name} is now pending Super Admin approval. The tenant workspace has already been reserved.
          </p>
          <div className="mt-6 rounded-lg border border-brand-100 bg-brand-50 p-4 text-left">
            <p className="text-xs font-bold uppercase text-brand-700">Tenant Domain</p>
            <p className="mt-1 break-all font-mono text-sm font-bold text-surface-950">{success.tenantDomain}</p>
            {tenantUrl && (
              <a href={tenantUrl} className="mt-3 inline-flex text-sm font-bold text-brand-700 hover:text-brand-800">
                Open reserved workspace
              </a>
            )}
          </div>
          <Link to="/login" className="mt-6 inline-flex items-center justify-center rounded-lg bg-eddva-gradient px-5 py-3 font-bold text-white shadow-blue">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-white xl:grid-cols-[0.82fr_1.18fr]">
      <section className="hidden bg-eddva-gradient p-10 text-white xl:flex xl:flex-col xl:justify-between">
        <EddvaLogo className="[&_*]:text-white" />
        <div className="max-w-md">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">Tenant onboarding</p>
          <h1 className="font-display text-5xl font-extrabold leading-tight">Register once, receive a dedicated subdomain.</h1>
          <p className="mt-5 text-base font-medium leading-7 text-sky-100">
            Self-registered institutes stay pending until the Super Admin approves them from the internal console.
          </p>
        </div>
      </section>

      <main className="flex items-center justify-center bg-panel-gradient p-5 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="mb-8 xl:hidden">
            <EddvaLogo />
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-surface-200 bg-white p-5 shadow-glass sm:p-8">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-surface-950">Register Institute</h2>
                <p className="mt-2 text-sm font-medium text-surface-500">Complete the institute profile, admin login, address, and logo.</p>
              </div>
              <Link className="text-sm font-bold text-brand-700 hover:text-brand-800" to="/login">
                Already registered?
              </Link>
            </div>

            <div className="mb-8 grid grid-cols-4 gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    currentStep === step.id ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-surface-200 bg-white text-surface-500 hover:bg-surface-50'
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">Step {step.id}</span>
                  <span className="mt-1 block truncate text-sm font-bold">{step.title}</span>
                </button>
              ))}
            </div>

            {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-surface-700">Institute Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                      <input required type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} className={iconInputClass} placeholder="Delhi Public School" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Principal Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                        <input required type="text" name="principalName" value={formData.principalName} onChange={handleChange} className={iconInputClass} placeholder="Anika Rao" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Registration No.</label>
                      <input required type="text" name="registrationNo" value={formData.registrationNo} onChange={handleChange} className={inputClass} placeholder="REG-2026-001" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className={iconInputClass} placeholder="admin@school.edu" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Phone No.</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={iconInputClass} placeholder="+91 98765 43210" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className={iconInputClass} placeholder="Password" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-surface-700">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                        <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={iconInputClass} placeholder="Confirm password" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required type="text" name="plotNo" value={formData.plotNo} onChange={handleChange} className={inputClass} placeholder="Plot No." />
                    <input required type="text" name="streetName" value={formData.streetName} onChange={handleChange} className={inputClass} placeholder="Street Name" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                    <input type="text" name="landMark" value={formData.landMark} onChange={handleChange} className={iconInputClass} placeholder="Landmark" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="City" />
                    <input required type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} placeholder="District" />
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="State" />
                    <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputClass} placeholder="PIN Code" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <div className="rounded-lg border border-surface-200 bg-surface-50 p-6 text-center">
                    <InstituteLogo institute={logoInstitute} size="lg" className="mx-auto" />
                    <p className="mt-4 text-sm font-bold text-surface-950">{formData.instituteName || 'Institute Name'}</p>
                    <p className="mt-1 text-xs font-semibold text-surface-500">Logo preview</p>
                  </div>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-200 bg-brand-50/60 p-8 text-center transition hover:bg-brand-50">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    <UploadCloud className="mb-3 h-10 w-10 text-brand-600" />
                    <span className="text-base font-bold text-surface-950">Upload institute logo</span>
                    <span className="mt-2 text-sm font-medium text-surface-500">PNG, JPG, or WebP up to 2MB. It appears in the institute header and dashboard after login.</span>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
                      <ImagePlus className="h-4 w-4" />
                      Choose image
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-surface-200 pt-6">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-bold text-surface-600 hover:bg-surface-100">
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < steps.length ? (
                  <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 rounded-lg bg-eddva-gradient px-5 py-2.5 font-bold text-white shadow-blue">
                    Next
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-eddva-gradient px-5 py-2.5 font-bold text-white shadow-blue disabled:opacity-60">
                    {loading ? 'Submitting...' : 'Submit for Approval'}
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
