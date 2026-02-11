'use client';

import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Alert,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { extractSpreadsheetId } from '@/lib/googleSheets/client';

interface SheetUrlInputProps {
    onSheetIdExtracted: (spreadsheetId: string, url: string) => void;
    disabled?: boolean;
}

export default function SheetUrlInput({ onSheetIdExtracted, disabled }: SheetUrlInputProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            if (!url.trim()) {
                throw new Error('Please enter a Google Sheets URL');
            }

            const spreadsheetId = extractSpreadsheetId(url.trim());

            if (!spreadsheetId) {
                throw new Error('Invalid Google Sheets URL. Please provide a valid spreadsheet URL or ID.');
            }

            console.log('[SheetUrlInput] Extracted spreadsheet ID:', spreadsheetId);
            onSheetIdExtracted(spreadsheetId, url.trim());

        } catch (err: any) {
            console.error('[SheetUrlInput] Error:', err);
            setError(err.message || 'Failed to process URL');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Enter Google Sheets URL
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Google Sheets URL or ID"
                    placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={disabled || isProcessing}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled || isProcessing || !url.trim()}
                    startIcon={isProcessing ? <CircularProgress size={20} /> : null}
                    sx={{ textTransform: 'none' }}
                >
                    {isProcessing ? 'Loading...' : 'Load Spreadsheet'}
                </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Paste the full URL from your browser or just the spreadsheet ID
            </Typography>
        </Paper>
    );
}
