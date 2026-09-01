import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AgentContext = createContext(null);

export const AgentProvider = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(null); // 'CHASE_OVERDUE' | 'SOURCE_RFQ' | 'FREE_CHAT' | null
  const [isRunning, setIsRunning] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [voiceCallActive, setVoiceCallActive] = useState(false);
  const [voiceCallData, setVoiceCallData] = useState(null);
  const [approvalModalData, setApprovalModalData] = useState(null);
  const [quoteComparisonData, setQuoteComparisonData] = useState(null);
  const [sourcingShortlist, setSourcingShortlist] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello, I'm **DINE AI** — your autonomous procurement copilot.\n\nI can proactively monitor purchase orders, expedite supplier shipments with live automated phone calls, issue RFQs, and benchmark quotations. How can I assist you today?",
      timestamp: '10:42 AM',
      type: 'text'
    }
  ]);

  const approvalResolverRef = useRef(null);

  const addTimelineStep = useCallback((step) => {
    setTimelineSteps(prev => {
      const existingIdx = prev.findIndex(s => s.id === step.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...step };
        return updated;
      }
      return [...prev, step];
    });
  }, []);

  const updateTimelineStep = useCallback((id, updates) => {
    setTimelineSteps(prev => prev.map(step => step.id === id ? { ...step, ...updates } : step));
  }, []);

  const clearTimeline = useCallback(() => {
    setTimelineSteps([]);
  }, []);

  const addMessage = useCallback((msg) => {
    setMessages(prev => [
      ...prev,
      {
        id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sender: msg.sender || 'assistant',
        text: msg.text || '',
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: msg.type || 'text',
        data: msg.data || null
      }
    ]);
  }, []);

  const updateMessage = useCallback((id, updates) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome-msg-reset',
        sender: 'assistant',
        text: "DINE AI reset. Ready to monitor procurement operations or run demo workflows.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      }
    ]);
  }, []);

  const openVoiceCall = useCallback((callData) => {
    setVoiceCallData(callData);
    setVoiceCallActive(true);
  }, []);

  const closeVoiceCall = useCallback(() => {
    setVoiceCallActive(false);
  }, []);

  const requestApproval = useCallback((data) => {
    return new Promise((resolve) => {
      setApprovalModalData(data);
      approvalResolverRef.current = resolve;
    });
  }, []);

  const resolveApproval = useCallback((decision) => {
    if (approvalResolverRef.current) {
      approvalResolverRef.current(decision);
      approvalResolverRef.current = null;
    }
    setApprovalModalData(null);
  }, []);

  const clearWorkflow = useCallback(() => {
    setActiveWorkflow(null);
    setIsRunning(false);
    setVoiceCallActive(false);
    setApprovalModalData(null);
    setQuoteComparisonData(null);
    setSourcingShortlist(null);
  }, []);

  const value = {
    isPanelOpen,
    setIsPanelOpen,
    activeWorkflow,
    setActiveWorkflow,
    isRunning,
    setIsRunning,
    timelineSteps,
    setTimelineSteps,
    addTimelineStep,
    updateTimelineStep,
    clearTimeline,
    voiceCallActive,
    voiceCallData,
    openVoiceCall,
    closeVoiceCall,
    approvalModalData,
    setApprovalModalData,
    requestApproval,
    resolveApproval,
    quoteComparisonData,
    setQuoteComparisonData,
    sourcingShortlist,
    setSourcingShortlist,
    messages,
    setMessages,
    addMessage,
    updateMessage,
    clearMessages,
    clearWorkflow
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};

export default AgentContext;
