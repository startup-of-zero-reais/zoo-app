import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,
	basePath: '/app',
	output: 'standalone',

	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Referrer-Policy',
						value: 'no-referrer-when-downgrade',
					},
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
				],
			},
		];
	},
};

export default nextConfig;
