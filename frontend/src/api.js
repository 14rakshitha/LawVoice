/** Use /api in dev (Vite proxy) and production (nginx proxy). Override with VITE_API_URL if needed. */
export const API = import.meta.env.VITE_API_URL || '/api';

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function authRegister(payload) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data.message || data.error || 'பதிவு தோல்வியடைந்தது.');
  }
  return data;
}

export async function authLogin(payload) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data.message || data.error || 'உள்நுழைவு தோல்வியடைந்தது.');
  }
  return data;
}

export function saveSession(authResponse) {
  localStorage.setItem('lawvoice-session', JSON.stringify({
    token: authResponse.token,
    role: authResponse.user.role,
    email: authResponse.user.email,
    name: authResponse.user.name,
    phone: authResponse.user.phone,
    district: authResponse.user.district,
    lawyerProfile: authResponse.user.lawyerProfile,
    loggedInAt: new Date().toISOString()
  }));
}
