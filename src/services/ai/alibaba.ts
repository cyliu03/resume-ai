import { BaseProvider, AIProviderError } from './base';
import type { ChatMessage, GenerateOptions, GenerateResult, AIModelConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';

// 通义千问使用 OpenAI 兼容接口
export class AlibabaProvider extends BaseProvider {
  name = '通义千问';
  type = 'alibaba' as const;
  models: AIModelConfig[] = PROVIDERS.alibaba.models;

  constructor(apiKey: string, baseUrl?: string) {
    super(apiKey, baseUrl || PROVIDERS.alibaba.defaultBaseUrl);
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    // Coding Plan 需要使用 qwen3-coder-plus，普通通义千问使用 qwen-plus
    const isCodingPlan = this.baseUrl.includes('coding.dashscope');
    const model = isCodingPlan ? 'qwen3-coder-plus' : 'qwen-plus';

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens,
          top_p: options?.topP,
          stop: options?.stop,
        }),
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