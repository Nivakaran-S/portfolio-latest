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
    valueProp: "Eleven services behind one front door.",
    description:
      "A multi-tenant food commerce platform split into eleven Node services behind an API gateway - JWT verified once at the edge, RabbitMQ topic exchanges for async events, Elasticsearch product search, Redis caching, and Prometheus/Grafana over the top. Customers, vendors, and admins each get their own surface.",
    category: "Software Engineering",
    tier: "main",
    stack: ["Next.js", "Node.js", "RabbitMQ", "Elasticsearch", "MongoDB"],
    repo: "https://github.com/Nivakaran-S/EcoHarvest",
    live: "https://eco-harvest-frontend.vercel.app",
    detail: {
      problem:
        "Split a storefront into eleven services and you inherit eleven copies of every cross-cutting concern - auth, logging, validation, message plumbing - and eleven chances for them to drift apart. Drawing the service boundaries is the easy part; the seams between them are where these systems actually rot.",
      approach:
        "Put a gateway in front that verifies the JWT once and forwards identity downstream as trusted headers, with far tighter rate limits on credential endpoints than on browsing. Everything cross-cutting - DB connection, structured logger, validators, response envelope, and RabbitMQ publish/subscribe over durable topic exchanges - lives in one internal package every service imports, so a fix lands in one place. Search runs on Elasticsearch, hot reads on Redis, and Prometheus scrapes the fleet.",
      outcome:
        "A deployed storefront with customer, vendor, and admin surfaces, over a Compose stack that brings up all eleven services plus MongoDB, Redis, RabbitMQ, and Elasticsearch in one command. Payments run against a mock gateway - the commerce flow is complete end to end, the money movement is deliberately stubbed.",
    },
  },
  {
    slug: "medsync",
    name: "MedSync",
    valueProp: "Eight services, one coherent visit.",
    description:
      "A cloud-native telehealth platform - eight containerised microservices on a Kafka event bus, with AI symptom triage guarded by deterministic red-flag rules, Agora video consults, Stripe checkout, and an access audit trail patients can read themselves. The whole stack boots from one command on Compose or Kubernetes.",
    category: "Software Engineering",
    tier: "main",
    stack: ["Node.js", "Kafka", "Kubernetes", "MongoDB", "Next.js"],
    repo: "https://github.com/Nivakaran-S/MedSync",
    detail: {
      problem:
        "A patient with chest pain shouldn't have to guess which specialist to book, and a clinic shouldn't need six disconnected tools to see them. Build all of that as one monolith and it shares a single blast radius - a billing bug can take down the consultation someone is waiting on.",
      approach:
        "Split it into eight independently deployable services behind unified JWT auth, talking over a Kafka event bus instead of calling each other directly - so suspending a doctor's licence auto-cancels their future appointments, and every booking, payment, and prescription fans out to email and SMS through a single notification consumer. Gemini drives symptom triage, but deterministic red-flag clusters for stroke, cardiac, anaphylaxis, and sepsis presentations override the model outright, and a local specialty map keeps triage answering when the API is down.",
      outcome:
        "A platform that comes up end to end from one command on Docker Compose or Kubernetes: video consults, Stripe checkout, QR-verifiable prescriptions, and an audit trail a patient can open to see exactly who read their record and when. Triage is preliminary guidance that routes people to the right clinician - never a diagnosis.",
    },
  },
  {
    slug: "phishing-detection",
    name: "Phishing Site Detection",
    valueProp: "Thirty tells that a site is lying.",
    description:
      "A phishing-site classifier over 30 URL, domain, and page-behaviour signals - SSL state, domain age, abnormal anchors, iframe use - where the algorithm is chosen by scored comparison across five candidates rather than by instinct. Modular MongoDB-backed pipeline with schema and drift gates, MLflow tracking on DagsHub, and FastAPI train and predict endpoints.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "scikit-learn", "MLflow", "FastAPI", "MongoDB"],
    repo: "https://github.com/Nivakaran-S/SecurityNetwork",
    detail: {
      problem:
        "Phishing pages don't announce themselves, they imitate. What gives them away is a pile of small tells - an IP address where a hostname should be, a domain registered two weeks ago, a login form that submits somewhere else, anchors pointing off-site - and not one of them is conclusive on its own.",
      approach:
        "Trained a binary classifier over 30 such signals, and rather than picking an algorithm by instinct, ran Random Forest, Gradient Boosting, AdaBoost, Decision Tree, and Logistic Regression through a hyperparameter search and selected on scored performance. The run is a modular pipeline - MongoDB ingestion, schema validation with a per-feature Kolmogorov-Smirnov drift gate, transformation, training - with f1, precision, and recall logged to MLflow on DagsHub for every experiment.",
      outcome:
        "A FastAPI service where one endpoint re-runs the whole training pipeline and another scores an uploaded CSV, returning results as a table and to disk. The fitted preprocessor is persisted next to the model, so inference transforms data exactly the way training did - the failure mode that quietly ruins deployed classifiers.",
    },
  },
  {
    slug: "delivery-time-prediction",
    name: "Delivery Time Prediction",
    valueProp: "A model is the easy part.",
    description:
      "An end-to-end ML pipeline for delivery-time estimation - ingestion, schema validation, transformation, and XGBoost training as separate stages, each emitting typed artifacts into its own timestamped run directory. Every run is gated by a per-feature Kolmogorov-Smirnov drift check, tracked in MLflow, and shipped as a container to Amazon ECR by GitHub Actions.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "XGBoost", "MLflow", "Flask", "Docker"],
    repo: "https://github.com/Nivakaran-S/Delivery-Time-Prediction",
    detail: {
      problem:
        "Fitting a regressor is the small part of the job. What actually breaks later is everything around it - the schema quietly changes, the incoming distribution drifts away from what the model was trained on, and nobody can say which data produced the model currently answering requests.",
      approach:
        "Split the work into four stages - ingestion, validation, transformation, training - that each take a typed config and emit a typed artifact, so the pipeline is inspectable at every seam. Validation is a real gate rather than a formality: it checks schema, then runs a two-sample Kolmogorov-Smirnov test per feature and writes a YAML report of p-values and per-column drift status before anything is allowed to train. XGBoost is tuned by randomised search, runs are logged to MLflow, and each execution lands in its own timestamped artifact directory.",
      outcome:
        "A training run traceable end to end from raw data to persisted model, a Flask endpoint serving predictions off the saved scaler and estimator, and a GitHub Actions job that containerises the app and pushes it to Amazon ECR. The test steps in that workflow are still placeholders - real coverage is the next gap.",
    },
  },
  {
    slug: "driving-license-system",
    name: "Driving Licence System",
    valueProp: "A government workflow, enforced in code.",
    description:
      "A driving-licence issuing system on a hand-rolled PHP MVC stack - own router, own auth and role middleware, no framework. One application moves through an eight-state lifecycle across four roles, with slot booking, automatic issue on a passing road test, and public status and licence-verification pages that need no account.",
    category: "Software Engineering",
    tier: "main",
    stack: ["PHP", "MySQL", "Custom MVC", "Bootstrap"],
    repo: "https://github.com/Nivakaran-S/Driving-Liscense-System",
    detail: {
      problem:
        "Getting a licence is a fixed sequence of gates - medical exam, then road test, then issue - staffed by different people who each only ever see their own desk. The applicant ends up being the one carrying state between offices, and nobody can answer \"where is my application\" without physically finding the file.",
      approach:
        "Modelled the process as an eight-state lifecycle on the application record, where every transition is the by-product of somebody doing their actual job: a medical officer logging vision, hearing, and fitness results moves it forward, an evaluator's scored road test passes or fails it, and a pass issues the licence automatically. Built without a framework - own router, middleware, and validator - on PDO prepared statements with emulation switched off, CSRF tokens compared using hash_equals, and password_hash for credentials.",
      outcome:
        "Four role-scoped dashboards over one shared lifecycle, plus unauthenticated pages where anyone can track an application by reference ID or check whether a licence number is genuine and still valid - the part that turns an internal tool into a public service.",
    },
  },
  {
    slug: "hms",
    name: "HMS",
    valueProp: "A booking and its event can't disagree.",
    description:
      "A hospital management platform on ASP.NET Core 9 - patient, doctor, appointment, and billing services, each owning its own PostgreSQL database and coordinating over Kafka through a transactional outbox. Ocelot gateway with Eureka-resolved routing, Keycloak auth, OpenTelemetry tracing, and complete Kubernetes manifests.",
    category: "Software Engineering",
    tier: "main",
    stack: ["C#", ".NET 9", "Kafka", "PostgreSQL", "Kubernetes"],
    repo: "https://github.com/Nivakaran-S/HMS",
    detail: {
      problem:
        "Give every service its own database - the right call for isolation - and you inherit the dual-write problem. An appointment gets committed to Postgres and an event gets published to Kafka, and if the process dies between those two steps, billing never learns about a booking that definitely happened. Publishing first and saving second just buys you the opposite bug.",
      approach:
        "The event is written into an outbox table inside the same EF Core transaction as the appointment itself, so the state change and the intent to publish commit together or not at all. A background publisher drains unsent rows every five seconds behind a Polly exponential-backoff retry, recording an attempt count and the last error on each message rather than dropping it. Around that: an Ocelot gateway resolving services through Eureka, Keycloak-issued JWTs, and Serilog plus OpenTelemetry for traces.",
      outcome:
        "Four services that stay consistent without a distributed transaction anywhere in the system, deployable by Compose or Kubernetes - deployments, services, persistent volumes, secrets, and ingress manifests all live in the repo. Automated test coverage is thin, and closing that is the honest next step.",
    },
  },
  {
    slug: "laborguard",
    name: "LaborGuard",
    valueProp: "Legal aid for workers with no HR department.",
    description:
      "A worker-rights platform for the informal economy (UN SDG 8) - six containerised microservices connecting workers, employers, lawyers, and NGOs so a wage-theft complaint becomes an assigned legal case instead of a dead end. Self-moderating community feed, real-time chat, and Kafka-driven notifications.",
    category: "Software Engineering",
    tier: "main",
    stack: ["React", "Node.js", "Kafka", "Docker", "MongoDB"],
    repo: "https://github.com/Nivakaran-S/LaborGuard",
    live: "https://labor-guard.vercel.app",
    detail: {
      problem:
        "Informal workers - no contract, no HR department, no legal budget - have nowhere to take a wage-theft or unsafe-site complaint. The advice, the lawyer, the employer, and the NGO tracking the outcome all sit in different places, so most complaints die as an unanswered message.",
      approach:
        "A four-person build across six containerised services on Kafka; I owned the community service, the React frontend, cross-service integration, and deployment. The community layer moderates itself - Google's Perspective API scores text toxicity and an NSFWJS classifier screens uploaded images before a post reaches the feed - and each actor (worker, employer, lawyer, NGO, admin) gets a role-scoped portal over shared case data.",
      outcome:
        "A deployed platform where a complaint routes to an assigned lawyer and lands in NGO impact reporting, behind 141 automated tests running green in a GitHub Actions matrix - which is how we caught auth middleware silently 401-ing every cross-service event in production.",
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
    name: "Semantic Book Recommender",
    valueProp: "Find a book by how it should feel.",
    description:
      "A book recommender you query with a description of what you want to read rather than a keyword - MiniLM embeddings in a Chroma vector store retrieve by meaning, zero-shot classification collapses messy genre strings into clean categories, and a per-book emotion profile lets you narrow to suspenseful, joyful, or sad. Gradio dashboard returning a gallery of covers.",
    category: "Data Science",
    tier: "main",
    stack: ["Python", "Hugging Face", "Chroma", "LangChain", "Gradio"],
    repo: "https://github.com/Nivakaran-S/Book-Recommendation",
    detail: {
      problem:
        "Search a catalogue by keyword and you get title matches. What a reader actually wants to express is closer to a feeling - something eerie and slow-building, or hopeful after a hard year - and no keyword index has a column for that.",
      approach:
        "Three models, each doing one job. Sentence-transformer embeddings in a Chroma vector store handle retrieval, so a free-text description of a mood finds books whose blurbs mean something similar. A zero-shot classifier folds the dataset's inconsistent category strings into clean genres. An emotion classifier then scores every description across seven emotions and keeps the peak score per book, so one genuinely tense passage still registers - which is what turns 'suspenseful' into something you can sort on.",
      outcome:
        "A Gradio dashboard where a sentence about what you're in the mood for, narrowed by optional genre and emotional tone, returns a gallery of covers. Retrieval by meaning, filtered by feeling.",
    },
  },
  {
    slug: "vision-classifier",
    name: "Vision CNN Classifier",
    valueProp: "From scratch, and live to try.",
    description:
      "A three-class image classifier (cat / dog / person) on a CNN built by hand in PyTorch - four BatchNorm-regularised convolutional blocks, no pretrained backbone anywhere - with the flattened layer size derived by a dummy forward pass instead of hand-computed. Deployed publicly on Hugging Face Spaces behind a Gradio interface that returns the label drawn onto the image.",
    category: "Computer Vision",
    tier: "main",
    stack: ["PyTorch", "CNN", "Gradio", "Hugging Face"],
    repo: "https://github.com/Nivakaran-S/Cat-Dog-Person-Classifier",
    live: "https://huggingface.co/spaces/nivakaran/classification-gradio-KNCVU",
    detail: {
      problem:
        "Fine-tuning a pretrained ResNet teaches you how to call an API, not how a convolutional network actually works. And a model that only ever runs in the notebook that produced it is something nobody else can judge.",
      approach:
        "Built the architecture by hand in PyTorch - four convolutional blocks, each Conv2d into BatchNorm into ReLU into MaxPool, widening from 32 to 256 channels, feeding a three-layer classifier head - with no pretrained weights involved. The flattened dimension going into the first linear layer is computed at construction time by pushing a dummy tensor through the conv stack, so input resolution stays a parameter rather than a constant somebody has to recalculate by hand.",
      outcome:
        "A public Hugging Face Space where anyone can drop in an image or use their webcam and get the class back, annotated onto the picture. No accuracy figures are claimed - the training run lives outside the repo - so the running demo is the evidence.",
    },
  },
  {
    slug: "gun-detection",
    name: "CCTV Gun Detection",
    valueProp: "Seconds of warning, not hours of footage.",
    description:
      "A Faster R-CNN firearm detector for surveillance feeds - transfer-learned on an annotated gun dataset, reproduced end to end as a DVC pipeline, and served as a FastAPI endpoint that returns frames with detections boxed.",
    category: "Computer Vision",
    tier: "main",
    stack: ["PyTorch", "Faster R-CNN", "FastAPI", "DVC"],
    repo: "https://github.com/Nivakaran-S/Gun-Detection",
    detail: {
      problem:
        "A handful of operators watch hundreds of CCTV feeds, and control-room vigilance drops off within the first half hour - so footage ends up used forensically, to reconstruct an incident, instead of preventively to interrupt one.",
      approach:
        "Fine-tuned a COCO-pretrained Faster R-CNN ResNet50-FPN by swapping its predictor head for two classes, kept the backbone so 333 images wouldn't overfit, and wired ingestion through training into a cache-aware DVC DAG behind a FastAPI service.",
      outcome:
        "A reproducible dataset-to-checkpoint pipeline plus an endpoint that returns annotated frames above a 0.7 confidence threshold - decision support that points a human operator at the right monitor, never an autonomous trigger.",
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
    slug: "forest-fire-regression",
    name: "Forest Fire Index Regression",
    valueProp: "Fire risk from nine weather readings.",
    description:
      "A Ridge regression predicting the Fire Weather Index from nine meteorological and fuel-moisture readings on the Algerian forest-fires dataset, served behind a Flask form. Regularisation chosen against correlated weather features, with the fitted scaler and model both committed and the app packaged for AWS Elastic Beanstalk.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "scikit-learn", "Flask", "AWS"],
    repo: "https://github.com/Nivakaran-S/forestfire",
  },
  {
    slug: "sql-database-chatbot",
    name: "SQL Database Chatbot",
    valueProp: "Ask the database in English.",
    description:
      "A LangChain SQL agent that turns plain-English questions into queries against a live database - ReAct-style tool use over a SQLDatabaseToolkit, with the agent's intermediate reasoning streamed into the Streamlit chat as it works. SQLite is opened read-only; MySQL connects with credentials supplied at runtime.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "LangChain", "SQL", "Groq"],
    repo: "https://github.com/Nivakaran-S/SQL-Database-Chatbot",
  },
  {
    slug: "yt-web-summarizer",
    name: "YouTube & Web Summarizer",
    valueProp: "A link in, 300 words out.",
    description:
      "A summariser that takes either a YouTube URL or a web article and returns a 300-word précis - LangChain's YoutubeLoader pulls the transcript, UnstructuredURLLoader scrapes the page behind a browser user-agent, and a summarisation chain over Groq-hosted Gemma does the writing. URLs are validated before any network call.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "LangChain", "Gemma", "Streamlit"],
    repo: "https://github.com/Nivakaran-S/YT-Web-Summarizer",
  },
  {
    slug: "churn-prediction-ann",
    name: "Churn Prediction ANN",
    valueProp: "The encoders ship with the model.",
    description:
      "A Keras ANN predicting bank-customer churn - 64/32 dense layers with early stopping on validation loss, reaching about 85% validation accuracy against a 79.6% majority-class baseline. The fitted scaler and both categorical encoders are persisted and committed alongside the model, so the Streamlit app transforms input exactly as training did and the whole thing runs from a clone.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "TensorFlow", "scikit-learn", "Streamlit"],
    repo: "https://github.com/Nivakaran-S/Churn-Prediction-ANN",
  },
  {
    slug: "fraud-transaction-detection",
    name: "Fraud Transaction Detection",
    valueProp: "Card fraud, hunted in PCA space.",
    description:
      "A fraud classifier over the anonymised credit-card transaction dataset - 28 PCA components plus time and amount - on the same modular pipeline pattern as the phishing detector: MongoDB ingestion, schema and drift validation, KNN imputation, then a five-model hyperparameter sweep with f1, precision, and recall tracked in MLflow on DagsHub.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "scikit-learn", "MLflow", "MongoDB"],
    repo: "https://github.com/Nivakaran-S/Fraud-Transaction-Detection",
  },
  {
    slug: "video-broadcaster",
    name: "Custom Video Broadcaster",
    valueProp: "Your webcam, minus the room behind you.",
    description:
      "A virtual camera that cuts you out of your background in real time - YOLOv8 instance segmentation isolates people, the mask is eroded to kill the halo fringe along the edges, and the composited frame is published as a system camera device any conferencing app can select. FastAPI control plane for source, frame rate, and background mode: blur, black, or a custom image.",
    category: "Computer Vision",
    tier: "mini",
    stack: ["Python", "YOLOv8", "OpenCV", "FastAPI"],
    repo: "https://github.com/Nivakaran-S/CustomVideoBroadcaster",
  },
  {
    slug: "malaria-screening",
    name: "Malaria Screening",
    valueProp: "A blood smear, triaged in a second.",
    description:
      "A malaria screening classifier over blood-smear images - VGG19 with ImageNet weights frozen and a fresh classification head on top, reaching about 93% validation accuracy on a 550-image subset. Flask app that takes an upload and returns the call and a confidence score as JSON. A triage aid to prioritise slides for a microscopist, not a diagnostic instrument.",
    category: "Computer Vision",
    tier: "mini",
    stack: ["Python", "TensorFlow", "VGG19", "Flask"],
    repo: "https://github.com/Nivakaran-S/Malaria-Prediction",
  },
  {
    slug: "hand-sign-interpreter",
    name: "Hand Sign Interpreter",
    valueProp: "The alphabet, signed and read live.",
    description:
      "A real-time sign-language alphabet reader - MediaPipe hand tracking crops the hand, then letterboxes it onto a white square canvas so the gesture keeps its proportions instead of being squashed, before a 26-class CNN names the letter. The dataset is self-collected: a companion capture tool saves identically normalised hand images per letter at a keypress.",
    category: "Computer Vision",
    tier: "mini",
    stack: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
    repo: "https://github.com/Nivakaran-S/Hand-Sign-Interpreter",
  },
  {
    slug: "nasa-airflow-etl",
    name: "NASA APOD Airflow ETL",
    valueProp: "NASA's daily photo, landed in Postgres.",
    description:
      "An Airflow DAG that pulls NASA's Astronomy Picture of the Day and lands it in Postgres on a daily schedule - HttpOperator extract, TaskFlow transform, PostgresHook load, with the API key read from an Airflow connection rather than the source, parameterised inserts, and DAG-integrity tests that fail on an unparseable graph.",
    category: "Data Engineering",
    tier: "mini",
    stack: ["Apache Airflow", "Python", "PostgreSQL", "Docker"],
    repo: "https://github.com/Nivakaran-S/NASA-Airflow-Project",
  },
  {
    slug: "agentic-chatbot",
    name: "Agentic Chatbot",
    valueProp: "One builder, three agent topologies.",
    description:
      "A single LangGraph builder that compiles three different agent shapes chosen from a config file: a plain chatbot, a ReAct-style loop where the model decides when to call Tavily web search and the result feeds back in, and a news pipeline that fetches by time range, summarises into dated markdown with source links, and writes it to disk. Groq-hosted Llama 3 and Gemma behind a Streamlit UI.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "LangGraph", "Tavily", "Groq", "Streamlit"],
    repo: "https://github.com/Nivakaran-S/Agentic-Chatbot",
  },
  {
    slug: "movie-sentiment-analyzer",
    name: "Movie Sentiment Analyzer",
    valueProp: "Sentiment from a thousand words.",
    description:
      "A SimpleRNN sentiment classifier over IMDB reviews - 128-dimension embeddings on a deliberately small 1,000-word vocabulary, trained with early stopping on validation loss to roughly 79% validation accuracy. Streamlit app that encodes free text, folds anything out-of-vocabulary into the unknown token, and returns the sentiment with its confidence score.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "TensorFlow", "RNN", "Streamlit"],
    repo: "https://github.com/Nivakaran-S/Movie-Sentiment-Analyzer",
  },
  {
    slug: "food-image-predictor",
    name: "Food Image Predictor",
    valueProp: "101 dishes, named from a photo.",
    description:
      "An EfficientNet-B0 fine-tuned over the 101 dish classes of Food-101, served by a FastAPI endpoint that validates file type and size, returns a typed response, and maps the predicted dish up into a coarser group like Desserts or Seafood - with a Streamlit interface over the top.",
    category: "Computer Vision",
    tier: "mini",
    stack: ["PyTorch", "EfficientNet", "FastAPI", "Streamlit"],
    repo: "https://github.com/Nivakaran-S/Food-Image-Predictor",
  },
  {
    slug: "blog-generation-agent",
    name: "Agentic Blog Generator",
    valueProp: "Drafting that branches into Tamil and Sinhala.",
    description:
      "A LangGraph agent that drafts a post as a typed state graph - title node into content node, then a conditional edge routing to Tamil or Sinhala translation, where the prompt asks for adapted idiom rather than literal wording. Pydantic-structured LLM output, Groq-hosted Llama 4, reachable through both a Streamlit UI and a FastAPI endpoint.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "LangGraph", "LangChain", "Groq", "FastAPI"],
    repo: "https://github.com/Nivakaran-S/Blog-Generation-With-AI-Agent",
  },
  {
    slug: "age-gender-estimator",
    name: "Age & Gender Estimator",
    valueProp: "Faces read live, age as a distribution.",
    description:
      "A real-time webcam pipeline that detects faces with a Haar cascade, crops them with a proportional margin, and batches them through a WideResNet with two heads - gender, and a 101-class age softmax decoded as an expected value rather than an argmax. The architecture and weights are published third-party work; the capture, detection, and inference loop around them is the build.",
    category: "Computer Vision",
    tier: "mini",
    stack: ["Python", "OpenCV", "Keras", "WideResNet"],
    repo: "https://github.com/Nivakaran-S/GenderAndAgeEstimator",
  },
  {
    slug: "movie-recommendation",
    name: "Movie Recommendation",
    valueProp: "Films matched on their metadata fingerprint.",
    description:
      "A content-based recommender over the TMDB 5000 dataset - genres, keywords, cast, and crew folded into a single text field per film, stemmed, vectorised as bag-of-words, and ranked by cosine similarity. Streamlit front end that pulls posters live from the TMDB API.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "scikit-learn", "Streamlit", "NLTK"],
    repo: "https://github.com/Nivakaran-S/Movie-Recommendation",
  },
  {
    slug: "stock-price-prediction",
    name: "Stock Price Prediction",
    valueProp: "LSTMs pointed at the Colombo exchange.",
    description:
      "A stacked four-layer LSTM trained per ticker on Colombo Stock Exchange history (John Keells, Commercial Bank), served by a Flask app that pulls fresh data from Yahoo Finance, overlays 20/50-day EMAs, and charts predicted against actual closes. Chronological train/test split with the scaler fit on training data only.",
    category: "Data Science",
    tier: "mini",
    stack: ["Python", "TensorFlow", "LSTM", "Flask"],
    repo: "https://github.com/Nivakaran-S/Stock-Price-Prediction",
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
    valueProp: "Retail POS, drawn as a microservice fleet.",
    description:
      "A multi-tenant point-of-sale architecture: eight .NET 9 minimal-API services behind a YARP gateway, with Keycloak auth, Eureka discovery, Postgres, an Electron desktop shell beside a Next.js web client, and the interface localised for English, Tamil, and Sinhala. Service surface and infrastructure are built out; the Python AI tier is scaffolded.",
    category: "Software Engineering",
    tier: "mini",
    stack: ["C#", ".NET 9", "Microservices", "Next.js", "Keycloak"],
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
