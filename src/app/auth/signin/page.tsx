'use client';

import AuthForm from '@/components/auth/AuthForm';
import { Toaster } from '@/components/ui/sonner';

export default function SignIn() {
  return (
    <>
      <AuthForm mode="signin" />
      <Toaster />
    </>
  );
}
