import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import type { Education } from '../types/database';

export function EducationPage() {
  const { database, addEducation, updateEducation, removeEducation } = useDatabaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    gpa: '',
    highlights: '',
  });

  // 打开新建模态框
  const openCreateModal = () => {
    setEditingEducation(null);
    setFormData({
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: '',
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const openEditModal = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      school: edu.school,
      degree: edu.degree,
      major: edu.major,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa || '',
      highlights: edu.highlights.join('\n'),
    });
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eduData = {
      school: formData.school,
      degree: formData.degree,
      major: formData.major,
      startDate: formData.startDate,
      endDate: formData.endDate,
      gpa: formData.gpa || undefined,
      highlights: formData.highlights.split('\n').filter(Boolean),
    };

    if (editingEducation) {
      updateEducation(editingEducation.id, eduData);
    } else {
      addEducation(eduData);
    }
    setIsModalOpen(false);
  };

  // 按结束日期倒序排列
  const sortedEducation = [...database.education].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">教育背景</h1>
          <p className="text-gray-600 mt-1">管理您的学历和教育经历</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          添加教育经历
        </button>
      </div>

      {/* 教育经历列表 */}
      {sortedEducation.length > 0 ? (
        <div className="space-y-4">
          {sortedEducation.map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* 学校图标 */}
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">{edu.school}</h3>
                      {edu.gpa && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium mt-1">
                      {edu.degree} · {edu.major}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>

                    {/* 亮点 */}
                    {edu.highlights.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">主要成就</h4>
                        <ul className="space-y-1">
                          {edu.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无教育经历</h3>
          <p className="text-gray-600 mb-4">开始添加您的学历背景吧</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加第一段教育经历
          </button>
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingEducation ? '编辑教育经历' : '添加教育经历'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  学校名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：清华大学"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    学位 *
                  </label>
                  <select
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="高中">高中</option>
                    <option value="专科">专科</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    专业 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：计算机科学与技术"
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
                    结束日期 *
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA（可选）
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：3.8/4.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主要成就
                </label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="每行一个成就，例如：&#10;获得优秀毕业生称号&#10;担任学生会主席&#10;获得国家奖学金"
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
                  {editingEducation ? '保存' : '添加'}
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