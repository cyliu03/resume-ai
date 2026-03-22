import type { ResumeData, LayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

export function ColorfulTemplate({ data }: { data: ResumeData; layoutSettings?: LayoutSettings; sectionOrder?: SectionKey[] }) {
  const { personalInfo, education, experience, projects, skills } = data;
  const formatDate = (dateStr: string) => { if (!dateStr) return ''; const [year, month] = dateStr.split('-'); return `${year}/${month}`; };

  return (
    <div className="bg-white" style={{ padding: '15mm', width: '210mm', minHeight: '297mm' }}>
      {/* 彩色头部 */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white -mx-15mm -mt-15mm px-15mm py-6 mb-4">
        <h1 className="text-3xl font-bold">{personalInfo.name || '您的姓名'}</h1>
        {personalInfo.title && <p className="text-lg opacity-90">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          {personalInfo.email && <span className="bg-white/20 px-2 py-0.5 rounded-full">📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span className="bg-white/20 px-2 py-0.5 rounded-full">📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span className="bg-white/20 px-2 py-0.5 rounded-full">📍 {personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && <div className="mb-4 p-3 bg-indigo-50 rounded-lg"><p className="text-gray-600 text-sm">{personalInfo.summary}</p></div>}

      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-indigo-600 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center text-sm">💼</span>工作经历
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3 border-l-4 border-indigo-400 pl-3">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.company}</h3>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}</span>
              </div>
              <p className="text-sm text-indigo-600">{exp.position}</p>
              {exp.responsibilities && <ul className="text-xs text-gray-600 list-disc list-inside">{exp.responsibilities.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-pink-600 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center text-sm">🚀</span>项目经验
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {projects.map((project) => (
              <div key={project.id} className="p-2 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-sm">{project.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                {project.technologies && <div className="flex flex-wrap gap-1 mt-1">{project.technologies.split(',').map((t, i) => <span key={i} className="text-xs bg-white px-1 rounded">{t.trim()}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-amber-600 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center text-sm">💡</span>技能
            </h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-1">
                <p className="text-xs font-semibold text-gray-700">{skill.category}</p>
                <p className="text-xs text-gray-500">{skill.items}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-emerald-600 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center text-sm">🎓</span>教育
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1">
                <p className="text-xs font-semibold text-gray-700">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.degree} · {edu.field}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}