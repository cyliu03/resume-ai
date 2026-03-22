import { NavLink, Outlet } from 'react-router-dom';
import { useDatabaseStore } from '../store/databaseStore';

const navItems = [
  { to: '/', label: '概览', icon: '📊' },
  { to: '/profile', label: '基本信息', icon: '👤' },
  { to: '/skills', label: '技能库', icon: '💡' },
  { to: '/experiences', label: '经历库', icon: '💼' },
  { to: '/projects', label: '项目库', icon: '🚀' },
  { to: '/applications', label: '投递管理', icon: '📤' },
  { to: '/ai-assistant', label: 'AI 助手', icon: '🤖' },
  { to: '/interview', label: '面试准备', icon: '🎯' },
  { to: '/resume', label: '简历编辑', icon: '📝' },
  { to: '/learning', label: '学习中心', icon: '📚' },
  { to: '/settings', label: '设置', icon: '⚙️' },
];

export function MainLayout() {
  const { database } = useDatabaseStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧导航栏 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            ResumeAI
          </h1>
          <p className="text-xs text-gray-500 mt-1">智能简历助手</p>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 用户信息 */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800 truncate">
              {database.profile.name || '未设置姓名'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {database.profile.title || '未设置职位'}
            </p>
          </div>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部状态栏 */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              最后更新: {new Date(database.lastUpdated).toLocaleString('zh-CN')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
              已同步
            </span>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}