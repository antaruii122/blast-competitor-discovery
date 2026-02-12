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

    // Local data preview - Excel style table
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

    // Detect if row looks like a title row (mostly empty cells, one main text)
    const isTitleRow = (row: any[], rowIdx: number) => {
        if (rowIdx > 1) return false;
        const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== '');
        return nonEmptyCells.length === 1 && String(nonEmptyCells[0]).length > 3;
    };

    // Detect if row looks like a header row (multiple short texts)
    const isHeaderRow = (row: any[], rowIdx: number) => {
        if (rowIdx > 2) return false;
        const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== '');
        if (nonEmptyCells.length < 2) return false;
        // Check if cells look like column headers (short text, often single words)
        const avgLength = nonEmptyCells.reduce((acc, cell) => acc + String(cell).length, 0) / nonEmptyCells.length;
        return avgLength < 30;
    };

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
                    bgcolor: '#e0e0e0',
                }}
            >
                <table
                    style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        tableLayout: 'auto',
                        fontFamily: 'Calibri, Arial, sans-serif',
                        fontSize: '12px',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <thead>
                        {/* Column letter headers (A, B, C...) */}
                        <tr>
                            <th
                                style={{
                                    position: 'sticky',
                                    top: 0,
                                    left: 0,
                                    zIndex: 4,
                                    backgroundColor: '#f3f3f3',
                                    borderRight: '1px solid #b0b0b0',
                                    borderBottom: '1px solid #b0b0b0',
                                    padding: '4px 2px',
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
                                        borderRight: '1px solid #b0b0b0',
                                        borderBottom: '1px solid #b0b0b0',
                                        padding: '4px 8px',
                                        minWidth: colIdx === 2 ? '250px' : '150px', // Wider spec column
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
                            const titleRow = isTitleRow(row, rowIdx);
                            const headerRow = isHeaderRow(row, rowIdx);

                            return (
                                <tr key={`row-${rowIdx}`}>
                                    {/* Row number */}
                                    <td
                                        style={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 2,
                                            backgroundColor: '#f3f3f3',
                                            borderRight: '1px solid #b0b0b0',
                                            borderBottom: '1px solid #d0d0d0',
                                            padding: '4px 2px',
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

                                        // Styling based on row type
                                        let bgColor = '#ffffff';
                                        let fontWeight = 400;
                                        let fontSize = '12px';
                                        let textAlign: 'left' | 'center' = 'left';
                                        let borderColor = '#d0d0d0';

                                        if (titleRow && displayValue.length > 0) {
                                            bgColor = '#fff2cc'; // Yellow for title
                                            fontWeight = 700;
                                            fontSize = '16px';
                                            textAlign = 'center';
                                        } else if (headerRow) {
                                            bgColor = '#fef9e7'; // Light yellow for headers
                                            fontWeight = 700;
                                            fontSize = '12px';
                                            textAlign = 'center';
                                            borderColor = '#217346'; // Green border like Excel
                                        }

                                        return (
                                            <td
                                                key={`cell-${rowIdx}-${colIdx}`}
                                                style={{
                                                    backgroundColor: bgColor,
                                                    borderRight: `1px solid ${borderColor}`,
                                                    borderBottom: `1px solid ${borderColor}`,
                                                    padding: '8px 10px',
                                                    minWidth: colIdx === 2 ? '250px' : '150px',
                                                    maxWidth: '450px',
                                                    verticalAlign: 'middle',
                                                    whiteSpace: hasNewlines ? 'pre-wrap' : 'normal',
                                                    wordBreak: 'break-word',
                                                    fontWeight: fontWeight,
                                                    color: '#000000',
                                                    fontSize: fontSize,
                                                    lineHeight: '1.5',
                                                    textAlign: textAlign,
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
                    borderTop: '1px solid #b0b0b0',
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
