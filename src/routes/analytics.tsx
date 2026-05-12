import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  ScatterChart, Scatter, ZAxis, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, MapPin, Building2, Activity } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Market Analytics — EstateAI" },
      { name: "description", content: "Live real-estate market analytics: city-wise pricing, area trends, correlations and investment heatmaps." },
    ],
  }),
  component: Analytics,
});

const cityData = [
  { city: "Mumbai", price: 28500, growth: 7.2 },
  { city: "Delhi", price: 18200, growth: 6.5 },
  { city: "Gurgaon", price: 16800, growth: 9.4 },
  { city: "Bengaluru", price: 14200, growth: 11.2 },
  { city: "Hyderabad", price: 11800, growth: 12.8 },
  { city: "Pune", price: 11200, growth: 8.6 },
  { city: "Chennai", price: 10400, growth: 6.9 },
  { city: "Kolkata", price: 8200, growth: 4.8 },
  { city: "Ahmedabad", price: 7400, growth: 7.1 },
  { city: "Jaipur", price: 6500, growth: 5.4 },
];

const trend = Array.from({ length: 24 }, (_, i) => ({
  m: `M${i + 1}`,
  Mumbai: 26000 + Math.round(Math.sin(i / 3) * 600 + i * 110),
  Bengaluru: 11800 + Math.round(Math.cos(i / 4) * 400 + i * 130),
  Hyderabad: 9500 + Math.round(Math.sin(i / 2.5) * 300 + i * 145),
}));

const scatter = Array.from({ length: 60 }, () => ({
  area: 400 + Math.random() * 3500,
  price: 0,
})).map((d) => ({ ...d, price: d.area * (5000 + Math.random() * 8000) + Math.random() * 2_000_000 }));

const segments = [
  { name: "Apartments", value: 56 },
  { name: "Villas", value: 14 },
  { name: "Independent", value: 18 },
  { name: "Studios", value: 7 },
  { name: "Penthouses", value: 5 },
];

const COLORS = ["oklch(0.78 0.18 215)", "oklch(0.62 0.22 305)", "oklch(0.78 0.18 160)", "oklch(0.82 0.18 80)", "oklch(0.65 0.24 22)"];

const KPI = [
  { icon: Building2, label: "Properties Analyzed", value: "120,482", trend: "+8.2%" },
  { icon: TrendingUp, label: "Avg YoY Growth", value: "8.4%", trend: "+1.1%" },
  { icon: MapPin, label: "Active Markets", value: "12", trend: "+2 new" },
  { icon: Activity, label: "Median Confidence", value: "92.7%", trend: "stable" },
];

const tooltipStyle = { background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 };

function Analytics() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary mb-2">Market Intelligence</div>
        <h1 className="text-4xl sm:text-5xl font-bold">Real-time <span className="text-gradient">Property Analytics</span></h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k) => (
          <div key={k.label} className="glass-strong rounded-2xl p-5">
            <k.icon className="w-5 h-5 text-primary mb-3" />
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-2xl font-display font-bold mt-1">{k.value}</div>
            <div className="text-xs text-success mt-1">{k.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass-strong rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">City-wise Pricing (₹/sqft)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="city" stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <YAxis stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="price" radius={[8, 8, 0, 0]} fill="url(#g1)" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 215)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.22 305)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Property Type Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={segments} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {segments.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-semibold mb-4">24-Month Price Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="m" stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <YAxis stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 215)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 215)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.22 305)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.62 0.22 305)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 160)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="Mumbai" stroke="oklch(0.78 0.18 215)" fill="url(#ga)" strokeWidth={2} />
              <Area type="monotone" dataKey="Bengaluru" stroke="oklch(0.62 0.22 305)" fill="url(#gb)" strokeWidth={2} />
              <Area type="monotone" dataKey="Hyderabad" stroke="oklch(0.78 0.18 160)" fill="url(#gc)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Area vs Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="area" name="Area" unit="sqft" stroke="oklch(0.72 0.04 260)" fontSize={11} />
              <YAxis dataKey="price" name="Price" stroke="oklch(0.72 0.04 260)" fontSize={11} tickFormatter={(v) => `${(v / 1e7).toFixed(1)}Cr`} />
              <ZAxis range={[60, 60]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatter} fill="oklch(0.78 0.18 215)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-strong rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Feature Correlation Heatmap</h3>
        <CorrelationHeatmap />
      </div>
    </div>
  );
}

const HEAT_LABELS = ["Area", "Bedrooms", "Location", "Age", "Metro", "AQI", "Crime", "Amenities"];
const HEAT = [
  [1.0, 0.62, 0.40, -0.18, 0.55, -0.30, -0.42, 0.48],
  [0.62, 1.0, 0.35, -0.12, 0.45, -0.20, -0.35, 0.52],
  [0.40, 0.35, 1.0, 0.05, 0.78, -0.55, -0.60, 0.65],
  [-0.18, -0.12, 0.05, 1.0, -0.10, 0.18, 0.12, -0.25],
  [0.55, 0.45, 0.78, -0.10, 1.0, -0.48, -0.52, 0.58],
  [-0.30, -0.20, -0.55, 0.18, -0.48, 1.0, 0.62, -0.40],
  [-0.42, -0.35, -0.60, 0.12, -0.52, 0.62, 1.0, -0.50],
  [0.48, 0.52, 0.65, -0.25, 0.58, -0.40, -0.50, 1.0],
];

function CorrelationHeatmap() {
  function color(v: number) {
    const intensity = Math.abs(v);
    if (v > 0) return `oklch(0.78 ${0.04 + intensity * 0.16} 215 / ${0.15 + intensity * 0.85})`;
    return `oklch(0.62 ${0.05 + intensity * 0.2} 305 / ${0.15 + intensity * 0.85})`;
  }
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1 text-xs" style={{ gridTemplateColumns: `120px repeat(${HEAT_LABELS.length}, minmax(60px, 1fr))` }}>
        <div />
        {HEAT_LABELS.map((l) => <div key={l} className="text-center text-muted-foreground py-1">{l}</div>)}
        {HEAT.map((row, i) => (
          <Fragment key={i}>
            <div className="text-muted-foreground py-2 pr-3 text-right">{HEAT_LABELS[i]}</div>
            {row.map((v, j) => (
              <div key={j} className="aspect-square rounded grid place-items-center font-mono text-[10px] font-semibold" style={{ background: color(v) }}>
                {v.toFixed(2)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
