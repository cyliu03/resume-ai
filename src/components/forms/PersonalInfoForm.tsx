
import { useResume } from '../../context/ResumeContext';

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">个人信息</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>姓名 *</label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className={inputClass}
            placeholder="张三"
          />
        </div>
        <div>
          <label className={labelClass}>职位</label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className={inputClass}
            placeholder="高级前端工程师"
          />
        </div>
        <div>
          <label className={labelClass}>邮箱 *</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className={inputClass}
            placeholder="zhangsan@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>电话</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className={inputClass}
            placeholder="138-0000-0000"
          />
        </div>
        <div>
          <label className={labelClass}>所在地</label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className={inputClass}
            placeholder="北京"
          />
        </div>
        <div>
          <label className={labelClass}>个人网站</label>
          <input
            type="url"
            value={personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className={inputClass}
            placeholder="https://yoursite.com"
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            type="text"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className={inputClass}
            placeholder="linkedin.com/in/username"
          />
        </div>
        <div>
          <label className={labelClass}>GitHub</label>
          <input
            type="text"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            className={inputClass}
            placeholder="github.com/username"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass}>个人简介</label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          className={`${inputClass} h-24 resize-none`}
          placeholder="简要介绍自己的背景、技能和职业目标..."
          rows={3}
        />
      </div>
    </div>
  );
}