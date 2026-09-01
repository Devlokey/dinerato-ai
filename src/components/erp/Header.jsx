import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  Bell,
  Search,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import DineratoLogo from '../shared/DineratoLogo';
import { useERP } from '../../context/ERPContext';
import { useAgent } from '../../context/AgentContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pos, resetDemoData } = useERP();
  const { setIsPanelOpen, clearWorkflow, clearMessages, clearTimeline } = useAgent();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const overdueCount = pos.filter(p => p.status === 'OVERDUE').length;

  const handleResetDemo = () => {
    resetDemoData();
    clearWorkflow();
    clearMessages();
    clearTimeline();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 2500);
  };

  // Generate dynamic breadcrumb segments based on pathname
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Landing', path: '/' }];

    const breadcrumbs = [{ label: 'ERP System', path: '/erp/dashboard' }];

    if (parts[1] === 'dashboard') {
      breadcrumbs.push({ label: 'Dashboard', path: '/erp/dashboard' });
    } else if (parts[1] === 'purchase-orders') {
      breadcrumbs.push({ label: 'Purchase Orders', path: '/erp/purchase-orders' });
      if (parts[2]) {
        breadcrumbs.push({ label: parts[2], path: `/erp/purchase-orders/${parts[2]}` });
      }
    } else if (parts[1] === 'suppliers') {
      breadcrumbs.push({ label: 'Suppliers Directory', path: '/erp/suppliers' });
    } else if (parts[1] === 'rfqs') {
      breadcrumbs.push({ label: 'RFQs Management', path: '/erp/rfqs' });
    } else if (parts[1] === 'quotations') {
      breadcrumbs.push({ label: 'Quotations Analysis', path: '/erp/quotations' });
    } else if (parts[1] === 'deliveries') {
      breadcrumbs.push({ label: 'Deliveries Tracking', path: '/erp/deliveries' });
    } else if (parts[1] === 'inventory') {
      breadcrumbs.push({ label: 'Inventory & Stock', path: '/erp/inventory' });
    } else if (parts[1] === 'reports') {
      breadcrumbs.push({ label: 'Reports & Analytics', path: '/erp/reports' });
    } else if (parts[1] === 'agent-permissions') {
      breadcrumbs.push({ label: 'Agent Permissions', path: '/erp/agent-permissions' });
    } else if (parts[1] === 'audit-log') {
      breadcrumbs.push({ label: 'Audit Log Ledger', path: '/erp/audit-log' });
    } else {
      breadcrumbs.push({ label: parts[1].replace('-', ' '), path: location.pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-white border-b border-stone-200 px-4 flex items-center justify-between gap-4 z-20 shrink-0 select-none">
      {/* Left side: Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-500">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path || idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-stone-900 capitalize">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-stone-900 transition-colors capitalize text-stone-600 font-medium"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className={`relative transition-all ${searchFocused ? 'scale-[1.01]' : ''}`}>
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search POs, suppliers, SKUs, RFQs (e.g. PO-1045, ABC Components)..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = e.target.value.trim().toUpperCase();
                if (val.includes('1045') || val.includes('PO-1045')) {
                  navigate('/erp/purchase-orders/PO-1045');
                } else if (val.includes('SUP') || val.includes('ABC')) {
                  navigate('/erp/suppliers');
                } else if (val.includes('RFQ')) {
                  navigate('/erp/rfqs');
                } else {
                  navigate('/erp/purchase-orders');
                }
              }
            }}
            className="w-full pl-8 pr-12 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-stone-900 placeholder:text-stone-400"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-400 border border-stone-200 px-1.5 py-0.5 rounded bg-white">
            ↵ Enter
          </span>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-2.5">
        {/* Exhibition Mode Splash link */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md border border-stone-200 transition-colors"
          title="Return to Splash / Demo Mode Selector"
        >
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          <span>Splash Screen</span>
        </Link>

        {/* Reset Demo Button */}
        <button
          onClick={handleResetDemo}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all ${
            resetSuccess
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-xs'
          }`}
          title="Reset all mutated mock data to default state"
        >
          {resetSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">Demo Reset</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset Demo</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/erp/purchase-orders')}
          className="relative p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
          title={`${overdueCount} Overdue Purchase Orders require attention`}
        >
          <Bell className="w-4 h-4" />
          {overdueCount > 0 && (
            <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {overdueCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-stone-200 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#141412] text-amber-400 font-bold text-xs flex items-center justify-center shadow-xs">
            OD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-stone-800 leading-tight">
              A. Sharma
            </div>
            <div className="text-[10px] text-stone-400 leading-tight">
              Operations Director
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
