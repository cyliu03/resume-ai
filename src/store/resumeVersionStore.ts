import { create } from 'zustand';
import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, TemplateType, LayoutSettings } from '../types/resume';
import { defaultLayoutSettings } from '../types/resume';

// 简历版本信息
export interface ResumeVersion {
  id: string;
  name: string;
  description?: string;
  targetCompany?: string;
  targetPosition?: string;
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  layoutSettings: LayoutSettings;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

const DB_NAME = 'resume-versions-db';
const DB_VERSION = 1;

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('resume-versions')) {
        db.createObjectStore('resume-versions', { keyPath: 'id' });
      }
    },
  });
}

interface ResumeVersionStore {
  versions: ResumeVersion[];
  currentVersionId: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  init: () => Promise<void>;
  createVersion: (name: string, data: Partial<ResumeVersion>) => Promise<ResumeVersion>;
  updateVersion: (id: string, data: Partial<ResumeVersion>) => Promise<void>;
  deleteVersion: (id: string) => Promise<void>;
  duplicateVersion: (id: string, newName: string) => Promise<ResumeVersion>;
  setCurrentVersion: (id: string) => void;
  getVersion: (id: string) => ResumeVersion | undefined;
}

export const useResumeVersionStore = create<ResumeVersionStore>((set, get) => ({
  versions: [],
  currentVersionId: null,
  isLoading: true,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;
    try {
      const db = await initDB();
      const versions = await db.getAll('resume-versions');
      set({
        versions: versions || [],
        currentVersionId: versions[0]?.id || null,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to load resume versions:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  createVersion: async (name, data) => {
    const db = await initDB();
    const now = new Date().toISOString();
    const newVersion: ResumeVersion = {
      id: uuidv4(),
      name,
      resumeData: data.resumeData || {
        personalInfo: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
        education: [],
        experience: [],
        projects: [],
        skills: [],
      },
      selectedTemplate: data.selectedTemplate || 'modern',
      layoutSettings: data.layoutSettings || defaultLayoutSettings,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    await db.put('resume-versions', newVersion);
    set(state => ({
      versions: [...state.versions, newVersion],
      currentVersionId: state.currentVersionId || newVersion.id,
    }));
    return newVersion;
  },

  updateVersion: async (id, data) => {
    const db = await initDB();
    const version = get().versions.find(v => v.id === id);
    if (!version) return;
    const updatedVersion = { ...version, ...data, updatedAt: new Date().toISOString() };
    await db.put('resume-versions', updatedVersion);
    set(state => ({ versions: state.versions.map(v => v.id === id ? updatedVersion : v) }));
  },

  deleteVersion: async (id) => {
    const db = await initDB();
    await db.delete('resume-versions', id);
    set(state => {
      const newVersions = state.versions.filter(v => v.id !== id);
      return { versions: newVersions, currentVersionId: state.currentVersionId === id ? newVersions[0]?.id || null : state.currentVersionId };
    });
  },

  duplicateVersion: async (id, newName) => {
    const version = get().versions.find(v => v.id === id);
    if (!version) throw new Error('Version not found');
    return get().createVersion(newName, {
      resumeData: JSON.parse(JSON.stringify(version.resumeData)),
      selectedTemplate: version.selectedTemplate,
      layoutSettings: { ...version.layoutSettings },
    });
  },

  setCurrentVersion: (id) => set({ currentVersionId: id }),

  getVersion: (id) => get().versions.find(v => v.id === id),
}));