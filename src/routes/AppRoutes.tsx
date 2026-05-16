import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHomePathForRole } from '../utils/roleRedirect';
import { finishAuthRedirect } from '../utils/tenantRedirect';

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
const Institutes = lazy(() => import('../pages/admin/Institutes'));
const AdminStudents = lazy(() => import('../pages/admin/Students'));
const AdminTeachers = lazy(() => import('../pages/admin/Teachers'));
const AdminAttendance = lazy(() => import('../pages/admin/Attendance'));
const AdminAcademics = lazy(() => import('../pages/admin/Academics'));
const AdminNotices = lazy(() => import('../pages/admin/Notices'));
const AdminFees = lazy(() => import('../pages/admin/Fees'));
const AdminCalendar = lazy(() => import('../pages/admin/Calendar'));
const AdminComplaints = lazy(() => import('../pages/admin/Complaints'));
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'));
const AdminTimetable = lazy(() => import('../pages/admin/Timetable'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminFinance = lazy(() => import('../pages/admin/Finance'));
const AdminCommunications = lazy(() => import('../pages/admin/Communications'));

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
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getHomePathForRole(user.role)} replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, institute, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <PageLoader />;
  if (user) {
    finishAuthRedirect(
      institute?.tenantDomain || localStorage.getItem('tenantDomain'),
      navigate,
      user.role
    );
    return <PageLoader />;
  }
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

  if (!user) return <Navigate to="/login" replace />;

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
      { path: 'students', element: <Suspense fallback={<PageLoader />}><AdminStudents /></Suspense> },
      { path: 'teachers', element: <Suspense fallback={<PageLoader />}><AdminTeachers /></Suspense> },
      { path: 'attendance', element: <Suspense fallback={<PageLoader />}><AdminAttendance /></Suspense> },
      { path: 'academics', element: <Suspense fallback={<PageLoader />}><AdminAcademics /></Suspense> },
      { path: 'notices', element: <Suspense fallback={<PageLoader />}><AdminNotices /></Suspense> },
      { path: 'fees', element: <Suspense fallback={<PageLoader />}><AdminFees /></Suspense> },
      { path: 'calendar', element: <Suspense fallback={<PageLoader />}><AdminCalendar /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<PageLoader />}><AdminComplaints /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense> },
      { path: 'timetable', element: <Suspense fallback={<PageLoader />}><AdminTimetable /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><AdminSettings /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<PageLoader />}><AdminReports /></Suspense> },
      { path: 'finance', element: <Suspense fallback={<PageLoader />}><AdminFinance /></Suspense> },
      { path: 'communications', element: <Suspense fallback={<PageLoader />}><AdminCommunications /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

const AppRoutes: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default AppRoutes;
