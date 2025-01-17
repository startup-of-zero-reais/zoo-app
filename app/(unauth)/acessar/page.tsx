import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';
import { HOME_DOMAIN } from '@/lib/constants/main';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/layout/auth-layout';
import LoginForm from '@/app/(unauth)/acessar/form';

export default function Page() {
	return (
		<AuthLayout>
			<LoginForm />

			<div className="flex flex-col gap-4 items-center mt-8">
				<p>Acesse, simple e rápido.</p>

				<Button asChild variant="link">
					<Link href={`${HOME_DOMAIN}`}>
						<ArrowLeftCircle />
						Ou, volte para a tela inicia
					</Link>
				</Button>
			</div>
		</AuthLayout>
	);
}
