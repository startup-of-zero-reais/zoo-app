import { PlusCircleIcon } from 'lucide-react';
import { auth } from '@/lib/functions/auth';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { MenuItem, SidebarLinkGroup } from './link-group';
import SidebarNotifications from './notifications';
import SidebarFooterContent from './footer';

const animalsItems: MenuItem[] = [
	{
		title: 'Cadastrar animal',
		url: '#',
		icon: PlusCircleIcon,
	},
];

const enclosuresItems: MenuItem[] = [
	{
		title: 'Cadastrar recinto',
		url: '#',
		icon: PlusCircleIcon,
	},
];

export default async function AppSidebar() {
	const user = await auth().getUser();

	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarLinkGroup label="Animais" items={animalsItems} />
				<SidebarLinkGroup label="Recintos" items={enclosuresItems} />
				<SidebarNotifications />
			</SidebarContent>
			<SidebarFooterContent username={user.name} />
			<SidebarRail />
		</Sidebar>
	);
}
