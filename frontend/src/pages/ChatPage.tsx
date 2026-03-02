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

  // Play Hello sound once on mount
  // Audio file: /assets/Hello.mp3.m4a
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    try {
      audio = new Audio('/assets/Hello.mp3.m4a');
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked — play on first user interaction
          const resumeOnInteraction = () => {
            audio?.play().catch(() => {});
            document.removeEventListener('click', resumeOnInteraction, true);
            document.removeEventListener('touchstart', resumeOnInteraction, true);
          };
          document.addEventListener('click', resumeOnInteraction, { capture: true, passive: true });
          document.addEventListener('touchstart', resumeOnInteraction, { capture: true, passive: true });
        });
      }
    } catch {
      // Silently ignore audio errors
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    setInput('');

    const userMsg: Message = {
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLocalMessages((prev) => [...prev, userMsg]);

    try {
      await addMessage.mutateAsync({
        sender: 'user',
        content,
        timestamp: userMsg.timestamp,
      });
    } catch {
      // Silently ignore
    }

    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;

    setTimeout(async () => {
      setIsTyping(false);
      const botContent = generateBotResponse(content);
      const botMsg: Message = {
        sender: 'nobita',
        content: botContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLocalMessages((prev) => [...prev, botMsg]);

      try {
        await addMessage.mutateAsync({
          sender: 'nobita',
          content: botContent,
          timestamp: botMsg.timestamp,
        });
      } catch {
        // Silently ignore
      }
    }, delay);
  };

  const displayMessages = localMessages.length > 0 ? localMessages : (messages ?? []);

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-dora-blue/40 bg-dora-blue/10 flex-shrink-0">
            <img
              src="/assets/generated/nobita-avatar.dim_200x200.png"
              alt="Nobita"
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                if (el.parentElement) {
                  el.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🧒</div>';
                }
              }}
            />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-blue-light">
              Chat with Nobita
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-foreground/50 text-sm font-space">Online — ready to chat!</span>
            </div>
          </div>
        </div>

        {/* Chat window */}
        <GlassPanel glowColor="blue" className="p-4 mb-4">
          <div className="h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading && localMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-dora-blue/30 border-t-dora-blue-light rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-foreground/40 font-space text-sm">Loading messages...</p>
                </div>
              </div>
            ) : displayMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-3 animate-float">💬</div>
                  <p className="text-foreground/40 font-space text-sm">
                    Say hello to Nobita! 👋
                  </p>
                </div>
              </div>
            ) : (
              <>
                {displayMessages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    message={msg}
                    isBot={msg.sender !== 'user'}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </GlassPanel>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="text-xs font-space px-3 py-1.5 rounded-full glass border border-dora-blue/20 text-foreground/60 hover:text-dora-blue-light hover:border-dora-blue/50 transition-all duration-200"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input area */}
        <GlassPanel glowColor="blue" className="p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to Nobita..."
              className="dora-input flex-1 text-sm"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-dora-blue/30 border border-dora-blue/60 flex items-center justify-center text-dora-blue-light hover:bg-dora-blue/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </GlassPanel>
      </div>
    </div>
  );
}
