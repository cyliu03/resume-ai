import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import type { Education } from '../types/database';

export function ProfilePage() {
  const { database, updateProfile, addEducation, updateEducation, removeEducation } = useDatabaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  // 个人信息表单状态
  const [profileForm, setProfileForm] = useState({
    name: database.profile.name || '',
    title: database.profile.title || '',
    email: database.profile.email || '',
    phone: database.profile.phone || '',
    location: database.profile.location || '',
    website: database.profile.website || '',
    linkedin: database.profile.linkedin || '',
    github: database.profile.github || '',
    summary: database.profile.summary || '',
  });

  // 教育表单状态
  const [eduFormData, setEduFormData] = useState({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    gpa: '',
    highlights: '',
  });

  // 保存个人信息
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  // 打开新建教育模态框
  const openCreateModal = () => {
    setEditingEducation(null);
    setEduFormData({
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

  // 打开编辑教育模态框
  const openEditModal = (edu: Education) => {
    setEditingEducation(edu);
    setEduFormData({
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

  // 提交教育表单
  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eduData = {
      school: eduFormData.school,
      degree: eduFormData.degree,
      major: eduFormData.major,
      startDate: eduFormData.startDate,
      endDate: eduFormData.endDate,
      gpa: eduFormData.gpa || undefined,
      highlights: eduFormData.highlights.split('\n').filter(Boolean),
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
    <div className="space-y-8">
      {/* 个人基本信息 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          个人基本信息
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="您的姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：高级前端工程师"
              />
            </div>
          </div>

          {/* 联系方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="138-0000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
            <input
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：北京"
            />
          </div>

          {/* 社交链接 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人网站</label>
              <input
                type="url"
                value={profileForm.website}
                onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yoursite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="text"
                value={profileForm.linkedin}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="text"
              value={profileForm.github}
              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="github.com/username"
            />
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
            <textarea
              value={profileForm.summary}
              onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="简要介绍自己的背景、技能和职业目标..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存基本信息
            </button>
          </div>
        </form>
      </div>

      {/* 教育背景 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            教育背景
          </h2>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            添加教育经历
          </button>
        </div>

        {sortedEducation.length > 0 ? (
          <div className="space-y-4">
            {sortedEducation.map((edu) => (
              <div
                key={edu.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
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
      </div>

      {/* 教育模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingEducation ? '编辑教育经历' : '添加教育经历'}
              </h2>
            </div>
            <form onSubmit={handleEduSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学校名称 *</label>
                <input
                  type="text"
                  required
                  value={eduFormData.school}
                  onChange={(e) => setEduFormData({ ...eduFormData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：清华大学"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学位 *</label>
                  <select
                    required
                    value={eduFormData.degree}
                    onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">专业 *</label>
                  <input
                    type="text"
                    required
                    value={eduFormData.major}
                    onChange={(e) => setEduFormData({ ...eduFormData, major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：计算机科学与技术"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期 *</label>
                  <input
                    type="month"
                    required
                    value={eduFormData.startDate}
                    onChange={(e) => setEduFormData({ ...eduFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期 *</label>
                  <input
                    type="month"
                    required
                    value={eduFormData.endDate}
                    onChange={(e) => setEduFormData({ ...eduFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA（可选）</label>
                <input
                  type="text"
                  value={eduFormData.gpa}
                  onChange={(e) => setEduFormData({ ...eduFormData, gpa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：3.8/4.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主要成就</label>
                <textarea
                  value={eduFormData.highlights}
                  onChange={(e) => setEduFormData({ ...eduFormData, highlights: e.target.value })}
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