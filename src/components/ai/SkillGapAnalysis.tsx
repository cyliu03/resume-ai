import type { SkillGap } from '../../types/ai';

interface SkillGapAnalysisProps {
  gaps: SkillGap[];
  matchScore: number;
  isLoading?: boolean;
  onOptimizeResume?: () => void;
}

export function SkillGapAnalysis({ gaps, matchScore, isLoading, onOptimizeResume }: SkillGapAnalysisProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (gaps.length === 0) {
    return null;
  }

  const requiredGaps = gaps.filter(g => g.required);
  const optionalGaps = gaps.filter(g => !g.required);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">技能缺口分析</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">整体匹配度</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  matchScore >= 70 ? 'bg-green-500' :
                  matchScore >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{matchScore}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 必需技能缺口 */}
        {requiredGaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              必需技能缺口 ({requiredGaps.length})
            </h4>
            <div className="space-y-2">
              {requiredGaps.map((gap, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{gap.skill}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {gap.currentLevel && (
                        <span className="px-2 py-0.5 bg-gray-200 rounded">{gap.currentLevel}</span>
                      )}
                      <span>→</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">{gap.requiredLevel}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{gap.gap}</p>
                  <p className="text-sm text-blue-600 mt-1 flex items-start gap-1">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {gap.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 加分技能缺口 */}
        {optionalGaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              加分技能缺口 ({optionalGaps.length})
            </h4>
            <div className="space-y-2">
              {optionalGaps.map((gap, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{gap.skill}</span>
                  </div>
                  <p className="text-sm text-gray-600">{gap.gap}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 一键优化按钮 */}
        {onOptimizeResume && matchScore < 80 && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onOptimizeResume}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium flex items-center justify-center gap-2"
            >
              <span className="text-xl">⚡</span>
              一键优化简历（自动补充关键词）
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              自动将缺失的关键技能添加到简历中，提高匹配度
            </p>
          </div>
        )}
      </div>
    </div>
  );
}