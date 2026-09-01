// Agent Orchestrator — Central Multi-Agent Coordinator & Intent Classifier
// Manages 7 Discrete Autonomous Agents and Routes Workflows

import analystAgent from './analystAgent';
import poExpeditingAgent from './poExpeditingAgent';
import supplierCommunicationAgent from './supplierCommunicationAgent';
import voiceAgent from './voiceAgent';
import sourcingAgent from './sourcingAgent';
import rfqAgent from './rfqAgent';
import quoteIntelligenceAgent from './quoteIntelligenceAgent';

export const AGENT_REGISTRY = {
  'agent-1': analystAgent,
  'agent-2': poExpeditingAgent,
  'agent-3': supplierCommunicationAgent,
  'agent-4': voiceAgent,
  'agent-5': sourcingAgent,
  'agent-6': rfqAgent,
  'agent-7': quoteIntelligenceAgent
};

export const ALL_AGENTS = [
  analystAgent,
  poExpeditingAgent,
  supplierCommunicationAgent,
  voiceAgent,
  sourcingAgent,
  rfqAgent,
  quoteIntelligenceAgent
];

export const INTENT_TYPES = {
  CHASE_OVERDUE: 'CHASE_OVERDUE',
  SOURCE_RFQ: 'SOURCE_RFQ',
  GENERAL_QUERY: 'GENERAL_QUERY'
};

/**
 * Classifies user intent from natural language input or action trigger
 * @param {string} input - User query or suggested chip text
 * @returns {object} Classification result { type, flow, confidence }
 */
export const classifyIntent = (input = '') => {
  const query = input.toLowerCase().trim();

  // Explicit execution commands for Primary Demo Flow 1 (Voice Call & Expediting)
  const explicitChaseCommands = [
    'chase overdue pos', 'chase overdue', 'chase high-risk pos',
    'chase supplier with dine ai', 'call supplier', 'call abc components',
    'call supplier re: po-1045', 'launch voice call', 'expedite po-1045',
    'chase pos', 'run chase flow'
  ];

  if (explicitChaseCommands.some(cmd => query === cmd || query.startsWith(cmd))) {
    return {
      type: INTENT_TYPES.CHASE_OVERDUE,
      flow: 'DEMO_FLOW_1',
      confidence: 0.98,
      label: 'Chase Overdue POs'
    };
  }

  // Explicit execution commands for Secondary Demo Flow 2 (Source & Multi-Vendor RFQ)
  const explicitSourcingCommands = [
    'find suppliers for 500 units of product x', 'find suppliers for 500 units',
    'source & rfq', 'run rfq-104', 'run source & rfq', 'compare quotes for rfq-104',
    'benchmark quotes for rfq-104', 'execute sourcing rfq'
  ];

  if (explicitSourcingCommands.some(cmd => query === cmd || query.startsWith(cmd))) {
    return {
      type: INTENT_TYPES.SOURCE_RFQ,
      flow: 'DEMO_FLOW_2',
      confidence: 0.96,
      label: 'Source & RFQ'
    };
  }

  return {
    type: INTENT_TYPES.GENERAL_QUERY,
    flow: 'GEMINI_OR_FALLBACK',
    confidence: 0.92,
    label: 'Conversational Intelligence'
  };
};

/**
 * Executes Primary Demo Flow 1: "Chase Overdue POs"
 * Steps:
 * 1. Anomaly Query & Risk Stratification (Procurement Analyst Agent)
 * 2. Contact Identification (PO Expediting Agent)
 * 3. Channel Selection (Supplier Communication Agent)
 * 4. Voice Call Execution (Voice Agent) + VoiceCallUI Modal
 * 5. Post-Call Intelligence Extraction & Email Confirmation
 * 6. Human Approval Modal (₹6,00,000 threshold)
 * 7. ERP State Commit & Audit Log entry
 */
