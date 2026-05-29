import type { User } from '../types';

export const mockClients: User[] = [
  { id: 'client-1', name: 'Acme Corp', email: 'client@acme.com', role: 'client', createdAt: '2024-02-01T00:00:00Z', isActive: true },
  { id: 'client-2', name: 'Globex Ltd', email: 'hello@globex.com', role: 'client', createdAt: '2024-03-10T00:00:00Z', isActive: true },
  { id: 'client-3', name: 'Initech Inc', email: 'support@initech.com', role: 'client', createdAt: '2024-04-15T00:00:00Z', isActive: false },
];

export const mockAgents: User[] = [
  { id: 'agent-1', name: 'Jane Agent', email: 'agent@company.com', role: 'agent', createdAt: '2024-01-05T00:00:00Z', isActive: true },
  { id: 'agent-2', name: 'Mark Smith', email: 'mark@company.com', role: 'agent', createdAt: '2024-02-20T00:00:00Z', isActive: true },
];
