import { BaseProvider, AIProviderError } from './base';
import type { ChatMessage, GenerateOptions, GenerateResult, AIModelConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';

// Coding Plan 支持的模型
const CODING_PLAN_MODELS: AIModelConfig[] = [
  { id: 'qwen3.5-plus', name: 'Qwen 3.5 Plus (推荐)', provider: 'alibaba', maxTokens: 128000, supports: ['chat'] },
  { id: 'qwen3-coder-plus', name: 'Qwen 3 Coder Plus', provider: 'alibaba', maxTokens: 128000, supports: ['chat'] },
  { id: 'qwen3-coder-next', name: 'Qwen 3 Coder Next', provider: 'alibaba', maxTokens: 128000, supports: ['chat'] },
  { id: 'qwen3-max-2026-01-23', name: 'Qwen 3 Max', provider: 'alibaba', maxTokens: 32000, supports: ['chat'] },
  { id: 'glm-5', name: 'GLM 5', provider: 'alibaba', maxTokens: 128000, supports: ['chat'] },
  { id: 'kimi-k2.5', name: 'Kimi K2.5', provider: 'alibaba', maxTokens: 128000, supports: ['chat'] },
];

// 通义千问使用 OpenAI 兼容接口
export class AlibabaProvider extends BaseProvider {
  name = '通义千问';
  type = 'alibaba' as const;
  models: AIModelConfig[] = PROVIDERS.alibaba.models;
  selectedModel?: string;

  constructor(apiKey: string, baseUrl?: string, model?: string) {
    super(apiKey, baseUrl || PROVIDERS.alibaba.defaultBaseUrl);
    this.selectedModel = model;
  }

  // 获取可用模型列表
  getAvailableModels(): AIModelConfig[] {
    const isCodingPlan = this.baseUrl.includes('coding.dashscope');
    return isCodingPlan ? CODING_PLAN_MODELS : this.models;
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    // 优先使用用户选择的模型，否则根据 Base URL 自动选择
    const isCodingPlan = this.baseUrl.includes('coding.dashscope');
    let model = this.selectedModel;
    
    if (!model) {
      model = isCodingPlan ? 'qwen3.5-plus' : 'qwen-plus';
    }

    // 使用代理绕过 CORS
    // 本地开发用 Vite 代理，生产环境用 Vercel Serverless Function
    let apiUrl: string;
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    if (isLocalhost) {
      // 本地开发：使用 Vite 代理
      if (isCodingPlan) {
        apiUrl = '/api/coding-dashscope/chat/completions';
      } else if (this.baseUrl.includes('dashscope.aliyuncs.com')) {
        apiUrl = '/api/dashscope/chat/completions';
      } else {
        apiUrl = `${this.baseUrl}/chat/completions`;
      }
    } else {
      // 生产环境：使用 Vercel Serverless Function 代理
      apiUrl = '/api/chat';
    }

    try {
      // 构建请求体
      const requestBody: Record<string, unknown> = {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP,
        stop: options?.stop,
      };

      // 生产环境代理需要额外的认证信息
      if (!isLocalhost) {
        requestBody.apiKey = this.apiKey;
        requestBody.baseUrl = this.baseUrl;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 本地开发时直接传递 Authorization
      if (isLocalhost) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.error?.message || error.message || '通义千问 API request failed',
          this.type,
          response.status,
          error
        );
      }

      const data = await response.json();

      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model || model,
        provider: this.type,
      };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;
      throw new AIProviderError(
        error instanceof Error ? error.message : 'Unknown error',
        this.type,
        undefined,
        error
      );
    }
  }

  estimateCost(tokens: number, isInput = true): number {
    const model = this.models[1]; // Qwen Plus
    if (!model.pricing) return 0;
    const pricePerK = isInput ? model.pricing.inputPer1k : model.pricing.outputPer1k;
    return (tokens / 1000) * pricePerK;
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }
}