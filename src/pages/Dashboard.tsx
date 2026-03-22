import { useMemo, useState, useEffect } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';
import { useDatabaseStore } from '../store/databaseStore';
import { useAIStore } from '../store/aiStore';
import { SKILL_LEVEL_VALUES, PROJECT_STATUS_LABELS } from '../types/database';
import { WelcomeCard, shouldShowWelcomeCard } from '../components/WelcomeGuide';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const { database } = useDatabaseStore();
  const { getActiveProvider } = useAIStore();
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);

  useEffect(() => {
    if (shouldShowWelcomeCard()) {
      setShowWelcomeCard(true);
    }
  }, []);

  const hasAIConfigured = !!getActiveProvider();

  // 技能雷达图数据 - 按分类聚合
  const radarData = useMemo(() => {
    const categoryMap = new Map<string, { total: number; count: number }>();

    database.skills.forEach((skill) => {
      const existing = categoryMap.get(skill.category) || { total: 0, count: 0 };
      categoryMap.set(skill.category, {
        total: existing.total + SKILL_LEVEL_VALUES[skill.level],
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      value: Math.round(data.total / data.count * 25), // 转换为百分制
      fullMark: 100,
    }));
  }, [database.skills]);

  // 项目状态分布
  const projectStatusData = useMemo(() => {
    const statusMap = new Map<string, number>();
    database.projects.forEach((project) => {
      statusMap.set(project.status, (statusMap.get(project.status) || 0) + 1);
    });
    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS],
      value: count,
    }));
  }, [database.projects]);

  // 统计数据
  const stats = useMemo(() => ({
    totalSkills: database.skills.length,
    totalExperiences: database.experiences.length,
    totalProjects: database.projects.length,
    totalEducation: database.education.length,
    currentCompany: database.experiences.find((e) => e.current)?.company || '未设置',
    topSkills: database.skills
      .sort((a, b) => SKILL_LEVEL_VALUES[b.level] - SKILL_LEVEL_VALUES[a.level])
      .slice(0, 5),
  }), [database]);

  if (database.skills.length === 0 && database.experiences.length === 0) {
    return (
      <div className="space-y-6">
        {/* 空状态 - 快速开始流程 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-16 h-1 bg-gray-300 rounded" />
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-16 h-1 bg-gray-300 rounded" />
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">三步打造完美简历</h2>
            <p className="text-gray-600">上传现有简历，我们帮你自动解析填充</p>
          </div>

          {/* 第一步：导入简历 - 最突出 */}
          <div className="max-w-xl mx-auto mb-8">
            <Link
              to="/ai-assistant"
              className="block p-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
                  📤
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">第一步：导入现有简历</h3>
                  <p className="text-green-100">上传 PDF/Word 简历，AI 自动解析填充数据</p>
                  <p className="text-green-200 text-sm mt-2">支持快速模式和详细模式 →</p>
                </div>
                <div className="text-white/60 group-hover:translate-x-1 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* 其他选项 */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            <Link
              to="/skills"
              className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group text-center"
            >
              <div className="text-2xl mb-2">💡</div>
              <div className="font-medium text-gray-800 group-hover:text-blue-600">手动添加技能</div>
              <div className="text-sm text-gray-500 mt-1">没有简历？从头开始</div>
            </Link>
            <Link
              to="/settings"
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group text-center"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-medium text-gray-800 group-hover:text-purple-600">配置 AI</div>
              <div className="text-sm text-gray-500 mt-1">解锁智能功能</div>
            </Link>
          </div>

          {/* AI 提示 */}
          {!hasAIConfigured && (
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-amber-800">
                  <span className="font-medium">提示：</span>
                  导入简历需要 AI 功能。请先
                  <Link to="/settings" className="underline hover:text-amber-900 font-medium">配置 AI API Key</Link>
                  （推荐使用 Gemini 免费额度）
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 功能介绍 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">ResumeAI 能帮你做什么？</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📤</div>
              <div className="font-medium text-gray-800">简历导入</div>
              <div className="text-sm text-gray-500 mt-1">一键解析现有简历</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-medium text-gray-800">ATS 分析</div>
              <div className="text-sm text-gray-500 mt-1">匹配 JD 关键词</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎤</div>
              <div className="font-medium text-gray-800">面试模拟</div>
              <div className="text-sm text-gray-500 mt-1">AI 真实演练</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-medium text-gray-800">9 款模板</div>
              <div className="text-sm text-gray-500 mt-1">一键切换风格</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 欢迎卡片 */}
      {showWelcomeCard && (
        <WelcomeCard onDismiss={() => setShowWelcomeCard(false)} />
      )}

      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">概览</h1>
        <p className="text-gray-600 mt-1">您的职业数据档案一目了然</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="技能总数"
          value={stats.totalSkills}
          icon="💡"
          color="blue"
        />
        <StatCard
          title="工作经历"
          value={stats.totalExperiences}
          icon="💼"
          color="green"
        />
        <StatCard
          title="项目经验"
          value={stats.totalProjects}
          icon="🚀"
          color="purple"
        />
        <StatCard
          title="教育背景"
          value={stats.totalEducation}
          icon="🎓"
          color="orange"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 技能雷达图 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">技能分布</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="技能水平"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              暂无技能数据，请先添加技能
            </div>
          )}
        </div>

        {/* 项目状态分布 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">项目状态</h2>
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              暂无项目数据，请先添加项目
            </div>
          )}
        </div>
      </div>

      {/* 快速访问 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 最近工作 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">当前工作</h2>
            <Link to="/experiences" className="text-blue-600 text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {stats.currentCompany !== '未设置' ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                  🏢
                </div>
                <div>
                  <p className="font-medium text-gray-800">{stats.currentCompany}</p>
                  <p className="text-sm text-gray-500">
                    {database.experiences.find((e) => e.current)?.position}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">暂无当前工作记录</p>
            )}
          </div>
        </div>

        {/* 顶级技能 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">核心技能</h2>
            <Link to="/skills" className="text-blue-600 text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="space-y-2">
            {stats.topSkills.length > 0 ? (
              stats.topSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-gray-800">{skill.name}</span>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {skill.level}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">暂无技能记录</p>
            )}
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">快捷操作</h2>
          <div className="space-y-2">
            <Link
              to="/ai-assistant"
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📤</span>
              导入简历
            </Link>
            <Link
              to="/resume"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              生成简历
            </Link>
            <Link
              to="/learning"
              className="block w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-center hover:bg-purple-200 transition-colors"
            >
              学习中心
            </Link>
            <Link
              to="/settings"
              state={{ tab: 'help' }}
              className="block w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-center hover:from-indigo-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📖</span>
              使用指南
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}