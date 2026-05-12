import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sparkles, MapPin, Bed, Bath, Car, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/predict";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Property Recommendations — EstateAI" },
      { name: "description", content: "Get budget-matched property suggestions ranked by AI investment score, with fraud detection and ROI analysis." },
    ],
  }),
  component: Recommendations,
});

interface Listing {
  id: number; title: string; city: string; area: number; bhk: number; baths: number;
  parking: number; price: number; type: string; score: number; roi: number;
  flagged: boolean; flagReason?: string;
}

const RAW: Listing[] = [
  { id: 1, title: "Skyline Premier Tower", city: "Bengaluru", area: 1450, bhk: 3, baths: 3, parking: 2, price: 13500000, type: "Apartment", score: 88, roi: 11.4, flagged: false },
  { id: 2, title: "Serene Hills Villa", city: "Pune", area: 2400, bhk: 4, baths: 4, parking: 2, price: 19500000, type: "Villa", score: 82, roi: 9.8, flagged: false },
  { id: 3, title: "Metro Heights", city: "Hyderabad", area: 1100, bhk: 2, baths: 2, parking: 1, price: 8500000, type: "Apartment", score: 91, roi: 13.2, flagged: false },
  { id: 4, title: "Ocean Breeze Penthouse", city: "Mumbai", area: 1800, bhk: 3, baths: 4, parking: 2, price: 42000000, type: "Penthouse", score: 76, roi: 7.1, flagged: false },
  { id: 5, title: "Riverside Residency", city: "Ahmedabad", area: 1300, bhk: 3, baths: 2, parking: 1, price: 6200000, type: "Apartment", score: 79, roi: 10.6, flagged: false },
  { id: 6, title: "Glassdoor Studios", city: "Gurgaon", area: 600, bhk: 1, baths: 1, parking: 1, price: 4800000, type: "Studio", score: 84, roi: 12.5, flagged: false },
  { id: 7, title: "Discount Mega Deal!!", city: "Delhi", area: 1500, bhk: 3, baths: 2, parking: 1, price: 4200000, type: "Apartment", score: 32, roi: 18.0, flagged: true, flagReason: "Price 65% below market avg" },
  { id: 8, title: "Tech Park Residences", city: "Chennai", area: 1250, bhk: 3, baths: 2, parking: 1, price: 9800000, type: "Apartment", score: 86, roi: 10.9, flagged: false },
  { id: 9, title: "Garden Court Independent", city: "Jaipur", area: 1900, bhk: 4, baths: 3, parking: 2, price: 7500000, type: "Independent", score: 81, roi: 9.4, flagged: false },
  { id: 10, title: "Coastal Luxury Villa", city: "Mumbai", area: 3200, bhk: 5, baths: 5, parking: 3, price: 78000000, type: "Villa", score: 80, roi: 6.8, flagged: false },
  { id: 11, title: "Urgent Sale Plot+House", city: "Lucknow", area: 1100, bhk: 2, baths: 1, parking: 0, price: 1900000, type: "Independent", score: 28, roi: 22.0, flagged: true, flagReason: "No RERA ID · urgency tactics" },
  { id: 12, title: "Cyber Heights Smart Home", city: "Bengaluru", area: 1600, bhk: 3, baths: 3, parking: 2, price: 16500000, type: "Apartment", score: 93, roi: 12.8, flagged: false },
];

function Recommendations() {
  const [budget, setBudget] = useState(15000000);
  const [city, setCity] = useState<string>("All");
  const [showFraud, setShowFraud] = useState(false);

  const cities = useMemo(() => ["All", ...Array.from(new Set(RAW.map((r) => r.city)))], []);

  const filtered = useMemo(() => {
    return RAW
      .filter((r) => showFraud ? r.flagged : !r.flagged)
      .filter((r) => city === "All" || r.city === city)
      .filter((r) => r.price <= budget * 1.15)
      .sort((a, b) => b.score - a.score);
  }, [budget, city, showFraud]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary mb-2">AI Recommendations</div>
        <h1 className="text-4xl sm:text-5xl font-bold">Smart properties, <span className="text-gradient">scored & ranked</span></h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Our recommender combines investment score, ROI projection, and fraud anomaly detection to surface the best matches for your budget.</p>
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-2xl p-5 mb-6 grid sm:grid-cols-[1fr_200px_auto] gap-4 items-end">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Max budget</span>
            <span className="font-mono text-foreground">{formatINR(budget)}</span>
          </div>
          <input type="range" min={2000000} max={80000000} step={500000} value={budget} onChange={(e) => setBudget(+e.target.value)}
            className="w-full accent-[oklch(0.78_0.18_215)]" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">City</div>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={() => setShowFraud((x) => !x)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition border ${
            showFraud ? "bg-destructive/20 border-destructive/40 text-destructive" : "border-white/10 text-muted-foreground hover:text-foreground"
          }`}
        >
          {showFraud ? "Showing flagged" : "Fraud detector"}
        </button>
      </div>

      {/* Listings grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No properties match these filters. Try increasing budget.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-strong rounded-2xl overflow-hidden hover:shadow-glow hover:border-primary/30 transition-all"
            >
              <div className="relative h-40 bg-gradient-primary opacity-90 grid place-items-center">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="relative text-primary-foreground font-display font-bold text-xl">{p.type}</div>
                {p.flagged && (
                  <div className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> FLAGGED
                  </div>
                )}
                <div className="absolute top-3 right-3 glass-strong px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> {p.score}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg leading-tight">{p.title}</h3>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {p.city}</div>
                <div className="text-2xl font-display font-bold text-gradient mt-3">{formatINR(p.price)}</div>
                <div className="text-xs text-muted-foreground">₹{Math.round(p.price / p.area).toLocaleString("en-IN")}/sqft · {p.area} sqft</div>
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.bhk}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                  <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {p.parking}</span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs">
                    {p.flagged ? <Shield className="w-3.5 h-3.5 text-destructive" /> : <TrendingUp className="w-3.5 h-3.5 text-success" />}
                    <span className={p.flagged ? "text-destructive" : "text-success"}>
                      {p.flagged ? p.flagReason : `${p.roi}% projected ROI`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
