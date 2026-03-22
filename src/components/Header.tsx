import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useDatabaseStore } from '../store/databaseStore';
import { TemplateSelector } from './TemplateSelector';
import { LayoutSettingsPanel } from './LayoutSettingsPanel';
import { parseResumeFile } from '../utils/fileParsers';
import { sampleResumeData } from '../utils/sampleData';
import { exportToWord } from '../services/exportService';
import type { ResumeData } from '../types/resume';

const emptyResumeData: ResumeData = {
  personalInfo: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
  education: [], experience: [], projects: [], skills: [],
};

export function Header() {
  const { resumeData, lastSaved, setResumeData, importResumeData, syncFromDatabase } = useResume();
  const { database } = useDatabaseStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  useEffect(() => { if (lastSaved) setSaveStatus('saved'); }, [lastSaved]);

  const formatSaveTime = (date: Date | null) => {
    if (!date) return '';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return '刚刚已保存';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前已保存`;
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} 已保存`;
  };

  const handleExportPDF = () => {
    const previewElement = (window as any).__resumePreviewElement__ as HTMLDivElement | null;
    if (!previewElement) { alert('预览区域未加载，请刷新页面重试'); return; }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('请允许弹出窗口以导出 PDF'); return; }

    const clonedElement = previewElement.cloneNode(true) as HTMLDivElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '20mm';
    
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>${resumeData.personalInfo.name || '简历'}</title>
      <style>@page { margin: 0; size: A4; } body { margin: 0; padding: 0; } @media print { body { -webkit-print-color-adjust: exact; } }</style>
      </head><body>${clonedElement.outerHTML}</body></html>`);
    printWindow.document.close();
    
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleExportWord = async () => {
    try { await exportToWord(resumeData, resumeData.personalInfo.name || '简历'); }
    catch (error) { console.error('Word export failed:', error); alert('导出Word失败，请重试'); }
  };

  const handleExportImage = async () => {
    const previewElement = (window as any).__resumePreviewElement__ as HTMLDivElement | null;
    if (!previewElement) { alert('预览区域未加载，请刷新页面重试'); return; }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const originalTransform = previewElement.style.transform;
      previewElement.style.transform = 'none';
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(previewElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      previewElement.style.transform = originalTransform;
      
      const link = document.createElement('a');
      link.download = `${resumeData.personalInfo.name || '简历'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) { console.error('Image export failed:', error); alert('导出图片失败，请重试'); }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.personalInfo.name || '简历'}_data.json`;
    link.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await parseResumeFile(file);
      if (result.data && 'personalInfo' in result.data) importResumeData(result.data as ResumeData);
      else alert('导入的文件格式不完整，请检查文件内容');
    } catch (error) { console.error('Import failed:', error); alert('导入失败，请确保文件格式正确'); }
    finally { setImporting(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="返回主界面"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">简历制作系统</h1>
            <TemplateSelector />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 mr-2 flex items-center gap-1">
              {saveStatus === 'saved' && lastSaved && (
                <><svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span>{formatSaveTime(lastSaved)}</span></>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.json" onChange={handleImport} className="hidden" />
            <button 
              onClick={() => {
                if (database.skills.length === 0 && database.experiences.length === 0) {
                  alert('技能库和经历库为空，请先添加数据');
                  return;
                }
                if (confirm('确定从技能库同步数据？当前简历内容将被替换。')) {
                  syncFromDatabase(database);
                }
              }} 
              className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
              title="从技能库同步最新数据"
            >
              🔄 同步
            </button>
            <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">{importing ? '导入中...' : '导入'}</button>
            <button onClick={() => importResumeData(sampleResumeData)} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">示例数据</button>
            <button onClick={() => { if (confirm('确定清空?')) setResumeData(emptyResumeData); }} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">清空</button>
            <button onClick={() => setShowLayoutSettings(!showLayoutSettings)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">排版设置</button>
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                onBlur={() => setTimeout(() => setShowExportMenu(false), 200)}
                className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                导出 ▾
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button onClick={handleExportPDF} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">📄 导出 PDF</button>
                  <button onClick={handleExportWord} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">📝 导出 Word</button>
                  <button onClick={handleExportImage} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">🖼️ 导出图片</button>
                  <button onClick={handleExportJSON} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">💾 导出 JSON</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showLayoutSettings && <LayoutSettingsPanel isOpen={showLayoutSettings} onClose={() => setShowLayoutSettings(false)} />}
    </>
  );
}