import { createProvider, AIProviderError } from './ai';
import { useAIStore } from '../store/aiStore';
import type {
  APIKeyConfig,
  ChatMessage,
  GenerateOptions,
  GenerateResult,
  ParsedJD,
  SkillGap,
} from '../types/ai';
import type { PersonalDatabase, Skill } from '../types/database';
import {
  RESUME_SYSTEM_PROMPT,
  generateResumePrompt,
  optimizeSectionPrompt,
} from '../prompts/resume';
import {
  JD_PARSE_SYSTEM_PROMPT,
  parseJDPrompt,
  validateParsedJD,
  defaultParsedJD,
} from '../prompts/jd';
import {
  SKILL_ANALYSIS_SYSTEM_PROMPT,
  analyzeSkillGapPrompt,
  validateSkillGaps,
  calculateMatchScore,
} from '../prompts/skill';
import {
  RESUME_PARSE_SYSTEM_PROMPT,
  parseResumePrompt,
  validateParsedResume,
  defaultParsedResume,
  type ParsedResume,
} from '../prompts/resumeParse';

// AI 服务类
export class AIService {
  private static instance: AIService;
  private provider: ReturnType<typeof createProvider> = null;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // 设置提供商
  setProvider(config: APIKeyConfig) {
    this.provider = createProvider(config);
    return this.provider !== null;
  }

  // 清除提供商
  clearProvider() {
    this.provider = null;
  }

  // 获取当前提供商
  getProvider() {
    return this.provider;
  }

  // 通用聊天方法
  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<GenerateResult> {
    if (!this.provider) {
      throw new Error('未配置 AI 提供商，请先在设置中配置 API Key');
    }

    const startTime = Date.now();
    try {
      const result = await this.provider.chat(messages, options);
      const duration = Date.now() - startTime;

      // 记录历史
      const cost = this.provider.estimateCost(
        result.usage?.totalTokens || 0
      );

      useAIStore.getState().addHistory({
        provider: result.provider,
        model: result.model,
        prompt: messages.map((m) => m.content).join('\n'),
        response: result.content,
        tokens: {
          prompt: result.usage?.promptTokens || 0,
          completion: result.usage?.completionTokens || 0,
          total: result.usage?.totalTokens || 0,
        },
        cost,
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof AIProviderError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Unknown error';

      useAIStore.getState().addHistory({
        provider: this.provider.type,
        model: 'unknown',
        prompt: messages.map((m) => m.content).join('\n'),
        response: '',
        tokens: { prompt: 0, completion: 0, total: 0 },
        cost: 0,
        duration,
        success: false,
        error: errorMessage,
      });

      throw error;
    }
  }

  // 生成简历
  async generateResume(jd: ParsedJD, profile: PersonalDatabase): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: RESUME_SYSTEM_PROMPT },
      { role: 'user', content: generateResumePrompt(profile, jd) },
    ];

    const result = await this.chat(messages, {
      temperature: 0.7,
      maxTokens: 4000,
    });

