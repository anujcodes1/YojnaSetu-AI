import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Sparkles, Bot, User } from 'lucide-react';
import { chatAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  "What schemes are available for farmers?",
  "How can I apply for PM-KISAN?",
  "What is PMAY housing scheme?",
  "Schemes for women entrepreneurs",
  "Education scholarships for SC students",
  "Health insurance schemes for BPL families",
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUser ? 'bg-saffron-600' : 'bg-navy-800'}`}>
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-saffron-600 text-white rounded-tr-md' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-md'}`}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
        {msg.timestamp && (
          <p className={`text-xs mt-1.5 ${isUser ? 'text-saffron-200' : 'text-gray-400'}`}>
            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatAPI.getHistory().then(res => {
      const { messages: msgs, sessionId: sid } = res.data.data;
      setMessages(msgs || []);
      setSessionId(sid);
      setHistoryLoaded(true);
    }).catch(() => setHistoryLoaded(true));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setLoading(true);

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);

    try {
      const res = await chatAPI.sendMessage({ message: msg, sessionId });
      const { assistantMessage, sessionId: newSid } = res.data.data;
      if (newSid && !sessionId) setSessionId(newSid);
      setMessages(p => [...p, { role: 'assistant', content: assistantMessage, timestamp: new Date() }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "Sorry, I couldn't connect right now. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    try {
      await chatAPI.clearHistory();
      setMessages([]);
      setSessionId(null);
      toast.success('Chat cleared');
    } catch { toast.error('Could not clear chat'); }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div>
          <h1 className="font-display font-bold text-xl text-navy-800 flex items-center gap-2">
            <Sparkles size={20} className="text-saffron-600" /> AI Assistant
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Powered by Gemini · Knows your profile</p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {!historyLoaded && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-saffron-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {historyLoaded && messages.length === 0 && (
          <div className="py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center mx-auto mb-4">
              <Bot size={28} className="text-saffron-600" />
            </div>
            <h3 className="font-semibold text-navy-800 mb-1">Ask me about government schemes</h3>
            <p className="text-gray-500 text-sm mb-6">I know your profile and can guide you to the right schemes.</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-xs p-3 bg-white border border-gray-200 rounded-xl hover:border-saffron-400 hover:bg-saffron-50 transition-all text-gray-700 leading-snug">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-gray-100 mt-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask about any scheme, eligibility, or how to apply..."
            className="input-field flex-1 resize-none leading-relaxed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="btn-primary px-4 py-2.5 flex-shrink-0 flex items-center justify-center">
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">AI responses are informational. Verify with official sources.</p>
      </div>
    </div>
  );
}
