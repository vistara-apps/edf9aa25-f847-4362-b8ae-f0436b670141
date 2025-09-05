'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'wagmi/chains';
import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <MiniKitProvider
        chain={base}
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </MiniKitProvider>
    </ErrorBoundary>
  );
}
