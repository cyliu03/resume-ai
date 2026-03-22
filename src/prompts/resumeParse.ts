// 简历解析相关 Prompt

export const RESUME_PARSE_SYSTEM_PROMPT = `你是一个专业的简历解析助手。你的任务是从简历文本中提取结构化信息。

你需要提取以下信息：
1. **个人资料 (profile)**：姓名、职位、邮箱、电话、地点、网站、LinkedIn、GitHub、个人简介
2. **技能 (skills)**：技能名称、分类、熟练程度、使用年限
3. **工作经历 (experiences)**：公司、职位、部门、地点、时间、亮点、技能
4. **项目经历 (projects)**：项目名、类型、描述、技术栈、亮点、时间、状态
5. **教育背景 (education)**：学校、学位、专业、时间、亮点

**重要规则**：
- 如果某些信息缺失，使用空字符串或空数组
- 技能分类从以下选项选择：前端框架、前端基础、后端语言、后端框架、数据库、云服务、DevOps、工具、设计、其他
- 技能等级从以下选项选择：了解、熟悉、熟练、精通
- 项目类型从以下选项选择：work、personal、open-source、learning
- 项目状态从以下选项选择：completed、in-progress、archived
- 时间格式统一为 YYYY-MM
- 必须返回有效的 JSON 格式

返回格式示例：
\`\`\`json
{
  "profile": {
    "name": "张三",
    "title": "高级前端工程师",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "location": "北京",
    "website": "",
    "linkedin": "",
    "github": "https://github.com/zhangsan",
    "summary": "5年前端开发经验，精通 React 和 Vue..."
  },
  "skills": [
    {
      "name": "React",
      "category": "前端框架",
      "level": "精通",
      "years": 4,
      "keywords": ["Hooks", "Redux", "Next.js"],
      "evidence": "使用 React 开发了多个大型项目"
    }
  ],
  "experiences": [
    {
      "company": "某科技公司",
      "position": "高级前端工程师",
      "department": "",
      "location": "北京",
      "startDate": "2020-03",
      "endDate": "2024-01",
      "current": false,
      "highlights": ["负责核心产品前端架构设计", "优化性能提升30%"],
      "skills": ["React", "TypeScript"],
      "industry": "互联网"
    }
  ],
  "projects": [
    {
      "name": "企业级管理后台",
      "type": "work",
      "description": "基于 React + TypeScript 的企业级管理系统",
      "technologies": ["React", "TypeScript", "Ant Design"],
      "highlights": ["独立完成前端架构", "支持权限管理"],
      "startDate": "2021-01",
      "endDate": "2021-06",
      "status": "completed"
    }
  ],
  "education": [
    {
      "school": "北京大学",
      "degree": "本科",
      "major": "计算机科学与技术",
      "startDate": "2016-09",
      "endDate": "2020-06",
      "highlights": ["GPA 3.8/4.0", "获得国家奖学金"]
    }
  ]
}
\`\`\`
`;

export function parseResumePrompt(resumeText: string): string {
  return `请解析以下简历内容，提取结构化信息。只返回 JSON，不要其他解释。

---
简历内容：
${resumeText}
---

请返回 JSON 格式的解析结果。`;
}

// 验证解析结果
export function validateParsedResume(data: unknown): data is ParsedResume {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  // 必须包含 profile
  if (!obj.profile || typeof obj.profile !== 'object') return false;
  
  // skills 必须是数组
  if (!Array.isArray(obj.skills)) return false;
  
  // experiences 必须是数组
  if (!Array.isArray(obj.experiences)) return false;
  
  // projects 必须是数组
  if (!Array.isArray(obj.projects)) return false;
  
  // education 必须是数组
  if (!Array.isArray(obj.education)) return false;
  
  return true;
}

// 解析后的简历类型
export interface ParsedResume {
  profile: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
  };
  skills: Array<{
    name: string;
    category: string;
    level: '了解' | '熟悉' | '熟练' | '精通';
    years: number;
    keywords: string[];
    evidence: string;
  }>;
  experiences: Array<{
    company: string;
    position: string;
    department?: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    highlights: string[];
    skills: string[];
    industry?: string;
  }>;
  projects: Array<{
    name: string;
    type: 'work' | 'personal' | 'open-source' | 'learning';
    description: string;
    technologies: string[];
    highlights: string[];
    startDate: string;
    endDate: string | null;
    status: 'completed' | 'in-progress' | 'archived';
  }>;
  education: Array<{
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
}

// 默认解析结果
export const defaultParsedResume: ParsedResume = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  skills: [],
  experiences: [],
  projects: [],
  education: [],
};