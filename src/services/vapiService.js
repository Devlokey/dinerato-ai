// Vapi Voice Service — Real-time WebRTC & Outbound Cellular Telephony
// Integrates @vapi-ai/web and Vapi REST API with dynamic ERP context injection

import Vapi from '@vapi-ai/web';

const ENV_KEY = import.meta.env?.VITE_VAPI_PUBLIC_KEY || '';
const ENV_PRIVATE_KEY = import.meta.env?.VITE_VAPI_PRIVATE_KEY || '';
const ENV_PHONE_ID = import.meta.env?.VITE_VAPI_PHONE_NUMBER_ID || '';
const ENV_ASSISTANT_ID = import.meta.env?.VITE_VAPI_ASSISTANT_ID || '';

const STORAGE_KEY_PUBLIC = 'dine_vapi_public_key';
const STORAGE_KEY_PRIVATE = 'dine_vapi_private_key';
const STORAGE_KEY_PHONE = 'dine_vapi_phone_number_id';
const STORAGE_KEY_ASSISTANT = 'dine_vapi_assistant_id';

let vapiInstance = null;
let activeCallSession = null;

/**
 * Gets the active Vapi Public Key (from env or localStorage)
 * @returns {string}
 */
export const getVapiPublicKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY_PUBLIC);
    if (local && local.trim()) return local.trim();
  }
  return (ENV_KEY || '').trim();
};

/**
 * Saves or updates Vapi Public Key in localStorage
 * @param {string} key 
 */
export const setVapiPublicKey = (key) => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY_PUBLIC, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_PUBLIC);
    }
  }
};

/**
 * Gets the active Vapi Private API Key (from env or localStorage)
 * @returns {string}
 */
export const getVapiPrivateKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY_PRIVATE);
    if (local && local.trim()) return local.trim();
  }
  return (ENV_PRIVATE_KEY || '').trim();
};

/**
 * Saves or updates Vapi Private Key in localStorage
 * @param {string} key 
 */
export const setVapiPrivateKey = (key) => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY_PRIVATE, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_PRIVATE);
    }
  }
};

/**
 * Gets the active Vapi Phone Number / ID
 * @returns {string}
 */
export const getVapiPhoneNumberId = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY_PHONE);
    if (local && local.trim()) return local.trim();
  }
  return (ENV_PHONE_ID || '').trim();
};

/**
 * Saves or updates Vapi Phone Number / ID in localStorage
 * @param {string} id 
 */
export const setVapiPhoneNumberId = (id) => {
  if (typeof window !== 'undefined') {
    if (id && id.trim()) {
      localStorage.setItem(STORAGE_KEY_PHONE, id.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_PHONE);
    }
  }
};

/**
 * Gets the active Vapi Assistant ID (if configured)
 * @returns {string}
 */
export const getVapiAssistantId = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY_ASSISTANT);
    if (local && local.trim()) return local.trim();
  }
  return (ENV_ASSISTANT_ID || '').trim();
};

/**
 * Saves or updates Vapi Assistant ID in localStorage
 * @param {string} id 
 */
export const setVapiAssistantId = (id) => {
  if (typeof window !== 'undefined') {
    if (id && id.trim()) {
      localStorage.setItem(STORAGE_KEY_ASSISTANT, id.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_ASSISTANT);
    }
  }
};

/**
 * Checks whether Vapi is configured with a valid public key
 * @returns {boolean}
 */
export const isVapiConfigured = () => {
  const key = getVapiPublicKey();
  return (
    typeof key === 'string' &&
    key.trim().length > 10 &&
    key !== 'your_vapi_public_key_here' &&
    !key.includes(' ')
  );
};

/**
 * Checks whether Vapi Private Key is configured for Outbound Phone Calling
 * @returns {boolean}
 */
export const isVapiPhoneCallReady = () => {
  const priv = getVapiPrivateKey();
  return typeof priv === 'string' && priv.trim().length > 15;
};

/**
 * Gets Vapi connection status label
 * @returns {string}
 */
export const getVapiStatus = () => {
  if (isVapiConfigured()) {
    return isVapiPhoneCallReady() ? '● Vapi Telephony Ready (Cellular & WebRTC)' : '● Vapi WebRTC Connected';
  }
  return '● Vapi Key Missing (Demo Simulator Active)';
};

/**
 * Builds the inline Vapi assistant configuration for Procurement Expediting
 * @param {object} context - ERP snapshot & PO details
 * @returns {object} Vapi assistant payload
 */
