import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const ProtectedRoute = () => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
