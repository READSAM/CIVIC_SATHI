import { NextResponse } from "next/server";

const PYTHON_API_URL = "https://civicsathi-ai.onrender.com"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    console.log(`[PROXY] Forwarding description to Python...`);

    const pythonResponse = await fetch(`${PYTHON_API_URL}/analyze-issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }), 
    });

    if (!pythonResponse.ok) {
      console.error(`[PROXY] Python Backend Error: ${pythonResponse.status}`);
      return NextResponse.json({ error: "Failed to generate tags from backend." }, { status: 500 });
    }

    const data = await pythonResponse.json();
    const finalTags = data.tag;
    const conf=data.confidence;
    console.log(data.department);
    return NextResponse.json({ generated_tags: finalTags });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
