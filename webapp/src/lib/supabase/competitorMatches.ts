// Supabase functions for competitor matches
import { supabase } from '@/lib/supabase/client';
import { CompetitorMatch } from '@/components/CompetitorMatchTable';

export interface CompetitorMatchRow {
    id: string;
    my_product_id: string;
    competitor_brand: string;
    competitor_model: string;
    technical_parity_score: number;
    tier: string;
    spec_diffs: string;
    match_meta?: any;
    created_at?: string;
}

/**
 * Save approved competitor matches to Supabase
 * CRITICAL: Only called after user approval
 */
export async function saveCompetitorMatches(matches: CompetitorMatch[]): Promise<{
    success: boolean;
    error?: string;
    savedCount?: number;
}> {
    try {
        // Transform matches to Supabase format
        const rows: CompetitorMatchRow[] = matches.map(match => ({
            id: match.id,
            my_product_id: match.myProductId,
            competitor_brand: match.competitorBrand,
            competitor_model: match.competitorModel,
            technical_parity_score: match.technicalParityScore,
            tier: match.tier,
            spec_diffs: JSON.stringify(match.specDiffs),
            match_meta: match.matchMeta ? JSON.stringify(match.matchMeta) : null,
            created_at: new Date().toISOString()
        }));

        console.log('[Supabase] Saving', rows.length, 'competitor matches');

        // Insert into competitor_matches table
        const { data, error } = await supabase
            .from('competitor_matches')
            .insert(rows)
            .select();

        if (error) {
            console.error('[Supabase] Error saving matches:', error);
            throw new Error(error.message);
        }

        console.log('[Supabase] Successfully saved', data?.length || 0, 'matches');

        return {
            success: true,
            savedCount: data?.length || 0
        };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to save matches'
        };
    }
}

/**
 * Load competitor matches from Supabase
 */
export async function loadCompetitorMatches(filters?: {
    tier?: string;
    minScore?: number;
    brand?: string;
}): Promise<{
    success: boolean;
    matches?: CompetitorMatch[];
    error?: string;
}> {
    try {
        let query = supabase
            .from('competitor_matches')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters?.tier) {
            query = query.eq('tier', filters.tier);
        }
        if (filters?.minScore) {
            query = query.gte('technical_parity_score', filters.minScore);
        }
        if (filters?.brand) {
            query = query.ilike('competitor_brand', `%${filters.brand}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Supabase] Error loading matches:', error);
            throw new Error(error.message);
        }

        // Transform from Supabase format to CompetitorMatch format
        const matches: CompetitorMatch[] = (data || []).map(row => ({
            id: row.id,
            myProductId: row.my_product_id,
            myProductName: '', // Will need to join with products table
            competitorBrand: row.competitor_brand,
            competitorModel: row.competitor_model,
            technicalParityScore: row.technical_parity_score,
            tier: row.tier as 'A' | 'B' | 'C',
            specDiffs: JSON.parse(row.spec_diffs || '[]'),
            matchMeta: row.match_meta ? JSON.parse(row.match_meta) : undefined
        }));

        return {
            success: true,
            matches
        };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to load matches'
        };
    }
}

/**
 * Delete competitor matches
 */
export async function deleteCompetitorMatches(matchIds: string[]): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const { error } = await supabase
            .from('competitor_matches')
            .delete()
            .in('id', matchIds);

        if (error) {
            console.error('[Supabase] Error deleting matches:', error);
            throw new Error(error.message);
        }

        console.log('[Supabase] Deleted', matchIds.length, 'matches');

        return { success: true };

    } catch (error: any) {
        console.error('[Supabase] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete matches'
        };
    }
}
