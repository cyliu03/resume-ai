// 技能等级
export type SkillLevel = '了解' | '熟悉' | '熟练' | '精通';

// 技能来源
export type SkillSource = 'work' | 'project' | 'learning';

// 项目类型
export type ProjectType = 'work' | 'personal' | 'open-source' | 'learning';

// 项目状态
export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

// 技能
export interface Skill {
  id: string;
  name: string;
  category: string;        // 前端框架/后端/数据库/工具等
  level: SkillLevel;
  years: number;           // 使用年限
  keywords: string[];      // 相关关键词
  lastUsed: string;        // 最后使用时间
  evidence: string;        // 证明/描述
  source: SkillSource;     // 来源
  createdAt: string;
  updatedAt: string;
}

// 工作经历
export interface Experience {
  id: string;
  company: string;
  position: string;
  department?: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  highlights: string[];     // 核心亮点
  skills: string[];         // 关联的技能ID
  achievements?: string;    // 成就
  industry?: string;        // 行业
  createdAt: string;
  updatedAt: string;
}

// 项目
export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  technologies: string[];
  link?: string;
  repo?: string;
  highlights: string[];
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  skills: string[];         // 关联的技能ID
  createdAt: string;
  updatedAt: string;
}

// 教育
export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

// 证书
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  skills: string[];
  createdAt: string;
}

// 个人资料
export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

// 个人数据库
export interface PersonalDatabase {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
  version: string;
  lastUpdated: string;
}

// 技能分类
export const SKILL_CATEGORIES = [
  '前端框架',
  '前端基础',
  '后端语言',
  '后端框架',
  '数据库',
  '云服务',
  'DevOps',
  '工具',
  '设计',
  '其他',
] as const;

// 技能等级配置
export const SKILL_LEVELS: SkillLevel[] = ['了解', '熟悉', '熟练', '精通'];

// 技能等级数值映射（用于雷达图）
export const SKILL_LEVEL_VALUES: Record<SkillLevel, number> = {
  '了解': 1,
  '熟悉': 2,
  '熟练': 3,
  '精通': 4,
};

// 项目类型标签
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'work': '工作项目',
  'personal': '个人项目',
  'open-source': '开源项目',
  'learning': '学习项目',
};

// 项目状态标签
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'completed': '已完成',
  'in-progress': '进行中',
  'archived': '已归档',
};

// 默认个人资料
export const defaultProfile: Profile = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
};

// 默认数据库
export const defaultDatabase: PersonalDatabase = {
  profile: defaultProfile,
  skills: [],
  experiences: [],
  projects: [],
  education: [],
  certificates: [],
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};