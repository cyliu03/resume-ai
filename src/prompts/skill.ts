// 技能分析 Prompt 模板

import type { Skill } from '../types/database';
import type { ParsedJD, SkillGap } from '../types/ai';

export const SKILL_ANALYSIS_SYSTEM_PROMPT = `你是一位专业的职业发展顾问和技能分析师。你的任务是分析求职者的技能与目标职位要求的匹配程度，识别技能缺口，并提供改进建议。

你的分析应该：
1. 准确识别技能匹配度
2. 发现技能缺口
3. 提供具体的改进建议
4. 考虑技能的相关性和重要性

输出格式：JSON`;

export function analyzeSkillGapPrompt(
  skills: Skill[],
  jd: ParsedJD
): string {
  return `请分析求职者的技能与目标职位的匹配程度，识别技能缺口。

## 求职者技能

${skills.map((s) => `
- **${s.name}** (${s.category})
  - 等级：${s.level}
  - 经验：${s.years} 年
  - 证明：${s.evidence}
`).join('\n')}

## 目标职位技能要求

${jd.skills.join('、')}

## 职位详情

- 职位：${jd.title}
- 经验要求：${jd.experience.min}-${jd.experience.max} 年

## 输出要求

请以 JSON 数组格式输出技能缺口分析，每个缺口包含：
[
  {
    "skill": "技能名称",
    "required": true/false,
    "currentLevel": "当前等级，如果没有则为 null",
    "requiredLevel": "要求的等级",
    "gap": "差距描述",
    "suggestion": "改进建议"
  }
]

注意：
1. 只输出 JSON 数组，不要有其他内容
2. 按重要性排序，required 为 true 的在前
3. suggestion 要具体可行`;
}

// 默认技能缺口
export const defaultSkillGap: SkillGap = {
  skill: '',
  required: false,
  currentLevel: null,
  requiredLevel: '',
  gap: '',
  suggestion: '',
};

// 验证技能缺口分析结果
export function validateSkillGaps(data: unknown): data is SkillGap[] {
  if (!Array.isArray(data)) return false;

  return data.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const obj = item as Record<string, unknown>;
    return (
      typeof obj.skill === 'string' &&
      typeof obj.required === 'boolean' &&
      (obj.currentLevel === null || typeof obj.currentLevel === 'string') &&
      typeof obj.requiredLevel === 'string' &&
      typeof obj.gap === 'string' &&
      typeof obj.suggestion === 'string'
    );
  });
}

// 匹配度计算
export function calculateMatchScore(skills: Skill[], jd: ParsedJD): number {
  const jdSkillsLower = jd.skills.map((s) => s.toLowerCase());
  const userSkillsLower = skills.map((s) => s.name.toLowerCase());

  let matchCount = 0;
  for (const jdSkill of jdSkillsLower) {
    for (const userSkill of userSkillsLower) {
      if (userSkill.includes(jdSkill) || jdSkill.includes(userSkill)) {
        matchCount++;
        break;
      }
    }
  }

  return jdSkillsLower.length > 0
    ? Math.round((matchCount / jdSkillsLower.length) * 100)
    : 0;
}