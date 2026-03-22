import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';

interface ElegantTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
}

export function ElegantTemplate({ data, layoutSettings = defaultLayoutSettings }: ElegantTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
  };

  return (
    <div className="bg-white font-sans" style={{ padding: `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`, width: '210mm', minHeight: '297mm' }}>
      {/* 顶部个人信息区 - 优雅的渐变背景 */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${settings.primaryColor}15 0%, ${settings.primaryColor}05 100%)`,
          marginBottom: '28px',
          padding: '24px 0',
        }}
      >
        <div className="relative z-10">
          <div className="mb-3">
            <h1 
              className="font-light tracking-wide"
              style={{ fontSize: '28pt', color: settings.textColor }}
            >
              {personalInfo.name || '您的姓名'}
            </h1>
            {personalInfo.title && (
              <p 
                className="mt-1 font-medium"
                style={{ fontSize: '14pt', color: settings.primaryColor }}
              >
                {personalInfo.title}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {personalInfo.email && (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{ background: `${settings.primaryColor}10`, color: settings.textColor }}
              >
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{ background: `${settings.primaryColor}10`, color: settings.textColor }}
              >
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{ background: `${settings.primaryColor}10`, color: settings.textColor }}
              >
                {personalInfo.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 个人简介 */}
      {personalInfo.summary && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <p 
            className="leading-relaxed italic"
            style={{ fontSize: `${settings.bodySize}pt`, color: `${settings.textColor}cc`, lineHeight: 1.8 }}
          >
            "{personalInfo.summary}"
          </p>
        </div>
      )}

      {/* 工作经历 */}
      {experience.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 
              className="font-semibold tracking-wide"
              style={{ fontSize: '13pt', color: settings.primaryColor }}
            >
              工作经历
            </h2>
            <div className="flex-1 h-px ml-3" style={{ background: `${settings.primaryColor}20` }} />
          </div>
          {experience.map((exp, index) => (
            <div 
              key={exp.id} 
              className="relative pl-6"
              style={{ 
                marginBottom: index < experience.length - 1 ? `${settings.itemGap}px` : 0,
                borderLeft: `2px solid ${settings.primaryColor}30`,
                marginLeft: '8px',
              }}
            >
              <div 
                className="absolute left-0 top-1.5 w-3 h-3 rounded-full -ml-1.5"
                style={{ background: settings.primaryColor }}
              />
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>
                    {exp.company}
                  </h3>
                  <p className="font-medium" style={{ fontSize: `${settings.smallSize}pt`, color: settings.primaryColor }}>
                    {exp.position}
                  </p>
                </div>
                <span className="font-light" style={{ fontSize: `${settings.smallSize - 1}pt`, color: `${settings.textColor}80` }}>
                  {formatDate(exp.startDate)} — {exp.current ? '至今' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.responsibilities && (
                <ul className="mt-2 space-y-1.5" style={{ fontSize: `${settings.bodySize}pt`, lineHeight: 1.7 }}>
                  {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-600">
                      <span style={{ color: settings.primaryColor }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 项目经验 */}
      {projects.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold tracking-wide" style={{ fontSize: '13pt', color: settings.primaryColor }}>
              项目经验
            </h2>
            <div className="flex-1 h-px ml-3" style={{ background: `${settings.primaryColor}20` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="rounded-lg p-4"
                style={{ 
                  background: `linear-gradient(135deg, ${settings.primaryColor}08 0%, ${settings.primaryColor}03 100%)`,
                  border: `1px solid ${settings.primaryColor}15`,
                }}
              >
                <h3 className="font-semibold mb-1" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>
                  {project.name}
                </h3>
                <p className="mb-2" style={{ fontSize: `${settings.smallSize}pt`, color: `${settings.textColor}90`, lineHeight: 1.6 }}>
                  {project.description}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ background: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 技能 */}
      {skills.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold tracking-wide" style={{ fontSize: '13pt', color: settings.primaryColor }}>
              专业技能
            </h2>
            <div className="flex-1 h-px ml-3" style={{ background: `${settings.primaryColor}20` }} />
          </div>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id}>
                <span className="font-medium" style={{ fontSize: `${settings.bodySize}pt`, color: settings.textColor }}>
                  {skill.category}：
                </span>
                <span className="ml-2" style={{ fontSize: `${settings.bodySize}pt`, color: `${settings.textColor}90` }}>
                  {skill.items}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 教育背景 */}
      {education.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold tracking-wide" style={{ fontSize: '13pt', color: settings.primaryColor }}>
              教育背景
            </h2>
            <div className="flex-1 h-px ml-3" style={{ background: `${settings.primaryColor}20` }} />
          </div>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>
                  {edu.school}
                </h3>
                <p style={{ fontSize: `${settings.smallSize}pt`, color: `${settings.textColor}80` }}>
                  {edu.degree} · {edu.field}
                </p>
              </div>
              <span className="font-light" style={{ fontSize: `${settings.smallSize - 1}pt`, color: `${settings.textColor}60` }}>
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}