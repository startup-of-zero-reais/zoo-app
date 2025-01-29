'use client';

import React from 'react';
import { useGlobalErrorMonitor } from '@/hooks/use-global-eum';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
	useGlobalErrorMonitor();
	return <>{children}</>;
}
