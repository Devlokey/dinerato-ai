// RFQ Agent
// Specialization: Request For Quotation Generation, Specification Package Assembly & Multi-Vendor Distribution

export const rfqAgent = {
  id: "agent-6",
  name: "RFQ Agent",
  role: "RFQ Creation & Multi-Vendor Distribution",
  description: "Generates standardized Request for Quotation packages, dispatches requests to shortlisted vendors via automated portals/emails, and tracks response timelines.",
  icon: "Send",
  status: "Active",
  permissions: {
    readData: true,
    writeData: true,
    sendEmails: true,
    makeCalls: false,
    approvePurchases: false,
    createPOs: true
  },

  /**
   * Execute RFQ agent task
   * @param {string} task - Task identifier (e.g. 'CREATE_AND_DISPATCH_RFQ')
   * @param {object} payload - RFQ specifications and vendor targets
   * @param {function} onStep - Real-time step reporter callback
   */
  execute: async (task, payload = {}, onStep = () => {}) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (task === 'CREATE_AND_DISPATCH_RFQ' || task === 'DISPATCH_RFQ') {
      const rfqId = payload.rfqId || 'RFQ-104';
      const item = payload.item || 'Industrial Component A';
      const quantity = payload.quantity || 500;

      onStep({
        id: `step-rfq-1-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'RFQ Agent',
        action: `Creating ${rfqId} (${quantity} units of ${item})...`,
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 100 : 450);

      onStep({
        id: `step-rfq-2-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'RFQ Agent',
        action: `✓ ${rfqId} created with technical specs and compliance criteria`,
        status: 'completed'
      });

      await delay(payload.fastMode ? 100 : 400);

      onStep({
        id: `step-rfq-3-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'RFQ Agent',
        action: 'Sending RFQ to 4 suppliers via encrypted supplier portals...',
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 100 : 500);

      onStep({
        id: `step-rfq-4-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'RFQ Agent',
        action: '✓ Sent to: ABC Components, Global Industrial Supply, Vertex Manufacturing, Nova Components',
        status: 'completed'
      });

      return {
        rfqId,
        item,
        quantity,
        recipients: ['ABC Components', 'Global Industrial Supply', 'Vertex Manufacturing', 'Nova Components'],
        status: 'SENT',
        deadline: 'Sep 18, 2026'
      };
    }

    onStep({
      id: `step-rfq-gen-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'RFQ Agent',
      action: `RFQ package generated for ${payload.rfqId || 'RFQ'}`,
      status: 'completed'
    });

    return { status: 'completed', task };
  }
};

export default rfqAgent;
