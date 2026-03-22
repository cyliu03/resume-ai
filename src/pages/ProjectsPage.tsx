import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import {
  type Project,
  type ProjectType,
  type ProjectStatus,
  PROJECT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
} from '../types/database';

export function ProjectsPage() {
  const { database, addProject, updateProject, removeProject } = useDatabaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: 'work' as ProjectType,
    description: '',
    technologies: '',
    link: '',
    repo: '',
    highlights: '',
    startDate: '',
    endDate: '',
    status: 'completed' as ProjectStatus,
    skills: '',
  });

  // 打开新建模态框
  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      type: 'work',
      description: '',
      technologies: '',
      link: '',
      repo: '',
      highlights: '',
      startDate: '',
      endDate: '',
      status: 'completed',
      skills: '',
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      type: project.type,
      description: project.description,
      technologies: project.technologies.join(', '),
      link: project.link || '',
      repo: project.repo || '',
      highlights: project.highlights.join('\n'),
      startDate: project.startDate,
      endDate: project.endDate || '',
      status: project.status,
      skills: project.skills.join(', '),
    });
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      link: formData.link || undefined,
      repo: formData.repo || undefined,
      highlights: formData.highlights.split('\n').filter(Boolean),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setIsModalOpen(false);
  };

  // 过滤项目
  const filteredProjects = database.projects.filter((project) => {
    const matchesType = filterType === 'all' || project.type === filterType;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const statusColors = {
    'completed': 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'archived': 'bg-gray-100 text-gray-700',
  };

  const typeColors = {
    'work': 'bg-purple-100 text-purple-700',
    'personal': 'bg-orange-100 text-orange-700',
    'open-source': 'bg-pink-100 text-pink-700',
    'learning': 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">项目库</h1>
          <p className="text-gray-600 mt-1">管理您的项目经验和作品</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          添加项目
        </button>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">全部类型</option>
          {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">全部状态</option>
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 项目网格 */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* 卡片头部 */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[project.type]}`}>
                        {PROJECT_TYPE_LABELS[project.type]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* 技术栈 */}
              {project.technologies.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 亮点 */}
              {project.highlights.length > 0 && (
                <div className="px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">项目亮点</h4>
                  <ul className="space-y-1">
                    {project.highlights.slice(0, 3).map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {highlight}
                      </li>
                    ))}
                    {project.highlights.length > 3 && (
                      <li className="text-sm text-gray-400">
                        +{project.highlights.length - 3} 更多...
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* 链接 */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : '进行中'}
                </span>
                <div className="flex gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      🔗 访问
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      📦 仓库
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无项目</h3>
          <p className="text-gray-600 mb-4">开始添加您的项目经验吧</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加第一个项目
          </button>
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProject ? '编辑项目' : '添加项目'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    项目名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      类型
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      状态
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述 *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="简要描述项目的目标和您的作用..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  技术栈
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="用逗号分隔，例如：React, TypeScript, Node.js"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    项目链接
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    代码仓库
                  </label>
                  <input
                    type="url"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期 *
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目亮点
                </label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="每行一个亮点，例如：&#10;实现了核心用户认证模块&#10;优化了数据库查询性能&#10;编写了完整的技术文档"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  关联技能（技能ID，用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="技能ID，用逗号分隔"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProject ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
}