'use client';

import { useState } from 'react';
import { Container, Typography, Box, Button, Stepper, Step, StepLabel, Alert, Dialog, DialogTitle, DialogContent, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
import GoogleAuth from '@/components/GoogleAuth';
import SheetUrlInput from '@/components/SheetUrlInput';
import SheetSelector from '@/components/SheetSelector';
import SheetPreview from '@/components/SheetPreview';
import ColumnMapping from '@/components/ColumnMapping';
import CatalogPreview from '@/components/CatalogPreview';
import FileUpload from '@/components/FileUpload';
import ImportProgressIndicator, { ImportProgress } from '@/components/ImportProgressIndicator';
import { getSpreadsheetMetadata, readSpreadsheet } from '@/lib/googleSheets/client';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudIcon from '@mui/icons-material/Cloud';
import UploadFileIcon from '@mui/icons-material/UploadFile';

type ImportMode = 'google' | 'file';

const googleSteps = ['Connect Google', 'Select Sheet', 'Preview Data', 'Map Columns', 'Review Catalog', 'Import'];
const fileSteps = ['Upload File', 'Preview Data', 'Map Columns', 'Review Catalog', 'Import'];

export default function ImportPage() {
    const [importMode, setImportMode] = useState<ImportMode | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
    const [spreadsheetTitle, setSpreadsheetTitle] = useState('');
    const [sheets, setSheets] = useState<any[]>([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [sheetData, setSheetData] = useState<any[][]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [showProgressDialog, setShowProgressDialog] = useState(false);
    const [fileName, setFileName] = useState('');
    const [importProgress, setImportProgress] = useState<ImportProgress>({
        status: 'idle',
        currentStep: 0,
        totalSteps: 5,
        processedProducts: 0,
        totalProducts: 0,
        message: 'Preparing import...'
    });
    const [headerRowIndex, setHeaderRowIndex] = useState<number>(0);

    const steps = importMode === 'google' ? googleSteps : fileSteps;

    // Handle mode selection
    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ImportMode | null) => {
        if (newMode !== null) {
            setImportMode(newMode);
            setActiveStep(0);
            // Reset all state
            setSheetData([]);
            setColumnMapping({});
            setError(null);
            setSpreadsheetId('');
            setSpreadsheetUrl('');
            setSpreadsheetTitle('');
            setSheets([]);
            setSelectedSheet('');
            setFileName('');
            setHeaderRowIndex(0);
        }
    };

    // Header row change handler
    const handleHeaderRowChange = (rowIndex: number) => {
        setHeaderRowIndex(rowIndex);
        // Reset column mapping when header row changes
        setColumnMapping({});
    };

    // File upload handler
    const handleFileLoaded = (data: string[][], name: string) => {
        setSheetData(data);
        setFileName(name);
        setActiveStep(1); // Move to Preview Data step
    };

    // Step 1: Authentication (Google mode)
    const handleAuthChange = (authenticated: boolean) => {
        setIsAuthenticated(authenticated);
        if (authenticated && activeStep === 0) {
            setActiveStep(1);
        }
    };

    // Step 2: Load spreadsheet metadata (Google mode)
    const handleSheetIdExtracted = async (id: string, url: string) => {
        setError(null);
        setIsLoading(true);

        try {
            const metadata = await getSpreadsheetMetadata(id);

            setSpreadsheetId(id);
            setSpreadsheetUrl(url);
            setSpreadsheetTitle(metadata.title);
            setSheets(metadata.sheets);

            // Auto-select first sheet
            if (metadata.sheets.length > 0) {
                setSelectedSheet(metadata.sheets[0].title);
            }

            setActiveStep(2);
        } catch (err: any) {
            console.error('[Import] Error loading spreadsheet:', err);
            setError(err.message || 'Failed to load spreadsheet metadata');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Load sheet data (Google mode)
    const handleSheetSelect = async (sheetTitle: string) => {
        setSelectedSheet(sheetTitle);
        setError(null);
        setIsLoading(true);

        try {
            const data = await readSpreadsheet(spreadsheetId, sheetTitle);
            setSheetData(data.values);
            setActiveStep(3);
        } catch (err: any) {
            console.error('[Import] Error reading sheet:', err);
            setError(err.message || 'Failed to read sheet data');
        } finally {
            setIsLoading(false);
        }
    };

    // Column mapping handler
    const handleMappingChange = (mapping: Record<string, string | string[]>) => {
        setColumnMapping(mapping as Record<string, string>);

        // Check if model and specifications are mapped
        const hasModel = mapping.model && (mapping.model as string).length > 0;
        const hasSpecs = mapping.specifications && (mapping.specifications as string[]).length > 0;

        // Move to catalog preview step when both are set
        const mappingStep = importMode === 'google' ? 3 : 2;
        const previewStep = importMode === 'google' ? 4 : 3;

        if (hasModel && hasSpecs && activeStep === mappingStep) {
            setActiveStep(previewStep);
        }
    };

    // Start import process
    const handleStartImport = async () => {
        setIsImporting(true);
        setShowProgressDialog(true);
        setError(null);

        const totalProducts = sheetData.length - headerRowIndex - 1;

        setImportProgress({
            status: 'processing',
            currentStep: 0,
            totalSteps: 5,
            processedProducts: 0,
            totalProducts,
            message: 'Starting import...'
        });

        try {
            // Call the API to start the import
            const response = await fetch('/api/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: sheetData,
                    columnMapping,
                    spreadsheetId: importMode === 'google' ? spreadsheetId : null,
                    sheetTitle: importMode === 'google' ? selectedSheet : fileName,
                    source: importMode,
                    headerRowIndex
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Import failed');
            }

            // Success!
            setImportProgress({
                status: 'complete',
                currentStep: 5,
                totalSteps: 5,
                processedProducts: totalProducts,
                totalProducts,
                message: 'Import completed successfully!'
            });

            const finalStep = importMode === 'google' ? 5 : 4;
            setActiveStep(finalStep);

        } catch (err: any) {
            console.error('[Import] Error:', err);
            setError(err.message || 'Import failed');
            setImportProgress({
                ...importProgress,
                status: 'error',
                message: 'Import failed',
                error: err.message
            });
        } finally {
            setIsImporting(false);
        }
    };

    // Determine which step content to show based on mode
    const getPreviewStep = () => importMode === 'google' ? 3 : 1;
    const getMappingStep = () => importMode === 'google' ? 3 : 2;
    const getCatalogStep = () => importMode === 'google' ? 4 : 3;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
                Import Product Catalog
            </Typography>

            {/* Import Mode Selection */}
            {!importMode && (
                <Paper sx={{ p: 4, bgcolor: '#161b22', border: '1px solid #30363d', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#c9d1d9', textAlign: 'center' }}>
                        Choose Import Method
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Paper
                            onClick={() => setImportMode('google')}
                            sx={{
                                p: 4,
                                width: 280,
                                cursor: 'pointer',
                                bgcolor: '#0d1117',
                                border: '1px solid #30363d',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#58a6ff',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CloudIcon sx={{ fontSize: 64, color: '#58a6ff', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#c9d1d9', mb: 1 }}>
                                Google Sheets
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8b949e' }}>
                                Connect your Google account and import directly from Google Sheets
                            </Typography>
                        </Paper>

                        <Paper
                            onClick={() => setImportMode('file')}
                            sx={{
                                p: 4,
                                width: 280,
                                cursor: 'pointer',
                                bgcolor: '#0d1117',
                                border: '1px solid #30363d',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#238636',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <UploadFileIcon sx={{ fontSize: 64, color: '#238636', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#c9d1d9', mb: 1 }}>
                                Upload File
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8b949e' }}>
                                Upload a CSV or Excel file (.csv, .xlsx, .xls) from your computer
                            </Typography>
                        </Paper>
                    </Box>
                </Paper>
            )}

            {/* Show stepper and content once mode is selected */}
            {importMode && (
                <>
                    {/* Mode switcher */}
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ToggleButtonGroup
                            value={importMode}
                            exclusive
                            onChange={handleModeChange}
                            size="small"
                        >
                            <ToggleButton value="google" sx={{ color: '#8b949e', '&.Mui-selected': { color: '#58a6ff', bgcolor: 'rgba(88, 166, 255, 0.1)' } }}>
                                <CloudIcon sx={{ mr: 1 }} /> Google Sheets
                            </ToggleButton>
                            <ToggleButton value="file" sx={{ color: '#8b949e', '&.Mui-selected': { color: '#238636', bgcolor: 'rgba(35, 134, 54, 0.1)' } }}>
                                <UploadFileIcon sx={{ mr: 1 }} /> Upload File
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Google Sheets Flow */}
                    {importMode === 'google' && (
                        <>
                            {/* Step 1: Google Authentication */}
                            {activeStep >= 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <GoogleAuth onAuthChange={handleAuthChange} />
                                </Box>
                            )}

                            {/* Step 2: Enter Sheet URL */}
                            {activeStep >= 1 && isAuthenticated && (
                                <Box sx={{ mb: 3 }}>
                                    <SheetUrlInput
                                        onSheetIdExtracted={handleSheetIdExtracted}
                                        disabled={isLoading}
                                    />
                                </Box>
                            )}

                            {/* Step 3: Select Sheet Tab */}
                            {activeStep >= 2 && sheets.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <SheetSelector
                                        sheets={sheets}
                                        selectedSheet={selectedSheet}
                                        onSheetSelect={handleSheetSelect}
                                        disabled={isLoading}
                                    />
                                </Box>
                            )}
                        </>
                    )}

                    {/* File Upload Flow */}
                    {importMode === 'file' && activeStep === 0 && (
                        <Box sx={{ mb: 3 }}>
                            <FileUpload
                                onDataLoaded={handleFileLoaded}
                                disabled={isLoading}
                            />
                        </Box>
                    )}

                    {/* Common: Preview Data */}
                    {activeStep >= getPreviewStep() && sheetData.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <SheetPreview
                                data={sheetData}
                                title={importMode === 'google' ? selectedSheet : fileName}
                                maxRows={10}
                                onHeaderRowChange={handleHeaderRowChange}
                                initialHeaderRow={headerRowIndex}
                            />

                            {/* Continue button to go to Map Columns */}
                            {activeStep === getPreviewStep() && activeStep < getMappingStep() && (
                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => setActiveStep(getMappingStep())}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Continue to Map Columns
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Common: Map Columns */}
                    {activeStep >= getMappingStep() && sheetData.length > 0 && sheetData[headerRowIndex] && (
                        <Box sx={{ mb: 3 }}>
                            <ColumnMapping
                                headers={sheetData[headerRowIndex]}
                                onMappingChange={handleMappingChange}
                                currentMapping={columnMapping}
                            />
                        </Box>
                    )}

                    {/* Common: Catalog Preview */}
                    {activeStep >= getCatalogStep() && sheetData.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <CatalogPreview
                                data={sheetData}
                                columnMapping={columnMapping}
                                maxRows={20}
                                headerRowIndex={headerRowIndex}
                            />
                        </Box>
                    )}

                    {/* Start Import Button */}
                    {activeStep >= getCatalogStep() && !isImporting && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayArrowIcon />}
                                onClick={handleStartImport}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    textTransform: 'none'
                                }}
                            >
                                Start Competitor Matching ({sheetData.length - 1} products)
                            </Button>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                This will invoke the Python backend to match competitors globally
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* Progress Dialog */}
            <Dialog
                open={showProgressDialog}
                maxWidth="md"
                fullWidth
                onClose={() => !isImporting && setShowProgressDialog(false)}
            >
                <DialogTitle>
                    Import Progress
                </DialogTitle>
                <DialogContent>
                    <ImportProgressIndicator progress={importProgress} />

                    {importProgress.status === 'complete' && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={() => setShowProgressDialog(false)}
                                sx={{ textTransform: 'none' }}
                            >
                                View Results
                            </Button>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
}
