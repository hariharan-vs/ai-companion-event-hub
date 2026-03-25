import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { getResponse } from "@/lib/chatEngine";

interface Msg {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, text: "Hi! Ask me anything about the college. 😊", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const msg = input.trim();
    if (!msg) return;
    setMessages(p => [...p, { id: nextId.current++, text: msg, sender: "user" }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const res = getResponse(msg);
      setMessages(p => [...p, { id: nextId.current++, text: res.answer, sender: "bot" }]);
      setTyping(false);
    }, 500 + Math.random() * 500);
  };

  return (
    <div className="floating-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card w-80 h-96 mb-3 flex flex-col overflow-hidden shadow-2xl"
            style={{ boxShadow: "0 25px 60px -15px hsl(245, 58%, 61%, 0.3)" }}
          >
            <div className="p-3 border-b border-border flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground flex-1">Quick Chat</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] text-xs ${m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 chat-bubble-bot w-fit py-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-2 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a question..."
                className="glass-input flex-1 !py-2 !text-xs"
              />
              <button onClick={send} className="btn-gradient !p-2 !rounded-lg">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}
      >
        {open ? <X className="w-6 h-6 text-primary-foreground" /> : <MessageCircle className="w-6 h-6 text-primary-foreground" />}
      </motion.button>
    </div>
  );
}
