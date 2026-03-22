
import { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import type { TemplateType } from '../types/resume';

const templates: { id: TemplateType; name: string; description: string; category: string }[] = [
  { id: 'modern', name: '现代', description: '简洁现代，适合技术岗位', category: '推荐' },
  { id: 'classic', name: '经典', description: '传统正式，适合各行各业', category: '推荐' },
  { id: 'minimal', name: '简约', description: '极简风格，突出内容本身', category: '推荐' },
  { id: 'professional', name: '专业', description: '商务专业，适合企业求职', category: '商务' },
  { id: 'tech', name: '技术', description: '技术导向，突出技能项目', category: '技术' },
  { id: 'executive', name: '高管', description: '高端大气，适合管理岗位', category: '管理' },
  { id: 'academic', name: '学术', description: '学术风格，适合科研教育', category: '学术' },
  { id: 'creative', name: '创意', description: '创意设计，适合设计岗位', category: '创意' },
  { id: 'colorful', name: '活力', description: '活泼多彩，适合年轻求职者', category: '创意' },
];

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const [showAll, setShowAll] = useState(false);

  const displayTemplates = showAll ? templates : templates.slice(0, 3);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 mr-2">模板:</span>
      <div className="flex gap-2 flex-wrap">
        {displayTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            title={template.description}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedTemplate === template.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {template.name}
          </button>
        ))}
        {!showAll && templates.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="px-3 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50"
          >
            更多 ▾
          </button>
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
          >
            收起
          </button>
        )}
      </div>
    </div>
  );
}