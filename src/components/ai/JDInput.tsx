import { useState } from 'react';

interface JDInputProps {
  onParse: (jdText: string) => void;
  isLoading: boolean;
}

export function JDInput({ onParse, isLoading }: JDInputProps) {
  const [jdText, setJdText] = useState('');

  const handleParse = () => {
    if (jdText.trim()) {
      onParse(jdText);
    }
  };

  const handleClear = () => {
    setJdText('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">职位描述 (JD)</h3>
        <p className="text-sm text-gray-500 mt-1">粘贴职位描述文本，AI 将自动解析关键信息</p>
      </div>

      <div className="p-4">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="请粘贴职位描述内容，包括：
- 职位名称
- 公司介绍
- 岗位职责
- 任职要求
- 技能要求
- 薪资福利等

支持中英文职位描述..."
          className="w-full h-64 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {jdText.length > 0 && (
              <span>{jdText.length} 字符</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading || !jdText}
            >
              清空
            </button>
            <button
              onClick={handleParse}
              className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading || !jdText.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  解析中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  解析 JD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}