import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ERPLayout from './components/erp/ERPLayout';

// Import All Application Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PurchaseOrders from './pages/PurchaseOrders';
import PODetail from './pages/PODetail';
import Suppliers from './pages/Suppliers';
import RFQs from './pages/RFQs';
import Quotations from './pages/Quotations';
import Deliveries from './pages/Deliveries';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import AgentPermissions from './pages/AgentPermissions';
import AuditLog from './pages/AuditLog';

export default function App() {
  return (
    <Routes>
      {/* Exhibition Splash Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main ERP Suite Shell & Child Routes */}
      <Route path="/erp" element={<ERPLayout />}>
        <Route index element={<Navigate to="/erp/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="purchase-orders/:id" element={<PODetail />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="rfqs" element={<RFQs />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="agent-permissions" element={<AgentPermissions />} />
        <Route path="audit-log" element={<AuditLog />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
