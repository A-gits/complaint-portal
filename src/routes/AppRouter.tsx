import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoginPage }           from '../modules/auth/LoginPage';
import { AdminLayout }         from '../layouts/AdminLayout';
import { ClientLayout }        from '../layouts/ClientLayout';
import { AgentLayout }         from '../layouts/AgentLayout';
import { AdminDashboardPage }  from '../modules/admin/DashboardPage';
import { AdminComplaintsPage }      from '../modules/admin/ComplaintsPage';
import { AdminComplaintDetailPage } from '../modules/admin/ComplaintDetailPage';
import { AdminClientsPage }         from '../modules/admin/AdminClientsPage';
import { AdminAgentsPage }          from '../modules/admin/AdminAgentsPage';
import { AdminCategoriesPage }      from '../modules/admin/AdminCategoriesPage';
import { ClientDashboardPage } from '../modules/client/DashboardPage';
import { ClientComplaintsPage }        from '../modules/client/ComplaintsPage';
import { ClientSubmitComplaintPage }   from '../modules/client/SubmitComplaintPage';
import { ClientComplaintDetailPage }   from '../modules/client/ComplaintDetailPage';
import { AgentDashboardPage }  from '../modules/agent/DashboardPage';
import { AgentComplaintsPage }         from '../modules/agent/ComplaintsPage';
import { AgentComplaintDetailPage }    from '../modules/agent/ComplaintDetailPage';

const ProtectedRoute = ({ role, children }: { role: UserRole; children: React.ReactNode }) => {
  const { isAuthenticated, role: userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== role)  return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated)    return <Navigate to="/login" replace />;
  if (role === 'admin')    return <Navigate to="/admin"  replace />;
  if (role === 'agent')    return <Navigate to="/agent"  replace />;
  if (role === 'client')   return <Navigate to="/client" replace />;
  return <Navigate to="/login" replace />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/"      element={<RootRedirect />} />

       {/* ── Admin ── */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index                        element={<AdminDashboardPage />} />
        <Route path="complaints"            element={<AdminComplaintsPage />} />
        <Route path="complaints/:id"        element={<AdminComplaintDetailPage />} />
        <Route path="clients"               element={<AdminClientsPage />} />
        <Route path="agents"                element={<AdminAgentsPage />} />
        <Route path="categories"            element={<AdminCategoriesPage />} />
      </Route>
 
      {/* ── Agent ── */}
      <Route path="/agent" element={<ProtectedRoute role="agent"><AgentLayout /></ProtectedRoute>}>
        <Route index             element={<AgentDashboardPage />} />
        <Route path="complaints" element={<AgentComplaintsPage  />} />
        <Route path="complaints/:id" element={<AgentComplaintDetailPage />} />
      </Route>
 
      {/* ── Client ── */}
      <Route path="/client" element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
        <Route index                   element={<ClientDashboardPage />} />
        <Route path="complaints"       element={<ClientComplaintsPage />} />
        <Route path="complaints/new"   element={<ClientSubmitComplaintPage />} />
        <Route path="complaints/:id"   element={<ClientComplaintDetailPage />} />
      </Route>
 
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
