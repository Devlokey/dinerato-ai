// Supplier Communication Agent
// Specialization: Channel Selection, Automated Notification & Confirmation Email Dispatch

export const supplierCommunicationAgent = {
  id: "agent-3",
  name: "Supplier Communication Agent",
  role: "Omnichannel Supplier Outreach",
  description: "Selects optimal communication channels (email, automated voice call, portal notice), drafts formal supplier communications, and logs delivery confirmations.",
  icon: "Mail",
  status: "Active",
  permissions: {
    readData: true,
    writeData: true,
    sendEmails: true,
    makeCalls: false,
    approvePurchases: false,
    createPOs: false
  },

  /**
   * Execute communication agent task with realistic async timing
   * @param {string} task - Task identifier (e.g. 'SELECT_CHANNEL', 'SEND_CONFIRMATION_EMAIL')
   * @param {object} payload - Input data payload
   * @param {function} onStep - Real-time step reporter callback
   */
  execute: async (task, payload = {}, onStep = () => {}) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (task === 'SELECT_CHANNEL' || task === 'DETERMINE_OUTREACH') {
      onStep({
        id: `step-5-${Date.now()}`,
        timestamp: '10:42:16',
        agent: 'Supplier Communication Agent',
        action: 'Selecting contact method for ABC Components... (Selected: AI Voice Call due to 5-day delay urgency)',
        status: 'completed'
      });

      await delay(payload.fastMode ? 50 : 350);

      return {
        selectedChannel: 'VOICE_CALL',
        targetSupplier: 'ABC Components',
        contactPerson: 'Rajesh Kumar',
        phoneNumber: '+91 98230 45112',
        urgency: 'HIGH'
      };
    }

    if (task === 'SEND_CONFIRMATION_EMAIL' || task === 'DISPATCH_EMAIL') {
      onStep({
        id: `step-post-4-${Date.now()}`,
        timestamp: '10:43:06',
        agent: 'Supplier Communication Agent',
        action: '→ Sending confirmation email to ABC Components (rajesh@abccomponents.in)',
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 100 : 500);

      onStep({
        id: `step-post-5-${Date.now()}`,
        timestamp: '10:43:07',
        agent: 'Supplier Communication Agent',
        action: '✓ Email sent (Subject: Re: PO-1045 Revised Delivery Confirmation — Sep 15)',
        status: 'completed'
      });

      return {
        emailDispatched: true,
        recipient: 'rajesh@abccomponents.in',
        subject: 'PO-1045 Delivery Confirmation: Sep 15',
        timestamp: '10:43:07'
      };
    }

    onStep({
      id: `step-comm-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Supplier Communication Agent',
      action: `Dispatched communication update for ${payload.recipient || 'Supplier'}`,
      status: 'completed'
    });

    return { status: 'completed', task };
  }
};

export default supplierCommunicationAgent;
