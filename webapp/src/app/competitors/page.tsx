'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import CompetitorMatchTable, { CompetitorMatch } from '@/components/CompetitorMatchTable';
import SpecComparisonDialog from '@/components/SpecComparisonDialog';
import MatchSummary from '@/components/MatchSummary';
import { saveCompetitorMatches, loadCompetitorMatches } from '@/lib/supabase/competitorMatches';

export default function CompetitorsPage() {
    const [matches, setMatches] = useState<CompetitorMatch[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [compareMatch, setCompareMatch] = useState<CompetitorMatch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
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
            // Optionally reload to show saved matches
            await loadMatches();
        } else {
            setError(result.error || 'Failed to save matches');
        }

        setIsApproving(false);
    };

    const handleReject = () => {
        // Remove selected matches from the list (they haven't been saved yet)
        setMatches(matches.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
        setSuccessMessage(`Rejected ${selectedIds.length} matches`);
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
                    />
                </>
            )}

            {/* Spec Comparison Dialog */}
            <SpecComparisonDialog
                open={!!compareMatch}
                onClose={() => setCompareMatch(null)}
                match={compareMatch}
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
