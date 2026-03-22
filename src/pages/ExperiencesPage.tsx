import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import type { Experience } from '../types/database';

export function ExperiencesPage() {
  const { database, addExperience, updateExperience, removeExperience } = useDatabaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    department: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    highlights: '',
    skills: '',
    achievements: '',
    industry: '',
  });

  // 打开新建模态框
  const openCreateModal = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      department: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: '',
      skills: '',
      achievements: '',
      industry: '',
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      department: exp.department || '',
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      highlights: exp.highlights.join('\n'),
      skills: exp.skills.join(', '),
      achievements: exp.achievements || '',
      industry: exp.industry || '',
    });
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expData = {
      company: formData.company,
      position: formData.position,
      department: formData.department || undefined,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.current ? null : formData.endDate,
      current: formData.current,
      highlights: formData.highlights.split('\n').filter(Boolean),
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      achievements: formData.achievements || undefined,
      industry: formData.industry || undefined,
    };

    if (editingExperience) {
      updateExperience(editingExperience.id, expData);
    } else {
      addExperience(expData);
    }
    setIsModalOpen(false);
  };

  // 排序：当前工作在前，然后按开始日期倒序
  const sortedExperiences = [...database.experiences].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">经历库</h1>
          <p className="text-gray-600 mt-1">管理您的工作经历和职业发展</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          添加经历
        </button>
      </div>

      {/* 经历时间线 */}
      {sortedExperiences.length > 0 ? (
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {sortedExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-20">
                {/* 时间点 */}
                <div className={`absolute left-6 w-5 h-5 rounded-full border-4 ${
                  exp.current ? 'bg-green-500 border-green-200' : 'bg-white border-gray-300'
                }`}></div>

                {/* 内容卡片 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">{exp.company}</h3>
                        {exp.current && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            当前
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium mt-1">{exp.position}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{exp.location}</span>
                        {exp.department && (
                          <>
                            <span>·</span>
                            <span>{exp.department}</span>
                          </>
                        )}
                        {exp.industry && (
                          <>
                            <span>·</span>
                            <span>{exp.industry}</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate || '')}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* 亮点 */}
                  {exp.highlights.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">核心亮点</h4>
                      <ul className="space-y-1">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 关联技能 */}
                  {exp.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.skills.map((skillId) => {
                        const skill = database.skills.find((s) => s.id === skillId);
                        return skill ? (
                          <span
                            key={skillId}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {skill.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* 成就 */}
                  {exp.achievements && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">{exp.achievements}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无工作经历</h3>
          <p className="text-gray-600 mb-4">开始添加您的职业经历吧</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加第一段经历
          </button>
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingExperience ? '编辑经历' : '添加经历'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    公司名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    职位 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    部门
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    行业
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工作地点 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：北京"
                />
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
                    disabled={formData.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">目前在职</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  核心亮点
                </label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="每行一个亮点，例如：&#10;主导开发了核心业务系统&#10;带领5人团队完成项目交付&#10;优化系统性能提升50%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  使用技能（技能ID，用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="技能ID，用逗号分隔"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主要成就
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="获得的主要奖项、认证或特别成就..."
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
                  {editingExperience ? '保存' : '添加'}
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
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}