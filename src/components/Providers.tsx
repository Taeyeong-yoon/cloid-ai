"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import LoginModal from "./LoginModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
        <LoginModal />
      </AuthProvider>
    </LanguageProvider>
  );
}
