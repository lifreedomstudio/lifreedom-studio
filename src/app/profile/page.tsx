"use client";
import { use, useState } from 'react';
import { useRouter } from 'next/navigation'; // 🚀 引入跳轉工具

export default function ProfilePage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const [saving, setSaving] = useState(false);
  const router = useRouter(); // 🚀 啟動跳轉工具

  async function handleSave(formData: FormData) {
    setSaving(true);
    // 這裡之後會接上儲存到 Supabase 的邏輯
    setTimeout(() => {
      setSaving(false);
      alert("設定已儲存！即將為您開啟混音助理...");
      // 🚀 儲存完畢，無腦自動跳轉到混音頁面！
      router.push('/mix-assistant');
    }, 1000);
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Lifreedom Studio 偏好設定</h1>

      <form action={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>慣用 DAW</label>
          <select name="daw" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: '#111', color: '#fff', border: '1px solid #333', outline: 'none' }}>
            <option value="logic">Logic Pro</option>
            <option value="ableton">Ableton Live</option>
            <option value="cubase">Cubase</option>
            <option value="protools">Pro Tools</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>主要製作曲風</label>
          <input name="genre" placeholder="例如：Pop, Rock, EDM..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: '#111', color: '#fff', border: '1px solid #333', outline: 'none' }} />
        </div>

        {/* 儲存並跳轉按鈕 */}
        <button
          type="submit"
          disabled={saving}
          style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem', transition: 'background 0.2s' }}
        >
          {saving ? '儲存中...' : '儲存設定並進入助理 ✨'}
        </button>

        {/* 略過設定，直接跳轉按鈕 */}
        <button
          type="button"
          onClick={() => router.push('/mix-assistant')}
          style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', background: 'transparent', color: '#a78bfa', border: '1px solid #8b5cf6', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          略過設定，直接開始混音 🚀
        </button>
      </form>
    </div>
  );
}