export const runChaseOverdueFlow = async ({
  agentContext,
  erpContext,
  userMessage = 'Chase overdue POs',
  options = {}
}) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const fastMode = !!options.fastMode;

  try {
    // 1. Prepare UI state
    agentContext.setIsRunning(true);
    agentContext.setActiveWorkflow('CHASE_OVERDUE');
    agentContext.setIsPanelOpen(true);
    agentContext.clearTimeline();

    if (userMessage) {
      agentContext.addMessage({
        sender: 'user',
        text: userMessage,
        type: 'text'
      });
    }

    // 2. Initial Analyst steps
    await analystAgent.execute('ANALYZE_OVERDUE', { fastMode }, (step) => {
      agentContext.addTimelineStep(step);
    });

    // 3. PO Expediting Agent step
    await poExpeditingAgent.execute('IDENTIFY_CONTACTS', { fastMode }, (step) => {
      agentContext.addTimelineStep(step);
    });

    // 4. Supplier Communication Agent step
    await supplierCommunicationAgent.execute('SELECT_CHANNEL', { fastMode }, (step) => {
      agentContext.addTimelineStep(step);
    });

    // 5. Voice Agent initiate call
    const callInit = await voiceAgent.execute('INITIATE_CALL', { fastMode }, (step) => {
      agentContext.addTimelineStep(step);
    });

    // 6. Open Voice Call UI overlay and wait for completion
    const callResult = await new Promise((resolve) => {
      agentContext.openVoiceCall({
        ...callInit,
        onCallFinished: (result) => {
          agentContext.closeVoiceCall();
          resolve(result);
        }
      });
    });

    await delay(fastMode ? 50 : 300);

    // 7. Post-Call Analysis & Email Confirmation
    await voiceAgent.execute('COMPLETE_CALL', { fastMode, dialogue: callResult?.dialogue }, (step) => {
      agentContext.addTimelineStep(step);
    });

    const extractionResult = await analystAgent.execute(
      'EXTRACT_CALL_DATA',
      {
        fastMode,
        dialogue: callResult?.dialogue || [],
        poId: 'PO-1045',
        supplier: 'ABC Components',
        contact: 'Rajesh Kumar (Dispatch Head)'
      },
      (step) => {
        agentContext.addTimelineStep(step);
      }
    );

    const confirmedDate = extractionResult?.formattedDate || 'Sep 15, 2026';
    const delayReason = extractionResult?.delayReason || 'Production delay resolved — shipment scheduled tomorrow morning';
    const confidenceScore = extractionResult?.confidence || 94;

    await supplierCommunicationAgent.execute(
      'SEND_CONFIRMATION_EMAIL',
      { fastMode, confirmedDate, delayReason },
      (step) => {
        agentContext.addTimelineStep(step);
      }
    );

    await poExpeditingAgent.execute(
      'STAGE_ERP_UPDATE',
      { fastMode, confirmedDate },
      (step) => {
        agentContext.addTimelineStep(step);
      }
    );

    // 8. Human-in-the-Loop Approval Modal (₹6,00,000 exceeds ₹1,00,000 threshold)
    const approvalPayload = {
      poId: 'PO-1045',
      supplier: 'ABC Components',
      item: 'Industrial Component A (500 units @ ₹1,200/unit)',
      currentStatus: 'OVERDUE (5 days)',
      previousDate: 'Sep 10, 2026',
      newDate: confirmedDate,
      value: 600000,
      formattedValue: '₹6,00,000',
      threshold: 100000,
      reason: delayReason,
      confidence: confidenceScore,
      source: callResult?.mode === 'vapi' ? 'Live Vapi WebRTC Audio Stream' : 'Automated Voice Call Transcript (00:42)'
    };

    const approvalResult = await agentContext.requestApproval(approvalPayload);

    if (approvalResult && approvalResult.decision === 'APPROVE') {
      // 9. Mutate ERP State
      erpContext.updatePOStatus(
        'PO-1045',
        `Confirmed ${confirmedDate.replace(', 2026', '')}`,
        '2026-09-15',
        `Shipment confirmed for ${confirmedDate} via Voice Agent call with Rajesh Kumar (ABC Components). Reason: ${delayReason}.`
      );

      // Append to immutable Audit Log
      erpContext.addAuditLog({
        agent: 'PO Expediting Agent',
        action: `PO-1045 Delivery Rescheduled to ${confirmedDate.replace(', 2026', '')}`,
        object: 'PO-1045',
        method: 'Voice Agent + HITL Operator Approval',
        status: 'Approved',
        approvedBy: 'Operations Director'
      });

      // Render Final Completion Report in Chat with detailed Call Analysis
      agentContext.addMessage({
        sender: 'assistant',
        text: `✓ **WORKFLOW COMPLETE**\n\n2 high-risk POs handled:\n• **PO-1045** (ABC Components): Shipment confirmed. New delivery: **${confirmedDate.replace(', 2026', '')}**. ERP updated.\n• **PO-1067** (XYZ Manufacturing): Supplier requested 3 additional days. ⚠ Human review required.`,
        type: 'completion_summary',
        data: {
          poId: 'PO-1045',
          newDate: confirmedDate,
          status: `Confirmed ${confirmedDate.replace(', 2026', '')}`,
          analysis: extractionResult?.analysis,
          delayReason,
          confidence: confidenceScore
        }
      });

    } else {
      agentContext.addMessage({
        sender: 'assistant',
        text: `⚠ **WORKFLOW PAUSED BY OPERATOR**\n\nPO-1045 revision was not committed. The order remains flagged as **OVERDUE** in the ERP pending manual procurement team review.`,
        type: 'text'
      });
    }
  } catch (error) {
    console.error('Error running Chase Overdue Flow:', error);
    agentContext.addMessage({
      sender: 'assistant',
      text: `An error occurred while executing the multi-agent expediting workflow: ${error.message}`,
      type: 'text'
    });
  } finally {
    agentContext.setIsRunning(false);
  }
};

