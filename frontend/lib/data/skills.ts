export type SkillCategory =
  | "Software Engineering"
  | "Data Science"
  | "Computer Vision"
  | "Data Engineering"
  | "Data Analysis";

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Relative emphasis 1–3 — drives slight weight in the chip list. */
  weight: 1 | 2 | 3;
}

export interface SkillEdge {
  from: string;
  to: string;
}

export const skillCategories: { id: SkillCategory; color: string }[] = [
  { id: "Software Engineering", color: "var(--color-neon-cyan)" },
  { id: "Data Science", color: "var(--color-neon-cyan-core)" },
  { id: "Computer Vision", color: "var(--color-neon-violet)" },
  { id: "Data Engineering", color: "var(--color-fg-dim)" },
  { id: "Data Analysis", color: "var(--color-neon-lime)" },
];

export const skills: Skill[] = [
  // Software Engineering
  { name: "TypeScript", category: "Software Engineering", weight: 3 },
  { name: "Next.js", category: "Software Engineering", weight: 3 },
  { name: "Node.js", category: "Software Engineering", weight: 2 },
  { name: "React Native", category: "Software Engineering", weight: 2 },
  { name: "FastAPI", category: "Software Engineering", weight: 2 },
  { name: "Flask", category: "Software Engineering", weight: 1 },
  { name: "Java", category: "Software Engineering", weight: 1 },
  { name: "Kotlin", category: "Software Engineering", weight: 1 },
  { name: "Docker", category: "Software Engineering", weight: 2 },
  { name: "Cloud (AWS/GCP/Azure)", category: "Software Engineering", weight: 2 },

  // Data Science
  { name: "Python", category: "Data Science", weight: 3 },
  { name: "PyTorch", category: "Data Science", weight: 3 },
  { name: "TensorFlow", category: "Data Science", weight: 2 },
  { name: "LangChain", category: "Data Science", weight: 2 },
  { name: "LangGraph", category: "Data Science", weight: 2 },
  { name: "Hugging Face", category: "Data Science", weight: 2 },
  { name: "MLflow", category: "Data Science", weight: 1 },

  // Computer Vision
  { name: "OpenCV", category: "Computer Vision", weight: 2 },
  { name: "CNNs", category: "Computer Vision", weight: 2 },
  { name: "Gradio", category: "Computer Vision", weight: 1 },

  // Data Engineering
  { name: "PostgreSQL", category: "Data Engineering", weight: 2 },
  { name: "MongoDB", category: "Data Engineering", weight: 2 },
  { name: "Spark", category: "Data Engineering", weight: 2 },
  { name: "Kafka", category: "Data Engineering", weight: 1 },
  { name: "Airflow", category: "Data Engineering", weight: 1 },
  { name: "Databricks", category: "Data Engineering", weight: 1 },

  // Data Analysis
  { name: "Pandas", category: "Data Analysis", weight: 2 },
  { name: "NumPy", category: "Data Analysis", weight: 2 },
  { name: "Matplotlib", category: "Data Analysis", weight: 1 },
];

/** Conceptual relationships across the stack — decorative metadata. */
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
  { from: "TensorFlow", to: "MLflow" },
  { from: "LangChain", to: "LangGraph" },
  { from: "LangChain", to: "Hugging Face" },
  { from: "TypeScript", to: "Next.js" },
  { from: "TypeScript", to: "React Native" },
  { from: "Next.js", to: "Node.js" },
  { from: "Node.js", to: "MongoDB" },
  { from: "Next.js", to: "PostgreSQL" },
  { from: "Pandas", to: "Matplotlib" },
  { from: "Pandas", to: "Spark" },
  { from: "Spark", to: "Kafka" },
  { from: "Spark", to: "Databricks" },
  { from: "Airflow", to: "MLflow" },
  { from: "Docker", to: "Cloud (AWS/GCP/Azure)" },
  { from: "FastAPI", to: "Docker" },
];
