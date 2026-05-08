import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lifreedom Studio | 聲學建築所",
  description: "製作人孵化計畫 - 你的專屬 AI 混音助理與聽覺道場",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#020617', color: '#f8fafc' }}>

        {/* 🗺️ 全站置頂導覽列 (Navbar) */}
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.8rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* 左側 LOGO */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎧</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>
              Lifreedom <span style={{ color: '#38bdf8' }}>Studio</span>
            </span>
          </Link>

          {/* 右側選單 (已將 AI 聽診移出) */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
            <Link href="/courses" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📚 建築所</Link>
            <Link href="/incubator" style={{ color: '#e2e8f0', textDecoration: 'none' }}>🧪 實驗室</Link>
            <Link href="/glossary" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📖 魔導書</Link>
            <Link href="/collection" style={{ color: '#fbbf24', textDecoration: 'none', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '4px 8px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.05)' }}>📜 圖鑑</Link>
          </div>
        </nav>

        {/* 🤖 全站懸浮 AI 聽診按鈕 */}
        <Link href="/mix-assistant" style={{
          position: 'fixed',
          bottom: '25px',
          right: '20px',
          zIndex: 2000,
          background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)',
          textDecoration: 'none',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          transition: 'transform 0.2s active'
        }}>
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>AI 聽診</span>
        </Link>

        {/* 網頁主要內容 */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}