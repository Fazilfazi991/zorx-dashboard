
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

// Generic DB Save (Insert/Upsert Collection)
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
  } else {
    saveLocal(key, data);
  }
};

// Save SINGLE Item (Critical for preventing race conditions/overwrites)
export const persistItem = async <T extends { id: string }>(key: string, item: T) => {
  if (isSupabaseConfigured && supabase) {
    const tableName = TABLES[key];
    const { error } = await supabase.from(tableName).upsert({
      id: item.id,
      data: item
    });
    if (error) console.error(`Supabase error saving item to ${tableName}:`, error);
  } else {
    // Local Storage Fallback: Read all, update one, save all
    const all = loadLocal<T[]>(key, []);
    const exists = all.find((i: any) => i.id === item.id);
    let updated;
    if (exists) {
      updated = all.map((i: any) => i.id === item.id ? item : i);
    } else {
      updated = [...all, item];
    }
    saveLocal(key, updated);
  }
};

// Specific Delete function
export const removeItem = async (key: string, id: string) => {
  if (isSupabaseConfigured && supabase) {
    const tableName = TABLES[key];
    await supabase.from(tableName).delete().eq('id', id);
  } else {
    // Local storage handles delete by getting the filtered array passed to persistCollection usually,
    // but if we need explicit delete helper:
    const all = loadLocal<any[]>(key, []);
    const updated = all.filter(i => i.id !== id);
    saveLocal(key, updated);
  }
};
