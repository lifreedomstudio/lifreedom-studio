"use client";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import "./globals.css";
// 引入問卷按鈕
import FeedbackButton from '@/components/FeedbackButton';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="zh-TW">
      <head>
        <title>Lifreedom - AI Ear Training for Musicians</title>
        <meta name="description" content="專為音樂人打造的 AI 聽覺與空間感知訓練系統。" />
      </head>

      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#020617', color: '#f8fafc' }}>

        {/* 🚨 偵測如果是 LINE 或 FB 內建瀏覽器，強制跳出警告 */}
        {typeof window !== 'undefined' && /Line|FBAN|FBAV/i.test(navigator.userAgent) && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: '#020617', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>⚠️</span>
            <h2 style={{ color: '#fbbf24', margin: '1.5rem 0' }}>請使用系統瀏覽器開啟</h2>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
              為了確保 Google 登入安全，請點擊右上角的 <b style={{ color: '#fff' }}>「三個點 ··· 」</b> <br />
              並選擇 <b style={{ color: '#38bdf8' }}>「在瀏覽器中（Chrome/Safari）開啟」</b>
            </p>
          </div>
        )}

        {/* 🗺️ 全站置頂導覽列 (Navbar) */}
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: isMobile ? '0.7rem 1.2rem' : '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 左側 LOGO */}
          <Link href="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🎧</span>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: '900', fontSize: isMobile ? '1.1rem' : '1.25rem', color: '#fff', letterSpacing: '0.5px' }}>
                Lifreedom
              </span>
              {!isMobile && (
                <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', borderLeft: '2px solid #334155', paddingLeft: '8px', marginLeft: '8px', marginTop: '2px' }}>
                  AI EAR TRAINING
                </span>
              )}
            </div>
          </Link>

          {/* 右側選單邏輯 */}
          {isMobile ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', padding: '0 5px' }}
            >
              {isMenuOpen ? '✖' : '☰'}
            </button>
          ) : (
            // 💻 電腦版選單 
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
              <Link href="/courses" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📚 課程計劃</Link>
              <Link href="/eq-game" style={{ color: '#e2e8f0', textDecoration: 'none' }}>🎛️ EQ體驗館</Link>
              <Link href="/courses/arrangement/sonic-lab" style={{ color: '#e2e8f0', textDecoration: 'none' }}>🧪 聲學實驗室</Link>
              <Link href="/glossary" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📖 混音字典</Link>
              <Link href="/collection" style={{ color: '#fbbf24', textDecoration: 'none' }}>📜 參數圖鑑</Link>
              <span style={{ color: '#475569' }}>|</span>
              <Link href="/mix-assistant" style={{ color: '#38bdf8', textDecoration: 'none' }}>🤖 AI 助理</Link>
              <Link href="/pricing" style={{ color: '#facc15', textDecoration: 'none' }}>💎 方案</Link>
              <Link href="/login" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '50px' }}>登入</Link>
            </div>
          )}
        </nav>

        {/* 📱 手機版的下拉選單 */}
        {isMobile && isMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '55px',
            left: 0,
            right: 0,
            background: 'rgba(2, 6, 23, 0.98)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 2rem',
            gap: '1.5rem',
            zIndex: 999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <Link href="/courses" onClick={closeMenu} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>📚 課程計劃 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(建築所)</span></Link>
            <Link href="/eq-game" onClick={closeMenu} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>🎛️ EQ體驗館</Link>
            <Link href="/courses/arrangement/sonic-lab" onClick={closeMenu} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>🧪 聲學實驗室</Link>
            <Link href="/glossary" onClick={closeMenu} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>📖 混音字典 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(魔導書)</span></Link>
            <Link href="/collection" onClick={closeMenu} style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>📜 參數圖鑑</Link>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
            <Link href="/mix-assistant" onClick={closeMenu} style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>🤖 AI 助理</Link>
            <Link href="/pricing" onClick={closeMenu} style={{ color: '#facc15', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>💎 訂閱方案</Link>
            <Link href="/login" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50px' }}>登入 / 註冊</Link>
          </div>
        )}

        <main>{children}</main>

        <FeedbackButton />

      </body>
    </html>
  );
}