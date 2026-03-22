import { useState } from 'react';
import { useApplicationStore } from '../store/applicationStore';
import type { Application, ApplicationStatus } from '../types/application';
import { Plus, Building2, MapPin, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待投递', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  submitted: { label: '已投递', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  screening: { label: '筛选中', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  interview: { label: '面试中', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  offer: { label: '已获Offer', color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { label: '已拒绝', color: 'text-red-600', bgColor: 'bg-red-100' },
  withdrawn: { label: '已撤回', color: 'text-gray-500', bgColor: 'bg-gray-50' },
};

export function ApplicationsPage() {
  const { applications, addApplication, updateApplication, removeApplication, updateStatus, getStats } = useApplicationStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const stats = getStats();
  const filteredApps = statusFilter === 'all' ? applications : applications.filter(app => app.status === statusFilter);
  const sortedApps = [...filteredApps].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">投递管理</h1>
          <p className="text-gray-500 mt-1">追踪你的求职进度</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />新增投递
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="总投递" value={stats.total} />
        <StatCard label="回复率" value={`${(stats.responseRate * 100).toFixed(0)}%`} color="blue" />
        <StatCard label="面试率" value={`${(stats.interviewRate * 100).toFixed(0)}%`} color="purple" />
        <StatCard label="Offer" value={stats.byStatus.offer} color="green" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>全部 ({applications.length})</button>
        {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => (
          <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusFilter === status ? `${STATUS_CONFIG[status].bgColor} ${STATUS_CONFIG[status].color}` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{STATUS_CONFIG[status].label} ({stats.byStatus[status]})</button>
        ))}
      </div>

      {sortedApps.length > 0 ? (
        <div className="space-y-3">
          {sortedApps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{app.position}</h3>
                    <p className="text-gray-500">{app.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      {app.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{app.location}</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${STATUS_CONFIG[app.status].bgColor} ${STATUS_CONFIG[app.status].color}`}>{STATUS_CONFIG[app.status].label}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
                </select>
                <button onClick={() => setEditingApp(app)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm('确定删除？')) removeApplication(app.id); }} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                {app.jobUrl && <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="ml-auto p-1.5 text-gray-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无投递记录</h3>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">新增投递</button>
        </div>
      )}

      {(showAddModal || editingApp) && (
        <ApplicationModal application={editingApp} onClose={() => { setShowAddModal(false); setEditingApp(null); }} onSave={async (data) => {
          if (editingApp) {
            await updateApplication(editingApp.id, data);
          } else if (data.company && data.position) {
            await addApplication({ company: data.company, position: data.position, status: data.status || 'pending', ...data });
          }
          setShowAddModal(false); setEditingApp(null);
        }} />
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'gray' }: { label: string; value: string | number; color?: 'gray' | 'blue' | 'green' | 'purple' }) {
  const colors = { gray: 'text-gray-600', blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600' };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <span className={`text-2xl font-bold ${colors[color]}`}>{value}</span>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function ApplicationModal({ application, onClose, onSave }: { application: Application | null; onClose: () => void; onSave: (data: Partial<Application>) => void }) {
  const [form, setForm] = useState({ company: application?.company || '', position: application?.position || '', jobUrl: application?.jobUrl || '', status: application?.status || 'pending' as ApplicationStatus, location: application?.location || '', notes: application?.notes || '' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-4">
        <h2 className="text-lg font-semibold mb-4">{application ? '编辑投递' : '新增投递'}</h2>
        <div className="space-y-3">
          <input type="text" placeholder="公司名称 *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input type="text" placeholder="职位名称 *" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input type="url" placeholder="职位链接" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input type="text" placeholder="工作地点" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
          </select>
          <textarea placeholder="备注" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={2} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">取消</button>
          <button onClick={() => onSave(form)} disabled={!form.company || !form.position} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">保存</button>
        </div>
      </div>
    </div>
  );
}