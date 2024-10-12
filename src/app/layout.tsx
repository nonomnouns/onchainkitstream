'use client'

import "./globals.css";
import { base } from 'viem/chains';
import { ThirdwebProvider } from "thirdweb/react";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          <QueryClientProvider client={queryClient}> 
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={base}
            >
              <div>
                {children}
              </div>
            </OnchainKitProvider>
          </QueryClientProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
