import React from 'react';
import { cookies } from 'next/headers';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';

export default async function SidebarPartLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === 'true';

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<main className="grid w-full relative overflow-y-auto p-2">
				{children}
			</main>
		</SidebarProvider>
	);
}
