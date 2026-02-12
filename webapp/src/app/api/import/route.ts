import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { executePythonScript, getBatchProcessorPath } from '@/lib/pythonBridge';

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
    let csvPath: string | null = null;

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

        // Transform sheet data to CSV format expected by batch_processor.py
        const csvData = transformDataToCsv(data, columnMapping, headerRowIndex);

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
function transformDataToCsv(
    data: any[][],
    mapping: { model: string; specifications: string[] },
    headerRowIndex: number
): string {
    const headers = data[headerRowIndex];
    const rows = data.slice(headerRowIndex + 1);

    // Find column indices based on the new simplified mapping
    const modelIdx = headers.indexOf(mapping.model);
    const specIndices = mapping.specifications.map(col => headers.indexOf(col)).filter(idx => idx >= 0);

    console.log('[API] Column mapping:', {
        modelColumn: mapping.model,
        modelIdx,
        specColumns: mapping.specifications,
        specIndices
    });

    // Build CSV with format: model,specifications_combined
    // The Python script will use model + specs to search for competitors
    const csvRows = ['model,specifications'];

    for (const row of rows) {
        const model = modelIdx >= 0 ? (row[modelIdx] || '') : '';

        // Combine all specification columns into one text
        const specsText = specIndices
            .map(idx => row[idx])
            .filter(val => val !== undefined && val !== null && String(val).trim())
            .join(' | ');

        // Skip rows without a model
        if (!model || String(model).trim() === '') {
            continue;
        }

        // Escape CSV values
        const escapeCsv = (val: string) => {
            val = String(val);
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        };

        csvRows.push([
            escapeCsv(String(model)),
            escapeCsv(specsText)
        ].join(','));
    }

    console.log('[API] Generated CSV with', csvRows.length - 1, 'rows');

    return csvRows.join('\n');
}
