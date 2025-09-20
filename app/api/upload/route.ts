// app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file provided or file is not a Blob.' }, { status: 400 });
        }

        const filename = (file as File).name;

        // Use the put function to upload the file
        const blob = await put(filename, file, {
            access: 'public',
            // --- ADD THIS LINE ---
            addRandomSuffix: true,
            // ---------------------
        });
        
        return NextResponse.json(blob);

    } catch (error) {
        console.error('Error handling file upload:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}