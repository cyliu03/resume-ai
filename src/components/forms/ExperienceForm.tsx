
import { useResume } from '../../context/ResumeContext';
import type { WorkExperience } from '../../types/resume';

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const { experience } = resumeData;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">工作经历</h3>
        <button
          onClick={addExperience}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        >
          + 添加
        </button>
      </div>

      {experience.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">点击"添加"按钮添加工作经历</p>
      ) : (
        experience.map((exp: WorkExperience, index: number) => (
          <div key={exp.id} className="border border-gray-200 rounded-md p-3 mb-3 relative">
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
            <div className="text-sm font-medium text-gray-600 mb-2">工作经历 #{index + 1}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>公司名称 *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className={inputClass}
                  placeholder="阿里巴巴"
                />
              </div>
              <div>
                <label className={labelClass}>职位</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className={inputClass}
                  placeholder="高级前端工程师"
                />
              </div>
              <div>
                <label className={labelClass}>工作地点</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className={inputClass}
                  placeholder="杭州"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-700">目前在职</span>
                </label>
              </div>
              <div>
                <label className={labelClass}>开始时间</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>结束时间</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  className={inputClass}
                  disabled={exp.current}
                  placeholder={exp.current ? '至今' : ''}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>工作职责/成就</label>
              <textarea
                value={exp.responsibilities}
                onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                className={`${inputClass} h-24 resize-none`}
                placeholder="描述你的主要职责和成就，每行一条..."
                rows={3}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}