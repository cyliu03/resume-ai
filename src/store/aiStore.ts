import { create } from 'zustand';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type {
  AIProviderType,
  APIKeyConfig,
  AICallHistory,
  CostStats,
} from '../types/ai';

// IndexedDB Schema for AI config
interface AIConfigDB extends DBSchema {
  'ai-config': {
    key: string;
    value: {
      id: string;
      data: unknown;
    };
  };
}

const DB_NAME = 'resume-ai-config';
const DB_VERSION = 2;  // 升级版本号，强制重建数据库
const KEYS = {
  providers: 'providers',
  history: 'history',
  stats: 'stats',
  defaultProvider: 'defaultProvider',
  defaultModel: 'defaultModel',
};

// 初始化 IndexedDB
async function initDB(): Promise<IDBPDatabase<AIConfigDB>> {
  return openDB<AIConfigDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // 版本升级时重建 object store
      if (oldVersion < 2) {
        // 删除旧的 object store（如果存在）
        if (db.objectStoreNames.contains('ai-config')) {
          db.deleteObjectStore('ai-config');
        }
      }
      // 创建新的 object store
      if (!db.objectStoreNames.contains('ai-config')) {
        db.createObjectStore('ai-config', { keyPath: 'id' });
      }
    },
  });
}

// 简单的 API Key 加密（基于浏览器环境）
function encryptApiKey(apiKey: string): string {
  // 使用 Base64 编码作为简单加密
  // 生产环境应使用更安全的加密方式
  return btoa(apiKey);
}

function decryptApiKey(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return encrypted;
  }
}

