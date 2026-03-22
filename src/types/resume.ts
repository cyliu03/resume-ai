export interface PersonalInfo {
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

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'professional' | 'tech' | 'executive' | 'academic' | 'creative' | 'colorful';

// 排版设置接口
export interface LayoutSettings {
  // 字体大小
  titleSize: number;      // 标题字号 (pt)
  headingSize: number;    // 小标题字号 (pt)
  bodySize: number;       // 正文字号 (pt)
  smallSize: number;      // 小字字号 (pt)
  // 间距
  lineHeight: number;     // 行高倍数
  sectionGap: number;     // 段落间距 (px)
  itemGap: number;        // 条目间距 (px)
  // 页边距
  marginTop: number;      // 上边距 (mm)
  marginBottom: number;   // 下边距 (mm)
  marginLeft: number;     // 左边距 (mm)
  marginRight: number;    // 右边距 (mm)
  // 颜色主题
  primaryColor: string;   // 主色调
  accentColor: string;    // 强调色
  textColor: string;      // 文字颜色
}

// 预设排版方案
export type LayoutPreset = 'compact' | 'standard' | 'loose';

export const defaultLayoutSettings: LayoutSettings = {
  titleSize: 24,
  headingSize: 14,
  bodySize: 11,
  smallSize: 9,
  lineHeight: 1.5,
  sectionGap: 16,
  itemGap: 8,
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  primaryColor: '#2563eb',
  accentColor: '#1e40af',
  textColor: '#374151',
};

export const layoutPresets: Record<LayoutPreset, LayoutSettings> = {
  compact: {
    titleSize: 22,
    headingSize: 13,
    bodySize: 10,
    smallSize: 8,
    lineHeight: 1.3,
    sectionGap: 10,
    itemGap: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    primaryColor: '#2563eb',
    accentColor: '#1e40af',
    textColor: '#374151',
  },
  standard: defaultLayoutSettings,
  loose: {
    titleSize: 26,
    headingSize: 15,
    bodySize: 12,
    smallSize: 10,
    lineHeight: 1.7,
    sectionGap: 24,
    itemGap: 12,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 18,
    marginRight: 18,
    primaryColor: '#2563eb',
    accentColor: '#1e40af',
    textColor: '#374151',
  },
};

// 导出数据格式（包含简历数据和排版设置）
export interface ExportData {
  version: string;
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  layoutSettings: LayoutSettings;
}