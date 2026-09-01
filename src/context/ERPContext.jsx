import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RFQS,
  INITIAL_QUOTES,
  INITIAL_INVENTORY,
  INITIAL_DELIVERIES,
  INITIAL_AGENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_KPIS
} from '../data/mockData';

const ERPContext = createContext(null);

const STORAGE_KEY = 'dine_ai_erp_state_v1';

export const ERPProvider = ({ children }) => {
  // Try loading from localStorage or default to pristine mock data
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`);
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pos`);
      return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  });

  const [rfqs, setRfqs] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rfqs`);
      return saved ? JSON.parse(saved) : INITIAL_RFQS;
    } catch {
      return INITIAL_RFQS;
    }
  });

  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quotes`);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [deliveries, setDeliveries] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_deliveries`);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
    } catch {
      return INITIAL_DELIVERIES;
    }
  });

  const [agents, setAgents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_agents`);
      return saved ? JSON.parse(saved) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [kpis, setKpis] = useState(INITIAL_KPIS);

  // Active Context for Dine AI Copilot
  const [activeContext, setActiveContextState] = useState({
    pageType: 'Dashboard',
    pageData: { title: 'Executive Procurement Overview' }
  });

  // Persist key state modifications
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify(pos));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_rfqs`, JSON.stringify(rfqs));
      localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }, [pos, auditLogs, rfqs, suppliers]);

  const setActiveContext = useCallback((newContext) => {
    setActiveContextState(prev => {
      if (
        prev.pageType === newContext.pageType &&
        JSON.stringify(prev.pageData) === JSON.stringify(newContext.pageData)
      ) {
        return prev;
      }
      return newContext;
    });
  }, []);

  const addAuditLog = useCallback((entry) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: entry.timestamp || formattedDate,
      agent: entry.agent || 'PO Expediting Agent',
      action: entry.action || 'ERP Mutation',
      object: entry.object || 'PO-1045',
      method: entry.method || 'Automated Action',
      status: entry.status || 'Approved',
      approvedBy: entry.approvedBy || 'Operations Director'
    };

    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  const updatePOStatus = useCallback((poId, newStatus, deliveryDate, note) => {
    setPos(prevPOs => {
      return prevPOs.map(po => {
        if (po.id === poId || po.poNumber === poId) {
          const updatedStages = po.stages ? po.stages.map(s => {
            if (s.name === 'Production') return { ...s, status: 'completed', date: 'Sep 13, 2026 (Completed)' };
            if (s.name === 'Shipment') return { ...s, status: 'completed', date: 'Sep 14, 2026 (In Transit)' };
            if (s.name === 'Delivery') return { ...s, status: 'pending', date: deliveryDate || 'Sep 15, 2026' };
            return s;
          }) : [];

          return {
            ...po,
            status: newStatus,
            promisedDelivery: deliveryDate || po.promisedDelivery,
            dueDate: deliveryDate || po.dueDate,
            overdueDays: 0,
            riskLevel: 'LOW',
            notes: note || po.notes,
            stages: updatedStages
          };
        }
        return po;
      });
    });

    // Also update delivery tracker if exists
    setDeliveries(prev => {
      return prev.map(del => {
        if (del.poNumber === poId) {
          return {
            ...del,
            status: 'In Transit',
            eta: deliveryDate || '2026-09-15',
            progress: 80,
            delayReason: null
          };
        }
        return del;
      });
    });
  }, []);

  const addRFQ = useCallback((newRFQ) => {
    setRfqs(prev => [newRFQ, ...prev]);
  }, []);

  const updateAgentPermission = useCallback((agentId, permKey, value) => {
    setAgents(prev => {
      return prev.map(ag => {
        if (ag.id === agentId) {
          return {
            ...ag,
            permissions: {
              ...ag.permissions,
              [permKey]: value
            }
          };
        }
        return ag;
      });
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setSuppliers(INITIAL_SUPPLIERS);
    setPos(INITIAL_PURCHASE_ORDERS);
    setRfqs(INITIAL_RFQS);
    setQuotes(INITIAL_QUOTES);
    setInventory(INITIAL_INVENTORY);
    setDeliveries(INITIAL_DELIVERIES);
    setAgents(INITIAL_AGENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setKpis(INITIAL_KPIS);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_suppliers`);
      localStorage.removeItem(`${STORAGE_KEY}_pos`);
      localStorage.removeItem(`${STORAGE_KEY}_rfqs`);
      localStorage.removeItem(`${STORAGE_KEY}_quotes`);
      localStorage.removeItem(`${STORAGE_KEY}_inventory`);
      localStorage.removeItem(`${STORAGE_KEY}_deliveries`);
      localStorage.removeItem(`${STORAGE_KEY}_agents`);
      localStorage.removeItem(`${STORAGE_KEY}_audit`);
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
  }, []);

  const getPOById = useCallback((poId) => {
    return pos.find(p => p.id === poId || p.poNumber === poId);
  }, [pos]);

  const getSupplierById = useCallback((supId) => {
    return suppliers.find(s => s.id === supId || s.name === supId);
  }, [suppliers]);

  const value = {
    suppliers,
    pos,
    rfqs,
    quotes,
    inventory,
    deliveries,
    agents,
    auditLogs,
    kpis,
    activeContext,
    setActiveContext,
    updatePOStatus,
    addAuditLog,
    addRFQ,
    updateAgentPermission,
    resetDemoData,
    getPOById,
    getSupplierById
  };

  return (
    <ERPContext.Provider value={value}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};

export default ERPContext;
