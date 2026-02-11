import { Container, Typography, Box } from '@mui/material';

export default function ImportPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ mb: 2, color: '#c9d1d9' }}>
                    Import Catalog
                </Typography>
                <Typography variant="body1" sx={{ color: '#8b949e' }}>
                    Google Sheets integration coming in Phase 2...
                </Typography>
            </Box>
        </Container>
    );
}
