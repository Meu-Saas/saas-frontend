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
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await api.post<Token>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export const accountsAPI = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<Account>('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateAccountRequest>): Promise<Account> => {
    const response = await api.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },

  getContacts: async (accountId: string): Promise<Contact[]> => {
    const response = await api.get<Contact[]>(`/accounts/${accountId}/contacts`);
    return response.data;
  },

  createContact: async (accountId: string, data: CreateContactRequest): Promise<Contact> => {
    const response = await api.post<Contact>(`/accounts/${accountId}/contacts`, data);
    return response.data;
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
    const response = await api.get<Opportunity[]>('/opportunities');
    return response.data;
  },

  getById: async (id: string): Promise<Opportunity> => {
    const response = await api.get<Opportunity>(`/opportunities/${id}`);
    return response.data;
  },

  create: async (data: CreateOpportunityRequest): Promise<Opportunity> => {
    const response = await api.post<Opportunity>('/opportunities', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateOpportunityRequest>): Promise<Opportunity> => {
    const response = await api.put<Opportunity>(`/opportunities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/opportunities/${id}`);
  },

  getByAccount: async (accountId: string): Promise<Opportunity[]> => {
    const response = await api.get<Opportunity[]>(`/opportunities/account/${accountId}`);
    return response.data;
  },
};

export { api };
export default api;
