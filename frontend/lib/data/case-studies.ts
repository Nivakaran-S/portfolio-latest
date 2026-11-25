export interface ArchitectureLayer {
  label: string;
  nodes: string[];
  /** Highlights the layer (the part the case study is about). */
  accent?: boolean;
  /** Caption on the arrow leaving this layer. */
  flow?: string;
}

export interface CaseStudyExtras {
  /** One number that anchors the project. `kind` says whether it was measured or is structural. */
  metric: { value: string; label: string; kind: "structural" | "measured" };
  diagram: { title: string; layers: ArchitectureLayer[] };
  tradeoff: { choice: string; gained: string; cost: string };
  nextTime: string[];
  /** Optional screenshot under /public/work/. */
  screenshot?: { src: string; alt: string; caption: string };
  /** Optional link to a related post. */
  related?: { href: string; label: string };
}

/**
 * Depth for the five flagship case studies, keyed by project slug. Facts here
 * come from the repositories (READMEs, service lists) and the project copy in
 * projects.ts. Where a project has no measured result yet, `metric.kind` is
 * "structural" and the page says so instead of implying a benchmark.
 */
export const caseStudyExtras: Record<string, CaseStudyExtras> = {
  ecoharvest: {
    metric: {
      value: "11",
      label: "services behind one gateway, brought up with a single Compose command",
      kind: "structural",
    },
    diagram: {
      title: "EcoHarvest request and event flow",
      layers: [
        { label: "Clients", nodes: ["Customer app", "Vendor dashboard", "Admin console"], flow: "HTTPS" },
        { label: "Edge", nodes: ["API gateway", "JWT verified once", "Per-route rate limits"], accent: true, flow: "identity as trusted headers" },
        {
          label: "Services",
          nodes: ["Auth · User · Vendor", "Product · Cart · Order", "Payment (mock gateway)", "Notification · Admin"],
          flow: "durable topic exchanges",
        },
        { label: "Messaging", nodes: ["RabbitMQ"], flow: "reads and writes" },
        { label: "Data", nodes: ["MongoDB", "Redis cache", "Elasticsearch search"] },
        { label: "Observability", nodes: ["Prometheus", "Grafana"] },
      ],
    },
    tradeoff: {
      choice: "Verify the JWT once at the gateway and pass identity downstream as trusted headers.",
      gained:
        "One auth implementation instead of eleven, and cheap service-to-service calls with no repeated signature checks.",
      cost:
        "Every service now trusts the network edge. Anything that reaches a service directly skips authentication, so the services must never be reachable except through the gateway.",
    },
    nextTime: [
      "Sign the forwarded identity (a short-lived internal token or mTLS) so a service never trusts a header on faith.",
      "Version the shared internal package instead of importing it in place, so one service can lag a release without breaking.",
      "Add contract tests on the gateway-to-service seam, where this kind of system actually drifts.",
      "Swap the mock payment gateway for a real sandbox, so the money path is exercised too.",
    ],
  },

  medsync: {
    metric: {
      value: "8",
      label: "independently deployable services on a Kafka bus, one command on Compose or Kubernetes",
      kind: "structural",
    },
    diagram: {
      title: "MedSync services and event bus",
      layers: [
        { label: "Client", nodes: ["Next.js 16 dashboard", "Patient · Doctor · Admin"], flow: "JWT" },
        { label: "Identity", nodes: ["Auth service (unified JWT)"], flow: "authorised calls" },
        {
          label: "Services",
          nodes: ["Patient", "Doctor", "Appointment", "Telemedicine (Agora + Redis)", "Payment (Stripe)"],
        },
        {
          label: "AI triage",
          nodes: ["Gemini symptom checker", "Deterministic red-flag rules override the model"],
          accent: true,
          flow: "publish events",
        },
        { label: "Event bus", nodes: ["Kafka"], flow: "consume" },
        { label: "Fan-out", nodes: ["Notification service", "Email", "SMS"] },
        { label: "Data", nodes: ["MongoDB", "Redis"] },
      ],
    },
    tradeoff: {
      choice: "Services talk through a Kafka event bus instead of calling each other directly.",
      gained:
        "Suspending a doctor's licence cancels their future appointments without the doctor service knowing the appointment service exists, and one notification consumer handles every email and SMS.",
      cost:
        "Eventual consistency, and a Kafka plus Zookeeper footprint that is heavy for eight services. A failed event is harder to trace than a failed HTTP call.",
    },
    nextTime: [
      "Use the outbox pattern so the database write and the event publish cannot diverge.",
      "Define event schemas once and test them as contracts between producers and consumers.",
      "Measure the triage rules against a labelled set of presentations instead of trusting the clusters by inspection.",
    ],
    related: { href: "/blog/the-dual-write-problem", label: "The dual-write problem, and the outbox that fixes it" },
  },

  freerag: {
    metric: {
      value: "0",
      label: "paid API calls: embeddings and generation both run locally",
      kind: "structural",
    },
    diagram: {
      title: "FreeRAG pipeline",
      layers: [
        { label: "Ingest", nodes: ["PDF", "DOCX", "TXT", "Markdown"], flow: "split into chunks" },
        { label: "Embed", nodes: ["sentence-transformers (all-MiniLM-L6-v2)"], flow: "vectors" },
        { label: "Store", nodes: ["ChromaDB"], flow: "top-k by similarity" },
        { label: "Generate", nodes: ["Phi-3.5-mini (GGUF via llama-cpp)"], accent: true, flow: "answer + sources" },
        { label: "Serve", nodes: ["Gradio chat UI", "Source citations"] },
      ],
    },
    tradeoff: {
      choice: "A small local model instead of a hosted one.",
      gained: "Documents never leave the machine, and the marginal cost of a question is zero.",
      cost:
        "Weaker reasoning and slower answers on CPU than a hosted model, so answer quality depends heavily on retrieval quality. I have not measured how much.",
    },
    nextTime: [
      "Build a small labelled question set first, then measure retrieval recall@k and answer faithfulness before touching chunking or the model.",
      "Add hybrid retrieval (BM25 plus vectors) and a reranker, and keep them only if the eval says they help.",
      "Publish the eval script in the repo so anyone can rerun it.",
    ],
  },

  sparrow: {
    metric: {
      value: "7",
      label: "services behind one Spring Boot gateway, with Keycloak handling identity",
      kind: "structural",
    },
    diagram: {
      title: "Sparrow logistics platform",
      layers: [
        { label: "Client", nodes: ["Next.js operations dashboard"], flow: "OIDC token" },
        { label: "Identity", nodes: ["Keycloak", "PostgreSQL"], flow: "validated JWT" },
        { label: "Edge", nodes: ["Spring Boot API gateway"], accent: true, flow: "routes" },
        {
          label: "Java services",
          nodes: ["User", "Parcel", "Tracking", "Notification", "Location"],
        },
        { label: "Python services", nodes: ["ETA service (ML)", "Chatbot service"] },
      ],
    },
    tradeoff: {
      choice: "Delegate authentication to Keycloak rather than writing JWT handling myself.",
      gained: "Standard OIDC, roles and token validation across Java and Python services without custom auth code.",
      cost:
        "One more stateful component to run, and a setup script that has to complete before anything else works. Two toolchains (Java and Python) also mean two build and test setups.",
    },
    nextTime: [
      "Score the ETA model against a naive baseline on held-out bookings before the estimate reaches the UI. The notebook explores the data but records no error figure.",
      "Version the model artifact and serve it behind a health-checked endpoint, so a bad model can be rolled back.",
      "Add a tracing id that follows a parcel across all seven services.",
    ],
    screenshot: {
      src: "/work/sparrow.png",
      alt: "The Sparrow operations dashboard",
      caption: "The deployed operations frontend.",
    },
  },

  "phishing-detection": {
    metric: {
      value: "5",
      label: "candidate algorithms scored head to head over 30 URL, domain and page-behaviour signals",
      kind: "structural",
    },
    diagram: {
      title: "Phishing detection pipeline",
      layers: [
        { label: "Source", nodes: ["MongoDB"], flow: "ingest" },
        { label: "Validate", nodes: ["Schema check", "KS drift gate per feature"], accent: true, flow: "clean data" },
        { label: "Transform", nodes: ["Preprocessor", "saved as preprocessor.pkl"], flow: "features" },
        {
          label: "Train",
          nodes: ["Random Forest", "Gradient Boosting", "AdaBoost", "Decision Tree", "Logistic Regression"],
          flow: "best by score",
        },
        { label: "Track", nodes: ["MLflow on DagsHub", "f1 · precision · recall"] },
        { label: "Serve", nodes: ["FastAPI /train", "FastAPI /predict (CSV in, table out)"] },
      ],
    },
    tradeoff: {
      choice: "A drift gate that stops the run when a feature's distribution has shifted.",
      gained: "The pipeline never trains silently on data that no longer looks like the schema it was built for.",
      cost:
        "A noisy gate blocks on harmless shifts, so the threshold needs tuning. And persisting the preprocessor next to the model ties every model version to one transform.",
    },
    nextTime: [
      "Accept a raw URL and extract the 30 signals myself, instead of scoring a CSV of precomputed features. That is the gap between a model and a product.",
      "Report held-out precision and recall at a chosen threshold on this page. They are logged in MLflow today, not shown here.",
      "Cache the slow lookups (domain age, SSL state) behind the extractor.",
    ],
  },
};
