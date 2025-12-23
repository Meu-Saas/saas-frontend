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
