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
    IconButton,
    Tooltip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface MonitorComparisonRow {
    id: string;
    your_sku: string;
    competitor_brand: string;
    competitor_sku: string;
    competitor_url?: string;
}

interface MonitorComparisonTableProps {
    comparisons: MonitorComparisonRow[];
}

export default function MonitorComparisonTable({ comparisons }: MonitorComparisonTableProps) {
    if (comparisons.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #30363d' }}>
                <Typography color="text.secondary">
                    No monitor comparisons found
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ border: '1px solid #30363d' }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h6">
                    Monitor Comparisons
                </Typography>
                <Chip
                    label={`${comparisons.length} monitors mapped`}
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200 }}>
                                My Product SKU
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 150 }}>
                                Competitor Brand
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200 }}>
                                Competitor SKU
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 100 }}>
                                Link
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comparisons.map((comp) => (
                            <TableRow
                                key={comp.id}
                                sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                                    '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>
                                    {comp.your_sku}
                                </TableCell>
                                <TableCell>{comp.competitor_brand}</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                    {comp.competitor_sku}
                                </TableCell>
                                <TableCell>
                                    {comp.competitor_url ? (
                                        <Tooltip title="View Product Page">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={comp.competitor_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ color: '#58a6ff', p: 0.5 }}
                                            >
                                                <OpenInNewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            N/A
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
