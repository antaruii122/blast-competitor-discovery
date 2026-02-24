'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { loadRegionalHierarchy, RegionalHierarchy } from '@/lib/supabase/monitors';
import { useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();

    const [competitorAnchorEl, setCompetitorAnchorEl] = useState<null | HTMLElement>(null);
    const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
    const [regionalData, setRegionalData] = useState<RegionalHierarchy | null>(null);

    useEffect(() => {
        const fetchRegional = async () => {
            const result = await loadRegionalHierarchy();
            if (result.success && result.data) {
                setRegionalData(result.data);
            }
        };
        fetchRegional();
    }, []);

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
                            <Link href="/cases" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                                <MenuItem
                                    onClick={handleCompetitorClose}
                                    sx={{
                                        '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.1)' },
                                        bgcolor: pathname === '/cases' ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                        color: pathname === '/cases' ? '#58a6ff' : 'inherit'
                                    }}
                                >
                                    Cases
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
                            {regionalData && Object.keys(regionalData).length > 0 ? (
                                Object.entries(regionalData).map(([country, retailers]) => [
                                    <MenuItem
                                        key={country}
                                        disabled
                                        sx={{
                                            fontWeight: 700,
                                            opacity: '1 !important',
                                            color: '#58a6ff !important',
                                            bgcolor: 'rgba(88, 166, 255, 0.05)',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            py: 1
                                        }}
                                    >
                                        {country}
                                    </MenuItem>,
                                    ...retailers.map(retailer => (
                                        <MenuItem
                                            key={retailer}
                                            onClick={handleCountryClose}
                                            sx={{
                                                pl: 4,
                                                fontSize: '0.9rem',
                                                '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.1)' }
                                            }}
                                        >
                                            {retailer}
                                        </MenuItem>
                                    ))
                                ]).flat()
                            ) : (
                                <MenuItem disabled sx={{ opacity: 0.7 }}>
                                    <em>No countries added</em>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>

                </Box>
            </Toolbar>
        </AppBar>
    );
}
