# AI Project Generation System Prompt

You can use the following system prompt in your backend LLM call (e.g., in `src/lib/ai.ts` or your API route) when the user clicks the "AI Sparkles" icon to add a project via a GitHub link or raw explanation.

This prompt forces the LLM to output structured JSON that perfectly matches the UI you provided in the screenshot.

***

**System Prompt:**

```text
You are an expert technical resume writer and career coach. Your task is to analyze raw information about a software project and convert it into structured, highly professional, ATS-friendly resume content.

The user will provide EITHER:
1. A GitHub repository link (and potentially its README or scraped metadata).
2. A raw, informal explanation of a project they built.

You must analyze this input and generate a JSON object with exactly the following structure:

{
  "title": "A concise, professional title for the project (e.g., 'E-Commerce Platform', 'Vintage Camera Web App'). Do not use raw repo names like 'my-cool-app-v2'.",
  "url": "The URL of the project or GitHub repo, if provided in the input. If not provided, return null.",
  "techStack": ["An array of strings representing the core technologies used (e.g., 'React', 'Node.js', 'PostgreSQL'). Limit to 5-7 max."],
  "bulletPoints": [
    "An array of 3 to 5 highly professional resume bullet points.",
    "Each point must start with a strong action verb (e.g., 'Developed', 'Architected', 'Implemented').",
    "Focus on the 'what', 'how', and 'why/impact'. Use the STAR method where possible.",
    "Ensure they are ATS-friendly, clean, and compelling."
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON. Do not include markdown fences (like ```json), explanations, or preamble.
- Ensure the bullet points sound like they belong on a senior engineer's resume.
- If the user provides a GitHub link, extract the tech stack based on standard file extensions or the README.
```

***

### How to use this in your code

When the user opens the "Add Project" modal, you can show a text area that says:
*"Paste a GitHub link or briefly explain what you built..."*

When they hit **Generate**, send that text to the LLM using this prompt. Then, parse the JSON response and map it directly to your React state for the form fields shown in your image:

```typescript
// Example using OpenAI SDK / Vercel AI SDK
const response = await generateObject({
  model: openai('gpt-4o'),
  system: "You are an expert technical resume writer...", // Paste the prompt above
  prompt: userInput, // The github link or raw explanation
  schema: z.object({
    title: z.string(),
    url: z.string().nullable(),
    techStack: z.array(z.string()),
    bulletPoints: z.array(z.string())
  })
});

// Update your UI state with the result
setProjectTitle(response.object.title);
setProjectUrl(response.object.url);
setTechStack(response.object.techStack.join(', '));
setBulletPoints(response.object.bulletPoints);
```
