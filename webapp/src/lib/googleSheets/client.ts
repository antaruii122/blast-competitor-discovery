// Google Sheets Service - Core Functions
// Adapted from ESGAMING project for B.L.A.S.T. Intelligence

export const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
].join(' ');

const TOKEN_STORAGE_KEY = 'google_auth_token';
const TOKEN_EXPIRY_KEY = 'google_auth_expiry';
const USER_INFO_KEY = 'google_user_info';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

let accessToken: string | null = null;

export interface UserInfo {
    email: string;
    name?: string;
    picture?: string;
}

export const setAccessToken = (token: string, userInfo?: UserInfo) => {
    accessToken = token;
    const expiryTime = Date.now() + SESSION_DURATION;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    if (userInfo) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    }

    console.log('[GoogleAPI] Access token set and stored (expires in 7 days)');
};

export const getAccessToken = (): string | null => {
    if (accessToken) {
        return accessToken;
    }

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (storedToken && expiryTime) {
        if (Date.now() < parseInt(expiryTime)) {
            accessToken = storedToken;
            console.log('[GoogleAPI] Access token restored from storage');
            return accessToken;
        } else {
            console.log('[GoogleAPI] Stored token expired, clearing');
            clearStoredAuth();
        }
    }

    return null;
};

export const getStoredUserInfo = (): UserInfo | null => {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (userInfoStr) {
        try {
            return JSON.parse(userInfoStr);
        } catch (e) {
            console.error('[GoogleAPI] Failed to parse stored user info:', e);
            return null;
        }
    }
    return null;
};

export const isUserSignedIn = (): boolean => {
    return getAccessToken() !== null;
};

const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_INFO_KEY);
};

export const signOut = () => {
    accessToken = null;
    clearStoredAuth();
    console.log('[GoogleAPI] Signed out and cleared stored credentials');
};

const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('Not authenticated. Please sign in first.');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API request failed: ${response.statusText}`);
    }

    return response.json();
};

export interface SpreadsheetData {
    range: string;
    majorDimension: string;
    values: any[][];
    rowCount: number;
    columnCount: number;
}

export const readSpreadsheet = async (
    spreadsheetId: string,
    range?: string
): Promise<SpreadsheetData> => {
    try {
        if (!spreadsheetId) {
            throw new Error('Spreadsheet ID is required');
        }

        console.log(`[GoogleAPI] Reading spreadsheet ${spreadsheetId}${range ? ` (${range})` : ''}...`);

        let targetRange = range;
        if (!targetRange) {
            const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
            const metadata = await makeAuthenticatedRequest(metadataUrl);

            const firstSheet = metadata.sheets?.[0];
            if (!firstSheet) {
                throw new Error('No sheets found in spreadsheet');
            }

            targetRange = firstSheet.properties.title;
            console.log(`[GoogleAPI] Using first sheet: ${targetRange}`);
        }

        if (!targetRange) {
            throw new Error('Could not determine target range');
        }

        const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetRange)}`;
        const data = await makeAuthenticatedRequest(dataUrl);

        const values = data.values || [];
        console.log(`[GoogleAPI] Read ${values.length} row(s) from spreadsheet`);

        return {
            range: data.range || '',
            majorDimension: data.majorDimension || 'ROWS',
            values: values,
            rowCount: values.length,
            columnCount: values.length > 0 ? Math.max(...values.map((row: any[]) => row.length)) : 0
        };
    } catch (error: any) {
        console.error('[GoogleAPI] Error reading spreadsheet:', error);

        if (error.message.includes('401')) {
            throw new Error('Authentication expired. Please sign in again.');
        } else if (error.message.includes('403')) {
            throw new Error('Permission denied. Please grant Sheets access.');
        } else if (error.message.includes('404')) {
            throw new Error('Spreadsheet not found. Check the spreadsheet ID.');
        } else {
            throw new Error(`Failed to read spreadsheet: ${error.message}`);
        }
    }
};

export interface SheetMetadata {
    id: string;
    title: string;
    locale: string;
    timeZone: string;
    sheets: Array<{
        id: number;
        title: string;
        index: number;
        rowCount: number;
        columnCount: number;
    }>;
}

export const getSpreadsheetMetadata = async (spreadsheetId: string): Promise<SheetMetadata> => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
        const spreadsheet = await makeAuthenticatedRequest(url);

        return {
            id: spreadsheet.spreadsheetId,
            title: spreadsheet.properties.title,
            locale: spreadsheet.properties.locale,
            timeZone: spreadsheet.properties.timeZone,
            sheets: spreadsheet.sheets.map((sheet: any) => ({
                id: sheet.properties.sheetId,
                title: sheet.properties.title,
                index: sheet.properties.index,
                rowCount: sheet.properties.gridProperties.rowCount,
                columnCount: sheet.properties.gridProperties.columnCount
            }))
        };
    } catch (error: any) {
        console.error('[GoogleAPI] Error getting spreadsheet metadata:', error);
        throw new Error(`Failed to get spreadsheet metadata: ${error.message}`);
    }
};

// Extract spreadsheet ID from a Google Sheets URL
export const extractSpreadsheetId = (url: string): string | null => {
    const patterns = [
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        /^([a-zA-Z0-9-_]+)$/  // Just the ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
};
