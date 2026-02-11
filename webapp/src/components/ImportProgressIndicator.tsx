'use client';

import {
    Box,
    Paper,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export interface ImportProgress {
    status: 'idle' | 'processing' | 'complete' | 'error';
    currentStep: number;
    totalSteps: number;
    currentProduct?: string;
    processedProducts: number;
    totalProducts: number;
    message: string;
    error?: string;
}

interface ImportProgressIndicatorProps {
    progress: ImportProgress;
}

const STEPS = [
    'Validating catalog data',
    'Searching global competitors',
    'Analyzing technical specifications',
    'Calculating parity scores',
    'Saving results to database'
];

export default function ImportProgressIndicator({ progress }: ImportProgressIndicatorProps) {
    const percentage = progress.totalProducts > 0
        ? Math.round((progress.processedProducts / progress.totalProducts) * 100)
        : 0;

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < progress.currentStep) return 'complete';
        if (stepIndex === progress.currentStep) return 'active';
        return 'pending';
    };

    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Import Progress
            </Typography>

            {/* Overall Progress */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {progress.message}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {progress.processedProducts} / {progress.totalProducts} products
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: progress.status === 'error' ? '#f85149' : '#238636'
                        }
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {percentage}% complete
                </Typography>
            </Box>

            {/* Current Product */}
            {progress.currentProduct && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(88, 166, 255, 0.05)', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Currently processing:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {progress.currentProduct}
                    </Typography>
                </Box>
            )}

            {/* Steps */}
            <List dense>
                {STEPS.map((step, index) => {
                    const status = getStepStatus(index);

                    return (
                        <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {status === 'complete' && <CheckCircleIcon sx={{ color: '#238636' }} />}
                                {status === 'active' && (
                                    <HourglassEmptyIcon sx={{ color: '#58a6ff' }} className="rotating" />
                                )}
                                {status === 'pending' && <CircleIcon sx={{ color: '#30363d', fontSize: 16 }} />}
                            </ListItemIcon>
                            <ListItemText
                                primary={step}
                                primaryTypographyProps={{
                                    color: status === 'complete' ? 'text.primary' : 'text.secondary',
                                    fontWeight: status === 'active' ? 600 : 400
                                }}
                            />
                            {status === 'complete' && (
                                <Chip label="Done" size="small" sx={{ bgcolor: 'rgba(35, 134, 54, 0.2)', color: '#238636' }} />
                            )}
                            {status === 'active' && (
                                <Chip label="Processing..." size="small" sx={{ bgcolor: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }} />
                            )}
                        </ListItem>
                    );
                })}
            </List>

            {/* Error Message */}
            {progress.error && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(248, 81, 73, 0.1)', borderRadius: 1, border: '1px solid #f85149' }}>
                    <Typography variant="body2" color="#f85149">
                        Error: {progress.error}
                    </Typography>
                </Box>
            )}

            <style jsx global>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotating {
          animation: rotate 2s linear infinite;
        }
      `}</style>
        </Paper>
    );
}
