import { PropsWithChildren } from 'react';
import { HOME_DOMAIN } from '@/lib/constants/main';

const APP_COPYRIGHTS = 'Todos os direitos reservados.';
const PRIVACY_POLICY_LINK = `${HOME_DOMAIN}/privacidade`;
const TERMS_LINK = `${HOME_DOMAIN}/termos`;

export function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="grid w-full grid-cols-1 md:grid-cols-5 gap-2">
			<div className="col-span-1 flex min-h-screen flex-col items-center justify-between border-r border-gray-200 bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur sm:col-span-3">
				<div className="flex h-full w-full flex-col items-center justify-center">
					<>{children}</>
				</div>

				<div className="grid gap-2 pb-8 pt-4">
					<p className="text-xs text-gray-600">
						&copy; {new Date().getFullYear()} {APP_COPYRIGHTS}
					</p>

					<div className="flex gap-3 text-center text-xs text-gray-500 underline underline-offset-2">
						<a
							href={PRIVACY_POLICY_LINK}
							target="_blank"
							className="hover:text-gray-800"
						>
							Política de privacidade
						</a>

						<a
							href={TERMS_LINK}
							target="_blank"
							className="hover:text-gray-800"
						>
							Termos de uso
						</a>
					</div>
				</div>
			</div>

			<div className="hidden h-full flex-col justify-center space-y-12 overflow-hidden md:col-span-2 md:flex"></div>
		</div>
	);
}
