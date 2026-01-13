// import { NextResponse } from "next/server";

// const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
//   'Pollution Control Board': ['pollution', 'smoke', 'emission', 'factory', 'industrial', 'air quality'],
//   'Transport Department (RTO)': ['bus', 'auto', 'traffic', 'transport', 'vehicle', 'driving'],
//   'Animal Control': ['animal', 'dog', 'stray', 'cow', 'monkey', 'bite'],
//   'Public Works Department (PWD)': ['road', 'pothole', 'pavement', 'bridge', 'street'],
//   'Water Supply': ['water', 'pipe', 'leak', 'sewage', 'drainage'],
//   'Health & Sanitation': ['garbage', 'waste', 'cleanliness', 'hygiene', 'trash'],
//   'Street Light Dept': ['street light', 'lamp', 'dark', 'lighting'],
//   'Parks Dept': ['tree', 'park', 'garden', 'grass'],
//   'Electricity Dept': ['power', 'electricity', 'wire', 'pole', 'current']
// };

// export async function POST(request: Request) {
//   try {
//     const { tags } = await request.json();
//     if (!tags) return NextResponse.json({ error: "Tags required" }, { status: 400 });

//     const generatedTags = tags.split(',').map((t: string) => t.trim().toLowerCase());
//     let assignedDepartment = "General Grievance Cell";

//     // Logic to match tags to departments
//     outerLoop:
//     for (const [dept, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
//       for (const keyword of keywords) {
//         for (const tag of generatedTags) {
//           if (tag.includes(keyword)) {
//             assignedDepartment = dept;
//             break outerLoop;
//           }
//         }
//       }
//     }

//     return NextResponse.json({ assigned_department: assignedDepartment });
//   } catch (error) {
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';

// 1. Your Exact Keyword Mapping
const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  'Pollution Control Board': ['pollution', 'smoke', 'emission', 'factory', 'industrial waste', 'noise', 'contamination', 'air quality', 'water pollution'],
  'Transport Department (RTO)': ['bus', 'auto', 'traffic signal', 'transport', 'vehicle', 'overcrowding', 'driving', 'license', 'traffic'],
  'Animal Control & Veterinary Services': ['animal', 'dog', 'stray', 'cattle', 'monkey', 'bite', 'rabies', 'carcass', 'nuisance', 'sterilization'],
  'Public Works Department (PWD)': ['road', 'pothole', 'pavement', 'drain', 'culvert', 'bridge', 'street', 'asphalt', 'sidewalk'],
  'Water Supply & Sewerage Department': ['water', 'pipe', 'leak', 'sewage', 'sewer', 'drainage', 'manhole'],
  'Health & Sanitation Department': ['garbage', 'waste', 'dump', 'cleanliness', 'hygiene', 'sweeping', 'mosquito', 'pest', 'litter', 'trash', 'filth'],
  'Street Light Department': ['street light', 'streetlight', 'lamp', 'lighting', 'dark', 'pole'],
  'Horticulture & Parks Department': ['tree', 'park', 'garden', 'plant', 'grass', 'fallen tree'],
  'Town Planning Department': ['illegal construction', 'encroachment', 'zoning', 'unauthorized'],
  'Electricity Department': ['power', 'electricity', 'transformer', 'wire', 'outage', 'electric', 'current']
};

export async function POST(req: Request) {
  try {
    // Receive the TAGS from the frontend
    const { tags } = await req.json();

    if (!tags || typeof tags !== 'string') {
        console.log("[DEPT-ASSIGN] No tags provided, using default.");
        return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
    }

    console.log(`[DEPT-ASSIGN] Analyzing tags: "${tags}"`);

    // 2. The Logic (Replicated from your Python code)
    const generatedTags = tags.split(',').map((tag: string) => tag.trim().toLowerCase());
    
    let assignedDept = "General Grievance Cell / Public Relations Office";

    // Iterate through your dictionary
    // We use a labeled loop to break out immediately once a match is found
    outerLoop:
    for (const [department, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
      for (const keyword of keywords) {
        for (const tag of generatedTags) {
          // "if keyword in tag"
          if (tag.includes(keyword)) {
            assignedDept = department;
            break outerLoop; // Stop immediately after first match
          }
        }
      }
    }

    console.log(`[DEPT-ASSIGN] Result: ${assignedDept}`);
    
    return NextResponse.json({ department: assignedDept });

  } catch (error) {
    console.error('Error assigning department:', error);
    return NextResponse.json({ department: "General Grievance Cell / Public Relations Office" });
  }
}
