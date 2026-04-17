const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

const api = async (method, endpoint, body = null) => {
  const isAuthEndpoint = endpoint.startsWith('/auth/');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(!isAuthEndpoint && getToken() && { Authorization: `Bearer ${getToken()}` })
    },
    ...(body && { body: JSON.stringify(body) })
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(res.ok ? 'Invalid server response' : 'Server is unavailable. Please try again later.');
  }
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export default api;
