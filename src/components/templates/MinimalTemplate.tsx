import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';
import type { SectionKey } from '../../context/ResumeContext';

interface MinimalTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
  sectionOrder?: SectionKey[];
}

export function MinimalTemplate({ data, layoutSettings = defaultLayoutSettings }: MinimalTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}/${month}`;
  };

  const styles = {
    container: {
      padding: `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`,
    },
    title: { fontSize: `${settings.titleSize + 4}pt`, color: settings.textColor },
    heading: { fontSize: `${settings.smallSize}pt`, color: '#9ca3af' },
    body: { fontSize: `${settings.bodySize}pt`, lineHeight: settings.lineHeight, color: settings.textColor },
    small: { fontSize: `${settings.smallSize}pt`, color: '#6b7280' },
  };

  return (
    <div className="bg-white font-sans" style={{ ...styles.container, width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ marginBottom: `${settings.sectionGap}px` }}>
        <h1 style={styles.title} className="font-light mb-1">
          {personalInfo.name || '您的姓名'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: `${settings.headingSize + 2}pt`, color: '#6b7280' }} className="font-light mb-3">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-6" style={styles.small}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <p style={styles.body} className="leading-relaxed border-l-2 border-gray-200 pl-4">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={styles.heading} className="font-semibold uppercase tracking-widest mb-4">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: `${settings.itemGap}px` }}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{exp.company}</h3>
                <span style={styles.small}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={styles.small} className="mb-2">{exp.position}</p>
              {exp.responsibilities && (
                <ul style={styles.body} className="space-y-1">
                  {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: '#d1d5db', marginTop: '4px' }}>—</span>
                      <span>{item}</span>
                    </li>
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
          <h2 style={styles.heading} className="font-semibold uppercase tracking-widest mb-4">
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} style={{ marginBottom: `${settings.itemGap}px` }}>
              <h3 className="font-medium" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{project.name}</h3>
              <p style={styles.body} className="mt-1">{project.description}</p>
              {project.technologies && (
                <p style={{ fontSize: `${settings.smallSize - 1}pt`, color: '#9ca3af' }} className="mt-1">
                  {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={styles.heading} className="font-semibold uppercase tracking-widest mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3" style={styles.body}>
            {skills.map((skill) => (
              <span key={skill.id}>
                <span className="font-medium" style={{ color: settings.textColor }}>{skill.category}</span>: {skill.items}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: `${settings.sectionGap}px` }}>
          <h2 style={styles.heading} className="font-semibold uppercase tracking-widest mb-4">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: `${settings.itemGap / 2}px` }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>{edu.school}</h3>
                <span style={styles.small}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={styles.body}>
                {edu.degree}{edu.field && ` in ${edu.field}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}