    return result.content;
  }

  // 解析 JD
  async parseJD(jdText: string): Promise<ParsedJD> {
    const messages: ChatMessage[] = [
      { role: 'system', content: JD_PARSE_SYSTEM_PROMPT },
      { role: 'user', content: parseJDPrompt(jdText) },
    ];

    try {
      const result = await this.chat(messages, {
        temperature: 0.3,
        maxTokens: 2000,
      });

      // 尝试解析 JSON
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (validateParsedJD(parsed)) {
          return parsed;
        }
      }

      // 解析失败，返回默认值
      console.warn('JD 解析结果验证失败，返回默认值');
      return {
        ...defaultParsedJD,
        title: '解析失败',
        requirements: ['请手动输入职位要求'],
      };
    } catch (error) {
      console.error('JD 解析失败:', error);
      return {
        ...defaultParsedJD,
        title: '解析失败',
        requirements: ['请手动输入职位要求'],
      };
    }
  }

  // 分析技能缺口
  async analyzeSkillGap(jd: ParsedJD, skills: Skill[]): Promise<SkillGap[]> {
    if (skills.length === 0) {
      return [];
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SKILL_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: analyzeSkillGapPrompt(skills, jd) },
    ];

    try {
      const result = await this.chat(messages, {
        temperature: 0.5,
        maxTokens: 2000,
      });

      // 尝试解析 JSON
      const jsonMatch = result.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (validateSkillGaps(parsed)) {
          return parsed;
        }
      }

      // 解析失败，返回空数组
      console.warn('技能缺口分析结果验证失败');
      return [];
    } catch (error) {
      console.error('技能缺口分析失败:', error);
      return [];
    }
  }

  // 优化简历某一部分
  async optimizeSection(
    section: string,
    content: string,
    jd: ParsedJD
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: RESUME_SYSTEM_PROMPT },
      { role: 'user', content: optimizeSectionPrompt(section, content, jd) },
    ];

    const result = await this.chat(messages, {
      temperature: 0.6,
      maxTokens: 1000,
    });

    return result.content;
  }

  // 计算匹配度
  calculateMatch(skills: Skill[], jd: ParsedJD): number {
    return calculateMatchScore(skills, jd);
  }

  // 测试 API 连接
  async testConnection(config: APIKeyConfig): Promise<{
    success: boolean;
    message: string;
    model?: string;
  }> {
    try {
      const success = this.setProvider(config);
      if (!success) {
        return { success: false, message: '不支持的提供商类型' };
      }

      const result = await this.chat(
        [{ role: 'user', content: 'Hello, this is a test message. Please respond with "OK".' }],
        { temperature: 0, maxTokens: 10 }
      );

      return {
        success: true,
        message: '连接成功',
        model: result.model,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '连接失败，请检查 API Key',
      };
    }
  }

  // 解析简历
  async parseResume(resumeText: string): Promise<ParsedResume> {
    const messages: ChatMessage[] = [
      { role: 'system', content: RESUME_PARSE_SYSTEM_PROMPT },
      { role: 'user', content: parseResumePrompt(resumeText) },
    ];

    try {
      const result = await this.chat(messages, {
        temperature: 0.2,
        maxTokens: 4000,
      });

      // 尝试解析 JSON
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (validateParsedResume(parsed)) {
          return parsed;
        }
      }

      // 解析失败，返回默认值
      console.warn('简历解析结果验证失败，返回默认值');
      return {
        ...defaultParsedResume,
        profile: {
          ...defaultParsedResume.profile,
          name: '解析失败',
        },
      };
    } catch (error) {
      console.error('简历解析失败:', error);
      return {
        ...defaultParsedResume,
        profile: {
          ...defaultParsedResume.profile,
          name: '解析失败',
        },
      };
    }
  }
}

// 导出单例
export const aiService = AIService.getInstance();

// Hook for using AI service with store integration
export function useAIService() {
  const { getActiveProvider, defaultModel } = useAIStore();

  const ensureProvider = () => {
    const activeProvider = getActiveProvider();
    if (!activeProvider) {
      throw new Error('未配置 AI 提供商，请先在设置中配置 API Key');
    }
    aiService.setProvider(activeProvider);
    return activeProvider;
  };

  return {
    // 生成简历
    generateResume: async (jd: ParsedJD, profile: PersonalDatabase) => {
      ensureProvider();
      return aiService.generateResume(jd, profile);
    },

    // 解析 JD
    parseJD: async (jdText: string) => {
      ensureProvider();
      return aiService.parseJD(jdText);
    },

    // 分析技能缺口
    analyzeSkillGap: async (jd: ParsedJD, skills: Skill[]) => {
      ensureProvider();
      return aiService.analyzeSkillGap(jd, skills);
    },

    // 优化简历部分
    optimizeSection: async (section: string, content: string, jd: ParsedJD) => {
      ensureProvider();
      return aiService.optimizeSection(section, content, jd);
    },

    // 计算匹配度
    calculateMatch: (skills: Skill[], jd: ParsedJD) => {
      return aiService.calculateMatch(skills, jd);
    },

    // 测试连接
    testConnection: async (config: Omit<APIKeyConfig, 'id' | 'createdAt'>) => {
      return aiService.testConnection(config as APIKeyConfig);
    },

    // 通用聊天
    chat: async (messages: ChatMessage[], options?: GenerateOptions) => {
      ensureProvider();
      return aiService.chat(messages, options);
    },

    // 解析简历
    parseResume: async (resumeText: string) => {
      ensureProvider();
      return aiService.parseResume(resumeText);
    },

    // 获取默认模型
    defaultModel,
  };
}