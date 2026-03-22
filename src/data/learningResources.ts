// 学习资源数据 - 对接真实课程平台

export interface LearningResource {
  id: string;
  name: string;
  provider: 'coursera' | 'udemy' | 'youtube' | 'github' | '官方文档';
  url: string;
  description: string;
  type: '课程' | '教程' | '文档' | '项目';
  difficulty: '入门' | '中级' | '高级';
  duration?: string;
  isFree: boolean;
  tags: string[];
  rating?: number;
}

export interface UserLearningProgress {
  resourceId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
}

export const difficultyLabels: Record<string, string> = {
  '入门': '入门',
  '中级': '中级',
  '高级': '高级',
};

export const resourceTypeLabels: Record<string, string> = {
  '课程': '课程',
  '教程': '教程',
  '文档': '文档',
  '项目': '项目',
};

// 学习路径
export const learningPaths: Array<{
  id: string;
  name: string;
  description: string;
  targetRole: string;
  duration: string;
}> = [
  { id: 'frontend', name: '前端开发', description: '前端学习路径', targetRole: '前端工程师', duration: '6个月' },
  { id: 'backend', name: '后端开发', description: '后端学习路径', targetRole: '后端工程师', duration: '6个月' },
  { id: 'fullstack', name: '全栈开发', description: '全栈学习路径', targetRole: '全栈工程师', duration: '12个月' },
];

// 获取技能对应的学习资源
export function getResourcesForSkill(skillName: string): LearningResource[] {
  const normalized = skillName.toLowerCase();
  const resources: LearningResource[] = [];
  
  // 根据技能匹配资源
  if (normalized.includes('react')) {
    resources.push(
      { id: 'react-official', name: 'React 官方文档', provider: '官方文档', url: 'https://react.dev/', description: 'React 官方文档', type: '文档', difficulty: '入门', isFree: true, tags: ['React'], rating: 5 },
      { id: 'react-coursera', name: 'Meta Front-End Developer', provider: 'coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', description: 'Meta 前端认证', type: '课程', difficulty: '中级', duration: '7个月', isFree: false, tags: ['React'], rating: 4.8 }
    );
  }
  if (normalized.includes('vue')) {
    resources.push({ id: 'vue-official', name: 'Vue.js 官方教程', provider: '官方文档', url: 'https://vuejs.org/guide/', description: 'Vue 官方文档', type: '文档', difficulty: '入门', isFree: true, tags: ['Vue'], rating: 5 });
  }
  if (normalized.includes('typescript') || normalized.includes('ts')) {
    resources.push({ id: 'ts-official', name: 'TypeScript 官方手册', provider: '官方文档', url: 'https://www.typescriptlang.org/docs/', description: 'TS 官方文档', type: '文档', difficulty: '入门', isFree: true, tags: ['TypeScript'], rating: 5 });
  }
  if (normalized.includes('python')) {
    resources.push(
      { id: 'python-official', name: 'Python 官方教程', provider: '官方文档', url: 'https://docs.python.org/zh-cn/3/tutorial/', description: 'Python 中文教程', type: '文档', difficulty: '入门', isFree: true, tags: ['Python'], rating: 5 },
      { id: 'python-coursera', name: 'Python for Everybody', provider: 'coursera', url: 'https://www.coursera.org/specializations/python', description: 'Python 入门专项', type: '课程', difficulty: '入门', duration: '8个月', isFree: false, tags: ['Python'], rating: 4.8 }
    );
  }
  if (normalized.includes('node') || normalized.includes('nodejs')) {
    resources.push({ id: 'node-official', name: 'Node.js 官方文档', provider: '官方文档', url: 'https://nodejs.org/docs/latest/api/', description: 'Node API 文档', type: '文档', difficulty: '中级', isFree: true, tags: ['Node.js'], rating: 5 });
  }
  if (normalized.includes('docker')) {
    resources.push({ id: 'docker-official', name: 'Docker 官方文档', provider: '官方文档', url: 'https://docs.docker.com/', description: 'Docker 文档', type: '文档', difficulty: '入门', isFree: true, tags: ['Docker'], rating: 5 });
  }
  if (normalized.includes('machine') || normalized.includes('ml') || normalized.includes('ai')) {
    resources.push({ id: 'ml-coursera', name: 'Machine Learning (Andrew Ng)', provider: 'coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction', description: '吴恩达机器学习', type: '课程', difficulty: '中级', duration: '3个月', isFree: false, tags: ['ML', 'AI'], rating: 4.9 });
  }
  
  return resources;
}

// 获取推荐项目
export function getProjectsForSkills(skills: string[]): Array<{ name: string; description: string; url: string; difficulty: string; tags: string[] }> {
  const projects: Array<{ name: string; description: string; url: string; difficulty: string; tags: string[] }> = [];

  if (skills.some(s => ['React', 'Vue', 'JavaScript', 'TypeScript'].includes(s))) {
    projects.push({ name: 'Todo App', description: '待办事项应用', url: 'https://github.com/tastejs/todomvc', difficulty: '入门', tags: ['前端'] });
    projects.push({ name: 'Weather App', description: '天气应用', url: 'https://openweathermap.org/api', difficulty: '入门', tags: ['API'] });
  }

  if (skills.some(s => ['Node.js', 'Python', 'Express'].includes(s))) {
    projects.push({ name: 'Blog Platform', description: '博客平台', url: 'https://github.com/gothinkster/realworld', difficulty: '中级', tags: ['全栈'] });
  }

  if (skills.some(s => ['Machine Learning', 'Python', 'AI'].includes(s))) {
    projects.push({ name: 'Image Classifier', description: '图像分类器', url: 'https://www.tensorflow.org/tutorials/images/classification', difficulty: '中级', tags: ['AI'] });
  }

  return projects;
}