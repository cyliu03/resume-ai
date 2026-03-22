import { useState } from 'react';
import { Link } from 'react-router-dom';

interface WelcomeGuideProps {
  onComplete?: () => void;
}

export function WelcomeGuide({ onComplete }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: '欢迎使用 ResumeAI',
      description: 'ResumeAI 是一款智能简历助手，帮助您管理职业数据、生成定制简历、分析技能缺口。',
      icon: '🤖',
      image: null,
    },
    {
      title: '构建您的技能库',
      description: '添加您掌握的所有技能，包括编程语言、框架、工具和软技能。系统会根据您的技能水平进行分析。',
      icon: '💡',
      link: '/skills',
      linkText: '前往技能库',
    },
    {
      title: '记录工作经历',
      description: '详细记录您的工作经历和项目经验，这些数据将用于生成针对职位描述定制的简历。',
      icon: '💼',
      link: '/experiences',
      linkText: '前往经历库',
    },
    {
      title: '配置 AI 助手',
      description: '在设置页面配置您的 AI API Key，即可使用智能简历生成、技能缺口分析等功能。',
      icon: '⚙️',
      link: '/settings',
      linkText: '前往设置',
    },
    {
      title: '开始创建简历',
      description: '完成数据录入后，使用简历编辑器创建您的专业简历，或让 AI 根据职位描述自动生成。',
      icon: '📝',
      link: '/resume',
      linkText: '前往简历编辑',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('welcomeGuideCompleted', 'true');
    onComplete?.();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* 进度条 */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* 内容 */}
        <div className="p-8 text-center">
          {/* 图标 */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            {step.icon}
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {step.title}
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* 链接 */}
          {step.link && (
            <Link
              to={step.link}
              onClick={handleClose}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {step.linkText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* 底部操作 */}
        <div className="px-8 pb-8 flex items-center justify-between">
          {/* 跳过按钮 */}
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            跳过引导
          </button>

          {/* 导航 */}
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                上一步
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? '开始使用' : '下一步'}
            </button>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="pb-6 flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-600'
                  : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 简化版欢迎卡片（用于 Dashboard）
export function WelcomeCard({ onDismiss }: { onDismiss?: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('welcomeCardDismissed', 'true');
    onDismiss?.();
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-2">欢迎来到 ResumeAI!</h2>
        <p className="text-blue-100 mb-4 max-w-md">
          开始构建您的职业数据档案，让 AI 帮助您打造完美简历。
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/skills"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            添加技能
          </Link>
          <Link
            to="/experiences"
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            记录经历
          </Link>
          <Link
            to="/settings"
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            配置 AI
          </Link>
        </div>
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// 检查是否需要显示欢迎引导
export function shouldShowWelcomeGuide(): boolean {
  return !localStorage.getItem('welcomeGuideCompleted');
}

// 检查是否需要显示欢迎卡片
export function shouldShowWelcomeCard(): boolean {
  return !localStorage.getItem('welcomeCardDismissed');
}