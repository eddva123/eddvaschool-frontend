import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSession } from '../../utils/auth';
import { finishAuthRedirect, readTenantAuthPayload } from '../../utils/tenantRedirect';

export default function AuthComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const payload = readTenantAuthPayload();
    if (!payload?.token || !payload?.user) {
      navigate('/login', { replace: true });
      return;
    }

    saveSession({
      token: payload.token,
      user: payload.user,
      institute: payload.institute ?? null,
      tenantDomain: payload.tenantDomain ?? null,
    });

    finishAuthRedirect(payload.tenantDomain, navigate, payload.user.role);
  }, [navigate]);

  return null;
}
