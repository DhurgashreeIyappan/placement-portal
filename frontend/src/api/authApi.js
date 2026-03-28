import axios, { API_BASE } from './axios';

export const register = (data) => axios.post('/auth/register', data);

export const login = async (data) => {
	const loginUrl = `${API_BASE}/auth/login`;
	const debugPayload = {
		...data,
		password: data?.password ? '[REDACTED]' : undefined,
	};

	console.log('[authApi] API_BASE:', API_BASE);
	console.log('[authApi] Login URL:', loginUrl);
	console.log('[authApi] Login payload:', debugPayload);

	const response = await fetch(loginUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const rawText = await response.text();
	let responseData = null;
	try {
		responseData = rawText ? JSON.parse(rawText) : null;
	} catch {
		responseData = { message: rawText || 'Invalid response payload' };
	}

	if (!response.ok) {
		const message = responseData?.message || `Login failed with status ${response.status}`;
		throw { message, status: response.status, data: responseData };
	}

	return { data: responseData };
};

export const getMe = () => axios.get('/auth/me');
