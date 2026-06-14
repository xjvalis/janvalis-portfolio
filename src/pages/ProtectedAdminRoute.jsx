import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login', { state: { from: location } });
    }
  }, [navigate, location]);

  const token = localStorage.getItem('adminToken');

  if (!token) {
    return null;
  }

  return children;
}
