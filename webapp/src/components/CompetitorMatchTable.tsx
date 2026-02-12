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
    Checkbox
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export interface CompetitorMatch {
    id: string;
    myProductId: string;
    myProductName: string;
    competitorBrand: string;
    competitorModel: string;
    technicalParityScore: number;
    tier: 'A' | 'B' | 'C';
    specDiffs: string[];
    matchMeta?: any;
}

interface CompetitorMatchTableProps {
    matches: CompetitorMatch[];
    onCompare?: (match: CompetitorMatch) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    selectedIds?: string[];
}

export default function CompetitorMatchTable({
    matches,
    onCompare,
    onSelectionChange,
    selectedIds = []
}: CompetitorMatchTableProps) {
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            onSelectionChange?.(matches.map(m => m.id));
        } else {
            onSelectionChange?.([]);
        }
    };

    const handleSelect = (id: string) => {
        const newSelection = selectedIds.includes(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id];
        onSelectionChange?.(newSelection);
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'A': return { bg: 'rgba(35, 134, 54, 0.2)', color: '#238636', label: 'Tier A' };
            case 'B': return { bg: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff', label: 'Tier B' };
            case 'C': return { bg: 'rgba(187, 128, 9, 0.2)', color: '#bb8009', label: 'Tier C' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', color: '#8b949e', label: 'Unknown' };
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#238636'; // Green
        if (score >= 70) return '#58a6ff'; // Blue
        if (score >= 50) return '#bb8009'; // Yellow
        return '#f85149'; // Red
    };

    if (matches.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #30363d' }}>
                <Typography color="text.secondary">
                    No competitor matches found
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
                    Competitor Matches
                </Typography>
                <Chip
                    label={`${matches.length} matches found`}
                    sx={{ bgcolor: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ bgcolor: '#21262d' }}>
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < matches.length}
                                    checked={matches.length > 0 && selectedIds.length === matches.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 200 }}>
                                My Product
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 150 }}>
                                Competitor Brand
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 150 }}>
                                Competitor Model
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 100 }}>
                                Parity Score
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 80 }}>
                                Tier
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 120 }}>
                                Spec Diffs
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#21262d', fontWeight: 600, minWidth: 80 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.map((match) => {
                            const tierInfo = getTierColor(match.tier);
                            const isSelected = selectedIds.includes(match.id);

                            return (
                                <TableRow
                                    key={match.id}
                                    selected={isSelected}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelect(match.id)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {match.myProductName}
                                    </TableCell>
                                    <TableCell>{match.competitorBrand}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>
                                        {match.competitorModel}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 6,
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: 1,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: `${match.technicalParityScore}%`,
                                                        height: '100%',
                                                        bgcolor: getScoreColor(match.technicalParityScore),
                                                        transition: 'width 0.3s'
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: getScoreColor(match.technicalParityScore)
                                                }}
                                            >
                                                {match.technicalParityScore}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={match.tier === 'A' ? <EmojiEventsIcon /> : undefined}
                                            label={tierInfo.label}
                                            size="small"
                                            sx={{
                                                bgcolor: tierInfo.bg,
                                                color: tierInfo.color,
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${match.specDiffs.length} differences`}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Compare Specifications">
                                            <IconButton
                                                size="small"
                                                onClick={() => onCompare?.(match)}
                                                sx={{ color: '#58a6ff' }}
                                            >
                                                <CompareArrowsIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
