import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
	return (
		<Button variant="destructive" size="sm" className="w-full" asChild>
			<Link href={'/logout'}>
				<LogOut />
				Sair
			</Link>
		</Button>
	);
}
