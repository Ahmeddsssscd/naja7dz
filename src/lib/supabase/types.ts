/**
 * Supabase generated types.
 * Once tables grow, run: npx supabase gen types typescript --project-id cyabavzunccvlfwvuyuj > src/lib/supabase/types.ts
 * For now, this is a hand-written stub matching our first migration.
 */
export type Database = {
  public: {
    Tables: {
      early_access_signups: {
        Row: {
          id: string;
          email: string;
          locale: "fr" | "ar";
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          locale?: "fr" | "ar";
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          locale?: "fr" | "ar";
          source?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Add server-only marker so this file can be safely imported anywhere
declare module "server-only" {}
