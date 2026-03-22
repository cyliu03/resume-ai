
import { useResume } from '../../context/ResumeContext';
import type { Education } from '../../types/resume';

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const { education } = resumeData;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">教育经历</h3>
        <button
          onClick={addEducation}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        >
          + 添加
        </button>
      </div>

      {education.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">点击"添加"按钮添加教育经历</p>
      ) : (
        education.map((edu: Education, index: number) => (
          <div key={edu.id} className="border border-gray-200 rounded-md p-3 mb-3 relative">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
            <div className="text-sm font-medium text-gray-600 mb-2">教育经历 #{index + 1}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>学校名称 *</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  className={inputClass}
                  placeholder="清华大学"
                />
              </div>
              <div>
                <label className={labelClass}>学位</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className={inputClass}
                  placeholder="本科/硕士/博士"
                />
              </div>
              <div>
                <label className={labelClass}>专业</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className={inputClass}
                  placeholder="计算机科学与技术"
                />
              </div>
              <div>
                <label className={labelClass}>GPA</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  className={inputClass}
                  placeholder="3.8/4.0"
                />
              </div>
              <div>
                <label className={labelClass}>开始时间</label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>结束时间</label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>成就/荣誉</label>
              <textarea
                value={edu.achievements}
                onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                className={`${inputClass} h-16 resize-none`}
                placeholder="奖学金、竞赛获奖等，每行一条"
                rows={2}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}