import { NextRequest } from 'next/server';
import { SHORT_DOMAIN } from '@/lib/constants/main';

const LOCAL_APP_DOMAIN = 'localhost:3000';

export const parse = (req: NextRequest) => {
	let domain = req.headers.get('host') as string;
	// remover www. do dominio e converter pra lowercase
	domain = domain.replace('www.', '').toLowerCase();

	if (domain === LOCAL_APP_DOMAIN || domain.endsWith('.vercel.app')) {
		// pra dev local e URLs de preview
		domain = SHORT_DOMAIN;
	}

	// path é o caminho da url (ex: myapp.com/dashboard/chats -> /dashboard/chats)
	const path = req.nextUrl.pathname;

	// fullPath é a url completa (inclui os search params)
	const searchParams = req.nextUrl.searchParams.toString();
	const searchParamsStr = searchParams.length > 0 ? `?${searchParams}` : '';
	const fullPath = `/app${path}${searchParamsStr}`;

	// Aqui, usamos o decodeURIComponent pra lidar com caracteres especiais
	const key = decodeURIComponent(path.split('/')[1]); // key é a primeira parte do caminho (ex: myapp.com/dashboard/chats -> dashboard)
	const fullKey = decodeURIComponent(path.slice(1)); // fullKey é o path completo sem a primeira barra (ex: myapp.com/dashboard/chats -> dashboard/chats)

	return { domain, path, fullPath, key, fullKey, searchParamsStr };
};
