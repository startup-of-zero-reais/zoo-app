import { ReactNode } from 'react';
import SidebarPartLayout from '@/components/layout/sidebar/layout';

export default function DashboardLayout({
	children,
	animals,
	modal,
}: {
	children: ReactNode;
	animals?: React.ReactNode;
	modal?: React.ReactNode;
}) {
	return (
		<SidebarPartLayout>
			<div className="grid grid-cols-3 gap-2">
				{animals}
				{children}
			</div>

			{modal}
		</SidebarPartLayout>
	);
}
