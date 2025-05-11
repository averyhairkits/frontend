import { useUser } from 'common/contexts/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    console.log("Redirecting user inside ROLEREDIRECTTT:", user);

    if (user.role === 'admin') {
      navigate('/admin-home', { replace: true });
    } else {
      navigate('/volunteer-home', { replace: true });
    }
  }, [user, navigate]);

  return null;
}
