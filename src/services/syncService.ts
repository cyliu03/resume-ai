// 同步服务 - 技能库与简历编辑器的双向同步
import type { Skill as DatabaseSkill } from '../types/database';
import type { Skill as ResumeSkill } from '../types/resume';

// 技能库 → 简历技能 转换
export function databaseSkillToResumeSkill(skill: DatabaseSkill): ResumeSkill {
  return {
    id: skill.id || crypto.randomUUID(),
    category: skill.category,
    items: skill.name, // 简历中用 name 作为 items
  };
}

// 按分类分组的技能转换为简历格式
export function groupSkillsByCategory(skills: DatabaseSkill[]): ResumeSkill[] {
  const grouped = new Map<string, string[]>();
  
  skills.forEach(skill => {
    const category = skill.category || '其他';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(skill.name);
  });
  
  return Array.from(grouped.entries()).map(([category, items]) => ({
    id: crypto.randomUUID(),
    category,
    items: items.join(', '),
  }));
}

// 经历库 → 简历经历 转换
export function databaseExperienceToResume(exp: import('../types/database').Experience): import('../types/resume').WorkExperience {
  return {
    id: exp.id || crypto.randomUUID(),
    company: exp.company,
    position: exp.position,
    location: exp.location || '',
    startDate: exp.startDate,
    endDate: exp.endDate || '',
    current: exp.current,
    responsibilities: exp.highlights?.join('\n') || '',
  };
}

// 项目库 → 简历项目 转换
export function databaseProjectToResume(proj: import('../types/database').Project): import('../types/resume').Project {
  return {
    id: proj.id || crypto.randomUUID(),
    name: proj.name,
    description: proj.description || '',
    technologies: proj.technologies?.join(', ') || '',
    link: proj.link,
  };
}

// 教育库 → 简历教育 转换
export function databaseEducationToResume(edu: import('../types/database').Education): import('../types/resume').Education {
  return {
    id: edu.id || crypto.randomUUID(),
    school: edu.school,
    degree: edu.degree,
    field: edu.major,
    startDate: edu.startDate,
    endDate: edu.endDate,
    gpa: edu.gpa,
    achievements: edu.highlights?.join('\n') || '',
  };
}

// 个人资料 → 简历个人资料 转换
export function databaseProfileToResume(profile: import('../types/database').Profile): import('../types/resume').PersonalInfo {
  return {
    name: profile.name || '',
    title: profile.title || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    website: profile.website || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    summary: profile.summary || '',
  };
}

// 完整同步：数据库 → 简历
export function syncDatabaseToResume(database: import('../types/database').PersonalDatabase): import('../types/resume').ResumeData {
  return {
    personalInfo: databaseProfileToResume(database.profile),
    skills: groupSkillsByCategory(database.skills),
    experience: database.experiences.map(databaseExperienceToResume),
    projects: database.projects.map(databaseProjectToResume),
    education: database.education.map(databaseEducationToResume),
  };
}