import type { ResumeData, LayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

export function CreativeTemplate({ data }: { data: ResumeData; layoutSettings?: LayoutSettings; sectionOrder?: SectionKey[] }) {
  const { personalInfo, education, experience, skills } = data;
  const formatDate = (dateStr: string) => { if (!dateStr) return ''; const [year, month] = dateStr.split('-'); return `${year}.${month}`; };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white" style={{ padding: '15mm', width: '210mm', minHeight: '297mm' }}>
      <div className="relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 -ml-8 -mb-8"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{personalInfo.name || '您的姓名'}</h1>
          {personalInfo.title && <p className="text-xl text-gray-500 mb-4">{personalInfo.title}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {personalInfo.email && <span className="bg-white px-3 py-1 rounded-full shadow-sm">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="bg-white px-3 py-1 rounded-full shadow-sm">{personalInfo.phone}</span>}
            {personalInfo.location && <span className="bg-white px-3 py-1 rounded-full shadow-sm">{personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {personalInfo.summary && <div className="mt-6 p-4 bg-white/50 rounded-xl"><p className="text-gray-600">{personalInfo.summary}</p></div>}

      {experience.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-purple-600 mb-3 flex items-center gap-2"><span className="w-8 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></span>工作经历</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-400">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}</span>
              </div>
              <p className="text-purple-600 mb-2">{exp.position}</p>
              {exp.responsibilities && <ul className="text-sm text-gray-600 list-disc list-inside">{exp.responsibilities.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-pink-600 mb-3 flex items-center gap-2"><span className="w-8 h-1 bg-gradient-to-r from-pink-600 to-orange-400 rounded"></span>技能</h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold">{skill.category}</p>
                  <p className="text-xs text-gray-400">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-cyan-600 mb-3 flex items-center gap-2"><span className="w-8 h-1 bg-gradient-to-r from-cyan-600 to-blue-400 rounded"></span>教育</h2>
            {education.map((edu) => (
              <div key={edu.id} className="bg-white p-2 rounded-lg shadow-sm mb-2">
                <p className="text-sm font-semibold">{edu.school}</p>
                <p className="text-xs text-gray-400">{edu.degree} · {edu.field}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}