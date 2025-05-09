import { use } from "react";
import { useEffect } from "react";
import { useAuth } from '../context/authcontext.jsx';
import { useNavigate } from 'react-router-dom';

const ProyectedRoutes = ({ children , requireRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    } else if (requireRole && !requireRole.includes(user.role)) {
      navigate('/unauthorized');
      return;
    }
  }, [user, requireRole, navigate]);
  if (!user) {
    return null; 
  }
  if (requireRole && !requireRole.includes(user.role)) {
    return null; 
  }
  return children;
}

export default ProyectedRoutes;
