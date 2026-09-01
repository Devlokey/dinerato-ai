// Sourcing Agent
// Specialization: Supplier Database Discovery, Rating & Capacity Filtering, Vendor Shortlisting

export const sourcingAgent = {
  id: "agent-5",
  name: "Sourcing Agent",
  role: "Supplier Discovery & Shortlisting",
  description: "Scans enterprise supplier directories, evaluates historical vendor ratings, capacities, and lead times, and generates optimal vendor shortlists for procurement requests.",
  icon: "Search",
  status: "Active",
  permissions: {
    readData: true,
    writeData: false,
    sendEmails: false,
    makeCalls: false,
    approvePurchases: false,
    createPOs: false
  },

  /**
   * Execute sourcing agent task
   * @param {string} task - Task identifier (e.g. 'SOURCE_SUPPLIERS')
   * @param {object} payload - Sourcing criteria (e.g. category, quantity, item)
   * @param {function} onStep - Real-time step reporter callback
   */
  execute: async (task, payload = {}, onStep = () => {}) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (task === 'SOURCE_SUPPLIERS' || task === 'FIND_SUPPLIERS') {
      const item = payload.item || '500 units of Industrial Component A';

      onStep({
        id: `step-source-1-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'Sourcing Agent',
        action: `Searching supplier database for ${item}...`,
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 100 : 500);

      onStep({
        id: `step-source-2-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'Sourcing Agent',
        action: '✓ Found 6 potential suppliers matching category and manufacturing capacity',
        status: 'completed'
      });

      await delay(payload.fastMode ? 100 : 450);

      const shortlisted = [
        { id: 'SUP-001', name: 'ABC Components', rating: 4.8, location: 'Pune', onTime: 98, capacity: 'High' },
        { id: 'SUP-002', name: 'Global Industrial Supply', rating: 4.3, location: 'Mumbai', onTime: 91, capacity: 'Very High' },
        { id: 'SUP-004', name: 'Vertex Manufacturing', rating: 4.9, location: 'Bengaluru', onTime: 99, capacity: 'High' },
        { id: 'SUP-005', name: 'Nova Components', rating: 4.2, location: 'Chennai', onTime: 89, capacity: 'Moderate' }
      ];

      onStep({
        id: `step-source-3-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'Sourcing Agent',
        action: '✓ Shortlisted 4 based on category, rating, capacity (ABC Components, Global Industrial Supply, Vertex Manufacturing, Nova Components)',
        status: 'completed'
      });

      return {
        matchedCount: 6,
        shortlistCount: 4,
        shortlist: shortlisted,
        item,
        quantity: payload.quantity || 500
      };
    }

    onStep({
      id: `step-source-gen-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Sourcing Agent',
      action: `Catalog scan completed for ${payload.category || 'General Products'}`,
      status: 'completed'
    });

    return { status: 'completed', task };
  }
};

export default sourcingAgent;
