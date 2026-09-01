import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Building2,
  Send,
  Scale,
  Truck,
  Boxes,
  BarChart3,
  ShieldCheck,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Flame
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAgent } from '../../context/AgentContext';

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const location = useLocation();
  const { pos } = useERP();
  const { isRunning, setIsPanelOpen } = useAgent();

  const overdueCount = pos.filter(p => p.status === 'OVERDUE').length;

  const NAV_SECTIONS = [
    {
      title: 'Procurement Operations',
      items: [
        { path: '/erp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          path: '/erp/purchase-orders', 
          label: 'Purchase Orders', 
          icon: ShoppingCart,
          badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
          badgeType: 'danger'
        },
        { path: '/erp/suppliers', label: 'Suppliers', icon: Building2 },
        { path: '/erp/rfqs', label: 'RFQs', icon: Send },
        { path: '/erp/quotations', label: 'Quotations', icon: Scale },
        { path: '/erp/deliveries', label: 'Deliveries', icon: Truck },
        { path: '/erp/inventory', label: 'Inventory', icon: Boxes },
        { path: '/erp/reports', label: 'Reports & Spend', icon: BarChart3 },
      ]
    },
    {
      title: 'Agent Governance',
      items: [
        { path: '/erp/agent-permissions', label: 'Agent Permissions', icon: ShieldCheck },
        { path: '/erp/audit-log', label: 'Audit Log', icon: ClipboardList },
      ]
    }
  ];

  return (
    <aside
      className={`bg-[#141412] text-stone-300 border-r border-stone-800/80 flex flex-col shrink-0 transition-all duration-200 select-none z-30 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand / Logo Header */}
      <div className="h-14 px-3.5 border-b border-stone-800/80 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold text-sm tracking-wider uppercase text-white">
              ERP SYSTEM
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <span className="text-amber-400 font-bold text-xs tracking-wider">ERP</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.title || sIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {section.title}
              </div>
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/erp/purchase-orders' && location.pathname.startsWith('/erp/purchase-orders/'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/40'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-stone-400'}`} />

                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ml-1.5 ${
                          item.badgeType === 'danger'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : item.badgeType === 'warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-stone-800 text-stone-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Copilot Quick Launch trigger in sidebar */}
      <div className="p-2.5 border-t border-stone-800/80 bg-[#0E0E0C]">
        <button
          onClick={() => setIsPanelOpen(true)}
          className={`w-full py-2.5 px-3 rounded-xl bg-[#0F1622] hover:bg-[#151F2E] text-stone-200 border border-[#1E293B] hover:border-amber-400/50 flex items-center gap-2.5 text-xs font-medium transition-all shadow-sm ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-amber-400"
              fill="currentColor"
            >
              <path d="M12 1.5 C12 7.3 7.3 12 1.5 12 C7.3 12 12 16.7 12 22.5 C12 16.7 16.7 12 22.5 12 C16.7 12 12 7.3 12 1.5 Z" />
            </svg>
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center justify-between flex-1 text-left">
              <span className="font-semibold text-white">Ask DINE AI</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50 font-medium">
                ● Online
              </span>
            </div>
          )}
        </button>

        {!collapsed && (
          <div className="mt-2 px-1 flex items-center justify-between text-[10px] text-stone-400 font-sans">
            <div className="flex items-center gap-1.5 text-stone-400">
              <span>7 Autonomous Agents</span>
            </div>
            <span className="text-stone-400">Demo Mode</span>
          </div>
        )}
      </div>
    </aside>
  );
}
