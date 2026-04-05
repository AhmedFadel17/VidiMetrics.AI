import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const AdminRoute = () => {
  const auth = useAuth();
  const user = auth.user;

  if (!user || user.claims.role !== 'Admin') {
    // If not admin, redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
