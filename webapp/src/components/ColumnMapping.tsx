'use client';

import React from 'react';

import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Checkbox,
    ListItemText,
    OutlinedInput
} from '@mui/material';
import MappingIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';

interface ColumnMappingProps {
    headers: string[];
    onMappingChange: (mapping: Record<string, string | string[]>) => void;
    currentMapping?: Record<string, string | string[]>;
}

export default function ColumnMapping({
    headers,
    onMappingChange,
    currentMapping = {}
}: ColumnMappingProps) {
    const [modelColumn, setModelColumn] = React.useState<string>(
        (currentMapping.model as string) || ''
    );
    const [specColumns, setSpecColumns] = React.useState<string[]>(
        (currentMapping.specifications as string[]) || []
    );

    // Auto-detect columns based on header names
    React.useEffect(() => {
        if (headers.length > 0 && !modelColumn && specColumns.length === 0) {
            // Try to auto-detect model column
            const modelMatch = headers.find(h =>
                h.toLowerCase().includes('model') ||
                h.toLowerCase().includes('modelo') ||
                h.toLowerCase().includes('sku') ||
                h.toLowerCase().includes('part')
            );
            if (modelMatch) {
                setModelColumn(modelMatch);
            }

            // Try to auto-detect spec columns
            const specMatches = headers.filter(h =>
                h.toLowerCase().includes('spec') ||
                h.toLowerCase().includes('description') ||
                h.toLowerCase().includes('detail') ||
                h.toLowerCase().includes('feature') ||
                h.toLowerCase().includes('característica')
            );
            if (specMatches.length > 0) {
                setSpecColumns(specMatches);
            }
        }
    }, [headers, modelColumn, specColumns.length]);

    // Notify parent when mapping changes
    React.useEffect(() => {
        onMappingChange({
            model: modelColumn,
            specifications: specColumns
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelColumn, specColumns]);

    const isValid = modelColumn && specColumns.length > 0;

    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d', bgcolor: '#161b22' }}>
            <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#c9d1d9' }}>
                <MappingIcon sx={{ color: '#58a6ff' }} />
                Map Columns for Search
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#8b949e' }}>
                Select which columns contain the product model and specifications to search for competitors
            </Typography>

            {!isValid && (
                <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
                    Please select the Model column and at least one Specifications column
                </Alert>
            )}

            {isValid && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                    Ready to search! Model and specifications columns selected.
                </Alert>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Model Column Selector */}
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#8b949e' }}>
                        Model Column *
                    </InputLabel>
                    <Select
                        value={modelColumn}
                        label="Model Column *"
                        onChange={(e) => setModelColumn(e.target.value)}
                        sx={{
                            bgcolor: '#0d1117',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#30363d' },
                            '& .MuiSelect-select': { color: '#c9d1d9' }
                        }}
                    >
                        <MenuItem value="">
                            <em>-- Select Model Column --</em>
                        </MenuItem>
                        {headers.map((header, index) => (
                            <MenuItem key={index} value={header}>
                                {header}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="caption" sx={{ mt: 0.5, color: '#6e7681' }}>
                        The column containing product model/SKU to search
                    </Typography>
                </FormControl>

                {/* Specifications Columns Selector (Multi-select) */}
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#8b949e' }}>
                        Specifications Columns *
                    </InputLabel>
                    <Select
                        multiple
                        value={specColumns}
                        onChange={(e) => setSpecColumns(e.target.value as string[])}
                        input={<OutlinedInput label="Specifications Columns *" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{ bgcolor: '#238636', color: 'white' }}
                                    />
                                ))}
                            </Box>
                        )}
                        sx={{
                            bgcolor: '#0d1117',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#30363d' },
                        }}
                    >
                        {headers.map((header) => (
                            <MenuItem key={header} value={header}>
                                <Checkbox checked={specColumns.includes(header)} />
                                <ListItemText primary={header} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="caption" sx={{ mt: 0.5, color: '#6e7681' }}>
                        Select columns containing product specifications (can select multiple)
                    </Typography>
                </FormControl>
            </Box>

            {/* Preview of what will be searched */}
            {isValid && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#0d1117', borderRadius: 1, border: '1px solid #30363d' }}>
                    <Typography variant="subtitle2" sx={{ color: '#58a6ff', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <SearchIcon fontSize="small" />
                        Search Preview
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b949e' }}>
                        Will search competitors using: <strong style={{ color: '#c9d1d9' }}>{modelColumn}</strong> + specifications from{' '}
                        <strong style={{ color: '#c9d1d9' }}>{specColumns.join(', ')}</strong>
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