// 加载配置
async function loadConfig<T>(key: string): Promise<T | null> {
  try {
    const db = await initDB();
    const record = await db.get('ai-config', key);
    return record?.data as T | null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
}

// 保存配置
async function saveConfig<T>(key: string, data: T): Promise<void> {
  try {
    const db = await initDB();
    await db.put('ai-config', { id: key, data });
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

// Store 接口
interface AIStore {
  // 状态
  providers: APIKeyConfig[];
  history: AICallHistory[];
  stats: CostStats;
  defaultProvider: AIProviderType | null;
  defaultModel: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // 初始化
  init: () => Promise<void>;

  // Provider 管理
  addProvider: (config: Omit<APIKeyConfig, 'id' | 'createdAt'>) => void;
  updateProvider: (id: string, config: Partial<APIKeyConfig>) => void;
  removeProvider: (id: string) => void;
  setDefaultProvider: (provider: AIProviderType) => void;
  setDefaultModel: (model: string) => void;

  // 历史记录
  addHistory: (record: Omit<AICallHistory, 'id' | 'createdAt'>) => void;
  clearHistory: () => void;

  // 统计
  updateStats: (record: AICallHistory) => void;
  resetStats: () => void;

  // 工具方法
  getActiveProvider: () => APIKeyConfig | null;
  getDecryptedApiKey: (id: string) => string | null;
}

// 默认统计
const defaultStats: CostStats = {
  totalCost: 0,
  totalTokens: 0,
  callCount: 0,
  byProvider: {} as Record<AIProviderType, { cost: number; tokens: number; calls: number }>,
  byDate: {},
};

export const useAIStore = create<AIStore>((set, get) => ({
  providers: [],
  history: [],
  stats: defaultStats,
  defaultProvider: null,
  defaultModel: null,
  isLoading: true,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;

    try {
      const providers = await loadConfig<APIKeyConfig[]>(KEYS.providers);
      const history = await loadConfig<AICallHistory[]>(KEYS.history);
      const stats = await loadConfig<CostStats>(KEYS.stats);
      const defaultProvider = await loadConfig<string>(KEYS.defaultProvider);
      const defaultModel = await loadConfig<string>(KEYS.defaultModel);

      // 解密 API Keys
      const decryptedProviders = (providers || []).map((p) => ({
        ...p,
        apiKey: decryptApiKey(p.apiKey),
      }));

      set({
        providers: decryptedProviders,
        history: history || [],
        stats: stats || defaultStats,
        defaultProvider: defaultProvider as AIProviderType | null,
        defaultModel,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to init AI store:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  addProvider: (config) => {
    set((state) => {
      const newProvider: APIKeyConfig = {
        ...config,
        id: uuidv4(),
        apiKey: encryptApiKey(config.apiKey),
        createdAt: new Date().toISOString(),
      };

      const newProviders = [...state.providers, newProvider];
      saveConfig(KEYS.providers, newProviders.map(p => ({
        ...p,
        apiKey: p.id === newProvider.id ? newProvider.apiKey : p.apiKey,
      })));

      return {
        providers: newProviders.map(p => ({
          ...p,
          apiKey: p.id === newProvider.id ? config.apiKey : p.apiKey,
        })),
        defaultProvider: state.defaultProvider || config.provider,
        defaultModel: state.defaultModel || null,
      };
    });
  },

  updateProvider: (id, config) => {
    set((state) => {
      const newProviders = state.providers.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...config };
        if (config.apiKey) {
          updated.apiKey = encryptApiKey(config.apiKey);
        }
        return updated;
      });

      saveConfig(KEYS.providers, newProviders.map(p => ({
        ...p,
        apiKey: encryptApiKey(p.apiKey),
      })));

      return {
        providers: newProviders.map(p => ({
          ...p,
          apiKey: decryptApiKey(p.apiKey),
        })),
      };
    });
  },

  removeProvider: (id) => {
    set((state) => {
      const newProviders = state.providers.filter((p) => p.id !== id);
      saveConfig(KEYS.providers, newProviders.map(p => ({
        ...p,
        apiKey: encryptApiKey(p.apiKey),
      })));

      return { providers: newProviders };
    });
  },

  setDefaultProvider: (provider) => {
    saveConfig(KEYS.defaultProvider, provider);
    set({ defaultProvider: provider });
  },

  setDefaultModel: (model) => {
    saveConfig(KEYS.defaultModel, model);
    set({ defaultModel: model });
  },

  addHistory: (record) => {
    set((state) => {
      const newRecord: AICallHistory = {
        ...record,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      const newHistory = [newRecord, ...state.history].slice(0, 1000); // 保留最近 1000 条
      saveConfig(KEYS.history, newHistory);

      return { history: newHistory };
    });

    // 更新统计
    get().updateStats(get().history[0]);
  },

  clearHistory: () => {
    saveConfig(KEYS.history, []);
    set({ history: [] });
  },

  updateStats: (record) => {
    set((state) => {
      const date = new Date(record.createdAt).toISOString().split('T')[0];
      const provider = record.provider;

      const newStats: CostStats = {
        totalCost: state.stats.totalCost + record.cost,
        totalTokens: state.stats.totalTokens + record.tokens.total,
        callCount: state.stats.callCount + 1,
        byProvider: {
          ...state.stats.byProvider,
          [provider]: {
            cost: (state.stats.byProvider[provider]?.cost || 0) + record.cost,
            tokens: (state.stats.byProvider[provider]?.tokens || 0) + record.tokens.total,
            calls: (state.stats.byProvider[provider]?.calls || 0) + 1,
          },
        },
        byDate: {
          ...state.stats.byDate,
          [date]: {
            cost: (state.stats.byDate[date]?.cost || 0) + record.cost,
            tokens: (state.stats.byDate[date]?.tokens || 0) + record.tokens.total,
            calls: (state.stats.byDate[date]?.calls || 0) + 1,
          },
        },
      };

      saveConfig(KEYS.stats, newStats);
      return { stats: newStats };
    });
  },

  resetStats: () => {
    saveConfig(KEYS.stats, defaultStats);
    set({ stats: defaultStats });
  },

  getActiveProvider: () => {
    const { providers, defaultProvider } = get();
    if (!defaultProvider) {
      return providers.find((p) => p.isActive) || providers[0] || null;
    }
    return providers.find((p) => p.provider === defaultProvider && p.isActive) || null;
  },

  getDecryptedApiKey: (id) => {
    const provider = get().providers.find((p) => p.id === id);
    return provider?.apiKey || null;
  },
}));