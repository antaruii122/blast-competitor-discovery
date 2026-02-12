'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

interface SheetPreviewProps {
    data: any[][];
    title: string;
    maxRows?: number;
    spreadsheetId?: string; // If provided, show Google Sheets iframe
}

// Convert column index to letter (0 = A, 1 = B, ..., 26 = AA, etc.)
function getColumnLetter(index: number): string {
    let letter = '';
    while (index >= 0) {
        letter = String.fromCharCode((index % 26) + 65) + letter;
        index = Math.floor(index / 26) - 1;
    }
    return letter;
}

export default function SheetPreview({ data, title, maxRows = 15, spreadsheetId }: SheetPreviewProps) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // If spreadsheetId is provided, show Google Sheets iframe
    if (spreadsheetId) {
        const getPreviewUrl = () => {
            const cacheBuster = `${Date.now()}_${iframeKey}`;
            return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?embedded=true&rm=minimal&t=${cacheBuster}`;
        };

        const handleRefresh = () => {
            setIframeLoading(true);
            setIframeKey(prev => prev + 1);
        };

        return (
            <Paper sx={{ border: '1px solid #30363d', borderRadius: 1, overflow: 'hidden' }}>
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

                <Box sx={{ position: 'relative', height: 450 }}>
                    {iframeLoading && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#0d1117',
                            zIndex: 10
                        }}>
                            <Typography sx={{ color: '#8b949e' }}>Loading preview...</Typography>
                        </Box>
                    )}
                    <iframe
                        key={iframeKey}
                        src={getPreviewUrl()}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        onLoad={() => setIframeLoading(false)}
                        style={{ border: 'none', display: 'block', background: 'white' }}
                        title={`Preview - ${title}`}
                    />
                </Box>
            </Paper>
        );
    }

    // Local data preview - styled like Google Sheets
    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 3, border: '1px solid #30363d', textAlign: 'center' }}>
                <Typography color="text.secondary">No data to preview</Typography>
            </Paper>
        );
    }

    const displayRows = data.slice(0, maxRows + 1); // +1 for header
    const totalRows = data.length;
    const totalCols = Math.max(...data.map(row => row?.length || 0));

    return (
        <Paper sx={{ border: '1px solid #30363d', borderRadius: 1, overflow: 'hidden' }}>
            {/* Header bar */}
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

            {/* Spreadsheet-style grid */}
            <Box
                ref={containerRef}
                sx={{
                    overflow: 'auto',
                    maxHeight: 450,
                    bgcolor: '#f8f9fa',
                    '&::-webkit-scrollbar': { width: 12, height: 12 },
                    '&::-webkit-scrollbar-track': { bgcolor: '#f1f1f1' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#c1c1c1', borderRadius: 6 },
                }}
            >
                <Box sx={{ display: 'inline-block', minWidth: '100%' }}>
                    {/* Column headers (A, B, C...) */}
                    <Box sx={{ display: 'flex', position: 'sticky', top: 0, zIndex: 3 }}>
                        {/* Empty corner cell */}
                        <Box sx={{
                            minWidth: 50,
                            width: 50,
                            height: 24,
                            bgcolor: '#f0f0f0',
                            borderRight: '1px solid #e0e0e0',
                            borderBottom: '1px solid #c0c0c0',
                            position: 'sticky',
                            left: 0,
                            zIndex: 4,
                        }} />
                        {/* Column letter headers */}
                        {Array.from({ length: totalCols }).map((_, colIdx) => (
                            <Box
                                key={`col-${colIdx}`}
                                sx={{
                                    minWidth: 100,
                                    width: 100,
                                    height: 24,
                                    bgcolor: '#f0f0f0',
                                    borderRight: '1px solid #e0e0e0',
                                    borderBottom: '1px solid #c0c0c0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    color: '#444',
                                    fontFamily: 'Arial, sans-serif',
                                }}
                            >
                                {getColumnLetter(colIdx)}
                            </Box>
                        ))}
                    </Box>

                    {/* Data rows */}
                    {displayRows.map((row, rowIdx) => (
                        <Box
                            key={`row-${rowIdx}`}
                            sx={{
                                display: 'flex',
                                '&:hover .data-cell': {
                                    bgcolor: rowIdx === 0 ? '#e8f0fe' : '#e8f4fd',
                                },
                            }}
                        >
                            {/* Row number */}
                            <Box
                                sx={{
                                    minWidth: 50,
                                    width: 50,
                                    height: 24,
                                    bgcolor: '#f0f0f0',
                                    borderRight: '1px solid #c0c0c0',
                                    borderBottom: '1px solid #e0e0e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 400,
                                    color: '#444',
                                    fontFamily: 'Arial, sans-serif',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 2,
                                }}
                            >
                                {rowIdx + 1}
                            </Box>
                            {/* Data cells */}
                            {Array.from({ length: totalCols }).map((_, colIdx) => {
                                const cellValue = row?.[colIdx];
                                const isHeader = rowIdx === 0;

                                return (
                                    <Box
                                        key={`cell-${rowIdx}-${colIdx}`}
                                        className="data-cell"
                                        sx={{
                                            minWidth: 100,
                                            width: 100,
                                            height: 24,
                                            bgcolor: isHeader ? '#f0f0f0' : '#ffffff',
                                            borderRight: '1px solid #e0e0e0',
                                            borderBottom: '1px solid #e0e0e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 0.75,
                                            fontSize: '0.8rem',
                                            fontWeight: isHeader ? 600 : 400,
                                            color: '#202124',
                                            fontFamily: 'Arial, sans-serif',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            cursor: 'default',
                                            transition: 'background-color 0.1s',
                                        }}
                                        title={cellValue !== undefined && cellValue !== null ? String(cellValue) : ''}
                                    >
                                        {cellValue !== undefined && cellValue !== null ? String(cellValue) : ''}
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Footer showing row count */}
            {totalRows > maxRows + 1 && (
                <Box sx={{
                    p: 1,
                    bgcolor: '#f0f0f0',
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                        Showing {Math.min(displayRows.length, maxRows + 1)} of {totalRows} rows
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
