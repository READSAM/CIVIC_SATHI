
// import { NextResponse } from 'next/server';

// // 1. Your Exact Keyword Mapping
// const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
//   'Pollution Control Board': ['pollution', 'smoke', 'emission', 'factory', 'industrial waste', 'noise', 'contamination', 'air quality', 'water pollution'],
//   'Transport Department (RTO)': ['bus', 'auto', 'traffic signal', 'transport', 'vehicle', 'overcrowding', 'driving', 'license', 'traffic'],
//   'Animal Control & Veterinary Services': ['animal', 'dog', 'stray', 'cattle', 'monkey', 'bite', 'rabies', 'carcass', 'nuisance', 'sterilization'],
//   'Public Works Department (PWD)': ['road', 'pothole', 'pavement', 'drain', 'culvert', 'bridge', 'street', 'asphalt', 'sidewalk'],
//   'Water Supply & Sewerage Department': ['water', 'pipe', 'leak', 'sewage', 'sewer', 'drainage', 'manhole'],
//   'Health & Sanitation Department': ['garbage', 'waste', 'dump', 'cleanliness', 'hygiene', 'sweeping', 'mosquito', 'pest', 'litter', 'trash', 'filth'],
//   'Street Light Department': ['street light', 'streetlight', 'lamp', 'lighting', 'dark', 'pole'],
//   'Horticulture & Parks Department': ['tree', 'park', 'garden', 'plant', 'grass', 'fallen tree'],
//   'Town Planning Department': ['illegal construction', 'encroachment', 'zoning', 'unauthorized'],
//   'Electricity Department': ['power', 'electricity', 'transformer', 'wire', 'outage', 'electric', 'current']
// };

// export async function POST(req: Request) {
//   try {
//     // Receive the TAGS from the frontend
//     const { tags } = await req.json();

//     if (!tags || typeof tags !== 'string') {
//         console.log("[DEPT-ASSIGN] No tags provided, using default.");
//         return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
//     }

//     console.log(`[DEPT-ASSIGN] Analyzing tags: "${tags}"`);

//     // 2. The Logic (Replicated from your Python code)
//     const generatedTags = tags.split(',').map((tag: string) => tag.trim().toLowerCase());
    
//     let assignedDept = "General Grievance Cell / Public Relations Office";

//     // Iterate through your dictionary
//     // We use a labeled loop to break out immediately once a match is found
//     outerLoop:
//     for (const [department, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
//       for (const keyword of keywords) {
//         for (const tag of generatedTags) {
//           // "if keyword in tag"
//           if (tag.includes(keyword)) {
//             assignedDept = department;
//             break outerLoop; // Stop immediately after first match
//           }
//         }
//       }
//     }

//     console.log(`[DEPT-ASSIGN] Result: ${assignedDept}`);
    
//     return NextResponse.json({ department: assignedDept });

//   } catch (error) {
//     console.error('Error assigning department:', error);
//     return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
//   }
// }

import { NextResponse } from 'next/server';

// THE NEW BACKEND URL
const PYTHON_API_URL = "https://civicsathi-ai.onrender.com"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tags } = body;

    console.log(`[PROXY] Forwarding tags to Python: "${tags}"`);

    // Call the Python Backend
    const pythonResponse = await fetch(`${PYTHON_API_URL}/analyze-issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: tags }),
    });

    if (!pythonResponse.ok) {
      console.error(`[PROXY] Python Backend Error: ${pythonResponse.status}`);
      // Fallback in case of server error
      return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
    }

    const data = await pythonResponse.json();
    console.log(`[PROXY] Received from Python:`, data);
    
    return NextResponse.json(data.department);

  } catch (error) {
    console.error('[PROXY] Network Error:', error);
    return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
  }
}
