import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, GraduationCap, 
  Award, Flame, Trophy, Clock, Save, Edit3, ShieldAlert
} from 'lucide-react';
import { cn } from '../../components/admin/Skeleton';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    careOf: '',
    alternatePhoneNumber: '',
    address: '',
    postOffice: '',
    city: '',
    landmark: '',
    state: '',
    pinCode: '',
    targetCollege: '',
    dailyStudyHours: 4,
    examTarget: '',
    class: '',
    examYear: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/profile');
      const data = res.data?.data || res.data;
      setProfile(data);
      setForm({
        careOf: data.careOf || '',
        alternatePhoneNumber: data.alternatePhoneNumber || '',
        address: data.address || '',
        postOffice: data.postOffice || '',
        city: data.city || '',
        landmark: data.landmark || '',
        state: data.state || '',
        pinCode: data.pinCode || '',
        targetCollege: data.targetCollege || '',
        dailyStudyHours: data.dailyStudyHours || 4,
        examTarget: data.examTarget || '',
        class: data.class || '',
        examYear: data.examYear || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/students/profile', {
        ...form,
        dailyStudyHours: Number(form.dailyStudyHours),
      });
      const updatedData = res.data?.data || res.data;
      setProfile(updatedData);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-lg shadow-blue-500/30">
              {profile?.fullName?.charAt(0) || user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{profile?.fullName || user?.name}</h1>
              <p className="mt-1 text-slate-300 font-medium">{profile?.email || user?.email}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-200">
                  Class {profile?.class || 'N/A'}
                </span>
                <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                  Target: {profile?.examTarget || 'N/A'}
                </span>
                <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                  Year: {profile?.examYear || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest transition",
                editMode 
                  ? "bg-slate-700 text-white hover:bg-slate-600" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              )}
            >
              <Edit3 size={14} />
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-900/20">
            <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total XP</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile?.xpTotal || 0} XP</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-900/20">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile?.currentStreak || 0} Days</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Longest Streak</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile?.longestStreak || 0} Days</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-550 dark:bg-blue-900/20">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Target</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile?.dailyStudyHours || 4} Hours</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal & Academic Details */}
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <User className="text-blue-600" /> Academic & Personal
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Father's/Guardian Name (C/O)</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={form.careOf}
                  onChange={(e) => setForm({ ...form, careOf: e.target.value })}
                  placeholder="Guardian's Name"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Alternate Phone Number</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={form.alternatePhoneNumber}
                  onChange={(e) => setForm({ ...form, alternatePhoneNumber: e.target.value })}
                  placeholder="Alternate Contact No."
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target College</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.targetCollege}
                    onChange={(e) => setForm({ ...form, targetCollege: e.target.value })}
                    placeholder="IIT, AIIMS, etc."
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Study Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    disabled={!editMode}
                    value={form.dailyStudyHours}
                    onChange={(e) => setForm({ ...form, dailyStudyHours: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Class</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Exam</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.examTarget}
                    onChange={(e) => setForm({ ...form, examTarget: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Exam Year</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.examYear}
                    onChange={(e) => setForm({ ...form, examYear: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <MapPin className="text-emerald-500" /> Address Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Street Address</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Flat, House No., Building, Area"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Landmark</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    placeholder="Near school, temple, etc."
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Post Office</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.postOffice}
                    onChange={(e) => setForm({ ...form, postOffice: e.target.value })}
                    placeholder="Post Office name"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">City</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">State</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pin Code</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={form.pinCode}
                    onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
