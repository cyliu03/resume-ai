import { useState } from 'react';
import { useDatabaseStore } from '../store/databaseStore';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getResourcesForSkill, getProjectsForSkills } from '../data/learningResources';

export function LearningCenterPage() {
  const { database } = useDatabaseStore();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // 获取技能缺口（待提升的技能）
  const skillGaps = database.skills.filter(s => s.level === '了解' || s.level === '熟悉');

  // 获取推荐项目
  const skillNames = database.skills.map(s => s.name);
  const recommendedProjects = getProjectsForSkills(skillNames);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">学习中心</h1>
        <p className="text-gray-500 mt-1">根据技能缺口，推荐学习资源和实践项目</p>
      </div>

      {/* 技能缺口分析 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          技能提升建议
        </h2>

        {skillGaps.length > 0 ? (
          <div className="space-y-3">
            {skillGaps.map((skill) => (
              <div key={skill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                      {skill.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">{skill.name}</h3>
                      <p className="text-sm text-gray-500">当前: {skill.level} · {skill.years}年</p>
                    </div>
                  </div>
                  {expandedSkill === skill.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {expandedSkill === skill.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">推荐学习资源</h4>
                    <div className="space-y-2">
                      {getResourcesForSkill(skill.name).map((resource) => (
                        <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{resource.name}</p>
                            <p className="text-sm text-gray-500">{resource.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{resource.difficulty}</span>
                              {resource.isFree && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">免费</span>}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                      {getResourcesForSkill(skill.name).length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">暂无相关资源</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600">技能水平都很不错！继续保持！</p>
          </div>
        )}
      </div>

      {/* 推荐项目 */}
      {recommendedProjects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            实战项目推荐
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {recommendedProjects.map((project, i) => (
              <a key={i} href={project.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300">
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded mt-2 inline-block">{project.difficulty}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 快捷入口 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">快速提升技能</h2>
        <div className="grid grid-cols-3 gap-4">
          <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="bg-white/20 rounded-lg p-3 hover:bg-white/30 text-center">
            <span className="text-2xl">📘</span>
            <p className="text-sm mt-1">Coursera</p>
          </a>
          <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 rounded-lg p-3 hover:bg-white/30 text-center">
            <span className="text-2xl">🎓</span>
            <p className="text-sm mt-1">Udemy</p>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 rounded-lg p-3 hover:bg-white/30 text-center">
            <span className="text-2xl">💻</span>
            <p className="text-sm mt-1">GitHub</p>
          </a>
        </div>
      </div>
    </div>
  );
}