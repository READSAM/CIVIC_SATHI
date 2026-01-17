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

        // 1. Read the Image File
        const arrayBuffer = await fileObj.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // 2. Read the Font File (Roboto-Regular.ttf)
        // We load it from the 'public' folder and convert it to Base64
        // so we can embed it directly into the SVG. This fixes the "Boxes" issue.
        const fontPath = path.join(process.cwd(), 'public', 'Roboto-Regular.ttf');
        let fontBase64 = '';
        try {
            const fontBuffer = await fs.readFile(fontPath);
            fontBase64 = fontBuffer.toString('base64');
        } catch (fontErr) {
            console.error("Could not load font file:", fontErr);
            // If font fails, we just continue (but you might see boxes again)
        }

        // 3. Get Image Metadata
        const metadata = await sharp(inputBuffer).metadata();
        const width = metadata.width || 800;
        const resizeWidth = width > 1000 ? 1000 : width;

        // 4. Generate Timestamp
        const timestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const textObj = `VERIFIED: ${timestamp} | GPS: ${location}`;
        
        // 5. Create SVG with EMBEDDED FONT
        const svgOverlay = `
        <svg width="${resizeWidth}" height="50">
            <defs>
                <style>
                    @font-face {
                        font-family: 'MyCustomFont';
                        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
                    }
                    .bg { fill: rgba(0, 0, 0, 0.6); }
                    .text { 
                        fill: #fff; 
                        font-size: 18px; 
                        font-family: 'MyCustomFont', sans-serif; 
                        font-weight: bold; 
                    }
                </style>
            </defs>
            <rect x="0" y="0" width="${resizeWidth}" height="50" class="bg" />
            <text x="10" y="32" class="text">${textObj}</text>
        </svg>
        `;

        // 6. Process Image
        const processedImageBuffer = await sharp(inputBuffer)
            .resize({ width: resizeWidth })
            .composite([
                { input: Buffer.from(svgOverlay), gravity: 'south' },
            ])
            .jpeg({ quality: 80 })
            .toBuffer();

        // 7. Upload to Vercel Blob
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
