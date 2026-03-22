import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { useDatabaseStore } from './store/databaseStore';
import { useAIStore } from './store/aiStore';
import { useApplicationStore } from './store/applicationStore';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { LearningCenterPage } from './pages/LearningCenterPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { FormPanel } from './components/FormPanel';
import { ResumePreview } from './components/ResumePreview';
import { TemplateSelector } from './components/TemplateSelector';
import { LayoutSettingsPanel } from './components/LayoutSettingsPanel';
import './index.css';

// 数据库初始化组件
function DatabaseInitializer({ children }: { children: React.ReactNode }) {
  const { init, isInitialized } = useDatabaseStore();
  const { init: initAI, isInitialized: isAIInitialized } = useAIStore();
  const { init: initApps, isInitialized: isAppsInitialized } = useApplicationStore();

  useEffect(() => {
    init();
    initAI();
    initApps();
  }, [init, initAI, initApps]);

  if (!isInitialized || !isAIInitialized || !isAppsInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// 简历编辑页面（集成到主布局）
function ResumeEditor() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);

  return (
    <div className="h-full flex flex-col -m-6">
      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">简历编辑器</h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            更换模板
          </button>
          <button
            onClick={() => setShowLayoutSettings(!showLayoutSettings)}
            className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            布局设置
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 模板选择器 */}
        {showTemplates && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-auto flex-shrink-0 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">选择模板</h3>
            <TemplateSelector />
          </div>
        )}

        {/* 左侧：表单面板 */}
        <div className="flex-1 min-w-[400px] border-r border-gray-200 overflow-auto bg-white">
          <FormPanel />
        </div>

        {/* 右侧：预览面板 */}
        <div className="flex-1 min-w-[500px] bg-gray-100 flex flex-col">
          <div className="bg-gray-700 text-white text-center py-2 text-sm font-medium">
            实时预览
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ResumePreview className="bg-white shadow-lg mx-auto" />
          </div>
        </div>

        {/* 布局设置面板 */}
        <LayoutSettingsPanel 
          isOpen={showLayoutSettings} 
          onClose={() => setShowLayoutSettings(false)} 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DatabaseInitializer>
        <ResumeProvider>
          <Routes>
            {/* 主应用布局 */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="learning" element={<LearningCenterPage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="experiences" element={<ExperiencesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="interview" element={<InterviewPrepPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="resume" element={<ResumeEditor />} />
            </Route>
          </Routes>
        </ResumeProvider>
      </DatabaseInitializer>
    </BrowserRouter>
  );
}

export default App;