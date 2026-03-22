import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, RotateCcw, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface InterviewSimulatorProps {
  position?: string;
}

export function InterviewSimulator({ position }: InterviewSimulatorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = () => {
    setMessages([]);
    setQuestionCount(0);
    setInterviewStarted(true);

    const greeting: Message = {
      role: 'assistant',
      content: `你好！我是今天的面试官。我们要进行一场${interviewType === 'behavioral' ? '行为面试' : interviewType === 'technical' ? '技术面试' : '综合面试'}。${position ? `申请的职位是 ${position}。` : ''}

我会问几个问题，请尽量详细地回答。准备好了吗？让我们开始吧！

---

**第一个问题：** 请做一个简短的自我介绍。`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
    setQuestionCount(1);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // 模拟 AI 回复（实际应调用 AI API）
    await new Promise(resolve => setTimeout(resolve, 2000));

    let response = '';
    const questionNum = questionCount + 1;

    // 根据面试类型生成问题
    if (questionNum <= 5) {
      const questions = interviewType === 'behavioral' ? behavioralQuestions : 
                        interviewType === 'technical' ? technicalQuestions : 
                        mixedQuestions;

      const nextQuestion = questions[(questionNum - 1) % questions.length];

      response = `感谢你的回答！${questionNum < 5 ? `
        
---

**问题 ${questionNum + 1}：** ${nextQuestion}` : `
        
---

面试结束了！感谢你的参与。你表现得很棒！

**面试总结：**
- 回答了 ${questionNum} 个问题
- 表达清晰，逻辑性强

**改进建议：**
- 可以用 STAR 方法（情境-任务-行动-结果）组织回答
- 多举具体例子说明你的能力

需要重新开始面试吗？`}`;

      setQuestionCount(questionNum);
    } else {
      response = `面试已经结束了。如果需要重新开始，请点击"重新开始"按钮。`;
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsThinking(false);
  };

  const resetInterview = () => {
    setMessages([]);
    setInput('');
    setInterviewStarted(false);
    setQuestionCount(0);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI 面试官</h3>
            <p className="text-sm text-blue-100">
              {interviewStarted ? `已回答 ${questionCount} 个问题` : '点击开始面试'}
            </p>
          </div>
        </div>
      </div>

      {!interviewStarted ? (
        <div className="p-6">
          <h4 className="font-medium text-gray-800 mb-4">选择面试类型</h4>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setInterviewType('behavioral')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                interviewType === 'behavioral' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium">行为面试</div>
              <div className="text-xs text-gray-500">软技能、团队协作</div>
            </button>
            <button
              onClick={() => setInterviewType('technical')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                interviewType === 'technical' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">💻</div>
              <div className="font-medium">技术面试</div>
              <div className="text-xs text-gray-500">技术能力、项目经验</div>
            </button>
            <button
              onClick={() => setInterviewType('mixed')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                interviewType === 'mixed' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium">综合面试</div>
              <div className="text-xs text-gray-500">全面考察</div>
            </button>
          </div>
          <button
            onClick={startInterview}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            开始面试
          </button>
        </div>
      ) : (
        <>
          {/* 消息区域 */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">思考中...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="输入你的回答..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isThinking}
              />
              <button
                onClick={sendMessage}
                disabled={isThinking || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={resetInterview}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                title="重新开始"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const behavioralQuestions = [
  '请描述一次你遇到困难并成功解决的经历。',
  '你是如何处理与团队成员的冲突的？',
  '请举例说明你如何在压力下工作。',
  '描述一次你主动承担责任超出本职工作的经历。',
  '你如何应对工作中的失败？',
];

const technicalQuestions = [
  '请介绍一个你负责的技术项目，你的角色是什么？',
  '你在项目中遇到过哪些技术挑战？如何解决的？',
  '你如何保持技术能力的持续提升？',
  '请介绍你使用过的一个技术栈，以及选择它的原因。',
  '你是如何进行代码评审和保证代码质量的？',
];

const mixedQuestions = [
  '请介绍一下你最引以为豪的项目。',
  '你如何平衡项目进度和技术债务？',
  '请描述一次你推动团队改进的经历。',
  '你期望在未来 3-5 年达到什么职业目标？',
  '为什么选择我们公司？',
];