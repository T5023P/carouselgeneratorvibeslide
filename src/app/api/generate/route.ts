import { NextResponse } from "next/server";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";

// Initialize clients. They will throw an error if API keys are missing.
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System prompt helper based on category
function getSystemPrompt(category: string) {
  const basePrompt = `You are a world-class Subject Matter Expert (SME) and premium content creator specializing in the "${category}" niche. 
Your task is to transform raw research data into a highly engaging, high-end 7-slide carousel designed for LinkedIn and Instagram.
You MUST output a valid JSON object containing an array named "slides" with EXACTLY 7 objects.

JSON Schema per slide:
{
  "title": "String. A punchy, compelling headline for the slide (max 6 words).",
  "bodyText": "String. The main content of the slide (max 25 words). Keep it high-impact and concise.",
  "layoutType": "String. Must be one of: 'hero', 'split', 'bento-3-grid', 'quote', 'stat-focus'"
}`;

  const toneGuidelines: Record<string, string> = {
    "Tech/SaaS": "Tone: Analytical, forward-looking, precise. Focus on root causes, payloads, vectors, and actionable fixes. Use industry-standard terminology.",
    "Health/Wellness": "Tone: Empathetic, scientific, calming. Focus on breakthroughs, data-backed benefits, and human impact.",
    "Finance/Biz": "Tone: Authoritative, sharp, objective. Focus on market reactions, ROI, strategic implications, and what it means for the wallet.",
    "News/Viral": "Tone: Urgent, provocative, highly engaging. Focus on the core controversy or shocking fact to maximize attention.",
  };

  const selectedTone = toneGuidelines[category] || toneGuidelines["Tech/SaaS"];

  return `${basePrompt}\n\nCategory Guidelines:\n${selectedTone}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, category } = body;

    if (!topic || !category) {
      return NextResponse.json({ error: "Missing topic or category" }, { status: 400 });
    }

    console.log(`[API Generate] Starting generation for topic: "${topic}" in category: "${category}"`);

    // 1. Tavily Search for real-time context
    console.log(`[API Generate] Fetching context from Tavily...`);
    const searchResponse = await tvly.search(topic, {
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 5,
    });

    const researchContext = `
      Search Query: ${searchResponse.query}
      AI Summary: ${searchResponse.answer}
      Raw Context Snippets:
      ${searchResponse.results.map((r, i) => `[${i + 1}] ${r.title}: ${r.content}`).join("\n")}
    `;

    // 2. Groq extraction and generation
    console.log(`[API Generate] Passing context to Groq for JSON generation...`);
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getSystemPrompt(category),
        },
        {
          role: "user",
          content: `Create a 7-slide carousel based on this real-time research context:\n\n${researchContext}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Groq returned an empty response.");
    }

    // Parse the JSON to ensure it's valid before sending it back
    const parsedData = JSON.parse(responseContent);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("[API Generate] Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during generation." },
      { status: 500 }
    );
  }
}
