'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // optional (backend ignores)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
    await axios.post(`${API_BASE}/user`, { email });

    localStorage.setItem("email", email);
    window.dispatchEvent(new Event("storage"));
    router.push("/dashboard");
  } catch (err: any) {
    if (err.response?.status !== 409) {
      setError(err.response?.data?.error || "Something went wrong");
    } else {
      // user already exists → OK
      localStorage.setItem("email", email);
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'signup'
              ? 'Register to start building your resume'
              : 'Welcome back'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password (optional, backend ignores for now) */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                ? 'Register'
                : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New here?{' '}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:underline"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
