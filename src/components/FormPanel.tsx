import { useResume, type SectionKey } from '../context/ResumeContext';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { ProjectForm } from './forms/ProjectForm';
import { SkillForm } from './forms/SkillForm';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 表单组件映射
const FORM_COMPONENTS: Record<SectionKey, React.FC> = {
  personalInfo: PersonalInfoForm,
  experience: ExperienceForm,
  projects: ProjectForm,
  skills: SkillForm,
  education: EducationForm,
};

// 可排序的 Section 包装器
function SortableSection({ sectionKey }: { sectionKey: SectionKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const FormComponent = FORM_COMPONENTS[sectionKey];

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-4 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ transform: 'translateX(-100%)', paddingLeft: '8px' }}
      >
        <div className="flex flex-col gap-0.5 p-1 rounded bg-gray-200 hover:bg-gray-300">
          <div className="w-4 h-0.5 bg-gray-500 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-500 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-500 rounded"></div>
        </div>
      </div>
      
      {/* 表单内容 */}
      <div className={isDragging ? 'ring-2 ring-blue-400 rounded-lg' : ''}>
        <FormComponent />
      </div>
    </div>
  );
}

export function FormPanel() {
  const { sectionOrder, setSectionOrder } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionKey);
      const newIndex = sectionOrder.indexOf(over.id as SectionKey);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50">
      <div className="mb-3 px-2">
        <p className="text-xs text-gray-500">
          💡 悬停在区块上可显示拖拽手柄，拖拽可调整顺序
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {sectionOrder.map((sectionKey) => (
            <SortableSection key={sectionKey} sectionKey={sectionKey} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}