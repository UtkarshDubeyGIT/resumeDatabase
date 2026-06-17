# OpenCode Implementation Prompt

You can copy the text below and paste it directly into OpenCode (or any other agent) to instruct it to implement all of the architecture and UI changes we have planned.

***

**Copy from here down:**

> You are tasked with implementing a massive architectural and UI overhaul for a Next.js web application called "Resumint". 
> 
> **Context:**
> The platform allows users to build structured profiles and generate tailored resumes based on Job Descriptions. We have already completed the planning phase and documented the required UI design system and the core data-saving philosophy. 
> 
> **Reference Documents:**
> Before writing a single line of code, you MUST locate, read, and deeply understand the following two documents in the workspace:
> 1. `ui_design.md` (Contains the new Tailwind v4 color palette, typography, and component specifications).
> 2. `data_saving_planning.md` (Contains the 3-Phase project overview, the "Universal AI-Assisted Data Standardization" rule, and the reusable content creation workflow).
> 
> **Your Instructions:**
> Please execute the implementation of these two documents with the **highest possible accuracy**. Take your time. Do not rush to build everything at once. 
> 
> I want you to follow this exact step-by-step process. Wait for my approval after completing each step before moving on to the next:
> 
> **Step 1: The Foundation**
> Read `ui_design.md`. Update `globals.css` with the new Tailwind v4 CSS variables. Configure the Satoshi and Inter fonts. Build/update the core base UI components (`Button`, `Input`, `Badge`, `Card`) exactly as specified in the design doc. Generate/update any internal developer documentation regarding these components. Wait for my approval.
> 
> **Step 2: The Universal AI Component**
> Read `data_saving_planning.md`. Build the unified, reusable "AI-Assisted Content Creation" component. This component must accept raw user input (or a GitHub link), pass it to the AI for structuring into ATS-friendly bullet points, display checkboxes for the user to select their preferred points, and then save ONLY the selected points to the Prisma database. Wait for my approval.
> 
> **Step 3: Phase 1 Onboarding Overhaul**
> Refactor `src/app/onboarding/page.tsx` into a multi-step wizard. Incorporate the universal AI component from Step 2 so users can add experiences, skills, and GitHub repos part-by-part. Ensure users can skip steps.
> 
> **Step 4: Phase 2 Profile Dashboard**
> Build the main Profile Viewing & Management section. Use the exact same reusable AI component so users can add/edit their profile seamlessly.
> 
> **Rules for Execution:**
> - Take your time and think step-by-step. 
> - If you face ambiguity, stop and ask me.
> - Maintain the existing Prisma schema structure, but ensure the new flows map correctly to it.
> - Ensure all new UI strictly adheres to the glassmorphism, vibrant colors, and layouts specified in `ui_design.md`. 
> - Continuously update our internal documentation as you build new features.
> 
> Please acknowledge that you have read this prompt and confirm you have found the two reference documents. Then, outline your exact plan for Step 1.
