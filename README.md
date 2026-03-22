# ResumeAI - 智能简历助手

> 基于 AI 的智能简历管理系统，帮助你打造完美简历

## ✨ 功能特性

- 📤 **简历导入** - 上传简历自动解析，快速填充数据
- 🎯 **面试准备** - 基于技能预测面试问题
- 📝 **简历编辑** - 拖拽排序，实时预览
- 🤖 **AI 助手** - JD 解析、技能匹配、简历生成
- 🔒 **隐私安全** - 支持 Ollama 本地部署，数据不出本地

## 🚀 快速开始

### 安装依赖

```bash
cd resume-builder
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 访问应用

打开浏览器访问 http://localhost:5173

## 📚 文档

- [Ollama 本地部署配置指南](./docs/OLLAMA_GUIDE.md) - 从零开始配置本地 AI 模型
- [产品设计文档](./PRODUCT_DESIGN.md)
- [改进计划](./PRODUCT_IMPROVEMENT_PLAN.md)

## 🔧 配置 AI

### 使用云端 API

1. 进入「设置」页面
2. 添加 AI 提供商（OpenAI、Claude、Gemini 等）
3. 输入 API Key
4. 测试连接

### 使用本地模型（推荐）

详见 [Ollama 本地部署配置指南](./docs/OLLAMA_GUIDE.md)

## 📁 项目结构

```
src/
├── components/     # UI 组件
├── pages/          # 页面
├── services/       # 服务层
│   └── ai/         # AI 适配器
├── store/          # 状态管理
├── types/          # 类型定义
├── context/        # React Context
└── utils/          # 工具函数
```

## 🛠️ 技术栈

- React + TypeScript
- TailwindCSS
- Zustand + IndexedDB
- React Router
- @dnd-kit

## 📄 License

MIT