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
    Chip,
    Alert
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';

interface CatalogPreviewProps {
    data: any[][];
    columnMapping: Record<string, any>;
    maxRows?: number;
}

export default function CatalogPreview({ data, columnMapping, maxRows = 20 }: CatalogPreviewProps) {
    if (!data || data.length < 2) {
        return (
            <Paper sx={{ p: 3, border: '1px solid #30363d', textAlign: 'center' }}>
                <Typography color="text.secondary">No catalog data to preview</Typography>
            </Paper>
        );
    }

    const headers = data[0];
    const rows = data.slice(1, Math.min(maxRows + 1, data.length));
    const totalProducts = data.length - 1;
    const hasMore = totalProducts > maxRows;

    // Get mapped column indices for simplified mapping (model + specifications)
    const modelColumn = columnMapping.model as string;
    const specColumns = (columnMapping.specifications as string[]) || [];

    const modelIdx = modelColumn ? headers.indexOf(modelColumn) : -1;
    const specIndices = specColumns.map(col => headers.indexOf(col)).filter(idx => idx >= 0);

    // Build combined specifications for each row
    const getSpecsText = (row: any[]): string => {
        const specs = specIndices.map(idx => row[idx]).filter(val => val !== undefined && val !== null && String(val).trim());
        return specs.join(' | ');
    };

    return (
        <Paper sx={{ border: '1px solid #30363d', bgcolor: '#161b22' }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#0d1117'
            }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#c9d1d9' }}>
                    <InventoryIcon sx={{ color: '#58a6ff' }} />
                    Review Catalog
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`${totalProducts} products ready to search`}
                        size="medium"
                        sx={{ bgcolor: 'rgba(35, 134, 54, 0.2)', color: '#238636', fontWeight: 600 }}
                    />
                </Box>
            </Box>

            <Alert
                severity="info"
                icon={<SearchIcon />}
                sx={{ m: 2, bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#c9d1d9' }}
            >
                Each product will be searched using the <strong>Model</strong> and <strong>Specifications</strong> you selected.
                The system will find technically equivalent competitor products worldwide.
            </Alert>

            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 50, color: '#c9d1d9' }}>
                                #
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 150, color: '#c9d1d9' }}>
                                Model ({modelColumn || 'Not Set'})
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, color: '#c9d1d9' }}>
                                Specifications ({specColumns.length} columns)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => {
                            const model = modelIdx >= 0 ? row[modelIdx] : '-';
                            const specsText = getSpecsText(row);

                            return (
                                <TableRow
                                    key={rowIndex}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                    }}
                                >
                                    <TableCell sx={{ color: '#8b949e', fontFamily: 'monospace' }}>
                                        {rowIndex + 1}
                                    </TableCell>
                                    <TableCell sx={{
                                        fontWeight: 600,
                                        fontFamily: 'monospace',
                                        color: '#58a6ff',
                                        fontSize: '0.95em'
                                    }}>
                                        {model || '-'}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#c9d1d9',
                                        fontSize: '0.9em',
                                        maxWidth: 500,
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word'
                                    }}>
                                        {specsText || <em style={{ color: '#6e7681' }}>No specifications</em>}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {hasMore && (
                <Box sx={{ p: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#8b949e' }}>
                        Showing {rows.length} of {totalProducts} products (all will be processed)
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
