"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Wraps the app with theme context.
 * - attribute="class" → toggles `class="dark"` on <html> (Tailwind dark: works)
 * - defaultTheme="system" → respects OS preference on first visit
 * - enableSystem → auto-switches if user changes OS preference
 * - disableTransitionOnChange → prevents flash on theme swap
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
