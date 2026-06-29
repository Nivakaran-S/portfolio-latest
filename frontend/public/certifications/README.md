# Certificate images

Drop the 13 Udemy certificate images here, named exactly as below (the
filenames are referenced from `lib/data/certifications.ts` → `image`).
Until a file exists, its card degrades to a labelled placeholder, so the
page works with any subset present.

Recommended: landscape JPG, ~1600px wide, < 300 KB each.

| Filename | Certificate |
|---|---|
| `agentic-ai.jpg` | Complete Agentic AI Bootcamp with LangGraph and LangChain |
| `generative-ai.jpg` | Complete Generative AI Course with LangChain and HuggingFace |
| `data-science.jpg` | Complete Data Science, Machine Learning, DL, NLP Bootcamp |
| `computer-vision.jpg` | Complete Computer Vision Bootcamp with PyTorch & TensorFlow |
| `machine-learning.jpg` | Complete AI & Machine Learning, Data Science Bootcamp |
| `tensorflow.jpg` | TensorFlow for Deep Learning Bootcamp |
| `big-data-engineering.jpg` | Big Data Engineering Bootcamp with GCP and Azure Cloud |
| `dsa.jpg` | The Complete Data Structures and Algorithms Course in Python |
| `nodejs.jpg` | Complete NodeJS Developer (GraphQL, MongoDB & more) |
| `web-development.jpg` | The Complete Web Developer in 2023: Zero to Mastery |
| `react-native.jpg` | React Native — The Practical Guide [2024] |
| `ethical-hacking.jpg` | Learn Python & Ethical Hacking from Scratch |
| `ui-ux-design.jpg` | Complete Web & Mobile Designer in 2023: UI/UX with Figma |

Source the originals from the old portfolio repo's assets, or re-download
the high-res image from each course's Udemy certificate page
(`udemy.com/certificate/UC-<id>/`). Add the `UC-<id>` URL to the matching
entry's `credentialUrl` in `certifications.ts` to enable the "Verify" link.
