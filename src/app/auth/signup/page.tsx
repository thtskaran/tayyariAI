'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm'
import { Toaster } from '@/components/ui/sonner';

export default function SignUp() {
  return (
    <AuthProvider>
      <AuthForm mode="signup" />
      <Toaster />
    </AuthProvider>
  );
}