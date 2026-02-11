'use client';

import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Alert
} from '@mui/material';
import MappingIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

interface ColumnMappingProps {
    headers: string[];
    onMappingChange: (mapping: Record<string, string>) => void;
    currentMapping?: Record<string, string>;
}

// Expected columns for our catalog
const REQUIRED_FIELDS = [
    { key: 'product_name', label: 'Product Name', required: true },
    { key: 'category', label: 'Category', required: true },
    { key: 'brand', label: 'Brand', required: false },
    { key: 'model', label: 'Model', required: false },
    { key: 'specs_json', label: 'Specifications (JSON)', required: true },
];

export default function ColumnMapping({
    headers,
    onMappingChange,
    currentMapping = {}
}: ColumnMappingProps) {
    const [mapping, setMapping] = React.useState<Record<string, string>>(currentMapping);

    const handleMappingChange = (field: string, column: string) => {
        const newMapping = { ...mapping, [field]: column };
        setMapping(newMapping);
        onMappingChange(newMapping);
    };

    // Auto-detect columns based on header names
    React.useEffect(() => {
        if (Object.keys(currentMapping).length === 0 && headers.length > 0) {
            const autoMapping: Record<string, string> = {};

            REQUIRED_FIELDS.forEach(field => {
                const match = headers.find(h =>
                    h.toLowerCase().includes(field.key.toLowerCase()) ||
                    h.toLowerCase().includes(field.label.toLowerCase())
                );
                if (match) {
                    autoMapping[field.key] = match;
                }
            });

            if (Object.keys(autoMapping).length > 0) {
                setMapping(autoMapping);
                onMappingChange(autoMapping);
            }
        }
    }, [headers]);

    const requiredFieldsFilled = REQUIRED_FIELDS
        .filter(f => f.required)
        .every(f => mapping[f.key]);

    const mappedColumns = Object.values(mapping);
    const unmappedHeaders = headers.filter(h => !mappedColumns.includes(h));

    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MappingIcon />
                Map Columns
            </Typography>

            {!requiredFieldsFilled && (
                <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
                    Please map all required fields to continue
                </Alert>
            )}

            {requiredFieldsFilled && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    All required fields mapped!
                </Alert>
            )}

            <Grid container spacing={2}>
                {REQUIRED_FIELDS.map((field) => (
                    <Grid item xs={12} md={6} key={field.key}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {field.label} {field.required && '*'}
                            </InputLabel>
                            <Select
                                value={mapping[field.key] || ''}
                                label={`${field.label} ${field.required ? '*' : ''}`}
                                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>-- Select Column --</em>
                                </MenuItem>
                                {headers.map((header, index) => (
                                    <MenuItem key={index} value={header}>
                                        {header}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                ))}
            </Grid>

            {unmappedHeaders.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Unmapped Columns ({unmappedHeaders.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {unmappedHeaders.map((header, index) => (
                            <Chip
                                key={index}
                                label={header}
                                size="small"
                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Paper>
    );
}
