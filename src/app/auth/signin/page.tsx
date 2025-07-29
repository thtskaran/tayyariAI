'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm'
import { Toaster } from '@/components/ui/sonner';

export default function SignIn() {
  return (
    <AuthProvider>
      <AuthForm mode="signin" />
      <Toaster />
    </AuthProvider>
  );
}