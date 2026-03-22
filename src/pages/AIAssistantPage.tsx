import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Search, Scale } from 'lucide-react';
import { JDInput, JDParsedResult, SkillGapAnalysis, GeneratedResumePreview } from '../components/ai';
import ResumeUploader from '../components/ResumeUploader';
import { ATSAnalyzer } from '../components/ATSAnalyzer';
import { OfferComparison } from '../components/OfferComparison';
import { useAIService } from '../services/aiService';
import { useDatabaseStore } from '../store/databaseStore';
import { useAIStore } from '../store/aiStore';
import type { ParsedJD, SkillGap } from '../types/ai';

type Tab = 'jd' | 'import' | 'ats' | 'offer';
type Step = 'input' | 'parsed' | 'generating' | 'generated';

export function AIAssistantPage() {
  const navigate = useNavigate();
  const { database } = useDatabaseStore();
  const { getActiveProvider, init, isInitialized } = useAIStore();
  const aiService = useAIService();

  // 初始化 AI Store
  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  const [activeTab, setActiveTab] = useState<Tab>('jd');
  const [step, setStep] = useState<Step>('input');
  const [jd, setJd] = useState<ParsedJD | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [resumeContent, setResumeContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 检查 AI 配置
  const checkAIConfig = useCallback(() => {
    const activeProvider = getActiveProvider();
    if (!activeProvider) {
      setError('请先在设置页面配置 AI API Key');
      return false;
    }
    return true;
  }, [getActiveProvider]);

  // 解析 JD
  const handleParseJD = useCallback(async (jdText: string) => {
    if (!checkAIConfig()) return;

    setError(null);
    setStep('input');

    try {
      // 解析 JD
      const parsedJD = await aiService.parseJD(jdText);
      setJd(parsedJD);

      // 计算匹配度
      const score = aiService.calculateMatch(database.skills, parsedJD);
      setMatchScore(score);

      // 分析技能缺口
      const gaps = await aiService.analyzeSkillGap(parsedJD, database.skills);
      setSkillGaps(gaps);

      setStep('parsed');
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败，请重试');
    }
  }, [aiService, database.skills, checkAIConfig]);

  // 生成简历
  const handleGenerateResume = useCallback(async () => {
    if (!jd || !checkAIConfig()) return;

    setError(null);
    setStep('generating');

    try {
      const content = await aiService.generateResume(jd, database);
      setResumeContent(content);
      setStep('generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setStep('parsed');
    }
  }, [aiService, database, jd, checkAIConfig]);

  // 应用到编辑器
  const handleApplyToEditor = useCallback(() => {
    // 将生成的简历内容存储到 sessionStorage，在编辑器页面读取
    sessionStorage.setItem('generatedResume', resumeContent);
    navigate('/resume');
  }, [navigate, resumeContent]);

  // 编辑简历内容
  const handleEditResume = useCallback((content: string) => {
    setResumeContent(content);
  }, []);

  // 重置
  const handleReset = useCallback(() => {
    setStep('input');
    setJd(null);
    setSkillGaps([]);
    setMatchScore(0);
    setResumeContent('');
    setError(null);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI 助手</h1>
        <p className="text-gray-500 mt-1">
          智能解析职位描述，自动生成针对性简历
        </p>
      </div>

      {/* 标签页切换 */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('jd')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'jd'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">JD 解析</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">简历导入</span>
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'ats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">ATS 分析</span>
          </button>
          <button
            onClick={() => setActiveTab('offer')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'offer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span className="font-medium">Offer 对比</span>
          </button>
        </div>
      </div>

      {/* 简历导入 */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">上传现有简历</h2>
          <p className="text-gray-500 mb-6">
            上传您的现有简历，AI 将自动识别并提取基本信息、技能、工作经历等内容
          </p>
          <ResumeUploader onComplete={() => navigate('/')} />
        </div>
      )}

      {/* ATS 分析 */}
      {activeTab === 'ats' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ATSAnalyzer />
        </div>
      )}

      {/* Offer 对比 */}
      {activeTab === 'offer' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <OfferComparison />
        </div>
      )}

      {/* JD 解析 */}
      {activeTab === 'jd' && (
        <>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 步骤指示器 */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <StepIndicator
            number={1}
            title="输入 JD"
            active={step === 'input'}
            completed={step !== 'input'}
          />
          <div className={`flex-1 h-0.5 ${step !== 'input' ? 'bg-blue-500' : 'bg-gray-200'}`} />
          <StepIndicator
            number={2}
            title="解析结果"
            active={step === 'parsed'}
            completed={step === 'generating' || step === 'generated'}
          />
          <div className={`flex-1 h-0.5 ${step === 'generated' ? 'bg-blue-500' : 'bg-gray-200'}`} />
          <StepIndicator
            number={3}
            title="生成简历"
            active={step === 'generating' || step === 'generated'}
            completed={step === 'generated'}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* Step 1: JD 输入 */}
        {(step === 'input' || step === 'parsed') && (
          <JDInput
            onParse={handleParseJD}
            isLoading={false}
          />
        )}

        {/* Step 2: 解析结果 */}
        {step === 'parsed' && jd && (
          <>
            <JDParsedResult jd={jd} matchScore={matchScore} />

            {skillGaps.length > 0 && (
              <SkillGapAnalysis gaps={skillGaps} matchScore={matchScore} />
            )}

            {/* 生成简历按钮 */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div>
                <h4 className="font-medium text-gray-800">准备生成简历</h4>
                <p className="text-sm text-gray-500">
                  AI 将根据您的个人数据和职位要求生成针对性简历
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  重新开始
                </button>
                <button
                  onClick={handleGenerateResume}
                  className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  生成简历
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: 生成中 */}
        {step === 'generating' && (
          <GeneratedResumePreview
            resumeContent=""
            profile={database}
            onApply={() => {}}
            onEdit={() => {}}
            isGenerating={true}
          />
        )}

        {/* Step 3: 生成完成 */}
        {step === 'generated' && (
          <>
            {jd && <JDParsedResult jd={jd} matchScore={matchScore} />}
            <GeneratedResumePreview
              resumeContent={resumeContent}
              profile={database}
              onApply={handleApplyToEditor}
              onEdit={handleEditResume}
              isGenerating={false}
            />

            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                重新生成
              </button>
              <button
                onClick={handleApplyToEditor}
                className="px-6 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                应用到简历编辑器
              </button>
            </div>
          </>
        )}
      </div>

      {/* 使用提示 */}
      {step === 'input' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">使用提示</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>1. 从招聘网站复制完整的职位描述</li>
            <li>2. 粘贴到输入框中，点击「解析 JD」</li>
            <li>3. 查看 AI 解析的职位要求和技能缺口</li>
            <li>4. 点击「生成简历」获取针对性简历</li>
            <li>5. 将生成的简历应用到编辑器进行微调</li>
          </ul>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// 步骤指示器组件
function StepIndicator({ number, title, active, completed }: {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          completed
            ? 'bg-blue-500 text-white'
            : active
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {completed ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={`text-sm font-medium ${active || completed ? 'text-gray-800' : 'text-gray-400'}`}>
        {title}
      </span>
    </div>
  );
}