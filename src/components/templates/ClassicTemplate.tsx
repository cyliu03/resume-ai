import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

interface ClassicTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
  sectionOrder?: SectionKey[];
}

export function ClassicTemplate({ data, layoutSettings = defaultLayoutSettings }: ClassicTemplateProps) {
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
    title: { fontSize: `${settings.titleSize}pt`, color: settings.textColor },
    heading: { fontSize: `${settings.headingSize}pt`, color: settings.textColor },
    body: { fontSize: `${settings.bodySize}pt`, lineHeight: settings.lineHeight, color: settings.textColor },
    small: { fontSize: `${settings.smallSize}pt`, color: settings.textColor },
  };

  return (
    <div className="bg-white font-serif" style={{ ...styles.container, width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: settings.textColor }}>
        <h1 style={styles.title} className="font-bold uppercase tracking-wider mb-2">
          {personalInfo.name || '您的姓名'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor, opacity: 0.8 }} className="mb-3">
            {personalInfo.title}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-4" style={styles.small}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-1" style={styles.small}>
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.website && personalInfo.github && <span>|</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {(personalInfo.website || personalInfo.github) && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 className="font-bold uppercase tracking-wide border-b pb-1 mb-2" style={{ ...styles.heading, borderBottomColor: '#d1d5db' }}>
            职业目标
          </h2>
          <p style={styles.body} className="leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 className="font-bold uppercase tracking-wide border-b pb-1 mb-2" style={{ ...styles.heading, borderBottomColor: '#d1d5db' }}>
            工作经历
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: `${settings.itemGap}px` }}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{exp.company}</span>
                  {exp.location && <span style={{ ...styles.body, opacity: 0.7 }}> — {exp.location}</span>}
                </div>
                <span style={styles.small} className="opacity-70">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={{ ...styles.body, fontStyle: 'italic' }} className="mb-1 opacity-80">{exp.position}</p>
              {exp.responsibilities && (
                <ul style={styles.body} className="list-disc list-inside space-y-0.5">
                  {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 className="font-bold uppercase tracking-wide border-b pb-1 mb-2" style={{ ...styles.heading, borderBottomColor: '#d1d5db' }}>
            项目经验
          </h2>
          {projects.map((project) => (
            <div key={project.id} style={{ marginBottom: `${settings.itemGap / 2}px` }}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{project.name}</span>
                {project.link && (
                  <span style={styles.small} className="opacity-70">{project.link}</span>
                )}
              </div>
              <p style={styles.body}>{project.description}</p>
              {project.technologies && (
                <p style={{ ...styles.body, fontStyle: 'italic', opacity: 0.7 }}>技术: {project.technologies}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 className="font-bold uppercase tracking-wide border-b pb-1 mb-2" style={{ ...styles.heading, borderBottomColor: '#d1d5db' }}>
            专业技能
          </h2>
          <div style={styles.body}>
            {skills.map((skill, index) => (
              <span key={skill.id}>
                <strong>{skill.category}:</strong> {skill.items}
                {index < skills.length - 1 && ' · '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 className="font-bold uppercase tracking-wide border-b pb-1 mb-2" style={{ ...styles.heading, borderBottomColor: '#d1d5db' }}>
            教育背景
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: `${settings.itemGap / 2}px` }}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{edu.school}</span>
                <span style={styles.small} className="opacity-70">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={styles.body}>
                {edu.degree}{edu.field && `, ${edu.field}`}
                {edu.gpa && ` — GPA: ${edu.gpa}`}
              </p>
              {edu.achievements && (
                <p style={{ ...styles.body, fontStyle: 'italic', opacity: 0.7 }}>{edu.achievements}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}