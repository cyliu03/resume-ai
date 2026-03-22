// JD 解析 Prompt 模板

import type { ParsedJD } from '../types/ai';

export const JD_PARSE_SYSTEM_PROMPT = `你是一位专业的职位描述解析专家。你的任务是从招聘信息中提取关键信息，帮助求职者理解职位要求。

你需要提取以下信息：
1. 职位名称
2. 公司名称
3. 工作地点
4. 职位要求（列表形式）
5. 工作职责（列表形式）
6. 技能要求（列表形式）
7. 经验要求（年限范围）
8. 学历要求
9. 福利待遇（可选）
10. 关键词（用于简历优化）

输出格式：JSON`;

export function parseJDPrompt(jdText: string): string {
  return `请解析以下职位描述，提取关键信息。

## 职位描述

${jdText}

## 输出要求

请以 JSON 格式输出，包含以下字段：
{
  "title": "职位名称",
  "company": "公司名称",
  "location": "工作地点",
  "requirements": ["要求1", "要求2", ...],
  "responsibilities": ["职责1", "职责2", ...],
  "skills": ["技能1", "技能2", ...],
  "experience": {
    "min": 最小年限,
    "max": 最大年限,
    "preferred": "偏好描述"
  },
  "education": {
    "level": "学历要求",
    "field": "专业要求"
  },
  "benefits": ["福利1", "福利2", ...],
  "keywords": ["关键词1", "关键词2", ...]
}

注意：
1. 如果某些信息缺失，使用默认值（如 experience.min = 0）
2. 技能要去重并分类整理
3. 关键词提取职位核心要求相关的词汇
4. 只输出 JSON，不要有其他内容`;
}

// 默认解析结果
export const defaultParsedJD: ParsedJD = {
  title: '',
  company: '',
  location: '',
  requirements: [],
  responsibilities: [],
  skills: [],
  experience: {
    min: 0,
    max: 10,
    preferred: '',
  },
  education: {
    level: '',
    field: '',
  },
  benefits: [],
  keywords: [],
};

// 验证解析结果
export function validateParsedJD(data: unknown): data is ParsedJD {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.title === 'string' &&
    typeof obj.company === 'string' &&
    typeof obj.location === 'string' &&
    Array.isArray(obj.requirements) &&
    Array.isArray(obj.responsibilities) &&
    Array.isArray(obj.skills) &&
    typeof obj.experience === 'object' &&
    typeof obj.education === 'object'
  );
}