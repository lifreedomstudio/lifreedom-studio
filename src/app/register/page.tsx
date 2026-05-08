"use client";

import { signup } from '@/app/auth/actions';
import Link from 'next/link';
import { use } from 'react';

export default function RegisterPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const resolvedSearchParams = use(searchParams);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Create Account</h2>

        <form action={signup}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email</label>
            <input className="input-field" id="email" name="email" type="email" required />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input className="input-field" id="password" name="password" type="password" required minLength={6} />
          </div>

          {resolvedSearchParams?.message && (
            <div style={{ color: 'var(--error-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {resolvedSearchParams.message}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary-color)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
