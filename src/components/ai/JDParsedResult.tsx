import type { ParsedJD } from '../../types/ai';

interface JDParsedResultProps {
  jd: ParsedJD;
  matchScore?: number;
}

export function JDParsedResult({ jd, matchScore }: JDParsedResultProps) {
  if (!jd.title && jd.requirements.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">解析结果</h3>
          {matchScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">匹配度</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchScore >= 70 ? 'bg-green-100 text-green-800' :
                matchScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {matchScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 基本信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">职位名称</label>
            <p className="text-sm font-medium text-gray-800 mt-1">{jd.title || '未识别'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">公司名称</label>
            <p className="text-sm font-medium text-gray-800 mt-1">{jd.company || '未识别'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">工作地点</label>
            <p className="text-sm font-medium text-gray-800 mt-1">{jd.location || '未识别'}</p>
          </div>
        </div>

        {/* 经验和学历要求 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="text-xs text-gray-500 uppercase tracking-wide">经验要求</label>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {jd.experience.min}-{jd.experience.max} 年
              {jd.experience.preferred && <span className="text-gray-500 ml-1">({jd.experience.preferred})</span>}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="text-xs text-gray-500 uppercase tracking-wide">学历要求</label>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {jd.education.level || '不限'}
              {jd.education.field && <span className="text-gray-500 ml-1">({jd.education.field})</span>}
            </p>
          </div>
        </div>

        {/* 技能要求 */}
        {jd.skills.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">技能要求</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {jd.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 职位要求 */}
        {jd.requirements.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">任职要求</label>
            <ul className="mt-2 space-y-1">
              {jd.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 工作职责 */}
        {jd.responsibilities.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">工作职责</label>
            <ul className="mt-2 space-y-1">
              {jd.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 福利待遇 */}
        {jd.benefits.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">福利待遇</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {jd.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 关键词 */}
        {jd.keywords.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">关键词（用于简历优化）</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {jd.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}