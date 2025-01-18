import { NextResponse } from 'next/server';
import { SESSION_TOKEN } from '@/lib/constants/auth';
import { logout } from '@/lib/fetchers/auth';

export const POST = async () => {
	await logout();

	const expiresDate = new Date(0).toUTCString();

	return new NextResponse(null, {
		status: 307,
		headers: {
			Location: '/app/home',
			'Set-Cookie': `${SESSION_TOKEN}=0; Expires=${expiresDate}; Path=/`,
		},
	});
};

export { POST as GET };
