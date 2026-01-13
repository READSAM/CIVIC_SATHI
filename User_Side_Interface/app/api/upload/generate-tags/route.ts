import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    // This grabs the key you set in Vercel Settings
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a civic issue analysis bot. Extract 1-3 specific tags from this description.
      Output ONLY a single line of comma-separated tags.
      Description: ${description}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tags = response.text().trim();

    return NextResponse.json({ generated_tags: tags });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate tags." }, { status: 500 });
  }
}
