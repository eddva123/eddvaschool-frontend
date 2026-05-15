export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function getStoredInstitute() {
  try {
    return JSON.parse(localStorage.getItem('institute') || 'null');
  } catch {
    return null;
  }
}

export function saveSession({ token, user, institute, tenantDomain }) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('institute', JSON.stringify(institute || null));

  if (tenantDomain) {
    localStorage.setItem('tenantDomain', tenantDomain);
  } else {
    localStorage.removeItem('tenantDomain');
  }
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('institute');
  localStorage.removeItem('tenantDomain');
}
