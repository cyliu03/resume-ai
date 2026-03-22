import { useState } from 'react';
import { Plus, Trash2, Trophy, DollarSign, TrendingUp, Clock } from 'lucide-react';
import type { Offer } from '../types/ats';

export function OfferComparison() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addOffer = (offer: Omit<Offer, 'id' | 'createdAt'>) => {
    const newOffer: Offer = {
      ...offer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setOffers([...offers, newOffer]);
    setShowAddModal(false);
  };

  const removeOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  // 计算得分
  const calculateScores = () => {
    if (offers.length === 0) return null;

    const scores: Record<string, { total: number; salary: number; growth: number; wlb: number; stability: number }> = {};
    let maxSalary = 0;

    offers.forEach(o => {
      const total = (o.baseSalary + (o.bonus || 0));
      if (total > maxSalary) maxSalary = total;
    });

    offers.forEach(o => {
      const salaryScore = ((o.baseSalary + (o.bonus || 0)) / maxSalary) * 100;
      const growthScore = o.growthPotential * 20;
      const wlbScore = o.workLifeBalance * 20;
      const stabilityScore = o.companyStability * 20;

      scores[o.id] = {
        total: (salaryScore * 0.4 + growthScore * 0.2 + wlbScore * 0.2 + stabilityScore * 0.2),
        salary: salaryScore,
        growth: growthScore,
        wlb: wlbScore,
        stability: stabilityScore,
      };
    });

    // 推荐结果
    let bestOverall = offers[0].id;
    let bestSalary = offers[0].id;
    let bestGrowth = offers[0].id;
    let bestWLB = offers[0].id;

    offers.forEach(o => {
      if (scores[o.id].total > scores[bestOverall].total) bestOverall = o.id;
      if (scores[o.id].salary > scores[bestSalary].salary) bestSalary = o.id;
      if (scores[o.id].growth > scores[bestGrowth].growth) bestGrowth = o.id;
      if (scores[o.id].wlb > scores[bestWLB].wlb) bestWLB = o.id;
    });

    return { scores, recommendation: { bestOverall, bestSalary, bestGrowth, bestWLB } };
  };

  const result = calculateScores();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Offer 对比工具</h2>
          <p className="text-sm text-gray-500">从多维度对比 Offer，辅助决策</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加 Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无 Offer</h3>
          <p className="text-gray-500 mb-4">添加你的 Offer 开始对比分析</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            添加第一个 Offer
          </button>
        </div>
      ) : (
        <>
          {/* 对比表格 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">维度</th>
                  {offers.map(o => (
                    <th key={o.id} className="px-4 py-3 text-left text-sm font-medium text-gray-800">
                      <div className="flex items-center justify-between">
                        <span>{o.company}</span>
                        <button onClick={() => removeOffer(o.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">职位</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3 text-sm font-medium">{o.position}</td>
                  ))}
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-3 text-sm font-medium text-green-800">💰 年薪</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3">
                      <span className="text-lg font-bold text-green-600">
                        ¥{((o.baseSalary + (o.bonus || 0)) / 10000).toFixed(0)}万
                      </span>
                      {o.bonus && <span className="text-xs text-gray-400 block">含奖金 {o.bonus / 10000}万</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">📍 地点</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3 text-sm">{o.location}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">工作模式</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3 text-sm">
                      {o.workMode === 'remote' ? '🏠 远程' : o.workMode === 'hybrid' ? '🏢 混合' : '🏢 现场'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">📈 成长潜力</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3">
                      <RatingStars value={o.growthPotential} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">⚖️ 工作生活平衡</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3">
                      <RatingStars value={o.workLifeBalance} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">🏢 公司稳定性</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3">
                      <RatingStars value={o.companyStability} />
                    </td>
                  ))}
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-800">综合得分</td>
                  {offers.map(o => (
                    <td key={o.id} className="px-4 py-3">
                      <span className="text-lg font-bold text-blue-600">
                        {result?.scores[o.id].total.toFixed(0)}
                      </span>
                      <span className="text-sm text-gray-400">/100</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 推荐结果 */}
          {result && offers.length >= 2 && (
            <div className="grid grid-cols-4 gap-4">
              <RecommendationCard
                icon={<Trophy className="w-6 h-6" />}
                title="综合最佳"
                company={offers.find(o => o.id === result.recommendation.bestOverall)?.company || ''}
                color="blue"
              />
              <RecommendationCard
                icon={<DollarSign className="w-6 h-6" />}
                title="薪资最高"
                company={offers.find(o => o.id === result.recommendation.bestSalary)?.company || ''}
                color="green"
              />
              <RecommendationCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="成长最好"
                company={offers.find(o => o.id === result.recommendation.bestGrowth)?.company || ''}
                color="purple"
              />
              <RecommendationCard
                icon={<Clock className="w-6 h-6" />}
                title="WLB 最佳"
                company={offers.find(o => o.id === result.recommendation.bestWLB)?.company || ''}
                color="yellow"
              />
            </div>
          )}
        </>
      )}

      {/* 添加 Offer 弹窗 */}
      {showAddModal && (
        <OfferModal
          onClose={() => setShowAddModal(false)}
          onSave={addOffer}
        />
      )}
    </div>
  );
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= value ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
  );
}

function RecommendationCard({ icon, title, company, color }: { icon: React.ReactNode; title: string; company: string; color: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`rounded-xl p-4 border ${colors[color as keyof typeof colors]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="font-medium">{title}</span></div>
      <p className="text-lg font-bold">{company}</p>
    </div>
  );
}

function OfferModal({ onClose, onSave }: { onClose: () => void; onSave: (offer: Omit<Offer, 'id' | 'createdAt'>) => void }) {
  const [form, setForm] = useState({
    company: '', position: '', baseSalary: 0, bonus: 0, location: '',
    workMode: 'onsite' as Offer['workMode'], growthPotential: 3 as Offer['growthPotential'],
    workLifeBalance: 3 as Offer['workLifeBalance'], companyStability: 3 as Offer['companyStability'],
    benefits: [] as string[], notes: '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">添加 Offer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位 *</label>
              <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月薪 (元) *</label>
              <input type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年终奖 (元)</label>
              <input type="number" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工作地点</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工作模式</label>
              <select value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value as Offer['workMode'] })} className="w-full border rounded-lg px-3 py-2">
                <option value="onsite">现场</option>
                <option value="hybrid">混合</option>
                <option value="remote">远程</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">评分 (1-5)</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-gray-500">成长潜力</span>
                <select value={form.growthPotential} onChange={(e) => setForm({ ...form, growthPotential: Number(e.target.value) as Offer['growthPotential'] })} className="w-full border rounded px-2 py-1 text-sm">
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <span className="text-xs text-gray-500">工作生活平衡</span>
                <select value={form.workLifeBalance} onChange={(e) => setForm({ ...form, workLifeBalance: Number(e.target.value) as Offer['workLifeBalance'] })} className="w-full border rounded px-2 py-1 text-sm">
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <span className="text-xs text-gray-500">公司稳定性</span>
                <select value={form.companyStability} onChange={(e) => setForm({ ...form, companyStability: Number(e.target.value) as Offer['companyStability'] })} className="w-full border rounded px-2 py-1 text-sm">
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">取消</button>
          <button onClick={() => { if (form.company && form.position && form.baseSalary) { onSave(form); } }} disabled={!form.company || !form.position || !form.baseSalary} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">保存</button>
        </div>
      </div>
    </div>
  );
}