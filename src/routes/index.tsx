import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, BarChart3, Sparkles, Shield, MapPin, TrendingUp, Zap, Cpu } from "lucide-react";
import heroImg from "@/assets/hero-house.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EstateAI — AI-Powered Real Estate Price Prediction" },
      { name: "description", content: "Predict house prices instantly with explainable ML. Compare 5 regression models, see feature importance, market forecasts, and AI investment scores." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Brain, title: "5 ML Models", desc: "XGBoost, Random Forest, Gradient Boost & more — auto-selects the best fit." },
  { icon: BarChart3, title: "Explainable AI", desc: "See exactly which features push your price up or down." },
  { icon: TrendingUp, title: "6-Year Forecast", desc: "Project future appreciation based on location and infrastructure trends." },
  { icon: Sparkles, title: "Smart Recommendations", desc: "AI-curated properties matching your budget and lifestyle." },
  { icon: Shield, title: "Fraud Detection", desc: "Spot fake listings with anomaly detection on price-to-market signals." },
  { icon: MapPin, title: "Locality Insights", desc: "Schools, hospitals, metro, AQI and crime — all factored in." },
];

const STATS = [
  { v: "94.3%", l: "Model R² Accuracy" },
  { v: "120K+", l: "Properties Analyzed" },
  { v: "23", l: "Input Features" },
  { v: "12", l: "Indian Metros" },
];

function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              AI Engine v3.2 · Live Models
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Predict any house price <span className="text-gradient">in 0.4 seconds</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              EstateAI runs your property through 5 ML regression models, returns an explainable price with confidence intervals, market forecast, and an investment score — instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predict" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold shadow-glow hover:scale-[1.03] transition-transform">
                Run a prediction <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/analytics" className="inline-flex items-center gap-2 glass-strong px-6 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition">
                View market analytics
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.l} className="glass rounded-xl p-4">
                  <div className="text-2xl font-display font-bold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden glass-strong shadow-elegant">
              <img src={heroImg} alt="Smart house with AI overlay" width={1536} height={1024} className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            {/* Floating cards */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-4 top-12 glass-strong p-4 rounded-2xl shadow-glow w-52 hidden sm:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Cpu className="w-3.5 h-3.5 text-primary" /> XGBoost</div>
              <div className="text-2xl font-display font-bold">₹1.84 Cr</div>
              <div className="text-xs text-success mt-1">↑ 9.4% projected</div>
            </motion.div>
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="absolute -right-4 bottom-8 glass-strong p-4 rounded-2xl shadow-violet w-56 hidden sm:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Zap className="w-3.5 h-3.5 text-accent" /> Confidence</div>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 50, 80, 70, 92, 88].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-primary rounded-sm" />
                ))}
              </div>
              <div className="text-xs mt-2">94% accuracy band</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">Capabilities</div>
          <h2 className="text-4xl sm:text-5xl font-bold">Everything you need to <span className="text-gradient">price property intelligently</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-2xl hover:shadow-glow hover:border-primary/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="glass-strong rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold">Ready to find <span className="text-gradient">true market value</span>?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">No signup. No credit card. Get an instant ML-powered price estimate with explainable insights.</p>
            <Link to="/predict" className="mt-8 inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-4 rounded-xl font-semibold shadow-glow hover:scale-[1.03] transition-transform">
              Start predicting <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
