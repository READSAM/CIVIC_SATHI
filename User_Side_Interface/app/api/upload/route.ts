
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
        let fontBase64 = '';
        let fontStyleCSS = '';
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
                console.log(`[FONT] Found font at: ${fontPath}`);
                break; 
            } catch (err) {
                console.log(`[FONT] Not found at: ${fontPath}`);
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
            console.error("[FONT] Could not find Roboto-Regular.ttf in any expected folder.");
            throw new Error("Font file missing.Ensure 'Roboto-Regular.ttf' is in 'public/fonts/'");
        }

        const metadata = await sharp(inputBuffer).metadata();
        const width = metadata.width || 800;
        const resizeWidth = width > 1000 ? 1000 : width;

        const timestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const line1 = `GPS: ${location}`;
        const line2 = `DATE: ${timestamp}`;

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
        const processedImageBuffer = await sharp(inputBuffer)
            .resize({ width: resizeWidth })
            .composite([
                { input: Buffer.from(svgOverlay), gravity: 'south' },
            ])
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


