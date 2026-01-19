import { NextResponse } from 'next/server';

const PYTHON_API_URL ="https://civicsathi-ai.onrender.com"; 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tags } = body;

    console.log(`[PROXY] Forwarding tags to Python: "${tags}"`);
    const pythonResponse = await fetch(`${PYTHON_API_URL}/analyze-issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: tags }),
    });
    if (!pythonResponse.ok) {
      console.error(`[PROXY] Python Backend Error: ${pythonResponse.status}`);
      return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
    }
    const data = await pythonResponse.json();
    console.log(`[PROXY] Received from Python:`, data);
    
    return NextResponse.json({ 
        generated_tags: data.tag,
        suggested_department: data.department 
    });
  } catch (error) {
    console.error('[PROXY] Network Error:', error);
    return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
  }
}
