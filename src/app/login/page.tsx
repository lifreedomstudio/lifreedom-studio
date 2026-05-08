"use client";
import { login } from '@/app/auth/actions';
import Link from 'next/link';
import { use, useTransition } from 'react';

export default function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const [isPending, startTransition] = useTransition();

  // 這是我們的「緩衝處理器」，確保動作能安全執行
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await login(formData);
    });
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Log In</h2>

        <form action={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email</label>
            <input className="input-field" id="email" name="email" type="email" required />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input className="input-field" id="password" name="password" type="password" required />
          </div>

          {resolvedSearchParams?.message && (
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {resolvedSearchParams.message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isPending}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary-color)' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}