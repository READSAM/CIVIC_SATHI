
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

//         const arrayBuffer = await fileObj.arrayBuffer();
//         const inputBuffer = Buffer.from(arrayBuffer);

//         // --- 🔍 ROBUST FONT LOADING START ---
//         let fontBase64 = '';
//         let fontStyleCSS = '';
        
//         // We will try looking in two places:
//         // 1. public/fonts/ (Best practice)
//         // 2. public/ (Where you might have put it)
//         const possiblePaths = [
//             path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'),
//             path.join(process.cwd(), 'public', 'Roboto-Regular.ttf'),
//         ];

//         let fontLoaded = false;

//         for (const fontPath of possiblePaths) {
//             try {
//                 console.log(`[FONT] Checking path: ${fontPath}`);
//                 const fontBuffer = await fs.readFile(fontPath);
//                 fontBase64 = fontBuffer.toString('base64');
//                 fontLoaded = true;
//                 console.log(`[FONT] ✅ Found font at: ${fontPath}`);
//                 break; // Stop looking, we found it!
//             } catch (err) {
//                 console.log(`[FONT] ❌ Not found at: ${fontPath}`);
//             }
//         }

//         if (fontLoaded) {
//             fontStyleCSS = `
//                 @font-face {
//                     font-family: 'MyCustomFont';
//                     src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
//                 }
//                 .text { font-family: 'MyCustomFont', sans-serif; }
//             `;
//         } else {
//             // 🛑 CRITICAL FAILURE: No font found.
//             console.error("[FONT] 💥 FATAL: Could not find Roboto-Regular.ttf in any expected folder.");
//             // We throw an error here so you see it in the logs immediately, 
//             // instead of generating a broken image.
//             throw new Error("Font file missing. Please ensure 'Roboto-Regular.ttf' is in 'public/fonts/'");
//         }
//         // --- 🔍 ROBUST FONT LOADING END ---


//         // 3. Metadata & Resize
//         const metadata = await sharp(inputBuffer).metadata();
//         const width = metadata.width || 800;
//         const resizeWidth = width > 1000 ? 1000 : width;

//         // 4. Timestamp
//         const timestamp = new Date().toLocaleString('en-IN', { 
//             timeZone: 'Asia/Kolkata',
//             dateStyle: 'medium',
//             timeStyle: 'short'
//         });

//         const line1 = `GPS: ${location}`;
//         const line2 = `DATE: ${timestamp}`;
        
//         // 5. SVG Overlay
//         const svgOverlay = `
//         <svg width="${resizeWidth}" height="80">
//             <defs>
//                 <style>
//                     ${fontStyleCSS}
//                     .bg { fill: rgba(0, 0, 0, 0.6); }
//                     .text { fill: #fff; font-weight: bold; }
//                     .gps { font-size: 24px; }
//                     .date { font-size: 16px; fill: #ddd; }
//                 </style>
//             </defs>
//             <rect x="0" y="0" width="${resizeWidth}" height="80" class="bg" />
//             <text x="20" y="35" class="text gps">${line1}</text>
//             <text x="20" y="65" class="text date">${line2}</text>
//         </svg>
//         `;

//         // 6. Composite
//         const processedImageBuffer = await sharp(inputBuffer)
//             .resize({ width: resizeWidth })
//             .composite([
//                 { input: Buffer.from(svgOverlay), gravity: 'south' },
//             ])
//             .jpeg({ quality: 80 })
//             .toBuffer();

//         // 7. Upload
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

        // --- 🌐 FONT FIX: DOWNLOAD FROM GOOGLE ---
        let fontBase64 = '';
        let fontStyleCSS = '';

        try {
            // We fetch the font from Google every time to ensure it exists
            const fontUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf';
            const fontResponse = await fetch(fontUrl);
            
            if (!fontResponse.ok) throw new Error("Failed to fetch font");
            
            const fontArrayBuffer = await fontResponse.arrayBuffer();
            fontBase64 = Buffer.from(fontArrayBuffer).toString('base64');

            fontStyleCSS = `
                @font-face {
                    font-family: 'Roboto';
                    src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
                }
                .text { font-family: 'Roboto', sans-serif; }
            `;
        } catch (error) {
            console.error("Font load failed", error);
            // If this fails, we throw an error rather than producing squares
            throw new Error("Could not load fonts for watermark.");
        }

        // --- IMAGE PROCESSING ---
        const metadata = await sharp(inputBuffer).metadata();
        const width = metadata.width || 800;
        const resizeWidth = width > 1000 ? 1000 : width;

        const timestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' 
        });

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
            <text x="20" y="35" class="text gps">GPS: ${location}</text>
            <text x="20" y="65" class="text date">DATE: ${timestamp}</text>
        </svg>
        `;

        const processedImageBuffer = await sharp(inputBuffer)
            .resize({ width: resizeWidth })
            .composite([{ input: Buffer.from(svgOverlay), gravity: 'south' }])
            .jpeg({ quality: 80 })
            .toBuffer();

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