/**
 * Executes Secondary Demo Flow 2: "Source & RFQ"
 * Steps:
 * 1. Supplier Database Search & Shortlisting (Sourcing Agent)
 * 2. RFQ-104 Generation & Multi-Vendor Distribution (RFQ Agent)
 * 3. Quotation Ingestion & Comparative Analysis (Quote Intelligence Agent)
 * 4. Renders Interactive Quote Comparison Table & AI Recommendation
 */
export const runSourceAndRFQFlow = async ({
  agentContext,
  erpContext,
  userMessage = 'Find suppliers for 500 units of Product X',
  options = {}
}) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const fastMode = !!options.fastMode;

  try {
    // 1. Prepare UI state
    agentContext.setIsRunning(true);
    agentContext.setActiveWorkflow('SOURCE_RFQ');
    agentContext.setIsPanelOpen(true);
    agentContext.clearTimeline();

    if (userMessage) {
      agentContext.addMessage({
        sender: 'user',
        text: userMessage,
        type: 'text'
      });
    }

    // 2. Sourcing Agent executes supplier search and shortlisting
    const sourcingResult = await sourcingAgent.execute(
      'SOURCE_SUPPLIERS',
      { item: 'Industrial Component A', quantity: 500, fastMode },
      (step) => agentContext.addTimelineStep(step)
    );

    agentContext.setSourcingShortlist(sourcingResult.shortlist);

    // 3. RFQ Agent creates and dispatches RFQ-104
    await rfqAgent.execute(
      'CREATE_AND_DISPATCH_RFQ',
      { rfqId: 'RFQ-104', item: 'Industrial Component A', quantity: 500, fastMode },
      (step) => agentContext.addTimelineStep(step)
    );

    // 4. Quote Intelligence Agent analyzes received quotes
    const quoteResult = await quoteIntelligenceAgent.execute(
      'ANALYZE_QUOTES',
      { rfqId: 'RFQ-104', fastMode },
      (step) => agentContext.addTimelineStep(step)
    );

    // 5. Store quote comparison matrix in AgentContext
    agentContext.setQuoteComparisonData({
      rfqId: 'RFQ-104',
      item: 'Industrial Component A',
      quantity: 500,
      quotes: quoteResult.comparison,
      recommendationSummary: quoteResult.recommendationSummary
    });

    // 6. Deliver interactive Quote Comparison Card to Chat
    agentContext.addMessage({
      sender: 'assistant',
      text: `### RFQ-104 Sourcing Intelligence Complete\n\nI evaluated **6 suppliers**, shortlisted **4 candidates**, and received **3 formal quotations** for 500 units of *Industrial Component A*.\n\n${quoteResult.recommendationSummary}`,
      type: 'quote_comparison',
      data: {
        rfqId: 'RFQ-104',
        quotes: quoteResult.comparison
      }
    });
  } catch (error) {
    console.error('Error running Source & RFQ Flow:', error);
    agentContext.addMessage({
      sender: 'assistant',
      text: `An error occurred during the sourcing workflow: ${error.message}`,
      type: 'text'
    });
  } finally {
    agentContext.setIsRunning(false);
  }
};

/**
 * Master Dispatcher — routes any task or query through the appropriate multi-agent workflow
 */
export const dispatchAgentAction = async (prompt, { agentContext, erpContext, options = {} }) => {
  const intent = classifyIntent(prompt);

  if (intent.type === INTENT_TYPES.CHASE_OVERDUE) {
    return await runChaseOverdueFlow({ agentContext, erpContext, userMessage: prompt, options });
  }

  if (intent.type === INTENT_TYPES.SOURCE_RFQ) {
    return await runSourceAndRFQFlow({ agentContext, erpContext, userMessage: prompt, options });
  }

  return { intent, isStandardQuery: true };
};

export default {
  analystAgent,
  poExpeditingAgent,
  supplierCommunicationAgent,
  voiceAgent,
  sourcingAgent,
  rfqAgent,
  quoteIntelligenceAgent,
  ALL_AGENTS,
  classifyIntent,
  runChaseOverdueFlow,
  runSourceAndRFQFlow,
  dispatchAgentAction
};
