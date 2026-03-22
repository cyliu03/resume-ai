import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

interface ProfessionalTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
  sectionOrder?: SectionKey[];
}

export function ProfessionalTemplate({ data, layoutSettings = defaultLayoutSettings }: ProfessionalTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
  };

  const styles = {
    container: {
      padding: `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`,
    },
    title: { fontSize: `${settings.titleSize + 2}pt`, color: '#1e3a5f' },
    heading: { fontSize: `${settings.headingSize}pt`, color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' },
    body: { fontSize: `${settings.bodySize}pt`, lineHeight: settings.lineHeight, color: settings.textColor },
    small: { fontSize: `${settings.smallSize}pt`, color: '#4b5563' },
  };

  return (
    <div className="bg-white font-serif" style={{ ...styles.container, width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ marginBottom: `${settings.sectionGap}px`, textAlign: 'center' }}>
        <h1 style={styles.title} className="font-bold mb-2 tracking-wide">
          {personalInfo.name || '您的姓名'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: `${settings.headingSize + 2}pt`, color: '#4b5563' }} className="mb-3">
            {personalInfo.title}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-4" style={styles.small}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={{ ...styles.heading, paddingBottom: '4px' }} className="font-bold mb-3">个人简介</h2>
          <p style={styles.body} className="leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={{ ...styles.heading, paddingBottom: '4px' }} className="font-bold mb-3">工作经历</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: `${settings.itemGap}px` }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold" style={{ fontSize: `${settings.bodySize + 1}pt` }}>{exp.company}</h3>
                  <p style={{ ...styles.small, fontStyle: 'italic' }}>{exp.position}</p>
                </div>
                <span style={styles.small}>{formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}</span>
              </div>
              {exp.responsibilities && (
                <ul style={styles.body} className="mt-2 list-disc list-inside">
                  {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={{ ...styles.heading, paddingBottom: '4px' }} className="font-bold mb-3">专业技能</h2>
          <div style={styles.body}>
            {skills.map((skill, i) => (
              <span key={skill.id}>{i > 0 && ' • '}{skill.category}: {skill.items}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={{ ...styles.heading, paddingBottom: '4px' }} className="font-bold mb-3">教育背景</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt` }}>{edu.school}</h3>
                <p style={styles.small}>{edu.degree} · {edu.field}</p>
              </div>
              <span style={styles.small}>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={{ ...styles.heading, paddingBottom: '4px' }} className="font-bold mb-3">项目经验</h2>
          {projects.map((project) => (
            <div key={project.id} style={{ marginBottom: `${settings.itemGap / 2}px` }}>
              <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt` }}>{project.name}</h3>
              <p style={styles.body} className="mt-1">{project.description}</p>
              {project.technologies && <p style={styles.small}>技术栈: {project.technologies}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}