import { UpcycleIdea, TutorialStep } from '../types';
import { supabase } from './supabase';

// ─── Profile ───────────────────────────────────────────────────────────────

export const upsertProfile = async (userId: string, email: string, fullName?: string) => {
    const { error } = await supabase
        .from('profiles')
        .upsert(
            {
                id: userId,
                email,
                full_name: fullName ?? null,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'id', ignoreDuplicates: false }
        );
    if (error) console.error('upsertProfile error:', error.message);
};

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) console.error('getProfile error:', error.message);
    return data;
};

export const incrementProfileStats = async (
    userId: string,
    delta: { eco_score?: number; items_saved?: number }
) => {
    // Fetch current values first then update
    const profile = await getProfile(userId);
    if (!profile) return;

    const { error } = await supabase
        .from('profiles')
        .update({
            eco_score: (profile.eco_score ?? 0) + (delta.eco_score ?? 0),
            items_saved: (profile.items_saved ?? 0) + (delta.items_saved ?? 0),
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    if (error) console.error('incrementProfileStats error:', error.message);
};

// ─── Idea History ──────────────────────────────────────────────────────────

export const saveIdeaToHistory = async (
    userId: string,
    idea: UpcycleIdea,
    scannedImageUrl?: string | null
) => {
    const { error } = await supabase.from('idea_history').upsert(
        {
            id: idea.id,
            user_id: userId,
            title: idea.title,
            description: idea.description,
            difficulty: idea.difficulty,
            estimated_time: idea.estimatedTime ?? null,
            preview_image_url: idea.previewImage ?? null,
            image_prompt: idea.imagePrompt ?? null,
            scanned_image_url: scannedImageUrl ?? null,
            accepted_at: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: true }
    );
    if (error) console.error('saveIdeaToHistory error:', error.message);
};

export const loadIdeaHistory = async (userId: string): Promise<UpcycleIdea[]> => {
    const { data, error } = await supabase
        .from('idea_history')
        .select('*')
        .eq('user_id', userId)
        .order('accepted_at', { ascending: false });

    if (error) {
        console.error('loadIdeaHistory error:', error.message);
        return [];
    }

    return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty as UpcycleIdea['difficulty'],
        previewImage: row.preview_image_url ?? '',
        estimatedTime: row.estimated_time ?? undefined,
        imagePrompt: row.image_prompt ?? undefined,
    }));
};

// ─── Generated Images ──────────────────────────────────────────────────────

export const saveGeneratedImage = async (
    userId: string,
    entityId: string,
    entityType: 'idea' | 'tutorial_step' | 'swap',
    imageUrl: string,
    prompt: string
) => {
    const { error } = await supabase.from('generated_images').upsert(
        {
            entity_id: entityId,
            entity_type: entityType,
            user_id: userId,
            image_url: imageUrl,
            prompt,
            created_at: new Date().toISOString(),
        },
        { onConflict: 'entity_id', ignoreDuplicates: true }
    );
    if (error) console.error('saveGeneratedImage error:', error.message);
};

export const getGeneratedImage = async (entityId: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('generated_images')
        .select('image_url')
        .eq('entity_id', entityId)
        .single();
    if (error) return null;
    return data?.image_url ?? null;
};

// ─── Tutorials ─────────────────────────────────────────────────────────────

export const saveTutorial = async (
    userId: string,
    ideaId: string,
    materials: string[],
    steps: TutorialStep[]
) => {
    const { error } = await supabase.from('tutorials').upsert(
        {
            idea_id: ideaId,
            user_id: userId,
            materials,
            steps: steps as any,
            created_at: new Date().toISOString(),
        },
        { onConflict: 'idea_id', ignoreDuplicates: true }
    );
    if (error) console.error('saveTutorial error:', error.message);
};

export const loadTutorial = async (
    userId: string,
    ideaId: string
): Promise<{ materials: string[]; steps: TutorialStep[] } | null> => {
    const { data, error } = await supabase
        .from('tutorials')
        .select('materials, steps')
        .eq('idea_id', ideaId)
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;
    return { materials: data.materials, steps: data.steps as TutorialStep[] };
};
