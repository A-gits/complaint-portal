import type { AuthUser } from '../types';
import { mockLogin } from '../mocks/auth';

// ─── Swap mock for real call when backend is ready ───────────────────────────
// import api from './axiosInstance';
// export const login = (email: string, password: string) =>
//   api.post<AuthUser>('/auth/login', { email, password });

export const login = (email: string, password: string): Promise<{ data: AuthUser }> =>
  mockLogin(email, password);

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
