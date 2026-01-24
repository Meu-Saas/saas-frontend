import axios from 'axios';
import type {
  User,
  Token,
  LoginRequest,
  RegisterRequest,
  Account,
  Meeting,
  Opportunity,
  Contact,
  AIInsight,
  CreateAccountRequest,
  CreateMeetingRequest,
  CreateOpportunityRequest,
  CreateContactRequest,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await api.post<Token>('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token: newRefreshToken } = response.data;

        localStorage.setItem('token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await api.post<Token>('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/api/v1/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/api/v1/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, new_password: string): Promise<void> => {
    await api.post('/api/v1/auth/reset-password', { token, new_password });
  },

  refreshToken: async (refresh_token: string): Promise<Token> => {
    const response = await api.post<Token>('/api/v1/auth/refresh', { refresh_token });
    return response.data;
  },
};

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const accountsAPI = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get<PaginatedResponse<Account>>('/api/v1/accounts');
    return response.data.items || [];
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/api/v1/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<Account>('/api/v1/accounts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateAccountRequest>): Promise<Account> => {
    const response = await api.put<Account>(`/api/v1/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/accounts/${id}`);
  },

  getContacts: async (accountId: string): Promise<Contact[]> => {
    const response = await api.get<Contact[]>(`/api/v1/accounts/${accountId}/contacts`);
    return response.data;
  },

  createContact: async (accountId: string, data: CreateContactRequest): Promise<Contact> => {
    const response = await api.post<Contact>(`/api/v1/accounts/${accountId}/contacts`, data);
    return response.data;
  },
};

