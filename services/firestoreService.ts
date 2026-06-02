import { supabase } from '../src/config/supabase';
import {
  Partner,
  Trait,
  Preference,
  InteractionLog,
  RelationshipType,
} from '../types';

type Row = Record<string, any>;

type ChecklistItem = { id: string; label: string; isCompleted: boolean };

// ---------------------------------------------------------------------------
// Row <-> domain mappers
// ---------------------------------------------------------------------------

const traitFromRow = (row: Row): Trait => ({
  id: row.id,
  partnerId: row.partner_id,
  name: row.name,
  isPrimary: row.is_primary,
});

const preferenceFromRow = (row: Row): Preference => ({
  id: row.id,
  partnerId: row.partner_id,
  label: row.label,
  isLove: row.is_love,
});

const logFromRow = (row: Row): InteractionLog => ({
  id: row.id,
  partnerId: row.partner_id,
  timestamp: Number(row.timestamp_ms),
  type: row.type,
  description: row.description,
  compassionDelta: row.compassion_delta,
});

const partnerFromRow = (
  row: Row,
  traits: Trait[],
  preferences: Preference[],
  logs: InteractionLog[]
): Partner => ({
  id: row.id,
  userId: row.user_id,
  dexNumber: row.dex_number,
  name: row.name,
  category: row.category,
  flavorText: row.flavor_text,
  totalCompassion: row.total_compassion,
  currentCompassion: row.current_compassion,
  relationshipType: row.relationship_type as RelationshipType,
  meetingLocation: row.meeting_location,
  redFlags: row.red_flags,
  greenFlags: row.green_flags,
  notes: row.notes,
  spriteUrl: row.sprite_url,
  sprites: row.sprites,
  status: row.status,
  stats: row.stats,
  evolutionPath: row.evolution_path,
  effectiveness: row.effectiveness,
  traits,
  preferences,
  hiddenSkill: row.hidden_skill,
  dateChecklist: row.date_checklist ?? [],
  interactionLog: logs,
  compatibility: row.compatibility ?? undefined,
});

// Maps the scalar/JSONB columns of a Partner to DB columns. Relational fields
// (traits, preferences, interactionLog) and id are handled separately.
const partnerToRow = (partner: Partial<Partner>): Row => {
  const row: Row = {};
  const set = (key: string, value: unknown) => {
    if (value !== undefined) row[key] = value;
  };
  set('user_id', partner.userId);
  set('dex_number', partner.dexNumber);
  set('name', partner.name);
  set('category', partner.category);
  set('flavor_text', partner.flavorText);
  set('total_compassion', partner.totalCompassion);
  set('current_compassion', partner.currentCompassion);
  set('relationship_type', partner.relationshipType);
  set('meeting_location', partner.meetingLocation);
  set('red_flags', partner.redFlags);
  set('green_flags', partner.greenFlags);
  set('notes', partner.notes);
  set('sprite_url', partner.spriteUrl);
  set('sprites', partner.sprites);
  set('status', partner.status);
  set('stats', partner.stats);
  set('evolution_path', partner.evolutionPath);
  set('effectiveness', partner.effectiveness);
  set('hidden_skill', partner.hiddenSkill);
  set('date_checklist', partner.dateChecklist);
  set('compatibility', partner.compatibility);
  return row;
};

const PARTNER_SELECT = '*, traits(*), preferences(*), interaction_logs(*)';

const assemblePartner = (row: Row): Partner => {
  const traits = (row.traits ?? []).map(traitFromRow);
  const preferences = (row.preferences ?? []).map(preferenceFromRow);
  const logs = (row.interaction_logs ?? [])
    .map(logFromRow)
    .sort((a: InteractionLog, b: InteractionLog) => b.timestamp - a.timestamp);
  return partnerFromRow(row, traits, preferences, logs);
};

// ---------------------------------------------------------------------------
// Partner CRUD
// ---------------------------------------------------------------------------

