import { analyzeConversationTranscript } from '../services/geminiService';

export const analystAgent = {
  id: "agent-1",
  name: "Procurement Analyst Agent",
  role: "PO Database Query & Risk Stratification",
  description: "Queries enterprise ERP databases, stratifies purchase orders by operational risk (HIGH, MEDIUM, LOW), and extracts structured commitment entities from multi-channel communications.",
  icon: "BarChart3",
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
   * Execute an analyst agent task with realistic async timing
   * @param {string} task - Task identifier (e.g. 'ANALYZE_OVERDUE', 'EXTRACT_CALL_DATA')
   * @param {object} payload - Input data payload
   * @param {function} onStep - Real-time step reporter callback
   */
  execute: async (task, payload = {}, onStep = () => {}) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (task === 'ANALYZE_OVERDUE' || task === 'QUERY_OVERDUE') {
      onStep({
        id: `step-1-${Date.now()}`,
        timestamp: '10:42:11',
        agent: 'Procurement Analyst Agent',
        action: 'Querying purchase orders database...',
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 100 : 550);

      onStep({
        id: `step-2-${Date.now()}`,
        timestamp: '10:42:13',
        agent: 'Procurement Analyst Agent',
        action: '✓ Found 4 overdue POs (PO-1045, PO-1067, PO-1089, PO-1092)',
        status: 'completed'
      });

      await delay(payload.fastMode ? 100 : 450);

      onStep({
        id: `step-3-${Date.now()}`,
        timestamp: '10:42:14',
        agent: 'Procurement Analyst Agent',
        action: '✓ Ranked by risk: 2 HIGH (PO-1045, PO-1092), 1 MEDIUM (PO-1067), 1 LOW (PO-1089)',
        status: 'completed'
      });

      return {
        overdueCount: 4,
        overduePOs: ['PO-1045', 'PO-1067', 'PO-1089', 'PO-1092'],
        riskSummary: { high: 2, medium: 1, low: 1 },
        targetPO: 'PO-1045',
        supplier: 'ABC Components'
      };
    }

    if (task === 'EXTRACT_CALL_DATA' || task === 'EXTRACT_INTELLIGENCE') {
      onStep({
        id: `step-post-2-analyzing-${Date.now()}`,
        timestamp: '10:43:03',
        agent: 'Procurement Analyst Agent',
        action: 'Analyzing call audio transcript with AI reasoning engine...',
        status: 'in_progress'
      });

      await delay(payload.fastMode ? 50 : 350);

      const dialogue = payload.dialogue || [];
      const analysis = await analyzeConversationTranscript(dialogue, {
        poId: payload.poId || 'PO-1045',
        supplier: payload.supplier || 'ABC Components'
      });

      onStep({
        id: `step-post-2-${Date.now()}`,
        timestamp: '10:43:04',
        agent: 'Procurement Analyst Agent',
        action: `✓ Extracted: Delivery commitment ${analysis.confirmedDate || 'Sep 15'}, Reason: ${analysis.delayReason ? (analysis.delayReason.length > 35 ? analysis.delayReason.slice(0, 35) + '...' : analysis.delayReason) : 'Production delay'}`,
        status: 'completed'
      });

      return {
        commitmentDate: '2026-09-15',
        formattedDate: analysis.confirmedDate || 'September 15, 2026',
        delayReason: analysis.delayReason || 'Production delay resolved',
        confidence: analysis.confidence || 94,
        analysis,
        extractedEntities: {
          supplier: payload.supplier || 'ABC Components',
          poNumber: payload.poId || 'PO-1045',
          quantity: 500,
          unitCost: 1200,
          totalValue: 600000,
          commitmentContact: payload.contact || 'Rajesh Kumar (Dispatch Head)'
        }
      };
    }


    // Default generic execution
    onStep({
      id: `step-generic-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Procurement Analyst Agent',
      action: `Executing procurement analysis: ${task}`,
      status: 'completed'
    });

    return { status: 'completed', task };
  }
};

export default analystAgent;
