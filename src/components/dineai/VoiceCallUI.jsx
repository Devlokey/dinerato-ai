import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  FastForward,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  User,
  Bot,
  Settings,
  Radio,
  Key,
  X,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import {
  isVapiConfigured,
  getVapiPublicKey,
  setVapiPublicKey,
  getVapiAssistantId,
  setVapiAssistantId,
  startVapiCall,
  stopVapiCall,
  setVapiMuted
} from '../../services/vapiService';

const DEFAULT_DIALOGUE_LINES = [
  {
    speaker: 'DINE AI',
    isAI: true,
    text: "Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order PO-1045 for 500 units of Industrial Component A. Could you provide a delivery update?"
  },
  {
    speaker: 'ABC COMPONENTS',
    isAI: false,
    text: "Yes, apologies for the delay. We had a production issue but it's resolved. The shipment is ready to go tomorrow morning."
  },
  {
    speaker: 'DINE AI',
    isAI: true,
    text: "That's helpful. Can you confirm delivery to our facility by September 15th?"
  },
  {
    speaker: 'ABC COMPONENTS',
    isAI: false,
    text: "Yes, confirmed. September 15th delivery."
  }
];

export const VoiceCallUI = ({
  callData = {},
  onComplete = () => {},
  onClose = () => {}
}) => {
  const [callMode, setCallMode] = useState(() => (isVapiConfigured() ? 'vapi' : 'simulation'));
  const [seconds, setSeconds] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);

  // Vapi live state
  const [vapiConnecting, setVapiConnecting] = useState(false);
  const [vapiConnected, setVapiConnected] = useState(false);
  const [vapiSpeakingRole, setVapiSpeakingRole] = useState('idle');
  const [liveVolume, setLiveVolume] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [vapiError, setVapiError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [publicKeyInput, setPublicKeyInput] = useState(getVapiPublicKey() || '');
  const [assistantIdInput, setAssistantIdInput] = useState(getVapiAssistantId() || '');

  const timerRef = useRef(null);
  const typewriterRef = useRef(null);
  const transcriptContainerRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [currentLineIndex, typedChars, liveTranscript]);

  // Duration timer
  useEffect(() => {
    if (isCompleted) return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (callMode === 'simulation' && prev >= 42) {
          clearInterval(timerRef.current);
          return 42;
        }
        return prev + 1;
      });
    }, isFastForward ? 80 : 1000);
    return () => clearInterval(timerRef.current);
  }, [isCompleted, isFastForward, callMode]);

  // Vapi WebRTC initialization
  useEffect(() => {
    if (callMode !== 'vapi') return;

    let isMounted = true;
    setVapiConnecting(true);
    setVapiError(null);

    const initVapi = async () => {
      try {
        await startVapiCall({
          context: {
            poId: callData.poId || 'PO-1045',
            supplier: callData.supplier || 'ABC Components',
            contact: callData.contact || 'Rajesh Kumar (Dispatch Head)',
            item: callData.regarding || 'Industrial Component A (500 units)',
            promisedDate: 'Sep 10, 2026',
            overdueDays: 5
          },
          onCallStart: () => {
            if (isMounted) { setVapiConnecting(false); setVapiConnected(true); }
          },
          onCallEnd: () => {
            if (isMounted) { setVapiConnecting(false); setVapiConnected(false); setIsCompleted(true); }
          },
          onSpeechStart: () => { if (isMounted) setVapiSpeakingRole('ai'); },
          onSpeechEnd: () => { if (isMounted) setVapiSpeakingRole('idle'); },
          onVolumeLevel: (level) => { if (isMounted) setLiveVolume(level); },
          onMessage: (message) => {
            if (!isMounted) return;
            if (message?.type === 'transcript' && message.transcript) {
              const speaker = message.role === 'assistant' ? 'DINE AI' : 'YOU';
              const isAI = message.role === 'assistant';
              setLiveTranscript(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.isAI === isAI && message.transcriptType === 'partial') {
                  updated[updated.length - 1] = { ...last, text: message.transcript };
                  return updated;
                }
                if (message.transcriptType === 'final') {
                  return [...prev, {
                    speaker, isAI, text: message.transcript,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  }];
                }
                return prev;
              });
            }
          },
          onError: (err) => {
            if (isMounted) {
              setVapiConnecting(false);
              setVapiConnected(false);
              setVapiError(err?.message || 'Failed to connect to Vapi');
            }
          }
        });
      } catch (err) {
        if (isMounted) {
          setVapiConnecting(false);
          setVapiConnected(false);
          setVapiError(err?.message || 'Vapi initialization failed');
        }
      }
    };

    initVapi();
    return () => { isMounted = false; stopVapiCall(); };
  }, [callMode, retryTrigger]);

  // Typewriter for simulation mode
  useEffect(() => {
    if (callMode !== 'simulation' || isCompleted) return;
    const currentLine = DEFAULT_DIALOGUE_LINES[currentLineIndex];
    if (!currentLine) { setIsCompleted(true); setSeconds(42); return; }

    if (typedChars < currentLine.text.length) {
      const charDelay = isFastForward ? 5 : (currentLine.isAI ? 22 : 28);
      typewriterRef.current = setTimeout(() => setTypedChars(prev => prev + 1), charDelay);
    } else {
      const linePause = isFastForward ? 80 : 700;
      typewriterRef.current = setTimeout(() => {
        if (currentLineIndex < DEFAULT_DIALOGUE_LINES.length - 1) {
          setCurrentLineIndex(prev => prev + 1);
          setTypedChars(0);
        } else {
          setIsCompleted(true);
          setSeconds(42);
        }
      }, linePause);
    }
    return () => clearTimeout(typewriterRef.current);
  }, [currentLineIndex, typedChars, isCompleted, isFastForward, callMode]);

  const handleEndCall = () => {
    if (callMode === 'vapi') stopVapiCall();
    setCurrentLineIndex(DEFAULT_DIALOGUE_LINES.length - 1);
    setTypedChars(DEFAULT_DIALOGUE_LINES[DEFAULT_DIALOGUE_LINES.length - 1].text.length);
    setSeconds(prev => Math.max(prev, 42));
    setIsCompleted(true);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setVapiMuted(next);
  };

  const handleSaveSettings = () => {
    setVapiPublicKey(publicKeyInput);
    setVapiAssistantId(assistantIdInput);
    setShowSettings(false);
    if (publicKeyInput.trim()) {
      setCallMode('vapi');
      setVapiError(null);
      setLiveTranscript([]);
      setIsCompleted(false);
      setSeconds(0);
      setRetryTrigger(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    if (callMode === 'vapi') stopVapiCall();
    onComplete({
      duration: formatTimer(seconds),
      confirmedDate: '2026-09-15',
      confidence: 94,
      dialogue: liveTranscript.length > 0 ? liveTranscript : DEFAULT_DIALOGUE_LINES,
      mode: callMode
    });
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeSpeaker = callMode === 'vapi'
    ? { speaker: vapiSpeakingRole === 'ai' ? 'DINE AI' : 'You', isAI: vapiSpeakingRole === 'ai' }
    : (DEFAULT_DIALOGUE_LINES[currentLineIndex] || DEFAULT_DIALOGUE_LINES[DEFAULT_DIALOGUE_LINES.length - 1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burnt-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-burnt-900 border border-burnt-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 bg-burnt-950 border-b border-burnt-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Phone className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">CALL IN PROGRESS</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  callMode === 'vapi'
                    ? vapiConnected
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : vapiConnecting
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-burnt-700/40 text-burnt-300 border-burnt-700'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {callMode === 'vapi'
                    ? vapiConnected ? '● VAPI LIVE'
                    : vapiConnecting ? '● CONNECTING...'
                    : '● VAPI READY'
                    : '● SIMULATION'}
                </span>
              </div>
              <p className="text-xs text-burnt-300">
                {callMode === 'vapi' ? 'Browser WebRTC — speak through your microphone' : 'Demo simulation mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-burnt-800 hover:bg-burnt-700 text-burnt-300 hover:text-white border border-burnt-700 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 bg-burnt-800/80 border border-burnt-700 rounded-lg text-center font-mono">
              <div className="text-[10px] text-burnt-400 uppercase tracking-wider font-sans">Duration</div>
              <div className="text-sm font-bold text-emerald-400">{formatTimer(seconds)}</div>
            </div>
          </div>
        </div>

        {/* Call Metadata */}
        <div className="px-6 py-3 bg-burnt-800/50 border-b border-burnt-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-burnt-400 block text-[11px]">Supplier</span>
            <span className="font-semibold text-white">{callData.supplier || 'ABC Components'}</span>
          </div>
          <div>
            <span className="text-burnt-400 block text-[11px]">Contact</span>
            <span className="font-semibold text-white">{callData.contact || 'Rajesh Kumar'}</span>
          </div>
          <div>
            <span className="text-burnt-400 block text-[11px]">Regarding</span>
            <span className="font-semibold text-amber-300 font-mono">{callData.poId || 'PO-1045'}</span>
          </div>
          <div>
            <span className="text-burnt-400 block text-[11px]">Mode</span>
            <span className="font-mono text-burnt-200">{callMode === 'vapi' ? 'Vapi WebRTC' : 'Simulation'}</span>
          </div>
        </div>

        {/* Error Banner */}
        {vapiError && (
          <div className="px-6 py-3 bg-red-950/60 border-b border-red-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-100 font-semibold">Vapi Notice:</strong>
                <span className="text-red-300/90">{vapiError}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { setVapiError(null); setRetryTrigger(prev => prev + 1); }}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
              <button
                onClick={() => { setVapiError(null); setCallMode('simulation'); }}
                className="px-2.5 py-1 bg-burnt-800 hover:bg-burnt-700 text-burnt-200 rounded text-[11px]"
              >
                Use Simulation
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-[11px] font-semibold"
              >
                Settings
              </button>
            </div>
          </div>
        )}

        {/* Waveform */}
        <div className="px-6 py-4 bg-burnt-950/60 border-b border-burnt-800/70">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${activeSpeaker.isAI ? 'text-blue-400' : 'text-amber-400'}`}>
              {activeSpeaker.isAI
                ? <><Sparkles className="w-3.5 h-3.5" /> {activeSpeaker.speaker}</>
                : <><User className="w-3.5 h-3.5" /> {activeSpeaker.speaker}</>
              }
            </span>
            <span className="text-[11px] text-burnt-400 font-mono flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              {callMode === 'vapi' ? 'Opus WebRTC • 48kHz' : 'SIP Codec: Opus HD • 48kHz'}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 h-10 w-full">
            {[40,65,85,30,95,70,45,90,60,100,75,40,85,95,55,35,80,60,45,90,70,30].map((height, i) => {
              const h = callMode === 'vapi' && liveVolume > 0
                ? Math.min(100, Math.max(10, liveVolume * 180 * (Math.sin(i + seconds) * 0.3 + 0.7)))
                : Math.max(6, height * (Math.sin(seconds * 3 + i) * 0.4 + 0.6));
              return (
                <div key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isCompleted ? 'bg-burnt-700' : activeSpeaker.isAI ? 'bg-blue-400 animate-pulse' : 'bg-amber-400 animate-pulse'
                  }`}
                  style={{ height: isCompleted ? '4px' : `${h}%`, animationDelay: `${i * 45}ms` }}
                />
              );
            })}
          </div>
        </div>

        {/* Transcript */}
        <div
          ref={transcriptContainerRef}
          className="flex-1 p-6 overflow-y-auto space-y-4 bg-burnt-900/90"
          style={{ minHeight: '220px', maxHeight: '340px' }}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-burnt-400 border-b border-burnt-800 pb-1 flex items-center justify-between">
            <span>{callMode === 'vapi' ? 'Live Transcript — Deepgram Nova-2' : 'Live Audio Transcript'}</span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" /> NLP Verified
            </span>
          </div>

          {callMode === 'vapi' ? (
            liveTranscript.length > 0 ? (
              liveTranscript.map((line, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border text-xs ${
                  line.isAI
                    ? 'bg-blue-950/30 border-blue-900/50 text-blue-100 ml-4'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-100 mr-4'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold flex items-center gap-1 ${line.isAI ? 'text-blue-400' : 'text-amber-400'}`}>
                      {line.isAI ? <><Bot className="w-3.5 h-3.5" /> DINE AI</> : <><User className="w-3.5 h-3.5" /> You</>}
                    </span>
                    <span className="text-[10px] text-burnt-400 font-mono">{line.timestamp}</span>
                  </div>
                  <div className="text-burnt-100 leading-relaxed">{line.text}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-burnt-400 space-y-2">
                <Mic className={`w-6 h-6 mx-auto ${vapiConnecting ? 'text-amber-400 animate-pulse' : 'text-purple-400 animate-pulse'}`} />
                <p className={vapiConnecting ? 'text-amber-300 font-medium' : ''}>
                  {vapiConnecting ? 'Connecting to Vapi…' : 'Speak into your mic — DINE AI will respond live.'}
                </p>
              </div>
            )
          ) : (
            DEFAULT_DIALOGUE_LINES.map((line, idx) => {
              if (idx > currentLineIndex) return null;
              const isCurrentLine = idx === currentLineIndex;
              const text = isCurrentLine ? line.text.slice(0, typedChars) : line.text;
              return (
                <div key={idx} className={`p-3.5 rounded-xl border text-xs ${
                  line.isAI
                    ? 'bg-blue-950/30 border-blue-900/50 text-blue-100 ml-4'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-100 mr-4'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold flex items-center gap-1 ${line.isAI ? 'text-blue-400' : 'text-amber-400'}`}>
                      {line.isAI
                        ? <><Bot className="w-3.5 h-3.5" /> DINE AI</>
                        : <><User className="w-3.5 h-3.5" /> {callData.contact?.split(' ')[0] || 'Rajesh'}</>
                      }
                    </span>
                    <span className="text-[10px] text-burnt-400 font-mono">
                      {['00:04','00:18','00:30','00:41'][idx]}
                    </span>
                  </div>
                  <div className="text-burnt-100 leading-relaxed">
                    {text}
                    {isCurrentLine && !isCompleted && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-accent-blue align-middle animate-ping" />
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isCompleted && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Call Concluded</strong> · Delivery commitment captured: <strong>September 15, 2026</strong> (94% confidence)</span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200 border border-emerald-700/50">
                {formatTimer(seconds)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-burnt-950 border-t border-burnt-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-burnt-800 border-burnt-700 text-burnt-300 hover:text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
            </button>

            {!isCompleted && callMode === 'simulation' && (
              <button
                onClick={handleEndCall}
                className="px-3 py-2 bg-burnt-800 hover:bg-burnt-700 border border-burnt-700 text-burnt-200 hover:text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                Skip to End
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/30 flex items-center space-x-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Proceed to Post-Call Analysis & Approval</span>
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-red-900/30 flex items-center space-x-2 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call ({formatTimer(seconds)})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-burnt-900 border border-burnt-700 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-burnt-800 pb-3">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-bold text-white">Vapi Settings</h4>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-burnt-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-burnt-300 font-semibold mb-1">Vapi Public Key</label>
                <input
                  type="text"
                  value={publicKeyInput}
                  onChange={(e) => setPublicKeyInput(e.target.value)}
                  placeholder="7a586083-aa70-43f3-..."
                  className="w-full px-3 py-2 bg-burnt-950 border border-burnt-700 rounded-lg text-white font-mono placeholder-burnt-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-burnt-400 mt-1">
                  From <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" className="text-purple-400 underline">dashboard.vapi.ai</a> → API Keys → Public Key
                </p>
              </div>

              <div>
                <label className="block text-burnt-300 font-semibold mb-1">Assistant ID <span className="text-burnt-500 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={assistantIdInput}
                  onChange={(e) => setAssistantIdInput(e.target.value)}
                  placeholder="Leave empty to use built-in procurement assistant"
                  className="w-full px-3 py-2 bg-burnt-950 border border-burnt-700 rounded-lg text-white font-mono placeholder-burnt-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-burnt-300 font-semibold mb-1">Call Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setCallMode('vapi')}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold ${callMode === 'vapi' ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-burnt-950 border-burnt-800 text-burnt-400'}`}>
                    Vapi WebRTC (Live Mic)
                  </button>
                  <button type="button" onClick={() => setCallMode('simulation')}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold ${callMode === 'simulation' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200' : 'bg-burnt-950 border-burnt-800 text-burnt-400'}`}>
                    Demo Simulation
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-burnt-800">
              <button onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-burnt-800 hover:bg-burnt-700 text-burnt-200 text-xs rounded-lg font-medium">
                Cancel
              </button>
              <button onClick={handleSaveSettings}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg">
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCallUI;
