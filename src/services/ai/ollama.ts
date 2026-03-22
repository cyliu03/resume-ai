import { BaseProvider, AIProviderError } from './base';
import type { ChatMessage, GenerateOptions, GenerateResult, AIModelConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';

// Ollama 本地模型提供商
export class OllamaProvider extends BaseProvider {
  name = 'Ollama (本地)';
  type = 'ollama' as const;
  models: AIModelConfig[] = PROVIDERS.ollama.models;
  private selectedModel: string;

  constructor(apiKey: string = 'ollama', baseUrl?: string, model?: string) {
    super(apiKey || 'ollama', baseUrl || PROVIDERS.ollama.defaultBaseUrl);
    this.selectedModel = model || 'qwen3.5:4b';
  }

  setModel(model: string) {
    this.selectedModel = model;
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    try {
      // Ollama 原生 API
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.selectedModel,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens,
            top_p: options?.topP,
            stop: options?.stop,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error || 'Ollama API request failed',
          this.type,
          response.status,
          error
        );
      }

      const data = await response.json();

      return {
        content: data.message?.content || '',
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
        model: data.model || this.selectedModel,
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

  estimateCost(_tokens: number, _isInput?: boolean): number {
    // 本地模型免费
    return 0;
  }

  validateApiKey(_apiKey: string): boolean {
    // Ollama 不需要 API Key
    return true;
  }

  // 获取可用模型列表
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((m: { name: string }) => m.name) || [];
    } catch {
      return [];
    }
  }

  // 检查 Ollama 是否运行中
  async isRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      return response.ok;
    } catch {
      return false;
    }
  }
}