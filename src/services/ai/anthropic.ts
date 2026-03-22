import { BaseProvider, AIProviderError } from './base';
import type { ChatMessage, GenerateOptions, GenerateResult, AIModelConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';

export class AnthropicProvider extends BaseProvider {
  name = 'Anthropic';
  type = 'anthropic' as const;
  models: AIModelConfig[] = PROVIDERS.anthropic.models;

  constructor(apiKey: string, baseUrl?: string) {
    super(apiKey, baseUrl || PROVIDERS.anthropic.defaultBaseUrl);
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    const model = 'claude-sonnet-4-20250514';

    // 分离 system 消息
    const systemMessage = messages.find((m) => m.role === 'system');
    const chatMessages = messages.filter((m) => m.role !== 'system');

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: options?.maxTokens || 4096,
          system: systemMessage?.content,
          messages: chatMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: options?.temperature ?? 0.7,
          top_p: options?.topP,
          stop_sequences: options?.stop,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.error?.message || 'Anthropic API request failed',
          this.type,
          response.status,
          error
        );
      }

      const data = await response.json();

      return {
        content: data.content[0].text,
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
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
    const model = this.models[0];
    if (!model.pricing) return 0;
    const pricePerK = isInput ? model.pricing.inputPer1k : model.pricing.outputPer1k;
    return (tokens / 1000) * pricePerK;
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
  }
}