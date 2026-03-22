import type { ResumeData, LayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

export function AcademicTemplate({ data }: { data: ResumeData; layoutSettings?: LayoutSettings; sectionOrder?: SectionKey[] }) {
  const { personalInfo, education, experience, projects, skills } = data;
  const formatDate = (dateStr: string) => { if (!dateStr) return ''; const [year, month] = dateStr.split('-'); return `${year}.${month}`; };

  return (
    <div className="bg-white" style={{ padding: '20mm', width: '210mm', minHeight: '297mm' }}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">{personalInfo.name || '您的姓名'}</h1>
        {personalInfo.title && <p className="text-gray-600 mb-2">{personalInfo.title}</p>}
        <div className="text-sm text-gray-500">{[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}</div>
      </div>

      <div className="border-t-2 border-gray-800 pt-4 mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Research Interests</h2>
        {personalInfo.summary && <p className="text-sm text-gray-600">{personalInfo.summary}</p>}
      </div>

      {education.length > 0 && (
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.degree} in {edu.field}</p>
                </div>
                <span className="text-sm text-gray-400">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
              {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Academic Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-semibold">{exp.position}</p>
                <span className="text-sm text-gray-400">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <p className="text-sm text-gray-600 italic">{exp.company}</p>
              {exp.responsibilities && <ul className="text-sm text-gray-600 list-disc list-inside mt-1">{exp.responsibilities.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Publications & Projects</h2>
          {projects.map((project, i) => (
            <div key={project.id} className="mb-2 text-sm">
              <p className="font-semibold">[{i + 1}] {project.name}</p>
              <p className="text-gray-600">{project.description}</p>
              {project.technologies && <p className="text-xs text-gray-400">Keywords: {project.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Skills</h2>
          <p className="text-sm text-gray-600">{skills.map(s => `${s.category}: ${s.items}`).join(' | ')}</p>
        </div>
      )}
    </div>
  );
}