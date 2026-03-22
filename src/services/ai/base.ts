import type {
  AIProvider,
  AIProviderType,
  ChatMessage,
  GenerateOptions,
  GenerateResult,
} from '../../types/ai';

// 基础提供商抽象类
export abstract class BaseProvider implements AIProvider {
  abstract name: string;
  abstract type: AIProviderType;
  abstract models: AIProvider['models'];

  protected apiKey: string;
  protected baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || '';
  }

  abstract chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult>;

  abstract estimateCost(tokens: number, isInput?: boolean): number;

  validateApiKey(apiKey: string): boolean {
    return apiKey.length > 0;
  }

  // 估算 token 数量（简单估算，中文约 1.5 字/token，英文约 4 字符/token）
  protected estimateTokens(text: string): number {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }

  // 生成请求 ID
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 错误类
export class AIProviderError extends Error {
  provider: AIProviderType;
  statusCode?: number;
  originalError?: unknown;

  constructor(
    message: string,
    provider: AIProviderType,
    statusCode?: number,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'AIProviderError';
    this.provider = provider;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}