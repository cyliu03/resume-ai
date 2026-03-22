import { create } from 'zustand';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type { Application, ApplicationStatus, InterviewRecord, TestRecord, ApplicationStats } from '../types/application';

interface ApplicationDB extends DBSchema {
  applications: {
    key: string;
    value: Application;
    indexes: {
      'by-status': ApplicationStatus;
      'by-company': string;
    };
  };
}

interface ApplicationStore {
  applications: Application[];
  isLoading: boolean;
  isInitialized: boolean;

  init: () => Promise<void>;
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<string>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  addInterview: (appId: string, interview: Omit<InterviewRecord, 'id'>) => Promise<void>;
  addTest: (appId: string, test: Omit<TestRecord, 'id'>) => Promise<void>;
  getStats: () => ApplicationStats;
}

const DB_NAME = 'resume-ai-applications';
const DB_VERSION = 1;

async function initDB(): Promise<IDBPDatabase<ApplicationDB>> {
  return openDB<ApplicationDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('applications')) {
        const store = db.createObjectStore('applications', { keyPath: 'id' });
        store.createIndex('by-status', 'status');
        store.createIndex('by-company', 'company');
      }
    },
  });
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  isLoading: false,
  isInitialized: false,

  init: async () => {
    set({ isLoading: true });
    try {
      const db = await initDB();
      const apps = await db.getAll('applications');
      set({ applications: apps, isInitialized: true });
    } catch (error) {
      console.error('Failed to init applications:', error);
      set({ isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  addApplication: async (appData) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const app: Application = {
      ...appData,
      id,
      interviews: [],
      tests: [],
      createdAt: now,
      lastUpdated: now,
    };

    try {
      const db = await initDB();
      await db.add('applications', app);
      set((state) => ({ applications: [...state.applications, app] }));
      return id;
    } catch (error) {
      console.error('Failed to add application:', error);
      return id;
    }
  },

  updateApplication: async (id, updates) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    const updatedApp = {
      ...app,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const db = await initDB();
      await db.put('applications', updatedApp);
      set((state) => ({
        applications: state.applications.map((a) =>
          a.id === id ? updatedApp : a
        ),
      }));
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  },

  removeApplication: async (id) => {
    try {
      const db = await initDB();
      await db.delete('applications', id);
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== id),
      }));
    } catch (error) {
      console.error('Failed to remove application:', error);
    }
  },

  updateStatus: async (id, status) => {
    await get().updateApplication(id, { status });
  },

  addInterview: async (appId, interviewData) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const interview: InterviewRecord = {
      ...interviewData,
      id: uuidv4(),
    };

    const interviews = [...(app.interviews || []), interview];
    await get().updateApplication(appId, { interviews });
  },

  addTest: async (appId, testData) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    const test: TestRecord = {
      ...testData,
      id: uuidv4(),
    };

    const tests = [...(app.tests || []), test];
    await get().updateApplication(appId, { tests });
  },

  getStats: () => {
    const apps = get().applications;
    const stats: ApplicationStats = {
      total: apps.length,
      byStatus: {
        pending: 0,
        submitted: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        withdrawn: 0,
      },
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
    };

    apps.forEach((app) => {
      stats.byStatus[app.status]++;
    });

    const submitted = stats.byStatus.submitted + stats.byStatus.screening + stats.byStatus.interview + stats.byStatus.offer + stats.byStatus.rejected;
    if (submitted > 0) {
      stats.responseRate = (stats.byStatus.screening + stats.byStatus.interview + stats.byStatus.offer) / submitted;
      stats.interviewRate = (stats.byStatus.interview + stats.byStatus.offer) / submitted;
      stats.offerRate = stats.byStatus.offer / submitted;
    }

    return stats;
  },
}));