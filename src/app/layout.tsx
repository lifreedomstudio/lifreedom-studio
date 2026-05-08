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
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 左側 LOGO */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎧</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>
              Lifreedom <span style={{ color: '#38bdf8' }}>Studio</span>
            </span>
          </Link>

          {/* 右側選單 */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.95rem', fontWeight: 'bold' }}>
            <Link href="/courses" style={{ color: '#e2e8f0', textDecoration: 'none', transition: 'color 0.2s' }}>📚 建築所大廳</Link>
            <Link href="/incubator" style={{ color: '#e2e8f0', textDecoration: 'none', transition: 'color 0.2s' }}>🧪 編曲實驗室</Link>
            <Link href="/glossary" style={{ color: '#e2e8f0', textDecoration: 'none', transition: 'color 0.2s' }}>📖 魔導書</Link>
            <Link href="/collection" style={{ color: '#fbbf24', textDecoration: 'none', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '6px 12px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.05)' }}>📜 圖鑑</Link>
            <Link href="/mix-assistant" style={{ color: '#020617', textDecoration: 'none', background: '#38bdf8', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)' }}>🤖 AI 聽診</Link>
          </div>
        </nav>

        {/* 網頁主要內容會被渲染在這裡 */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}