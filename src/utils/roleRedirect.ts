export type AppRole = 'SUPER_ADMIN' | 'INSTITUTE_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

/** Home route after login — by role */
export function getHomePathForRole(role?: string | null): string {
  switch (role) {
    case 'SUPER_ADMIN':
<<<<<<< HEAD
      return '/super-admin/dashboard';
=======
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
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
