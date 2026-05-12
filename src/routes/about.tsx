import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Cpu, Database, GitBranch, Layers, LineChart, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EstateAI" },
      { name: "description", content: "About EstateAI: the architecture, machine learning models, and design behind our smart house price prediction system." },
    ],
  }),
  component: About,
});

const STACK = [
  { icon: Layers, label: "Frontend", desc: "TanStack Start · React · TypeScript · Tailwind CSS" },
  { icon: LineChart, label: "Visualization", desc: "Recharts · Framer Motion · Custom heatmaps" },
  { icon: Cpu, label: "ML Engine", desc: "Ensemble: XGBoost, Random Forest, Gradient Boost, Decision Tree, Linear" },
  { icon: Database, label: "Data Pipeline", desc: "23 features · Label encoding · Scaling · Outlier removal" },
  { icon: GitBranch, label: "Validation", desc: "5-fold cross validation · Hyperparameter tuning" },
  { icon: Shield, label: "Trust Layer", desc: "Explainable AI · Confidence intervals · Fraud detection" },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">About the Project</div>
        <h1 className="text-5xl font-bold">A premium AI engine for <span className="text-gradient">real-estate intelligence</span></h1>
        <p className="mt-5 text-muted-foreground">EstateAI is a smart house price prediction system that turns 23 property and locality features into an explainable market valuation in under 500ms — backed by an ensemble of 5 regression models.</p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 gap-5">
        {STACK.map((s) => (
          <div key={s.label} className="glass-strong rounded-2xl p-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center mb-4">
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{s.label}</h3>
            <p className="text-sm text-muted-foreground mt-1.5">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 glass-strong rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> How predictions work</h2>
        <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
          <li><span className="text-foreground font-semibold">1. Feature engineering.</span> 23 raw inputs are normalized — categorical fields (location, type, furnishing) are encoded, numerics are scaled.</li>
          <li><span className="text-foreground font-semibold">2. Ensemble inference.</span> 5 regressors run in parallel; each contributes a weighted prediction.</li>
          <li><span className="text-foreground font-semibold">3. Confidence interval.</span> A bootstrap-style spread is computed from input edge-cases and model agreement.</li>
          <li><span className="text-foreground font-semibold">4. Explainability.</span> Per-feature contributions are surfaced so you understand <em>why</em> the price is what it is.</li>
          <li><span className="text-foreground font-semibold">5. Forecast & ROI.</span> Location growth coefficients project a 6-year price arc and rental yield.</li>
        </ol>
      </div>

      <div className="mt-10 text-center">
        <Link to="/predict" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold shadow-glow hover:scale-[1.03] transition">
          <Sparkles className="w-4 h-4" /> Try it now
        </Link>
      </div>
    </div>
  );
}
