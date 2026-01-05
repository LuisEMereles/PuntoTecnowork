import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { UpdatePassword } from './pages/auth/UpdatePassword';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManagement } from './pages/admin/UsersManagement';
import { LocalsManagement } from './pages/admin/LocalsManagement';
import { RewardsManagement } from './pages/admin/RewardsManagement';

// Local & Client Pages
import { LocalDashboard } from './pages/local/LocalDashboard';
import { LocalOrders } from './pages/local/LocalOrders';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { NewOrder } from './pages/client/NewOrder';
import { MyOrders } from './pages/client/MyOrders';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public & Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={
            <AuthGuard allowedRoles={['admin']}>
              <Layout />
            </AuthGuard>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/locals" element={<LocalsManagement />} />
            <Route path="/admin/rewards" element={<RewardsManagement />} />
            <Route path="/admin/orders" element={<div className="glass-card p-6 rounded-2xl">Gestión Global de Pedidos (Próximamente)</div>} />
            <Route path="/admin/global-prices" element={<div className="glass-card p-6 rounded-2xl">Configuración de Precios (Próximamente)</div>} />
            <Route path="/admin/reports" element={<div className="glass-card p-6 rounded-2xl">Reportes Avanzados (Próximamente)</div>} />
          </Route>

          {/* Local Manager Routes */}
          <Route element={
            <AuthGuard allowedRoles={['local']}>
              <Layout />
            </AuthGuard>
          }>
            <Route path="/local/dashboard" element={<LocalDashboard />} />
            <Route path="/local/orders" element={<LocalOrders />} />
            <Route path="/local/prices" element={<div className="glass-card p-6 rounded-2xl">Precios Locales (Próximamente)</div>} />
            <Route path="/local/reports" element={<div className="glass-card p-6 rounded-2xl">Reporte Local (Próximamente)</div>} />
          </Route>

          {/* Client Routes */}
          <Route element={
            <AuthGuard allowedRoles={['client']}>
              <Layout />
            </AuthGuard>
          }>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/new-order" element={<NewOrder />} />
            <Route path="/client/orders" element={<MyOrders />} />
            <Route path="/client/points" element={<div className="glass-card p-6 rounded-2xl">Historial de Puntos (Próximamente)</div>} />
            <Route path="/client/rewards" element={<div className="glass-card p-6 rounded-2xl">Catálogo de Premios (Próximamente)</div>} />
          </Route>

        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;