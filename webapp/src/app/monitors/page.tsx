'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import MonitorComparisonTable, { MonitorComparisonRow } from '@/components/MonitorComparisonTable';
import { loadMonitorComparisons } from '@/lib/supabase/monitors';

export default function MonitorsPage() {
    const [comparisons, setComparisons] = useState<MonitorComparisonRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        const result = await loadMonitorComparisons();

        if (result.success && result.data) {
            setComparisons(result.data);
        } else {
            setError(result.error || 'Failed to load monitor comparisons');
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <Box sx={{ mt: 4, mb: 4, mx: 'auto', width: '85%', maxWidth: '1600px' }}>
                <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
                    Monitor Comparisons
                </Typography>
                <Alert severity="info">Loading monitor comparisons...</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, mb: 4, mx: 'auto', width: '85%', maxWidth: '1600px' }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
                Monitor Comparisons
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {!error && (
                <MonitorComparisonTable comparisons={comparisons} />
            )}
        </Box>
    );
}
