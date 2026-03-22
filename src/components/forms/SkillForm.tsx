import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useDatabaseStore } from '../../store/databaseStore';
import type { Skill } from '../../types/resume';

export function SkillForm() {
  const { resumeData, addSkill, updateSkill, removeSkill, setResumeData } = useResume();
  const { database } = useDatabaseStore();
  const { skills } = resumeData;
  const [showImportModal, setShowImportModal] = useState(false);

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  // 从技能库导入
  const handleImportFromDatabase = () => {
    if (database.skills.length === 0) {
      alert('技能库中没有技能，请先在技能库中添加技能');
      return;
    }

    // 按分类分组
    const groupedSkills = new Map<string, string[]>();
    database.skills.forEach(skill => {
      const category = skill.category || '其他';
      if (!groupedSkills.has(category)) {
        groupedSkills.set(category, []);
      }
      groupedSkills.get(category)!.push(skill.name);
    });

    // 转换为简历技能格式
    const newSkills: Skill[] = Array.from(groupedSkills.entries()).map(([category, items]) => ({
      id: crypto.randomUUID(),
      category,
      items: items.join(', '),
    }));

    // 追加到现有技能
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, ...newSkills],
    }));

    setShowImportModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">技能</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
            title="从技能库导入"
          >
            📥 导入
          </button>
          <button
            onClick={addSkill}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            + 添加
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-3">点击"添加"按钮添加技能分类</p>
          <button
            onClick={() => setShowImportModal(true)}
            className="text-green-600 text-sm hover:underline"
          >
            或从技能库导入 →
          </button>
        </div>
      ) : (
        skills.map((skill: Skill, index: number) => (
          <div key={skill.id} className="border border-gray-200 rounded-md p-3 mb-3 relative">
            <button
              onClick={() => removeSkill(skill.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
            <div className="text-sm font-medium text-gray-600 mb-2">技能分类 #{index + 1}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>分类名称</label>
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  className={inputClass}
                  placeholder="前端技术/后端技术/工具等"
                />
              </div>
              <div>
                <label className={labelClass}>技能列表 *</label>
                <input
                  type="text"
                  value={skill.items}
                  onChange={(e) => updateSkill(skill.id, 'items', e.target.value)}
                  className={inputClass}
                  placeholder="React, Vue, TypeScript"
                />
              </div>
            </div>
          </div>
        ))
      )}

      {/* 导入弹窗 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">从技能库导入</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                将从技能库导入 <strong>{database.skills.length}</strong> 个技能，按分类自动分组。
              </p>
              
              {database.skills.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">预览分类：</div>
                  {Array.from(new Set(database.skills.map(s => s.category || '其他'))).map(category => (
                    <div key={category} className="text-sm text-gray-600 mb-1">
                      • {category}：{database.skills.filter(s => (s.category || '其他') === category).map(s => s.name).join('、')}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>技能库为空</p>
                  <p className="text-sm mt-1">请先在「技能库」页面添加技能</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleImportFromDatabase}
                disabled={database.skills.length === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}