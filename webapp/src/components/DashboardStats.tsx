'use client';

import {
    Box,
    Paper,
    Typography,
    LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { CompetitorMatch } from './CompetitorMatchTable';

interface DashboardStatsProps {
    matches: CompetitorMatch[];
    filteredMatches: CompetitorMatch[];
}

export default function DashboardStats({ matches, filteredMatches }: DashboardStatsProps) {
    const totalMatches = matches.length;
    const filteredCount = filteredMatches.length;

    // Calculate statistics
    const tierCounts = {
        A: matches.filter(m => m.tier === 'A').length,
        B: matches.filter(m => m.tier === 'B').length,
        C: matches.filter(m => m.tier === 'C').length
    };

    const avgScore = matches.length > 0
        ? Math.round(matches.reduce((sum, m) => sum + m.technicalParityScore, 0) / matches.length)
        : 0;

    const highQualityMatches = matches.filter(m => m.technicalParityScore >= 80).length;
    const highQualityPercentage = totalMatches > 0
        ? Math.round((highQualityMatches / totalMatches) * 100)
        : 0;

    // Brand diversity
    const uniqueBrands = new Set(matches.map(m => m.competitorBrand)).size;

    const StatCard = ({
        icon,
        title,
        value,
        subtitle,
        color = '#58a6ff',
        showProgress = false,
        progressValue = 0
    }: any) => (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5, color }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
            {showProgress && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: color
                            }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {progressValue}% quality rate
                    </Typography>
                </Box>
            )}
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Statistics Overview
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
                {/* Total Matches */}
                <StatCard
                    icon={<AssessmentIcon sx={{ fontSize: 28, color: '#58a6ff' }} />}
                    title="Total Competitor Matches"
                    value={totalMatches.toLocaleString()}
                    subtitle={filteredCount < totalMatches ? `${filteredCount} shown after filters` : 'All matches displayed'}
                    color="#58a6ff"
                />

                {/* Average Parity Score */}
                <StatCard
                    icon={<TrendingUpIcon sx={{ fontSize: 28, color: '#238636' }} />}
                    title="Average Parity Score"
                    value={`${avgScore}%`}
                    subtitle={`${highQualityMatches} matches above 80%`}
                    color={avgScore >= 70 ? '#238636' : '#bb8009'}
                    showProgress={true}
                    progressValue={avgScore}
                />

                {/* Tier A Count */}
                <StatCard
                    icon={<EmojiEventsIcon sx={{ fontSize: 28, color: '#238636' }} />}
                    title="Tier A Matches"
                    value={tierCounts.A}
                    subtitle={`${tierCounts.B} Tier B, ${tierCounts.C} Tier C`}
                    color="#238636"
                />

                {/* Brand Diversity */}
                <StatCard
                    icon={<BarChartIcon sx={{ fontSize: 28, color: '#bb8009' }} />}
                    title="Unique Competitor Brands"
                    value={uniqueBrands}
                    subtitle="Brand diversity in results"
                    color="#bb8009"
                />
            </Box>

            {/* Tier Distribution Visualization */}
            <Paper sx={{ p: 3, mt: 3, border: '1px solid #30363d' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Tier Distribution
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#238636' }}>Tier A</Typography>
                            <Typography variant="body2" fontWeight={600}>{tierCounts.A}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={totalMatches > 0 ? (tierCounts.A / totalMatches) * 100 : 0}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': { bgcolor: '#238636' }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {totalMatches > 0 ? Math.round((tierCounts.A / totalMatches) * 100) : 0}% of total
                        </Typography>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#58a6ff' }}>Tier B</Typography>
                            <Typography variant="body2" fontWeight={600}>{tierCounts.B}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={totalMatches > 0 ? (tierCounts.B / totalMatches) * 100 : 0}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': { bgcolor: '#58a6ff' }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {totalMatches > 0 ? Math.round((tierCounts.B / totalMatches) * 100) : 0}% of total
                        </Typography>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#bb8009' }}>Tier C</Typography>
                            <Typography variant="body2" fontWeight={600}>{tierCounts.C}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={totalMatches > 0 ? (tierCounts.C / totalMatches) * 100 : 0}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': { bgcolor: '#bb8009' }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {totalMatches > 0 ? Math.round((tierCounts.C / totalMatches) * 100) : 0}% of total
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
