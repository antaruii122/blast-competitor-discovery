'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { CompetitorMatch } from './CompetitorMatchTable';

interface AlternativeMatch {
    brand: string;
    model: string;
    score: number;
    tier: 'A' | 'B' | 'C';
    confidence: number;
    specDiffs: string[];
}

interface RematchDialogProps {
    open: boolean;
    onClose: () => void;
    match: CompetitorMatch | null;
    onRematch: (productId: string, options?: RematchOptions) => void;
    onManualOverride: (matchId: string, updates: Partial<CompetitorMatch>) => void;
    isRematching?: boolean;
}

interface RematchOptions {
    searchQuery?: string;
    minScore?: number;
    allowedTiers?: ('A' | 'B' | 'C')[];
}

export default function RematchDialog({
    open,
    onClose,
    match,
    onRematch,
    onManualOverride,
    isRematching = false
}: RematchDialogProps) {
    const [mode, setMode] = useState<'auto' | 'manual'>('auto');
    const [manualBrand, setManualBrand] = useState('');
    const [manualModel, setManualModel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minScore, setMinScore] = useState(70);
    const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

    // Mock alternative matches - in production, these would come from the backend
    const alternativeMatches: AlternativeMatch[] = [
        {
            brand: 'Competitor A',
            model: 'Model X-100',
            score: 92,
            tier: 'A',
            confidence: 95,
            specDiffs: ['RAM: 16GB vs 32GB', 'Storage: 512GB vs 1TB']
        },
        {
            brand: 'Competitor B',
            model: 'Pro Series 200',
            score: 85,
            tier: 'B',
            confidence: 88,
            specDiffs: ['CPU: i5 vs i7', 'RAM: 16GB vs 16GB']
        },
        {
            brand: 'Competitor C',
            model: 'Elite 300',
            score: 78,
            tier: 'B',
            confidence: 82,
            specDiffs: ['Display: 15" vs 17"', 'GPU: RTX 3060 vs RTX 3070']
        }
    ];

    const handleAutoRematch = () => {
        if (!match) return;

        const options: RematchOptions = {
            searchQuery: searchQuery || undefined,
            minScore: minScore || undefined
        };

        onRematch(match.myProductId, options);
    };

    const handleManualOverride = () => {
        if (!match || !manualBrand || !manualModel) return;

        onManualOverride(match.id, {
            competitorBrand: manualBrand,
            competitorModel: manualModel
        });

        onClose();
    };

    const handleSelectAlternative = () => {
        if (!match || !selectedAlternative) return;

        const alternative = alternativeMatches.find(a => `${a.brand}-${a.model}` === selectedAlternative);
        if (!alternative) return;

        onManualOverride(match.id, {
            competitorBrand: alternative.brand,
            competitorModel: alternative.model,
            technicalParityScore: alternative.score,
            tier: alternative.tier,
            specDiffs: alternative.specDiffs
        });

        onClose();
    };

    if (!match) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Re-match Competitor</Typography>
                    <Chip
                        label={match.myProductName}
                        sx={{ bgcolor: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }}
                    />
                </Box>
            </DialogTitle>

            <DialogContent>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Current match: <strong>{match.competitorBrand} - {match.competitorModel}</strong> (Score: {match.technicalParityScore}%)
                </Alert>

                {/* Mode Selection */}
                <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as 'auto' | 'manual')}>
                    <FormControlLabel
                        value="auto"
                        control={<Radio />}
                        label="Auto Re-match (Search again with different parameters)"
                    />
                    <FormControlLabel
                        value="manual"
                        control={<Radio />}
                        label="Manual Override (Specify competitor details manually)"
                    />
                </RadioGroup>

                {/* Auto Re-match Mode */}
                {mode === 'auto' && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Alternative Matches Found
                        </Typography>

                        {alternativeMatches.map((alt) => {
                            const key = `${alt.brand}-${alt.model}`;
                            const isSelected = selectedAlternative === key;

                            return (
                                <Box
                                    key={key}
                                    onClick={() => setSelectedAlternative(key)}
                                    sx={{
                                        p: 2,
                                        mb: 1,
                                        border: isSelected ? '2px solid #58a6ff' : '1px solid #30363d',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? 'rgba(88, 166, 255, 0.05)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1" fontWeight={600}>
                                            {alt.brand} - {alt.model}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                label={`Tier ${alt.tier}`}
                                                size="small"
                                                sx={{ bgcolor: alt.tier === 'A' ? 'rgba(35, 134, 54, 0.2)' : 'rgba(88, 166, 255, 0.2)' }}
                                            />
                                            <Chip
                                                label={`${alt.score}%`}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                                            />
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Confidence: {alt.confidence}% • {alt.specDiffs.length} spec differences
                                    </Typography>
                                </Box>
                            );
                        })}

                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Custom Search Query (optional)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g., gaming laptop RTX 3070 16GB"
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Minimum Parity Score</InputLabel>
                                <Select
                                    value={minScore}
                                    label="Minimum Parity Score"
                                    onChange={(e) => setMinScore(e.target.value as number)}
                                >
                                    <MenuItem value={50}>50% - Show all matches</MenuItem>
                                    <MenuItem value={60}>60% - Decent matches</MenuItem>
                                    <MenuItem value={70}>70% - Good matches</MenuItem>
                                    <MenuItem value={80}>80% - Great matches</MenuItem>
                                    <MenuItem value={90}>90% - Near perfect</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                )}

                {/* Manual Override Mode */}
                {mode === 'manual' && (
                    <Box sx={{ mt: 3 }}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Manual override will replace the current match without validation
                        </Alert>

                        <TextField
                            fullWidth
                            label="Competitor Brand"
                            value={manualBrand}
                            onChange={(e) => setManualBrand(e.target.value)}
                            placeholder="e.g., Dell, HP, Lenovo"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Competitor Model"
                            value={manualModel}
                            onChange={(e) => setManualModel(e.target.value)}
                            placeholder="e.g., XPS 15, Pavilion G7"
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>

                {mode === 'auto' && selectedAlternative && (
                    <Button
                        variant="contained"
                        onClick={handleSelectAlternative}
                        startIcon={<EditIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Use Selected Match
                    </Button>
                )}

                {mode === 'auto' && !selectedAlternative && (
                    <Button
                        variant="contained"
                        onClick={handleAutoRematch}
                        disabled={isRematching}
                        startIcon={<RefreshIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        {isRematching ? 'Searching...' : 'Search Again'}
                    </Button>
                )}

                {mode === 'manual' && (
                    <Button
                        variant="contained"
                        onClick={handleManualOverride}
                        disabled={!manualBrand || !manualModel}
                        startIcon={<EditIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Apply Manual Override
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