export const createPartner = async (userId: string, partnerData: Omit<Partner, 'id'>): Promise<string> => {
  const row = partnerToRow({ ...partnerData, userId });
  const { data, error } = await supabase
    .from('partners')
    .insert(row)
    .select('id')
    .single();
  if (error) {
    console.error('Error creating partner:', error);
    throw new Error(error.message);
  }
  const partnerId = data.id as string;

  const traitRows = (partnerData.traits ?? []).map((t) => ({
    partner_id: partnerId,
    name: t.name,
    is_primary: t.isPrimary,
  }));
  const prefRows = (partnerData.preferences ?? []).map((p) => ({
    partner_id: partnerId,
    label: p.label,
    is_love: p.isLove,
  }));

  if (traitRows.length > 0) {
    const { error: tErr } = await supabase.from('traits').insert(traitRows);
    if (tErr) throw new Error(tErr.message);
  }
  if (prefRows.length > 0) {
    const { error: pErr } = await supabase.from('preferences').insert(prefRows);
    if (pErr) throw new Error(pErr.message);
  }

  return partnerId;
};

export const getPartners = async (userId: string): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select(PARTNER_SELECT)
    .eq('user_id', userId);
  if (error) {
    console.error('Error getting partners:', error);
    throw new Error(error.message);
  }
  return (data ?? []).map(assemblePartner);
};

export const getPartner = async (partnerId: string): Promise<Partner | null> => {
  const { data, error } = await supabase
    .from('partners')
    .select(PARTNER_SELECT)
    .eq('id', partnerId)
    .maybeSingle();
  if (error) {
    console.error('Error getting partner:', error);
    throw new Error(error.message);
  }
  return data ? assemblePartner(data) : null;
};

export const updatePartner = async (partnerId: string, updates: Partial<Partner>): Promise<void> => {
  const row = partnerToRow(updates);
  row.updated_at = new Date().toISOString();
  const { error } = await supabase.from('partners').update(row).eq('id', partnerId);
  if (error) {
    console.error('Error updating partner:', error);
    throw new Error(error.message);
  }
};

export const deletePartner = async (partnerId: string): Promise<void> => {
  // Child rows (traits, preferences, interaction_logs) cascade via FK.
  const { error } = await supabase.from('partners').delete().eq('id', partnerId);
  if (error) {
    console.error('Error deleting partner:', error);
    throw new Error(error.message);
  }
};

export const deleteUserData = async (userId: string): Promise<void> => {
  // Child rows cascade via FK when the partner rows are deleted.
  const { error } = await supabase.from('partners').delete().eq('user_id', userId);
  if (error) {
    console.error('Error deleting user data:', error);
    throw new Error(error.message);
  }
};

// ---------------------------------------------------------------------------
// Traits
// ---------------------------------------------------------------------------

export const addTrait = async (partnerId: string, trait: Omit<Trait, 'id'>): Promise<string> => {
  const { data, error } = await supabase
    .from('traits')
    .insert({ partner_id: partnerId, name: trait.name, is_primary: trait.isPrimary })
    .select('id')
    .single();
  if (error) {
    console.error('Error adding trait:', error);
    throw new Error(error.message);
  }
  return data.id as string;
};

export const getTraits = async (partnerId: string): Promise<Trait[]> => {
  const { data, error } = await supabase.from('traits').select('*').eq('partner_id', partnerId);
  if (error) {
    console.error('Error getting traits:', error);
    return [];
  }
  return (data ?? []).map(traitFromRow);
};

export const updateTrait = async (partnerId: string, traitId: string, updates: Partial<Trait>): Promise<void> => {
  const row: Row = {};
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.isPrimary !== undefined) row.is_primary = updates.isPrimary;
  const { error } = await supabase
    .from('traits')
    .update(row)
    .eq('id', traitId)
    .eq('partner_id', partnerId);
  if (error) {
    console.error('Error updating trait:', error);
    throw new Error(error.message);
  }
};

export const deleteTrait = async (partnerId: string, traitId: string): Promise<void> => {
  const { error } = await supabase
    .from('traits')
    .delete()
    .eq('id', traitId)
    .eq('partner_id', partnerId);
  if (error) {
    console.error('Error deleting trait:', error);
    throw new Error(error.message);
  }
};

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export const addPreference = async (partnerId: string, preference: Omit<Preference, 'id'>): Promise<string> => {
  const { data, error } = await supabase
    .from('preferences')
    .insert({ partner_id: partnerId, label: preference.label, is_love: preference.isLove })
    .select('id')
    .single();
  if (error) {
    console.error('Error adding preference:', error);
    throw new Error(error.message);
  }
  return data.id as string;
};

export const getPreferences = async (partnerId: string): Promise<Preference[]> => {
  const { data, error } = await supabase.from('preferences').select('*').eq('partner_id', partnerId);
  if (error) {
    console.error('Error getting preferences:', error);
    return [];
  }
  return (data ?? []).map(preferenceFromRow);
};

