'use client';

import { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileUploadProps {
    onDataLoaded: (data: string[][], fileName: string) => void;
    disabled?: boolean;
}

export default function FileUpload({ onDataLoaded, disabled }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseFile = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setFileName(file.name);

        try {
            const extension = file.name.split('.').pop()?.toLowerCase();

            if (extension === 'csv') {
                // Parse CSV with PapaParse
                Papa.parse(file, {
                    complete: (results) => {
                        const data = results.data as string[][];
                        // Filter out empty rows
                        const filteredData = data.filter(row => row.some(cell => cell && cell.trim()));
                        onDataLoaded(filteredData, file.name);
                        setIsLoading(false);
                    },
                    error: (err) => {
                        setError(`Failed to parse CSV: ${err.message}`);
                        setIsLoading(false);
                    }
                });
            } else if (extension === 'xlsx' || extension === 'xls') {
                // Parse Excel with XLSX
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to 2D array
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

                // Filter out empty rows
                const filteredData = data.filter(row => row.some(cell => cell !== undefined && cell !== null && String(cell).trim()));

                // Convert all values to strings
                const stringData = filteredData.map(row =>
                    row.map(cell => cell !== undefined && cell !== null ? String(cell) : '')
                );

                onDataLoaded(stringData, file.name);
                setIsLoading(false);
            } else {
                setError('Unsupported file format. Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(`Failed to read file: ${err.message}`);
            setIsLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled || isLoading) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            parseFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled && !isLoading) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            parseFile(files[0]);
        }
    };

    const handleClick = () => {
        if (!disabled && !isLoading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <Paper
            sx={{
                p: 3,
                bgcolor: '#161b22',
                border: '1px solid #30363d',
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, color: '#c9d1d9' }}>
                Upload File (CSV or Excel)
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragging ? '#58a6ff' : '#30363d',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                    bgcolor: isDragging ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: disabled || isLoading ? '#30363d' : '#58a6ff',
                        bgcolor: disabled || isLoading ? 'transparent' : 'rgba(88, 166, 255, 0.05)',
                    },
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={disabled || isLoading}
                />

                {isLoading ? (
                    <>
                        <CircularProgress size={48} sx={{ color: '#58a6ff', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#8b949e' }}>
                            Processing {fileName}...
                        </Typography>
                    </>
                ) : fileName ? (
                    <>
                        <InsertDriveFileIcon sx={{ fontSize: 48, color: '#238636', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#c9d1d9', mb: 1 }}>
                            {fileName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8b949e' }}>
                            Click or drag to replace
                        </Typography>
                    </>
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#58a6ff', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#c9d1d9', mb: 1 }}>
                            Drag and drop your file here
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8b949e', mb: 2 }}>
                            or click to browse
                        </Typography>
                        <Button
                            variant="outlined"
                            disabled={disabled}
                            sx={{
                                borderColor: '#30363d',
                                color: '#8b949e',
                                '&:hover': {
                                    borderColor: '#58a6ff',
                                    color: '#58a6ff',
                                },
                            }}
                        >
                            Select File
                        </Button>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#6e7681' }}>
                            Supported formats: .csv, .xlsx, .xls
                        </Typography>
                    </>
                )}
            </Box>
        </Paper>
    );
}
