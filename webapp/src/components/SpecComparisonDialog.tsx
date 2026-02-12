'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import { CompetitorMatch } from './CompetitorMatchTable';

interface SpecComparisonDialogProps {
    open: boolean;
    onClose: () => void;
    match: CompetitorMatch | null;
}

export default function SpecComparisonDialog({ open, onClose, match }: SpecComparisonDialogProps) {
    if (!match) return null;

    // Parse spec diffs (assuming format: "CPU: Core i5 vs Core i7")
    const parsedDiffs = match.specDiffs.map(diff => {
        const parts = diff.split(':');
        const spec = parts[0]?.trim() || '';
        const values = parts[1]?.split('vs').map(v => v.trim()) || [];

        return {
            specification: spec,
            myValue: values[0] || '-',
            competitorValue: values[1] || '-',
            isDifferent: values[0] !== values[1]
        };
    });

    const getTierInfo = (tier: string) => {
        switch (tier) {
            case 'A': return { color: '#238636', label: 'Tier A - Equivalent' };
            case 'B': return { color: '#58a6ff', label: 'Tier B - Close Match' };
            case 'C': return { color: '#bb8009', label: 'Tier C - Partial Match' };
            default: return { color: '#8b949e', label: 'Unknown' };
        }
    };

    const tierInfo = getTierInfo(match.tier);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Specification Comparison</Typography>
                <Chip
                    label={tierInfo.label}
                    sx={{ bgcolor: `${tierInfo.color}20`, color: tierInfo.color, fontWeight: 600 }}
                />
            </DialogTitle>

            <DialogContent>
                {/* Product Summary */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(88, 166, 255, 0.05)', borderRadius: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                My Product
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {match.myProductName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Competitor
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {match.competitorBrand} - {match.competitorModel}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Technical Parity Score
                            </Typography>
                            <Typography variant="h6" sx={{ color: match.technicalParityScore >= 70 ? '#238636' : '#bb8009' }}>
                                {match.technicalParityScore}%
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Differences Found
                            </Typography>
                            <Typography variant="h6">
                                {match.specDiffs.length}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Spec Comparison Table */}
                <TableContainer component={Paper} sx={{ border: '1px solid #30363d' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, width: '30%' }}>
                                    Specification
                                </TableCell>
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, width: '30%' }}>
                                    My Product
                                </TableCell>
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, width: '30%' }}>
                                    Competitor
                                </TableCell>
                                <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, width: '10%' }}>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parsedDiffs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                        No specification differences found
                                    </TableCell>
                                </TableRow>
                            )}
                            {parsedDiffs.map((diff, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                                        bgcolor: diff.isDifferent ? 'rgba(187, 128, 9, 0.05)' : 'transparent'
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        {diff.specification}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                        {diff.myValue}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                        {diff.competitorValue}
                                    </TableCell>
                                    <TableCell>
                                        {diff.isDifferent ? (
                                            <WarningIcon sx={{ color: '#bb8009', fontSize: 20 }} />
                                        ) : (
                                            <CheckCircleIcon sx={{ color: '#238636', fontSize: 20 }} />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Meta Information */}
                {match.matchMeta && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Match Metadata
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85em', mt: 0.5 }}>
                            {JSON.stringify(match.matchMeta, null, 2)}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    startIcon={<CloseIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
