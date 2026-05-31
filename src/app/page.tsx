"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 強制每次載入首頁時回到頂部，避免奇怪的快取位置
    window.scrollTo(0, 0);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* 🌟 1. 英雄視覺區 (Hero Section) */}
      <div style={{
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '8rem 1.5rem 2rem 1.5rem' : '6rem 2rem 2rem 2rem'
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{ height: isMobile ? '160px' : '200px', objectFit: 'contain', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px rgba(252, 163, 17, 0.6))', animation: 'float 3s ease-in-out infinite' }}
        />

        <div style={{ color: '#fca311', letterSpacing: '6px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.7rem' : '0.9rem', opacity: 0.9 }}>
          LIFREEDOM STUDIO PRESENTS
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4.8rem)', fontWeight: '900', margin: '0 auto 1.5rem auto', maxWidth: '900px',
          lineHeight: 1.2, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          你不是學不會混音，<br />
          而是需要建立「聽覺判斷能力」
        </h1>

        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          color: '#cbd5e1',
          maxWidth: '750px',
          marginBottom: '3.5rem',
          lineHeight: '1.8',
          fontWeight: '400',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          wordBreak: 'keep-all'
        }}>
          看了很多教學，卻做不出一樣的聲音？<br />
          調整了 EQ，卻不知道自己到底改變了什麼？<br /><br />

          <span style={{ color: '#fca311', fontWeight: 'bold' }}>
            問題不是你不夠努力，<br />
            而是你需要一套「系統化理解聲音的學習方法」。
          </span>
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto', maxWidth: '600px' }}>
          <button onClick={() => { window.scrollTo(0, 0); router.push('/courses'); }} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: '#fca311', color: '#000', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(252, 163, 17, 0.4)' }}>
            🚀 進入學習系統
          </button>
          <button onClick={() => { window.scrollTo(0, 0); router.push('/courses'); }} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer' }}>
            查看完整課程內容
          </button>
        </div>
      </div>

      {/* 🧠 1.5 系統定義區：Lifreedom 是什麼？ */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: '#020617', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>SYSTEM OVERVIEW</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>Lifreedom 是一套什麼樣的系統？</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            Lifreedom Studio 是一套<strong style={{ color: '#fff' }}>系統化混音學習平台</strong>。<br />
            透過結構化課程與實作訓練，協助你逐步建立：
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {['✔ 聽覺判斷能力', '✔ 混音決策邏輯', '✔ 可重現的製作流程'].map((tag, idx) => (
              <span key={idx} style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 'bold' }}>
                {tag}
              </span>
            ))}
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', fontWeight: 'bold' }}>
            我們提供系統化的引導，讓你知道「為什麼這樣做」。
          </p>
        </div>
      </div>

      {/* 💥 2. 痛點與解藥對比 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '2rem' : '2.8rem', marginBottom: '4rem', color: '#fff' }}>
            為什麼你學很久<br />
            卻還是<span style={{ color: '#ef4444' }}>卡住</span>？
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem' }}>
            {/* 痛點 */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '3rem 2rem', borderRadius: '24px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥱</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>多數人卡關的原因不是天份，而是方法：</h3>
              <ul style={{ color: '#94a3b8', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li>學到的內容無法套用到自己的作品</li>
                <li>不同設備與插件造成結果落差</li>
                <li>聽過很多形容詞，但無法實際調整聲音</li>
                <li>理論理解，但缺乏實際判斷能力</li>
              </ul>
            </div>

            {/* 解藥 */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3rem 2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', color: '#020617', padding: '8px 24px', borderBottomLeftRadius: '24px', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px' }}>OUR SOLUTION</div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ color: '#10b981', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>透過「學習系統 + 實作訓練」，逐步建立能力：</h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li><strong>聽覺訓練模組：</strong> 透過 A/B 對比練習，輔助你聽出差異。</li>
                <li><strong>分析與學習輔助工具：</strong> 提供混音調整的學習參考，協助理解聲音方向。</li>
                <li><strong>分階段學習路徑：</strong> 從基礎到進階，提供明確的學習目標。</li>
                <li><strong>可重複練習機制：</strong> 透過實作練習，讓學習內容內化。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 3. AI 音樂時代的需求 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderTop: '1px solid rgba(167, 139, 250, 0.2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>AI ERA</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>
              AI 音樂時代，<br />你更需要聲音判斷力
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              現在任何人都可以用 AI 輔助製作音樂，但核心的差距在於：<br />
              <strong style={{ color: '#a78bfa' }}>👉 聲音品質 ｜ 👉 空間層次 ｜ 👉 聽覺標準</strong><br /><br />

              在這裡你會學習到：<br />
              ✔ 協助改善聲音品質<br />
              ✔ 提供混音調整的學習參考<br />
              ✔ 建立聲音處理的基礎認知
            </p>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid #4c1d95', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px' }}>Before: 悶糊的 AI 原檔</div>
              <div style={{ height: '40px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" /></svg>
              </div>
              <div style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>After: 系統化調整後的聲音參考</div>
              <div style={{ height: '60px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid #a78bfa', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 L5,2 L10,18 L15,5 L20,15 L25,1 L30,19 L35,8 L40,12 L50,0 L60,20 L100,10" fill="none" stroke="#a78bfa" strokeWidth="2" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 4. 我們的目標與受眾 */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#0f172a', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>OUR GOAL</span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>透過系統化訓練，逐步建立獨立判斷能力</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            當你能做到：<strong style={{ color: '#fff' }}>👉 聽出問題 ｜ 👉 判斷原因 ｜ 👉 嘗試調整</strong><br />
            就是在逐步建立你的混音基礎能力。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
            {['創作者', 'DAW 使用者', '追求商業音質'].map((title, idx) => (
              <div key={idx} style={{ background: '#020617', padding: '2rem 1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#fca311', marginBottom: '0.5rem', fontSize: '1.1rem' }}>適合對象</h4>
                <p style={{ color: '#94a3b8', margin: 0 }}>{idx === 0 ? '想提升混音理解的創作者' : idx === 1 ? '使用 DAW 製作音樂的人' : '想學習聲音品質標準的人'}</p>
              </div>
            ))}
          </div>

          {/* 金流審查關鍵護身符：遊戲化說明 */}
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '2rem', borderRadius: '16px', border: '1px dashed rgba(56, 189, 248, 0.3)', textAlign: 'left' }}>
            <h4 style={{ color: '#38bdf8', fontSize: '1.1rem', marginBottom: '0.5rem' }}>🎮 關於學習方式說明</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              本平台採用「階段式學習設計」，透過任務與練習逐步引導內容，協助提升學習動機。<br />
              <strong>👉 此為學習引導機制，並非隨機或機率型獲取內容（非抽卡機制）。</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 5. Footer CTA 與 金流合規服務說明 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '1rem' }}>這不是單向的教學，而是一套幫助你建立音樂判斷能力的學習系統</h2>

        {/* 🚨 修正：將 Link 替換為 button，並強制畫面置頂跳轉 */}
        <button onClick={() => { window.scrollTo(0, 0); router.push('/courses'); }} style={{ display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)', margin: '2rem 0 4rem 0' }}>
          開始第一步訓練
        </button>

        {/* ⚠️ 金流合規宣告 (最嚴謹版本) */}
        <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'left', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: '1.7' }}>
            <strong>服務聲明：</strong> 本平台提供數位內容與線上學習服務，所有內容皆為教學用途，不保證特定成果或商業收益，<strong>學習成果因個人練習與投入程度而異</strong>。平台提供明確課程內容與使用說明，如有任何疑問，歡迎聯繫客服處理。
          </div>
        </div>

        {/* 基礎 Footer 連結 */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>使用條款</Link>
          <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>隱私權政策</Link>
          <Link href="/refund" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>退款政策</Link>
          <a href="mailto:support@lifreedom.com" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>聯絡我們</a>
        </div>

        <div style={{ marginTop: '2rem', color: '#475569', fontSize: '0.8rem' }}>© 2026 Lifreedom Studio. All rights reserved.</div>
      </div>
    </div>
  );
}