'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Import Catalog', href: '/import' },
        { label: 'Competitors', href: '/competitors' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Price Discovery', href: '/price-discovery' },
    ];

    return (
        <AppBar position="static" sx={{ bgcolor: '#161b22', boxShadow: 'none', borderBottom: '1px solid #30363d' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#58a6ff' }}>
                    B.L.A.S.T. Intelligence
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} passHref style={{ textDecoration: 'none' }}>
                            <Button
                                sx={{
                                    color: pathname === item.href ? '#58a6ff' : '#8b949e',
                                    bgcolor: pathname === item.href ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(88, 166, 255, 0.15)',
                                        color: '#58a6ff',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
