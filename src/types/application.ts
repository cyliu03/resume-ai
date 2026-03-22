// 投递记录类型

export type ApplicationStatus = 
  | 'pending'      // 待投递
  | 'submitted'    // 已投递
  | 'screening'    // 筛选中
  | 'interview'    // 面试中
  | 'offer'        // 已获 Offer
  | 'rejected'     // 已拒绝
  | 'withdrawn';   // 已撤回

export interface Application {
  id: string;
  company: string;
  position: string;
  jobUrl?: string;
  status: ApplicationStatus;
  
  // 联系人信息
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  
  // JD 信息
  jdSummary?: string;
  requiredSkills?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  location?: string;
  workMode?: 'onsite' | 'remote' | 'hybrid';
  
  // 时间线
  createdAt: string;
  submittedAt?: string;
  lastUpdated: string;
  
  // 面试记录
  interviews?: InterviewRecord[];
  
  // 笔试记录
  tests?: TestRecord[];
  
  // 备注
  notes?: string;
  tags?: string[];
}

export interface InterviewRecord {
  id: string;
  round: number;  // 第几轮
  type: 'phone' | 'video' | 'onsite' | 'group';
  date: string;
  duration?: number;  // 分钟
  interviewer?: string;
  questions?: string[];
  answers?: string[];
  feedback?: string;
  result: 'pending' | 'passed' | 'failed';
}

export interface TestRecord {
  id: string;
  type: 'online' | 'takehome' | 'coding';
  date: string;
  duration?: number;
  platform?: string;
  result: 'pending' | 'passed' | 'failed';
  notes?: string;
}

// 统计
export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number;  // 回复率
  interviewRate: number; // 面试率
  offerRate: number;     // Offer 率
}