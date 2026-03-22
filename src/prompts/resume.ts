// 简历生成 Prompt 模板

import type { PersonalDatabase } from '../types/database';
import type { ParsedJD } from '../types/ai';

// 系统提示词
export const RESUME_SYSTEM_PROMPT = `你是一位专业的简历撰写专家和职业顾问。你的任务是根据求职者的背景信息和目标职位描述，帮助撰写一份专业、精准、有吸引力的简历。

你的原则：
1. 突出与目标职位最相关的经历和技能
2. 使用具体的数字和成果来量化成就
3. 使用行业关键词提高 ATS 系统匹配度
4. 保持语言简洁、专业、有力
5. 针对每个职位定制简历内容

输出格式要求：
- 使用 Markdown 格式
- 包含：个人简介、工作经历、项目经历、技能、教育背景
- 每段工作经历使用 STAR 方法描述成就
- 技能部分分类展示`;

// 用户提示词模板
export function generateResumePrompt(
  profile: PersonalDatabase,
  jd: ParsedJD
): string {
  return `请根据以下信息，为求职者撰写一份针对目标职位的简历。

## 求职者背景信息

### 个人信息
- 姓名：${profile.profile.name || '未填写'}
- 职位：${profile.profile.title || '未填写'}
- 邮箱：${profile.profile.email || '未填写'}
- 电话：${profile.profile.phone || '未填写'}
- 所在地：${profile.profile.location || '未填写'}
- 个人简介：${profile.profile.summary || '未填写'}

### 工作经历
${profile.experiences.map((exp) => `
**${exp.company}** | ${exp.position} | ${exp.startDate} - ${exp.current ? '至今' : exp.endDate}
- 地点：${exp.location}
- 部门：${exp.department || '未填写'}
- 核心亮点：${exp.highlights.join('、')}
- 成就：${exp.achievements || '未填写'}
`).join('\n')}

### 项目经历
${profile.projects.map((proj) => `
**${proj.name}** | ${proj.startDate} - ${proj.endDate || '进行中'}
- 类型：${proj.type}
- 描述：${proj.description}
- 技术栈：${proj.technologies.join('、')}
- 亮点：${proj.highlights.join('、')}
- 链接：${proj.link || '无'}
`).join('\n')}

### 技能
${profile.skills.map((skill) => `
**${skill.category}**
- ${skill.name}：${skill.level}（${skill.years}年经验）
- 证明：${skill.evidence}
`).join('\n')}

### 教育背景
${profile.education.map((edu) => `
**${edu.school}** | ${edu.degree} | ${edu.major}
- 时间：${edu.startDate} - ${edu.endDate}
- GPA：${edu.gpa || '未填写'}
- 亮点：${edu.highlights.join('、')}
`).join('\n')}

### 证书
${profile.certificates.map((cert) => `
- ${cert.name}（${cert.issuer}，${cert.date}）
`).join('\n')}

## 目标职位信息

### 职位描述
- 职位名称：${jd.title}
- 公司名称：${jd.company}
- 工作地点：${jd.location}

### 职位要求
${jd.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### 工作职责
${jd.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### 技能要求
${jd.skills.join('、')}

### 经验要求
${jd.experience.min}-${jd.experience.max} 年

### 学历要求
${jd.education.level}${jd.education.field ? `，${jd.education.field}专业` : ''}

## 要求

请根据以上信息，撰写一份针对该职位的简历。注意：
1. 突出与职位要求最相关的经历和技能
2. 调整工作经历的描述方式，使其更贴近职位要求
3. 选择最相关的项目经历
4. 技能部分要与职位要求的技能匹配
5. 个人简介要突出与职位的匹配度

请直接输出简历内容，使用 Markdown 格式。`;
}

// 优化简历某一部分的 Prompt
export function optimizeSectionPrompt(
  section: string,
  content: string,
  jd: ParsedJD
): string {
  return `请优化简历的"${section}"部分，使其更好地匹配目标职位。

## 原始内容
${content}

## 目标职位要求
- 职位：${jd.title}
- 关键技能：${jd.skills.join('、')}
- 核心要求：${jd.requirements.slice(0, 5).join('；')}

## 优化要求
1. 使用更专业的行业术语
2. 添加量化数据和具体成果
3. 突出与职位相关的关键词
4. 保持简洁有力

请直接输出优化后的内容，不要解释。`;
}