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

        {/* 🗺️ 全站置頂導覽列 (Navbar) */}
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(2, 6, 23, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: isMobile ? '0.6rem 1rem' : '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 左側 LOGO：手機版隱藏文字，只留耳機圖示 */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎧</span>
            {!isMobile && (
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', letterSpacing: '1px' }}>
                Lifreedom <span style={{ color: '#38bdf8' }}>Studio</span>
              </span>
            )}
          </Link>

          {/* 右側選單：縮小字體與間距 */}
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '1.5rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
            <Link href="/courses" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📚 建築所</Link>
            <Link href="/glossary" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📖 魔導書</Link>
            <Link href="/collection" style={{ color: '#fbbf24', textDecoration: 'none' }}>📜 圖鑑</Link>
          </div>
        </nav>

        {/* 🤖 懸浮 AI 聽診按鈕 (手機版專屬視覺亮點) */}
        <Link href="/mix-assistant" style={{
          position: 'fixed',
          bottom: '25px',
          right: '20px',
          zIndex: 2000,
          background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)',
          textDecoration: 'none',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{ fontSize: '1.3rem' }}>🤖</span>
          <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 'bold' }}>AI 聽診</span>
        </Link>

        <main>{children}</main>

      </body>
    </html>
  );
}