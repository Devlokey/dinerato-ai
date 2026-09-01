// SwipeMail — Tinder-style Procurement & Supply-Chain Email Dataset for DINE AI
// High-priority supplier emails with AI-extracted Bento fields and suggested responses

export const INITIAL_SWIPEMAIL_ITEMS = [
  {
    id: 'mail-001',
    from: {
      name: 'Rajesh Kumar',
      role: 'Dispatch Head',
      company: 'ABC Components',
      email: 'rajesh@abccomponents.in',
      avatar: 'RK'
    },
    subject: 'URGENT: Tooling calibration resolved — PO-1045 revised dispatch commitment',
    date: 'Sep 12, 2026 · 04:45 PM',
    unread: true,
    priorityScore: 95,
    priorityTier: 'Critical',
    category: 'Supplier Delay',
    poNumber: 'PO-1045',
    item: 'Industrial Component A (500 units)',
    orderValue: '₹6,00,000',
    body: `Dear Procurement Team,

We sincerely apologize for the delay on Purchase Order PO-1045. Our Bhosari manufacturing unit encountered an unexpected tooling calibration bottleneck during Stage 3 CNC milling.

I am pleased to confirm that tooling is now 100% recalibrated and production of all 500 units completed inspection this morning. Packaging is underway and our dedicated carrier will pick up the shipment tomorrow morning (Sep 14).

We commit to guaranteed delivery at your Chakan plant by **September 15, 2026**.

Please let us know if you need any additional dispatch documentation.

Warm regards,
Rajesh Kumar
Dispatch & Logistics Head | ABC Components`,
    bento: {
      poNumber: 'PO-1045',
      supplier: 'ABC Components',
      revisedDate: 'Sep 15, 2026',
      delayDays: '+5 days',
      rootCause: 'CNC Tooling recalibration',
      slaImpact: 'High risk to Chakan line assembly',
      aiVerdict: 'Production resolved · Shipment staged for tomorrow morning'
    },
    suggestedReplies: [
      {
        label: 'Accept Sep 15 Delivery',
        tone: 'formal',
        text: 'Thank you Rajesh. We accept the revised delivery date of September 15, 2026 for PO-1045. Please ensure tracking waybill details are shared as soon as the carrier collects the consignment.'
      },
      {
        label: 'Demand Priority Expedite',
        tone: 'urgent',
        text: 'Rajesh, the 5-day delay on PO-1045 puts our Chakan assembly schedule at serious risk. Please arrange priority express courier dispatch to ensure delivery before 10 AM on September 15.'
      },
      {
        label: 'Request Plant Head Call',
        tone: 'escalate',
        text: 'Thank you for the update. Given the repeated delays this quarter, our Operations Director has scheduled an automated check-in call with your management.'
      }
    ]
  },
  {
    id: 'mail-002',
    from: {
      name: 'Anil Deshmukh',
      role: 'Operations VP',
      company: 'XYZ Manufacturing',
      email: 'anil@xyzmanufacturing.in',
      avatar: 'AD'
    },
    subject: 'Extension Request: 3-day lead time needed for Heat Treatment — PO-1067',
    date: 'Sep 12, 2026 · 11:20 AM',
    unread: true,
    priorityScore: 84,
    priorityTier: 'High',
    category: 'Supplier Delay',
    poNumber: 'PO-1067',
    item: 'Steel Component B (200 units)',
    orderValue: '₹2,40,000',
    body: `Hello Team,

Regarding PO-1067 (200 units of Steel Component B), our third-party metallurgy lab has reported a 48-hour backlog in vacuum heat-treatment testing.

To guarantee Rockwell hardness compliance (HRC 45-48), we request an extension of 3 business days, shifting delivery from Sep 12 to **Sep 15, 2026**.

Kindly confirm if this adjustment can be accommodated in your ERP schedule.

Best regards,
Anil Deshmukh | XYZ Manufacturing`,
    bento: {
      poNumber: 'PO-1067',
      supplier: 'XYZ Manufacturing',
      revisedDate: 'Sep 15, 2026',
      delayDays: '+3 days',
      rootCause: 'Vacuum heat treatment backlog',
      slaImpact: 'Medium impact — buffer stock available for 4 days',
      aiVerdict: 'Human review required before approval (₹2.4L order)'
    },
    suggestedReplies: [
      {
        label: 'Approve 3-Day Extension',
        tone: 'formal',
        text: 'Hello Anil, we have reviewed the buffer stock levels and approve the revised delivery date of September 15, 2026 for PO-1067. Please ensure quality test certificates accompany the shipment.'
      },
      {
        label: 'Partial Delivery Request',
        tone: 'negotiate',
        text: 'Hello Anil, can you dispatch 50 units immediately that have cleared hardness testing, with the remaining 150 units following on Sep 15?'
      }
    ]
  },
  {
    id: 'mail-003',
    from: {
      name: 'Sanjay Mehta',
      role: 'Commercial Lead',
      company: 'Metro Components',
      email: 'sanjay@metrocomponents.in',
      avatar: 'SM'
    },
    subject: 'CRITICAL ALERT: IC sub-component shortage impacting PO-1092',
    date: 'Sep 13, 2026 · 08:30 AM',
    unread: true,
    priorityScore: 92,
    priorityTier: 'Critical',
    category: 'Supply Disruption',
    poNumber: 'PO-1092',
    item: 'Circuit Board Y (300 units)',
    orderValue: '₹4,50,000',
    body: `Urgent Attention: Procurement Director,

We are facing an acute supplier disruption on the microcontroller ICs specified for PO-1092. Our tier-2 semiconductor vendor in Taiwan has placed the shipment on a 7-day hold.

We currently have sufficient stock to assemble 120 units. We urgently seek your authorization to either:
1. Dispatch 120 units this week, or
2. Substitute with AEC-Q100 certified grade alternate ICs at parity pricing.

Please advise immediately.

Sanjay Mehta | Metro Components`,
    bento: {
      poNumber: 'PO-1092',
      supplier: 'Metro Components',
      revisedDate: 'Pending Decision',
      delayDays: '+3 days overdue',
      rootCause: 'Tier-2 Semiconductor IC hold',
      slaImpact: 'High risk — circuit boards critical for Q3 deliverables',
      aiVerdict: 'Recommend dispatching 120 units + Voice Agent check on alternate IC'
    },
    suggestedReplies: [
      {
        label: 'Authorize 120 Unit Split Dispatch',
        tone: 'decisive',
        text: 'Sanjay, please proceed immediately with the split dispatch of 120 units under PO-1092 today. Our engineering team will review the AEC-Q100 alternate IC datasheets for the remaining 180 units.'
      },
      {
        label: 'Request Immediate Voice Sync',
        tone: 'urgent',
        text: 'Sanjay, our DINE AI Voice Agent will be connecting with your technical desk in 10 minutes to review substitution parameters.'
      }
    ]
  },
  {
    id: 'mail-004',
    from: {
      name: 'Arvind Swamy',
      role: 'Managing Director',
      company: 'Vertex Manufacturing',
      email: 'arvind@vertexmfg.in',
      avatar: 'AS'
    },
    subject: 'Formal Bid Submission: RFQ-104 (500 units Industrial Component A)',
    date: 'Sep 11, 2026 · 02:15 PM',
    unread: true,
    priorityScore: 78,
    priorityTier: 'Medium',
    category: 'Quotation',
    poNumber: 'RFQ-104',
    item: 'Industrial Component A (500 units)',
    orderValue: '₹6,30,000',
    body: `Dear Sourcing Team,

In response to RFQ-104, Vertex Manufacturing is pleased to submit our formal quotation:

• Item: Industrial Component A (High Precision Spec)
• Quantity: 500 units
• Unit Price: ₹1,260 / unit (Ex-works Bengaluru)
• Total Value: ₹6,30,000
• Lead Time: 8 business days (Fastest in region)
• On-Time SLA: 99.2% guaranteed
• Payment Terms: Net 30 days

Our automated CNC production line has reserved capacity starting Sep 16.

Looking forward to your order confirmation.

Arvind Swamy | Vertex Manufacturing`,
    bento: {
      poNumber: 'RFQ-104',
      supplier: 'Vertex Manufacturing',
      revisedDate: '8 Days Lead Time',
      delayDays: 'On Time (Fastest)',
      rootCause: 'Formal competitive quotation',
      slaImpact: 'Lowest lead time, +5% price premium over ABC Components',
      aiVerdict: 'Quote Intelligence score: 91/100 · Fastest delivery option'
    },
    suggestedReplies: [
      {
        label: 'Acknowledge Bid & Request Net 45',
        tone: 'negotiate',
        text: 'Dear Arvind, thank you for your competitive bid on RFQ-104. We are currently evaluating all submissions. Would Vertex be open to Net 45 payment terms if awarded the full volume?'
      },
      {
        label: 'Shortlist for Final Approval',
        tone: 'formal',
        text: 'Dear Arvind, your bid for RFQ-104 has been shortlisted by our Quote Intelligence Agent. We will share the final decision by Sep 14.'
      }
    ]
  },
  {
    id: 'mail-005',
    from: {
      name: 'Hardik Patel',
      role: 'Logistics Head',
      company: 'Prime Materials',
      email: 'hardik@primematerials.in',
      avatar: 'HP'
    },
    subject: 'Dispatch Notice: Consignment en route via VRL Logistics — PO-1050',
    date: 'Sep 13, 2026 · 09:10 AM',
    unread: false,
    priorityScore: 42,
    priorityTier: 'Low',
    category: 'Shipment Tracking',
    poNumber: 'PO-1050',
    item: 'Raw Aluminum Alloy Ingots (1,200 kg)',
    orderValue: '₹3,40,000',
    body: `Hello Team,

This is to confirm that 1,200 kg of Raw Aluminum Alloy Ingots under PO-1050 was dispatched from our Surat yard this morning.

• Carrier: VRL Logistics Express
• Waybill Docket: #VRL-9921-SURAT
• GPS Tracking: Active
• Estimated Arrival: Sep 14, 2026 by 02:00 PM

Mill test certificates have been uploaded to our supplier portal.

Regards,
Hardik Patel | Prime Materials`,
    bento: {
      poNumber: 'PO-1050',
      supplier: 'Prime Materials',
      revisedDate: 'Sep 14, 2026 (On Track)',
      delayDays: '0 days (On SLA)',
      rootCause: 'Shipment dispatched on schedule',
      slaImpact: 'Zero risk · Consignment in transit',
      aiVerdict: 'Auto-archive recommended · Delivery tracker updated'
    },
    suggestedReplies: [
      {
        label: 'Acknowledge Waybill',
        tone: 'brief',
        text: 'Thank you Hardik. Waybill #VRL-9921 received and logged in our inbound delivery schedule.'
      }
    ]
  }
];

export default {
  INITIAL_SWIPEMAIL_ITEMS
};
