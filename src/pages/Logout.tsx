import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Logout() {
  const { signOut } = useAuth();
  useEffect(() => {
    void signOut();
  }, [signOut]);
  return <Navigate to="/login" replace />;
}


