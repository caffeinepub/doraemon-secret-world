import { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { useGetAllMessages, useAddMessage } from '../hooks/useQueries';
import { generateBotResponse } from '../utils/botResponses';
import GlassPanel from '../components/GlassPanel';
import type { Message } from '../backend';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-dora-blue/40 flex-shrink-0 flex items-center justify-center bg-dora-blue/20 relative">
        <img
          src="/assets/generated/nobita-avatar.dim_200x200.png"
          alt="Nobita"
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
          }}
        />
      </div>
      <div className="chat-bubble-bot px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <div className="typing-dot w-2 h-2 rounded-full bg-dora-blue-light" />
          <div className="typing-dot w-2 h-2 rounded-full bg-dora-blue-light" />
          <div className="typing-dot w-2 h-2 rounded-full bg-dora-blue-light" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isBot }: { message: Message; isBot: boolean }) {
  return (
    <div className={`flex items-end gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 overflow-hidden relative ${
          isBot
            ? 'border-dora-blue/40 bg-dora-blue/20'
            : 'border-dora-red/40 bg-dora-red/20'
        }`}
      >
        {isBot ? (
          <img
            src="/assets/generated/nobita-avatar.dim_200x200.png"
            alt="Nobita"
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              if (el.parentElement) {
                el.parentElement.innerHTML = '<span style="font-size:1.2rem">🧒</span>';
              }
            }}
          />
        ) : (
          <User size={16} className="text-dora-red" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'} px-4 py-3`}>
        <p className="font-nunito text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className={`text-xs mt-1 font-space ${isBot ? 'text-dora-blue-light/50' : 'text-foreground/30'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

const QUICK_REPLIES = [
  'Hey Nobita! 👋',
  'Tell me a joke 😂',
  'What is Doraemon? 🔵',
  'Capital of Japan? 🗾',
  'I miss you 💙',
  'Tell me about gadgets! 🎁',
];

export default function ChatPage() {
  const { data: messages, isLoading } = useGetAllMessages();
  const addMessage = useAddMessage();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Play Hello sound once on mount (triggered by user interaction via click on nav)
  useEffect(() => {
    const playHello = () => {
      try {
        const audio = new Audio('/assets/Hello.mp3.m4a');
        audio.play().catch(() => {
          // Silently ignore autoplay policy errors
        });
      } catch {
        // Silently ignore audio errors
      }
    };

    // Small delay to ensure we're within a user-gesture context from navigation click
    const timer = setTimeout(playHello, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLocalMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Save user message to backend
    addMessage.mutate({
      sender: 'user',
      content: text.trim(),
      timestamp: userMsg.timestamp,
    });

    // Simulate bot typing delay
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const botResponse = generateBotResponse(text.trim());
      const botMsg: Message = {
        sender: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLocalMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      // Save bot message to backend
      addMessage.mutate({
        sender: 'bot',
        content: botResponse,
        timestamp: botMsg.timestamp,
      });
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <GlassPanel glowColor="blue" className="p-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dora-blue/50 flex-shrink-0 relative">
            <img
              src="/assets/generated/nobita-avatar.dim_200x200.png"
              alt="Nobita"
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                if (el.parentElement) {
                  el.parentElement.innerHTML = '<span style="font-size:2rem; display:flex; align-items:center; justify-content:center; height:100%">🧒</span>';
                }
              }}
            />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-foreground">Chat with Nobita</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-foreground/50 font-space">Online • Ready to chat!</span>
            </div>
          </div>
          <div className="ml-auto text-2xl">🧒</div>
        </div>
      </GlassPanel>

      {/* Messages area */}
      <GlassPanel glowColor="cyan" className="flex-1 overflow-hidden flex flex-col p-4 min-h-0">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-dora-blue/30 border-t-dora-blue rounded-full animate-spin mx-auto mb-2" />
                <p className="text-foreground/40 text-sm font-space">Loading messages...</p>
              </div>
            </div>
          ) : localMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl mb-3">🧒</div>
                <p className="text-foreground/50 font-nunito text-sm">
                  Say hi to Nobita! He's waiting... 💙
                </p>
              </div>
            </div>
          ) : (
            <>
              {localMessages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  message={msg}
                  isBot={msg.sender === 'bot'}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </GlassPanel>

      {/* Quick replies */}
      <div className="flex gap-2 overflow-x-auto py-3 flex-shrink-0 custom-scrollbar">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => sendMessage(reply)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-dora-blue/10 border border-dora-blue/30 text-xs font-nunito text-foreground/70 hover:bg-dora-blue/20 hover:text-foreground transition-all"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <GlassPanel glowColor="blue" className="p-3 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to Nobita... 💬"
            className="dora-input flex-1 text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="dora-btn dora-btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
