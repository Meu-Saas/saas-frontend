export interface KAMPillar {
  id: string;
  name: string;
  description: string;
  tactical_description: string;
  strategic_description: string;
  maturity_items: MaturityItem[];
  current_level: 'tactical' | 'transition' | 'strategic';
  kam_analysis: string;
}

export interface MaturityItem {
  id: string;
  description: string;
  is_checked: boolean;
  score: number;
}

export interface DiagnosticData {
  current_situation: string;
  strategic_objectives: string;
  main_initiatives: string;
  pains: Pain[];
  swot: SWOT;
}

export interface Pain {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  affected_area: string;
}

export interface SWOT {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface Stakeholder {
  id: string;
  contact_id: string;
  contact_name: string;
  role: string;
  area: string;
  power_level: number;
  support_level: 'supporter' | 'neutral' | 'opponent';
  relationship_level: 'cold' | 'neutral' | 'good' | 'sponsor';
  objective: string;
  engagement_strategy: string;
  show_in_orgchart: boolean;
  superior_id: string | null;
}

export interface WalletShareLine {
  id: string;
  business_line: string;
  annual_potential: number;
  current_revenue: number;
  participation_percentage: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
}

export interface KAMAction {
  id: string;
  strategic_objective: string;
  action: string;
  action_type: string;
  main_stakeholder_id: string | null;
  main_stakeholder_name: string | null;
  responsible: string;
  planned_start_date: string;
  planned_end_date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  result: string;
}

export interface Risk {
  id: string;
  description: string;
  type: 'financial' | 'political' | 'technical' | 'operational';
  probability: number;
  impact: number;
  exposure: number;
  mitigation_plan: string;
}

export interface Competitor {
  id: string;
  name: string;
  area: string;
  perceived_strength: number;
  strong_points: string;
  weak_points: string;
}

export type KAMPlanTab = 
  | 'diagnostico'
  | 'stakeholders'
  | 'wallet-share'
  | 'plano-acao'
  | 'riscos'
  | 'anatomia';
