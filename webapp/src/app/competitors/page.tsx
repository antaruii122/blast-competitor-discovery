import { Container, Typography, Box } from '@mui/material';

export default function CompetitorsPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ mb: 2, color: '#c9d1d9' }}>
                    Competitors
                </Typography>
                <Typography variant="body1" sx={{ color: '#8b949e' }}>
                    Competitor viewing dashboard coming in Phase 5...
                </Typography>
            </Box>
        </Container>
    );
}
