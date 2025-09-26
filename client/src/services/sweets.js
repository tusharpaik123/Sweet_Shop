import api from './api';

export async function listSweets() {
  const res = await api.get('/api/sweets');
  return res.data; // array
}

export async function searchSweets(params) {
  const res = await api.get('/api/sweets/search', { params });
  return res.data; // array
}

export async function addSweet(payload) {
  const res = await api.post('/api/sweets', payload);
  return res.data;
}

export async function updateSweet(id, payload) {
  const res = await api.put(`/api/sweets/${id}`, payload);
  return res.data;
}

export async function deleteSweet(id) {
  const res = await api.delete(`/api/sweets/${id}`);
  return res.data;
}

export async function purchaseSweet(id, quantity = 1) {
  const res = await api.post(`/api/sweets/${id}/purchase`, { quantity });
  return res.data;
}

export async function restockSweet(id, quantity = 1) {
  const res = await api.post(`/api/sweets/${id}/restock`, { quantity });
  return res.data;
}
