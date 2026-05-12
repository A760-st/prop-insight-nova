import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { Brain, Sparkles, TrendingUp, Target, Cpu, Activity, Award } from "lucide-react";
import { predict, formatINR, LOCATIONS, type PredictInput, type Furnishing, type HouseType } from "@/lib/predict";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "AI Prediction Dashboard — EstateAI" },
      { name: "description", content: "Run an instant ML-powered house price prediction with 23 inputs. See model comparisons, feature importance, forecast and investment score." },
    ],
  }),
  component: Predict,
});

const DEFAULTS: PredictInput = {
  area: 1200, bedrooms: 3, bathrooms: 2, balconies: 1, parking: 1, ageYears: 5,
  furnishing: "semi", location: "Bengaluru", schoolDistance: 1.5, hospitalDistance: 2,
  metroDistance: 3, crimeRate: 3, aqi: 110, traffic: 5, pool: false, gym: true, garden: false,
  security: true, lift: true, smartHome: false, powerBackup: true, roadWidth: 12,
  popDensity: 6, houseType: "apartment",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

function Predict() {
  const [form, setForm] = useState<PredictInput>(DEFAULTS);
  const [result, setResult] = useState(() => predict(DEFAULTS));
  const [loading, setLoading] = useState(false);

  function set<K extends keyof PredictInput>(k: K, v: PredictInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onPredict() {
    setLoading(true);
    setTimeout(() => {
      setResult(predict(form));
      setLoading(false);
    }, 400);
  }

  const amenities: { key: keyof PredictInput; label: string }[] = [
    { key: "pool", label: "Swimming Pool" }, { key: "gym", label: "Gym" }, { key: "garden", label: "Garden" },
    { key: "security", label: "24/7 Security" }, { key: "lift", label: "Lift" }, { key: "smartHome", label: "Smart Home" },
    { key: "powerBackup", label: "Power Backup" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary mb-2">Prediction Engine</div>
        <h1 className="text-4xl sm:text-5xl font-bold">AI Price <span className="text-gradient">Prediction Dashboard</span></h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Tune 23 property features. Our ensemble of 5 regression models will estimate market value with confidence bands, explainability, and a 6-year forecast.</p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* FORM */}
        <div className="glass-strong rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Property Inputs</h2>
            <button onClick={() => setForm(DEFAULTS)} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
          </div>

          {/* Core */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Area (sq.ft)">
              <input type="number" min={100} max={10000} value={form.area} onChange={(e) => set("area", +e.target.value)} className={inputCls} />
            </Field>
            <Field label="Location">
              <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="House Type">
              <select value={form.houseType} onChange={(e) => set("houseType", e.target.value as HouseType)} className={inputCls}>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="independent">Independent House</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </Field>
            <Field label="Furnishing">
              <select value={form.furnishing} onChange={(e) => set("furnishing", e.target.value as Furnishing)} className={inputCls}>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi">Semi-Furnished</option>
                <option value="furnished">Fully Furnished</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Bedrooms"><input type="number" min={0} max={10} value={form.bedrooms} onChange={(e) => set("bedrooms", +e.target.value)} className={inputCls} /></Field>
            <Field label="Bathrooms"><input type="number" min={0} max={10} value={form.bathrooms} onChange={(e) => set("bathrooms", +e.target.value)} className={inputCls} /></Field>
            <Field label="Balconies"><input type="number" min={0} max={6} value={form.balconies} onChange={(e) => set("balconies", +e.target.value)} className={inputCls} /></Field>
            <Field label="Parking"><input type="number" min={0} max={6} value={form.parking} onChange={(e) => set("parking", +e.target.value)} className={inputCls} /></Field>
          </div>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4">
            <SliderField label="Property Age" suffix="yrs" min={0} max={50} value={form.ageYears} onChange={(v) => set("ageYears", v)} />
            <SliderField label="Road Width" suffix="m" min={3} max={40} value={form.roadWidth} onChange={(v) => set("roadWidth", v)} />
            <SliderField label="School Distance" suffix="km" min={0.1} max={15} step={0.1} value={form.schoolDistance} onChange={(v) => set("schoolDistance", v)} />
            <SliderField label="Hospital Distance" suffix="km" min={0.1} max={15} step={0.1} value={form.hospitalDistance} onChange={(v) => set("hospitalDistance", v)} />
            <SliderField label="Metro Distance" suffix="km" min={0.1} max={20} step={0.1} value={form.metroDistance} onChange={(v) => set("metroDistance", v)} />
            <SliderField label="Air Quality Index" min={20} max={500} value={form.aqi} onChange={(v) => set("aqi", v)} />
            <SliderField label="Crime Rate" suffix="/10" min={0} max={10} value={form.crimeRate} onChange={(v) => set("crimeRate", v)} />
            <SliderField label="Traffic Level" suffix="/10" min={0} max={10} value={form.traffic} onChange={(v) => set("traffic", v)} />
            <SliderField label="Population Density" suffix="/10" min={0} max={10} value={form.popDensity} onChange={(v) => set("popDensity", v)} />
          </div>

          {/* Amenities */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => {
                const on = form[a.key] as boolean;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => set(a.key, !on as never)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      on ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow" : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={onPredict}
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? "Running ensemble..." : "Predict Price"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={result.price}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-10" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Predicted Price
                </div>
                <div className="text-5xl sm:text-6xl font-display font-bold text-gradient">{formatINR(result.price)}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatINR(result.range[0])} – {formatINR(result.range[1])} · ₹{result.pricePerSqft.toLocaleString("en-IN")}/sqft
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${result.confidence}%` }} />
                  </div>
                  <div className="text-sm font-mono">{result.confidence}% confidence</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Award} label="Investment" value={`${result.investmentScore}/100`} accent="violet" />
            <Stat icon={Activity} label="Rental Yield" value={`${result.rentalYield}%`} accent="primary" />
            <Stat icon={TrendingUp} label="6Y Forecast" value={formatINR(result.forecast[5].price)} accent="success" />
          </div>

          {/* Model comparison */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> Model Comparison</h3>
              <div className="text-xs text-muted-foreground">Best: <span className="text-primary font-semibold">{result.models[0].name}</span></div>
            </div>
            <div className="space-y-2">
              {result.models.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  <div className="w-32 text-muted-foreground">{m.name}</div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${m.r2 * 100}%` }} />
                  </div>
                  <div className="font-mono text-xs w-12 text-right">{m.r2.toFixed(3)}</div>
                  <div className="font-mono text-xs w-20 text-right">{formatINR(m.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Evaluation Metrics</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <Metric label="MAE" value={formatINR(result.metrics.mae)} />
              <Metric label="RMSE" value={formatINR(result.metrics.rmse)} />
              <Metric label="R²" value={result.metrics.r2.toFixed(3)} />
              <Metric label="CV" value="5-fold" />
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Feature Importance (Explainable AI)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={result.features.slice(0, 10).map(f => ({ ...f, abs: Math.abs(f.impact), pos: f.impact >= 0 }))} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="oklch(0.72 0.04 260)" fontSize={11} width={100} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
              <Bar dataKey="abs" radius={[0, 6, 6, 0]} fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 215)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.22 305)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-semibold mb-4">6-Year Price Forecast</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={result.forecast}>
              <XAxis dataKey="year" stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <YAxis stroke="oklch(0.72 0.04 260)" fontSize={11} tickFormatter={(v) => `₹${(v / 1e7).toFixed(1)}Cr`} />
              <Tooltip
                contentStyle={{ background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }}
                formatter={(v: number) => formatINR(v)}
              />
              <Line type="monotone" dataKey="price" stroke="oklch(0.78 0.18 215)" strokeWidth={3} dot={{ fill: "oklch(0.62 0.22 305)", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, suffix, min, max, step = 1, value, onChange }: {
  label: string; suffix?: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}{suffix ?? ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-[oklch(0.78_0.18_215)]" />
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Brain; label: string; value: string; accent: "primary" | "violet" | "success" }) {
  return (
    <div className="glass rounded-xl p-4">
      <Icon className={`w-4 h-4 mb-2 ${accent === "primary" ? "text-primary" : accent === "violet" ? "text-accent" : "text-success"}`} />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-bold mt-0.5">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold mt-0.5">{value}</div>
    </div>
  );
}
