# 📚 Academic & Research References — HealthMate AI

This document catalogs all scientific papers, institutional research, and corporate publications that form the evidence-based foundation of HealthMate AI's design philosophy and technical architecture.

---

## 🏛️ Pilar 1 — Empathetic Autonomy (Stanford University)

### [R1] Bloom: Designing for LLM-Augmented Behavior Change Interactions
| Field | Detail |
| :--- | :--- |
| **Authors** | Matthew Jörke, Sherry Ruan, Michelle Levesque, James Landay, Emma Brunskill |
| **Institution** | Stanford University (HCI Group + Prevention Research Center) |
| **Venue** | ACM CHI 2026 (**🏆 Best Paper Award**) |
| **Year** | 2026 |
| **Repository** | [StanfordHCI/Bloom](https://github.com/StanfordHCI/Bloom) |

**Key Findings:**
- In a 4-week randomized field study (N=54), an LLM-augmented coaching app (Beebo) significantly shifted user mindsets: increased **self-compassion**, **enjoyment of exercise**, and **self-efficacy** compared to the non-LLM control group.
- LLMs are especially effective at addressing qualitative barriers (e.g., life circumstances, emotional states) that metrics-only apps inherently miss.
- The system is grounded in **Motivational Interviewing (MI)** and the **Stanford Active Choices Program** (rooted in Transtheoretical Model & Social Cognitive Theory).
- A safety red-teaming dataset of **600 examples** was created as part of the evaluation.

**HealthMate AI Connection:**
> Directly inspires our "Stanford MI Tone" behavioral guidelines. Medi (our mascot) avoids commanding language, instead asking open-ended questions (e.g., *"Apa yang bisa kita coba hari ini?"*) to support user self-efficacy.

---

### [R2] Transtheoretical Model (TTM) & Digital Health Apps — Systematic Review
| Field | Detail |
| :--- | :--- |
| **Venue** | JMIR mHealth / Frontiers in Public Health / MDPI — Multiple systematic reviews |
| **Year Range** | 2023–2024 |

**Key Findings:**
- TTM-based digital interventions demonstrate **significant short-term improvements** in physical activity, diet adherence, and medication compliance.
- Personalization of feedback based on the user's **stage of change** (Precontemplation → Contemplation → Preparation → Action → Maintenance) is the strongest predictor of engagement.
- UX design quality is cited as a critical factor; poor UI/UX directly causes disengagement before behavior change can occur.
- The most effective apps combine TTM with wearable data integration and adaptive personalization.

**HealthMate AI Connection:**
> Justifies our adaptive question logic in geminiAi.ts — prompts are calibrated to the user's current engagement level and the context of their logged metrics.

---

## 🌐 Pilar 2 — Contextual Telemetry (Google Health)

### [R3] A Personal Health Large Language Model for Sleep and Fitness Coaching
| Field | Detail |
| :--- | :--- |
| **Authors** | Google Health Research Team |
| **Institution** | Google DeepMind / Google Health |
| **Venue** | *Nature Medicine* |
| **Year** | August 2025 |
| **DOI** | [10.1038/s41591-025-03888-0](https://doi.org/10.1038/s41591-025-03888-0) |

**Key Findings:**
- **PH-LLM** (Personal Health LLM), a fine-tuned version of Gemini, was specifically optimized to reason over **longitudinal, numerical wearable sensor data** (sleep stages, step counts, heart rate).
- Achieved **79% accuracy** in sleep medicine examinations (vs. 76% for human experts) and **88% accuracy** in fitness examinations (vs. 71% for human experts).
- Evaluated on **857 real-world case studies** — performance matched human fitness coaches and significantly outperformed the base Gemini model on personalized sleep insights.
- Demonstrated the ability to **predict self-reported sleep quality** using multimodal wearable data encoding.

**HealthMate AI Connection:**
> Validates our architecture of binding LocalStorage health logs (sleep, steps, calories) into the LLM prompt context in Chat.tsx. The telemetry binding is our "PH-LLM" equivalent — providing the model with the same personalized data context.

---

## 🤖 Pilar 3 — Proactive Digital Companionship (MIT Media Lab)

### [R4] Just-in-Time Adaptive Interventions (JITAIs) for Digital Health
| Field | Detail |
| :--- | :--- |
| **Institution** | MIT Media Lab — Affective Computing Group & Fluid Interfaces Group |
| **Related Projects** | EMMA (Emotion-Aware mHealth Agent), ELSA (Empathy Learning Socially-Aware), Mind Companion |
| **Venue** | Multiple: JMIR, ACM CHI, arXiv |

**Key Findings:**
- **JITAIs** (Just-in-Time Adaptive Interventions) deliver behavioral nudges at the exact moment a user is most receptive, using physio-data and contextual signals from wearables.
- AI companions using a "companion-like" style with supportive language — rather than directive instructions — achieve better **sustained engagement** and **user wellbeing** outcomes.
- Collaborative research with OpenAI confirmed that users who over-rely on chatbots show signs of decreased social wellbeing; the ideal design supplements, not replaces, human connection.
- Real-time emotional context (wearable biosignals, app usage patterns) enables the agent to avoid sending a "nudge" when the user is busy or stressed.

**HealthMate AI Connection:**
> Inspires the dynamic mascot state system in HealthCompanion.tsx. Medi reacts to logged metrics (e.g., low water intake, missed sleep goal) — these reactions are our implementation of "just-in-time" nudges without requiring wearable integration.

### [R5] Mind Companion: LLM-Based Embodied Conversational Agents
| Field | Detail |
| :--- | :--- |
| **Institution** | MIT Media Lab |
| **Venue** | arXiv preprint |

**Key Findings:**
- Embodied agents that integrate **psychological analysis** and **process-based therapy principles** into their dialogue provide measurable improvements in user emotional regulation.
- Real-time emotional and therapeutic monitoring using LLMs is feasible at the consumer app level.

---

## 🏥 Pilar 4 — Absolute Clinical Safety (Harvard Medical School)

### [R6] CRAFT-MD: Conversational Reasoning Assessment Framework for Testing in Medicine
| Field | Detail |
| :--- | :--- |
| **Authors** | Harvard Medical School & Stanford University Research Team |
| **Venue** | *Nature Medicine* |
| **Year** | January 2025 |
| **Source** | [hms.harvard.edu](https://hms.harvard.edu) |

**Key Findings:**
- LLMs that score well on static multiple-choice medical exams show **significant performance degradation** when engaged in realistic, multi-turn conversational clinical settings.
- This "benchmark gap" demonstrates that LLMs are **not ready for unsupervised medical diagnosis** and require strict safety layers, fallbacks, and human oversight.
- Rigorous realistic conversation evaluation (not just MCQ tests) is essential before deploying any AI in a health context.

**HealthMate AI Connection:**
> Directly informs our **client-side clinical safety filters**. Emergency keywords (chest pain, shortness of breath, etc.) are detected and triaged at the browser level — *before* the LLM prompt is even sent — preventing any chance of a dangerous hallucination reaching the user.

### [R7] AI in Emergency Triage — Capability & Accountability Gap
| Field | Detail |
| :--- | :--- |
| **Institution** | Harvard Medical School / Beth Israel Deaconess Medical Center |
| **Venue** | *Science* |
| **Year** | April 2026 |

**Key Findings:**
- OpenAI's o1 model outperformed emergency physicians in specific high-pressure triage tasks.
- Researchers unanimously emphasize that AI tools **must not replace human clinicians** — they require rigorous prospective clinical trials for safety, accountability, and reliability.

**HealthMate AI Connection:**
> Reinforces our non-diagnostic stance. HealthMate AI explicitly positions itself as a **coaching companion**, not a diagnostic tool, and always redirects users to emergency services for acute symptoms.

---

## 📱 Referensi Pendukung — mHealth & LLM Engagement

### [R8] LLM Conversational AI in mHealth: Engagement & Retention Analysis
| Field | Detail |
| :--- | :--- |
| **Venue** | JMIR mHealth / NIH / MDPI — Multiple systematic reviews |
| **Year Range** | 2024–2025 |

**Key Findings:**
- Personalization is the strongest predictor of long-term retention over generic health programs.
- **Voice + text multimodal** interaction is preferred by users and correlates with more sustainable usage patterns.
- The "first-week drop-off" is a universal challenge — engagement peaks in the first 7 days then drops sharply if the app fails to demonstrate value quickly.
- Apps that combine empathetic rapport-building ("small talk") with clinical task support achieve the highest sustained engagement.
- Privacy concerns are a significant adoption barrier — users must feel control over their health data.

**HealthMate AI Connection:**
> Motivates our bilingual support, mascot personality (rapport-building), and local-first data model (all data stays in the browser's LocalStorage, zero external transmission without user consent).

---

## 📖 Referensi Tambahan (Pendukung)

| Ref | Title | Venue | Year | Relevance |
| :--- | :--- | :--- | :--- | :--- |
| R9 | *"Self-Efficacy: The Exercise of Control"* — Bandura | W.H. Freeman | 1997 | Foundation of Social Cognitive Theory used in MI/TTM framework |
| R10 | *"Motivational Interviewing: Helping People Change"* — Miller & Rollnick | Guilford Press | 2013 (3rd ed.) | Foundational text for the MI coaching tone in all LLM prompts |
| R11 | *"The Transtheoretical Model and Stages of Change"* — Prochaska & DiClemente | Health Behavior & Health Ed. | 1983 | Original theoretical framework for behavior change stages |
| R12 | *"Patient engagement with health apps"* — Bert et al. | JMIR mHealth | 2020 | Baseline on user retention challenges in health apps |
| R13 | *"Conversational AI for mental health"* — WHO Digital Health | WHO | 2023 | Global policy context for responsible AI in health |

---

## 🔗 Repositori & Sumber Daya Kode Terbuka

| Sumber | Deskripsi | URL |
| :--- | :--- | :--- |
| **StanfordHCI/Bloom** | Source code & dataset untuk riset Bloom (ACM CHI 2026) | [github.com/StanfordHCI/Bloom](https://github.com/StanfordHCI/Bloom) |
| **Google PH-LLM** | Informasi riset Google Health PH-LLM | [research.google](https://research.google) |
| **MIT Media Lab** | Affective Computing & Fluid Interfaces Group | [media.mit.edu](https://www.media.mit.edu) |
| **Harvard CRAFT-MD** | Informasi framework evaluasi AI klinis | [hms.harvard.edu](https://hms.harvard.edu) |

---

## 📝 Cara Mengutip (Draft APA)

> **HealthMate AI** (2026). *An Empathetic, Context-Aware Digital Health Companion*. Grounded in: Jörke et al. (ACM CHI 2026), Google PH-LLM (Nature Medicine, 2025), MIT Media Lab JITAIs, and Harvard CRAFT-MD Framework (Nature Medicine, 2025).

---

*Dokumen ini diperbarui terakhir: Juli 2026. Untuk visi produk lebih lanjut, lihat BigPlanAndWisdom.md.*
