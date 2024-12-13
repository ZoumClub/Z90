import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminLogin } from '../../pages/admin/AdminLogin';
import { ProtectedRoute } from '../auth/ProtectedRoute';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}