export type ProjectCategory =
  | "Software Engineering"
  | "Data Science"
  | "Computer Vision"
  | "Data Engineering"
  | "Data Analysis";

export type ProjectTier = "main" | "mini";

export interface ProjectDetail {
  problem: string;
  approach: string;
  outcome: string;
}

export interface Project {
  slug: string;
  name: string;
  valueProp: string;
  description: string;
  category: ProjectCategory;
  tier: ProjectTier;
  stack: string[];
  repo: string;
  live?: string;
  /** Required for `main` projects (drives /work/[slug]); optional for `mini`. */
  detail?: ProjectDetail;
}

export const ALL_CATEGORIES: ProjectCategory[] = [
  "Software Engineering",
  "Data Science",
  "Computer Vision",
  "Data Engineering",
  "Data Analysis",
];

/**
 * Curated catalog from github.com/Nivakaran-S (72 public repos).
 * `main` projects get a full case-study page at /work/[slug].
 * `mini` projects are shown in the catalog grid on /work only.
 */
export const projects: Project[] = [
  // ─────────────────────────── MAIN ───────────────────────────
  {
    slug: "freerag",
    name: "FreeRAG",
    valueProp: "Open RAG, no API tax.",
    description:
      "A retrieval-augmented generation system built to run without paid inference APIs - local embeddings, vector retrieval, and grounded responses over your own documents.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "LangChain", "Hugging Face", "FastAPI"],
    repo: "https://github.com/Nivakaran-S/FreeRAG",
    detail: {
      problem:
        "RAG demos almost always assume a paid LLM/embedding API, which makes them expensive to run and impossible to self-host privately.",
      approach:
        "Wired local Hugging Face embeddings into a vector store with a retrieval + grounding pipeline behind a FastAPI service, keeping every component swappable and offline-capable.",
      outcome:
        "A fully self-hostable RAG stack that answers over private documents with citations and zero per-token cost.",
    },
  },
  {
    slug: "sparrow",
    name: "Sparrow",
    valueProp: "Intelligent parcel management with ML pipelines.",
    description:
      "End-to-end parcel management platform with machine-learning prediction pipelines (Random Forest, XGBoost) for delivery estimation and routing - a full ML lifecycle from data to product.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "scikit-learn", "XGBoost", "Next.js"],
    repo: "https://github.com/Nivakaran-S/sparrow-frontend",
    detail: {
      problem:
        "Parcel operations needed delivery-time estimates and routing decisions instead of manual guesswork across a growing volume of shipments.",
      approach:
        "Built feature pipelines and trained Random Forest / XGBoost models for prediction, then served them behind a Next.js operations dashboard.",
      outcome:
        "A working pipeline that turns raw shipment data into actionable delivery predictions inside a usable product surface.",
    },
  },
  {
    slug: "ecoharvest",
    name: "EcoHarvest",
    valueProp: "AI surplus-food commerce that fights waste.",
    description:
      "A full-stack surplus-food e-commerce platform with AI-driven recommendations, connecting vendors and buyers to reduce food waste.",
    category: "Software Engineering",
    tier: "main",
    stack: ["Next.js", "Node.js", "MongoDB", "TypeScript"],
    repo: "https://github.com/Nivakaran-S/EcoHarvest",
    live: "https://eco-harvest-frontend.vercel.app",
    detail: {
      problem:
        "Edible surplus food is wasted because vendors and buyers have no low-friction marketplace to move it quickly.",
      approach:
        "Built a full-stack marketplace (Next.js + Node + MongoDB) with auth, catalog, and ordering, plus AI-driven recommendations to surface relevant surplus.",
      outcome:
        "A deployed e-commerce platform that operationalises waste reduction into a real buying flow.",
    },
  },
  {
    slug: "medsync",
    name: "MedSync",
    valueProp: "Healthcare coordination, synced.",
    description:
      "A healthcare coordination platform streamlining clinical workflows and patient data - informed by hands-on experience in medical documentation.",
    category: "Software Engineering",
    tier: "main",
    stack: ["TypeScript", "Next.js", "Node.js"],
    repo: "https://github.com/Nivakaran-S/MedSync",
    detail: {
      problem:
        "Clinical coordination is fragmented across tools, and documentation overhead slows down care.",
      approach:
        "Designed a TypeScript/Next.js platform around clinical workflows, drawing directly on first-hand experience as a medical scribe.",
      outcome:
        "A coordination surface that consolidates patient workflow into one consistent, fast interface.",
    },
  },
  {
    slug: "laborguard",
    name: "LaborGuard",
    valueProp: "Workforce safety, instrumented.",
    description:
      "A workforce management and safety monitoring application for tracking labor compliance and operational risk.",
    category: "Software Engineering",
    tier: "main",
    stack: ["JavaScript", "Node.js", "MongoDB"],
    repo: "https://github.com/Nivakaran-S/LaborGuard",
    live: "https://labor-guard-15vm.vercel.app",
    detail: {
      problem:
        "Workforce compliance and safety risk are hard to track when records live in spreadsheets and memory.",
      approach:
        "Built a Node/MongoDB application to record, monitor, and surface labor-compliance and operational-risk signals.",
      outcome:
        "A deployed tool that makes workforce safety status visible and auditable.",
    },
  },
  {
    slug: "lens",
    name: "lens",
    valueProp: "See your data differently.",
    description:
      "A data visualisation and analysis interface for exploring datasets through an interactive, modern UI.",
    category: "Data Analysis",
    tier: "main",
    stack: ["TypeScript", "Next.js"],
    repo: "https://github.com/Nivakaran-S/lens",
    live: "https://lens-navy.vercel.app",
    detail: {
      problem:
        "Raw datasets are hard to reason about without a fast, exploratory visual interface.",
      approach:
        "Built an interactive TypeScript/Next.js UI focused on letting users slice and view data fluidly.",
      outcome:
        "A deployed visualisation tool that turns datasets into something explorable.",
    },
  },
  {
    slug: "book-recommendation",
    name: "NLP Book Recommendation",
    valueProp: "Embeddings that actually recommend.",
    description:
      "A semantic book recommendation engine using Hugging Face embeddings to surface suggestions by meaning rather than keywords.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "Hugging Face", "Jupyter", "NLP"],
    repo: "https://github.com/Nivakaran-S/Book-Recommendation",
    detail: {
      problem:
        "Keyword search misses books that are conceptually similar but worded differently.",
      approach:
        "Embedded titles/descriptions with Hugging Face models and ranked recommendations by semantic similarity.",
      outcome:
        "A recommender that suggests by meaning, surfacing relevant books keyword search would miss.",
    },
  },
  {
    slug: "vision-classifier",
    name: "Vision CNN Classifier",
    valueProp: "Computer vision, from scratch.",
    description:
      "A custom convolutional neural network classifying cat / dog / person images, served through an interactive Gradio interface.",
    category: "Computer Vision",
    tier: "main",
    stack: ["PyTorch", "CNN", "Gradio", "Python"],
    repo: "https://github.com/Nivakaran-S?tab=repositories",
    detail: {
      problem:
        "Understanding CNNs end to end means building, training, and serving one - not just calling a pretrained API.",
      approach:
        "Implemented and trained a custom CNN in PyTorch for cat/dog/person classification, then wrapped it in a Gradio demo.",
      outcome:
        "A from-scratch vision model with an interactive interface anyone can try.",
    },
  },

  // ─────────────────────────── MINI ───────────────────────────
  // Smaller experiments / coursework / hardware repos from the 72-repo catalog.
  // No case-study route; surfaced on /work in the Mini grid.
  {
    slug: "personalized-bp",
    name: "Personalized_BP",
    valueProp: "Personalised blood-pressure modelling.",
    description:
      "Experiments in personalised blood-pressure prediction from physiological signals.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "scikit-learn"],
    repo: "https://github.com/Nivakaran-S/Personalized_BP",
  },
  {
    slug: "model-x",
    name: "Model-X",
    valueProp: "Modular ML experiment scaffolding.",
    description:
      "A sandbox for spinning up ML experiments with a clean train/eval/serve loop.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "TypeScript"],
    repo: "https://github.com/Nivakaran-S/Model-X",
  },
  {
    slug: "x-new",
    name: "X-New",
    valueProp: "Quick-iterate prototype lab.",
    description:
      "A small Python prototype space for trying new modelling ideas fast.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python"],
    repo: "https://github.com/Nivakaran-S/X-New",
  },
  {
    slug: "codebug",
    name: "codebug",
    valueProp: "A debugging sidekick for the editor.",
    description:
      "A small developer-tool experiment - TypeScript, web-deployed.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["TypeScript", "Next.js"],
    repo: "https://github.com/Nivakaran-S/codebug",
    live: "https://codebug-sand.vercel.app",
  },
  {
    slug: "esp32-s3-wiring",
    name: "esp32-s3-wiring",
    valueProp: "Hardware bring-up for the ESP32-S3.",
    description:
      "Wiring + firmware notes for getting the ESP32-S3 board talking to peripherals.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["C++", "Embedded"],
    repo: "https://github.com/Nivakaran-S/esp32-s3-wiring",
  },
  {
    slug: "pos",
    name: "POS",
    valueProp: "Point-of-sale coursework system.",
    description:
      "A point-of-sale system built in C# - desktop UI + persistence.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["C#", ".NET"],
    repo: "https://github.com/Nivakaran-S/POS",
  },
  {
    slug: "green-life-management",
    name: "GreenLifeManagement",
    valueProp: "Sustainability tracking app.",
    description:
      "A management application focused on tracking eco-friendly activities and metrics.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["C#", ".NET"],
    repo: "https://github.com/Nivakaran-S/GreenLifeManagement",
  },
  {
    slug: "task-manager",
    name: "Task-Manager",
    valueProp: "Lightweight task tracker.",
    description:
      "A small task-manager app - clean UI experiments in SCSS.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["SCSS", "JavaScript"],
    repo: "https://github.com/Nivakaran-S/Task-Manager",
  },
];

export const moreProjectsNote =
  "+ 60+ more on GitHub (coursework, experiments, prototypes)";

// ─────────────────────────── Helpers ───────────────────────────

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getMainProjects(): Project[] {
  return projects.filter((p) => p.tier === "main");
}

export function getMiniProjects(): Project[] {
  return projects.filter((p) => p.tier === "mini");
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

/** Categories present in the current dataset, in display order. */
export function getCategories(): ProjectCategory[] {
  return ALL_CATEGORIES.filter((c) =>
    projects.some((p) => p.category === c)
  );
}
