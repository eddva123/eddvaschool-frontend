import React, { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/Layout';
import StudentLayout from '../components/student/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHomePathForRole } from '../utils/roleRedirect';
import { finishAuthRedirect, getPortalLoginPath } from '../utils/tenantRedirect';

// New placeholders
import PlaceholderPage from '../components/admin/PlaceholderPage';
import {
  BookOpen, ClipboardList, BookMarked, GraduationCap, FileText,
  Award, FileSpreadsheet, CreditCard, History, UserX,
  BellRing, MessageSquare, Mail, BrainCircuit, TrendingUp,
  LineChart, UserCog, ShieldCheck, Activity
} from 'lucide-react';

const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const StudentClasses = lazy(() => import('../pages/student/Classes'));
const StudentClassDetails = lazy(() => import('../pages/student/ClassDetails'));
const StudentTopicDetails = lazy(() => import('../pages/student/TopicDetails'));
const StudentAssignments = lazy(() => import('../pages/student/Assignments'));
const StudentAssessments = lazy(() => import('../pages/student/Assessments'));
const StudentTestEngine = lazy(() => import('../pages/student/TestEngine'));
const StudentSessionResult = lazy(() => import('../pages/student/SessionResult'));
const StudentAiAssistant = lazy(() => import('../pages/student/AiDoubtSolver'));
const StudentBattleArena = lazy(() => import('../pages/student/BattleArena'));
const StudentStudyPlanner = lazy(() => import('../pages/student/StudyPlanner'));
const StudentCalendar = lazy(() => import('../pages/student/Calendar'));
const StudentFeedback = lazy(() => import('../pages/student/Feedback'));
const StudentChat = lazy(() => import('../pages/student/Chat'));
const StudentProfile = lazy(() => import('../pages/student/Profile'));

// New ERP Pages
const StudentRecordedLectures = lazy(() => import('../pages/student/RecordedLectures'));
const StudentNotesLibrary = lazy(() => import('../pages/student/NotesLibrary'));
const StudentResources = lazy(() => import('../pages/student/Resources'));
const StudentAiTutor = lazy(() => import('../pages/student/AiTutor'));
const StudentAiNotesGenerator = lazy(() => import('../pages/student/AiNotesGenerator'));
const StudentAiPerformanceReview = lazy(() => import('../pages/student/AiPerformanceReview'));
const StudentAiQuiz = lazy(() => import('../pages/student/AiQuiz'));
const StudentTeacherQuiz = lazy(() => import('../pages/student/TeacherQuiz'));
const StudentPerformanceAnalytics = lazy(() => import('../pages/student/PerformanceAnalytics'));
const StudentAttendanceAnalytics = lazy(() => import('../pages/student/AttendanceAnalytics'));
const StudentExamReports = lazy(() => import('../pages/student/ExamReports'));
const StudentTimetable = lazy(() => import('../pages/student/Timetable'));
const StudentExamSchedule = lazy(() => import('../pages/student/ExamSchedule'));
const StudentDiscussionForum = lazy(() => import('../pages/student/DiscussionForum'));
const StudentAnnouncements = lazy(() => import('../pages/student/Announcements'));
const StudentSettings = lazy(() => import('../pages/student/Settings'));
const StudentNotifications = lazy(() => import('../pages/student/Notifications'));
const StudentSecurity = lazy(() => import('../pages/student/Security'));
const StudentAppearance = lazy(() => import('../pages/student/Appearance'));

const TeacherDashboard = lazy(() => import('../pages/teacher/Dashboard'));
const TopicManagement = lazy(() => import('../pages/teacher/TopicManagement'));
const ClassManagement = lazy(() => import('../pages/teacher/ClassManagement'));
const AttendanceSystem = lazy(() => import('../pages/teacher/AttendanceSystem'));
const AssignmentManagement = lazy(() => import('../pages/teacher/AssignmentManagement'));
const AssessmentSystem = lazy(() => import('../pages/teacher/AssessmentSystem'));
const AssessmentDetails = lazy(() => import('../pages/teacher/AssessmentDetails'));
const CreatorStudio = lazy(() => import('../pages/teacher/CreatorStudio'));
const Reports = lazy(() => import('../pages/teacher/Reports'));
const GrievanceHandling = lazy(() => import('../pages/teacher/GrievanceHandling'));
const ChatSystem = lazy(() => import('../pages/teacher/ChatSystem'));
const TeacherProfile = lazy(() => import('../pages/teacher/Profile'));
const TeacherNotifications = lazy(() => import('../pages/teacher/Notifications'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const SuperAdminLogin = lazy(() => import('../pages/auth/SuperAdminLogin'));
const Institutes = lazy(() => import('../pages/admin/Institutes'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminStudents = lazy(() => import('../pages/admin/Students'));
const AdminTeachers = lazy(() => import('../pages/admin/Teachers'));
const AdminStudentProfile = lazy(() => import('../pages/admin/StudentProfile'));
const AdminTeacherProfile = lazy(() => import('../pages/admin/TeacherProfile'));
const AdminAttendance = lazy(() => import('../pages/admin/Attendance'));
const AdminAcademics = lazy(() => import('../pages/admin/Academics'));
const AdminNotices = lazy(() => import('../pages/admin/Notices'));
const AdminFees = lazy(() => import('../pages/admin/Fees'));
const AdminCalendar = lazy(() => import('../pages/admin/AcademicCalendar'));
const AdminComplaints = lazy(() => import('../pages/admin/Complaints'));
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'));
const AdminTimetable = lazy(() => import('../pages/admin/Timetable'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminFinance = lazy(() => import('../pages/admin/Finance'));
const AdminCommunications = lazy(() => import('../pages/admin/Communications'));
const AdminRoles = lazy(() => import('../pages/admin/Roles'));
const AdminAuditLogs = lazy(() => import('../pages/admin/AuditLogs'));
const AdminSecurity = lazy(() => import('../pages/admin/SecurityCenter'));
const Subjects = lazy(() => import('../pages/admin/Subjects'));
const Assignments = lazy(() => import('../pages/admin/Assignments'));
const StudyMaterials = lazy(() => import('../pages/admin/StudyMaterials'));
const Syllabus = lazy(() => import('../pages/admin/Syllabus'));
const Exams = lazy(() => import('../pages/admin/Exams'));
const QuestionBank = lazy(() => import('../pages/admin/QuestionBank'));
const MarksEntry = lazy(() => import('../pages/admin/MarksEntry'));
const Results = lazy(() => import('../pages/admin/Results'));
const ReportCards = lazy(() => import('../pages/admin/ReportCards'));
const FeeStructures = lazy(() => import('../pages/admin/FeeStructures'));
const PaymentCollection = lazy(() => import('../pages/admin/PaymentCollection'));
const PaymentHistory = lazy(() => import('../pages/admin/PaymentHistory'));
const FeeDefaulters = lazy(() => import('../pages/admin/FeeDefaulters'));
const NotificationsCenter = lazy(() => import('../pages/admin/NotificationsCenter'));
const MessageLogs = lazy(() => import('../pages/admin/MessageLogs'));
const EmailCenter = lazy(() => import('../pages/admin/EmailCenter'));
const AiInsights = lazy(() => import('../pages/admin/AiInsights'));
const StudentPerformance = lazy(() => import('../pages/admin/StudentPerformance'));
const AttendanceAnalytics = lazy(() => import('../pages/admin/AttendanceAnalytics'));
const CustomReports = lazy(() => import('../pages/admin/CustomReports'));
const Login = lazy(() => import('../pages/auth/AdminLogin'));
const Register = lazy(() => import('../pages/teacher/Register'));
const AuthComplete = lazy(() => import('../pages/auth/AuthComplete'));

const PageLoader: React.FC = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <LoadingSpinner size="lg" />
  </div>
);

function RoleBasedHome() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to={getPortalLoginPath()} replace />;
  return <Navigate to={getHomePathForRole(user.role)} replace />;
}

function FallbackRedirect() {
  return <Navigate to={getPortalLoginPath()} replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, institute, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      finishAuthRedirect(
        institute?.tenantDomain || localStorage.getItem('tenantDomain'),
        navigate,
        user.role
      );
    }
  }, [institute?.tenantDomain, loading, navigate, user]);

  if (loading) return <PageLoader />;
  if (user) return <PageLoader />;
  return <>{children}</>;
}

const SuperAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) return <Navigate to={getPortalLoginPath()} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/super-admin/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <SuperAdminLogin />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/auth/complete',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthComplete />
      </Suspense>
    ),
  },
  {
    path: '/assessments/:id',
    element: <Navigate to="/teacher/assessments/:id" replace />,
  },
  {
    path: '/',
    element: <RoleBasedHome />,
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute roles={['TEACHER']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><TeacherDashboard /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><TeacherProfile /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<PageLoader />}><TeacherNotifications /></Suspense> },
      { path: 'topics', element: <Suspense fallback={<PageLoader />}><TopicManagement /></Suspense> },
      { path: 'classes', element: <Suspense fallback={<PageLoader />}><ClassManagement /></Suspense> },
      { path: 'attendance', element: <Suspense fallback={<PageLoader />}><AttendanceSystem /></Suspense> },
      { path: 'assignments', element: <Suspense fallback={<PageLoader />}><AssignmentManagement /></Suspense> },
      { path: 'assessments', element: <Suspense fallback={<PageLoader />}><AssessmentSystem /></Suspense> },
      { path: 'assessments/:id', element: <Suspense fallback={<PageLoader />}><AssessmentDetails /></Suspense> },
      { path: 'creator', element: <Suspense fallback={<PageLoader />}><CreatorStudio /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<PageLoader />}><Reports /></Suspense> },
      { path: 'grievances', element: <Suspense fallback={<PageLoader />}><GrievanceHandling /></Suspense> },
      { path: 'chat', element: <Suspense fallback={<PageLoader />}><ChatSystem /></Suspense> },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute roles={['STUDENT']}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><StudentDashboard /></Suspense> },
      { path: 'classes', element: <Suspense fallback={<PageLoader />}><StudentClasses /></Suspense> },
      { path: 'classes/:id', element: <Suspense fallback={<PageLoader />}><StudentClassDetails /></Suspense> },
      { path: 'classes/:batchId/topics/:topicId', element: <Suspense fallback={<PageLoader />}><StudentTopicDetails /></Suspense> },
      { path: 'recorded-lectures', element: <Suspense fallback={<PageLoader />}><StudentRecordedLectures /></Suspense> },
      { path: 'notes-library', element: <Suspense fallback={<PageLoader />}><StudentNotesLibrary /></Suspense> },
      { path: 'assignments', element: <Suspense fallback={<PageLoader />}><StudentAssignments /></Suspense> },
      { path: 'assessments', element: <Suspense fallback={<PageLoader />}><StudentAssessments /></Suspense> },
      { path: 'assessments/:id/take', element: <Suspense fallback={<PageLoader />}><StudentTestEngine /></Suspense> },
      { path: 'assessments/:id', element: <Suspense fallback={<PageLoader />}><StudentSessionResult /></Suspense> },
      { path: 'resources', element: <Suspense fallback={<PageLoader />}><StudentResources /></Suspense> },
      { path: 'ai-tutor', element: <Suspense fallback={<PageLoader />}><StudentAiTutor /></Suspense> },
      { path: 'ai-doubt-solver', element: <Suspense fallback={<PageLoader />}><StudentAiAssistant /></Suspense> },
      { path: 'ai-assistant', element: <Navigate to="/student/ai-doubt-solver" replace /> },
      { path: 'planner', element: <Suspense fallback={<PageLoader />}><StudentStudyPlanner /></Suspense> },
      { path: 'ai-notes', element: <Suspense fallback={<PageLoader />}><StudentAiNotesGenerator /></Suspense> },
      { path: 'ai-performance-review', element: <Suspense fallback={<PageLoader />}><StudentAiPerformanceReview /></Suspense> },
      { path: 'ai-quiz', element: <Suspense fallback={<PageLoader />}><StudentAiQuiz /></Suspense> },
      { path: 'teacher-quiz', element: <Suspense fallback={<PageLoader />}><StudentTeacherQuiz /></Suspense> },
      { path: 'battle-arena', element: <Suspense fallback={<PageLoader />}><StudentBattleArena /></Suspense> },
      { path: 'performance-analytics', element: <Suspense fallback={<PageLoader />}><StudentPerformanceAnalytics /></Suspense> },
      { path: 'attendance-analytics', element: <Suspense fallback={<PageLoader />}><StudentAttendanceAnalytics /></Suspense> },
      { path: 'exam-reports', element: <Suspense fallback={<PageLoader />}><StudentExamReports /></Suspense> },
      { path: 'calendar', element: <Suspense fallback={<PageLoader />}><StudentCalendar /></Suspense> },
      { path: 'timetable', element: <Suspense fallback={<PageLoader />}><StudentTimetable /></Suspense> },
      { path: 'exam-schedule', element: <Suspense fallback={<PageLoader />}><StudentExamSchedule /></Suspense> },
      { path: 'chat', element: <Suspense fallback={<PageLoader />}><StudentChat /></Suspense> },
      { path: 'forum', element: <Suspense fallback={<PageLoader />}><StudentDiscussionForum /></Suspense> },
      { path: 'announcements', element: <Suspense fallback={<PageLoader />}><StudentAnnouncements /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><StudentProfile /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><StudentSettings /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<PageLoader />}><StudentNotifications /></Suspense> },
      { path: 'security', element: <Suspense fallback={<PageLoader />}><StudentSecurity /></Suspense> },
      { path: 'appearance', element: <Suspense fallback={<PageLoader />}><StudentAppearance /></Suspense> },
      { path: 'analytics', element: <Navigate to="/student/performance-analytics" replace /> },
      { path: 'feedback', element: <Suspense fallback={<PageLoader />}><StudentFeedback /></Suspense> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['SUPER_ADMIN', 'INSTITUTE_ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
      {
        path: 'institutes',
        element: (
          <SuperAdminOnly>
            <Suspense fallback={<PageLoader />}>
              <Institutes />
            </Suspense>
          </SuperAdminOnly>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminUsers />
          </Suspense>
        ),
      },
      { path: 'students', element: <Suspense fallback={<PageLoader />}><AdminStudents /></Suspense> },
      { path: 'students/:id', element: <Suspense fallback={<PageLoader />}><AdminStudentProfile /></Suspense> },
      { path: 'teachers', element: <Suspense fallback={<PageLoader />}><AdminTeachers /></Suspense> },
      { path: 'teachers/:id', element: <Suspense fallback={<PageLoader />}><AdminTeacherProfile /></Suspense> },
      { path: 'attendance', element: <Suspense fallback={<PageLoader />}><AdminAttendance /></Suspense> },
      { path: 'academics', element: <Suspense fallback={<PageLoader />}><AdminAcademics /></Suspense> },
      { path: 'notices', element: <Suspense fallback={<PageLoader />}><AdminNotices /></Suspense> },
      { path: 'fees', element: <Suspense fallback={<PageLoader />}><AdminFees /></Suspense> },
      { path: 'calendar', element: <Suspense fallback={<PageLoader />}><AdminCalendar /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<PageLoader />}><AdminComplaints /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense> },
      { path: 'timetable', element: <Suspense fallback={<PageLoader />}><AdminTimetable /></Suspense> },
      { path: 'roles', element: <Suspense fallback={<PageLoader />}><AdminRoles /></Suspense> },
      { path: 'audit-logs', element: <Suspense fallback={<PageLoader />}><AdminAuditLogs /></Suspense> },
      { path: 'security', element: <Suspense fallback={<PageLoader />}><AdminSecurity /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><AdminSettings /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<PageLoader />}><AdminReports /></Suspense> },
      { path: 'finance', element: <Suspense fallback={<PageLoader />}><AdminFinance /></Suspense> },
      { path: 'communications', element: <Suspense fallback={<PageLoader />}><AdminCommunications /></Suspense> },

      // New Academic Routes
      { path: 'subjects', element: <Suspense fallback={<PageLoader />}><Subjects /></Suspense> },
      { path: 'assignments', element: <Suspense fallback={<PageLoader />}><Assignments /></Suspense> },
      { path: 'study-materials', element: <Suspense fallback={<PageLoader />}><StudyMaterials /></Suspense> },
      { path: 'syllabus', element: <Suspense fallback={<PageLoader />}><Syllabus /></Suspense> },

      // New Examinations Routes
      { path: 'exams', element: <Suspense fallback={<PageLoader />}><Exams /></Suspense> },
      { path: 'question-bank', element: <Suspense fallback={<PageLoader />}><QuestionBank /></Suspense> },
      { path: 'marks-entry', element: <Suspense fallback={<PageLoader />}><MarksEntry /></Suspense> },
      { path: 'results', element: <Suspense fallback={<PageLoader />}><Results /></Suspense> },
      { path: 'report-cards', element: <Suspense fallback={<PageLoader />}><ReportCards /></Suspense> },

      // New Finance Routes
      { path: 'fee-structures', element: <Suspense fallback={<PageLoader />}><FeeStructures /></Suspense> },
      { path: 'payment-collection', element: <Suspense fallback={<PageLoader />}><PaymentCollection /></Suspense> },
      { path: 'payment-history', element: <Suspense fallback={<PageLoader />}><PaymentHistory /></Suspense> },
      { path: 'fee-defaulters', element: <Suspense fallback={<PageLoader />}><FeeDefaulters /></Suspense> },

      // New Communication Routes
      { path: 'notifications-center', element: <Suspense fallback={<PageLoader />}><NotificationsCenter /></Suspense> },
      { path: 'message-logs', element: <Suspense fallback={<PageLoader />}><MessageLogs /></Suspense> },
      { path: 'email-center', element: <Suspense fallback={<PageLoader />}><EmailCenter /></Suspense> },
      {
        path: 'sms-center',
        element: (
          <PlaceholderPage
            title="SMS Center"
            description="Manage and broadcast SMS alerts to students, teachers, and parents."
            icon={MessageSquare}
          />
        ),
      },

      // New AI & Analytics Routes
      { path: 'ai-insights', element: <Suspense fallback={<PageLoader />}><AiInsights /></Suspense> },
      { path: 'student-performance', element: <Suspense fallback={<PageLoader />}><StudentPerformance /></Suspense> },
      { path: 'attendance-analytics', element: <Suspense fallback={<PageLoader />}><AttendanceAnalytics /></Suspense> },
      { path: 'custom-reports', element: <Suspense fallback={<PageLoader />}><CustomReports /></Suspense> },
    ],
  },
  {
    path: '/super-admin/dashboard',
    element: (
      <ProtectedRoute roles={['SUPER_ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <FallbackRedirect />,
  },
]);

const AppRoutes: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default AppRoutes;
