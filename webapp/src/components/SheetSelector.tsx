'use client';

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
    Chip
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';

interface Sheet {
    id: number;
    title: string;
    index: number;
    rowCount: number;
    columnCount: number;
}

interface SheetSelectorProps {
    sheets: Sheet[];
    selectedSheet: string;
    onSheetSelect: (sheetTitle: string) => void;
    disabled?: boolean;
}

export default function SheetSelector({
    sheets,
    selectedSheet,
    onSheetSelect,
    disabled
}: SheetSelectorProps) {
    return (
        <Paper sx={{ p: 3, border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChartIcon />
                Select Sheet Tab
            </Typography>

            <FormControl fullWidth disabled={disabled}>
                <InputLabel>Sheet</InputLabel>
                <Select
                    value={selectedSheet}
                    label="Sheet"
                    onChange={(e) => onSheetSelect(e.target.value)}
                >
                    {sheets.map((sheet) => (
                        <MenuItem key={sheet.id} value={sheet.title}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Typography>{sheet.title}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        label={`${sheet.rowCount} rows`}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}
                                    />
                                    <Chip
                                        label={`${sheet.columnCount} cols`}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(35, 134, 54, 0.1)', color: '#238636' }}
                                    />
                                </Box>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {sheets.length > 1 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    This spreadsheet has {sheets.length} tabs. Select the one containing your catalog data.
                </Typography>
            )}
        </Paper>
    );
}
