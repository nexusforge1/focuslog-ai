# FocusLog AI 🧠✨

FocusLog AI is a personal learning and thinking system built with Next.js App Router and Tailwind CSS. It helps you turn messy freewritten thoughts into structured understanding, articulate your friction points, and identify your next concrete steps using AI.

---

## Features

* **Calm Focus Dashboard:** Track active learning paths (AI, System Design, Full Stack, Domain, English) and view recent learning reflections.
* **AI-Powered Session Synthesis:** Freewrite your raw thoughts and let Gemini structure them into core learnings, understanding levels, friction points, articulation drills, and next steps.
* **Bring-Your-Own-Key (BYOK) Security:** Securely store your personal Gemini API key locally in your browser's `localStorage`. No database or user accounts required!
* **Session Archive & Filtering:** Search, filter, and review past learning sessions with full deep-linking support.

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI Integration:** Google Gen AI SDK (`@google/generative-ai`) with structured JSON schema outputs

---

## Configuration (BYOK)

FocusLog AI operates entirely client-side without storing user data on a backend server:
1. Click the **API Key** button in the top navigation bar.
2. Enter your personal Gemini API Key generated from [Google AI Studio](https://aistudio.google.com/).
3. The key is stored safely in your browser's local storage and used exclusively for your AI synthesis requests.