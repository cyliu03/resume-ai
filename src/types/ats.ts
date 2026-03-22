// ATS 关键词优化类型

export interface ATSAnalysis {
  jdKeywords: KeywordMatch[];
  resumeKeywords: KeywordMatch[];
  matchScore: number;
  missingKeywords: string[];
  suggestions: ATSSuggestion[];
}

export interface KeywordMatch {
  keyword: string;
  category: 'skill' | 'tool' | 'certification' | 'experience' | 'education' | 'soft_skill';
  inJD: boolean;
  inResume: boolean;
  importance: 'required' | 'preferred' | 'nice_to_have';
  count: number;
}

export interface ATSSuggestion {
  type: 'add_keyword' | 'increase_frequency' | 'rephrase' | 'add_section';
  keyword: string;
  reason: string;
  example?: string;
}

export interface Offer {
  id: string;
  company: string;
  position: string;
  baseSalary: number;
  bonus?: number;
  equity?: string;
  benefits: string[];
  location: string;
  workMode: 'onsite' | 'remote' | 'hybrid';
  growthPotential: 1 | 2 | 3 | 4 | 5;
  workLifeBalance: 1 | 2 | 3 | 4 | 5;
  companyStability: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: string;
}

export interface OfferComparison {
  offers: Offer[];
  scores: Record<string, { total: number; salary: number; growth: number; wlb: number; stability: number }>;
  recommendation: { bestOverall: string; bestSalary: string; bestGrowth: string; bestWLB: string };
}