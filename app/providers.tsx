"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import {
  ClerkProvider,
} from "@clerk/nextjs";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <NextUIProvider>
      <NextThemesProvider defaultTheme="dark" attribute="class" {...themeProps}>
        <ClerkProvider publishableKey={publishableKey}>
            {children}
        </ClerkProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
