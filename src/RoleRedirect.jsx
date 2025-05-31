import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useUser } from 'common/contexts/UserContext';

export default function RoleRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      navigate('/admin-home', { replace: true });
    } else {
      navigate('/volunteer-home', { replace: true });
    }
  }, [user, navigate]);

  return null;
}
