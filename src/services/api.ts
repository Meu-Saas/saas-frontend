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
    const response = await api.get<Meeting[]>('/meetings');
    return response.data;
  },

  getById: async (id: string): Promise<Meeting> => {
    const response = await api.get<Meeting>(`/meetings/${id}`);
    return response.data;
  },

  create: async (data: CreateMeetingRequest): Promise<Meeting> => {
    const response = await api.post<Meeting>('/meetings', data);
    return response.data;
  },

  getInsights: async (meetingId: string): Promise<AIInsight> => {
    const response = await api.get<AIInsight>(`/meetings/${meetingId}/insights`);
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<Meeting[]> => {
    const response = await api.get<Meeting[]>(`/meetings/account/${accountId}`);
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

  getPipelineStages: async () => {
    const response = await api.get('/api/v1/admin/pipeline-stages');
    return response.data;
  },

  createPipelineStage: async (data: { name: string; color?: string; probability?: number; sort_order?: number }) => {
    const response = await api.post('/api/v1/admin/pipeline-stages', data);
    return response.data;
  },

  getValueZones: async () => {
    const response = await api.get('/api/v1/admin/value-zones');
    return response.data;
  },

  getActivityTypes: async () => {
    const response = await api.get('/api/v1/admin/activity-types');
    return response.data;
  },

  createActivityType: async (data: { name: string; icon?: string; color?: string; sort_order?: number }) => {
    const response = await api.post('/api/v1/admin/activity-types', data);
    return response.data;
  },

  getPrioritizationCriteria: async () => {
    const response = await api.get('/api/v1/admin/prioritization-criteria');
    return response.data;
  },

  getAbcThresholds: async () => {
    const response = await api.get('/api/v1/admin/abc-thresholds');
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
};
