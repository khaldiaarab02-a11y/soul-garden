import { supabase, isSupabaseConfigured } from './supabaseClient';

// Every function below is a no-op (resolves quietly) when Supabase isn't
// configured, so guest mode never breaks and callers never need to branch
// on isSupabaseConfigured themselves.

export async function fetchRemoteJourney(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const [profileRes, checkInsRes, journalRes, exercisesRes, daysRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('check_ins').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('exercise_completions').select('exercise_id').eq('user_id', userId),
      supabase.from('journey_progress').select('day_id').eq('user_id', userId),
    ]);

    return {
      profile: profileRes.data || null,
      checkIns: (checkInsRes.data || []).map((r) => ({
        id: r.id,
        emotionId: r.emotion_id,
        intensity: r.intensity,
        note: r.note,
        date: r.created_at,
      })),
      journalEntries: (journalRes.data || []).map((r) => ({
        id: r.id,
        text: r.text,
        prompt: r.prompt,
        date: r.created_at,
      })),
      completedExercises: (exercisesRes.data || []).map((r) => r.exercise_id),
      completedDays: (daysRes.data || []).map((r) => r.day_id),
    };
  } catch (err) {
    console.warn('Soul Garden: fetchRemoteJourney failed, staying in local mode.', err);
    return null;
  }
}

export async function pushCheckIn(userId, { emotionId, intensity, note }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase.from('check_ins').insert({ user_id: userId, emotion_id: emotionId, intensity, note });
  } catch (err) {
    console.warn('Soul Garden: failed to sync check-in.', err);
  }
}

export async function pushJournalEntry(userId, { text, prompt }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase.from('journal_entries').insert({ user_id: userId, text, prompt });
  } catch (err) {
    console.warn('Soul Garden: failed to sync journal entry.', err);
  }
}

export async function pushExerciseCompletion(userId, { exerciseId, journeyId, dayId }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase
      .from('exercise_completions')
      .upsert({ user_id: userId, exercise_id: exerciseId, journey_id: journeyId, day_id: dayId }, { onConflict: 'user_id,exercise_id' });
  } catch (err) {
    console.warn('Soul Garden: failed to sync exercise completion.', err);
  }
}

export async function pushDayCompletion(userId, { journeyId, dayId }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase
      .from('journey_progress')
      .upsert({ user_id: userId, journey_id: journeyId, day_id: dayId }, { onConflict: 'user_id,day_id' });
  } catch (err) {
    console.warn('Soul Garden: failed to sync day completion.', err);
  }
}

export async function pushGardenState(userId, { stageId, percent }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase
      .from('garden_state')
      .upsert({ user_id: userId, stage_id: stageId, percent, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  } catch (err) {
    console.warn('Soul Garden: failed to sync garden state.', err);
  }
}

export async function fetchSettings(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle();
    return data;
  } catch (err) {
    console.warn('Soul Garden: failed to fetch settings.', err);
    return null;
  }
}

export async function pushSettings(userId, settings) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase.from('user_settings').upsert(
      {
        user_id: userId,
        audio_enabled: settings.audioEnabled,
        effects_enabled: settings.effectsEnabled,
        luna_enabled: settings.lunaEnabled,
        reduced_motion: settings.reducedMotion,
        large_text: settings.largeText,
        language: settings.language,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  } catch (err) {
    console.warn('Soul Garden: failed to sync settings.', err);
  }
}

export async function fetchInnerChild(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data } = await supabase.from('inner_child').select('*').eq('user_id', userId).maybeSingle();
    return data;
  } catch (err) {
    console.warn('Soul Garden: failed to fetch inner child.', err);
    return null;
  }
}

export async function pushInnerChild(userId, { name, relationshipStage, interactionsCount }) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase.from('inner_child').upsert(
      {
        user_id: userId,
        name,
        relationship_stage: relationshipStage,
        interactions_count: interactionsCount,
        last_interaction_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  } catch (err) {
    console.warn('Soul Garden: failed to sync inner child.', err);
  }
}

export async function pushAchievement(userId, achievementId) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase
      .from('achievements')
      .upsert({ user_id: userId, achievement_id: achievementId }, { onConflict: 'user_id,achievement_id' });
  } catch (err) {
    console.warn('Soul Garden: failed to sync achievement.', err);
  }
}

export async function fetchAchievements(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data } = await supabase.from('achievements').select('achievement_id').eq('user_id', userId);
    return (data || []).map((r) => r.achievement_id);
  } catch (err) {
    console.warn('Soul Garden: failed to fetch achievements.', err);
    return [];
  }
}

export async function deleteAllUserData(userId) {
  if (!isSupabaseConfigured || !userId) return { ok: false, reason: 'not-configured' };
  try {
    await Promise.all([
      supabase.from('check_ins').delete().eq('user_id', userId),
      supabase.from('journal_entries').delete().eq('user_id', userId),
      supabase.from('exercise_completions').delete().eq('user_id', userId),
      supabase.from('journey_progress').delete().eq('user_id', userId),
      supabase.from('garden_state').delete().eq('user_id', userId),
      supabase.from('achievements').delete().eq('user_id', userId),
      supabase.from('inner_child').delete().eq('user_id', userId),
    ]);
    return { ok: true };
  } catch (err) {
    console.warn('Soul Garden: failed to delete user data.', err);
    return { ok: false, reason: 'error' };
  }
}
