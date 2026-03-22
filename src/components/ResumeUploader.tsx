import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { parseResumeFile, parsePastedText, type ParseResult } from '../services/resumeParser';
import { useAIService } from '../services/aiService';
import { useDatabaseStore } from '../store/databaseStore';
import type { ParsedResume } from '../prompts/resumeParse';

interface ResumeUploaderProps {
  onComplete?: () => void;
  autoImport?: boolean; // 自动导入模式
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onComplete, autoImport = false }) => {
  const [step, setStep] = useState<'upload' | 'parsing' | 'ai' | 'preview' | 'done'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [aiResult, setAiResult] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importStats, setImportStats] = useState<{skills: number, experiences: number, projects: number} | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profile: true,
    skills: true,
    experiences: true,
    projects: false,
    education: false,
  });

  const aiService = useAIService();
  const navigate = useNavigate();
  const { database, updateProfile, addSkill, addExperience, addProject, addEducation } = useDatabaseStore();

  // 处理文件选择
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPastedText('');
      setError(null);
    }
  }, []);

  // 处理拖放
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPastedText('');
      setError(null);
    }
  }, []);

  // 开始解析
  const handleStartParse = useCallback(async (quickMode = false) => {
    setError(null);
    setStep('parsing');

    try {
      let result: ParseResult;

      if (file) {
        result = await parseResumeFile(file);
      } else if (pastedText.trim()) {
        result = parsePastedText(pastedText);
      } else {
        setError('请上传文件或粘贴简历内容');
        setStep('upload');
        return;
      }

      if (!result.success) {
        setError(result.error || '解析失败');
        setStep('upload');
        return;
      }

      setStep('ai');

      // 调用 AI 解析
      const aiParsed = await aiService.parseResume(result.text);
      setAiResult(aiParsed);
      
      // 快速模式：直接导入，跳过预览
      if (quickMode || autoImport) {
        doImport(aiParsed);
        setStep('done');
      } else {
        setStep('preview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败');
      setStep('upload');
    }
  }, [file, pastedText, aiService, autoImport]);

  // 执行导入
  const doImport = (data: ParsedResume) => {
    let skillsCount = 0;
    let experiencesCount = 0;
    let projectsCount = 0;

    // 更新个人资料
    if (data.profile.name || data.profile.email) {
      updateProfile(data.profile);
    }

    // 添加技能（避免重复）
    const existingSkillNames = new Set(database.skills.map(s => s.name.toLowerCase()));
    data.skills.forEach(skill => {
      if (!existingSkillNames.has(skill.name.toLowerCase())) {
        addSkill({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          years: skill.years,
          keywords: skill.keywords,
          lastUsed: new Date().toISOString().slice(0, 7),
          evidence: skill.evidence,
          source: 'work',
        });
        skillsCount++;
      }
    });

    // 添加工作经历
    data.experiences.forEach(exp => {
      addExperience({
        company: exp.company,
        position: exp.position,
        department: exp.department,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        highlights: exp.highlights,
        skills: exp.skills,
        achievements: '',
        industry: exp.industry,
      });
      experiencesCount++;
    });

    // 添加项目
    data.projects.forEach(proj => {
      addProject({
        name: proj.name,
        type: proj.type,
        description: proj.description,
        technologies: proj.technologies,
        highlights: proj.highlights,
        startDate: proj.startDate,
        endDate: proj.endDate,
        status: proj.status,
        skills: [],
      });
      projectsCount++;
    });

    // 添加教育背景
    data.education.forEach(edu => {
      addEducation({
        school: edu.school,
        degree: edu.degree,
        major: edu.major,
        startDate: edu.startDate,
        endDate: edu.endDate,
        highlights: edu.highlights,
      });
    });

    setImportStats({ skills: skillsCount, experiences: experiencesCount, projects: projectsCount });
  };

  // 导入数据（预览模式用）
  const handleImport = useCallback(() => {
    if (!aiResult) return;
    doImport(aiResult);
    setStep('done');
    onComplete?.();
  }, [aiResult, database.skills, updateProfile, addSkill, addExperience, addProject, addEducation, onComplete]);

  // 切换展开状态
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 重置
  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setPastedText('');
    setAiResult(null);
    setError(null);
  };

  // 渲染上传界面
  if (step === 'upload') {
    return (
      <div className="space-y-6">
        {/* 文件上传区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              点击上传或拖拽文件到此处
            </p>
            <p className="text-sm text-gray-500 mt-2">
              支持 PDF、DOC、DOCX、TXT 格式
            </p>
          </label>
        </div>

        {/* 已选择的文件 */}
        {file && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FileText className="w-5 h-5 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}

        {/* 分隔线 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">或</span>
          </div>
        </div>

        {/* 文本粘贴区域 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            粘贴简历内容
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="直接粘贴简历文本内容..."
            className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* 开始按钮 - 两种模式 */}
        <div className="space-y-2">
          <button
            onClick={() => handleStartParse(true)}
            disabled={!file && !pastedText.trim()}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            快速导入（全自动）
          </button>
          <button
            onClick={() => handleStartParse(false)}
            disabled={!file && !pastedText.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            详细模式（预览后确认）
          </button>
        </div>
      </div>
    );
  }

  // 渲染解析中界面
  if (step === 'parsing' || step === 'ai') {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {step === 'parsing' ? '正在提取文本...' : 'AI 正在分析简历...'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {step === 'parsing' ? '解析文件内容' : '识别技能、经历、项目等信息'}
        </p>
      </div>
    );
  }

  // 渲染完成界面
  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          导入成功！
        </p>
        <p className="text-sm text-gray-500 mt-2">
          已添加 {importStats?.skills || aiResult?.skills.length || 0} 个技能、{importStats?.experiences || aiResult?.experiences.length || 0} 段经历、{importStats?.projects || aiResult?.projects.length || 0} 个项目
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate('/skills')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            查看技能库
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            继续导入
          </button>
        </div>
      </div>
    );
  }

  // 渲染预览界面
  if (step === 'preview' && aiResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            解析结果预览
          </h3>
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            重新上传
          </button>
        </div>

        {/* 个人资料 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('profile')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">个人资料</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {aiResult.profile.name || '未识别'}
              </span>
              {expandedSections.profile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
          {expandedSections.profile && (
            <div className="p-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">姓名：</span>{aiResult.profile.name || '-'}</div>
                <div><span className="text-gray-500">职位：</span>{aiResult.profile.title || '-'}</div>
                <div><span className="text-gray-500">邮箱：</span>{aiResult.profile.email || '-'}</div>
                <div><span className="text-gray-500">电话：</span>{aiResult.profile.phone || '-'}</div>
                <div><span className="text-gray-500">地点：</span>{aiResult.profile.location || '-'}</div>
                <div><span className="text-gray-500">GitHub：</span>{aiResult.profile.github || '-'}</div>
              </div>
              {aiResult.profile.summary && (
                <div className="pt-2 border-t dark:border-gray-700">
                  <span className="text-gray-500">简介：</span>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{aiResult.profile.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 技能 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">技能 ({aiResult.skills.length})</span>
            {expandedSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.skills && aiResult.skills.length > 0 && (
            <div className="p-4 grid grid-cols-2 gap-2">
              {aiResult.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="flex-1 font-medium text-gray-900 dark:text-white">{skill.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">{skill.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 工作经历 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('experiences')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">工作经历 ({aiResult.experiences.length})</span>
            {expandedSections.experiences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.experiences && aiResult.experiences.length > 0 && (
            <div className="p-4 space-y-4">
              {aiResult.experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} · {exp.location}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || '至今'}</p>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                      {exp.highlights.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 项目 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">项目 ({aiResult.projects.length})</span>
            {expandedSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.projects && aiResult.projects.length > 0 && (
            <div className="p-4 space-y-4">
              {aiResult.projects.map((proj, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">{proj.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 教育 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('education')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">教育背景 ({aiResult.education.length})</span>
            {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.education && aiResult.education.length > 0 && (
            <div className="p-4 space-y-4">
              {aiResult.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 dark:text-white">{edu.school}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{edu.degree} · {edu.major}</p>
                  <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            确认导入
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResumeUploader;