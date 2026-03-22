import type { ResumeData } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: '张三',
    title: '高级前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '深圳市',
    website: 'https://zhangsan.dev',
    linkedin: 'linkedin.com/in/zhangsan',
    github: 'github.com/zhangsan',
    summary: '拥有5年前端开发经验，专注于 React 生态和性能优化。曾主导多个大型项目从0到1的建设，具备良好的团队协作能力和技术分享热情。',
  },
  education: [
    {
      id: uuidv4(),
      school: '深圳理工大学',
      degree: '硕士',
      field: '计算机科学与技术',
      startDate: '2020-09',
      endDate: '2023-06',
      gpa: '3.8/4.0',
      achievements: '优秀毕业生、国家奖学金',
    },
    {
      id: uuidv4(),
      school: '华中科技大学',
      degree: '本科',
      field: '软件工程',
      startDate: '2016-09',
      endDate: '2020-06',
      gpa: '3.6/4.0',
      achievements: 'ACM程序设计竞赛银奖',
    },
  ],
  experience: [
    {
      id: uuidv4(),
      company: '字节跳动',
      position: '前端工程师',
      location: '深圳',
      startDate: '2023-07',
      endDate: '',
      current: true,
      responsibilities: `负责抖音创作者平台的前端架构设计与开发
优化首屏加载速度，将FCP从2.5s降低至1.2s
主导微前端架构迁移，提升团队开发效率30%`,
    },
    {
      id: uuidv4(),
      company: '腾讯',
      position: '前端开发实习生',
      location: '深圳',
      startDate: '2022-06',
      endDate: '2022-09',
      current: false,
      responsibilities: `参与微信小程序组件库开发
编写单元测试，测试覆盖率达到85%以上`,
    },
  ],
  projects: [
    {
      id: uuidv4(),
      name: '简历制作系统',
      description: '基于 React + TypeScript 的在线简历编辑器，支持实时预览、多套模板、PDF导出',
      technologies: 'React, TypeScript, TailwindCSS, Vite',
      link: 'https://github.com/zhangsan/resume-builder',
    },
    {
      id: uuidv4(),
      name: '低代码搭建平台',
      description: '可视化拖拽搭建H5页面，支持自定义组件和动画效果',
      technologies: 'React, DnD-Kit, Zustand, Canvas',
      link: 'https://github.com/zhangsan/low-code-platform',
    },
  ],
  skills: [
    {
      id: uuidv4(),
      category: '前端框架',
      items: 'React, Vue3, Next.js, Nuxt.js',
    },
    {
      id: uuidv4(),
      category: '编程语言',
      items: 'TypeScript, JavaScript, Node.js',
    },
    {
      id: uuidv4(),
      category: '工程化工具',
      items: 'Webpack, Vite, ESLint, Jest',
    },
    {
      id: uuidv4(),
      category: '其他技能',
      items: 'Git, Docker, CI/CD, 性能优化',
    },
  ],
};