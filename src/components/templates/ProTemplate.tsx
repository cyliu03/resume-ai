import type { ResumeData, LayoutSettings } from '../../types/resume';
import { defaultLayoutSettings } from '../../types/resume';

interface ProTemplateProps {
  data: ResumeData;
  layoutSettings?: LayoutSettings;
}

// 学习 FlowCV/Kickresume/Resume.io 的专业双栏设计
export function ProTemplate({ data, layoutSettings = defaultLayoutSettings }: ProTemplateProps) {
  const { personalInfo, education, experience, projects, skills } = data;
  const settings = layoutSettings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
  };

  return (
    <div className="bg-white font-sans flex" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* 左侧边栏 - 深色背景 */}
      <div 
        className="w-[30%] text-white p-6 flex flex-col"
        style={{ background: `linear-gradient(180deg, ${settings.primaryColor} 0%, ${settings.primaryColor}dd 100%)` }}
      >
        {/* 头像区域 */}
        <div className="text-center mb-6">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {personalInfo.name ? personalInfo.name.charAt(0) : 'U'}
          </div>
          <h1 
            className="font-bold text-xl mb-1"
            style={{ letterSpacing: '0.5px' }}
          >
            {personalInfo.name || '您的姓名'}
          </h1>
          {personalInfo.title && (
            <p 
              className="text-sm opacity-90"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* 联系方式 */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">联系方式</h2>
          <div className="space-y-2">
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">📧</span>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">📱</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">📍</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base">💻</span>
                <span className="break-all">{personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* 技能 */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">专业技能</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-sm font-medium mb-1">{skill.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.split(',').slice(0, 5).map((item, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 教育背景 */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">教育背景</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-medium">{edu.school}</p>
                  <p className="text-xs opacity-80">{edu.degree} · {edu.field}</p>
                  <p className="text-xs opacity-60 mt-0.5">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1" />
      </div>

      {/* 右侧主内容 */}
      <div className="w-[70%] p-6 flex flex-col" style={{ background: '#fafafa' }}>
        {/* 个人简介 */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 
              className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              <span className="w-8 h-0.5" style={{ background: settings.primaryColor }} />
              个人简介
            </h2>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: `${settings.textColor}cc` }}
            >
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* 工作经历 */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              <span className="w-8 h-0.5" style={{ background: settings.primaryColor }} />
              工作经历
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div 
                  key={exp.id}
                  className="relative pl-4"
                  style={{ borderLeft: `2px solid ${settings.primaryColor}40`, marginLeft: '4px' }}
                >
                  <div 
                    className="absolute left-0 top-1.5 w-2 h-2 rounded-full -ml-[5px]"
                    style={{ background: settings.primaryColor }}
                  />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ fontSize: `${settings.bodySize + 1}pt`, color: settings.textColor }}>
                        {exp.company}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: settings.primaryColor }}>
                        {exp.position}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${settings.primaryColor}10`, color: settings.primaryColor }}>
                      {formatDate(exp.startDate)} - {exp.current ? '至今' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <ul className="mt-2 space-y-1 text-sm" style={{ color: `${settings.textColor}cc`, lineHeight: 1.6 }}>
                      {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: settings.primaryColor }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 项目经验 */}
        {projects.length > 0 && (
          <div>
            <h2 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              <span className="w-8 h-0.5" style={{ background: settings.primaryColor }} />
              项目经验
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="p-3 rounded-lg"
                  style={{ background: 'white', border: `1px solid ${settings.primaryColor}15`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <h3 className="font-semibold text-sm mb-1" style={{ color: settings.textColor }}>
                    {project.name}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: `${settings.textColor}99`, lineHeight: 1.5 }}>
                    {project.description}
                  </p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.split(',').slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${settings.primaryColor}10`, color: settings.primaryColor }}>
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

        <div className="flex-1" />
      </div>
    </div>
  );
}