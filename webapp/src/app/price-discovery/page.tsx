import { Container, Typography, Box } from '@mui/material';

export default function PriceDiscoveryPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ mb: 2, color: '#c9d1d9' }}>
                    Price Discovery
                </Typography>
                <Typography variant="body1" sx={{ color: '#8b949e' }}>
                    On-demand price discovery interface coming in Phase 6...
                </Typography>
            </Box>
        </Container>
    );
}
