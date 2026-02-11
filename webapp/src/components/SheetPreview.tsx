'use client';

import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface SheetPreviewProps {
    data: any[][];
    title: string;
    maxRows?: number;
}

export default function SheetPreview({ data, title, maxRows = 10 }: SheetPreviewProps) {
    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 3, border: '1px solid #30363d', textAlign: 'center' }}>
                <Typography color="text.secondary">No data to preview</Typography>
            </Paper>
        );
    }

    const headers = data[0] || [];
    const rows = data.slice(1, Math.min(maxRows + 1, data.length));
    const totalRows = data.length - 1; // Exclude header
    const hasMore = totalRows > maxRows;

    return (
        <Paper sx={{ border: '1px solid #30363d' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon />
                    Data Preview: {title}
                </Typography>
                <Chip
                    label={`${totalRows} total rows`}
                    size="small"
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 50 }}>
                                #
                            </TableCell>
                            {headers.map((header: any, index: number) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        bgcolor: '#21262d',
                                        fontWeight: 600,
                                        minWidth: 120
                                    }}
                                >
                                    {header || `Column ${index + 1}`}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any[], rowIndex: number) => (
                            <TableRow
                                key={rowIndex}
                                sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                                    '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                }}
                            >
                                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                    {rowIndex + 1}
                                </TableCell>
                                {headers.map((_: any, colIndex: number) => (
                                    <TableCell key={colIndex}>
                                        {row[colIndex] !== undefined && row[colIndex] !== null
                                            ? String(row[colIndex])
                                            : '-'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {hasMore && (
                <Box sx={{ p: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Showing {rows.length} of {totalRows} rows
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
