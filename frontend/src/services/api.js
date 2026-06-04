// Central API service — all backend calls go through here.

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, endpoint, body = null) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (payload) => request('POST', '/auth/register', payload),
  login:    (payload) => request('POST', '/auth/login',    payload),
  logout:   ()        => request('POST', '/auth/logout'),
  getMe:    ()        => request('GET',  '/auth/me'),
  changePassword: (payload) => request('POST', '/auth/change-password', payload),
};

// ── Health Profile ────────────────────────────────────────────
// Profile is stored once and reused — only updated on explicit edit
export const profileAPI = {
  get:          ()        => request('GET', '/profile'),
  getOrCreate:  ()        => request('GET', '/profile/init'),
  update:       (payload) => request('PUT', '/profile', payload),
};

// ── Analysis ──────────────────────────────────────────────────
export const analysisAPI = {
  analyze:    (payload) => request('POST', '/analysis/analyze', payload),
  getHistory: ()        => request('GET',  '/analysis/history'),
};