import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import { useAddMessage, useGetAllMessages } from "../hooks/useQueries";

const NOBITA_RESPONSES = [
  "Doraemon! Help me! 😭",
  "I wish I had a gadget for that...",
  "Shizuka-chan is so amazing! 💕",
  "I don't want to study! Let's play instead!",
  "Doraemon, take out something from your pocket!",
  "Giant is being mean to me again... 😢",
  "I got 0 on my test again... 😅",
  "If only I had the Small Light gadget...",
  "The Anywhere Door would be so useful right now!",
  "Doraemon's dorayaki smells so good! 🍡",
  "I want to go on an adventure!",
  "Maybe I should ask Doraemon for help...",
];

function getNobitaResponse(): string {
  return NOBITA_RESPONSES[Math.floor(Math.random() * NOBITA_RESPONSES.length)];
}

interface LocalMessage {
  id: string;
  sender: "user" | "nobita";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: "0",
      sender: "nobita",
      content: "Hi! I'm Nobita! Want to talk about Doraemon? 😊",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: addMessage } = useAddMessage();
  const helloAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play hello sound on mount
    const audio = new Audio("/assets/Hello.mp3.m4a");
    audio.volume = 0.6;
    helloAudioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };

    audio.play().catch(() => {
      document.addEventListener("click", tryPlay, true);
      document.addEventListener("touchstart", tryPlay, true);
    });

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollRef is a stable ref
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: LocalMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Save to backend
    try {
      await addMessage({
        sender: "user",
        content: userMsg.content,
        timestamp: userMsg.timestamp,
      });
    } catch {
      // Ignore backend errors for chat
    }

    // Simulate Nobita typing
    setTimeout(
      async () => {
        const response = getNobitaResponse();
        const nobitaMsg: LocalMessage = {
          id: (Date.now() + 1).toString(),
          sender: "nobita",
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, nobitaMsg]);
        setIsTyping(false);

        try {
          await addMessage({
            sender: "nobita",
            content: response,
            timestamp: nobitaMsg.timestamp,
          });
        } catch {
          // Ignore
        }
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          💬 Chat with Nobita
        </h1>
        <p className="text-white/50 text-sm">Nobita is always ready to chat!</p>
      </div>

      <GlassPanel glow="yellow" className="flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <img
            src="/assets/generated/nobita-avatar.dim_200x200.png"
            alt="Nobita"
            className="w-10 h-10 rounded-full object-cover border-2 border-doraemon-yellow/50"
          />
          <div>
            <p className="font-semibold text-white">Nobita Nobi</p>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                {msg.sender === "nobita" ? (
                  <img
                    src="/assets/generated/nobita-avatar.dim_200x200.png"
                    alt="Nobita"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white/70" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-doraemon-blue text-white rounded-br-sm"
                    : "bg-white/10 text-white rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                <img
                  src="/assets/generated/nobita-avatar.dim_200x200.png"
                  alt="Nobita"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something to Nobita..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
