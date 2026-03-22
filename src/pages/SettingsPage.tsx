import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAIStore } from '../store/aiStore';
import { useDatabaseStore } from '../store/databaseStore';
import { useAIService } from '../services/aiService';
import { PROVIDERS, type AIProviderType, type APIKeyConfig } from '../types/ai';

type TabType = 'providers' | 'data' | 'history' | 'stats' | 'help';

export function SettingsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('providers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<APIKeyConfig | null>(null);

  // 处理从其他页面跳转过来的情况
  useEffect(() => {
    const state = location.state as { tab?: string } | undefined;
    if (state?.tab === 'help') {
      setActiveTab('help');
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">管理 AI 模型配置和查看使用统计</p>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'providers', label: 'AI 提供商', icon: '🔌' },
            { id: 'data', label: '数据管理', icon: '💾' },
            { id: 'history', label: '调用历史', icon: '📜' },
            { id: 'stats', label: '费用统计', icon: '💰' },
            { id: 'help', label: '帮助文档', icon: '📚' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 内容 */}
      {activeTab === 'providers' && (
        <ProvidersTab
          onAdd={() => setShowAddModal(true)}
          onEdit={setEditingProvider}
        />
      )}
      {activeTab === 'data' && <DataTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'help' && <HelpTab />}

      {/* 添加/编辑 Modal */}
      {(showAddModal || editingProvider) && (
        <ProviderModal
          provider={editingProvider}
          onClose={() => {
            setShowAddModal(false);
            setEditingProvider(null);
          }}
        />
      )}
    </div>
  );
}

// 提供商管理标签页
function ProvidersTab({
  onAdd,
  onEdit,
}: {
  onAdd: () => void;
  onEdit: (provider: APIKeyConfig) => void;
}) {
  const { providers, defaultProvider, setDefaultProvider, removeProvider } = useAIStore();

  return (
    <div className="space-y-4">
      {/* 添加按钮 */}
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          添加 AI 提供商
        </button>
      </div>

      {/* 提供商列表 */}
      {providers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4">🔌</div>
          <p className="text-gray-500">暂无配置的 AI 提供商</p>
          <p className="text-sm text-gray-400 mt-1">点击上方按钮添加</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    provider.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {PROVIDERS[provider.provider]?.name || provider.provider}
                    </span>
                    {defaultProvider === provider.provider && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        默认
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    添加于 {new Date(provider.createdAt).toLocaleDateString('zh-CN')}
                    {provider.lastUsed && (
                      <span className="ml-2">
                        · 最后使用 {new Date(provider.lastUsed).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDefaultProvider(provider.provider)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  设为默认
                </button>
                <button
                  onClick={() => onEdit(provider)}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要删除此配置吗？')) {
                      removeProvider(provider.id);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 支持的提供商说明 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">支持的 AI 提供商</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          {Object.values(PROVIDERS).map((p) => (
            <div key={p.type} className="flex items-center gap-2 text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 数据管理标签页
function DataTab() {
  const { database, exportDatabase, importDatabase, clearDatabase } = useDatabaseStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  // 导出数据
  const handleExport = () => {
    const data = exportDatabase();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // 验证数据结构
        if (!data.skills || !Array.isArray(data.skills)) {
          throw new Error('无效的数据格式：缺少技能数据');
        }
        if (!data.experiences || !Array.isArray(data.experiences)) {
          throw new Error('无效的数据格式：缺少经历数据');
        }
        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error('无效的数据格式：缺少项目数据');
        }

        importDatabase(data);
        setImportStatus('success');
        setImportMessage('数据导入成功！');

        // 3秒后清除状态
        setTimeout(() => {
          setImportStatus('idle');
          setImportMessage('');
        }, 3000);
      } catch (err) {
        setImportStatus('error');
        setImportMessage(err instanceof Error ? err.message : '导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 清空数据
  const handleClear = () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！\n建议先导出备份。')) {
      if (confirm('再次确认：这将删除所有技能、经历、项目和教育背景数据。')) {
        clearDatabase();
        alert('数据已清空');
      }
    }
  };

  // 计算数据统计
  const dataStats = {
    skills: database.skills.length,
    experiences: database.experiences.length,
    projects: database.projects.length,
    education: database.education.length,
    certificates: database.certificates.length,
  };

  return (
    <div className="space-y-6">
      {/* 数据统计 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">数据统计</h3>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{dataStats.skills}</div>
            <div className="text-sm text-gray-600">技能</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{dataStats.experiences}</div>
            <div className="text-sm text-gray-600">经历</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{dataStats.projects}</div>
            <div className="text-sm text-gray-600">项目</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{dataStats.education}</div>
            <div className="text-sm text-gray-600">教育</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">{dataStats.certificates}</div>
            <div className="text-sm text-gray-600">证书</div>
          </div>
        </div>
      </div>

      {/* 导出数据 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">导出数据</h3>
            <p className="text-sm text-gray-500 mt-1">
              将所有数据导出为 JSON 文件，用于备份或迁移到其他设备
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出数据
          </button>
        </div>
      </div>

      {/* 导入数据 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">导入数据</h3>
            <p className="text-sm text-gray-500 mt-1">
              从之前导出的 JSON 文件恢复数据，将覆盖当前数据
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              选择文件
            </button>
          </div>
        </div>

        {/* 导入状态 */}
        {importStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg ${
            importStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {importMessage}
          </div>
        )}
      </div>

      {/* 清空数据 */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-red-600">危险操作</h3>
            <p className="text-sm text-gray-500 mt-1">
              清空所有数据，包括技能、经历、项目和教育背景。此操作不可恢复！
            </p>
          </div>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清空数据
          </button>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">数据安全提示</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 所有数据存储在浏览器的 IndexedDB 中，不会上传到服务器</li>
          <li>• 建议定期导出备份，以防数据丢失</li>
          <li>• 清除浏览器数据可能会导致本地数据丢失</li>
          <li>• 导入数据会完全覆盖当前数据，请谨慎操作</li>
        </ul>
      </div>
    </div>
  );
}

// 调用历史标签页
function HistoryTab() {
  const { history, clearHistory } = useAIStore();

  return (
    <div className="space-y-4">
      {history.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (confirm('确定要清空所有历史记录吗？')) {
                clearHistory();
              }
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            清空历史
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4">📜</div>
          <p className="text-gray-500">暂无调用历史</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.slice(0, 50).map((record) => (
            <div
              key={record.id}
              className={`bg-white rounded-lg border p-4 ${
                record.success ? 'border-gray-200' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      record.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="font-medium">{record.model}</span>
                  <span className="text-sm text-gray-500">
                    {PROVIDERS[record.provider]?.name || record.provider}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(record.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {record.success ? record.response : record.error}
              </div>
              {record.success && (
                <div className="mt-2 text-xs text-gray-400 flex gap-4">
                  <span>Tokens: {record.tokens.total}</span>
                  <span>费用: ${record.cost.toFixed(4)}</span>
                  <span>耗时: {(record.duration / 1000).toFixed(2)}s</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 费用统计标签页
function StatsTab() {
  const { stats, resetStats } = useAIStore();

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500">总费用</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            ${stats.totalCost.toFixed(4)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500">总 Tokens</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalTokens.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500">调用次数</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {stats.callCount}
          </div>
        </div>
      </div>

      {/* 按提供商统计 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">按提供商统计</h3>
        {Object.keys(stats.byProvider).length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无数据</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stats.byProvider).map(([provider, data]) => (
              <div
                key={provider}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="font-medium">
                  {PROVIDERS[provider as AIProviderType]?.name || provider}
                </span>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>${data.cost.toFixed(4)}</span>
                  <span>{data.calls} 次调用</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 重置按钮 */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (confirm('确定要重置所有统计数据吗？')) {
              resetStats();
            }
          }}
          className="text-sm text-red-600 hover:text-red-700"
        >
          重置统计
        </button>
      </div>
    </div>
  );
}

// 添加/编辑提供商 Modal
function ProviderModal({
  provider,
  onClose,
}: {
  provider: APIKeyConfig | null;
  onClose: () => void;
}) {
  const { addProvider, updateProvider } = useAIStore();
  const { testConnection } = useAIService();

  const [formData, setFormData] = useState<{
    provider: AIProviderType;
    apiKey: string;
    baseUrl: string;
    model: string;
    isActive: boolean;
  }>({
    provider: provider?.provider || 'openai',
    apiKey: provider?.apiKey || '',
    baseUrl: provider?.baseUrl || PROVIDERS[provider?.provider || 'openai']?.defaultBaseUrl || '',
    model: provider?.model || '',
    isActive: provider?.isActive ?? true,
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    model?: string;
  } | null>(null);

  // 获取当前提供商的可用模型
  const getAvailableModels = () => {
    const p = formData.provider;
    const isCodingPlan = formData.baseUrl?.includes('coding.dashscope');
    
    // Coding Plan 特殊模型列表
    if (p === 'alibaba' && isCodingPlan) {
      return [
        { id: 'qwen3.5-plus', name: 'Qwen 3.5 Plus (推荐)' },
        { id: 'qwen3-coder-plus', name: 'Qwen 3 Coder Plus' },
        { id: 'qwen3-coder-next', name: 'Qwen 3 Coder Next' },
        { id: 'qwen3-max-2026-01-23', name: 'Qwen 3 Max' },
        { id: 'glm-5', name: 'GLM 5' },
        { id: 'kimi-k2.5', name: 'Kimi K2.5' },
      ];
    }
    
    // Ollama 模型
    if (p === 'ollama') {
      return [
        { id: 'qwen3.5:4b', name: 'Qwen 3.5 4B (推荐)' },
        { id: 'qwen3.5:9b', name: 'Qwen 3.5 9B' },
        { id: 'qwen3.5:27b', name: 'Qwen 3.5 27B' },
        { id: 'qwen3:8b', name: 'Qwen 3 8B' },
        { id: 'deepseek-r1:8b', name: 'DeepSeek R1 8B' },
        { id: 'llama3.1:8b', name: 'Llama 3.1 8B' },
        { id: 'phi4-mini', name: 'Phi-4 Mini' },
      ];
    }
    
    // 其他提供商
    return PROVIDERS[p]?.models?.map(m => ({ id: m.id, name: m.name })) || [];
  };

  const handleSubmit = () => {
    // Ollama 不需要 API Key
    if (formData.provider !== 'ollama' && !formData.apiKey.trim()) {
      alert('请输入 API Key');
      return;
    }

    if (provider) {
      updateProvider(provider.id, formData);
    } else {
      addProvider(formData);
    }
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    const result = await testConnection(formData);
    setTestResult(result);
    setTesting(false);
  };

  const selectedProvider = PROVIDERS[formData.provider];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {provider ? '编辑 AI 提供商' : '添加 AI 提供商'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* 提供商选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI 提供商
            </label>
            <select
              value={formData.provider}
              onChange={(e) => {
                const newProvider = e.target.value as AIProviderType;
                setFormData({
                  ...formData,
                  provider: newProvider,
                  baseUrl: PROVIDERS[newProvider]?.defaultBaseUrl || '',
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(PROVIDERS).map((p) => (
                <option key={p.type} value={p.type}>
                  {p.name} - {p.description}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          {formData.provider !== 'ollama' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) =>
                  setFormData({ ...formData, apiKey: e.target.value })
                }
                placeholder="请输入 API Key"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedProvider && selectedProvider.website && (
                <p className="text-xs text-gray-500 mt-1">
                  获取 API Key：
                  <a
                    href={selectedProvider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {selectedProvider.website}
                  </a>
                </p>
              )}
            </div>
          )}
          
          {/* Ollama 提示 */}
          {formData.provider === 'ollama' && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Ollama 无需 API Key，本地运行即可使用
              </p>
            </div>
          )}

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 地址（可选）
            </label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={(e) =>
                setFormData({ ...formData, baseUrl: e.target.value })
              }
              placeholder="使用默认地址"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 模型选择 */}
          {getAvailableModels().length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型选择
              </label>
              <select
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">自动选择（推荐）</option>
                {getAvailableModels().map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                不选择时将自动使用最适合的模型
              </p>
            </div>
          )}

          {/* 激活状态 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              激活此配置
            </label>
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div
              className={`p-3 rounded-lg text-sm ${
                testResult.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.message}
              {testResult.success && testResult.model && (
                <span className="ml-2">({testResult.model})</span>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {testing ? '测试中...' : '测试连接'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 帮助文档标签页
function HelpTab() {
  const [activeSection, setActiveSection] = useState<'guide' | 'ollama' | 'faq'>('guide');

  return (
    <div className="space-y-6">
      {/* 快捷导航 */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveSection('guide')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'guide'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📖 用户指南
        </button>
        <button
          onClick={() => setActiveSection('ollama')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'ollama'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🦙 Ollama 配置
        </button>
        <button
          onClick={() => setActiveSection('faq')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'faq'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ❓ 常见问题
        </button>
      </div>

      {/* 用户指南 */}
      {activeSection === 'guide' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">ResumeAI 用户使用指南</h2>
          
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 快速开始</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>1. 配置 AI 提供商</strong></p>
              <p className="ml-4">• 在「设置」页面添加 AI 提供商（推荐 OpenAI 或 Ollama）</p>
              <p className="ml-4">• 配置 API Key 并测试连接</p>
              <p className="ml-4">• 设置为默认提供商</p>
              
              <p className="mt-3"><strong>2. 填写基本信息</strong></p>
              <p className="ml-4">• 在「基本信息」页面填写个人资料</p>
              <p className="ml-4">• 添加教育背景</p>
              
              <p className="mt-3"><strong>3. 添加技能和经历</strong></p>
              <p className="ml-4">• 在「技能库」添加你的技能</p>
              <p className="ml-4">• 在「经历库」添加工作经历和项目经验</p>
              
              <p className="mt-3"><strong>4. 生成简历</strong></p>
              <p className="ml-4">• 在「简历编辑器」选择模板</p>
              <p className="ml-4">• 使用 AI 辅助优化内容</p>
              <p className="ml-4">• 导出 PDF 或在线分享</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ 核心功能</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">📋 简历生成</h4>
                <p className="text-sm text-gray-600 mt-1">9 款专业模板，AI 辅助撰写</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">🎯 JD 解析</h4>
                <p className="text-sm text-gray-600 mt-1">粘贴 JD，自动提取关键技能</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">📊 技能分析</h4>
                <p className="text-sm text-gray-600 mt-1">对比技能缺口，推荐学习资源</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800">💼 投递管理</h4>
                <p className="text-sm text-gray-600 mt-1">追踪投递状态，记录面试</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800">🔍 ATS 分析</h4>
                <p className="text-sm text-gray-600 mt-1">关键词匹配，优化通过率</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <h4 className="font-medium text-cyan-800">🎤 面试模拟</h4>
                <p className="text-sm text-gray-600 mt-1">AI 面试官，实时对话练习</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 使用技巧</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>快速导入</strong>：上传现有简历，自动解析填充</li>
              <li>• <strong>拖拽排序</strong>：简历各部分可自由拖拽调整顺序</li>
              <li>• <strong>预览缩放</strong>：40%-120% 缩放查看简历效果</li>
              <li>• <strong>技能同步</strong>：简历编辑器与技能库双向同步</li>
              <li>• <strong>一键优化</strong>：JD 解析后可一键补充关键词</li>
            </ul>
          </section>
        </div>
      )}

      {/* Ollama 配置 */}
      {activeSection === 'ollama' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">🦙 Ollama 本地部署配置指南</h2>
          
          {/* 重要提示 */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-medium text-amber-800">⚠️ 重要提示</p>
            <p className="text-sm text-amber-700 mt-1">
              在线 Demo（vercel.app）无法连接本地 Ollama，因为浏览器安全限制阻止 HTTPS 页面访问 HTTP 的 localhost。
            </p>
            <p className="text-sm text-amber-700 mt-1">
              如需使用 Ollama，请在本地运行项目：<code className="bg-amber-100 px-1 rounded">npm run dev</code>
            </p>
          </div>
          
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">为什么使用 Ollama？</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-medium text-green-800">隐私保护</h4>
                <p className="text-sm text-gray-600 mt-1">数据不离开本地</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-medium text-blue-800">完全免费</h4>
                <p className="text-sm text-gray-600 mt-1">无 API 费用</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl mb-2">📡</div>
                <h4 className="font-medium text-purple-800">离线可用</h4>
                <p className="text-sm text-gray-600 mt-1">无需网络连接</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">安装步骤</h3>
            <div className="space-y-3 text-gray-600">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">1. 下载安装 Ollama</p>
                <p className="text-sm mt-1">访问 <a href="https://ollama.ai" target="_blank" className="text-blue-600 underline">ollama.ai</a> 下载对应系统版本</p>
                <p className="text-sm text-gray-500 mt-1">Mac: <code className="bg-gray-200 px-1 rounded">brew install ollama</code></p>
                <p className="text-sm text-gray-500">Linux: <code className="bg-gray-200 px-1 rounded">curl -fsSL https://ollama.ai/install.sh | sh</code></p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">2. 启动 Ollama 服务</p>
                <p className="text-sm mt-1"><code className="bg-gray-200 px-1 rounded">ollama serve</code></p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">3. 下载模型</p>
                <p className="text-sm mt-1">根据显存选择合适的模型：</p>
                <table className="w-full mt-2 text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">显存</th>
                      <th className="text-left py-1">推荐模型</th>
                      <th className="text-left py-1">命令</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-1">4GB</td>
                      <td>Qwen3.5 0.8B</td>
                      <td><code className="bg-gray-200 px-1 rounded text-xs">ollama pull qwen3.5:0.8b</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">6GB</td>
                      <td>Qwen3.5 2B</td>
                      <td><code className="bg-gray-200 px-1 rounded text-xs">ollama pull qwen3.5:2b</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">8GB ⭐</td>
                      <td>Qwen3.5 4B</td>
                      <td><code className="bg-gray-200 px-1 rounded text-xs">ollama pull qwen3.5:4b</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">12GB</td>
                      <td>Qwen3.5 9B</td>
                      <td><code className="bg-gray-200 px-1 rounded text-xs">ollama pull qwen3.5:9b</code></td>
                    </tr>
                    <tr>
                      <td className="py-1">24GB+</td>
                      <td>Qwen3.5 27B</td>
                      <td><code className="bg-gray-200 px-1 rounded text-xs">ollama pull qwen3.5:27b</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">4. 配置 ResumeAI</p>
                <p className="text-sm mt-1">• 在「设置」→「AI 提供商」点击「添加 AI 提供商」</p>
                <p className="text-sm">• 选择「Ollama (本地)」</p>
                <p className="text-sm">• API 地址：<code className="bg-gray-200 px-1 rounded">http://localhost:11434</code></p>
                <p className="text-sm">• 选择已下载的模型</p>
                <p className="text-sm">• 点击「测试连接」确认成功</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🍎 Apple Silicon Mac 特别说明</h3>
            <p className="text-gray-600">M1/M2/M3/M4 系列芯片有统一内存架构，可直接使用内存运行大模型：</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• 8GB 内存：建议 Qwen3.5 2B</li>
              <li>• 16GB 内存：建议 Qwen3.5 4B</li>
              <li>• 32GB 内存：可运行 Qwen3.5 9B</li>
              <li>• 64GB+ 内存：可运行 Qwen3.5 27B</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">❓ 常见问题</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800">Q: 模型下载很慢怎么办？</p>
                <p className="text-sm text-gray-600 mt-1">A: 可以尝试使用镜像站或代理，模型文件较大（7B 约 4-5GB）</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800">Q: 显存不够怎么办？</p>
                <p className="text-sm text-gray-600 mt-1">A: 选择更小的模型，或使用 CPU 模式（较慢）</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800">Q: 如何查看已安装的模型？</p>
                <p className="text-sm text-gray-600 mt-1">A: 运行 <code className="bg-gray-200 px-1 rounded">ollama list</code></p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 常见问题 */}
      {activeSection === 'faq' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">❓ 常见问题</h2>
          
          <div className="space-y-4">
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">如何导入已有简历？</summary>
              <p className="mt-3 text-gray-600">在「AI 助手」页面，点击「简历导入」标签，上传 PDF 或 Word 文档，系统会自动解析并填充到各个模块。</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">简历模板可以自定义吗？</summary>
              <p className="mt-3 text-gray-600">目前支持 9 款预设模板，可以在简历编辑器中切换。自定义颜色和字体功能正在开发中。</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">AI 功能收费吗？</summary>
              <p className="mt-3 text-gray-600">使用 OpenAI 等 API 需要自行承担 API 费用。推荐使用 Ollama 本地部署，完全免费。</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">数据存储在哪里？</summary>
              <p className="mt-3 text-gray-600">所有数据存储在浏览器本地（IndexedDB），不会上传到服务器。清除浏览器数据会丢失所有内容，建议定期导出备份。</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">如何提高 ATS 通过率？</summary>
              <p className="mt-3 text-gray-600">1. 使用「JD 解析」提取关键词<br/>2. 使用「ATS 分析」检查匹配度<br/>3. 确保关键技能出现在简历中<br/>4. 使用标准格式，避免图表和特殊字体</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">面试模拟怎么用？</summary>
              <p className="mt-3 text-gray-600">在「面试准备」页面，选择面试类型（行为/技术/综合），AI 会扮演面试官进行模拟面试。结束后会给出评价和建议。</p>
            </details>
            
            <details className="p-4 border border-gray-200 rounded-lg">
              <summary className="font-medium text-gray-800 cursor-pointer">支持哪些 AI 模型？</summary>
              <p className="mt-3 text-gray-600">支持 OpenAI (GPT-4/GPT-3.5)、Claude、Gemini、文心一言、通义千问、DeepSeek、智谱 AI、Moonshot、Ollama 本地模型等。</p>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}