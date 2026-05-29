import type { AuthUser } from '../types';

const mockUsers: AuthUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
    token: 'mock-admin-token',
  },
  {
    id: 'agent-1',
    name: 'Gabriel Agent',
    email: 'agent@company.com',
    role: 'agent',
    createdAt: '2024-01-05T00:00:00Z',
    isActive: true,
    token: 'mock-agent-token',
  },
  {
    id: 'client-1',
    name: 'Acme Corp',
    email: 'client@company.com',
    role: 'client',
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true,
    token: 'mock-client-token',
  },
];

export const mockLogin = (
  email: string,
  _password: string
): Promise<{ data: AuthUser }> => {
  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    return Promise.reject(new Error('Invalid email or password'));
  }
  return Promise.resolve({ data: user });
};
