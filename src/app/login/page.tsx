"use client";
import { useState } from 'react';
// 記得確認這行的路徑是不是對應到你的 supabase 檔案
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 這裡呼叫 Supabase 的 Magic Link 功能
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 🚨 終極解法：使用 window.location.origin 
        // 這樣不管是 localhost 還是 Vercel，它都會自動抓取「當下最正確、且沒有多餘斜線」的主網址
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage('❌ 發生錯誤，請稍後再試：' + error.message);
    } else {
      setMessage('✨ 魔法連結已發送！請去信箱點擊連結登入。');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '2rem' }}>
      <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #1e293b', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>進入聲學建築所</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          無須記憶密碼。<br />輸入 Email，我們將發送專屬的魔法入場券給您。
        </p>

        <form onSubmit={handleMagicLinkLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem', borderRadius: '12px', background: loading ? '#475569' : '#38bdf8', color: '#020617', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
            }}
          >
            {loading ? '發送中...' : '✨ 獲取魔法連結'}
          </button>
        </form>

        {/* 顯示成功或失敗的訊息 */}
        {message && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: message.includes('✨') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('✨') ? '#10b981' : '#ef4444', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}