import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx,mdx}',
		'./components/**/*.{ts,tsx,mdx}',
		'./ui/**/*.{ts,tsx,mdx}',
		'./app/**/*.{ts,tsx,mdx}',
		'./src/**/*.{ts,tsx,mdx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': {
						opacity: '1',
					},
					'20%,50%': {
						opacity: '0',
					},
				},
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
				'infinite-scroll': {
					'0%': {
						transform: 'translateX(0)',
					},
					'100%': {
						transform: 'translateX(-150%)',
					},
				},
				'text-appear': {
					'0%': {
						opacity: '0',
						transform: 'rotateX(45deg) scale(0.95)',
					},
					'100%': {
						opacity: '1',
						transform: 'rotateX(0deg) scale(1)',
					},
				},
				'table-pinned-shadow': {
					'0%': {
						filter: 'drop-shadow(rgba(0, 0, 0, 0.1) -2px 10px 6px)',
					},
					'100%': {
						filter: 'drop-shadow(rgba(0, 0, 0, 0) -2px 10px 6px)',
					},
				},
				'pulse-scale': {
					'0%': {
						transform: 'scale(0.8)',
						opacity: '0',
					},
					'30%': {
						opacity: '1',
					},
					'100%': {
						transform: 'scale(2)',
						opacity: '0',
					},
				},
				'gradient-move': {
					'0%': {
						backgroundPosition: '0% 50%',
					},
					'100%': {
						backgroundPosition: '200% 50%',
					},
				},
			},
			animation: {
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
				'fade-in': 'fade-in 0.2s ease-out forwards',
				'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-right-fade':
					'slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-down-fade': 'slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-left-fade': 'slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-in-from-right': 'slide-in-from-right 0.2s ease',
				'slide-out-to-right': 'slide-out-to-right 0.2s ease',
				'enter-from-right': 'enter-from-right 0.15s ease',
				'enter-from-left': 'enter-from-left 0.15s ease',
				'exit-to-right': 'exit-to-right 0.15s ease',
				'exit-to-left': 'exit-to-left 0.15s ease',
				'scale-in-content': 'scale-in-content 0.2s ease',
				'scale-out-content': 'scale-out-content 0.2s ease',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'infinite-scroll': 'infinite-scroll 22s linear infinite',
				'text-appear': 'text-appear 0.15s ease',
				'table-pinned-shadow': 'table-pinned-shadow cubic-bezier(0, 0, 1, 0)',
				'pulse-scale': 'pulse-scale 6s ease-out infinite',
				'gradient-move': 'gradient-move 5s linear infinite',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
