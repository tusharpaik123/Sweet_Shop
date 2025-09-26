import api from './api';

export async function listSweets() {
  const res = await api.get('/api/sweets');
  return res.data?.data; 
}

export async function searchSweets(params) {
  const res = await api.get('/api/sweets/search', { params });
  return res.data?.data; 
}

export async function getSweet(id) {
  const res = await api.get(`/api/sweets/${id}`);
  return res.data?.data;
}

export async function getMyPurchases() {
  const res = await api.get('/api/sweets/purchases/my');
  return res.data?.data;
}

export async function getAllPurchases() {
  const res = await api.get('/api/sweets/purchases/all');
  return res.data?.data;
}

export async function addSweet(payload, isFormData = false) {
  const res = await api.post('/api/sweets', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return res.data?.data; 
}

export async function updateSweet(id, payload, isFormData = false) {
  const res = await api.put(`/api/sweets/${id}`, payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return res.data?.data;
}

export async function deleteSweet(id) {
  const res = await api.delete(`/api/sweets/${id}`);
  return res.data?.data; 
}

export async function purchaseSweet(id, quantity = 1) {
  const res = await api.post(`/api/sweets/${id}/purchase`, { quantity });
  return res.data?.data; // unwrapped purchase object
}

export async function restockSweet(id, quantity = 1) {
  const res = await api.post(`/api/sweets/${id}/restock`, { quantity });
  return res.data?.data; // unwrapped updated sweet
}
