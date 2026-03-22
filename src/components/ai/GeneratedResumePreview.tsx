import { useState } from 'react';
import type { PersonalDatabase } from '../../types/database';

interface GeneratedResumePreviewProps {
  resumeContent: string;
  profile: PersonalDatabase;
  onApply: () => void;
  onEdit: (content: string) => void;
  isGenerating?: boolean;
}

export function GeneratedResumePreview({
  resumeContent,
  profile,
  onApply,
  onEdit,
  isGenerating,
}: GeneratedResumePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(resumeContent);

  const handleSaveEdit = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(resumeContent);
    setIsEditing(false);
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600">正在生成简历...</p>
          <p className="text-sm text-gray-400 mt-1">AI 正在根据您的背景和职位要求撰写简历</p>
        </div>
      </div>
    );
  }

  if (!resumeContent) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">生成的简历</h3>
            <p className="text-sm text-gray-500 mt-1">
              为 {profile.profile.name || '您'} 定制的简历
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
            )}
            <button
              onClick={onApply}
              className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              应用到编辑器
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                保存修改
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm leading-relaxed overflow-auto max-h-[500px]">
              {resumeContent}
            </pre>
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div className="px-4 pb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            点击「应用到编辑器」将简历内容应用到简历编辑页面，您可以继续调整格式和内容。
          </p>
        </div>
      </div>
    </div>
  );
}