import type { ResumeData, LayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

export function ExecutiveTemplate({ data }: { data: ResumeData; layoutSettings?: LayoutSettings; sectionOrder?: SectionKey[] }) {
  const { personalInfo, education, experience, skills } = data;
  const formatDate = (dateStr: string) => { if (!dateStr) return ''; const [year, month] = dateStr.split('-'); return `${year}年${month}月`; };

  return (
    <div className="bg-white" style={{ padding: '15mm 20mm', width: '210mm', minHeight: '297mm' }}>
      <div className="bg-slate-800 text-white -mx-20mm -mt-15mm px-20mm py-8 mb-6">
        <h1 className="text-3xl font-light tracking-wide">{personalInfo.name || '您的姓名'}</h1>
        {personalInfo.title && <p className="text-xl text-slate-300 mt-1">{personalInfo.title}</p>}
        <div className="flex gap-6 mt-4 text-sm text-slate-300">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      {personalInfo.summary && <div className="mb-6"><p className="text-gray-600 text-sm">{personalInfo.summary}</p></div>}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 pb-1 border-b-2 border-slate-800">职业经历</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold text-lg">{exp.company}</h3><p className="text-slate-600">{exp.position}</p></div>
                <span className="text-sm text-gray-500">{formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}</span>
              </div>
              {exp.responsibilities && <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">{exp.responsibilities.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 pb-1 border-b-2 border-slate-800">核心能力</h2>
            {skills.map((skill) => (<div key={skill.id} className="mb-2"><p className="text-sm font-semibold">{skill.category}</p><p className="text-xs text-gray-500">{skill.items}</p></div>))}
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 pb-1 border-b-2 border-slate-800">教育背景</h2>
            {education.map((edu) => (<div key={edu.id} className="mb-2"><p className="text-sm font-semibold">{edu.school}</p><p className="text-xs text-gray-500">{edu.degree} · {edu.field}</p></div>))}
          </div>
        )}
      </div>
    </div>
  );
}