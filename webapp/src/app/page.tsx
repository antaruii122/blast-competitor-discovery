import { Box, Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 700, color: '#c9d1d9' }}>
          B.L.A.S.T. Intelligence
        </Typography>
        <Typography variant="h5" sx={{ color: '#8b949e', mb: 4 }}>
          Direct Product Competitor Comparisons
        </Typography>

        <Box
          sx={{
            bgcolor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 2,
            p: 6,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <Typography variant="h6" sx={{ color: '#c9d1d9', mb: 2 }}>
            Welcome to the Competition Viewer
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b949e', mb: 4 }}>
            Please select a hardware category from the "Competitor Category" menu above to view direct product comparisons mapped from the database.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
