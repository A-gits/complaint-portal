import type { Complaint, CreateComplaintPayload } from '../types';
import { mockComplaints } from '../mocks/complaints';

// ─── Swap mocks for real calls when backend is ready ─────────────────────────
// import api from './axiosInstance';
// export const getComplaints   = (params?: object) => api.get<Complaint[]>('/complaints', { params });
// export const getComplaint    = (id: string)      => api.get<Complaint>(`/complaints/${id}`);
// export const createComplaint = (data: FormData)  => api.post<Complaint>('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const updateStatus    = (id: string, status: string) => api.put(`/complaints/${id}/status`, { status });
// export const assignComplaint = (id: string, agentId: string) => api.put(`/complaints/${id}/assign`, { agentId });
// export const addReply        = (id: string, message: string) => api.post(`/complaints/${id}/replies`, { message });

export const getComplaints = (_params?: object): Promise<{ data: Complaint[] }> =>
  Promise.resolve({ data: mockComplaints });

export const getComplaint = (id: string): Promise<{ data: Complaint }> => {
  const found = mockComplaints.find((c) => c.id === id);
  if (!found) return Promise.reject(new Error('Not found'));
  return Promise.resolve({ data: found });
};

export const createComplaint = (_data: CreateComplaintPayload): Promise<{ data: Complaint }> =>
  Promise.resolve({ data: mockComplaints[0] });

export const updateStatus = (_id: string, _status: string): Promise<{ data: Complaint }> =>
  Promise.resolve({ data: mockComplaints[0] });

export const assignComplaint = (_id: string, _agentId: string): Promise<{ data: Complaint }> =>
  Promise.resolve({ data: mockComplaints[0] });

export const addReply = (_id: string, _message: string): Promise<{ data: Complaint }> =>
  Promise.resolve({ data: mockComplaints[0] });
