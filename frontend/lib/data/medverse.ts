/**
 * MedVerse - the flagship engineering project (productized from the Aegis
 * wearable lineage), built with Team ADAGARD. Framed as an engineering &
 * research showcase: the role, the build, and the ML layer - deliberately
 * light on clinical/market claims, with an explicit "not a medical device"
 * disclaimer. Rendered on /medverse.
 */
export const medverse = {
  name: "MedVerse",
  tagline: "Sense the unseen.",
  team: "Team ADAGARD",
  motto: "Because every second counts.",
  selection: "Selected · NIBM Neo Ventures",
  oneLiner:
    "A full-stack clinical telemetry platform I build with Team ADAGARD - wearable hardware, on-device signal processing, a trained-model layer, a backend, and clinician-facing apps, engineered end to end.",
  contribution:
    "I work across the whole stack - wearable firmware and signal processing, the machine-learning layer, the backend services, and the web and mobile apps.",
  disclaimer:
    "An engineering and research project. MedVerse is not a regulated medical device; the models are trained on public datasets and are not clinically validated.",
  logo: "/medverse/logo.webp",
};

/** Public epidemiology context that motivated the project. */
export const problemStats: { value: string; label: string }[] = [
  { value: "83%", label: "of hospital deaths linked to delayed deterioration detection" },
  { value: "2.5", label: "CCU beds per 100,000 - versus 9 in Australia" },
  { value: "9.6%", label: "mortality even at top tertiary hospitals" },
  { value: "36%", label: "national specialist deficit" },
];

/** What I built, by domain - the engineering surface. */
export const buildItems: { area: string; detail: string }[] = [
  {
    area: "Hardware",
    detail:
      "A cardiopulmonary vest (v2) with fully fabricated PCBs - KiCad, Gerbers, BOM, pick-and-place - plus a maternal/abdominal belt sensor stack.",
  },
  {
    area: "Firmware",
    detail:
      "ESP32-S3 + NimBLE with on-device DSP (filtering, peak detection, HR/HRV/SpO₂) at sub-200 ms sensor-to-alert.",
  },
  {
    area: "AI / ML",
    detail:
      "~8 models trained on 40k+ records from public clinical benchmarks, each with held-out validation reports checked into CI.",
  },
  {
    area: "Backend",
    detail:
      "FastAPI + TimescaleDB + Redis + Celery + MQTT, with a LangGraph multi-agent layer across 24 endpoints.",
  },
  {
    area: "Apps",
    detail:
      "A React clinical dashboard and a Flutter mobile app (patient / clinician / admin), each with a full offline demo mode.",
  },
  {
    area: "Integrity",
    detail:
      "A SHA-256 hash-chained audit ledger, and a provenance CI gate that fails the build if an unvalidated model is shown as trustworthy.",
  },
];

/**
 * The ML / signal-processing layer - framed as research artifacts with their
 * dataset + held-out metric, NOT as clinical services. Each is trained on a
 * public benchmark; none is clinically validated.
 */
export const models: { title: string; detail: string; backing: string }[] = [
  {
    title: "Sepsis-risk classifier",
    detail: "A calibrated model trained to flag early deterioration patterns.",
    backing: "PhysioNet CinC-2019 · held-out AUROC 0.77",
  },
  {
    title: "ECG analysis (MI / arrhythmia)",
    detail: "Trained to surface silent-MI and arrhythmia patterns in ECG.",
    backing: "PTB-XL · AUROC 0.86 / 0.78",
  },
  {
    title: "Fetal CTG classification",
    detail: "A 3-class CTG model paired with a 4-quadrant piezo sensor array.",
    backing: "UCI CTG · AUROC 0.99",
  },
  {
    title: "Lung-sound classification",
    detail: "An acoustic model over the heart/lung microphone array.",
    backing: "ICBHI 2017 · AUROC 0.74",
  },
  {
    title: "Cuffless BP estimation",
    detail: "A pulse-transit-time pipeline with per-patient calibration.",
    backing: "Signal-processing model + calibration",
  },
  {
    title: "ECG-age & risk index",
    detail: "A regression model fused with published rule-based scores (NEWS2).",
    backing: "PTB-XL + peer-reviewed equations",
  },
];

/** The engineering, in numbers (replaces market framing). */
export const engineeringStats: { value: string; label: string }[] = [
  { value: "~8", label: "ML models trained on public clinical benchmarks" },
  { value: "40k+", label: "records used for training & held-out validation" },
  { value: "24", label: "backend API endpoints" },
  { value: "<200ms", label: "sensor-to-alert latency, end to end" },
];
