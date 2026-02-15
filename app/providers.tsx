'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Toaster } from 'sonner';
import { TranslationProvider } from '@/hooks/use-translation';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    const initAuth = useAuthStore((state) => state.initAuth);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    return (
        <QueryClientProvider client={queryClient}>
            <TranslationProvider>
                <Toaster richColors position="top-right" />
                {children}
            </TranslationProvider>
        </QueryClientProvider>
    );
}
