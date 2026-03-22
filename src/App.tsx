import { useEffect } from 'react';
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
import { Header } from './components/Header';
import { FormPanel } from './components/FormPanel';
import { ResumePreview } from './components/ResumePreview';
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

// 简历编辑页面
function ResumeEditor() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Form Panel */}
        <div className="w-1/2 border-r border-gray-200 overflow-hidden">
          <FormPanel />
        </div>

        {/* Right: Preview Panel */}
        <div className="w-1/2 bg-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="bg-gray-700 text-white text-center py-2 text-sm font-medium no-print">
              实时预览
            </div>
            <ResumePreview className="flex-1" />
          </div>
        </div>
      </main>
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
            </Route>
            {/* 简历编辑器（独立布局） */}
            <Route path="/resume" element={<ResumeEditor />} />
          </Routes>
        </ResumeProvider>
      </DatabaseInitializer>
    </BrowserRouter>
  );
}

export default App;