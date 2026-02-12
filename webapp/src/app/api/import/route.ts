import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { executePythonScript, getBatchProcessorPath } from '@/lib/pythonBridge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for long-running imports

interface ImportRequest {
    data: any[][];
    columnMapping: Record<string, string>;
    spreadsheetId: string;
    sheetTitle: string;
}

export async function POST(request: NextRequest) {
    let csvPath: string | null = null;

    try {
        const body: ImportRequest = await request.json();
        const { data, columnMapping, spreadsheetId, sheetTitle } = body;

        console.log('[API] Starting import:', {
            rows: data.length - 1,
            spreadsheetId,
            sheetTitle,
            mapping: columnMapping
        });

        // Validate request
        if (!data || data.length < 2) {
            return NextResponse.json(
                { error: 'No data provided or insufficient rows' },
                { status: 400 }
            );
        }

        if (!columnMapping.product_name || !columnMapping.category || !columnMapping.specs_json) {
            return NextResponse.json(
                { error: 'Missing required column mappings' },
                { status: 400 }
            );
        }

        // Transform sheet data to CSV format expected by batch_processor.py
        const csvData = transformDataToCsv(data, columnMapping);

        // Create temporary CSV file
        const tmpDir = path.join(process.cwd(), 'tmp');
        await mkdir(tmpDir, { recursive: true });

        const timestamp = Date.now();
        csvPath = path.join(tmpDir, `import_${timestamp}.csv`);

        await writeFile(csvPath, csvData, 'utf-8');
        console.log('[API] Created temporary CSV:', csvPath);

        // Execute Python batch processor
        const batchProcessorPath = getBatchProcessorPath();
        console.log('[API] Executing batch processor:', batchProcessorPath);

        const result = await executePythonScript(batchProcessorPath, [csvPath]);

        // Clean up temporary file
        if (csvPath) {
            try {
                await unlink(csvPath);
                console.log('[API] Cleaned up temporary CSV');
            } catch (cleanupError) {
                console.warn('[API] Failed to cleanup temp file:', cleanupError);
            }
        }

        if (!result.success) {
            console.error('[API] Python script failed:', result.error);
            return NextResponse.json(
                {
                    error: 'Batch processing failed',
                    details: result.error,
                    output: result.output
                },
                { status: 500 }
            );
        }

        // Parse results from Python script output
        console.log('[API] Batch processing complete');

        return NextResponse.json({
            success: true,
            message: 'Import completed successfully',
            processedRows: data.length - 1,
            output: result.output
        });

    } catch (error: any) {
        console.error('[API] Import error:', error);

        // Clean up temporary file on error
        if (csvPath) {
            try {
                await unlink(csvPath);
            } catch (cleanupError) {
                console.warn('[API] Failed to cleanup temp file on error:', cleanupError);
            }
        }

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Transform sheet data into CSV format for batch_processor.py
function transformDataToCsv(data: any[][], mapping: Record<string, string>): string {
    const headers = data[0];
    const rows = data.slice(1);

    // Find column indices based on mapping
    const productNameIdx = headers.indexOf(mapping.product_name);
    const categoryIdx = headers.indexOf(mapping.category);
    const brandIdx = mapping.brand ? headers.indexOf(mapping.brand) : -1;
    const modelIdx = mapping.model ? headers.indexOf(mapping.model) : -1;
    const specsIdx = headers.indexOf(mapping.specs_json);

    // Build CSV with expected format: product_name,category,brand,model,specs_json
    const csvRows = ['product_name,category,brand,model,specs_json'];

    for (const row of rows) {
        const productName = row[productNameIdx] || '';
        const category = row[categoryIdx] || '';
        const brand = brandIdx >= 0 ? row[brandIdx] || '' : '';
        const model = modelIdx >= 0 ? row[modelIdx] || '' : '';
        const specs = row[specsIdx] || '{}';

        // Escape CSV values
        const escapeCsv = (val: string) => {
            val = String(val);
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        };

        csvRows.push([
            escapeCsv(productName),
            escapeCsv(category),
            escapeCsv(brand),
            escapeCsv(model),
            escapeCsv(specs)
        ].join(','));
    }

    return csvRows.join('\n');
}
