'use client';

import AuthForm from '@/components/auth/AuthForm';
import { Toaster } from '@/components/ui/sonner';

export default function SignUp() {
  return (
    <>
      <AuthForm mode="signup" />
      <Toaster />
    </>
  );
}
