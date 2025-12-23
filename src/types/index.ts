export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  org_slug: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export enum KAMStage {
  DISCOVERY = "discovery",
  DEVELOPMENT = "development",
  EXPANSION = "expansion",
  RETENTION = "retention"
}

export enum OpportunityStatus {
  LEAD = "lead",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  WON = "won",
  LOST = "lost"
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  description: string | null;
  kam_stage: KAMStage;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  account_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  is_key_stakeholder: boolean;
  created_at: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  account_id: string;
  title: string;
  meeting_date: string;
  transcription: string;
  participants: string | null;
  created_at: string;
  has_ai_analysis: boolean;
}

export interface AIInsight {
  id: string;
  meeting_id: string;
  executive_summary: string;
  meeting_context: string;
  pain_points: string[];
  suggested_solutions: string[];
  next_steps: string[];
  email_suggestion: string;
  crm_update_summary: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  user_id: string;
  account_id: string;
  title: string;
  description: string | null;
  value: number | null;
  status: OpportunityStatus;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  name: string;
  industry?: string;
  description?: string;
  kam_stage?: KAMStage;
}

export interface CreateMeetingRequest {
  account_id: string;
  title: string;
  meeting_date: string;
  transcription: string;
  participants?: string;
}

export interface CreateOpportunityRequest {
  account_id: number;
  title: string;
  description?: string;
  value?: number;
  stage_id?: number;
  expected_close_date?: string;
}

export interface CreateContactRequest {
  account_id?: number;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  is_key_stakeholder?: boolean;
}
