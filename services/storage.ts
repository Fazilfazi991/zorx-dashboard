
import { 
  MOCK_USERS, MOCK_CLIENTS, MOCK_TASKS, MOCK_CAMPAIGNS, MOCK_IDEAS, 
  MOCK_LEAVES, MOCK_ATTENDANCE, MOCK_HOLIDAYS, MOCK_TARGETS, MOCK_OVERTIME 
} from '../constants';

// Unique keys for each data collection
export const KEYS = {
  USERS: 'zorx_db_users_v1',
  CLIENTS: 'zorx_db_clients_v1',
  TASKS: 'zorx_db_tasks_v1',
  CAMPAIGNS: 'zorx_db_campaigns_v1',
  IDEAS: 'zorx_db_ideas_v1',
  LEAVES: 'zorx_db_leaves_v1',
  ATTENDANCE: 'zorx_db_attendance_v1',
  HOLIDAYS: 'zorx_db_holidays_v1',
  OVERTIME: 'zorx_db_overtime_v1',
  TARGETS: 'zorx_db_targets_v1'
};

// Generic loader
export const loadData = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading database key: ${key}`, error);
    return fallback;
  }
};

// Generic saver
export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving database key: ${key}`, error);
  }
};

// Hard reset function
export const resetDatabase = () => {
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.CLIENTS);
  localStorage.removeItem(KEYS.TASKS);
  localStorage.removeItem(KEYS.CAMPAIGNS);
  localStorage.removeItem(KEYS.IDEAS);
  localStorage.removeItem(KEYS.LEAVES);
  localStorage.removeItem(KEYS.ATTENDANCE);
  localStorage.removeItem(KEYS.HOLIDAYS);
  localStorage.removeItem(KEYS.OVERTIME);
  localStorage.removeItem(KEYS.TARGETS);
  window.location.reload();
};
