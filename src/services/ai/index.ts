// AI 服务层统一导出
export { BaseProvider, AIProviderError } from './base';
export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
export { GoogleProvider } from './google';
export { DeepSeekProvider } from './deepseek';
export { AlibabaProvider } from './alibaba';
export { OllamaProvider } from './ollama';

import type { AIProvider, AIProviderType, APIKeyConfig } from '../../types/ai';
import { PROVIDERS } from '../../types/ai';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GoogleProvider } from './google';
import { DeepSeekProvider } from './deepseek';
import { AlibabaProvider } from './alibaba';
import { OllamaProvider } from './ollama';

// 创建提供商实例的工厂函数
export function createProvider(config: APIKeyConfig): AIProvider | null {
  const { provider, apiKey, baseUrl, model } = config;

  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey, baseUrl);
    case 'anthropic':
      return new AnthropicProvider(apiKey, baseUrl);
    case 'google':
      return new GoogleProvider(apiKey, baseUrl);
    case 'deepseek':
      return new DeepSeekProvider(apiKey, baseUrl);
    case 'alibaba':
      return new AlibabaProvider(apiKey, baseUrl, model);
    case 'ollama':
      return new OllamaProvider(apiKey, baseUrl);
    case 'baidu':
    case 'xunfei':
    case 'moonshot':
    case 'zhipu':
    case 'minimax':
      // 这些提供商也支持 OpenAI 兼容接口
      return new OpenAIProvider(apiKey, baseUrl || PROVIDERS[provider].defaultBaseUrl);
    default:
      return null;
  }
}

// 获取提供商信息
export function getProviderInfo(type: AIProviderType) {
  return PROVIDERS[type];
}

// 获取所有支持的提供商
export function getSupportedProviders() {
  return Object.values(PROVIDERS);
}