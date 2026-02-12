import { NextRequest, NextResponse } from 'next/server';
import { executePythonScript, getPythonBackendPath } from '@/lib/pythonBridge';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface RematchRequest {
    productId: string;
    productName: string;
    category: string;
    specs: Record<string, any>;
    options?: {
        searchQuery?: string;
        minScore?: number;
        maxResults?: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: RematchRequest = await request.json();
        const { productId, productName, category, specs, options } = body;

        console.log('[API/Rematch] Re-matching product:', productId);

        // Validate request
        if (!productId || !productName || !category) {
            return NextResponse.json(
                { error: 'Missing required fields: productId, productName, category' },
                { status: 400 }
            );
        }

        // Call Python matching script with the product details
        // This would normally call your matching engine
        const scriptPath = path.join(getPythonBackendPath(), 'single_product_matcher.py');

        const args = [
            '--product-name', productName,
            '--category', category,
            '--specs', JSON.stringify(specs),
            '--min-score', String(options?.minScore || 70),
            '--max-results', String(options?.maxResults || 5)
        ];

        if (options?.searchQuery) {
            args.push('--custom-query', options.searchQuery);
        }

        const result = await executePythonScript(scriptPath, args);

        if (!result.success) {
            console.error('[API/Rematch] Python script failed:', result.error);
            return NextResponse.json(
                {
                    error: 'Re-matching failed',
                    details: result.error,
                    output: result.output
                },
                { status: 500 }
            );
        }

        // Parse the JSON output from Python script
        let matches = [];
        try {
            const outputLines = result.output.trim().split('\n');
            const jsonLine = outputLines.find(line => line.startsWith('{') || line.startsWith('['));

            if (jsonLine) {
                matches = JSON.parse(jsonLine);
            }
        } catch (parseError) {
            console.error('[API/Rematch] Failed to parse Python output:', parseError);
        }

        return NextResponse.json({
            success: true,
            matches,
            message: `Found ${matches.length} alternative matches`
        });

    } catch (error: any) {
        console.error('[API/Rematch] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
