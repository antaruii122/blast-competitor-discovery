import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function Home() {
  const features = [
    {
      title: 'Import Catalog',
      description: 'Upload your product catalog from Google Sheets and start the competitor matching process.',
      icon: <UploadFileIcon sx={{ fontSize: 48, color: '#58a6ff' }} />,
      href: '/import',
    },
    {
      title: 'View Competitors',
      description: 'Browse and analyze technically equivalent competitor models with detailed spec comparisons.',
      icon: <CompareArrowsIcon sx={{ fontSize: 48, color: '#238636' }} />,
      href: '/competitors',
    },
    {
      title: 'Price Discovery',
      description: 'Search whitelisted LATAM retailers for real-time pricing on competitor products.',
      icon: <LocalOfferIcon sx={{ fontSize: 48, color: '#d29922' }} />,
      href: '/price-discovery',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 700, color: '#c9d1d9' }}>
          B.L.A.S.T. Intelligence Core
        </Typography>
        <Typography variant="h5" sx={{ color: '#8b949e', mb: 4 }}>
          AI-Powered Competitor Discovery for Hardware Products
        </Typography>
        <Typography variant="body1" sx={{ color: '#8b949e', maxWidth: 700, mx: 'auto' }}>
          Identify global technical rivals and track their pricing across South American markets.
          Two-phase workflow: Spec Matching → Price Discovery.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
        {features.map((feature) => (
          <Box key={feature.title} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Card
              sx={{
                height: '100%',
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                '&:hover': {
                  borderColor: '#58a6ff',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#c9d1d9' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#8b949e' }}>
                  {feature.description}
                </Typography>
                <Button
                  component={Link}
                  href={feature.href}
                  variant="outlined"
                  sx={{
                    borderColor: '#58a6ff',
                    color: '#58a6ff',
                    '&:hover': {
                      borderColor: '#79c0ff',
                      bgcolor: 'rgba(88, 166, 255, 0.1)',
                    },
                  }}
                >
                  Go to {feature.title}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', py: 4, borderTop: '1px solid #30363d' }}>
        <Typography variant="body2" sx={{ color: '#8b949e' }}>
          Protocol 0: Backend Intelligence Core ✅ Complete
        </Typography>
        <Typography variant="body2" sx={{ color: '#8b949e' }}>
          Protocol 1: Web Application 🚧 In Progress
        </Typography>
      </Box>
    </Container>
  );
}
