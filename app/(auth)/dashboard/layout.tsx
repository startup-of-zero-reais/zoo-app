import { ReactNode } from 'react';
import SidebarPartLayout from '@/components/layout/sidebar/layout';

export default function DashboardLayout({
	children,
	modal,
}: {
	children: ReactNode;
	modal?: React.ReactNode;
}) {
	return (
		<SidebarPartLayout>
			{children}
			{modal}
		</SidebarPartLayout>
	);
}
