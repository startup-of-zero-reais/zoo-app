'use client';

import { API_DOMAIN } from '@/lib/constants/main';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';

export default function GoogleButton() {
	const handleLogin = async () => {
		const authUrl = `${API_DOMAIN}/v1/auth/google?redir_to=/app/onboarding?welcome`;
		window.location.assign(authUrl);
	};

	return (
		<div>
			<Button
				type="button"
				variant="outline"
				className="p-4 text-md"
				size="lg"
				onClick={handleLogin}
			>
				<GoogleIcon width={24} />
				Acessar com Google
			</Button>
		</div>
	);
}
