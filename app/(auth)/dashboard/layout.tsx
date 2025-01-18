import { ReactNode } from 'react';
import SidebarPartLayout from '@/components/layout/sidebar/layout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return <SidebarPartLayout>{children}</SidebarPartLayout>;
}
