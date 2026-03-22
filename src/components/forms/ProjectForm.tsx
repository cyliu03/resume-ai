
import { useResume } from '../../context/ResumeContext';
import type { Project } from '../../types/resume';

export function ProjectForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const { projects } = resumeData;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">项目经验</h3>
        <button
          onClick={addProject}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        >
          + 添加
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">点击"添加"按钮添加项目经验</p>
      ) : (
        projects.map((project: Project, index: number) => (
          <div key={project.id} className="border border-gray-200 rounded-md p-3 mb-3 relative">
            <button
              onClick={() => removeProject(project.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
            <div className="text-sm font-medium text-gray-600 mb-2">项目 #{index + 1}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>项目名称 *</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className={inputClass}
                  placeholder="电商平台系统"
                />
              </div>
              <div>
                <label className={labelClass}>项目链接</label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  className={inputClass}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>项目描述</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                className={`${inputClass} h-20 resize-none`}
                placeholder="描述项目背景、你的角色和主要贡献..."
                rows={3}
              />
            </div>
            <div className="mt-3">
              <label className={labelClass}>技术栈</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                className={inputClass}
                placeholder="React, TypeScript, Node.js, MongoDB"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}