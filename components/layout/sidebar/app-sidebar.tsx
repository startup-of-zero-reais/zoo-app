import { PlusCircleIcon, UploadCloud } from 'lucide-react';
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
		url: '/dashboard/animais',
		icon: PlusCircleIcon,
	},
	{
		title: 'Cadastrar espécie',
		url: '/dashboard/especies',
		icon: PlusCircleIcon,
	},
	{
		title: 'Importar planilha',
		url: '/dashboard/import',
		icon: UploadCloud,
	},
];

const enclosuresItems: MenuItem[] = [
	{
		title: 'Cadastrar recinto',
		url: '/dashboard/recintos',
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
