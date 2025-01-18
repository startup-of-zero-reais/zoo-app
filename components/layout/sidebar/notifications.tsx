import Link from 'next/link';
import { Bell, PhoneIncoming, Mail } from 'lucide-react';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuBadge,
} from '@/components/ui/sidebar';

export default function SidebarNotifications() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Notificações</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="#">
								<Bell />
								<span>Notificações</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuBadge>99+</SidebarMenuBadge>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="#">
								<PhoneIncoming />
								<span>SMS</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuBadge>0</SidebarMenuBadge>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="#">
								<Mail />
								<span>E-mail</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuBadge>0</SidebarMenuBadge>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
