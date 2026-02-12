'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import CompetitorMatchTable, { CompetitorMatch } from '@/components/CompetitorMatchTable';
import SpecComparisonDialog from '@/components/SpecComparisonDialog';
import RematchDialog from '@/components/RematchDialog';
import MatchSummary from '@/components/MatchSummary';
import { saveCompetitorMatches, loadCompetitorMatches } from '@/lib/supabase/competitorMatches';

export default function CompetitorsPage() {
    const [matches, setMatches] = useState<CompetitorMatch[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [compareMatch, setCompareMatch] = useState<CompetitorMatch | null>(null);
    const [rematchMatch, setRematchMatch] = useState<CompetitorMatch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
    const [isRematching, setIsRematching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load matches from Supabase on mount
    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
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

    const handleApprove = async () => {
        const selectedMatches = matches.filter(m => selectedIds.includes(m.id));

        if (selectedMatches.length === 0) {
            setError('No matches selected');
            return;
        }

        setIsApproving(true);
        setError(null);

        const result = await saveCompetitorMatches(selectedMatches);

        if (result.success) {
            setSuccessMessage(`Successfully saved ${result.savedCount} competitor matches!`);
            setSelectedIds([]); // Clear selection
            await loadMatches();
        } else {
            setError(result.error || 'Failed to save matches');
        }

        setIsApproving(false);
    };

    const handleReject = () => {
        setMatches(matches.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
        setSuccessMessage(`Rejected ${selectedIds.length} matches`);
    };

    const handleRematch = async (productId: string, options?: any) => {
        setIsRematching(true);
        setError(null);

        try {
            // Call the rematch API
            const response = await fetch('/api/rematch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    productName: rematchMatch?.myProductName || '',
                    category: 'Unknown', // Would come from product data
                    specs: {},
                    options
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(`Found ${result.matches.length} alternative matches!`);
                // TODO: Update the matches list with new alternatives
            } else {
                setError(result.error || 'Re-match failed');
            }
        } catch (err: any) {
            setError(err.message || 'Re-match failed');
        } finally {
            setIsRematching(false);
        }
    };

    const handleManualOverride = (matchId: string, updates: Partial<CompetitorMatch>) => {
        setMatches(matches.map(m =>
            m.id === matchId ? { ...m, ...updates } : m
        ));
        setSuccessMessage('Match updated successfully!');
        setRematchMatch(null);
    };

    const selectedMatches = matches.filter(m => selectedIds.includes(m.id));

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
                    Competitor Matches
                </Typography>
                <Alert severity="info">Loading competitor matches...</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
                Competitor Matches
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {matches.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No competitor matches found. Import a catalog to start matching competitors.
                </Alert>
            )}

            {matches.length > 0 && (
                <>
                    {/* Summary */}
                    <Box sx={{ mb: 3 }}>
                        <MatchSummary
                            totalMatches={matches.length}
                            selectedMatches={selectedMatches}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isApproving={isApproving}
                        />
                    </Box>

                    {/* Matches Table */}
                    <CompetitorMatchTable
                        matches={matches}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onCompare={setCompareMatch}
                        onRematch={setRematchMatch}
                    />
                </>
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

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
            />
        </Container>
    );
}
