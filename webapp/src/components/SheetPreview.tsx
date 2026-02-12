'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import TableRowsIcon from '@mui/icons-material/TableRows';

interface SheetPreviewProps {
    data: any[][];
    title: string;
    maxRows?: number;
    spreadsheetId?: string;
    onHeaderRowChange?: (headerRowIndex: number) => void;
    initialHeaderRow?: number;
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

export default function SheetPreview({ data, title, maxRows = 25, spreadsheetId, onHeaderRowChange, initialHeaderRow }: SheetPreviewProps) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);
    const [selectedHeaderRow, setSelectedHeaderRow] = useState<number>(initialHeaderRow ?? -1);

    // Auto-detect header row on initial load
    useEffect(() => {
        if (data && data.length > 0 && selectedHeaderRow === -1) {
            // Find the first row that looks like headers (multiple non-empty short texts)
            for (let i = 0; i < Math.min(5, data.length); i++) {
                const row = data[i];
                const nonEmptyCells = row?.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== '') || [];
                if (nonEmptyCells.length >= 2) {
                    const avgLength = nonEmptyCells.reduce((acc, cell) => acc + String(cell).length, 0) / nonEmptyCells.length;
                    // Looks like headers: multiple short texts
                    if (avgLength < 40) {
                        setSelectedHeaderRow(i);
                        onHeaderRowChange?.(i);
                        break;
                    }
                }
            }
            // If no header detected, default to row 0
            if (selectedHeaderRow === -1) {
                setSelectedHeaderRow(0);
                onHeaderRowChange?.(0);
            }
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRowClick = (rowIdx: number) => {
        setSelectedHeaderRow(rowIdx);
        onHeaderRowChange?.(rowIdx);
    };

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {onHeaderRowChange && selectedHeaderRow >= 0 && (
                        <Chip
                            icon={<TableRowsIcon sx={{ fontSize: 14 }} />}
                            label={`Header: Row ${selectedHeaderRow + 1}`}
                            size="small"
                            sx={{ bgcolor: 'rgba(35, 134, 54, 0.2)', color: '#238636', fontSize: '0.75rem' }}
                        />
                    )}
                    <Chip
                        label={`${totalRows} rows × ${totalCols} columns`}
                        size="small"
                        sx={{ bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', fontSize: '0.75rem' }}
                    />
                </Box>
            </Box>

            {/* Header row selection hint */}
            {onHeaderRowChange && (
                <Box sx={{
                    p: 1,
                    bgcolor: 'rgba(88, 166, 255, 0.1)',
                    borderBottom: '1px solid #30363d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography variant="caption" sx={{ color: '#58a6ff' }}>
                        👆 Click on a row to select it as the <strong>header row</strong> (the row with column names like "Model", "Picture", "Specification")
                    </Typography>
                </Box>
            )}

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
                            const isSelected = selectedHeaderRow === rowIdx;
                            const isDataRow = rowIdx > selectedHeaderRow;

                            return (
                                <Tooltip
                                    key={`row-${rowIdx}`}
                                    title={onHeaderRowChange ? (isSelected ? "✓ This is the header row" : "Click to set as header row") : ""}
                                    placement="left"
                                    arrow
                                >
                                    <tr
                                        onClick={() => onHeaderRowChange && handleRowClick(rowIdx)}
                                        style={{
                                            cursor: onHeaderRowChange ? 'pointer' : 'default',
                                            transition: 'background-color 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (onHeaderRowChange && !isSelected) {
                                                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '';
                                        }}
                                    >
                                        {/* Row number */}
                                        <td
                                            style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2,
                                                backgroundColor: isSelected ? '#238636' : '#f3f3f3',
                                                borderRight: '1px solid #b0b0b0',
                                                borderBottom: '1px solid #d0d0d0',
                                                padding: '4px 2px',
                                                textAlign: 'center',
                                                fontWeight: isSelected ? 700 : 400,
                                                color: isSelected ? '#ffffff' : '#595959',
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

                                            // Styling based on row selection
                                            let bgColor = '#ffffff';
                                            let fontWeight = 400;
                                            let fontSize = '12px';
                                            let textAlign: 'left' | 'center' = 'left';
                                            let borderColor = '#d0d0d0';
                                            let textColor = '#000000';

                                            if (isSelected) {
                                                // Selected header row - green highlighting
                                                bgColor = '#d4edda';
                                                fontWeight = 700;
                                                fontSize = '12px';
                                                textAlign = 'center';
                                                borderColor = '#238636';
                                                textColor = '#155724';
                                            } else if (rowIdx < selectedHeaderRow) {
                                                // Rows before header (title rows) - muted
                                                bgColor = '#f8f9fa';
                                                textColor = '#6c757d';
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
                                                        color: textColor,
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
                                </Tooltip>
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
