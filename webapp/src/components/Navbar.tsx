'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Navbar() {
    const pathname = usePathname();

    const [competitorAnchorEl, setCompetitorAnchorEl] = useState<null | HTMLElement>(null);
    const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);

    const handleCompetitorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCompetitorAnchorEl(event.currentTarget);
    };
    const handleCompetitorClose = () => {
        setCompetitorAnchorEl(null);
    };

    const handleCountryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCountryAnchorEl(event.currentTarget);
    };
    const handleCountryClose = () => {
        setCountryAnchorEl(null);
    };

    const isCompetitorActive = pathname === '/monitors'; // Add more paths here later if needed

    return (
        <AppBar position="static" sx={{ bgcolor: '#161b22', boxShadow: 'none', borderBottom: '1px solid #30363d' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#58a6ff' }}>
                    B.L.A.S.T. Intelligence
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>

                    {/* Competitor Category Dropdown */}
                    <Box>
                        <Button
                            onClick={handleCompetitorClick}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                color: isCompetitorActive || Boolean(competitorAnchorEl) ? '#58a6ff' : '#8b949e',
                                bgcolor: isCompetitorActive || Boolean(competitorAnchorEl) ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(88, 166, 255, 0.15)',
                                    color: '#58a6ff',
                                },
                            }}
                        >
                            Competitor Category
                        </Button>
                        <Menu
                            anchorEl={competitorAnchorEl}
                            open={Boolean(competitorAnchorEl)}
                            onClose={handleCompetitorClose}
                            PaperProps={{
                                sx: {
                                    bgcolor: '#1c2128',
                                    color: '#c9d1d9',
                                    border: '1px solid #30363d',
                                    mt: 1,
                                }
                            }}
                        >
                            <Link href="/monitors" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                                <MenuItem
                                    onClick={handleCompetitorClose}
                                    sx={{
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.1)' },
                                        bgcolor: pathname === '/monitors' ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                        color: pathname === '/monitors' ? '#58a6ff' : 'inherit'
                                    }}
                                >
                                    Monitors
                                </MenuItem>
                            </Link>
                        </Menu>
                    </Box>

                    {/* Country Category Dropdown */}
                    <Box>
                        <Button
                            onClick={handleCountryClick}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                color: Boolean(countryAnchorEl) ? '#58a6ff' : '#8b949e',
                                bgcolor: Boolean(countryAnchorEl) ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(88, 166, 255, 0.15)',
                                    color: '#58a6ff',
                                },
                            }}
                        >
                            Country Category
                        </Button>
                        <Menu
                            anchorEl={countryAnchorEl}
                            open={Boolean(countryAnchorEl)}
                            onClose={handleCountryClose}
                            PaperProps={{
                                sx: {
                                    bgcolor: '#1c2128',
                                    color: '#c9d1d9',
                                    border: '1px solid #30363d',
                                    mt: 1,
                                    minWidth: 150
                                }
                            }}
                        >
                            {/* Empty for now as requested by user. Will populate from Supabase later. */}
                            <MenuItem disabled sx={{ opacity: 0.7 }}>
                                <em>No countries added</em>
                            </MenuItem>
                        </Menu>
                    </Box>

                </Box>
            </Toolbar>
        </AppBar>
    );
}
