export type SkillCategory =
  | "AI / ML & LLMs"
  | "Software Engineering"
  | "Data Engineering"
  | "DevOps / MLOps & Cloud";

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Relative emphasis 1-3 - drives slight weight in the chip list. */
  weight: 1 | 2 | 3;
  /** Logo filename (slug) under /public/logos/<icon>.svg. Omitted for
   *  concepts/tools that have no brand mark (e.g. CNNs, AWS, GitOps). */
  icon?: string;
  /** Visible brand colour the muted logo tints to on hover. Chosen bright
   *  enough to read on the dark theme (substituted where a brand's own
   *  colour is too dark, e.g. Next.js, CircleCI). */
  iconColor?: string;
}

export interface SkillEdge {
  from: string;
  to: string;
}

/** The four pillars, in display order, each with its accent colour. */
export const skillCategories: { id: SkillCategory; color: string }[] = [
  { id: "AI / ML & LLMs", color: "var(--color-neon-cyan-core)" },
  { id: "Software Engineering", color: "var(--color-neon-cyan)" },
  { id: "Data Engineering", color: "var(--color-neon-violet)" },
  { id: "DevOps / MLOps & Cloud", color: "var(--color-neon-lime)" },
];

export const skills: Skill[] = [
  // ── AI / ML & LLMs ───────────────────────────────────────────────────
  { name: "Python", category: "AI / ML & LLMs", weight: 3, icon: "python", iconColor: "#4B8BBE" },
  { name: "PyTorch", category: "AI / ML & LLMs", weight: 3, icon: "pytorch", iconColor: "#EE4C2C" },
  { name: "TensorFlow", category: "AI / ML & LLMs", weight: 2, icon: "tensorflow", iconColor: "#FF6F00" },
  { name: "TensorBoard", category: "AI / ML & LLMs", weight: 1, icon: "tensorflow", iconColor: "#FF6F00" },
  { name: "OpenCV", category: "AI / ML & LLMs", weight: 2, icon: "opencv", iconColor: "#8C6BFF" },
  { name: "CNNs", category: "AI / ML & LLMs", weight: 1 },
  { name: "Hugging Face", category: "AI / ML & LLMs", weight: 2, icon: "huggingface", iconColor: "#FFD21E" },
  { name: "LangChain", category: "AI / ML & LLMs", weight: 2, icon: "langchain", iconColor: "#5CC8C8" },
  { name: "LangGraph", category: "AI / ML & LLMs", weight: 2 },
  { name: "Claude", category: "AI / ML & LLMs", weight: 2, icon: "claude", iconColor: "#D97757" },
  { name: "Mistral", category: "AI / ML & LLMs", weight: 1, icon: "mistralai", iconColor: "#FA520F" },
  { name: "Groq", category: "AI / ML & LLMs", weight: 1 },
  { name: "Tavily", category: "AI / ML & LLMs", weight: 1 },
  { name: "Chroma", category: "AI / ML & LLMs", weight: 1 },
  { name: "Streamlit", category: "AI / ML & LLMs", weight: 1, icon: "streamlit", iconColor: "#FF4B4B" },
  { name: "Gradio", category: "AI / ML & LLMs", weight: 1, icon: "gradio", iconColor: "#FF7C00" },
  { name: "Alibi Detect", category: "AI / ML & LLMs", weight: 1 },

  // ── Software Engineering ─────────────────────────────────────────────
  { name: "TypeScript", category: "Software Engineering", weight: 3, icon: "typescript", iconColor: "#3178C6" },
  { name: "Next.js", category: "Software Engineering", weight: 3, icon: "nextdotjs", iconColor: "#F5F5F5" },
  { name: "Astro", category: "Software Engineering", weight: 1, icon: "astro", iconColor: "#BC52EE" },
  { name: "Node.js", category: "Software Engineering", weight: 2, icon: "nodedotjs", iconColor: "#5FA04E" },
  { name: "React Native", category: "Software Engineering", weight: 2, icon: "react", iconColor: "#61DAFB" },
  { name: "FastAPI", category: "Software Engineering", weight: 2, icon: "fastapi", iconColor: "#05998B" },
  { name: "Flask", category: "Software Engineering", weight: 1, icon: "flask", iconColor: "#E8E8E8" },
  { name: "Java", category: "Software Engineering", weight: 1, icon: "openjdk", iconColor: "#F89820" },
  { name: "Kotlin", category: "Software Engineering", weight: 1, icon: "kotlin", iconColor: "#A87CFF" },
  { name: "Postman", category: "Software Engineering", weight: 1, icon: "postman", iconColor: "#FF6C37" },

  // ── Data Engineering ─────────────────────────────────────────────────
  { name: "PostgreSQL", category: "Data Engineering", weight: 2, icon: "postgresql", iconColor: "#5A8DEE" },
  { name: "MongoDB", category: "Data Engineering", weight: 2, icon: "mongodb", iconColor: "#47A248" },
  { name: "Redis", category: "Data Engineering", weight: 1, icon: "redis", iconColor: "#FF4438" },
  { name: "AstraDB", category: "Data Engineering", weight: 1, icon: "datastax", iconColor: "#C9CBFF" },
  { name: "Apache Airflow", category: "Data Engineering", weight: 2, icon: "apacheairflow", iconColor: "#21A8F0" },
  { name: "Spark", category: "Data Engineering", weight: 2, icon: "apachespark", iconColor: "#E25A1C" },
  { name: "Kafka", category: "Data Engineering", weight: 1, icon: "apachekafka", iconColor: "#E8E8E8" },
  { name: "Databricks", category: "Data Engineering", weight: 1, icon: "databricks", iconColor: "#FF3621" },
  { name: "Elasticsearch", category: "Data Engineering", weight: 1, icon: "elasticsearch", iconColor: "#43CFA0" },
  { name: "Kibana", category: "Data Engineering", weight: 1, icon: "kibana", iconColor: "#F04E98" },
  { name: "Logstash", category: "Data Engineering", weight: 1, icon: "logstash", iconColor: "#FEC514" },
  { name: "Filebeat", category: "Data Engineering", weight: 1, icon: "elastic", iconColor: "#43CFA0" },
  { name: "Pandas", category: "Data Engineering", weight: 2, icon: "pandas", iconColor: "#B58BE0" },
  { name: "NumPy", category: "Data Engineering", weight: 2, icon: "numpy", iconColor: "#4DABCF" },
  { name: "Matplotlib", category: "Data Engineering", weight: 1 },

  // ── DevOps / MLOps & Cloud ───────────────────────────────────────────
  { name: "Docker", category: "DevOps / MLOps & Cloud", weight: 2, icon: "docker", iconColor: "#2496ED" },
  { name: "Docker Hub", category: "DevOps / MLOps & Cloud", weight: 1, icon: "docker", iconColor: "#2496ED" },
  { name: "Kubernetes", category: "DevOps / MLOps & Cloud", weight: 2, icon: "kubernetes", iconColor: "#5B8DEF" },
  { name: "Minikube", category: "DevOps / MLOps & Cloud", weight: 1 },
  { name: "Kubectl", category: "DevOps / MLOps & Cloud", weight: 1 },
  { name: "Google Kubernetes Engine", category: "DevOps / MLOps & Cloud", weight: 1, icon: "googlecloud", iconColor: "#4285F4" },
  { name: "AWS", category: "DevOps / MLOps & Cloud", weight: 2 },
  { name: "GCP", category: "DevOps / MLOps & Cloud", weight: 2, icon: "googlecloud", iconColor: "#4285F4" },
  { name: "Jenkins", category: "DevOps / MLOps & Cloud", weight: 1, icon: "jenkins", iconColor: "#E8503A" },
  { name: "GitLab CI/CD", category: "DevOps / MLOps & Cloud", weight: 1, icon: "gitlab", iconColor: "#FC6D26" },
  { name: "CircleCI", category: "DevOps / MLOps & Cloud", weight: 1, icon: "circleci", iconColor: "#E8E8E8" },
  { name: "Argo CD", category: "DevOps / MLOps & Cloud", weight: 1, icon: "argo", iconColor: "#EF7B4D" },
  { name: "GitOps", category: "DevOps / MLOps & Cloud", weight: 1 },
  { name: "Grafana", category: "DevOps / MLOps & Cloud", weight: 1, icon: "grafana", iconColor: "#F46800" },
  { name: "Prometheus", category: "DevOps / MLOps & Cloud", weight: 1, icon: "prometheus", iconColor: "#E6522C" },
  { name: "SonarQube", category: "DevOps / MLOps & Cloud", weight: 1, icon: "sonarqubeserver", iconColor: "#4E9BCD" },
  { name: "Aqua Trivy", category: "DevOps / MLOps & Cloud", weight: 1, icon: "trivy", iconColor: "#5B7BFF" },
  { name: "MLflow", category: "DevOps / MLOps & Cloud", weight: 2, icon: "mlflow", iconColor: "#0194E2" },
  { name: "Kubeflow", category: "DevOps / MLOps & Cloud", weight: 1 },
  { name: "DVC", category: "DevOps / MLOps & Cloud", weight: 1, icon: "dvc", iconColor: "#945DD6" },
  { name: "DagsHub", category: "DevOps / MLOps & Cloud", weight: 1 },
];

