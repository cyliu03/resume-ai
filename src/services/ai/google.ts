import { BaseProvider, AIProviderError } from './base';
import type { ChatMessage, GenerateOptions, GenerateResult, AIModelConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';

export class GoogleProvider extends BaseProvider {
  name = 'Google AI';
  type = 'google' as const;
  models: AIModelConfig[] = PROVIDERS.google.models;

  constructor(apiKey: string, baseUrl?: string) {
    super(apiKey, baseUrl || PROVIDERS.google.defaultBaseUrl);
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    const model = 'gemini-1.5-flash';

    // 转换消息格式
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === 'system');

    try {
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction.content }] }
            : undefined,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens,
            topP: options?.topP,
            stopSequences: options?.stop,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.error?.message || 'Google AI API request failed',
          this.type,
          response.status,
          error
        );
      }

      const data = await response.json();

      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model,
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
    const model = this.models[1]; // Flash 模型
    if (!model.pricing) return 0;
    const pricePerK = isInput ? model.pricing.inputPer1k : model.pricing.outputPer1k;
    return (tokens / 1000) * pricePerK;
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey.length > 10;
  }
}