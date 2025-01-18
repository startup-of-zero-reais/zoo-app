export const SESSION_TOKEN =
	process.env.NODE_ENV === 'production'
		? '__Secure-session_token'
		: 'session_token';
