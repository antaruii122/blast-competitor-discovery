'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import CompetitorMatchTable, { CompetitorMatch } from '@/components/CompetitorMatchTable';
import SpecComparisonDialog from '@/components/SpecComparisonDialog';
import RematchDialog from '@/components/RematchDialog';
import DashboardStats from '@/components/DashboardStats';
import { loadCompetitorMatches } from '@/lib/supabase/competitorMatches';

export default function DashboardPage() {
    const [matches, setMatches] = useState<CompetitorMatch[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<CompetitorMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [compareMatch, setCompareMatch] = useState<CompetitorMatch | null>(null);
    const [rematchMatch, setRematchMatch] = useState<CompetitorMatch | null>(null);
    const [isRematching, setIsRematching] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState<string>('all');
    const [minScore, setMinScore] = useState<number>(0);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, tierFilter, minScore, matches]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        const result = await loadCompetitorMatches();

        if (result.success && result.matches) {
            setMatches(result.matches);
        } else {
            setError(result.error || 'Failed to load matches');
        }

        setIsLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...matches];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                m.myProductName.toLowerCase().includes(query) ||
                m.competitorBrand.toLowerCase().includes(query) ||
                m.competitorModel.toLowerCase().includes(query)
            );
        }

        // Tier filter
        if (tierFilter !== 'all') {
            filtered = filtered.filter(m => m.tier === tierFilter);
        }

        // Score filter
        if (minScore > 0) {
            filtered = filtered.filter(m => m.technicalParityScore >= minScore);
        }

        setFilteredMatches(filtered);
    };

    const handleExportCSV = () => {
        const headers = [
            'My Product',
            'Competitor Brand',
            'Competitor Model',
            'Parity Score',
            'Tier',
            'Spec Differences'
        ];

        const rows = filteredMatches.map(m => [
            m.myProductName,
            m.competitorBrand,
            m.competitorModel,
            m.technicalParityScore,
            m.tier,
            m.specDiffs.join('; ')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `competitor-matches-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleRematch = async (productId: string, options?: any) => {
        setIsRematching(true);
        // TODO: Implement rematch logic
        setTimeout(() => setIsRematching(false), 1000);
    };

    const handleManualOverride = (matchId: string, updates: Partial<CompetitorMatch>) => {
        setMatches(matches.map(m =>
            m.id === matchId ? { ...m, ...updates } : m
        ));
        setRematchMatch(null);
    };

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="info">Loading dashboard...</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DashboardIcon sx={{ fontSize: 40, color: '#58a6ff' }} />
                    <Typography variant="h4" sx={{ color: '#c9d1d9' }}>
                        Competitor Analysis Dashboard
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                        sx={{ textTransform: 'none' }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportCSV}
                        disabled={filteredMatches.length === 0}
                        sx={{ textTransform: 'none' }}
                    >
                        Export CSV
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Dashboard Statistics */}
            <Box sx={{ mb: 3 }}>
                <DashboardStats matches={matches} filteredMatches={filteredMatches} />
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3, border: '1px solid #30363d' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FilterListIcon sx={{ color: '#58a6ff' }} />
                    <Typography variant="h6">Filters</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
                    <TextField
                        label="Search"
                        placeholder="Product name, brand, or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel>Tier</InputLabel>
                        <Select
                            value={tierFilter}
                            label="Tier"
                            onChange={(e) => setTierFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Tiers</MenuItem>
                            <MenuItem value="A">Tier A - Equivalent</MenuItem>
                            <MenuItem value="B">Tier B - Close Match</MenuItem>
                            <MenuItem value="C">Tier C - Partial Match</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Min. Score</InputLabel>
                        <Select
                            value={minScore}
                            label="Min. Score"
                            onChange={(e) => setMinScore(e.target.value as number)}
                        >
                            <MenuItem value={0}>All Scores</MenuItem>
                            <MenuItem value={50}>50%+</MenuItem>
                            <MenuItem value={60}>60%+</MenuItem>
                            <MenuItem value={70}>70%+</MenuItem>
                            <MenuItem value={80}>80%+</MenuItem>
                            <MenuItem value={90}>90%+</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {(searchQuery || tierFilter !== 'all' || minScore > 0) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Active filters:
                        </Typography>
                        {searchQuery && (
                            <Chip
                                label={`Search: "${searchQuery}"`}
                                size="small"
                                onDelete={() => setSearchQuery('')}
                            />
                        )}
                        {tierFilter !== 'all' && (
                            <Chip
                                label={`Tier: ${tierFilter}`}
                                size="small"
                                onDelete={() => setTierFilter('all')}
                            />
                        )}
                        {minScore > 0 && (
                            <Chip
                                label={`Min Score: ${minScore}%`}
                                size="small"
                                onDelete={() => setMinScore(0)}
                            />
                        )}
                    </Box>
                )}
            </Paper>

            {/* Results */}
            {filteredMatches.length === 0 && matches.length > 0 && (
                <Alert severity="info">
                    No matches found with current filters. Try adjusting your search criteria.
                </Alert>
            )}

            {filteredMatches.length === 0 && matches.length === 0 && (
                <Alert severity="info">
                    No competitor matches in database. Import a catalog to start matching.
                </Alert>
            )}

            {filteredMatches.length > 0 && (
                <CompetitorMatchTable
                    matches={filteredMatches}
                    onCompare={setCompareMatch}
                    onRematch={setRematchMatch}
                />
            )}

            {/* Spec Comparison Dialog */}
            <SpecComparisonDialog
                open={!!compareMatch}
                onClose={() => setCompareMatch(null)}
                match={compareMatch}
            />

            {/* Re-match Dialog */}
            <RematchDialog
                open={!!rematchMatch}
                onClose={() => setRematchMatch(null)}
                match={rematchMatch}
                onRematch={handleRematch}
                onManualOverride={handleManualOverride}
                isRematching={isRematching}
            />
        </Container>
    );
}
