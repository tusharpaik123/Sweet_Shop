import api from './api';

export async function register(data) {
  const res = await api.post('/api/auth/register', data);
  return res.data?.data; 
}

export async function login(data) {
  const res = await api.post('/api/auth/login', data);
  return res.data?.data; 
}
