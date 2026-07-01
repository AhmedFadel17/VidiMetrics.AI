import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const AdminRoute = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const user = auth.user;
  const roles = user?.profile.role as string[];
  const isAdmin = roles && roles.includes("Admin");

  if (!auth.isAuthenticated || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;