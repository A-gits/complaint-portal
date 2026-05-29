import type { Category } from '../types';
import { mockCategories } from '../mocks/categories';

// ─── Swap mocks for real calls when backend is ready ─────────────────────────
// import api from './axiosInstance';
// export const getCategories    = ()                      => api.get<Category[]>('/categories');
// export const createCategory   = (data: Partial<Category>) => api.post<Category>('/categories', data);
// export const deleteCategory   = (id: string)            => api.delete(`/categories/${id}`);

export const getCategories = (): Promise<{ data: Category[] }> =>
  Promise.resolve({ data: mockCategories });

export const createCategory = (_data: Partial<Category>): Promise<{ data: Category }> =>
  Promise.resolve({ data: mockCategories[0] });

export const deleteCategory = (_id: string): Promise<void> =>
  Promise.resolve();

export const updateCategory = (_id: string, _data: Partial<Category>): Promise<{ data: Category }> =>
  Promise.resolve({ data: { ..._data, id: _id } as Category });
