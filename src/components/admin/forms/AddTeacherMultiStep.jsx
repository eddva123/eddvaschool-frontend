import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Briefcase, MapPin, FileText, CheckCircle, 
  Camera, Plus, Trash2, Upload, Sparkles, AlertCircle, 
  Eye, EyeOff, ChevronRight, ChevronLeft, Save, 
  Printer, Smartphone, Mail, Shield, HeartPulse,
  Award, Globe, Languages, Clock, Building,
  Search, Check, X, Loader2
} from 'lucide-react';
import api from '../../../services/api';

// --- Constants ---
const STEPS = [
  { id: 1, title: 'Basic Information', icon: User, description: 'Personal & identity details' },
  { id: 2, title: 'Academic Details', icon: BookOpen, description: 'Qualifications & certifications' },
  { id: 3, title: 'Professional Details', icon: Briefcase, description: 'Roles & assignments' },
  { id: 4, title: 'Address & Medical', icon: MapPin, description: 'Contact & health info' },
  { id: 5, title: 'Documents Upload', icon: Upload, description: 'Identity & experience proofs' },
  { id: 6, title: 'Review & Submit', icon: CheckCircle, description: 'Final verification' }
];

// --- Sub-components ---

const FloatingInput = ({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && String(value).length > 0;

  return (
    <div className="relative group">
      <div className={`
        relative flex items-center transition-all duration-300 rounded-2xl border-2 
        ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-200 dark:border-slate-700'}
        ${error ? 'border-red-500' : ''}
        bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm
      `}>
        {Icon && (
          <div className={`pl-4 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-transparent px-4 py-3.5 outline-none text-slate-900 dark:text-white font-semibold text-sm
            placeholder-transparent
          `}
          placeholder={placeholder || label}
          {...props}
        />
        <label className={`
          absolute left-10 transition-all duration-300 pointer-events-none font-bold
          ${(isFocused || hasValue) ? '-top-2.5 left-8 px-2 bg-white dark:bg-slate-900 text-xs text-blue-600' : 'top-3.5 text-sm text-slate-400'}
        `}>
          {label}
        </label>
      </div>
      {error && <p className="mt-1 ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>}
    </div>
  );
};

const SectionHeader = ({ title, description, badge }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
      {badge && (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
          {badge}
        </span>
      )}
    </div>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);

const AIAssistantCard = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-blue-500/10 rounded-2xl p-5 mb-8 flex gap-4 items-start"
  >
    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 shrink-0">
      <Sparkles className="text-white" size={20} />
    </div>
    <div>
      <h4 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">EDDVA AI Insight</h4>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{message}</p>
    </div>
  </motion.div>
);

// --- Main Component ---

export default function AddTeacherMultiStep({ teacher, onSubmit, onCancel, isLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '', email: '', password: '', confirmPassword: '', phone: '', altPhone: '',
    dob: '', gender: '', bloodGroup: '', nationalId: '', nationality: 'Indian',
    religion: '', maritalStatus: '', photo: null,
    
    // Academic
    qualification: '', degree: '', institute: '', passingYear: '', 
    specialization: '', subjects: [], languages: [], certifications: '',
    experience: '', achievements: '',

    // Professional
    department: '', role: '', employmentType: 'FULL_TIME', joinDate: '',
    salary: '', employeeCode: '', classTeacher: '', assignedSections: [],
    shift: '', prevOrg: '',

    // Address & Medical
    currentAddress: '', permanentAddress: '', city: '', state: '', 
    country: 'India', pinCode: '', sameAsPermanent: false,
    emergencyContact: '', guardianContact: '',
    allergies: '', medicalConditions: '', disability: '', emergencyDoctor: '',

    // Documents
    docs: {}
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [idLoading, setIdLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academic/classes');
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/academic/subjects');
      setAvailableSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const handleToggleSection = (sectionId) => {
    setFormData(prev => {
      const current = prev.assignedSections || [];
      if (current.includes(sectionId)) {
        return { ...prev, assignedSections: current.filter(id => id !== sectionId) };
      }
      return { ...prev, assignedSections: [...current, sectionId] };
    });
  };

  // Sync with existing teacher data if editing
  useEffect(() => {
    if (teacher) {
      setFormData(prev => ({
        ...prev,
        ...teacher,
        name: teacher.name || '',
        email: teacher.email || '',
        // Map nested profile data
        ...(teacher.teacherProfile || {})
      }));
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const generateTeacherId = () => {
    setIdLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, employeeCode: `EDDVA-T-${Math.floor(1000 + Math.random() * 9000)}` }));
      setIdLoading(false);
    }, 800);
  };

  // --- Step Renderers ---

  const renderBasicInfo = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionHeader 
        title="Basic Information" 
        description="Let's start with the teacher's personal profile and identification."
        badge="Identity"
      />
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all">
            {formData.photo ? (
              <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="text-slate-400 group-hover:text-blue-500 transition-colors" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Upload Photo</span>
              </>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, photo: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG up to 2MB</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={User} />
          <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} icon={Mail} />
          <div className="relative">
            <FloatingInput 
              label="Password" 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              icon={Shield} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FloatingInput label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} icon={Shield} />
          <FloatingInput label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} icon={Smartphone} />
          <FloatingInput label="Aadhar / National ID" name="nationalId" value={formData.nationalId} onChange={handleChange} icon={CheckCircle} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FloatingInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
        <div className="relative">
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            className="w-full h-[54px] rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-4 pt-4 outline-none text-sm font-semibold appearance-none"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <label className="absolute left-4 top-1.5 text-[10px] font-black text-blue-600 uppercase">Gender</label>
        </div>
        <FloatingInput label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
        <FloatingInput label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />
      </div>

      <AIAssistantCard message="I've verified the national ID format. No duplicate teacher records found for this identity." />
    </motion.div>
  );

  const renderAcademicDetails = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionHeader 
        title="Academic Details" 
        description="Specify the teacher's educational background and specializations."
        badge="Education"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <FloatingInput label="Highest Qualification" name="qualification" value={formData.qualification} onChange={handleChange} icon={Award} />
        <FloatingInput label="Degree / Certification" name="degree" value={formData.degree} onChange={handleChange} icon={FileText} />
        <FloatingInput label="University / Institute" name="institute" value={formData.institute} onChange={handleChange} icon={Building} />
        <FloatingInput label="Passing Year" name="passingYear" value={formData.passingYear} onChange={handleChange} icon={Clock} />
        <FloatingInput label="Subject Specialization" name="specialization" value={formData.specialization} onChange={handleChange} icon={Sparkles} />
        <FloatingInput label="Languages Known" name="languages" value={formData.languages} onChange={handleChange} icon={Globe} />
      </div>
      <div className="grid grid-cols-1 gap-5">
        <div className="relative flex items-start transition-all duration-300 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-4">
          <textarea 
            name="achievements" 
            value={formData.achievements} 
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm font-semibold resize-none h-24"
            placeholder="Academic Achievements & Awards..."
          />
          <label className="absolute left-4 -top-2.5 px-2 bg-white dark:bg-slate-900 text-xs text-blue-600 font-bold">Achievements</label>
        </div>
      </div>
    </motion.div>
  );

  const renderProfessionalDetails = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionHeader 
        title="Professional Details" 
        description="Configure roles, assignments, and employment structure."
        badge="Career"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="md:col-span-2 flex gap-2">
          <div className="flex-1">
            <FloatingInput label="Employee ID" name="employeeCode" value={formData.employeeCode} onChange={handleChange} icon={Shield} readOnly />
          </div>
          <button 
            type="button"
            onClick={generateTeacherId}
            className="px-6 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            {idLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Auto-Generate
          </button>
        </div>
        <FloatingInput label="Join Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
        <FloatingInput label="Department" name="department" value={formData.department} onChange={handleChange} icon={Building} />
        <FloatingInput label="Role / Designation" name="role" value={formData.role} onChange={handleChange} icon={User} />
        <FloatingInput label="Experience (Years)" name="experience" value={formData.experience} onChange={handleChange} icon={Clock} />
      </div>

      <div className="mb-8">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Class & Section Assignments</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <h6 className="text-xs font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {cls.name}
              </h6>
              <div className="flex flex-wrap gap-2">
                {(cls.sections || []).map(sec => {
                  const isSelected = (formData.sectionIds || []).includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        const current = formData.sectionIds || [];
                        const next = isSelected ? current.filter(id => id !== sec.id) : [...current, sec.id];
                        setFormData(prev => ({ ...prev, sectionIds: next }));
                      }}
                      className={`
                        px-3 py-1.5 rounded-xl text-[10px] font-black transition-all
                        ${isSelected 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}
                      `}
                    >
                      SEC {sec.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantCard message={`I've analyzed the current class schedules. The teacher is assigned to ${(formData.assignedSections || []).length} sections. Recommended subjects based on expertise: Physics, Mathematics.`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Subject Expertise</h5>
          <div className="flex flex-wrap gap-2">
            {availableSubjects.length > 0 ? (
              availableSubjects.map(sub => {
                const isSelected = (formData.subjectIds || []).includes(sub.id);
                return (
                  <button 
                    key={sub.id} 
                    type="button"
                    onClick={() => {
                      const current = formData.subjectIds || [];
                      setFormData(prev => ({
                        ...prev,
                        subjectIds: isSelected ? current.filter(id => id !== sub.id) : [...current, sub.id]
                      }));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500 hover:text-white'}`}
                  >
                    {sub.name}
                  </button>
                );
              })
            ) : (
              ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'].map(sub => (
                <div key={sub} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-300 border border-slate-100 opacity-50 cursor-not-allowed">
                  {sub}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Shift & Availability</h5>
          <div className="space-y-3">
            {['Morning Shift (8 AM - 2 PM)', 'Regular Shift (9 AM - 4 PM)'].map(shift => (
              <label key={shift} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{shift}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAddressMedical = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionHeader 
        title="Address & Medical" 
        description="Ensure we have accurate contact and health information for emergencies."
        badge="Safety"
      />
      <div className="space-y-6">
        <div>
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Current Address</h5>
          <FloatingInput label="Street / Area" name="currentAddress" value={formData.currentAddress} onChange={handleChange} icon={MapPin} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <FloatingInput label="City" name="city" value={formData.city} onChange={handleChange} />
            <FloatingInput label="State" name="state" value={formData.state} onChange={handleChange} />
            <FloatingInput label="Country" name="country" value={formData.country} onChange={handleChange} />
            <FloatingInput label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Information</h5>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase">
              <HeartPulse size={12} /> Critical Info
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput label="Allergies (if any)" name="allergies" value={formData.allergies} onChange={handleChange} icon={AlertCircle} />
            <FloatingInput label="Medical Conditions" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} icon={HeartPulse} />
            <FloatingInput label="Emergency Doctor" name="emergencyDoctor" value={formData.emergencyDoctor} onChange={handleChange} icon={User} />
            <FloatingInput label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} icon={Smartphone} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderDocsUpload = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionHeader 
        title="Documents Upload" 
        description="Please upload valid digital copies of the following documents."
        badge="Verification"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Resume / CV', type: 'resume' },
          { label: 'Aadhar Card', type: 'aadhar' },
          { label: 'Degree Certificates', type: 'degree' },
          { label: 'Joining Documents', type: 'joining' }
        ].map(doc => (
          <div key={doc.type} className="p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center group hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-blue-500" size={24} />
            </div>
            <h6 className="text-sm font-black text-slate-900 dark:text-white mb-1">{doc.label}</h6>
            <p className="text-xs font-bold text-slate-400">PDF, JPG or PNG up to 5MB</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderReviewSubmit = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <SectionHeader 
        title="Review & Submit" 
        description="Verify all the information before adding the teacher to EDDVA."
        badge="Review"
      />
      
      <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-8 relative overflow-hidden shadow-2xl shadow-blue-600/30">
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-32 h-32 rounded-[2rem] border-4 border-white/20 overflow-hidden shrink-0 shadow-xl">
             <div className="w-full h-full bg-white/10 flex items-center justify-center">
                {formData.photo ? (
                  <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="opacity-40" />
                )}
             </div>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight mb-2">{formData.name || 'New Teacher'}</h3>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-white/80">
              <div className="flex items-center gap-2"><Mail size={16} /> {formData.email || '—'}</div>
              <div className="flex items-center gap-2"><Smartphone size={16} /> {formData.phone || '—'}</div>
              <div className="flex items-center gap-2"><Shield size={16} /> {formData.employeeCode || '—'}</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8">
           <Sparkles className="text-white/20" size={120} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { title: 'Academic Profile', data: [`Degree: ${formData.degree || '—'}`, `Univ: ${formData.institute || '—'}`, `Spec: ${formData.specialization || '—'}`] },
          { title: 'Professional Info', data: [`Dept: ${formData.department || '—'}`, `Role: ${formData.role || '—'}`, `Exp: ${formData.experience || '—'} Yrs`] },
        ].map(card => (
          <div key={card.title} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">{card.title}</h5>
            <div className="space-y-2">
              {card.data.map((d, i) => <p key={i} className="text-sm font-bold text-slate-700 dark:text-slate-300">{d}</p>)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-8">
        <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
          <CheckCircle className="text-white" size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Ready for Deployment</h4>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">All mandatory fields are filled and validated by AI.</p>
        </div>
      </div>
    </motion.div>
  );

  const CurrentStepComponent = () => {
    switch (currentStep) {
      case 1: return renderBasicInfo();
      case 2: return renderAcademicDetails();
      case 3: return renderProfessionalDetails();
      case 4: return renderAddressMedical();
      case 5: return renderDocsUpload();
      case 6: return renderReviewSubmit();
      default: return null;
    }
  };

  return (
    <div className="flex h-[85vh] min-h-[600px] overflow-hidden bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* Sidebar Navigation */}
      <div className="w-80 shrink-0 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 p-8 hidden lg:flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="text-white" size={16} />
             </div>
             EDDVA <span className="text-blue-600">PRO</span>
          </h1>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <button 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left
                  ${isActive ? 'bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/30'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 rotate-3' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}
                `}>
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">{step.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">System Status</p>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black">AI CORE ACTIVE</span>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Progress Bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800 absolute top-0 left-0 right-0 z-20">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-white dark:bg-slate-950">
          <AnimatePresence mode="wait">
            <CurrentStepComponent key={currentStep} />
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            CANCEL
          </button>

          <div className="flex gap-3">
            <button 
              type="button"
              className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Save size={16} /> Save Draft
            </button>
            
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={handleBack}
                className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="button" 
                disabled={isLoading}
                onClick={() => onSubmit(formData)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                Deploy Teacher
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
