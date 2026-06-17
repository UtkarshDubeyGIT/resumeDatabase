import { getServerSession } from "@/lib/auth"
import { generateStructuredData } from "@/lib/ai"
import { z } from "zod"
import { NextRequest } from "next/server"

const requestSchema = z.object({
  section: z.enum(["experience", "projects", "skills", "summary", "project", "experience_entry"]),
  rawInput: z.string().min(1),
  context: z.record(z.string(), z.any()).optional(),
})

const bulletsSchema = z.object({
  bullets: z.array(z.string()),
})

const skillsSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
})

const summarySchema = z.object({
  summary: z.string(),
})

const projectSchema = z.object({
  title: z.string(),
  url: z.string().nullable(),
  techStack: z.array(z.string()),
  bulletPoints: z.array(z.string()),
})

const experienceEntrySchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  bulletPoints: z.array(z.string()),
})

const prompts: Record<string, string> = {
  experience: `You are a resume writing expert. Given raw notes about a person's work experience, generate 3-5 polished, achievement-oriented bullet points.

Rules:
- Start each bullet with a strong action verb.
- Include measurable impact where possible.
- Be concise and professional.
- DO NOT make up specific numbers unless provided in the input.
- Output ONLY valid JSON: { "bullets": string[] }`,

  projects: `You are a resume writing expert. Given raw notes about a person's project, generate 2-4 polished bullet points.

Rules:
- Start each bullet with a strong action verb.
- Highlight technical skills, impact, and outcomes.
- Be concise and professional.
- DO NOT make up specific numbers unless provided in the input.
- Output ONLY valid JSON: { "bullets": string[] }`,

  skills: `You are a resume categorization expert. Given raw notes about a person's skills, organize them into categories: languages, frameworks, and tools.

Rules:
- Categorize each skill appropriately.
- Remove duplicates and generic terms.
- Be precise with technology names.
- Output ONLY valid JSON: { "languages": string[], "frameworks": string[], "tools": string[] }`,

  experience_entry: `You are an expert technical resume writer. Analyze the user's raw explanation of their work experience and output structured resume data.

Rules:
- Company and role must be professional and accurate.
- Dates can be inferred from context (e.g. "last summer" -> "June 2025").
- BulletPoints: 3-5 achievement-oriented bullet points. Start each with a strong action verb. Use STAR method.
- Output ONLY valid JSON: { "company": string, "role": string, "startDate": string | null, "endDate": string | null, "bulletPoints": string[] }`,

  project: `You are an expert technical resume writer. Analyze the input (a GitHub link or raw project explanation) and output structured project data.

Rules:
- Title must be concise and professional (not a raw repo name).
- URL is the GitHub/project URL if provided; otherwise null.
- TechStack: 5-7 core technologies max.
- BulletPoints: 3-5 professional resume bullet points. Start each with a strong action verb. Use STAR method where possible.
- Output ONLY valid JSON: { "title": string, "url": string | null, "techStack": string[], "bulletPoints": string[] }`,

  summary: `You are a resume writing expert. Given raw notes about a person's background, generate a 2-3 sentence professional summary.

Rules:
- Write in first person (implied, no "I").
- Highlight key skills, experience, and career trajectory.
- Be concise and impactful.
- Output ONLY valid JSON: { "summary": string }`,
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request.headers)
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = requestSchema.safeParse(body)
    if (!validation.success) {
      return Response.json(
        { error: "Invalid request", details: validation.error.flatten() },
        { status: 422 }
      )
    }

    const { section, rawInput, context } = validation.data
    const prompt = prompts[section]
    const systemPrompt = `${prompt}\n\nAdditional context: ${JSON.stringify(context ?? {})}`
    const userContent = `Raw input: "${rawInput}"`

    if (section === "skills") {
      const result = await generateStructuredData(systemPrompt, userContent, skillsSchema)
      return Response.json(result)
    }

    if (section === "summary") {
      const result = await generateStructuredData(systemPrompt, userContent, summarySchema)
      return Response.json(result)
    }

    if (section === "project") {
      const result = await generateStructuredData(systemPrompt, userContent, projectSchema)
      return Response.json(result)
    }

    if (section === "experience_entry") {
      const result = await generateStructuredData(systemPrompt, userContent, experienceEntrySchema)
      return Response.json(result)
    }

    const result = await generateStructuredData(systemPrompt, userContent, bulletsSchema)
    return Response.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error"
    console.error("AI generate-bullets error:", e)
    return Response.json({ error: message }, { status: 500 })
  }
}
