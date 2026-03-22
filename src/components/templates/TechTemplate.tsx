import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

interface TechTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
  sectionOrder?: SectionKey[];
}

export function TechTemplate({ data, layoutSettings = defaultLayoutSettings }: TechTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}-${month}`;
  };

  return (
    <div className="bg-white font-mono" style={{ padding: `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`, width: '210mm', minHeight: '297mm' }}>
      <div className="flex gap-6">
        <div className="w-1/3 border-r border-gray-200 pr-4">
          <h1 style={{ fontSize: `${settings.titleSize + 2}pt` }} className="font-bold mb-2">{personalInfo.name || '您的姓名'}</h1>
          {personalInfo.title && <p style={{ fontSize: `${settings.bodySize}pt`, color: '#0ea5e9' }} className="mb-4">{personalInfo.title}</p>}
          
          <div className="mb-6">
            <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">// 联系方式</h2>
            <div style={{ fontSize: `${settings.smallSize}pt`, color: '#64748b' }} className="space-y-1">
              {personalInfo.email && <p>📧 {personalInfo.email}</p>}
              {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
              {personalInfo.github && <p>💻 {personalInfo.github}</p>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">// 技能栈</h2>
              {skills.map((skill) => (
                <div key={skill.id} className="mb-2">
                  <p style={{ fontSize: `${settings.smallSize}pt` }} className="font-semibold">{skill.category}</p>
                  <p style={{ fontSize: `${settings.smallSize - 1}pt`, color: '#64748b' }}>{skill.items}</p>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">// 教育</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p style={{ fontSize: `${settings.smallSize}pt` }} className="font-semibold">{edu.school}</p>
                  <p style={{ fontSize: `${settings.smallSize - 1}pt`, color: '#64748b' }}>{edu.degree} · {edu.field}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-2/3 pl-4">
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">{'<'}简介{'>'}</h2>
              <p style={{ fontSize: `${settings.bodySize}pt`, lineHeight: 1.6 }}>{personalInfo.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">{'<'}工作经历{'>'}</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${settings.bodySize + 1}pt` }}>{exp.company}</h3>
                      <p style={{ fontSize: `${settings.smallSize}pt`, color: '#64748b' }}>{exp.position}</p>
                    </div>
                    <span style={{ fontSize: `${settings.smallSize - 1}pt` }} className="bg-gray-100 px-2 py-0.5 rounded">
                      {formatDate(exp.startDate)} → {exp.current ? 'now' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <ul style={{ fontSize: `${settings.bodySize}pt`, lineHeight: 1.5 }} className="mt-2 space-y-1">
                      {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                        <li key={i} className="flex gap-2"><span className="text-cyan-500">▸</span>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: `${settings.smallSize}pt`, color: '#0ea5e9' }} className="font-bold mb-2 uppercase">{'<'}项目{'>'}</h2>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded p-2">
                    <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize}pt` }}>{project.name}</h3>
                    <p style={{ fontSize: `${settings.smallSize - 1}pt`, color: '#64748b' }} className="mt-1">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.split(',').slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-xs bg-cyan-50 text-cyan-700 px-1 rounded">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}