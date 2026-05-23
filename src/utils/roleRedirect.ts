export type AppRole = 'SUPER_ADMIN' | 'INSTITUTE_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

/** Home route after login — by role */
export function getHomePathForRole(role?: string | null): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/super-admin/dashboard';
    case 'INSTITUTE_ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'STUDENT':
    case 'PARENT':
      return '/login';
    default:
      return '/login';
  }
}
