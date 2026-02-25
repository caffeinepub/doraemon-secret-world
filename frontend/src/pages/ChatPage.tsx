import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useGetAllMessages, useAddMessage } from '../hooks/useQueries';
import { generateBotResponse } from '../utils/botResponses';
import GlassPanel from '../components/GlassPanel';
import type { Message } from '../backend';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-dora-blue/40 flex-shrink-0 flex items-center justify-center bg-dora-blue/20 relative">
        <img
          src="/assets/generated/bot-avatar.dim_128x128.png"
          alt="Bot"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <Bot size={16} className="text-dora-blue-light absolute" />
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
          <>
            <img
              src="/assets/generated/bot-avatar.dim_128x128.png"
              alt="Bot"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Bot size={16} className="text-dora-blue-light absolute" />
          </>
        ) : (
          <User size={16} className="text-dora-red" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'} px-4 py-3`}>
        <p className="font-nunito text-sm text-foreground/90 leading-relaxed">
          {message.content}
        </p>
        <p className={`text-xs mt-1 font-space ${isBot ? 'text-dora-blue-light/50' : 'text-foreground/30'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { data: messages, isLoading } = useGetAllMessages();
  const addMessage = useAddMessage();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync backend messages to local state
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || addMessage.isPending || isTyping) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message locally immediately
    const userMsg: Message = { sender: 'user', content: text, timestamp };
    setLocalMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Save user message to backend
    try {
      await addMessage.mutateAsync({ sender: 'user', content: text, timestamp });
    } catch {
      // Continue even if backend fails
    }

    // Show typing indicator
    setIsTyping(true);

    // Generate bot response after delay
    setTimeout(async () => {
      const botResponse = generateBotResponse(text);
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsg: Message = { sender: 'bot', content: botResponse, timestamp: botTimestamp };

      setIsTyping(false);
      setLocalMessages((prev) => [...prev, botMsg]);

      // Save bot message to backend
      try {
        await addMessage.mutateAsync({ sender: 'bot', content: botResponse, timestamp: botTimestamp });
      } catch {
        // Continue even if backend fails
      }
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayMessages = localMessages.length > 0 ? localMessages : (messages ?? []);

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dora-blue/40 glow-blue animate-pulse-glow">
              <img
                src="/assets/generated/bot-avatar.dim_128x128.png"
                alt="Bot Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  if (el.parentElement) {
                    el.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:oklch(0.55 0.22 240 / 0.2)">🔵</div>';
                  }
                }}
              />
            </div>
          </div>
          <h1 className="font-orbitron text-2xl font-bold gradient-text-blue mb-1">
            Chat With Me
          </h1>
          <p className="text-foreground/50 font-space text-sm">
            I'm always here for you 💙
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-space">Online</span>
          </div>
        </div>

        {/* Chat Container */}
        <GlassPanel glowColor="blue" className="flex flex-col" style={{ height: '60vh' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 chat-scroll custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-dora-blue/30 border-t-dora-blue rounded-full animate-spin" />
              </div>
            ) : displayMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-5xl mb-4 animate-float">💙</div>
                <p className="text-foreground/50 font-nunito text-lg">
                  Say hello! I'm waiting for you 🌟
                </p>
                <p className="text-foreground/30 font-space text-sm mt-2">
                  Type a message below to start chatting
                </p>
              </div>
            ) : (
              <>
                {displayMessages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    message={msg}
                    isBot={msg.sender === 'bot'}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-dora-blue/20" />

          {/* Input Area */}
          <div className="p-4 flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... 💙"
              className="dora-input flex-1 py-3"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || addMessage.isPending}
              className="w-12 h-12 rounded-full bg-dora-blue/30 border border-dora-blue/50 flex items-center justify-center text-dora-blue-light hover:bg-dora-blue/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed glow-blue"
            >
              <Send size={18} />
            </button>
          </div>
        </GlassPanel>

        {/* Quick replies */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Hey! 👋', 'I miss you 💙', 'Tell me something sweet 🌟', 'I love Doraemon! 🔵'].map((quick) => (
            <button
              key={quick}
              onClick={() => {
                setInput(quick);
                inputRef.current?.focus();
              }}
              className="px-3 py-1.5 rounded-full glass border border-dora-blue/30 text-xs font-space text-foreground/60 hover:text-dora-blue-light hover:border-dora-blue/60 transition-all duration-300"
            >
              {quick}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
