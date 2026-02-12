'use client';

import {
    Box,
    Paper,
    Typography,
    Chip,
    Alert
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';

interface CatalogPreviewProps {
    data: any[][];
    columnMapping: Record<string, any>;
    maxRows?: number;
}

// Convert column index to Excel-style letter (A, B, C, ... Z, AA, AB, etc.)
function getColumnLetter(index: number): string {
    let letter = '';
    let temp = index;
    while (temp >= 0) {
        letter = String.fromCharCode((temp % 26) + 65) + letter;
        temp = Math.floor(temp / 26) - 1;
    }
    return letter;
}

export default function CatalogPreview({ data, columnMapping, maxRows = 10 }: CatalogPreviewProps) {
    if (!data || data.length < 2) {
        return (
            <Paper sx={{ p: 3, border: '1px solid #30363d', textAlign: 'center' }}>
                <Typography color="text.secondary">No catalog data to preview</Typography>
            </Paper>
        );
    }

    const headers = data[0] as string[];
    const rows = data.slice(1, Math.min(maxRows + 1, data.length));
    const totalProducts = data.length - 1;
    const hasMore = totalProducts > maxRows;

    // Get mapped columns to highlight them
    const modelColumn = columnMapping.model as string;
    const specColumns = (columnMapping.specifications as string[]) || [];

    // Check if a column is mapped
    const isModelColumn = (header: string) => header === modelColumn;
    const isSpecColumn = (header: string) => specColumns.includes(header);
    const isMappedColumn = (header: string) => isModelColumn(header) || isSpecColumn(header);

    // Check if cell value looks like an image URL
    const isImageUrl = (value: any): boolean => {
        if (!value || typeof value !== 'string') return false;
        const lower = value.toLowerCase();
        return (lower.startsWith('http') || lower.startsWith('//')) &&
            (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') ||
                lower.includes('.gif') || lower.includes('.webp') || lower.includes('googleusercontent') ||
                lower.includes('drive.google'));
    };

    return (
        <Paper sx={{ border: '1px solid #30363d', bgcolor: '#161b22' }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#0d1117'
            }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#c9d1d9' }}>
                    <InventoryIcon sx={{ color: '#58a6ff' }} />
                    Review Catalog
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`${totalProducts} products ready to search`}
                        size="medium"
                        sx={{ bgcolor: 'rgba(35, 134, 54, 0.2)', color: '#238636', fontWeight: 600 }}
                    />
                </Box>
            </Box>

            <Alert
                severity="info"
                icon={<SearchIcon />}
                sx={{ m: 2, bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#c9d1d9' }}
            >
                Each product will be searched using the <strong>Model</strong> and <strong>Specifications</strong> you selected.
                The system will find technically equivalent competitor products worldwide.
            </Alert>

            {/* Full spreadsheet-style preview showing ALL columns */}
            <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Box sx={{ minWidth: 'max-content' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px',
                        fontFamily: 'monospace'
                    }}>
                        <thead>
                            {/* Column letters row (A, B, C...) */}
                            <tr style={{ backgroundColor: '#21262d' }}>
                                <th style={{
                                    padding: '6px 12px',
                                    borderRight: '1px solid #30363d',
                                    borderBottom: '1px solid #30363d',
                                    color: '#8b949e',
                                    fontWeight: 'normal',
                                    minWidth: '50px',
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: '#21262d',
                                    zIndex: 2
                                }}>
                                    #
                                </th>
                                {headers.map((_, colIndex) => (
                                    <th key={colIndex} style={{
                                        padding: '6px 12px',
                                        borderRight: '1px solid #30363d',
                                        borderBottom: '1px solid #30363d',
                                        color: '#8b949e',
                                        fontWeight: 'normal',
                                        textAlign: 'center',
                                        minWidth: '150px'
                                    }}>
                                        {getColumnLetter(colIndex)}
                                    </th>
                                ))}
                            </tr>
                            {/* Column headers row with mapping indicators */}
                            <tr style={{ backgroundColor: '#161b22' }}>
                                <th style={{
                                    padding: '8px 12px',
                                    borderRight: '1px solid #30363d',
                                    borderBottom: '2px solid #30363d',
                                    color: '#8b949e',
                                    fontWeight: 600,
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: '#161b22',
                                    zIndex: 2
                                }}>
                                </th>
                                {headers.map((header, colIndex) => (
                                    <th key={colIndex} style={{
                                        padding: '8px 12px',
                                        borderRight: '1px solid #30363d',
                                        borderBottom: '2px solid #30363d',
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        minWidth: '150px',
                                        backgroundColor: isMappedColumn(header)
                                            ? isModelColumn(header)
                                                ? 'rgba(88, 166, 255, 0.15)'
                                                : 'rgba(35, 134, 54, 0.15)'
                                            : '#161b22',
                                        color: isMappedColumn(header)
                                            ? isModelColumn(header)
                                                ? '#58a6ff'
                                                : '#238636'
                                            : '#c9d1d9'
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {isMappedColumn(header) && (
                                                <Chip
                                                    label={isModelColumn(header) ? 'MODEL' : 'SPEC'}
                                                    size="small"
                                                    sx={{
                                                        height: '18px',
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        bgcolor: isModelColumn(header) ? '#58a6ff' : '#238636',
                                                        color: 'white',
                                                        alignSelf: 'flex-start'
                                                    }}
                                                />
                                            )}
                                            <span style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '200px',
                                                display: 'block'
                                            }}>
                                                {header}
                                            </span>
                                        </Box>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    style={{
                                        backgroundColor: rowIndex % 2 === 0 ? '#0d1117' : '#161b22'
                                    }}
                                >
                                    <td style={{
                                        padding: '8px 12px',
                                        borderRight: '1px solid #30363d',
                                        borderBottom: '1px solid #30363d',
                                        color: '#8b949e',
                                        textAlign: 'center',
                                        position: 'sticky',
                                        left: 0,
                                        backgroundColor: rowIndex % 2 === 0 ? '#0d1117' : '#161b22',
                                        zIndex: 1
                                    }}>
                                        {rowIndex + 1}
                                    </td>
                                    {headers.map((header, colIndex) => {
                                        const cellValue = row[colIndex];
                                        const isImage = isImageUrl(cellValue);

                                        return (
                                            <td key={colIndex} style={{
                                                padding: '8px 12px',
                                                borderRight: '1px solid #30363d',
                                                borderBottom: '1px solid #30363d',
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                backgroundColor: isMappedColumn(header)
                                                    ? isModelColumn(header)
                                                        ? 'rgba(88, 166, 255, 0.05)'
                                                        : 'rgba(35, 134, 54, 0.05)'
                                                    : undefined,
                                                color: isModelColumn(header) ? '#58a6ff' : '#c9d1d9'
                                            }}>
                                                {isImage ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <img
                                                            src={cellValue}
                                                            alt="Product"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                objectFit: 'contain',
                                                                borderRadius: '4px',
                                                                backgroundColor: 'white'
                                                            }}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: '#6e7681',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            [Image]
                                                        </span>
                                                    </Box>
                                                ) : (
                                                    cellValue !== undefined && cellValue !== null
                                                        ? String(cellValue)
                                                        : <span style={{ color: '#484f58' }}>—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>

            {hasMore && (
                <Box sx={{ p: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#8b949e' }}>
                        Showing {rows.length} of {totalProducts} products (all will be processed)
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
