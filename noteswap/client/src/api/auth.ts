import api from './client';

export async function signup(payload: { name?: string; email: string; password: string }) {
  const { data } = await api.post('/auth/signup', payload);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await api.post('/auth/forgot-password', payload);
  return data;
}

export async function resetPassword(payload: { token: string; password: string }) {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
}