export const contactsAPI = {
  getAll: async (): Promise<Contact[]> => {
    const response = await api.get<PaginatedResponse<Contact>>('/api/v1/contacts');
    return response.data.items || [];
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await api.get<Contact>(`/api/v1/contacts/${id}`);
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<Contact[]> => {
    const response = await api.get<Contact[]>(`/api/v1/accounts/${accountId}/contacts`);
    return response.data;
  },

  create: async (data: CreateContactRequest): Promise<Contact> => {
    const response = await api.post<Contact>('/api/v1/contacts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateContactRequest>): Promise<Contact> => {
    const response = await api.put<Contact>(`/api/v1/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/contacts/${id}`);
  },
};

export const meetingsAPI = {
  getAll: async (): Promise<Meeting[]> => {
    const response = await api.get<PaginatedResponse<Meeting>>('/api/v1/meetings');
    return response.data.items || [];
  },

  getById: async (id: string): Promise<Meeting> => {
    const response = await api.get<Meeting>(`/api/v1/meetings/${id}`);
    return response.data;
  },

  create: async (data: CreateMeetingRequest): Promise<Meeting> => {
    const response = await api.post<Meeting>('/api/v1/meetings', data);
    return response.data;
  },

  getInsights: async (meetingId: string): Promise<AIInsight> => {
    const response = await api.get<AIInsight>(`/api/v1/meetings/${meetingId}/insights`);
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<Meeting[]> => {
    const response = await api.get<Meeting[]>(`/api/v1/accounts/${accountId}/meetings`);
    return response.data;
  },
};

export const opportunitiesAPI = {
  getAll: async (): Promise<Opportunity[]> => {
    const response = await api.get<PaginatedResponse<Opportunity>>('/api/v1/opportunities');
    return response.data.items || [];
  },

  getKanban: async () => {
    const response = await api.get('/api/v1/opportunities/kanban');
    return response.data;
  },

  getById: async (id: string): Promise<Opportunity> => {
    const response = await api.get<Opportunity>(`/api/v1/opportunities/${id}`);
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<Opportunity[]> => {
    const response = await api.get<Opportunity[]>(`/api/v1/accounts/${accountId}/opportunities`);
    return response.data;
  },

  create: async (data: CreateOpportunityRequest): Promise<Opportunity> => {
    const response = await api.post<Opportunity>('/api/v1/opportunities', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateOpportunityRequest>): Promise<Opportunity> => {
    const response = await api.put<Opportunity>(`/api/v1/opportunities/${id}`, data);
    return response.data;
  },

  updateStage: async (id: string, stageId: number): Promise<Opportunity> => {
    const response = await api.patch<Opportunity>(`/api/v1/opportunities/${id}/stage?stage_id=${stageId}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/opportunities/${id}`);
  },
};

export interface Activity {
  id: number;
  title: string;
  description?: string;
  account_id?: number;
  opportunity_id?: number;
  contact_id?: number;
  type_id?: number;
  scheduled_at?: string;
  status: string;
  completed_at?: string;
  account_name?: string;
  opportunity_title?: string;
  contact_name?: string;
  type_name?: string;
  type_icon?: string;
  type_color?: string;
  user_name?: string;
}

export interface CreateActivityRequest {
  title: string;
  account_id?: number;
  opportunity_id?: number;
  contact_id?: number;
  type_id?: number;
  description?: string;
  scheduled_at?: string;
}

export const activitiesAPI = {
  getAll: async (): Promise<Activity[]> => {
    const response = await api.get<PaginatedResponse<Activity>>('/api/v1/activities');
    return response.data.items || [];
  },

  getToday: async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('/api/v1/activities/today');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/api/v1/activities/summary');
    return response.data;
  },

  getById: async (id: number): Promise<Activity> => {
    const response = await api.get<Activity>(`/api/v1/activities/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityRequest): Promise<Activity> => {
    const response = await api.post<Activity>('/api/v1/activities', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateActivityRequest>): Promise<Activity> => {
    const response = await api.put<Activity>(`/api/v1/activities/${id}`, data);
    return response.data;
  },

  complete: async (id: number, notes?: string): Promise<Activity> => {
    const response = await api.post<Activity>(`/api/v1/activities/${id}/complete`, { notes });
    return response.data;
  },

  reschedule: async (id: number, scheduled_at: string, notes?: string): Promise<Activity> => {
    const response = await api.post<Activity>(`/api/v1/activities/${id}/reschedule`, { scheduled_at, notes });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/activities/${id}`);
  },
};

export const adminAPI = {
  getAccountCategories: async () => {
    const response = await api.get('/api/v1/admin/account-categories');
    return response.data;
  },

  createAccountCategory: async (data: { name: string; description?: string; color?: string }) => {
    const response = await api.post('/api/v1/admin/account-categories', data);
    return response.data;
  },

  updateAccountCategory: async (id: number, data: { name?: string; description?: string; color?: string; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/account-categories/${id}`, data);
    return response.data;
  },

  deleteAccountCategory: async (id: number) => {
    await api.delete(`/api/v1/admin/account-categories/${id}`);
  },

  getPipelineStages: async () => {
    const response = await api.get('/api/v1/admin/pipeline-stages');
    return response.data;
  },

  createPipelineStage: async (data: { name: string; color?: string; probability?: number; sort_order?: number }) => {
    const response = await api.post('/api/v1/admin/pipeline-stages', data);
    return response.data;
  },

  updatePipelineStage: async (id: number, data: { name?: string; color?: string; probability?: number; sort_order?: number; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/pipeline-stages/${id}`, data);
    return response.data;
  },

  deletePipelineStage: async (id: number) => {
    await api.delete(`/api/v1/admin/pipeline-stages/${id}`);
  },

  getValueZones: async () => {
    const response = await api.get('/api/v1/admin/value-zones');
    return response.data;
  },

  createValueZone: async (data: { name: string; description?: string; color?: string; min_importance?: number; max_importance?: number; min_performance?: number; max_performance?: number }) => {
    const response = await api.post('/api/v1/admin/value-zones', data);
    return response.data;
  },

  updateValueZone: async (id: number, data: { name?: string; description?: string; color?: string; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/value-zones/${id}`, data);
    return response.data;
  },

  deleteValueZone: async (id: number) => {
    await api.delete(`/api/v1/admin/value-zones/${id}`);
  },

  getActivityTypes: async () => {
    const response = await api.get('/api/v1/admin/activity-types');
    return response.data;
  },

  createActivityType: async (data: { name: string; icon?: string; color?: string; sort_order?: number }) => {
    const response = await api.post('/api/v1/admin/activity-types', data);
    return response.data;
  },

  updateActivityType: async (id: number, data: { name?: string; icon?: string; color?: string; sort_order?: number; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/activity-types/${id}`, data);
    return response.data;
  },

  deleteActivityType: async (id: number) => {
    await api.delete(`/api/v1/admin/activity-types/${id}`);
  },

  getPrioritizationCriteria: async () => {
    const response = await api.get('/api/v1/admin/prioritization-criteria');
    return response.data;
  },

  createPrioritizationCriteria: async (data: { name: string; description?: string; weight: number }) => {
    const response = await api.post('/api/v1/admin/prioritization-criteria', data);
    return response.data;
  },

  updatePrioritizationCriteria: async (id: number, data: { name?: string; description?: string; weight?: number; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/prioritization-criteria/${id}`, data);
    return response.data;
  },

  deletePrioritizationCriteria: async (id: number) => {
    await api.delete(`/api/v1/admin/prioritization-criteria/${id}`);
  },

  getAbcThresholds: async () => {
    const response = await api.get('/api/v1/admin/abc-thresholds');
    return response.data;
  },

  updateAbcThresholds: async (data: { a_min: number; b_min: number }) => {
    const response = await api.put('/api/v1/admin/abc-thresholds', data);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/api/v1/admin/users');
    return response.data;
  },

  createUser: async (data: { email: string; password: string; full_name: string; role: string }) => {
    const response = await api.post('/api/v1/admin/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: { full_name?: string; role?: string; is_active?: boolean }) => {
    const response = await api.put(`/api/v1/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/api/v1/admin/users/${id}`);
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/api/v1/dashboard/stats');
    return response.data;
  },

  getPipeline: async () => {
    const response = await api.get('/api/v1/dashboard/pipeline');
    return response.data;
  },

  getTopAccounts: async () => {
    const response = await api.get('/api/v1/dashboard/top-accounts');
    return response.data;
  },

  getTodayActivities: async () => {
    const response = await api.get('/api/v1/activities/today');
    return response.data;
  },
};

export const prioritizationAPI = {
  getAccounts: async (filters?: { segment?: string; abc_category?: string; min_score?: number }) => {
    const params = new URLSearchParams();
    if (filters?.segment) params.append('segment', filters.segment);
    if (filters?.abc_category) params.append('abc_category', filters.abc_category);
    if (filters?.min_score !== undefined) params.append('min_score', String(filters.min_score));
    const response = await api.get(`/api/v1/prioritization/accounts?${params.toString()}`);
    return response.data;
  },

  getCriteria: async () => {
    const response = await api.get('/api/v1/prioritization/criteria');
    return response.data;
  },

  getThresholds: async () => {
    const response = await api.get('/api/v1/prioritization/thresholds');
    return response.data;
  },

  getAccountScores: async (accountId: number) => {
    const response = await api.get(`/api/v1/prioritization/accounts/${accountId}/scores`);
    return response.data;
  },

  updateAccountScores: async (accountId: number, scores: { criteria_id: number; score: number }[]) => {
    const response = await api.put(`/api/v1/prioritization/accounts/${accountId}/scores`, { scores });
    return response.data;
  },

  recalculateAll: async () => {
    const response = await api.post('/api/v1/prioritization/recalculate');
    return response.data;
  },
};

export const reportsAPI = {
  getPipelineReport: async (filters?: { date_range?: string; kam_id?: number; segment?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters?.date_range) params.append('date_range', filters.date_range);
    if (filters?.kam_id) params.append('kam_id', String(filters.kam_id));
    if (filters?.segment) params.append('segment', filters.segment);
    if (filters?.category) params.append('category', filters.category);
    const response = await api.get(`/api/v1/reports/pipeline?${params.toString()}`);
    return response.data;
  },

  getForecastReport: async (filters?: { date_range?: string }) => {
    const params = new URLSearchParams();
    if (filters?.date_range) params.append('date_range', filters.date_range);
    const response = await api.get(`/api/v1/reports/forecast?${params.toString()}`);
    return response.data;
  },

  getActivitiesReport: async (filters?: { date_range?: string; kam_id?: number }) => {
    const params = new URLSearchParams();
    if (filters?.date_range) params.append('date_range', filters.date_range);
    if (filters?.kam_id) params.append('kam_id', String(filters.kam_id));
    const response = await api.get(`/api/v1/reports/activities?${params.toString()}`);
    return response.data;
  },

  getAccountHealthReport: async (filters?: { segment?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters?.segment) params.append('segment', filters.segment);
    if (filters?.category) params.append('category', filters.category);
    const response = await api.get(`/api/v1/reports/account-health?${params.toString()}`);
    return response.data;
  },

  getValueStakeholderReport: async () => {
    const response = await api.get('/api/v1/reports/value-stakeholders');
    return response.data;
  },

  getKamPlanReport: async () => {
    const response = await api.get('/api/v1/reports/kam-plan-execution');
    return response.data;
  },

  exportReport: async (reportType: string, format: 'csv' | 'xlsx' | 'pdf') => {
    const response = await api.get(`/api/v1/reports/export/${reportType}?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const kamPlanAPI = {
  getPillars: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/pillars`);
    return response.data;
  },

  updatePillar: async (accountId: string, pillarId: number, data: { maturity_level?: number; notes?: string; current_level?: string; kam_analysis?: string; maturity_items?: { id: string; description: string; is_checked: boolean; score: number }[] }) => {
    const payload = {
      maturity_level: data.maturity_level,
      notes: data.notes || data.kam_analysis,
    };
    const response = await api.put(`/api/v1/kam-plan/${accountId}/pillars/${pillarId}`, payload);
    return response.data;
  },

  getDiagnostic: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/diagnostic`);
    return response.data;
  },

  updateDiagnostic: async (accountId: string, data: { current_situation?: string; strategic_objectives?: string; initiatives?: string; swot?: object }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/diagnostic`, data);
    return response.data;
  },

  getPains: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/pains`);
    return response.data;
  },

  createPain: async (accountId: string, data: { description: string; impact: string; priority: string }) => {
    const response = await api.post(`/api/v1/kam-plan/${accountId}/pains`, data);
    return response.data;
  },

  updatePain: async (accountId: string, painId: number, data: { description?: string; impact?: string; priority?: string }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/pains/${painId}`, data);
    return response.data;
  },

  deletePain: async (accountId: string, painId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/pains/${painId}`);
  },

  getStakeholders: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/stakeholders`);
    return response.data;
  },

  createStakeholder: async (accountId: string, data: { contact_id?: number; contact_name?: string; name?: string; role?: string; area?: string; power_level: number; support_level: number | string; relationship_level: number | string; objective?: string; engagement_strategy?: string; show_in_orgchart?: boolean; superior_id?: number }) => {
    // Convert numeric support_level to enum string
    const supportLevelMap: Record<number, string> = { 0: 'opponent', 1: 'neutral', 2: 'supporter' };
    const relationshipLevelMap: Record<number, string> = { 0: 'cold', 1: 'neutral', 2: 'good', 3: 'sponsor' };
    
    const payload = {
      contact_id: data.contact_id,
      contact_name: data.contact_name || data.name || '',
      role: data.role,
      area: data.area,
      power_level: data.power_level,
      support_level: typeof data.support_level === 'number' ? (supportLevelMap[data.support_level] || 'neutral') : data.support_level,
      relationship_level: typeof data.relationship_level === 'number' ? (relationshipLevelMap[data.relationship_level] || 'neutral') : data.relationship_level,
      objective: data.objective,
      engagement_strategy: data.engagement_strategy,
      show_in_orgchart: data.show_in_orgchart ?? true,
      superior_id: data.superior_id,
    };
    const response = await api.post(`/api/v1/kam-plan/${accountId}/stakeholders`, payload);
    return response.data;
  },

  updateStakeholder: async (accountId: string, stakeholderId: number, data: { power_level?: number; support_level?: number; relationship_level?: number; engagement_strategy?: string }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/stakeholders/${stakeholderId}`, data);
    return response.data;
  },

  deleteStakeholder: async (accountId: string, stakeholderId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/stakeholders/${stakeholderId}`);
  },

  getWalletShare: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/wallet-share`);
    return response.data;
  },

  createWalletShareItem: async (accountId: string, data: { business_line: string; our_revenue?: number; current_revenue?: number; total_potential?: number; annual_potential?: number; priority?: string }) => {
    const payload = {
      business_line: data.business_line,
      current_revenue: data.current_revenue || data.our_revenue || 0,
      annual_potential: data.annual_potential || data.total_potential || 0,
      priority: data.priority || 'medium',
    };
    const response = await api.post(`/api/v1/kam-plan/${accountId}/wallet-share`, payload);
    return response.data;
  },

  updateWalletShareItem: async (accountId: string, itemId: number, data: { business_line?: string; our_revenue?: number; total_potential?: number }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/wallet-share/${itemId}`, data);
    return response.data;
  },

  deleteWalletShareItem: async (accountId: string, itemId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/wallet-share/${itemId}`);
  },

  getActions: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/actions`);
    return response.data;
  },

  createAction: async (accountId: string, data: { title?: string; action?: string; strategic_objective?: string; action_type?: string; description?: string; responsible?: string; due_date?: string; planned_start_date?: string; planned_end_date?: string; status?: string; main_stakeholder_id?: number }) => {
    const payload = {
      strategic_objective: data.strategic_objective || data.description || data.title || '',
      action: data.action || data.title || '',
      action_type: data.action_type,
      main_stakeholder_id: data.main_stakeholder_id,
      responsible: data.responsible,
      planned_start_date: data.planned_start_date,
      planned_end_date: data.planned_end_date || data.due_date,
      status: data.status || 'planned',
    };
    const response = await api.post(`/api/v1/kam-plan/${accountId}/actions`, payload);
    return response.data;
  },

  updateAction: async (accountId: string, actionId: number, data: { title?: string; description?: string; responsible?: string; due_date?: string; status?: string }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/actions/${actionId}`, data);
    return response.data;
  },

  deleteAction: async (accountId: string, actionId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/actions/${actionId}`);
  },

  getRisks: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/risks`);
    return response.data;
  },

  createRisk: async (accountId: string, data: { description: string; type: string; probability: string | number; impact: string | number; mitigation?: string; mitigation_plan?: string }) => {
    const payload = {
      description: data.description,
      type: data.type,
      probability: typeof data.probability === 'string' ? parseInt(data.probability, 10) || 1 : data.probability,
      impact: typeof data.impact === 'string' ? parseInt(data.impact, 10) || 1 : data.impact,
      mitigation_plan: data.mitigation_plan || data.mitigation,
    };
    const response = await api.post(`/api/v1/kam-plan/${accountId}/risks`, payload);
    return response.data;
  },

  updateRisk: async (accountId: string, riskId: number, data: { description?: string; type?: string; probability?: string; impact?: string; mitigation?: string }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/risks/${riskId}`, data);
    return response.data;
  },

  deleteRisk: async (accountId: string, riskId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/risks/${riskId}`);
  },

  getCompetitors: async (accountId: string) => {
    const response = await api.get(`/api/v1/kam-plan/${accountId}/competitors`);
    return response.data;
  },

  createCompetitor: async (accountId: string, data: { name: string; area?: string; strengths?: string; weaknesses?: string; market_share?: number; perceived_strength?: string | number; perceived_weakness?: string; strong_points?: string; weak_points?: string }) => {
    const payload = {
      name: data.name,
      area: data.area,
      perceived_strength: typeof data.perceived_strength === 'string' ? parseInt(data.perceived_strength, 10) || 1 : (data.perceived_strength || 1),
      strong_points: data.strong_points || data.strengths,
      weak_points: data.weak_points || data.weaknesses,
    };
    const response = await api.post(`/api/v1/kam-plan/${accountId}/competitors`, payload);
    return response.data;
  },

  updateCompetitor: async (accountId: string, competitorId: number, data: { name?: string; strengths?: string; weaknesses?: string; market_share?: number }) => {
    const response = await api.put(`/api/v1/kam-plan/${accountId}/competitors/${competitorId}`, data);
    return response.data;
  },

  deleteCompetitor: async (accountId: string, competitorId: number) => {
    await api.delete(`/api/v1/kam-plan/${accountId}/competitors/${competitorId}`);
  },
};

