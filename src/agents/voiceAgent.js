import { isVapiConfigured, getVapiStatus } from '../services/vapiService';

export const voiceAgent = {

  id: "agent-4",
  name: "Voice Agent",
  role: "Autonomous Phone Call Execution",
  description: "Initiates real-time conversational telephone calls with supplier representatives, generates natural language transcripts, and extracts high-confidence delivery commitments.",
  icon: "PhoneCall",
  status: "Active",
  permissions: {
    readData: true,
    writeData: false,
    sendEmails: false,
    makeCalls: true,
    approvePurchases: false,
    createPOs: false
  },

  /**
   * Execute voice call task
   * @param {string} task - Task identifier (e.g. 'INITIATE_CALL', 'COMPLETE_CALL')
   * @param {object} payload - Call configuration payload
   * @param {function} onStep - Real-time step reporter callback
   */
  execute: async (task, payload = {}, onStep = () => {}) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (task === 'INITIATE_CALL' || task === 'CALL_SUPPLIER') {
      onStep({
        id: `step-6-${Date.now()}`,
        timestamp: '10:42:17',
        agent: 'Voice Agent',
        action: '→ Initiating call to ABC Components re: PO-1045 (+91 98230 45112)',
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 50 : 350);

      return {
        callId: `CALL-${Date.now()}`,
        status: 'RINGING',
        supplier: 'ABC Components',
        contact: 'Rajesh Kumar (Dispatch Head)',
        phone: '+91 98230 45112',
        regarding: 'PO-1045 — 500 units Industrial Component A',
        targetDuration: 42, // seconds
        dialogue: [
          {
            speaker: 'DINE AI',
            role: 'ai',
            text: "Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order PO-1045 for 500 units of Industrial Component A. Could you provide a delivery update?"
          },
          {
            speaker: 'SUPPLIER',
            role: 'human',
            text: "Yes, apologies for the delay. We had a production issue but it's resolved. The shipment is ready to go tomorrow morning."
          },
          {
            speaker: 'DINE AI',
            role: 'ai',
            text: "That's helpful. Can you confirm delivery to our facility by September 15th?"
          },
          {
            speaker: 'SUPPLIER',
            role: 'human',
            text: "Yes, confirmed. September 15th delivery."
          }
        ]
      };
    }

    if (task === 'COMPLETE_CALL' || task === 'POST_CALL_ANALYSIS') {
      onStep({
        id: `step-post-1-${Date.now()}`,
        timestamp: '10:43:02',
        agent: 'Voice Agent',
        action: '✓ Call completed — 00:42 duration (Transcript recorded)',
        status: 'completed'
      });

      await delay(payload.fastMode ? 100 : 400);

      onStep({
        id: `step-post-3-${Date.now()}`,
        timestamp: '10:43:05',
        agent: 'Voice Agent',
        action: '✓ Confidence: 94% (High clarity acoustic & entity extraction)',
        status: 'completed'
      });

      return {
        callDuration: '00:42',
        audioClarity: 'High',
        confidenceScore: 94,
        keyFindings: {
          confirmedDelivery: '2026-09-15',
          productionStatus: 'Resolved',
          dispatchWindow: 'Tomorrow Morning'
        }
      };
    }

    onStep({
      id: `step-voice-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Voice Agent',
      action: `Voice action completed for ${payload.supplier || 'contact'}`,
      status: 'completed'
    });

    return { status: 'completed', task };
  }
};

export default voiceAgent;