/** Conceptual relationships across the stack - decorative metadata. */
export const skillEdges: SkillEdge[] = [
  { from: "Python", to: "PyTorch" },
  { from: "Python", to: "TensorFlow" },
  { from: "Python", to: "FastAPI" },
  { from: "Python", to: "Flask" },
  { from: "Python", to: "Pandas" },
  { from: "Python", to: "NumPy" },
  { from: "PyTorch", to: "Hugging Face" },
  { from: "PyTorch", to: "CNNs" },
  { from: "PyTorch", to: "Gradio" },
  { from: "CNNs", to: "OpenCV" },
  { from: "TensorFlow", to: "TensorBoard" },
  { from: "LangChain", to: "LangGraph" },
  { from: "LangChain", to: "Hugging Face" },
  { from: "LangChain", to: "Chroma" },
  { from: "LangGraph", to: "Tavily" },
  { from: "Claude", to: "LangChain" },
  { from: "Mistral", to: "Groq" },
  { from: "TypeScript", to: "Next.js" },
  { from: "TypeScript", to: "React Native" },
  { from: "Next.js", to: "Node.js" },
  { from: "Node.js", to: "MongoDB" },
  { from: "Next.js", to: "PostgreSQL" },
  { from: "Pandas", to: "Matplotlib" },
  { from: "Pandas", to: "Spark" },
  { from: "Spark", to: "Kafka" },
  { from: "Spark", to: "Databricks" },
  { from: "Apache Airflow", to: "MLflow" },
  { from: "Docker", to: "Kubernetes" },
  { from: "Kubernetes", to: "Argo CD" },
  { from: "FastAPI", to: "Docker" },
  { from: "MLflow", to: "DVC" },
  { from: "Elasticsearch", to: "Kibana" },
  { from: "Logstash", to: "Elasticsearch" },
  { from: "Filebeat", to: "Logstash" },
];
