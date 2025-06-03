// /lib/history.ts
import { v4 as uuidv4 } from 'uuid';

export async function saveSearchHistory(name, lat, lon) {
  const key = 'search-history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  const newItem = { id: uuidv4(), locationName: name, lat, lon };
  const updated = [newItem, ...history.slice(0, 9)];
  localStorage.setItem(key, JSON.stringify(updated));
}

export async function getSearchHistory() {
  return JSON.parse(localStorage.getItem('search-history') || '[]');
}

export async function deleteSearchHistory(id) {
  const history = JSON.parse(localStorage.getItem('search-history') || '[]');
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem('search-history', JSON.stringify(filtered));
}