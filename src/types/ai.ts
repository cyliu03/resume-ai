// AI 提供商类型
export type AIProviderType =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'baidu'
  | 'alibaba'
  | 'xunfei'
  | 'deepseek'
  | 'moonshot'
  | 'zhipu'
  | 'minimax'
  | 'ollama';

// 模型能力
export type ModelCapability = 'chat' | 'completion' | 'embedding';

// AI 模型配置
export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIProviderType;
  maxTokens: number;
  supports: ModelCapability[];
  pricing?: {
    inputPer1k: number;  // 每1k tokens 输入价格 (美元)
    outputPer1k: number; // 每1k tokens 输出价格 (美元)
  };
}

// 消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 生成选项
export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
  stream?: boolean;
}

// 生成结果
export interface GenerateResult {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProviderType;
}

// AI 提供商接口
export interface AIProvider {
  name: string;
  type: AIProviderType;
  models: AIModelConfig[];
  chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult>;
  estimateCost(tokens: number, isInput?: boolean): number;
  validateApiKey(apiKey: string): boolean;
}

// API Key 配置
export interface APIKeyConfig {
  id: string;
  provider: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  model?: string;  // 用户选择的模型
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

// AI 配置
export interface AIConfig {
  providers: APIKeyConfig[];
  defaultProvider: AIProviderType | null;
  defaultModel: string | null;
}

// 调用历史记录
export interface AICallHistory {
  id: string;
  provider: AIProviderType;
  model: string;
  prompt: string;
  response: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  duration: number; // 毫秒
  createdAt: string;
  success: boolean;
  error?: string;
}

// 费用统计
export interface CostStats {
  totalCost: number;
  totalTokens: number;
  callCount: number;
  byProvider: Record<AIProviderType, {
    cost: number;
    tokens: number;
    calls: number;
  }>;
  byDate: Record<string, {
    cost: number;
    tokens: number;
    calls: number;
  }>;
}

// JD 解析结果
export interface ParsedJD {
  title: string;
  company: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: {
    min: number;
    max: number;
    preferred: string;
  };
  education: {
    level: string;
    field: string;
  };
  benefits: string[];
  keywords: string[];
}

// 技能缺口
export interface SkillGap {
  skill: string;
  required: boolean;
  currentLevel: string | null;
  requiredLevel: string;
  gap: string;
  suggestion: string;
}

// 提供商信息
export interface ProviderInfo {
  type: AIProviderType;
  name: string;
  description: string;
  website: string;
  defaultBaseUrl: string;
  models: AIModelConfig[];
}

// 预定义的提供商信息
export const PROVIDERS: Record<AIProviderType, ProviderInfo> = {
  openai: {
    type: 'openai',
    name: 'OpenAI',
    description: 'GPT 系列模型，性能强劲',
    website: 'https://platform.openai.com',
    defaultBaseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.005, outputPer1k: 0.015 } },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.00015, outputPer1k: 0.0006 } },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.01, outputPer1k: 0.03 } },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 16385, supports: ['chat'], pricing: { inputPer1k: 0.0005, outputPer1k: 0.0015 } },
    ],
  },
  anthropic: {
    type: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 系列模型，擅长长文本和复杂推理',
    website: 'https://console.anthropic.com',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'anthropic', maxTokens: 200000, supports: ['chat'], pricing: { inputPer1k: 0.003, outputPer1k: 0.015 } },
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', provider: 'anthropic', maxTokens: 200000, supports: ['chat'], pricing: { inputPer1k: 0.015, outputPer1k: 0.075 } },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 200000, supports: ['chat'], pricing: { inputPer1k: 0.003, outputPer1k: 0.015 } },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', maxTokens: 200000, supports: ['chat'], pricing: { inputPer1k: 0.00025, outputPer1k: 0.00125 } },
    ],
  },
  google: {
    type: 'google',
    name: 'Google AI',
    description: 'Gemini 系列模型，多模态能力强',
    website: 'https://aistudio.google.com',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', maxTokens: 1000000, supports: ['chat'], pricing: { inputPer1k: 0.00125, outputPer1k: 0.005 } },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', maxTokens: 1000000, supports: ['chat'], pricing: { inputPer1k: 0.000075, outputPer1k: 0.0003 } },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google', maxTokens: 32760, supports: ['chat'], pricing: { inputPer1k: 0.00025, outputPer1k: 0.0005 } },
    ],
  },
  deepseek: {
    type: 'deepseek',
    name: 'DeepSeek',
    description: '深度求索，性价比高，代码能力强',
    website: 'https://platform.deepseek.com',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', maxTokens: 64000, supports: ['chat'], pricing: { inputPer1k: 0.00014, outputPer1k: 0.00028 } },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'deepseek', maxTokens: 64000, supports: ['chat'], pricing: { inputPer1k: 0.00055, outputPer1k: 0.00219 } },
    ],
  },
  alibaba: {
    type: 'alibaba',
    name: '通义千问',
    description: '阿里云大模型，中文能力强',
    website: 'https://dashscope.console.aliyun.com',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen-max', name: '通义千问 Max', provider: 'alibaba', maxTokens: 32000, supports: ['chat'], pricing: { inputPer1k: 0.002, outputPer1k: 0.006 } },
      { id: 'qwen-plus', name: '通义千问 Plus', provider: 'alibaba', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.0004, outputPer1k: 0.0012 } },
      { id: 'qwen-turbo', name: '通义千问 Turbo', provider: 'alibaba', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.0002, outputPer1k: 0.0006 } },
    ],
  },
  baidu: {
    type: 'baidu',
    name: '文心一言',
    description: '百度大模型，中文能力强',
    website: 'https://console.bce.baidu.com/qianfan',
    defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
    models: [
      { id: 'ernie-4.0-8k', name: '文心一言 4.0', provider: 'baidu', maxTokens: 8000, supports: ['chat'], pricing: { inputPer1k: 0.03, outputPer1k: 0.06 } },
      { id: 'ernie-3.5-8k', name: '文心一言 3.5', provider: 'baidu', maxTokens: 8000, supports: ['chat'], pricing: { inputPer1k: 0.004, outputPer1k: 0.008 } },
    ],
  },
  xunfei: {
    type: 'xunfei',
    name: '讯飞星火',
    description: '科大讯飞大模型',
    website: 'https://xinghuo.xfyun.cn',
    defaultBaseUrl: 'https://spark-api-open.xf-yun.com/v1',
    models: [
      { id: 'generalv3.5', name: '星火 3.5', provider: 'xunfei', maxTokens: 8000, supports: ['chat'], pricing: { inputPer1k: 0.003, outputPer1k: 0.006 } },
      { id: 'generalv3', name: '星火 3.0', provider: 'xunfei', maxTokens: 8000, supports: ['chat'], pricing: { inputPer1k: 0.0015, outputPer1k: 0.003 } },
    ],
  },
  moonshot: {
    type: 'moonshot',
    name: 'Moonshot',
    description: '月之暗面 Kimi，长文本能力强',
    website: 'https://platform.moonshot.cn',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot V1 8K', provider: 'moonshot', maxTokens: 8192, supports: ['chat'], pricing: { inputPer1k: 0.012, outputPer1k: 0.012 } },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K', provider: 'moonshot', maxTokens: 32768, supports: ['chat'], pricing: { inputPer1k: 0.024, outputPer1k: 0.024 } },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', provider: 'moonshot', maxTokens: 131072, supports: ['chat'], pricing: { inputPer1k: 0.06, outputPer1k: 0.06 } },
    ],
  },
  zhipu: {
    type: 'zhipu',
    name: '智谱 AI',
    description: '智谱清言系列模型',
    website: 'https://open.bigmodel.cn',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4', name: 'GLM-4', provider: 'zhipu', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.1, outputPer1k: 0.1 } },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', provider: 'zhipu', maxTokens: 128000, supports: ['chat'], pricing: { inputPer1k: 0.0001, outputPer1k: 0.0001 } },
      { id: 'glm-3-turbo', name: 'GLM-3 Turbo', provider: 'zhipu', maxTokens: 4096, supports: ['chat'], pricing: { inputPer1k: 0.001, outputPer1k: 0.001 } },
    ],
  },
  minimax: {
    type: 'minimax',
    name: 'MiniMax',
    description: 'MiniMax 大模型',
    website: 'https://www.minimaxi.com',
    defaultBaseUrl: 'https://api.minimax.chat/v1',
    models: [
      { id: 'abab6.5-chat', name: 'ABAB 6.5 Chat', provider: 'minimax', maxTokens: 245000, supports: ['chat'], pricing: { inputPer1k: 0.03, outputPer1k: 0.03 } },
      { id: 'abab5.5-chat', name: 'ABAB 5.5 Chat', provider: 'minimax', maxTokens: 16384, supports: ['chat'], pricing: { inputPer1k: 0.015, outputPer1k: 0.015 } },
    ],
  },
  ollama: {
    type: 'ollama',
    name: 'Ollama (本地)',
    description: '本地部署模型，保护隐私，完全免费',
    website: 'https://ollama.com',
    defaultBaseUrl: 'http://localhost:11434',
    models: [
      { id: 'qwen3.5:4b', name: 'Qwen 3.5 4B (中文推荐)', provider: 'ollama', maxTokens: 32768, supports: ['chat'] },
      { id: 'qwen3.5:9b', name: 'Qwen 3.5 9B', provider: 'ollama', maxTokens: 32768, supports: ['chat'] },
      { id: 'qwen3.5:27b', name: 'Qwen 3.5 27B', provider: 'ollama', maxTokens: 32768, supports: ['chat'] },
      { id: 'deepseek-r1:8b', name: 'DeepSeek R1 8B (推理)', provider: 'ollama', maxTokens: 64000, supports: ['chat'] },
      { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'ollama', maxTokens: 64000, supports: ['chat'] },
      { id: 'llama3.2:3b', name: 'Llama 3.2 3B', provider: 'ollama', maxTokens: 131072, supports: ['chat'] },
      { id: 'phi4-mini', name: 'Phi-4 Mini (快速)', provider: 'ollama', maxTokens: 128000, supports: ['chat'] },
      { id: 'gemma3:4b', name: 'Gemma 3 4B', provider: 'ollama', maxTokens: 32768, supports: ['chat'] },
      { id: 'nemotron-cascade-2', name: 'Nemotron Cascade 2 (30B MoE)', provider: 'ollama', maxTokens: 32768, supports: ['chat'] },
    ],
  },
};

// 获取所有支持的提供商类型
export const SUPPORTED_PROVIDERS: AIProviderType[] = Object.keys(PROVIDERS) as AIProviderType[];