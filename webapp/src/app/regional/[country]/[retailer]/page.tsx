'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Breadcrumbs, CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';
import RegionalProductTable from '@/components/RegionalProductTable';
import { loadRegionalMonitors, RegionalMonitorRow } from '@/lib/supabase/monitors';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function RegionalRetailerPage() {
    const params = useParams();
    const country = typeof params.country === 'string' ? decodeURIComponent(params.country) : '';
    const retailer = typeof params.retailer === 'string' ? decodeURIComponent(params.retailer) : '';

    const [data, setData] = useState<RegionalMonitorRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (country && retailer) {
            loadData();
        }
    }, [country, retailer]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        const result = await loadRegionalMonitors(country, retailer);

        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'Failed to load regional data');
        }

        setIsLoading(false);
    };

    return (
        <Box sx={{ mt: 4, mb: 4, mx: 'auto', width: '90%', maxWidth: '1400px' }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 3, '& .MuiBreadcrumbs-li': { color: '#8b949e' } }}
            >
                <Link href="/" passHref style={{ textDecoration: 'none', color: '#58a6ff' }}>
                    Dashboard
                </Link>
                <Typography sx={{ color: '#8b949e' }}>Counterpart</Typography>
                <Typography sx={{ color: '#8b949e' }}>{country}</Typography>
                <Typography sx={{ color: '#c9d1d9', fontWeight: 600 }}>{retailer}</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography variant="h4" sx={{ color: '#f0f6fc', fontWeight: 700 }}>
                    {retailer}
                </Typography>
                <Typography variant="h6" sx={{ color: '#8b949e', pb: 0.5, fontWeight: 400 }}>
                    Monitor Intelligence - {country}
                </Typography>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                    <CircularProgress sx={{ color: '#58a6ff' }} />
                    <Typography sx={{ color: '#8b949e' }}>Synchronizing with regional intelligence...</Typography>
                </Box>
            ) : error ? (
                <Alert
                    severity="error"
                    sx={{
                        bgcolor: 'rgba(248, 81, 73, 0.1)',
                        color: '#f85149',
                        border: '1px solid rgba(248, 81, 73, 0.2)',
                        '& .MuiAlert-icon': { color: '#f85149' }
                    }}
                >
                    {error}
                </Alert>
            ) : (
                <RegionalProductTable data={data} retailer={retailer} />
            )}
        </Box>
    );
}
