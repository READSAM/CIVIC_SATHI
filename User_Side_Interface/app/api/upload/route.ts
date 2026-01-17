// // app/api/upload/route.ts

// import { put } from '@vercel/blob';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request): Promise<NextResponse> {
//     try {
//         const formData = await request.formData();
//         const file = formData.get('file');

//         if (!file || typeof file === 'string') {
//             return NextResponse.json({ error: 'No file provided or file is not a Blob.' }, { status: 400 });
//         }

//         const filename = (file as File).name;

//         // Use the put function to upload the file
//         const blob = await put(filename, file, {
//             access: 'public',
//             // --- ADD THIS LINE ---
//             addRandomSuffix: true,
//             // ---------------------
//         });
        
//         return NextResponse.json(blob);

//     } catch (error) {
//         console.error('Error handling file upload:', error);
//         return NextResponse.json(
//             { error: (error as Error).message },
//             { status: 500 },
//         );
//     }
// }

// app/api/upload/route.ts
// import { put } from '@vercel/blob';
// import { NextResponse } from 'next/server';
// import sharp from 'sharp';
// import path from 'path';
// import { promises as fs } from 'fs';

// export async function POST(request: Request): Promise<NextResponse> {
//     try {
//         const formData = await request.formData();
//         const file = formData.get('file');
//         const location = formData.get('location') as string || "Unknown Location";

//         if (!file || typeof file === 'string') {
//             return NextResponse.json({ error: 'No file provided' }, { status: 400 });
//         }

//         const fileObj = file as File;
//         const filename = fileObj.name;
        
//         console.log(`[UPLOAD] Processing: ${filename}`);

//         // 1. Read the Image File
//         const arrayBuffer = await fileObj.arrayBuffer();
//         const inputBuffer = Buffer.from(arrayBuffer);

//         // 2. Read the Font File (Roboto-Regular.ttf)
//         const fontPath = path.join(process.cwd(), 'public', 'Roboto-Regular.ttf');
//         let fontBase64 = '';
//         try {
//             const fontBuffer = await fs.readFile(fontPath);
//             fontBase64 = fontBuffer.toString('base64');
//         } catch (fontErr) {
//             console.error("Could not load font file:", fontErr);
//         }

//         // 3. Get Image Metadata
//         const metadata = await sharp(inputBuffer).metadata();
//         const width = metadata.width || 800;
//         const resizeWidth = width > 1000 ? 1000 : width;

//         // 4. Generate Timestamp (Date & Time)
//         const timestamp = new Date().toLocaleString('en-IN', { 
//             timeZone: 'Asia/Kolkata',
//             dateStyle: 'medium', // e.g., Jan 17, 2026
//             timeStyle: 'short'   // e.g., 2:30 PM
//         });

//         // 5. Create SVG with TWO LINES of Text
//         // Line 1: GPS Coordinates
//         // Line 2: Date and Time
//         const line1 = `GPS: ${location}`;
//         const line2 = `DATE: ${timestamp}`;
        
//         const svgOverlay = `
//         <svg width="${resizeWidth}" height="60">
//             <defs>
//                 <style>
//                     @font-face {
//                         font-family: 'MyCustomFont';
//                         src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
//                     }
//                     .bg { fill: rgba(0, 0, 0, 0.7); }
//                     .text { 
//                         fill: #fff; 
//                         font-family: 'MyCustomFont', sans-serif; 
//                         font-weight: bold; 
//                     }
//                     .gps { font-size: 19px; }
//                     .date { font-size: 14px; fill: #ddd; }
//                 </style>
//             </defs>
//             <rect x="0" y="0" width="${resizeWidth}" height="60" class="bg" />
            
//             <text x="15" y="28" class="text gps">${line1}</text>
            
//             <text x="15" y="50" class="text date">${line2}</text>
//         </svg>
//         `;

//         // 6. Process Image
//         const processedImageBuffer = await sharp(inputBuffer)
//             .resize({ width: resizeWidth })
//             .composite([
//                 { input: Buffer.from(svgOverlay), gravity: 'south' },
//             ])
//             .jpeg({ quality: 80 })
//             .toBuffer();

//         // 7. Upload to Vercel Blob
//         const blob = await put(filename, processedImageBuffer, {
//             access: 'public',
//             addRandomSuffix: true,
//             contentType: 'image/jpeg', 
//         });
        
//         return NextResponse.json(blob);

//     } catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//     }
// }

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const location = formData.get('location') as string || "Unknown Location";

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileObj = file as File;
        const filename = fileObj.name;
        
        console.log(`[UPLOAD] Processing: ${filename}`);

        const arrayBuffer = await fileObj.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // --- 🔍 ROBUST FONT LOADING START ---
        let fontBase64 = '';
        let fontStyleCSS = '';
        
        // We will try looking in two places:
        // 1. public/fonts/ (Best practice)
        // 2. public/ (Where you might have put it)
        const possiblePaths = [
            path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'),
            path.join(process.cwd(), 'public', 'Roboto-Regular.ttf'),
        ];

        let fontLoaded = false;

        for (const fontPath of possiblePaths) {
            try {
                console.log(`[FONT] Checking path: ${fontPath}`);
                const fontBuffer = await fs.readFile(fontPath);
                fontBase64 = fontBuffer.toString('base64');
                fontLoaded = true;
                console.log(`[FONT] ✅ Found font at: ${fontPath}`);
                break; // Stop looking, we found it!
            } catch (err) {
                console.log(`[FONT] ❌ Not found at: ${fontPath}`);
            }
        }

        if (fontLoaded) {
            fontStyleCSS = `
                @font-face {
                    font-family: 'MyCustomFont';
                    src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
                }
                .text { font-family: 'MyCustomFont', sans-serif; }
            `;
        } else {
            // 🛑 CRITICAL FAILURE: No font found.
            console.error("[FONT] 💥 FATAL: Could not find Roboto-Regular.ttf in any expected folder.");
            // We throw an error here so you see it in the logs immediately, 
            // instead of generating a broken image.
            throw new Error("Font file missing. Please ensure 'Roboto-Regular.ttf' is in 'public/fonts/'");
        }
        // --- 🔍 ROBUST FONT LOADING END ---


        // 3. Metadata & Resize
        const metadata = await sharp(inputBuffer).metadata();
        const width = metadata.width || 800;
        const resizeWidth = width > 1000 ? 1000 : width;

        // 4. Timestamp
        const timestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const line1 = `GPS: ${location}`;
        const line2 = `DATE: ${timestamp}`;
        
        // 5. SVG Overlay
        const svgOverlay = `
        <svg width="${resizeWidth}" height="80">
            <defs>
                <style>
                    ${fontStyleCSS}
                    .bg { fill: rgba(0, 0, 0, 0.6); }
                    .text { fill: #fff; font-weight: bold; }
                    .gps { font-size: 24px; }
                    .date { font-size: 16px; fill: #ddd; }
                </style>
            </defs>
            <rect x="0" y="0" width="${resizeWidth}" height="80" class="bg" />
            <text x="20" y="35" class="text gps">${line1}</text>
            <text x="20" y="65" class="text date">${line2}</text>
        </svg>
        `;

        // 6. Composite
        const processedImageBuffer = await sharp(inputBuffer)
            .resize({ width: resizeWidth })
            .composite([
                { input: Buffer.from(svgOverlay), gravity: 'south' },
            ])
            .jpeg({ quality: 80 })
            .toBuffer();

        // 7. Upload
        const blob = await put(filename, processedImageBuffer, {
            access: 'public',
            addRandomSuffix: true,
            contentType: 'image/jpeg', 
        });
        
        return NextResponse.json(blob);

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
