'use client';

import React from 'react';
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
import { RegionalMonitorRow } from '@/lib/supabase/monitors';

interface RegionalProductTableProps {
    data: RegionalMonitorRow[];
    retailer: string;
}

export default function RegionalProductTable({ data, retailer }: RegionalProductTableProps) {
    if (data.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#1c2128', border: '1px solid #30363d' }}>
                <Typography color="#8b949e">
                    No matching products found at {retailer}
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ bgcolor: '#1c2128', border: '1px solid #30363d', overflow: 'hidden' }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#21262d'
            }}>
                <Typography variant="h6" sx={{ color: '#c9d1d9', fontWeight: 600 }}>
                    Products @ {retailer}
                </Typography>
                <Chip
                    label={`${data.length} matches found`}
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.15)', color: '#58a6ff', fontWeight: 600 }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#1c2128', color: '#8b949e', fontWeight: 600, borderBottom: '2px solid #30363d' }}>My SKU</TableCell>
                            <TableCell sx={{ bgcolor: '#1c2128', color: '#8b949e', fontWeight: 600, borderBottom: '2px solid #30363d' }}>Competitor Match</TableCell>
                            <TableCell sx={{ bgcolor: '#1c2128', color: '#8b949e', fontWeight: 600, borderBottom: '2px solid #30363d' }}>Price</TableCell>
                            <TableCell sx={{ bgcolor: '#1c2128', color: '#8b949e', fontWeight: 600, borderBottom: '2px solid #30363d' }}>Status</TableCell>
                            <TableCell sx={{ bgcolor: '#1c2128', color: '#8b949e', fontWeight: 600, borderBottom: '2px solid #30363d', textAlign: 'right' }}>Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' },
                                    bgcolor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                                }}
                            >
                                <TableCell sx={{ color: '#58a6ff', fontWeight: 500, fontFamily: 'monospace' }}>
                                    {row.your_sku}
                                </TableCell>
                                <TableCell sx={{ color: '#c9d1d9' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#c9d1d9' }}>
                                            {row.competitor_brand}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#8b949e', fontFamily: 'monospace' }}>
                                            {row.competitor_sku}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#c9d1d9', fontWeight: 600 }}>
                                    {row.price ? (
                                        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(row.price)
                                    ) : (
                                        <Typography variant="body2" sx={{ color: '#8b949e', fontStyle: 'italic' }}>N/A</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.available ? 'In Stock' : 'Out of Stock'}
                                        size="small"
                                        sx={{
                                            bgcolor: row.available ? 'rgba(63, 185, 80, 0.15)' : 'rgba(248, 81, 73, 0.15)',
                                            color: row.available ? '#3fb950' : '#f85149',
                                            fontWeight: 600,
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    {row.product_page_url && (
                                        <Tooltip title="View Product Page">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={row.product_page_url}
                                                target="_blank"
                                                sx={{ color: '#58a6ff' }}
                                            >
                                                <OpenInNewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
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
