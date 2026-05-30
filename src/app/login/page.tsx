"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 🚨 記得引入 useRouter，用來跳轉頁面
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // 🚨 新增密碼狀態
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter(); // 啟動司機

  // 📝 註冊按鈕邏輯
  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage('❌ 註冊失敗：' + error.message);
    } else {
      setMessage('✨ 註冊成功！請直接點擊「🔑 登入大廳」。');
    }
    setLoading(false);
  };

  // 🔑 登入按鈕邏輯
  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage('❌ 帳號或密碼錯誤，請重新輸入！');
    } else {
      setMessage('✅ 登入成功！正在為您開門...');
      router.push('/courses'); // 🚪 成功就直接送進大廳！
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '2rem' }}>
      <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #1e293b', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>進入聲學建築所</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          請設定您的專屬帳號與密碼。
        </p>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          請設定您的專屬帳號與密碼。
        </p>

        {/* 把 form 改成 div，避免瀏覽器預設的重新整理行為 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="請輸入您的 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: '#020617', color: '#fff', fontSize: '1rem', outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="請設定密碼 (至少 6 個字)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: '#020617', color: '#fff', fontSize: '1rem', outline: 'none'
            }}
          />
          <div style={{ textAlign: 'right', marginTop: '-6px' }}>
            <span
              onClick={() => router.push('/forgot-password')}
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              忘記聲音通行證？
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={handleSignUp}
              disabled={loading || password.length < 6}
              style={{
                flex: 1, padding: '1rem 0.5rem', borderRadius: '12px', background: '#475569', color: '#fff', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: (loading || password.length < 6) ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
            >
              📝 首次註冊
            </button>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                flex: 1, padding: '1rem 0.5rem', borderRadius: '12px', background: loading ? '#475569' : '#38bdf8', color: '#020617', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
            >
              {loading ? '處理中...' : '🔑 登入大廳'}
            </button>
          </div>
        </div>

        {/* 顯示成功或失敗的訊息 */}
        {message && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: (message.includes('✨') || message.includes('✅')) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: (message.includes('✨') || message.includes('✅')) ? '#10b981' : '#ef4444', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}