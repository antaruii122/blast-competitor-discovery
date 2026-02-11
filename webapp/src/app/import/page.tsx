'use client';

import { useState } from 'react';
import { Container, Typography, Box, Button, Stepper, Step, StepLabel, Alert } from '@mui/material';
import GoogleAuth from '@/components/GoogleAuth';
import SheetUrlInput from '@/components/SheetUrlInput';
import SheetSelector from '@/components/SheetSelector';
import SheetPreview from '@/components/SheetPreview';
import ColumnMapping from '@/components/ColumnMapping';
import { getSpreadsheetMetadata, readSpreadsheet, isUserSignedIn } from '@/lib/googleSheets/client';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const steps = ['Connect Google', 'Select Sheet', 'Preview Data', 'Map Columns', 'Start Import'];

export default function ImportPage() {
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

    // Step 1: Authentication
    const handleAuthChange = (authenticated: boolean) => {
        setIsAuthenticated(authenticated);
        if (authenticated && activeStep === 0) {
            setActiveStep(1);
        }
    };

    // Step 2: Load spreadsheet metadata
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

    // Step 3: Load sheet data
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

    // Step 4: Column mapping
    const handleMappingChange = (mapping: Record<string, string>) => {
        setColumnMapping(mapping);

        // Check if all required fields are mapped
        const requiredFields = ['product_name', 'category', 'specs_json'];
        const allMapped = requiredFields.every(field => mapping[field]);

        if (allMapped && activeStep === 3) {
            setActiveStep(4);
        }
    };

    // Step 5: Start import process
    const handleStartImport = async () => {
        console.log('[Import] Starting import with:', {
            spreadsheetId,
            selectedSheet,
            columnMapping,
            totalRows: sheetData.length - 1 // Exclude header
        });

        // TODO: Implement actual import logic in Phase 3
        alert('Import functionality will be implemented in Phase 3!');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> <Typography variant="h4" sx={{ mb: 3, color: '#c9d1d9' }}>
            Import Catalog from Google Sheets
        </Typography>

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

            {/* Step 4: Preview Data */}
            {activeStep >= 3 && sheetData.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <SheetPreview
                        data={sheetData}
                        title={selectedSheet}
                        maxRows={10}
                    />
                </Box>
            )}

            {/* Step 5: Map Columns */}
            {activeStep >= 3 && sheetData.length > 0 && sheetData[0] && (
                <Box sx={{ mb: 3 }}>
                    <ColumnMapping
                        headers={sheetData[0]}
                        onMappingChange={handleMappingChange}
                        currentMapping={columnMapping}
                    />
                </Box>
            )}

            {/* Step 6: Start Import */}
            {activeStep >= 4 && (
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
                        This will invoke the Python backend to match competitors
                    </Typography>
                </Box>
            )}
        </Container>
    );
}
