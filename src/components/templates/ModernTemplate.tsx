import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

interface ModernTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
  sectionOrder?: SectionKey[];
}

export function ModernTemplate({ data, layoutSettings = defaultLayoutSettings, sectionOrder }: ModernTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;
  
  // 默认顺序
  const order = sectionOrder || ['personalInfo', 'experience', 'projects', 'skills', 'education'];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}年${month}月`;
  };

  const styles = {
    container: {
      padding: `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`,
      '--title-size': `${settings.titleSize}pt`,
      '--heading-size': `${settings.headingSize}pt`,
      '--body-size': `${settings.bodySize}pt`,
      '--small-size': `${settings.smallSize}pt`,
      '--line-height': settings.lineHeight,
      '--section-gap': `${settings.sectionGap}px`,
      '--item-gap': `${settings.itemGap}px`,
      '--primary-color': settings.primaryColor,
      '--accent-color': settings.accentColor,
      '--text-color': settings.textColor,
    } as React.CSSProperties,
    title: { fontSize: `${settings.titleSize}pt`, color: settings.textColor },
    heading: { fontSize: `${settings.headingSize}pt`, color: settings.primaryColor },
    body: { fontSize: `${settings.bodySize}pt`, lineHeight: settings.lineHeight, color: settings.textColor },
    small: { fontSize: `${settings.smallSize}pt`, color: settings.textColor },
    accentBar: { backgroundColor: settings.primaryColor },
  };

  // Section 标题组件
  const SectionTitle = ({ title }: { title: string }) => (
    <h2 style={styles.heading} className="font-bold mb-3 flex items-center gap-2">
      <span style={{ ...styles.accentBar, width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
      {title}
    </h2>
  );

  // 渲染各个 section
  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'experience':
        return experience.length > 0 ? (
          <div key={key} style={{ marginBottom: `${settings.sectionGap}px` }}>
            <SectionTitle title="工作经历" />
            <div style={{ gap: `${settings.itemGap}px` }} className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: `${settings.itemGap}px` }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{exp.company}</h3>
                      <p style={styles.small} className="opacity-75">{exp.position}</p>
                    </div>
                    <span style={styles.small} className="opacity-60">
                      {formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <ul style={styles.body} className="mt-2 list-disc list-inside space-y-1">
                      {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} style={{ marginBottom: `${settings.sectionGap}px` }}>
            <SectionTitle title="项目经验" />
            <div style={{ gap: `${settings.itemGap}px` }} className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{project.name}</h3>
                    {project.link && (
                      <a href={project.link} style={{ fontSize: `${settings.smallSize}pt`, color: settings.primaryColor }} className="hover:underline">
                        {project.link}
                      </a>
                    )}
                  </div>
                  <p style={styles.body} className="mt-1">{project.description}</p>
                  {project.technologies && (
                    <p style={{ fontSize: `${settings.smallSize - 1}pt`, color: settings.textColor, opacity: 0.7 }} className="mt-1">
                      技术栈: {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} style={{ marginBottom: `${settings.sectionGap}px` }}>
            <SectionTitle title="专业技能" />
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} style={styles.body}>
                  <span className="font-medium">{skill.category}: </span>
                  <span style={{ opacity: 0.8 }}>{skill.items}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <div key={key} style={{ marginBottom: `${settings.sectionGap}px` }}>
            <SectionTitle title="教育背景" />
            <div style={{ gap: `${settings.itemGap}px` }} className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{edu.school}</h3>
                      <p style={styles.small} className="opacity-75">{edu.degree} · {edu.field}</p>
                    </div>
                    <span style={styles.small} className="opacity-60">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {(edu.gpa || edu.achievements) && (
                    <p style={styles.small} className="mt-1 opacity-75">
                      {edu.gpa && `GPA: ${edu.gpa}`}
                      {edu.gpa && edu.achievements && ' · '}
                      {edu.achievements}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-white font-sans" style={{ ...styles.container, width: '210mm', minHeight: '297mm' }}>
      {/* Header - 始终在顶部 */}
      <div style={{ borderBottom: `2px solid ${settings.primaryColor}`, paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={styles.title} className="font-bold mb-1">
          {personalInfo.name || '您的姓名'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: `${settings.headingSize}pt`, color: settings.primaryColor }} className="mb-2">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-4" style={styles.small}>
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1 998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {personalInfo.github}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Summary - 始终在 Header 之后 */}
      {personalInfo.summary && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={styles.heading} className="font-bold mb-2 flex items-center gap-2">
            <span style={{ ...styles.accentBar, width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
            个人简介
          </h2>
          <p style={styles.body} className="leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* 动态渲染其他 section */}
      {order.map((key) => renderSection(key))}
    </div>
  );
}