import { create } from 'zustand';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type { Application, ApplicationStatus, ApplicationStats, InterviewRecord, TestRecord } from '../types/application';

// IndexedDB Schema
interface ApplicationDB extends DBSchema {
  applications: {
    key: string;
    value: Application;
    indexes: { 'by-status': ApplicationStatus; 'by-company': string };
  };
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
      createdAt: now,
      lastUpdated: now,
    };

    const db = await initDB();
    await db.put('applications', app);
    set((state) => ({ applications: [...state.applications, app] }));
    return id;
  },

  updateApplication: async (id, updates) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    const updatedApp = {
      ...app,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    const db = await initDB();
    await db.put('applications', updatedApp);
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? updatedApp : a)),
    }));
  },

  removeApplication: async (id) => {
    const db = await initDB();
    await db.delete('applications', id);
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    }));
  },

  updateStatus: async (id, status) => {
    const updates: Partial<Application> = { status };
    if (status === 'submitted') {
      updates.submittedAt = new Date().toISOString();
    }
    await get().updateApplication(id, updates);
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

    if (apps.length > 0) {
      const submitted = stats.byStatus.submitted + stats.byStatus.screening + stats.byStatus.interview + stats.byStatus.offer + stats.byStatus.rejected;
      const gotResponse = stats.byStatus.screening + stats.byStatus.interview + stats.byStatus.offer + stats.byStatus.rejected;
      const gotInterview = stats.byStatus.interview + stats.byStatus.offer;
      const gotOffer = stats.byStatus.offer;

      stats.responseRate = submitted > 0 ? gotResponse / submitted : 0;
      stats.interviewRate = gotResponse > 0 ? gotInterview / gotResponse : 0;
      stats.offerRate = gotInterview > 0 ? gotOffer / gotInterview : 0;
    }

    return stats;
  },
}));