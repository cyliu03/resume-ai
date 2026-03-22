import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import { useAIStore } from '../store/aiStore';
import { Lightbulb, Briefcase, Code, Users, MessageCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { InterviewSimulator } from '../components/InterviewSimulator';

interface InterviewQuestion {
  question: string;
  category: 'technical' | 'behavioral' | 'project' | 'company';
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
  sampleAnswer?: string;
}

export function InterviewPrepPage() {
  const { database } = useDatabaseStore();
  const { getActiveProvider } = useAIStore();
  const [targetCompany, setTargetCompany] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const hasAIConfigured = !!getActiveProvider();

  // 模拟生成面试题（实际应该调用 AI）
  const generateQuestions = async () => {
    if (!targetPosition.trim()) {
      alert('请输入目标职位');
      return;
    }

    setLoading(true);
    
    // 模拟 AI 生成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 基于技能库生成技术问题
    const technicalQuestions: InterviewQuestion[] = database.skills.slice(0, 5).map(skill => ({
      question: `请介绍一下你在 ${skill.name} 方面的经验，遇到过哪些挑战？`,
      category: 'technical' as const,
      difficulty: skill.level === '精通' ? 'hard' : skill.level === '熟练' ? 'medium' : 'easy',
      hint: `可以从项目经验、解决的问题、最佳实践等方面展开`,
      sampleAnswer: `我在 ${skill.name} 方面有 ${skill.years} 年经验。在项目中主要使用它来...\n\n遇到的主要挑战包括...\n\n我的解决方案是...`,
    }));

    // 基于经历生成行为问题
    const behavioralQuestions: InterviewQuestion[] = database.experiences.slice(0, 3).map(exp => ({
      question: `在 ${exp.company} 担任 ${exp.position} 期间，你最有成就感的项目是什么？`,
      category: 'behavioral' as const,
      difficulty: 'medium' as const,
      hint: `使用 STAR 法则：Situation（情境）→ Task（任务）→ Action（行动）→ Result（结果）`,
      sampleAnswer: `在 ${exp.company} 期间，我负责了一个...\n\n背景是...\n\n我的任务是...\n\n我采取了以下行动...\n\n最终结果是...`,
    }));

    // 项目相关问题
    const projectQuestions: InterviewQuestion[] = database.projects.slice(0, 3).map(proj => ({
      question: `请介绍一下你的 ${proj.name} 项目，你在其中的角色是什么？`,
      category: 'project' as const,
      difficulty: 'medium' as const,
      hint: `重点突出你的贡献和技术决策`,
      sampleAnswer: `${proj.name} 是一个 ${proj.type} 项目...\n\n我负责...\n\n使用的技术栈包括 ${proj.technologies?.join(', ')}...\n\n主要难点和解决方案是...`,
    }));

    // 公司相关问题
    const companyQuestions: InterviewQuestion[] = targetCompany ? [
      {
        question: `为什么选择 ${targetCompany}？你对我们公司有什么了解？`,
        category: 'company' as const,
        difficulty: 'medium' as const,
        hint: `展示你对公司的调研和热情`,
        sampleAnswer: `我关注 ${targetCompany} 很久了...\n\n我了解到公司最近在做...\n\n这与我的职业规划很匹配...\n\n我相信我能为公司带来...`,
      },
      {
        question: `你觉得你能为 ${targetCompany} 带来什么价值？`,
        category: 'company' as const,
        difficulty: 'hard' as const,
        hint: `结合你的技能和经验，说明你的独特价值`,
        sampleAnswer: `基于我的技能和经验，我认为我能带来...\n\n具体来说...\n\n我过去的成就可以证明...`,
      },
    ] : [];

    setQuestions([
      ...technicalQuestions,
      ...behavioralQuestions,
      ...projectQuestions,
      ...companyQuestions,
    ]);
    
    setLoading(false);
  };

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCategoryIcon = (category: InterviewQuestion['category']) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'behavioral': return <Users className="w-4 h-4" />;
      case 'project': return <Briefcase className="w-4 h-4" />;
      case 'company': return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: InterviewQuestion['category']) => {
    switch (category) {
      case 'technical': return '技术问题';
      case 'behavioral': return '行为问题';
      case 'project': return '项目问题';
      case 'company': return '公司问题';
    }
  };

  const getDifficultyColor = (difficulty: InterviewQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
    }
  };

  const getDifficultyLabel = (difficulty: InterviewQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">面试准备</h1>
        <p className="text-gray-600 mt-1">基于你的技能和经历，预测可能的面试问题</p>
      </div>

      {/* AI 配置提示 */}
      {!hasAIConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <span className="font-medium">提示：</span>
            请先在设置页面配置 AI API Key，以获得更精准的面试题预测
          </p>
        </div>
      )}

      {/* 输入区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">目标职位信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标公司（可选）
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：字节跳动、阿里巴巴"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标职位 *
            </label>
            <input
              type="text"
              value={targetPosition}
              onChange={(e) => setTargetPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：高级前端工程师"
            />
          </div>
        </div>

        {/* 当前数据概览 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            已有 <strong>{database.skills.length}</strong> 个技能、
            <strong>{database.experiences.length}</strong> 段经历、
            <strong>{database.projects.length}</strong> 个项目
          </p>
        </div>

        <button
          onClick={generateQuestions}
          disabled={loading || !targetPosition.trim()}
          className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? '生成中...' : '生成面试题'}
        </button>
      </div>

      {/* 面试题列表 */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              预测面试题 ({questions.length})
            </h2>
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">简单</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">中等</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded">困难</span>
            </div>
          </div>

          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {getCategoryIcon(q.category)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{q.question}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {getCategoryLabel(q.category)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(q.difficulty)}`}>
                        {getDifficultyLabel(q.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedQuestions.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedQuestions.has(index) && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {q.hint && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">💡 提示</p>
                      <p className="text-sm text-blue-600 mt-1">{q.hint}</p>
                    </div>
                  )}
                  
                  {q.sampleAnswer && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">参考答案</p>
                        <button
                          onClick={() => copyToClipboard(q.sampleAnswer!, index)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-4 h-4" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              复制
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                          {q.sampleAnswer}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {questions.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">开始准备面试</h3>
          <p className="text-gray-600 mb-4">
            输入目标职位，我们将基于你的技能和经历预测可能的面试问题
          </p>
        </div>
      )}

      {/* 面试模拟 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">AI 面试模拟</h3>
              <p className="text-sm text-indigo-100">与 AI 面试官进行模拟面试</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <InterviewSimulator position={targetPosition} />
        </div>
      </div>
    </div>
  );
}