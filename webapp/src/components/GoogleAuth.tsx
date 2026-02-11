'use client';

import { useState, useEffect } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGoogleLogin } from '@react-oauth/google';
import {
    setAccessToken,
    signOut as serviceSignOut,
    getStoredUserInfo,
    isUserSignedIn,
    SCOPES
} from '@/lib/googleSheets/client';

interface GoogleAuthProps {
    onApiReady?: (ready: boolean) => void;
    onAuthChange?: (isAuthenticated: boolean) => void;
}

export default function GoogleAuth({ onApiReady, onAuthChange }: GoogleAuthProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                if (isUserSignedIn()) {
                    const userInfo = getStoredUserInfo();
                    if (userInfo && userInfo.email) {
                        console.log('[GoogleAuth] Restored session for:', userInfo.email);
                        setUserEmail(userInfo.email);
                        setIsAuthenticated(true);

                        if (onAuthChange) {
                            onAuthChange(true);
                        }
                    }
                }
            } catch (err) {
                console.error('[GoogleAuth] Failed to restore session:', err);
            } finally {
                setIsRestoring(false);
            }
        };

        restoreSession();

        if (onApiReady) {
            onApiReady(true);
        }
    }, [onApiReady, onAuthChange]);

    // Google login hook
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log('[GoogleAuth] OAuth successful');

                // Get user info
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();

                    setAccessToken(tokenResponse.access_token, {
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture
                    });

                    setUserEmail(userInfo.email);
                    setIsAuthenticated(true);
                    console.log('[GoogleAuth] Successfully authenticated as:', userInfo.email);

                    if (onAuthChange) {
                        onAuthChange(true);
                    }
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (err: any) {
                console.error('[GoogleAuth] Error after OAuth:', err);
                setError(err.message || 'Failed to complete authentication');
                setIsAuthenticated(false);
            }
        },
        onError: (error) => {
            console.error('[GoogleAuth] OAuth error:', error);
            setError('Authentication failed. Please try again.');
            setIsAuthenticated(false);
        },
        scope: SCOPES,
    });

    const handleSignOut = () => {
        serviceSignOut();
        setIsAuthenticated(false);
        setUserEmail('');

        if (onAuthChange) {
            onAuthChange(false);
        }
    };

    if (isRestoring) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Checking saved session...
                </Typography>
            </Box>
        );
    }

    if (isAuthenticated) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 2,
                    border: '1px solid #58a6ff',
                    borderRadius: 2,
                    bgcolor: 'rgba(88, 166, 255, 0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#238636' }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Connected as {userEmail}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Session valid for 7 days
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSignOut}
                    sx={{ textTransform: 'none' }}
                >
                    Sign Out
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={() => login()}
                size="large"
                sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1.5
                }}
            >
                Connect to Google Sheets
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Stay signed in for 7 days
            </Typography>
        </Box>
    );
}
