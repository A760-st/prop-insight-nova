import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Msg { role: "user" | "bot"; text: string }

const STARTERS = [
  "Best area in Bengaluru under ₹1 Cr?",
  "Is now a good time to invest in Pune?",
  "Rental yield for a 2BHK in Mumbai?",
  "What boosts property value most?",
];

function reply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("invest") || s.includes("good time"))
    return "Based on current market trends, locations near upcoming metro lines (Pune, Hyderabad, Bengaluru ORR) show 8–12% projected annual growth. Aim for properties with investment score above 70.";
  if (s.includes("rental") || s.includes("yield"))
    return "Average rental yield in Indian metros is 2.5–4%. Mumbai 2.8%, Bengaluru 3.4%, Hyderabad 3.7%. Smart-home & metro-adjacent units add ~0.5%.";
  if (s.includes("bengaluru") || s.includes("bangalore"))
    return "Under ₹1 Cr in Bengaluru: Whitefield, Electronic City Phase 2, Sarjapur outskirts. Strong tech-corridor demand, expected 9% YoY appreciation.";
  if (s.includes("mumbai"))
    return "Mumbai is premium — expect ₹18–35K/sqft. Best ROI suburbs: Thane, Navi Mumbai, Mira Road. Avoid flood-prone micro-markets.";
  if (s.includes("boost") || s.includes("value"))
    return "Top 5 value boosters: 1) Metro proximity (<3km) 2) Smart-home features 3) Low AQI area 4) Premium amenities (pool/gym) 5) Wider road frontage.";
  if (s.includes("fraud") || s.includes("fake"))
    return "Fraud signals: prices 30%+ below market, no RERA ID, vague seller details, urgency tactics. Always verify on the official RERA portal.";
  if (s.includes("hi") || s.includes("hello"))
    return "Hi! I'm EstateAI — your real-estate co-pilot. Ask me about prices, investments, locations, or rental yields.";
  return "Great question! Try our Predict page for an instant ML-powered estimate, or check Analytics for live market trends. I can also suggest properties based on your budget.";
}

export function Chatbot({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm EstateAI 👋 Ask me anything about property prices, investments, or locations." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "bot", text: reply(text) }]), 500);
  }

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-primary shadow-glow grid place-items-center hover:scale-110 transition-transform"
        aria-label="Open AI assistant"
      >
        {open ? <X className="w-6 h-6 text-primary-foreground" /> : <MessageCircle className="w-6 h-6 text-primary-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[520px] glass-strong rounded-2xl shadow-elegant flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gradient-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div>
                <div className="font-semibold text-primary-foreground">EstateAI Assistant</div>
                <div className="text-xs text-primary-foreground/80">Real-estate co-pilot · online</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                        : "glass text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  <div className="text-xs text-muted-foreground">Try asking:</div>
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-xs glass hover:bg-white/10 px-3 py-2 rounded-lg transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a city, budget, ROI..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button type="submit" className="bg-gradient-primary px-3 rounded-lg shadow-glow hover:scale-105 transition">
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
