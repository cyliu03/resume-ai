import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, TemplateType, LayoutSettings, ExportData } from '../types/resume';
import { defaultLayoutSettings } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';
import { syncDatabaseToResume } from '../services/syncService';
import type { PersonalDatabase } from '../types/database';

// Section 类型
export type SectionKey = 'personalInfo' | 'experience' | 'projects' | 'skills' | 'education';

export interface SectionConfig {
  key: SectionKey;
  label: string;
  icon: string;
}

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { key: 'personalInfo', label: '个人信息', icon: '👤' },
  { key: 'experience', label: '工作经历', icon: '💼' },
  { key: 'projects', label: '项目经验', icon: '🚀' },
  { key: 'skills', label: '技能', icon: '💡' },
  { key: 'education', label: '教育经历', icon: '🎓' },
];

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  selectedTemplate: TemplateType;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateType>>;
  layoutSettings: LayoutSettings;
  setLayoutSettings: React.Dispatch<React.SetStateAction<LayoutSettings>>;
  sectionOrder: SectionKey[];
  setSectionOrder: React.Dispatch<React.SetStateAction<SectionKey[]>>;
  lastSaved: Date | null;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof import('../types/resume').Education, value: string | boolean) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof import('../types/resume').WorkExperience, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: keyof import('../types/resume').Project, value: string) => void;
  removeProject: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: keyof import('../types/resume').Skill, value: string) => void;
  removeSkill: (id: string) => void;
  updatePersonalInfo: (field: keyof import('../types/resume').PersonalInfo, value: string) => void;
  importResumeData: (data: ResumeData) => void;
  syncFromDatabase: (database: PersonalDatabase) => void;
  exportToJSON: () => ExportData;
  getExportData: () => ExportData;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'resume-builder-data';
const TEMPLATE_KEY = 'resume-builder-template';
const LAYOUT_KEY = 'resume-builder-layout';
const SECTION_ORDER_KEY = 'resume-builder-section-order';

const DEFAULT_SECTION_ORDER: SectionKey[] = ['personalInfo', 'experience', 'projects', 'skills', 'education'];

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultResumeData;
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    return (saved as TemplateType) || 'modern';
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(() => {
    const saved = localStorage.getItem(LAYOUT_KEY);
    return saved ? JSON.parse(saved) : defaultLayoutSettings;
  });

  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(() => {
    const saved = localStorage.getItem(SECTION_ORDER_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SECTION_ORDER;
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    setLastSaved(new Date());
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, selectedTemplate);
    setLastSaved(new Date());
  }, [selectedTemplate]);

  useEffect(() => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layoutSettings));
    setLastSaved(new Date());
  }, [layoutSettings]);

  useEffect(() => {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(sectionOrder));
    setLastSaved(new Date());
  }, [sectionOrder]);

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: uuidv4(),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: uuidv4(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          responsibilities: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: uuidv4(),
          name: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: uuidv4(),
          category: '',
          items: '',
        },
      ],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // 导入简历数据
  const importResumeData = (data: ResumeData) => {
    // 确保所有数组项都有id
    const processedData: ResumeData = {
      personalInfo: data.personalInfo || defaultResumeData.personalInfo,
      education: (data.education || []).map(edu => ({
        ...edu,
        id: edu.id || uuidv4(),
      })),
      experience: (data.experience || []).map(exp => ({
        ...exp,
        id: exp.id || uuidv4(),
      })),
      projects: (data.projects || []).map(proj => ({
        ...proj,
        id: proj.id || uuidv4(),
      })),
      skills: (data.skills || []).map(skill => ({
        ...skill,
        id: skill.id || uuidv4(),
      })),
    };
    setResumeData(processedData);
  };

  // 获取导出数据
  const getExportData = (): ExportData => ({
    version: '1.0',
    resumeData,
    selectedTemplate,
    layoutSettings,
  });

  // 导出为JSON
  const exportToJSON = (): ExportData => getExportData();

  // 从技能库同步数据
  const syncFromDatabase = (database: PersonalDatabase) => {
    const syncedData = syncDatabaseToResume(database);
    setResumeData(syncedData);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        selectedTemplate,
        setSelectedTemplate,
        layoutSettings,
        setLayoutSettings,
        sectionOrder,
        setSectionOrder,
        lastSaved,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addProject,
        updateProject,
        removeProject,
        addSkill,
        updateSkill,
        removeSkill,
        updatePersonalInfo,
        importResumeData,
        syncFromDatabase,
        exportToJSON,
        getExportData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}