export const buildProcurementAssistantConfig = (context = {}) => {
  const {
    poId = 'PO-1045',
    supplier = 'ABC Components',
    contact = 'Rajesh Kumar (Dispatch Head)',
    item = 'Industrial Component A (500 units)',
    promisedDate = 'Sep 10, 2026',
    overdueDays = 5
  } = context;

  return {
    name: 'DINE AI Procurement Expediter',
    firstMessage: `Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order ${poId} for ${item}. Could you provide a delivery update?`,
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en'
    },
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are DINE AI — an autonomous enterprise procurement expediting agent calling ${supplier} regarding ${poId}.
Your contact person is ${contact}.
Order Details:
- Item: ${item}
- Original Promised Date: ${promisedDate} (${overdueDays} days overdue).
- Objective: Politely but firmly find out why the order is delayed, obtain a confirmed revised arrival date at our facility, and verify whether shipment is scheduled for dispatch.
- Keep responses concise (1 to 2 sentences max per turn). Speak like a professional enterprise supply chain manager.
- Once the supplier commits to a date (e.g., September 15th), confirm the date, thank them, and wrap up the call.`
        }
      ]
    },
    voice: {
      provider: 'cartesia',
      voiceId: '248be419-c632-4f23-adf1-5324ed7dbf1d'
    }
  };
};

/**
 * Helper to extract clean error message string
 */
export const extractVapiErrorMessage = (err) => {
  if (!err) return 'Unknown Vapi connection error';
  if (typeof err === 'string') return err;
  if (err.error && typeof err.error === 'object') {
    return err.error.message || JSON.stringify(err.error);
  }
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch (_) {
    return String(err);
  }
};

/**
 * Initializes and starts a live Vapi WebRTC session (In-Browser Microphone)
 */
export const startVapiCall = async ({
  context = {},
  onCallStart = () => {},
  onCallEnd = () => {},
  onSpeechStart = () => {},
  onSpeechEnd = () => {},
  onVolumeLevel = () => {},
  onMessage = () => {},
  onError = () => {}
} = {}) => {
  const publicKey = getVapiPublicKey();

  if (!publicKey) {
    const err = new Error('Vapi Public Key is not configured.');
    onError(err);
    throw err;
  }

  // Request browser microphone permission if possible
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (micErr) {
      console.warn('Microphone permission warning:', micErr);
      const err = new Error(`Microphone access denied: ${micErr.message || 'Please grant microphone permissions in your browser'}`);
      onError(err);
      throw err;
    }
  }

  // Terminate any existing session
  if (vapiInstance) {
    try {
      vapiInstance.stop();
    } catch (_) {}
    vapiInstance = null;
  }

  vapiInstance = new Vapi(publicKey);

  vapiInstance.on('call-start', () => {
    activeCallSession = {
      startTime: Date.now(),
      status: 'CONNECTED'
    };
    onCallStart();
  });

  vapiInstance.on('call-end', () => {
    activeCallSession = null;
    onCallEnd();
  });

  vapiInstance.on('speech-start', () => {
    onSpeechStart();
  });

  vapiInstance.on('speech-end', () => {
    onSpeechEnd();
  });

  vapiInstance.on('volume-level', (level) => {
    onVolumeLevel(level);
  });

  vapiInstance.on('message', (message) => {
    onMessage(message);
  });

  vapiInstance.on('error', (err) => {
    console.error('Vapi WebRTC Event Error:', err);
    const friendlyMsg = extractVapiErrorMessage(err);
    onError(new Error(friendlyMsg));
  });

  const assistantId = getVapiAssistantId();

  try {
    if (assistantId && assistantId.trim()) {
      await vapiInstance.start(assistantId.trim());
    } else {
      const assistantConfig = buildProcurementAssistantConfig(context);
      await vapiInstance.start(assistantConfig);
    }
    return vapiInstance;
  } catch (err) {
    const friendlyMsg = extractVapiErrorMessage(err);
    const customErr = new Error(friendlyMsg);
    onError(customErr);
    throw customErr;
  }
};

/**
 * Fetches all registered phone numbers on the user's Vapi account
 * @returns {Promise<Array>} List of phone number objects [{ id, number, name }]
 */
export const listVapiPhoneNumbers = async () => {
  const privateKey = getVapiPrivateKey();
  if (!privateKey) return [];

  try {
    const response = await fetch('https://api.vapi.ai/phone-number', {
      headers: {
        'Authorization': `Bearer ${privateKey}`
      }
    });
    if (response.ok) {
      const numbers = await response.json();
      return Array.isArray(numbers) ? numbers : [];
    }
  } catch (err) {
    console.warn('Error fetching Vapi phone numbers:', err);
  }
  return [];
};

/**
 * Triggers an actual Outbound Phone Call over cellular PSTN network to a mobile number
 * @param {object} params
 * @param {string} params.targetNumber - The phone number to ring (e.g. +12014222388 or +9198...)
 * @param {string} params.phoneNumberId - The Vapi phone number ID / Vapi provisioned number
 * @param {object} params.context - ERP context
 * @returns {Promise<object>} Outbound call response with callId
 */
export const triggerOutboundPhoneCall = async ({
  targetNumber,
  phoneNumberId,
  assistantId,
  context = {}
} = {}) => {
  const privateKey = getVapiPrivateKey();
  const activePhoneId = (phoneNumberId || getVapiPhoneNumberId() || '').trim();
  const activeAssistantId = (assistantId || getVapiAssistantId() || '').trim();

  if (!privateKey) {
    throw new Error('Vapi Private API Key is required to place outbound cellular phone calls. Please configure it in Settings or .env');
  }

  if (!targetNumber || targetNumber.trim().length < 6) {
    throw new Error('Valid target phone number is required (e.g., +12014222388 or +91...)');
  }

  const payload = {
    customer: {
      number: targetNumber.trim()
    }
  };

  // Resolve phoneNumberId: check if activePhoneId is a UUID or a phone string
  if (activePhoneId) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activePhoneId);
    if (isUUID) {
      payload.phoneNumberId = activePhoneId;
    } else {
      // Auto-lookup matching phoneNumberId from user's Vapi account
      try {
        const registeredNumbers = await listVapiPhoneNumbers();
        const cleanQuery = activePhoneId.replace(/[^0-9]/g, '');
        const match = registeredNumbers.find(n => {
          const numDigits = (n.number || '').replace(/[^0-9]/g, '');
          return numDigits.includes(cleanQuery) || cleanQuery.includes(numDigits) || n.id === activePhoneId;
        });

        if (match && match.id) {
          payload.phoneNumberId = match.id;
        } else if (registeredNumbers.length > 0 && registeredNumbers[0].id) {
          payload.phoneNumberId = registeredNumbers[0].id;
        }
      } catch (err) {
        console.warn('Could not auto-resolve phone number ID:', err);
      }
    }
  } else {
    // If no phone ID specified, pick the first available number on account
    try {
      const registeredNumbers = await listVapiPhoneNumbers();
      if (registeredNumbers.length > 0 && registeredNumbers[0].id) {
        payload.phoneNumberId = registeredNumbers[0].id;
      }
    } catch (_) {}
  }

  // Assistant Configuration
  if (activeAssistantId) {
    payload.assistantId = activeAssistantId;
  } else {
    payload.assistant = buildProcurementAssistantConfig(context);
  }

  const response = await fetch('https://api.vapi.ai/call/phone', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${privateKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = Array.isArray(errorBody.message)
      ? errorBody.message.join(', ')
      : errorBody.message || errorBody.error || `Failed to trigger outbound phone call (Status: ${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
};


/**
 * Fetches the live status and transcript of an outbound phone call
 * @param {string} callId 
 * @returns {Promise<object>}
 */
export const fetchVapiCallDetails = async (callId) => {
  const privateKey = getVapiPrivateKey();
  if (!privateKey || !callId) return null;

  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${privateKey}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Error fetching Vapi call status:', err);
  }
  return null;
};

/**
 * Stops the active Vapi session
 */
export const stopVapiCall = () => {
  if (vapiInstance) {
    try {
      vapiInstance.stop();
    } catch (e) {
      console.warn('Error stopping Vapi call:', e);
    }
    vapiInstance = null;
  }
  activeCallSession = null;
};

/**
 * Toggles or sets microphone mute state
 * @param {boolean} isMuted 
 */
export const setVapiMuted = (isMuted) => {
  if (vapiInstance && typeof vapiInstance.setMuted === 'function') {
    vapiInstance.setMuted(!!isMuted);
  }
};

export default {
  getVapiPublicKey,
  setVapiPublicKey,
  getVapiPrivateKey,
  setVapiPrivateKey,
  getVapiPhoneNumberId,
  setVapiPhoneNumberId,
  getVapiAssistantId,
  setVapiAssistantId,
  isVapiConfigured,
  isVapiPhoneCallReady,
  getVapiStatus,
  buildProcurementAssistantConfig,
  startVapiCall,
  triggerOutboundPhoneCall,
  fetchVapiCallDetails,
  listVapiPhoneNumbers,
  stopVapiCall,
  setVapiMuted
};

