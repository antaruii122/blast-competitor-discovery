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

interface CatalogPreviewProps {
    data: any[][];
    columnMapping: Record<string, string>;
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

    // Get mapped column indices
    const productNameIdx = headers.indexOf(columnMapping.product_name);
    const categoryIdx = headers.indexOf(columnMapping.category);
    const brandIdx = columnMapping.brand ? headers.indexOf(columnMapping.brand) : -1;
    const modelIdx = columnMapping.model ? headers.indexOf(columnMapping.model) : -1;
    const specsIdx = headers.indexOf(columnMapping.specs_json);

    return (
        <Paper sx={{ border: '1px solid #30363d' }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'rgba(88, 166, 255, 0.05)'
            }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon />
                    Catalog Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`${totalProducts} products ready`}
                        size="medium"
                        sx={{ bgcolor: 'rgba(35, 134, 54, 0.2)', color: '#238636', fontWeight: 600 }}
                    />
                </Box>
            </Box>

            <Alert severity="info" sx={{ m: 2 }}>
                Preview of products that will be sent to competitor matching engine.
                Each product will be analyzed to find technically equivalent competitors.
            </Alert>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 50 }}>
                                #
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200 }}>
                                Product Name
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 120 }}>
                                Category
                            </TableCell>
                            {brandIdx >= 0 && (
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 100 }}>
                                    Brand
                                </TableCell>
                            )}
                            {modelIdx >= 0 && (
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 120 }}>
                                    Model
                                </TableCell>
                            )}
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 150 }}>
                                Specifications
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => {
                            const specs = row[specsIdx];
                            let specCount = 0;
                            try {
                                const specsObj = typeof specs === 'string' ? JSON.parse(specs) : specs;
                                specCount = Object.keys(specsObj).length;
                            } catch (e) {
                                // Invalid JSON, ignore
                            }

                            return (
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
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {row[productNameIdx] || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row[categoryIdx] || 'Unknown'}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}
                                        />
                                    </TableCell>
                                    {brandIdx >= 0 && (
                                        <TableCell>{row[brandIdx] || '-'}</TableCell>
                                    )}
                                    {modelIdx >= 0 && (
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                            {row[modelIdx] || '-'}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Chip
                                            label={`${specCount} specs`}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(35, 134, 54, 0.1)', color: '#238636' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {hasMore && (
                <Box sx={{ p: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Showing {rows.length} of {totalProducts} products (all will be processed)
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