export const deletePreference = async (partnerId: string, preferenceId: string): Promise<void> => {
  const { error } = await supabase
    .from('preferences')
    .delete()
    .eq('id', preferenceId)
    .eq('partner_id', partnerId);
  if (error) {
    console.error('Error deleting preference:', error);
    throw new Error(error.message);
  }
};

// ---------------------------------------------------------------------------
// Checklist (stored in the partners.date_checklist JSONB column)
// ---------------------------------------------------------------------------

const readChecklist = async (partnerId: string): Promise<ChecklistItem[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('date_checklist')
    .eq('id', partnerId)
    .single();
  if (error) {
    console.error('Error reading checklist:', error);
    throw new Error(error.message);
  }
  return (data.date_checklist ?? []) as ChecklistItem[];
};

const writeChecklist = async (partnerId: string, checklist: ChecklistItem[]): Promise<void> => {
  const { error } = await supabase
    .from('partners')
    .update({ date_checklist: checklist, updated_at: new Date().toISOString() })
    .eq('id', partnerId);
  if (error) {
    console.error('Error writing checklist:', error);
    throw new Error(error.message);
  }
};

export const addChecklistItem = async (
  partnerId: string,
  item: { label: string; isCompleted: boolean; order: number }
): Promise<string> => {
  const checklist = await readChecklist(partnerId);
  const id = crypto.randomUUID();
  checklist.push({ id, label: item.label, isCompleted: item.isCompleted });
  await writeChecklist(partnerId, checklist);
  return id;
};

export const updateChecklistItem = async (
  partnerId: string,
  itemId: string,
  updates: { label?: string; isCompleted?: boolean }
): Promise<void> => {
  const checklist = await readChecklist(partnerId);
  const next = checklist.map((c) =>
    c.id === itemId
      ? {
          ...c,
          ...(updates.label !== undefined ? { label: updates.label } : {}),
          ...(updates.isCompleted !== undefined ? { isCompleted: updates.isCompleted } : {}),
        }
      : c
  );
  await writeChecklist(partnerId, next);
};

export const deleteChecklistItem = async (partnerId: string, itemId: string): Promise<void> => {
  const checklist = await readChecklist(partnerId);
  await writeChecklist(partnerId, checklist.filter((c) => c.id !== itemId));
};

// ---------------------------------------------------------------------------
// Interaction logs
// ---------------------------------------------------------------------------

export const addInteractionLog = async (partnerId: string, log: Omit<InteractionLog, 'id'>): Promise<string> => {
  const { data, error } = await supabase
    .from('interaction_logs')
    .insert({
      partner_id: partnerId,
      timestamp_ms: log.timestamp,
      type: log.type,
      description: log.description,
      compassion_delta: log.compassionDelta,
    })
    .select('id')
    .single();
  if (error) {
    console.error('Error adding interaction log:', error);
    throw new Error(error.message);
  }
  return data.id as string;
};

export const getInteractionLogs = async (partnerId: string): Promise<InteractionLog[]> => {
  const { data, error } = await supabase
    .from('interaction_logs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('timestamp_ms', { ascending: false });
  if (error) {
    console.error('Error getting interaction logs:', error);
    return [];
  }
  return (data ?? []).map(logFromRow);
};

// ---------------------------------------------------------------------------
// Real-time subscriptions
// ---------------------------------------------------------------------------

export const subscribeToPartners = (userId: string, callback: (partners: Partner[]) => void): () => void => {
  const refetch = () => {
    getPartners(userId).then(callback).catch((err) => console.error('Error refetching partners:', err));
  };

  // Initial load.
  refetch();

  const channel = supabase
    .channel(`partners-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'partners', filter: `user_id=eq.${userId}` }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'traits' }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'preferences' }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'interaction_logs' }, refetch)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToPartner = (partnerId: string, callback: (partner: Partner | null) => void): () => void => {
  const refetch = () => {
    getPartner(partnerId).then(callback).catch((err) => console.error('Error refetching partner:', err));
  };

  // Initial load.
  refetch();

  const channel = supabase
    .channel(`partner-${partnerId}`)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'partners', filter: `id=eq.${partnerId}` }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'traits', filter: `partner_id=eq.${partnerId}` }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'preferences', filter: `partner_id=eq.${partnerId}` }, refetch)
    .on('postgres_changes', { event: '*', schema: 'heartless', table: 'interaction_logs', filter: `partner_id=eq.${partnerId}` }, refetch)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
