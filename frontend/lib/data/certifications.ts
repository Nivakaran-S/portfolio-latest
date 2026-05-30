export interface Certification {
  label: string;
  detail: string;
}

export const certifications: Certification[] = [
  { label: "Big Data Engineering", detail: "Hadoop · Spark · Kafka pipelines" },
  { label: "Machine Learning", detail: "Supervised & unsupervised modelling" },
  { label: "Data Science", detail: "Analysis, statistics & visualization" },
  { label: "Computer Vision", detail: "CNNs & image classification" },
  { label: "Advanced ML / NLP", detail: "Embeddings & language models" },
  { label: "Agentic AI", detail: "LangChain / LangGraph orchestration" },
  { label: "Generative AI", detail: "LLM application development" },
  { label: "TensorFlow", detail: "Deep learning in production" },
];
