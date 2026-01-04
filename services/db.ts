
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  MOCK_USERS, MOCK_CLIENTS, MOCK_TASKS, MOCK_CAMPAIGNS, MOCK_IDEAS, 
  MOCK_LEAVES, MOCK_ATTENDANCE, MOCK_HOLIDAYS, MOCK_TARGETS, MOCK_OVERTIME 
} from '../constants';
import { KEYS, loadData as loadLocal, saveData as saveLocal } from './storage';

// Table names mapping
const TABLES = {
  [KEYS.USERS]: 'users',
  [KEYS.CLIENTS]: 'clients',
  [KEYS.TASKS]: 'tasks',
  [KEYS.CAMPAIGNS]: 'campaigns',
  [KEYS.IDEAS]: 'ideas',
  [KEYS.LEAVES]: 'leaves',
  [KEYS.ATTENDANCE]: 'attendance',
  [KEYS.HOLIDAYS]: 'holidays',
  [KEYS.OVERTIME]: 'overtime',
  [KEYS.TARGETS]: 'targets',
};

// Generic DB Load
export const fetchCollection = async <T>(key: string, fallback: T): Promise<T> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const tableName = TABLES[key];
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        console.error(`Supabase error fetching ${tableName}:`, error);
        return fallback;
      }

      // If table is empty, return fallback (first time run)
      if (!data || data.length === 0) {
        return fallback; 
      }

      // Supabase stores as rows { id: '...', data: { ...actualObject } }
      // We need to unwrap the 'data' column
      const unwrapped = data.map(row => row.data);
      return unwrapped as unknown as T;

    } catch (err) {
      console.error("DB Fetch Error", err);
      return fallback;
    }
  } else {
    // Fallback to Local Storage
    return loadLocal(key, fallback);
  }
};

// Generic DB Save (Insert/Upsert)
// We save the entire collection state. In a real highly scalable app, we'd save individual rows.
// For this size, syncing the array is safer and easier to implement.
export const persistCollection = async <T extends { id: string }[]>(key: string, data: T) => {
  if (isSupabaseConfigured && supabase) {
    const tableName = TABLES[key];
    
    // 1. Prepare rows
    const rows = data.map(item => ({
      id: item.id,
      data: item
    }));

    // 2. Upsert (Insert or Update)
    const { error } = await supabase.from(tableName).upsert(rows);
    
    if (error) {
      console.error(`Supabase error saving ${tableName}:`, error);
    }
    
    // OPTIONAL: Delete items that are no longer in the list?
    // For simplicity in this version, we are doing upserts. 
    // Deletions would require a separate logic, but usually we just mark status='deleted'
  } else {
    saveLocal(key, data);
  }
};

// Specific Delete function for Supabase since Upsert won't remove rows
export const removeItem = async (key: string, id: string) => {
  if (isSupabaseConfigured && supabase) {
    const tableName = TABLES[key];
    await supabase.from(tableName).delete().eq('id', id);
  }
  // Local storage handles delete by saving the filtered array in App.tsx, so no action needed here
};
