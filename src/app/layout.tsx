"use client";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <html lang="zh-TW">
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
          padding: isMobile ? '0.7rem 0.8rem' : '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 左側 LOGO：文字與耳機重聚了 */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🎧</span>
            <span style={{ fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>
              Lifreedom <span style={{ color: '#38bdf8' }}>Studio</span>
            </span>
          </Link>

          {/* 右側選單：接回實驗室，並優化手機字體 */}
          <div style={{ display: 'flex', gap: isMobile ? '8px' : '1.5rem', alignItems: 'center', fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: 'bold' }}>
            <Link href="/courses" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📚 建築</Link>
            <Link href="/incubator" style={{ color: '#e2e8f0', textDecoration: 'none' }}>🧪 實驗</Link>
            <Link href="/glossary" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📖 導書</Link>
            <Link href="/collection" style={{ color: '#fbbf24', textDecoration: 'none' }}>📜 圖鑑</Link>
          </div>
        </nav>

        {/* 🤖 懸浮 AI 聽診：膠囊化設計，更有點擊感 */}
        <Link href="/mix-assistant" style={{
          position: 'fixed',
          bottom: '25px',
          right: '20px',
          zIndex: 2000,
          background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
          padding: isMobile ? '10px 16px' : '12px 24px',
          borderRadius: '50px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 25px rgba(29, 78, 216, 0.5)',
          textDecoration: 'none',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'transform 0.2s'
        }}>
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#fff', fontWeight: 'bold' }}>AI 聽診</span>
        </Link>

        <main>{children}</main>

      </body>
    </html>
  );
}