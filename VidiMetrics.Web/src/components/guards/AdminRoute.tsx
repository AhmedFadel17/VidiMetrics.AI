import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';

const AdminRoute = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user || user.role !== 'Admin') {
    // If not admin, redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
