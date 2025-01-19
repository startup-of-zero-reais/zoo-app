import { NextRequest, NextResponse } from 'next/server';
import { parse } from '@/lib/middleware/helpers/parse';
import { createServerClient } from '@/lib/middleware/helpers/auth';

const PAGE = {
	HOME: '/home',
	LOGIN: '/acessar',
	CALLBACK: '/auth/callback',
	ONBOARDING: '/onboarding',
};

export default async function AppMiddleware(request: NextRequest) {
	const { path, fullPath } = parse(request);
	let response = NextResponse.next({ request });

	const apiClient = createServerClient({
		cookies: {
			getAll: () => request.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value }) =>
					request.cookies.set(name, value),
				);

				response = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) =>
					response.cookies.set(name, value, options),
				);
			},
		},
	});

	const { user } = await apiClient.auth.getUser();
	const DAY = 60 * 60 * 24 * 1000;
	const isNewUser =
		new Date(user?.created_at || 0).getTime() > Date.now() - DAY;

	const isInPublicPath = [PAGE.HOME, PAGE.LOGIN, PAGE.CALLBACK, '/'].includes(
		path,
	);

	// se o usuario nao esta logado nem em pagina de login ou callback de autorizacao
	// enviamos ele para o login
	if (!user && !isInPublicPath) {
		const whereToGo =
			path === '/' ? '' : `?redir_to=${encodeURIComponent(fullPath)}`;

		return NextResponse.redirect(
			new URL(`${PAGE.LOGIN}${whereToGo}`, request.url),
		);

		// se o usuario esta logado
	} else if (user) {
		if (path.startsWith(PAGE.ONBOARDING)) {
			// middleware de onboarding ?
		} else if (isNewUser && !path.startsWith(PAGE.ONBOARDING)) {
			return NextResponse.redirect(
				new URL(`/app${PAGE.ONBOARDING}`, request.url),
			);
		} else if (['/', PAGE.LOGIN].includes(path)) {
			return NextResponse.redirect(new URL(`/app/dashboard`, request.url));
		}
	}

	return NextResponse.rewrite(new URL(`${fullPath}`, request.url));
}
