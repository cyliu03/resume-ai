import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Lightbulb, BarChart3 } from 'lucide-react';
import type { ATSAnalysis, KeywordMatch, ATSSuggestion } from '../types/ats';

export function ATSAnalyzer() {
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeKeywords = () => {
    if (!jdText.trim() || !resumeText.trim()) {
      alert('请输入 JD 和简历内容');
      return;
    }

    setAnalyzing(true);

    // 模拟 ATS 分析（实际应调用 AI）
    setTimeout(() => {
      const jdKeywords = extractKeywords(jdText);
      const resumeKeywords = extractKeywords(resumeText);

      const matchedKeywords: KeywordMatch[] = [];
      const missingKeywords: string[] = [];

      jdKeywords.forEach(jdKw => {
        const found = resumeKeywords.some(rKw => 
          rKw.keyword.toLowerCase() === jdKw.keyword.toLowerCase()
        );
        
        matchedKeywords.push({
          ...jdKw,
          inResume: found,
        });

        if (!found && jdKw.importance === 'required') {
          missingKeywords.push(jdKw.keyword);
        }
      });

      const matchScore = Math.round(
        (matchedKeywords.filter(k => k.inResume).length / matchedKeywords.length) * 100
      );

      const suggestions: ATSSuggestion[] = missingKeywords.slice(0, 5).map(kw => ({
        type: 'add_keyword' as const,
        keyword: kw,
        reason: 'JD 中明确要求此技能，但简历中未提及',
        example: `建议在技能或经历部分添加 "${kw}" 相关内容`,
      }));

      setAnalysis({
        jdKeywords: matchedKeywords,
        resumeKeywords: resumeKeywords.map(kw => ({ ...kw, inJD: jdKeywords.some(j => j.keyword.toLowerCase() === kw.keyword.toLowerCase()) })),
        matchScore,
        missingKeywords,
        suggestions,
      });

      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          ATS 关键词分析
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          分析 JD 和简历的关键词匹配度，优化简历通过 ATS 筛选
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">职位描述 (JD)</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="粘贴职位描述..."
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">简历内容</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="粘贴简历文本..."
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={analyzeKeywords}
          disabled={analyzing}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              分析中...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              开始分析
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* 匹配度得分 */}
          <div className={`rounded-xl p-6 ${analysis.matchScore >= 80 ? 'bg-green-50 border border-green-200' : analysis.matchScore >= 60 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {analysis.matchScore >= 80 ? '🎉 匹配度优秀' : analysis.matchScore >= 60 ? '⚠️ 匹配度一般' : '❌ 匹配度较低'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {analysis.matchScore >= 80 ? '简历与 JD 匹配度很高，通过 ATS 筛选的概率较大' : analysis.matchScore >= 60 ? '建议补充缺失关键词提高匹配度' : '需要大幅优化简历内容'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{analysis.matchScore}%</div>
                <div className="text-sm text-gray-500">匹配度</div>
              </div>
            </div>
          </div>

          {/* 关键词列表 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">关键词对比</h3>
            <div className="space-y-2">
              {analysis.jdKeywords.slice(0, 15).map((kw, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    {kw.inResume ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium">{kw.keyword}</span>
                    <span className="text-xs text-gray-400">{kw.category}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${kw.importance === 'required' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {kw.importance === 'required' ? '必需' : kw.importance === 'preferred' ? '优先' : '加分'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 优化建议 */}
          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                优化建议
              </h3>
              <div className="space-y-3">
                {analysis.suggestions.map((sug, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">添加关键词: {sug.keyword}</p>
                    <p className="text-sm text-blue-600 mt-1">{sug.example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 简单的关键词提取（实际应使用 AI）
function extractKeywords(text: string): KeywordMatch[] {
  const techKeywords = [
    'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Git', 'SQL', 'MongoDB', 'Redis', 'GraphQL',
    'CI/CD', 'Linux', 'Machine Learning', 'AI', 'API', 'REST', 'Microservices',
  ];

  const found: KeywordMatch[] = [];
  const lowerText = text.toLowerCase();

  techKeywords.forEach(kw => {
    if (lowerText.includes(kw.toLowerCase())) {
      found.push({
        keyword: kw,
        category: 'skill',
        inJD: true,
        inResume: false,
        importance: lowerText.includes('must') || lowerText.includes('required') ? 'required' : 'preferred',
        count: 1,
      });
    }
  });

  return found;
}