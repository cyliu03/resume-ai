import { useResume } from '../context/ResumeContext';
import type { LayoutSettings, LayoutPreset } from '../types/resume';
import { layoutPresets, defaultLayoutSettings } from '../types/resume';

interface LayoutSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetOptions: { id: LayoutPreset; name: string; description: string }[] = [
  { id: 'compact', name: '紧凑型', description: '信息密集，适合内容较多的简历' },
  { id: 'standard', name: '标准型', description: '平衡布局，适合大多数情况' },
  { id: 'loose', name: '宽松型', description: '留白多，突出重点内容' },
];

const colorPresets = [
  { name: '默认蓝', primary: '#2563eb', accent: '#1e40af' },
  { name: '深蓝', primary: '#1e3a8a', accent: '#1e40af' },
  { name: '绿色', primary: '#059669', accent: '#047857' },
  { name: '紫色', primary: '#7c3aed', accent: '#6d28d9' },
  { name: '红色', primary: '#dc2626', accent: '#b91c1c' },
  { name: '橙色', primary: '#ea580c', accent: '#c2410c' },
  { name: '灰色', primary: '#4b5563', accent: '#374151' },
  { name: '黑色', primary: '#1f2937', accent: '#111827' },
];

export function LayoutSettingsPanel({ isOpen, onClose }: LayoutSettingsPanelProps) {
  const { layoutSettings, setLayoutSettings } = useResume();

  if (!isOpen) return null;

  const handlePresetChange = (preset: LayoutPreset) => {
    setLayoutSettings(layoutPresets[preset]);
  };

  const updateSetting = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    setLayoutSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefault = () => {
    setLayoutSettings(defaultLayoutSettings);
  };

  const inputClass = "w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">排版设置</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Preset Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">预设方案</h3>
            <div className="grid grid-cols-3 gap-3">
              {presetOptions.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    JSON.stringify(layoutSettings) === JSON.stringify(layoutPresets[preset.id])
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-800">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Sizes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">字体大小 (pt)</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>标题</label>
                <input
                  type="number"
                  value={layoutSettings.titleSize}
                  onChange={e => updateSetting('titleSize', Number(e.target.value))}
                  className={inputClass}
                  min={16}
                  max={32}
                />
              </div>
              <div>
                <label className={labelClass}>小标题</label>
                <input
                  type="number"
                  value={layoutSettings.headingSize}
                  onChange={e => updateSetting('headingSize', Number(e.target.value))}
                  className={inputClass}
                  min={10}
                  max={20}
                />
              </div>
              <div>
                <label className={labelClass}>正文</label>
                <input
                  type="number"
                  value={layoutSettings.bodySize}
                  onChange={e => updateSetting('bodySize', Number(e.target.value))}
                  className={inputClass}
                  min={8}
                  max={14}
                />
              </div>
              <div>
                <label className={labelClass}>小字</label>
                <input
                  type="number"
                  value={layoutSettings.smallSize}
                  onChange={e => updateSetting('smallSize', Number(e.target.value))}
                  className={inputClass}
                  min={6}
                  max={12}
                />
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">间距设置</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>行高倍数</label>
                <input
                  type="number"
                  value={layoutSettings.lineHeight}
                  onChange={e => updateSetting('lineHeight', Number(e.target.value))}
                  className={inputClass}
                  min={1}
                  max={2.5}
                  step={0.1}
                />
              </div>
              <div>
                <label className={labelClass}>段落间距 (px)</label>
                <input
                  type="number"
                  value={layoutSettings.sectionGap}
                  onChange={e => updateSetting('sectionGap', Number(e.target.value))}
                  className={inputClass}
                  min={8}
                  max={40}
                />
              </div>
              <div>
                <label className={labelClass}>条目间距 (px)</label>
                <input
                  type="number"
                  value={layoutSettings.itemGap}
                  onChange={e => updateSetting('itemGap', Number(e.target.value))}
                  className={inputClass}
                  min={4}
                  max={20}
                />
              </div>
            </div>
          </div>

          {/* Margins */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">页边距 (mm)</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>上</label>
                <input
                  type="number"
                  value={layoutSettings.marginTop}
                  onChange={e => updateSetting('marginTop', Number(e.target.value))}
                  className={inputClass}
                  min={5}
                  max={30}
                />
              </div>
              <div>
                <label className={labelClass}>下</label>
                <input
                  type="number"
                  value={layoutSettings.marginBottom}
                  onChange={e => updateSetting('marginBottom', Number(e.target.value))}
                  className={inputClass}
                  min={5}
                  max={30}
                />
              </div>
              <div>
                <label className={labelClass}>左</label>
                <input
                  type="number"
                  value={layoutSettings.marginLeft}
                  onChange={e => updateSetting('marginLeft', Number(e.target.value))}
                  className={inputClass}
                  min={5}
                  max={30}
                />
              </div>
              <div>
                <label className={labelClass}>右</label>
                <input
                  type="number"
                  value={layoutSettings.marginRight}
                  onChange={e => updateSetting('marginRight', Number(e.target.value))}
                  className={inputClass}
                  min={5}
                  max={30}
                />
              </div>
            </div>
          </div>

          {/* Color Theme */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">颜色主题</h3>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {colorPresets.map(color => (
                <button
                  key={color.name}
                  onClick={() => {
                    updateSetting('primaryColor', color.primary);
                    updateSetting('accentColor', color.accent);
                  }}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    layoutSettings.primaryColor === color.primary
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: color.primary }} />
                    <span className="text-xs text-gray-600">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>主色调</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={layoutSettings.primaryColor}
                    onChange={e => updateSetting('primaryColor', e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={layoutSettings.primaryColor}
                    onChange={e => updateSetting('primaryColor', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>强调色</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={layoutSettings.accentColor}
                    onChange={e => updateSetting('accentColor', e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={layoutSettings.accentColor}
                    onChange={e => updateSetting('accentColor', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            恢复默认
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}