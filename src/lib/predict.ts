// Simulated ML regression model — transparent feature-weighted scoring.
// Mimics a gradient boosting regressor calibrated on synthetic Indian metro housing data.
// Output: price in INR.

export type Furnishing = "unfurnished" | "semi" | "furnished";
export type HouseType = "apartment" | "villa" | "independent" | "studio" | "penthouse";

export interface PredictInput {
  area: number;            // sq.ft
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  parking: number;
  ageYears: number;
  furnishing: Furnishing;
  location: string;        // city
  schoolDistance: number;  // km
  hospitalDistance: number;
  metroDistance: number;
  crimeRate: number;       // 0-10
  aqi: number;             // 0-500
  traffic: number;         // 0-10
  pool: boolean;
  gym: boolean;
  garden: boolean;
  security: boolean;
  lift: boolean;
  smartHome: boolean;
  powerBackup: boolean;
  roadWidth: number;       // meters
  popDensity: number;      // 0-10
  houseType: HouseType;
}

const LOCATION_MULT: Record<string, number> = {
  Mumbai: 2.4, Bengaluru: 1.9, Delhi: 2.0, Gurgaon: 1.85, Hyderabad: 1.55,
  Pune: 1.5, Chennai: 1.45, Kolkata: 1.25, Ahmedabad: 1.15, Jaipur: 1.0,
  Lucknow: 0.9, Indore: 0.92, Other: 1.0,
};

const HOUSE_TYPE_MULT: Record<HouseType, number> = {
  apartment: 1.0, villa: 1.45, independent: 1.2, studio: 0.78, penthouse: 1.7,
};

const FURNISH_MULT: Record<Furnishing, number> = {
  unfurnished: 1.0, semi: 1.08, furnished: 1.18,
};

export interface PredictResult {
  price: number;
  pricePerSqft: number;
  confidence: number;      // 0-100
  range: [number, number];
  features: { name: string; impact: number }[]; // -100..100 contribution share
  metrics: { mae: number; rmse: number; r2: number };
  models: { name: string; r2: number; price: number }[];
  investmentScore: number; // 0-100
  rentalYield: number;     // %
  forecast: { year: number; price: number }[];
}

export function predict(i: PredictInput): PredictResult {
  // Base price per sqft (INR) by location
  const locMult = LOCATION_MULT[i.location] ?? 1.0;
  let pricePerSqft = 6500 * locMult;

  // House type & furnishing
  pricePerSqft *= HOUSE_TYPE_MULT[i.houseType];
  pricePerSqft *= FURNISH_MULT[i.furnishing];

  // Bedroom/bathroom premium
  pricePerSqft *= 1 + Math.max(0, i.bedrooms - 2) * 0.04;
  pricePerSqft *= 1 + Math.max(0, i.bathrooms - 1) * 0.025;
  pricePerSqft *= 1 + i.balconies * 0.012;
  pricePerSqft *= 1 + Math.min(i.parking, 3) * 0.025;

  // Age depreciation
  pricePerSqft *= Math.max(0.55, 1 - i.ageYears * 0.012);

  // Proximity (closer = better)
  pricePerSqft *= 1 + Math.max(0, (5 - i.schoolDistance)) * 0.012;
  pricePerSqft *= 1 + Math.max(0, (5 - i.hospitalDistance)) * 0.01;
  pricePerSqft *= 1 + Math.max(0, (8 - i.metroDistance)) * 0.018;

  // Environment penalties
  pricePerSqft *= 1 - i.crimeRate * 0.018;
  pricePerSqft *= 1 - Math.max(0, (i.aqi - 80)) * 0.0006;
  pricePerSqft *= 1 - i.traffic * 0.012;

  // Amenities
  const amenities = [i.pool, i.gym, i.garden, i.security, i.lift, i.smartHome, i.powerBackup];
  const amenWeight = [0.06, 0.04, 0.03, 0.035, 0.025, 0.05, 0.025];
  amenities.forEach((on, idx) => { if (on) pricePerSqft *= 1 + amenWeight[idx]; });

  // Infrastructure
  pricePerSqft *= 1 + Math.min(i.roadWidth, 30) * 0.003;
  pricePerSqft *= 1 - Math.max(0, i.popDensity - 5) * 0.01;

  const price = pricePerSqft * i.area;

  // Confidence: penalize edge inputs
  let confidence = 92;
  if (i.area < 300 || i.area > 6000) confidence -= 8;
  if (i.ageYears > 30) confidence -= 6;
  if (i.aqi > 300) confidence -= 4;
  confidence = Math.max(70, Math.min(96, confidence));

  const spread = price * (1 - confidence / 100) * 1.4;
  const range: [number, number] = [price - spread, price + spread];

  // Feature importance (relative impact)
  const features = [
    { name: "Location", impact: locMult * 22 },
    { name: "Area", impact: Math.log10(i.area) * 8 },
    { name: "House Type", impact: HOUSE_TYPE_MULT[i.houseType] * 10 },
    { name: "Bedrooms", impact: i.bedrooms * 2.2 },
    { name: "Age", impact: -i.ageYears * 0.6 },
    { name: "Metro Access", impact: Math.max(0, 8 - i.metroDistance) * 1.6 },
    { name: "Amenities", impact: amenities.filter(Boolean).length * 2.5 },
    { name: "AQI", impact: -Math.max(0, i.aqi - 80) * 0.05 },
    { name: "Crime Rate", impact: -i.crimeRate * 1.4 },
    { name: "Smart Home", impact: i.smartHome ? 6 : 0 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  const models = [
    { name: "XGBoost", r2: 0.943, price: price * 1.0 },
    { name: "Random Forest", r2: 0.928, price: price * 0.984 },
    { name: "Gradient Boost", r2: 0.921, price: price * 1.012 },
    { name: "Decision Tree", r2: 0.872, price: price * 0.94 },
    { name: "Linear Regression", r2: 0.811, price: price * 1.07 },
  ];

  const metrics = {
    mae: price * 0.052,
    rmse: price * 0.071,
    r2: 0.943,
  };

  // Investment score
  const investmentScore = Math.round(
    Math.max(0, Math.min(100,
      40
      + (locMult - 1) * 25
      + Math.max(0, 8 - i.metroDistance) * 2
      + amenities.filter(Boolean).length * 2
      - i.crimeRate * 1.5
      - Math.max(0, i.aqi - 100) * 0.05
      - i.ageYears * 0.4
    ))
  );

  const rentalYield = +(2.4 + locMult * 0.6 + (i.smartHome ? 0.3 : 0) + (i.metroDistance < 3 ? 0.4 : 0)).toFixed(2);

  const growth = 0.06 + (locMult - 1) * 0.025 + Math.max(0, 5 - i.metroDistance) * 0.004;
  const forecast = Array.from({ length: 6 }, (_, k) => ({
    year: 2026 + k,
    price: Math.round(price * Math.pow(1 + growth, k)),
  }));

  return {
    price: Math.round(price),
    pricePerSqft: Math.round(pricePerSqft),
    confidence,
    range: [Math.round(range[0]), Math.round(range[1])],
    features,
    metrics,
    models,
    investmentScore,
    rentalYield,
    forecast,
  };
}

export function formatINR(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export const LOCATIONS = Object.keys(LOCATION_MULT);
