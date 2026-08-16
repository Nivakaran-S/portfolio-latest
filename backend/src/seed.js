import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { KbDocument } from "./models/Document.js";
import { embed } from "./services/embeddings.js";

/**
 * Seed the chatbot knowledge base. Re-run any time to reset it.
 * Each chunk is embedded so the RAG retriever can find it.
 * Keep facts accurate — the bot answers strictly from this.
 */
const KNOWLEDGE = [
  {
    title: "Who is Nivakaran",
    category: "about",
    text: "Nivakaran S. is an AI and software engineer based in Colombo, Sri Lanka. He builds data-driven systems end to end — from data pipelines and ML models to the product people click — across AI/ML, software engineering, and data engineering.",
  },
  {
    title: "Healthcare background",
    category: "experience",
    text: "Some of Nivakaran's experience has been in healthcare: he worked as a remote medical scribe for US cardiologists, then in healthcare revenue-cycle operations, and currently builds for a healthcare platform. It's part of his background rather than his sole focus.",
  },
  {
    title: "Current roles",
    category: "experience",
    text: "As of 2026 Nivakaran works as a Junior Developer at Healplace (since March 2026), building features for a healthcare platform front to back, and as an Operations Analyst — Associate, Collections at HealthRecon Connect LLC (since January 2026), turning collections and operations data into decisions for a US healthcare revenue-cycle provider.",
  },
  {
    title: "Earlier work",
    category: "experience",
    text: "Earlier, Nivakaran was a Remote Medical Scribe at Medsource Healthcare LLC (July 2022 to December 2024), documenting clinical encounters for US cardiologists in real time with zero tolerance for error, and a Customer Service Executive at Startek (Commercial Bank PLC) in 2022.",
  },
  {
    title: "Education",
    category: "education",
    text: "Nivakaran is completing a B.Sc (Hons) in Information Technology specializing in Software Engineering at SLIIT (Sri Lanka Institute of Information Technology), 2021 to 2025. He did his G.C.E. Advanced Level in the Biological Science (Bio) stream at St. Benedict's College (2021/2022) before pivoting into software and AI.",
  },
  {
    title: "Skills and stack",
    category: "skills",
    text: "Nivakaran works across AI/ML (RAG systems, model training, inference), software engineering (full-stack products), and data engineering (pipelines). His stack includes Python, PyTorch, scikit-learn, XGBoost, Hugging Face, LangChain, FastAPI, TypeScript, Next.js, Node.js, and MongoDB.",
  },
  {
    title: "FreeRAG project",
    category: "projects",
    text: "FreeRAG is an open retrieval-augmented generation system that runs without paid inference APIs — local Hugging Face embeddings, vector retrieval, and grounded responses with citations over private documents, served via FastAPI. Stack: Python, LangChain, Hugging Face, FastAPI.",
  },
  {
    title: "Sparrow project",
    category: "projects",
    text: "Sparrow is an end-to-end parcel management platform with machine-learning prediction pipelines (Random Forest, XGBoost) for delivery estimation and routing, served behind a Next.js operations dashboard.",
  },
  {
    title: "MedSync project",
    category: "projects",
    text: "MedSync is a cloud-native telehealth platform built as eight independently deployable microservices — auth, patient records, doctor management, appointments, telemedicine, payments, notifications, and an AI symptom checker — coordinated over an Apache Kafka event bus rather than direct service-to-service calls, so a doctor suspension automatically cancels their future appointments and every booking, payment, and prescription fans out to email/SMS through one notification consumer. Symptom triage runs on Google Gemini but is guarded by deterministic red-flag rules (stroke, acute coronary syndrome, anaphylaxis, sepsis) that override the model, with a local specialty map as fallback when the API is unavailable. It also includes Agora video consults, Stripe checkout with signature-verified webhooks, QR-verifiable prescriptions, and a privacy page where patients see an audit trail of who accessed their record. Stack: Node.js, Express, MongoDB, Redis, Kafka, Next.js 16, React 19, TypeScript, Docker Compose, and Kubernetes. Triage is decision support that routes patients to the right clinician, not a diagnosis.",
  },
  {
    title: "EcoHarvest project",
    category: "projects",
    text: "EcoHarvest is a multi-tenant food e-commerce platform built as eleven Node.js microservices (auth, user, product, order, cart, payment, vendor, notification, admin, review, search) behind an API gateway that verifies the JWT once at the edge and forwards identity to services as trusted headers, with stricter rate limits on credential endpoints than on browsing. Cross-cutting concerns — database connection, structured logging, validators, response envelope, and RabbitMQ publish/subscribe over durable topic exchanges — live in a single shared internal package that every service imports. Product search runs on Elasticsearch, caching on Redis, and observability on Prometheus and Grafana; the whole stack comes up via Docker Compose. Separate customer, vendor, and admin surfaces on a Next.js/TypeScript frontend. The payment service runs against a mock gateway rather than a live processor. Live at eco-harvest-frontend.vercel.app.",
  },
  {
    title: "NASA APOD Airflow ETL project",
    category: "projects",
    text: "The NASA APOD Airflow project is Nivakaran's data-engineering work: an Apache Airflow DAG that runs daily to extract NASA's Astronomy Picture of the Day from their public API, transform the response, and load it into PostgreSQL. It uses the modern TaskFlow API with @task decorators alongside an HttpOperator, passes data between tasks via XCom, and reads both the NASA API key and the database credentials from Airflow Connections rather than hardcoding them — the API key comes through a Jinja template from the connection's extras. Inserts are parameterised, tasks log and re-raise failures so Airflow marks them failed, retries are configured, and the repo includes DAG-integrity tests that fail if the graph does not parse. It runs on the Astronomer runtime with Docker Compose providing Postgres. Stack: Apache Airflow, Python, PostgreSQL, Docker, Astronomer.",
  },
  {
    title: "Phishing Site Detection project",
    category: "projects",
    text: "Phishing Site Detection (repo name SecurityNetwork) is a machine-learning classifier that flags phishing websites from 30 URL, domain, and page-behaviour signals — whether the host is a raw IP address, SSL certificate state, how recently the domain was registered, abnormal anchor targets, iframe use, Google index presence, and similar tells. Rather than choosing an algorithm by instinct, the trainer runs Random Forest, Gradient Boosting, AdaBoost, Decision Tree, and Logistic Regression through a hyperparameter search and selects the best by score, logging f1, precision, and recall to MLflow hosted on DagsHub. It is built as a modular pipeline — MongoDB data ingestion, schema validation with a per-feature Kolmogorov-Smirnov drift gate, transformation, and training — served by FastAPI with a /train endpoint that re-runs the pipeline and a /predict endpoint that scores an uploaded CSV, with the fitted preprocessor persisted alongside the model so inference and training transform data identically. Stack: Python, scikit-learn, MLflow, DagsHub, FastAPI, MongoDB.",
  },
  {
    title: "Delivery Time Prediction project",
    category: "projects",
    text: "Delivery Time Prediction is an end-to-end MLOps pipeline that estimates order delivery times from features like traffic density, weather, distance, delivery-person rating, and festival periods. It is built as four modular stages — data ingestion, data validation, data transformation, and model training — each taking a typed config object and emitting a typed artifact into its own timestamped run directory. Validation acts as a real gate: it checks the schema and runs a two-sample Kolmogorov-Smirnov test per feature at p=0.05, writing a YAML drift report of p-values and per-column drift status before training is allowed to proceed. The model is an XGBoost regressor tuned with RandomizedSearchCV, with runs tracked in MLflow, a Flask web app serving real-time predictions from the persisted scaler and model, and a GitHub Actions workflow that builds a Docker image and pushes it to Amazon ECR. Stack: Python, XGBoost, scikit-learn, MLflow, Flask, Docker, AWS ECR.",
  },
  {
    title: "Driving Licence System project",
    category: "projects",
    text: "The Driving Licence System is a full driving-licence issuing platform written in PHP on a custom MVC architecture Nivakaran built himself — his own router, auth and role middleware, validator, and PDO data layer, with no framework. A licence application moves through an eight-state lifecycle (submitted, medical scheduled, medical passed/failed, driving test scheduled, driving test passed/failed, licence issued) across four roles: applicant, medical officer, evaluator, and admin. Each transition is driven by real work — the medical officer logs vision, hearing, and physical fitness results; the evaluator submits scored road-test criteria; passing automatically issues the licence. It also has admin-managed test slot booking with capacity limits, and public pages where anyone can check an application by reference ID or verify a licence number without logging in. Security fundamentals are done correctly: PDO prepared statements with emulation disabled, CSRF tokens compared with hash_equals, and password_hash for credentials. Stack: PHP, MySQL, Bootstrap.",
  },
  {
    title: "HMS Hospital Management System project",
    category: "projects",
    text: "HMS is a microservices hospital management system in C# / ASP.NET Core 9, with patient, doctor, appointment, and billing services that each own a separate PostgreSQL database and communicate over Apache Kafka. Its most notable piece of engineering is a transactional outbox: the domain event is written to an outbox table inside the same EF Core transaction as the appointment record, so the state change and the event commit atomically and billing can never miss a booking that happened — a correct solution to the dual-write problem, without distributed transactions. A background publisher drains unsent messages every five seconds with Polly exponential-backoff retries, tracking retry count and last error per message. The stack also includes an Ocelot API gateway that resolves services through Eureka, Keycloak for authentication, Serilog and OpenTelemetry for structured logging and tracing, a Next.js frontend, Docker Compose, and complete Kubernetes manifests (deployments, services, persistent volumes, secrets, ingress). Automated test coverage is currently thin.",
  },
  {
    title: "LaborGuard project",
    category: "projects",
    text: "LaborGuard is a worker-rights platform for the informal economy, aligned to UN SDG 8, that connects workers with legal aid, NGOs, employers, and a support community — a worker files a complaint, it is assigned to a lawyer, and the outcome feeds NGO impact reporting, with role-scoped portals for worker, employer, lawyer, NGO, and admin. It runs as six containerised Node.js microservices (auth, community, complaint, notification, messaging, jobs) over an Apache Kafka event bus with MongoDB, a React/Vite frontend, Centrifugo for real-time messaging, and 141 automated Jest tests in a GitHub Actions matrix. It was a four-person university team project for SE3040 Application Frameworks at SLIIT; Nivakaran owned the community service (including dual-layer moderation using Google's Perspective API for text toxicity and an NSFWJS classifier for images), the frontend, cross-service integration, and deployment to Render and Vercel. Live at labor-guard.vercel.app.",
  },
  {
    title: "CCTV Gun Detection project",
    category: "projects",
    text: "CCTV Gun Detection is a computer-vision system that flags firearms in surveillance frames. Nivakaran fine-tuned a COCO-pretrained Faster R-CNN ResNet50-FPN (swapping the predictor head for two classes) on an annotated gun dataset, expressed the whole dataset-to-checkpoint path as a reproducible DVC pipeline, and served it behind a FastAPI endpoint that returns frames with detections boxed above a 0.7 confidence threshold. It is a defensive decision-support tool for authorised surveillance — it directs a human operator's attention, it does not act on its own. Stack: PyTorch, torchvision, Faster R-CNN, FastAPI, DVC, TensorBoard.",
  },
  {
    title: "Other projects",
    category: "projects",
    text: "Other projects include lens (an interactive data-visualization UI), the Semantic Book Recommender (a three-model NLP pipeline: MiniLM sentence embeddings in a Chroma vector store for meaning-based retrieval, facebook/bart-large-mnli zero-shot classification to normalise messy genre labels, and j-hartmann/emotion-english-distilroberta-base scoring each book across seven emotions so readers can filter by emotional tone — suspenseful, joyful, sad — through a Gradio dashboard), a from-scratch CNN image classifier in PyTorch (cat/dog/person — four BatchNorm convolutional blocks with no pretrained backbone) deployed publicly as a Gradio app on Hugging Face Spaces at huggingface.co/spaces/nivakaran/classification-gradio-KNCVU, a Ridge regression predicting the Fire Weather Index from meteorological readings on the Algerian forest-fires dataset with a Flask front end packaged for AWS Elastic Beanstalk, a SQL database chatbot that uses a LangChain ReAct agent over a SQLDatabaseToolkit to answer plain-English questions by writing and running queries against SQLite or MySQL, a YouTube and website summarizer that loads a video transcript or scrapes an article and returns a 300-word summary via LangChain and Groq, a bank customer churn predictor using a Keras ANN with early stopping (about 85% validation accuracy against a 79.6% majority-class baseline) where the fitted scaler and categorical encoders are versioned alongside the model so the Streamlit app preprocesses input exactly as training did, a credit-card fraud transaction classifier over the anonymised PCA-component dataset, built on the same modular MongoDB-to-MLflow pipeline pattern as the phishing detector, a custom video broadcaster that acts as a virtual webcam — YOLOv8 instance segmentation isolates people in real time, the mask is eroded to remove edge halos, and the composited frame (blurred, black, or custom background) is published through pyvirtualcam as a system camera device that Zoom or Teams can select, controlled by a FastAPI service, a malaria screening classifier over blood-smear images (VGG19 with frozen ImageNet weights and a new classification head, about 93% validation accuracy on a 550-image subset, served through Flask — framed as a triage aid for prioritising slides, not a diagnostic instrument), a real-time hand-sign alphabet interpreter using MediaPipe hand tracking with aspect-ratio-preserving letterbox normalisation feeding a 26-class CNN, trained on a dataset Nivakaran collected himself with a purpose-built capture tool, an agentic chatbot whose single LangGraph builder compiles three different agent topologies selected from a config file (a plain chatbot, a ReAct-style tool loop that calls Tavily web search and feeds results back to the model, and an AI-news pipeline that fetches by time range, summarises to dated markdown with source links, and saves it), an IMDB movie-review sentiment classifier using a SimpleRNN over a 1,000-word vocabulary, trained with early stopping to roughly 79% validation accuracy and served through Streamlit, a food image classifier fine-tuning EfficientNet-B0 across the 101 dish classes of Food-101, served through a validated FastAPI endpoint that also maps each dish into a coarser category, an agentic blog generator built on LangGraph (a typed state graph running title generation into content generation, then a conditional edge routing to Tamil or Sinhala translation with prompts that adapt idiom rather than translate literally, using Pydantic-structured output and Groq-hosted Llama 4, exposed via both Streamlit and FastAPI), a real-time webcam age and gender estimator (Haar-cascade face detection feeding a pretrained third-party WideResNet, with age decoded as an expected value over a 101-class softmax rather than an argmax — the pipeline is Nivakaran's, the model architecture and weights are published work by others), a content-based movie recommender over the TMDB 5000 dataset (metadata folded into bag-of-words vectors ranked by cosine similarity, with a Streamlit UI pulling posters from the TMDB API), a stacked four-layer LSTM stock-price predictor trained per ticker on Colombo Stock Exchange data (John Keells, Commercial Bank) with a Flask app that pulls live history from Yahoo Finance and overlays EMA charts, and POS — a multi-tenant point-of-sale architecture in C#/.NET 9 with eight minimal-API microservices behind a YARP gateway, Keycloak authentication, Eureka service discovery, an Electron desktop client alongside a Next.js web client, and trilingual English/Tamil/Sinhala localisation. Nivakaran has 72+ public repositories on GitHub.",
  },
  {
    title: "Competitions and awards",
    category: "competitions",
    text: "Nivakaran competes actively: 2nd Runner-Up at Model X (solo competitor, IEEE Computational Intelligence Society, 2025); Semi-finalist at the SLIoT Challenge 2026 (University of Moratuwa); Top 10 at SLIITXtreme 2025 (IEEE Computer Society, SLIIT); Top 10 at CodeFest Algothon 2025 (Faculty of Computing, SLIIT); and currently competing in CodeSprint 11 (IEEE Student Branch, IIT).",
  },
  {
    title: "How he works",
    category: "about",
    text: "Nivakaran's principles: he owns the whole loop from data pipeline to product, stays precise and calm under load (a habit from real-time clinical documentation), and favors disciplined engineering over clever shortcuts — building things that last, not just things that demo.",
  },
  {
    title: "Contact and availability",
    category: "contact",
    text: "Nivakaran is open to roles in AI/ML, software, and data engineering — especially where healthcare meets technology. Reach him by email at nivakaran@hotmail.com, on GitHub at github.com/Nivakaran-S, or on LinkedIn at linkedin.com/in/nivakaran.",
  },
];

async function run() {
  await connectDB();
  await KbDocument.deleteMany({});
  for (const k of KNOWLEDGE) {
    const embedding = await embed(`${k.title}. ${k.text}`);
    await KbDocument.create({ ...k, embedding });
    console.log("  seeded:", k.title);
  }
  console.log(`✓ Seeded ${KNOWLEDGE.length} knowledge chunks.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