export const valueMatrixAPI = {
  getAttributes: async (accountId: string) => {
    const response = await api.get(`/api/v1/value-matrix/accounts/${accountId}/attributes`);
    return response.data;
  },

  createAttribute: async (accountId: string, data: { name: string; importance: number; performance: number; recommended_action?: string }) => {
    const response = await api.post(`/api/v1/value-matrix/accounts/${accountId}/attributes`, data);
    return response.data;
  },

  updateAttribute: async (accountId: string, attributeId: number, data: { name: string; importance: number; performance: number; recommended_action?: string }) => {
    const response = await api.put(`/api/v1/value-matrix/accounts/${accountId}/attributes/${attributeId}`, data);
    return response.data;
  },

  deleteAttribute: async (accountId: string, attributeId: number) => {
    await api.delete(`/api/v1/value-matrix/accounts/${accountId}/attributes/${attributeId}`);
  },

  getStakeholderAttributes: async (accountId: string, stakeholderId: number) => {
    const response = await api.get(`/api/v1/value-matrix/accounts/${accountId}/stakeholders/${stakeholderId}/attributes`);
    return response.data;
  },

  linkStakeholderAttributes: async (accountId: string, stakeholderId: number, attributeIds: number[]) => {
    const response = await api.put(`/api/v1/value-matrix/accounts/${accountId}/stakeholders/${stakeholderId}/attributes`, {
      stakeholder_id: stakeholderId,
      attribute_ids: attributeIds,
    });
    return response.data;
  },

  getZones: async () => {
    const response = await api.get('/api/v1/value-matrix/zones');
    return response.data;
  },
};
