"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* 🚀 導覽列 (Navbar) - 帶入品牌 Logo */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)', position: 'fixed', width: '100%', zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* 金色書法風格品牌 Logo 字樣 */}
          <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>Li freedom</span>
          <span style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.8 }}>STUDIO</span>
        </div>
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>EQ 實驗室</Link>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>壓縮器道場</Link>
          <Link href="#pricing" style={{ color: '#fca311', textDecoration: 'none', fontWeight: 'bold' }}>⭐ PRO 方案</Link>
        </div>
      </nav>

      {/* 🌟 1. 英雄視覺區 (Hero Section) - 精準痛點文案 */}
      <div style={{
        minHeight: isMobile ? '75vh' : '95vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(252, 163, 17, 0.1) 0%, #020617 70%)',
        padding: isMobile ? '6rem 1.5rem 2rem 1.5rem' : '4rem 2rem'
      }}>
        <div style={{ color: '#fca311', letterSpacing: '6px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.7rem' : '0.9rem', opacity: 0.8 }}>
          LIFREEDOM STUDIO PRESENTS
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 7vw, 4.5rem)', fontWeight: '900', margin: '0 0 1.5rem 0',
          lineHeight: 1.1, background: 'linear-gradient(to bottom, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          預算有限，也值得擁有<br />大師級的混音腦袋
        </h1>
        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem', color: '#94a3b8', maxWidth: '750px',
          marginBottom: '3.5rem', lineHeight: '1.8', fontWeight: '300'
        }}>
          找老師怕學不到想要的？看教學怕套用在自己的歌裡沒效？<br />
          <span style={{ color: '#fca311', fontWeight: 'bold' }}>Li freedom STUDIO</span> 為你開啟業界標準的任意門，<br />
          不用所費不貲，立刻掌握混音的絕對領域。
        </p>
        <Link href="/courses" style={{
          padding: isMobile ? '1rem 2.5rem' : '1.2rem 4rem', background: '#fca311', color: '#000', fontSize: '1.1rem', fontWeight: 'bold',
          borderRadius: '50px', textDecoration: 'none', boxShadow: '0 15px 35px rgba(252, 163, 17, 0.4)', transition: '0.3s'
        }}>
          立即開啟免費修煉 🚀
        </Link>
      </div>

      {/* 🛠️ 2. 核心優勢區 (Core Features) - 解決痛點的功能 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
              <h3 style={{ color: '#fca311', fontSize: '1.5rem', marginBottom: '1rem' }}>破解所有介面限制</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>不需要死背參數。我們教你最核心的聲學邏輯，無論你使用哪一款主流 DAW 或第三方 Plugin，都能無痛接軌、輕鬆駕馭。</p>
            </div>
            <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📸</div>
              <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1rem' }}>截圖 + 音檔 AI 分析</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>卡關了？不再孤立無援。只要上傳一張截圖、丟出一段音檔，AI 助理就會根據你的真實專案，給出一步步的具體解法。</p>
            </div>
            <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎧</div>
              <h3 style={{ color: '#a78bfa', fontSize: '1.5rem', marginBottom: '1rem' }}>解決你的真實問題</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>告別「拿別人的乾淨音檔教學，套在自己歌裡卻翻車」的慘況。在專屬道場裡盲測對決，只學你真正需要的實戰技術。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 💰 3. 定價方案區 (Pricing) - 呈現 599 的牛肉 */}
      <div id="pricing" style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>選擇您的<span style={{ color: '#fca311' }}>修煉等級</span></h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '5rem' }}>從基礎小白到獨立製作人，我們準備了不同份量的「牛肉」</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

            {/* Basic 方案 */}
            <div style={{ background: '#020617', padding: '3rem 2rem', borderRadius: '32px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>學徒級 (Basic)</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$0 <span style={{ fontSize: '1rem', color: '#64748b' }}>TWD</span></div>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '2.5', marginBottom: '3rem' }}>
                <li>✔️ 每日 3 次 AI 聽診基礎建議</li>
                <li>✔️ 解鎖基礎 EQ & 壓縮器道場</li>
                <li>✔️ 參與每日聽覺小挑戰</li>
                <li>✔️ 收集上限 5 張基礎魔法卡</li>
              </ul>
              <button style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#fff', border: '1px solid #334155', borderRadius: '14px', fontWeight: 'bold' }}>開始修煉</button>
            </div>

            {/* Producer 方案 - 這裡就是我們討論的牛肉核心 */}
            <div style={{
              background: 'linear-gradient(145deg, #1e293b, #020617)', padding: '3rem 2rem', borderRadius: '32px',
              border: '2px solid #fca311', position: 'relative', boxShadow: '0 20px 50px rgba(252, 163, 17, 0.1)'
            }}>
              <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: '#fca311', color: '#000', padding: '6px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>PRODUCER 推薦方案</div>
              <h3 style={{ color: '#fca311', fontSize: '1.5rem', marginBottom: '0.5rem' }}>製作人 (Producer)</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$599 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>TWD /月</span></div>

              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>🥩 解鎖專屬特權：</p>
                <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>🚀 <b>無限制</b> AI 聽診助理 (Suno 模式點數)</li>
                  <li>📤 <b>上傳個人分軌</b> 進場實戰測試</li>
                  <li>🃏 <b>高階實戰圖鑑</b> 與卡片掉落率 UP</li>
                  <li>🧪 解鎖 <b>空間、飽和度、母帶</b> 實驗室</li>
                  <li>📑 <b>DAW 參數一鍵打包</b> 成 Cheat Sheet</li>
                </ul>
              </div>
              <button style={{
                width: '100%', padding: '1.2rem', background: '#fca311', color: '#000',
                border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(252, 163, 17, 0.2)'
              }}>立即解鎖大師腦袋</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 底部引導 (Footer CTA) */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '1rem', color: '#f8fafc' }}>Li freedom STUDIO</h2>
        <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>我們孵化聲音，也孵化創作的自由。</p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617',
          fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(255,255,255,0.1)'
        }}>
          進入建築所大廳
        </Link>
        <div style={{ marginTop: '5rem', color: '#475569', fontSize: '0.85rem' }}>
          © 2026 Lifreedom Studio. All rights reserved.
        </div>
      </div>

    </div>
  );
}