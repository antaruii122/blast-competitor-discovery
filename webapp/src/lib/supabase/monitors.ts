// Supabase functions for monitors comparison
import { supabase } from '@/lib/supabase/client';

export interface MonitorComparisonRow {
    id: string;
    your_sku: string;
    competitor_brand: string;
    competitor_sku: string;
    competitor_url?: string;
    created_at?: string;
}

export interface RegionalMonitorRow {
    id: string;
    your_sku: string;
    competitor_sku: string;
    competitor_brand: string;
    country: string;
    retailer_name: string;
    price: number | null;
    available: boolean;
    product_page_url: string | null;
    created_at: string;
}

export interface RegionalHierarchy {
    [country: string]: string[];
}

/**
 * Load monitor comparisons from Supabase
 */
export async function loadMonitorComparisons(filters?: {
    brand?: string;
    yourSku?: string;
}): Promise<{
    success: boolean;
    data?: MonitorComparisonRow[];
    error?: string;
}> {
    try {
        let query = supabase
            .from('monitors_comparison')
            .select('id, your_sku, competitor_brand, competitor_sku, competitor_url, created_at')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters?.brand) {
            query = query.ilike('competitor_brand', `%${filters.brand}%`);
        }
        if (filters?.yourSku) {
            query = query.ilike('your_sku', `%${filters.yourSku}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Supabase] Error loading monitors comparison:', error);
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data as MonitorComparisonRow[]
        };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to load monitors comparison'
        };
    }
}

/**
 * Load regional hierarchy (Country -> Retailers) from Supabase
 */
export async function loadRegionalHierarchy(): Promise<{
    success: boolean;
    data?: RegionalHierarchy;
    error?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('monitors_regional')
            .select('country, retailer_name');

        if (error) {
            console.error('[Supabase] Error loading regional hierarchy:', error);
            throw new Error(error.message);
        }

        const hierarchy: { [key: string]: Set<string> } = {};
        data?.forEach(item => {
            if (item.country) {
                if (!hierarchy[item.country]) {
                    hierarchy[item.country] = new Set();
                }
                if (item.retailer_name) {
                    hierarchy[item.country].add(item.retailer_name);
                }
            }
        });

        const result: RegionalHierarchy = {};
        for (const country in hierarchy) {
            result[country] = Array.from(hierarchy[country]).sort();
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to load regional hierarchy'
        };
    }
}

/**
 * Load regional monitor data for a specific country and retailer
 */
export async function loadRegionalMonitors(country: string, retailer: string): Promise<{
    success: boolean;
    data?: RegionalMonitorRow[];
    error?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('monitors_regional')
            .select('*')
            .eq('country', country)
            .eq('retailer_name', retailer)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`[Supabase] Error loading regional monitors for ${retailer}:`, error);
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data as RegionalMonitorRow[]
        };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to load regional monitor data'
        };
    }
}
