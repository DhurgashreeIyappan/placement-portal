import axios from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export const register = (data) => axios.post('/auth/register', data);

export const login = async (data) => {
	const debugPayload = {
		...data,
		password: data?.password ? '[REDACTED]' : undefined,
	};

	console.log('[authApi] API_URL:', API_URL);
	console.log('[authApi] Login URL:', `${API_URL}/api/auth/login`);
	console.log('[authApi] Login payload:', debugPayload);

	const response = await fetch(`${API_URL}/api/auth/login`, {
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
