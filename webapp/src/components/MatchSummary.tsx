'use client';

import {
    Paper,
    Box,
    Typography,
    Button,
    Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CompetitorMatch } from './CompetitorMatchTable';

interface MatchSummaryProps {
    totalMatches: number;
    selectedMatches: CompetitorMatch[];
    onApprove: () => void;
    onReject: () => void;
    isApproving?: boolean;
}

export default function MatchSummary({
    totalMatches,
    selectedMatches,
    onApprove,
    onReject,
    isApproving = false
}: MatchSummaryProps) {
    const tierCounts = {
        A: selectedMatches.filter(m => m.tier === 'A').length,
        B: selectedMatches.filter(m => m.tier === 'B').length,
        C: selectedMatches.filter(m => m.tier === 'C').length
    };

    const avgScore = selectedMatches.length > 0
        ? Math.round(selectedMatches.reduce((sum, m) => sum + m.technicalParityScore, 0) / selectedMatches.length)
        : 0;

    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Match Summary
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2, mb: 3 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Total Matches
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                        {totalMatches}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Selected
                    </Typography>
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#58a6ff' }}>
                        {selectedMatches.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Avg. Parity
                    </Typography>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{ color: avgScore >= 70 ? '#238636' : '#bb8009' }}
                    >
                        {avgScore}%
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Tier Breakdown
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#238636' }}>
                            A:{tierCounts.A}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#58a6ff' }}>
                            B:{tierCounts.B}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#bb8009' }}>
                            C:{tierCounts.C}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {selectedMatches.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Select matches to approve and save to database
                </Alert>
            )}

            {selectedMatches.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <strong>Review before approving!</strong> Once approved, {selectedMatches.length} competitor match{selectedMatches.length > 1 ? 'es' : ''} will be saved to the database.
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={onReject}
                    disabled={selectedMatches.length === 0 || isApproving}
                    sx={{ textTransform: 'none' }}
                >
                    Reject Selected
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={onApprove}
                    disabled={selectedMatches.length === 0 || isApproving}
                    sx={{ textTransform: 'none' }}
                >
                    {isApproving ? 'Saving...' : `Approve & Save (${selectedMatches.length})`}
                </Button>
            </Box>
        </Paper>
    );
}
