import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ColorfulTemplate } from './templates/ColorfulTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';

interface ResumePreviewProps {
  className?: string;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ className }, ref) => {
    const { resumeData, selectedTemplate, layoutSettings, sectionOrder } = useResume();
    const [scale, setScale] = useState(0.65);
    const innerRef = useRef<HTMLDivElement>(null);

    // 暴露 ref
    useImperativeHandle(ref, () => innerRef.current!);

    // 全局访问
    useEffect(() => {
      if (innerRef.current) {
        (window as any).__resumePreviewElement__ = innerRef.current;
      }
      return () => {
        (window as any).__resumePreviewElement__ = null;
      };
    }, []);

    const renderTemplate = () => {
      const props = { data: resumeData, layoutSettings, sectionOrder };
      switch (selectedTemplate) {
        case 'elegant':
          return <ElegantTemplate {...props} />;
        case 'classic':
          return <ClassicTemplate {...props} />;
        case 'minimal':
          return <MinimalTemplate {...props} />;
        case 'professional':
          return <ProfessionalTemplate {...props} />;
        case 'tech':
          return <TechTemplate {...props} />;
        case 'executive':
          return <ExecutiveTemplate {...props} />;
        case 'academic':
          return <AcademicTemplate {...props} />;
        case 'creative':
          return <CreativeTemplate {...props} />;
        case 'colorful':
          return <ColorfulTemplate {...props} />;
        default:
          return <ModernTemplate {...props} />;
      }
    };

    return (
      <div className={`bg-gray-200 overflow-hidden flex flex-col ${className || ''}`}>
        {/* 缩放控制栏 */}
        <div className="bg-gray-700 text-white flex items-center justify-between px-4 py-1.5">
          <span className="text-sm font-medium">实时预览</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(Math.max(0.4, scale - 0.1))}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-600 text-sm"
              title="缩小"
            >
              −
            </button>
            <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(1.2, scale + 0.1))}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-600 text-sm"
              title="放大"
            >
              +
            </button>
            <button
              onClick={() => setScale(0.65)}
              className="px-2 py-0.5 text-xs rounded hover:bg-gray-600"
              title="重置"
            >
              重置
            </button>
          </div>
        </div>
        
        {/* 预览区域 */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <div 
            ref={innerRef}
            className="bg-white shadow-lg"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

// 获取预览元素
export function getPreviewElement(): HTMLDivElement | null {
  return (window as any).__resumePreviewElement__ || null;
}