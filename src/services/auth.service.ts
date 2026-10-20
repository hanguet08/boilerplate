import { api } from '.';
import { API } from '@/constants/apiUrls';
import { AuthResponse, Me, User } from '@/interfaces';

export const login = (body: { email: string; password: string }) => api.post<AuthResponse>(API.LOGIN, body);

export const register = (body: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>(API.REGISTER, body);

export const getMe = () => api.get<Me>(API.ME);

export const updateMe = (body: { name?: string; avatarUrl?: string }) => api.patch<User>(API.ME, body);

export const changePassword = (body: { currentPassword: string; newPassword: string }) =>
  api.post<{ success: boolean }>(API.CHANGE_PASSWORD, body);
