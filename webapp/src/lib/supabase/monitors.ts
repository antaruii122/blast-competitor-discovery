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
