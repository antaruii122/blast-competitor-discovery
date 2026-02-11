// Python Bridge - Execute Python scripts from Node.js
import { spawn } from 'child_process';
import path from 'path';

export interface PythonResult {
    success: boolean;
    output: string;
    error?: string;
    exitCode: number;
}

export async function executePythonScript(
    scriptPath: string,
    args: string[] = [],
    pythonPath: string = 'python'
): Promise<PythonResult> {
    return new Promise((resolve) => {
        const python = spawn(pythonPath, [scriptPath, ...args]);

        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log('[Python]', text);
        });

        python.stderr.on('data', (data) => {
            const text = data.toString();
            errorOutput += text;
            console.error('[Python Error]', text);
        });

        python.on('close', (code) => {
            resolve({
                success: code === 0,
                output,
                error: errorOutput || undefined,
                exitCode: code || 0
            });
        });

        python.on('error', (err) => {
            console.error('[Python Spawn Error]', err);
            resolve({
                success: false,
                output: '',
                error: err.message,
                exitCode: -1
            });
        });
    });
}

// Helper to get the Python backend path
export function getPythonBackendPath(): string {
    // In development, the tools folder is in the parent directory of webapp
    // In production (Vercel), we might need to adjust this
    const backendPath = process.env.PYTHON_BACKEND_PATH || path.join(process.cwd(), '..', 'tools');
    return backendPath;
}

export function getBatchProcessorPath(): string {
    return path.join(getPythonBackendPath(), 'batch_processor.py');
}
