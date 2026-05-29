import type { User } from '../types';
import { mockClients, mockAgents } from '../mocks/users';

// ─── Swap mocks for real calls when backend is ready ─────────────────────────
// import api from './axiosInstance';
// export const getClients  = ()                  => api.get<User[]>('/users/clients');
// export const getAgents   = ()                  => api.get<User[]>('/users/agents');
// export const createUser  = (data: Partial<User>) => api.post<User>('/users', data);
// export const updateUser  = (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data);
// export const toggleUser  = (id: string)        => api.put(`/users/${id}/toggle`);

export const getClients = (): Promise<{ data: User[] }> =>
  Promise.resolve({ data: mockClients });

export const getAgents = (): Promise<{ data: User[] }> =>
  Promise.resolve({ data: mockAgents });

export const createUser = (_data: Partial<User>): Promise<{ data: User }> =>
  Promise.resolve({ data: mockClients[0] });

export const updateUser = (_id: string, _data: Partial<User>): Promise<{ data: User }> =>
  Promise.resolve({ data: mockClients[0] });
