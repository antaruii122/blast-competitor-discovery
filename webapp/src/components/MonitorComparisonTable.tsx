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

interface GroupedData {
    your_sku: string;
    matches: Record<string, { sku: string; url?: string }>;
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

    // Grouping logic: Unique brands for columns, unique your_sku for rows
    const brands = Array.from(new Set(comparisons.map(c => c.competitor_brand))).sort();
    const groupedMap = new Map<string, GroupedData>();

    comparisons.forEach(comp => {
        if (!groupedMap.has(comp.your_sku)) {
            groupedMap.set(comp.your_sku, { your_sku: comp.your_sku, matches: {} });
        }
        groupedMap.get(comp.your_sku)!.matches[comp.competitor_brand] = {
            sku: comp.competitor_sku,
            url: comp.competitor_url
        };
    });

    const groupedRows = Array.from(groupedMap.values());

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
                    label={`${groupedRows.length} monitors mapped`}
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200, position: 'sticky', left: 0, zIndex: 2 }}>
                                My Product SKU
                            </TableCell>
                            {brands.map(brand => (
                                <TableCell key={brand} sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200 }}>
                                    {brand}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupedRows.map((row, index) => {
                            const rowBg = index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)';
                            return (
                                <TableRow
                                    key={row.your_sku}
                                    sx={{
                                        bgcolor: rowBg,
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                    }}
                                >
                                    <TableCell sx={{
                                        fontWeight: 500,
                                        position: 'sticky',
                                        left: 0,
                                        bgcolor: rowBg,
                                        borderRight: '1px solid rgba(255,255,255,0.05)',
                                        zIndex: 1
                                    }}>
                                        {row.your_sku}
                                    </TableCell>
                                    {brands.map(brand => {
                                        const match = row.matches[brand];
                                        return (
                                            <TableCell key={brand} sx={{ fontFamily: 'monospace' }}>
                                                {match ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-word', color: '#c9d1d9' }}>
                                                            {match.sku}
                                                        </Typography>
                                                        {match.url && (
                                                            <Tooltip title="View Product Page">
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={match.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{ color: '#58a6ff', p: 0.25, flexShrink: 0 }}
                                                                >
                                                                    <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
