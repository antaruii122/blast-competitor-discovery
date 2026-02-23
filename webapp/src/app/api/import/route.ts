import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for long-running imports

interface ImportRequest {
    data: any[][];
    columnMapping: {
        model: string;
        specifications: string[];
    };
    spreadsheetId: string | null;
    sheetTitle: string;
    source: 'google' | 'file';
    headerRowIndex?: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: ImportRequest = await request.json();
        const { data, columnMapping, spreadsheetId, sheetTitle, source, headerRowIndex = 0 } = body;

        console.log('[API] Starting import:', {
            totalRows: data.length,
            headerRowIndex,
            spreadsheetId,
            sheetTitle,
            source,
            mapping: columnMapping
        });

        // Validate request
        if (!data || data.length < 2) {
            return NextResponse.json(
                { error: 'No data provided or insufficient rows' },
                { status: 400 }
            );
        }

        // Validate the new simplified mapping format (model + specifications)
        if (!columnMapping.model || !columnMapping.specifications || columnMapping.specifications.length === 0) {
            return NextResponse.json(
                { error: 'Missing required column mappings (model and specifications)' },
                { status: 400 }
            );
        }

        const headers = data[headerRowIndex];
        const rows = data.slice(headerRowIndex + 1);

        const modelIdx = headers.indexOf(columnMapping.model);
        const specIndices = columnMapping.specifications.map(col => headers.indexOf(col)).filter(idx => idx >= 0);

        if (modelIdx === -1) {
            return NextResponse.json(
                { error: 'Model column not found in data headers' },
                { status: 400 }
            );
        }

        const supabase = getServiceSupabase();

        let validRowsCount = 0;
        const productsToInsert = [];

        for (const row of rows) {
            const model = row[modelIdx] !== undefined && row[modelIdx] !== null ? String(row[modelIdx]).trim() : '';

            // Skip rows without a model
            if (!model) continue;

            // Combine all specification columns into one text
            const specsText = specIndices
                .map(idx => row[idx])
                .filter(val => val !== undefined && val !== null && String(val).trim())
                .join(' | ');

            productsToInsert.push({
                id: crypto.randomUUID(),
                model_name: model,
                specifications_text: specsText,
                created_at: new Date().toISOString(),
                status: 'pending'
            });
            validRowsCount++;
        }

        console.log(`[API] Processing ${validRowsCount} products to Supabase`);

        if (productsToInsert.length > 0) {
            // Batch upsert to database to avoid large payload limits
            const batchSize = 500;
            for (let i = 0; i < productsToInsert.length; i += batchSize) {
                const chunk = productsToInsert.slice(i, i + batchSize);
                const { error } = await supabase
                    .from('products')
                    .upsert(chunk, { onConflict: 'model_name' });

                if (error) {
                    console.error('[API] Supabase batch upsert failed at chunk', i, error);
                    throw new Error('Database operation failed: ' + error.message);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Import completed successfully',
            processedRows: validRowsCount,
            output: `Processed ${validRowsCount} products natively to database.`
        });

    } catch (error: any) {
        console.error('[API] Import error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
