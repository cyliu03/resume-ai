import { create } from 'zustand';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type {
  PersonalDatabase,
  Skill,
  Experience,
  Project,
  Education,
  Certificate,
  Profile,
} from '../types/database';
import { defaultProfile } from '../types/database';

// IndexedDB Schema
interface ResumeAIDB extends DBSchema {
  database: {
    key: string;
    value: PersonalDatabase;
  };
}

const DB_NAME = 'resume-ai-db';
const DB_VERSION = 1;
const DB_KEY = 'main';

// 初始化 IndexedDB
async function initDB(): Promise<IDBPDatabase<ResumeAIDB>> {
  return openDB<ResumeAIDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('database')) {
        db.createObjectStore('database');
      }
    },
  });
}

// 从 IndexedDB 加载数据
async function loadFromDB(): Promise<PersonalDatabase> {
  try {
    const db = await initDB();
    const data = await db.get('database', DB_KEY);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
  }
  return {
    profile: defaultProfile,
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certificates: [],
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };
}

// 保存到 IndexedDB
async function saveToDB(data: PersonalDatabase): Promise<void> {
  try {
    const db = await initDB();
    await db.put('database', data, DB_KEY);
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
  }
}

// Store 接口
interface DatabaseStore {
  // 状态
  database: PersonalDatabase;
  isLoading: boolean;
  isInitialized: boolean;

  // 初始化
  init: () => Promise<void>;

  // Profile
  updateProfile: (profile: Partial<Profile>) => void;

  // Skills
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Experiences
  addExperience: (experience: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Education
  addEducation: (education: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Certificates
  addCertificate: (certificate: Omit<Certificate, 'id' | 'createdAt'>) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  // 导入导出
  exportDatabase: () => PersonalDatabase;
  importDatabase: (data: PersonalDatabase) => void;
  clearDatabase: () => void;
}

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  database: {
    profile: defaultProfile,
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certificates: [],
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  },
  isLoading: true,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;
    const data = await loadFromDB();
    set({
      database: data,
      isLoading: false,
      isInitialized: true,
    });
  },

  updateProfile: (profile) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        profile: { ...state.database.profile, ...profile },
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  addSkill: (skill) => {
    set((state) => {
      const newSkill: Skill = {
        ...skill,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newDatabase = {
        ...state.database,
        skills: [...state.database.skills, newSkill],
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  updateSkill: (id, skill) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        skills: state.database.skills.map((s) =>
          s.id === id ? { ...s, ...skill, updatedAt: new Date().toISOString() } : s
        ),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  removeSkill: (id) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        skills: state.database.skills.filter((s) => s.id !== id),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  addExperience: (experience) => {
    set((state) => {
      const newExperience: Experience = {
        ...experience,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newDatabase = {
        ...state.database,
        experiences: [...state.database.experiences, newExperience],
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  updateExperience: (id, experience) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        experiences: state.database.experiences.map((e) =>
          e.id === id ? { ...e, ...experience, updatedAt: new Date().toISOString() } : e
        ),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  removeExperience: (id) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        experiences: state.database.experiences.filter((e) => e.id !== id),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  addProject: (project) => {
    set((state) => {
      const newProject: Project = {
        ...project,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newDatabase = {
        ...state.database,
        projects: [...state.database.projects, newProject],
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  updateProject: (id, project) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        projects: state.database.projects.map((p) =>
          p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString() } : p
        ),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  removeProject: (id) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        projects: state.database.projects.filter((p) => p.id !== id),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  addEducation: (education) => {
    set((state) => {
      const newEducation: Education = {
        ...education,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newDatabase = {
        ...state.database,
        education: [...state.database.education, newEducation],
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  updateEducation: (id, education) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        education: state.database.education.map((e) =>
          e.id === id ? { ...e, ...education, updatedAt: new Date().toISOString() } : e
        ),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  removeEducation: (id) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        education: state.database.education.filter((e) => e.id !== id),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  addCertificate: (certificate) => {
    set((state) => {
      const newCertificate: Certificate = {
        ...certificate,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const newDatabase = {
        ...state.database,
        certificates: [...state.database.certificates, newCertificate],
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  updateCertificate: (id, certificate) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        certificates: state.database.certificates.map((c) =>
          c.id === id ? { ...c, ...certificate } : c
        ),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  removeCertificate: (id) => {
    set((state) => {
      const newDatabase = {
        ...state.database,
        certificates: state.database.certificates.filter((c) => c.id !== id),
        lastUpdated: new Date().toISOString(),
      };
      saveToDB(newDatabase);
      return { database: newDatabase };
    });
  },

  exportDatabase: () => {
    return get().database;
  },

  importDatabase: (data) => {
    const newDatabase = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    saveToDB(newDatabase);
    set({ database: newDatabase });
  },

  clearDatabase: () => {
    const newDatabase: PersonalDatabase = {
      profile: defaultProfile,
      skills: [],
      experiences: [],
      projects: [],
      education: [],
      certificates: [],
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
    saveToDB(newDatabase);
    set({ database: newDatabase });
  },
}));