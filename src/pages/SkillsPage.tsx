import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  type Skill,
  type SkillLevel,
  type SkillSource,
} from '../types/database';

const SOURCE_LABELS: Record<SkillSource, string> = {
  work: '工作',
  project: '项目',
  learning: '学习',
};

export function SkillsPage() {
  const { database, addSkill, updateSkill, removeSkill } = useDatabaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    category: '前端框架',
    level: '熟悉' as SkillLevel,
    years: 1,
    keywords: '',
    lastUsed: new Date().toISOString().split('T')[0],
    evidence: '',
    source: 'work' as SkillSource,
  });

  // 打开新建模态框
  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: '前端框架',
      level: '熟悉',
      years: 1,
      keywords: '',
      lastUsed: new Date().toISOString().split('T')[0],
      evidence: '',
      source: 'work',
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      years: skill.years,
      keywords: skill.keywords.join(', '),
      lastUsed: skill.lastUsed,
      evidence: skill.evidence,
      source: skill.source,
    });
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillData = {
      ...formData,
      keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    };

    if (editingSkill) {
      updateSkill(editingSkill.id, skillData);
    } else {
      addSkill(skillData);
    }
    setIsModalOpen(false);
  };

  // 过滤技能
  const filteredSkills = database.skills.filter((skill) => {
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 按分类分组
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">技能库</h1>
          <p className="text-gray-600 mt-1">管理您的专业技能和熟练程度</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          添加技能
        </button>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索技能..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">全部分类</option>
          {SKILL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 技能列表 */}
      {Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
                <p className="text-sm text-gray-500">{skills.length} 个技能</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={() => openEditModal(skill)}
                      onDelete={() => removeSkill(skill.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无技能</h3>
          <p className="text-gray-600 mb-4">开始添加您的专业技能吧</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加第一个技能
          </button>
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingSkill ? '编辑技能' : '添加技能'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  技能名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：React"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    熟练程度 *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as SkillLevel })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    使用年限 *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={50}
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    来源
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as SkillSource })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最后使用时间
                </label>
                <input
                  type="date"
                  value={formData.lastUsed}
                  onChange={(e) => setFormData({ ...formData, lastUsed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  相关关键词
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="用逗号分隔，例如：Hooks, Redux, TypeScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  证明/描述
                </label>
                <textarea
                  value={formData.evidence}
                  onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="描述您如何使用这项技能，取得了什么成果..."
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
                  {editingSkill ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 技能卡片组件
function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const levelColors = {
    '了解': 'bg-gray-100 text-gray-700',
    '熟悉': 'bg-blue-100 text-blue-700',
    '熟练': 'bg-green-100 text-green-700',
    '精通': 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{skill.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[skill.level]}`}>
              {skill.level}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{skill.years} 年经验</span>
            <span>·</span>
            <span>{SOURCE_LABELS[skill.source]}</span>
          </div>
          {skill.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skill.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded"
                >
                  {keyword}
                </span>
              ))}
              {skill.keywords.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                  +{skill.keywords.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}