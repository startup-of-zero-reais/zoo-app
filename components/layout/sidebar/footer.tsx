import Link from 'next/link';
import { User2, ChevronUp } from 'lucide-react';
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutButton from './logout';

export default function SidebarFooterContent({
	username,
}: {
	username: string;
}) {
	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<User2 /> {username}
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className="w-[--radix-popper-anchor-width]"
							side="top"
						>
							<DropdownMenuItem>
								<Link href="#" className="w-full">
									Conta
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<LogoutButton />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}
