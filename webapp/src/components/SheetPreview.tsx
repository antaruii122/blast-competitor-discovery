'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

interface SheetPreviewProps {
    data: any[][];
    title: string;
    maxRows?: number;
    spreadsheetId?: string;
}

// Convert column index to letter (0 = A, 1 = B, ..., 26 = AA, etc.)
function getColumnLetter(index: number): string {
    let letter = '';
    let i = index;
    while (i >= 0) {
        letter = String.fromCharCode((i % 26) + 65) + letter;
        i = Math.floor(i / 26) - 1;
    }
    return letter;
}

export default function SheetPreview({ data, title, maxRows = 25, spreadsheetId }: SheetPreviewProps) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);

    // If spreadsheetId is provided, show Google Sheets iframe (like ESGAMING project)
    if (spreadsheetId) {
        const getPreviewUrl = () => {
            const cacheBuster = `${Date.now()}_${iframeKey}`;
            // Use /preview URL for read-only view with full formatting
            return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/preview?t=${cacheBuster}`;
        };

        const handleRefresh = () => {
            setIframeLoading(true);
            setIframeKey(prev => prev + 1);
        };

        return (
            <Paper sx={{ border: '1px solid #30363d', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: '#161b22',
                    borderBottom: '1px solid #30363d'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VisibilityIcon sx={{ color: '#58a6ff', fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ color: '#c9d1d9', fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleRefresh} disabled={iframeLoading}>
                        <RefreshIcon sx={{ color: '#58a6ff', fontSize: 18 }} />
                    </IconButton>
                </Box>
                <Box sx={{ position: 'relative', height: 550 }}>
                    {iframeLoading && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#ffffff',
                            zIndex: 10
                        }}>
                            <Typography sx={{ color: '#666' }}>Loading Google Sheet...</Typography>
                        </Box>
                    )}
                    <iframe
                        key={iframeKey}
                        src={getPreviewUrl()}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', display: 'block', background: 'white' }}
                        onLoad={() => setIframeLoading(false)}
                        title={`Preview - ${title}`}
                    />
                </Box>
            </Paper>
        );
    }

    // Local data preview - Excel/Google Sheets style table
    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 3, border: '1px solid #30363d', textAlign: 'center' }}>
                <Typography color="text.secondary">No data to preview</Typography>
            </Paper>
        );
    }

    const displayRows = data.slice(0, maxRows + 1);
    const totalRows = data.length;
    const totalCols = Math.max(...data.map(row => row?.length || 0));

    return (
        <Paper sx={{ border: '1px solid #30363d', borderRadius: 2, overflow: 'hidden' }}>
            {/* Header bar - Dark theme */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: '#161b22',
                borderBottom: '1px solid #30363d'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon sx={{ color: '#58a6ff', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#c9d1d9', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Chip
                    label={`${totalRows} rows × ${totalCols} columns`}
                    size="small"
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', fontSize: '0.75rem' }}
                />
            </Box>

            {/* Excel-style spreadsheet area */}
            <Box
                sx={{
                    overflow: 'auto',
                    maxHeight: 550,
                    bgcolor: '#e0e0e0', // Gray area around the sheet
                }}
            >
                <table
                    style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        tableLayout: 'auto',
                        fontFamily: 'Calibri, Arial, sans-serif',
                        fontSize: '11px',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <thead>
                        {/* Column letter headers (A, B, C...) - Excel gray style */}
                        <tr>
                            <th
                                style={{
                                    position: 'sticky',
                                    top: 0,
                                    left: 0,
                                    zIndex: 4,
                                    backgroundColor: '#f3f3f3',
                                    borderRight: '1px solid #c0c0c0',
                                    borderBottom: '1px solid #c0c0c0',
                                    padding: '3px 2px',
                                    minWidth: '46px',
                                    width: '46px',
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    color: '#595959',
                                    fontSize: '11px',
                                }}
                            />
                            {Array.from({ length: totalCols }).map((_, colIdx) => (
                                <th
                                    key={`col-${colIdx}`}
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 3,
                                        backgroundColor: '#f3f3f3',
                                        borderRight: '1px solid #c0c0c0',
                                        borderBottom: '1px solid #c0c0c0',
                                        padding: '3px 8px',
                                        minWidth: '120px',
                                        textAlign: 'center',
                                        fontWeight: 400,
                                        color: '#595959',
                                        fontSize: '11px',
                                    }}
                                >
                                    {getColumnLetter(colIdx)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((row, rowIdx) => {
                            const isFirstDataRow = rowIdx === 0;

                            return (
                                <tr key={`row-${rowIdx}`}>
                                    {/* Row number - Excel gray style */}
                                    <td
                                        style={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 2,
                                            backgroundColor: '#f3f3f3',
                                            borderRight: '1px solid #c0c0c0',
                                            borderBottom: '1px solid #e0e0e0',
                                            padding: '3px 2px',
                                            textAlign: 'center',
                                            fontWeight: 400,
                                            color: '#595959',
                                            fontSize: '11px',
                                            minWidth: '46px',
                                            width: '46px',
                                        }}
                                    >
                                        {rowIdx + 1}
                                    </td>
                                    {/* Data cells */}
                                    {Array.from({ length: totalCols }).map((_, colIdx) => {
                                        const cellValue = row?.[colIdx];
                                        const displayValue = cellValue !== undefined && cellValue !== null
                                            ? String(cellValue)
                                            : '';
                                        const hasNewlines = displayValue.includes('\n');

                                        // Style first row as header (yellow background like Excel)
                                        const isHeaderStyle = isFirstDataRow && displayValue.length > 0;

                                        return (
                                            <td
                                                key={`cell-${rowIdx}-${colIdx}`}
                                                style={{
                                                    backgroundColor: isHeaderStyle ? '#fff2cc' : '#ffffff',
                                                    borderRight: '1px solid #e0e0e0',
                                                    borderBottom: '1px solid #e0e0e0',
                                                    padding: '6px 8px',
                                                    minWidth: '120px',
                                                    maxWidth: '400px',
                                                    verticalAlign: 'middle',
                                                    whiteSpace: hasNewlines ? 'pre-wrap' : 'normal',
                                                    wordBreak: 'break-word',
                                                    fontWeight: isHeaderStyle ? 700 : 400,
                                                    color: '#000000',
                                                    fontSize: '11px',
                                                    lineHeight: '1.4',
                                                    textAlign: isHeaderStyle ? 'center' : 'left',
                                                }}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Box>

            {/* Footer showing row count */}
            {totalRows > maxRows + 1 && (
                <Box sx={{
                    p: 1,
                    bgcolor: '#f3f3f3',
                    borderTop: '1px solid #c0c0c0',
                    textAlign: 'center'
                }}>
                    <Typography variant="caption" sx={{ color: '#595959' }}>
                        Showing {displayRows.length} of {totalRows} rows
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
