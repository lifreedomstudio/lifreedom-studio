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

      {/* 🚀 導覽列 (Navbar) - 加大 Logo，加上氣氛光暈 */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '0.5rem 1rem' : '0.8rem 2rem', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)', position: 'fixed', width: '100%', zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {/* 🚨 這裡呼叫新的透明 PNG Logo */}
          <img
            src="/lifreedom-logo-removebg-preview.png"
            alt="Lifreedom Studio Logo"
            style={{
              height: isMobile ? '65px' : '90px',
              objectFit: 'contain',
              mixBlendMode: 'screen', // 🚨 黑魔法在這裡！直接去背！
              filter: 'drop-shadow(0 0 10px rgba(252, 163, 17, 0.5))',
              transition: '0.3s'
            }}
          />
        </div>
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '2.5rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.2s' }}>EQ 實驗室</Link>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.2s' }}>壓縮器道場</Link>
          <Link href="#pricing" style={{ color: '#fca311', textDecoration: 'none' }}>⭐ 製作人方案</Link>
        </div>
      </nav>

      {/* 🌟 1. 英雄視覺區 (Hero Section) */}
      <div style={{
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '6rem 1.5rem 2rem 1.5rem' : '4rem 2rem'
      }}>
        <div style={{ color: '#fca311', letterSpacing: '6px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.7rem' : '0.9rem', opacity: 0.9 }}>
          LIFREEDOM STUDIO PRESENTS
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 7vw, 4.8rem)', fontWeight: '900', margin: '0 0 1.5rem 0',
          lineHeight: 1.15, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          預算有限，也值得擁有<br />大師級的混音腦袋
        </h1>
        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem', color: '#cbd5e1', maxWidth: '750px',
          marginBottom: '3.5rem', lineHeight: '1.8', fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.8)'
        }}>
          找老師怕學不到想要的？看教學怕套用在自己的歌裡沒效？<br />
          <span style={{ color: '#fca311', fontWeight: 'bold' }}>Lifreedom STUDIO</span> 為你開啟業界標準的任意門，<br />
          不用所費不貲，立刻掌握混音的絕對領域。
        </p>
        <Link href="/courses" style={{
          padding: isMobile ? '1rem 2.5rem' : '1.2rem 4rem', background: '#fca311', color: '#000', fontSize: '1.1rem', fontWeight: '900',
          borderRadius: '50px', textDecoration: 'none', boxShadow: '0 10px 40px rgba(252, 163, 17, 0.4)', transition: 'transform 0.2s'
        }}>
          進入控制台，開始免費修煉 🚀
        </Link>
      </div>

      {/* ... (其餘區塊保留上一版代碼：核心優勢、The Truth、Gamification、Pricing、The Mission) ... */}

      {/* 🚀 底部引導 (Footer CTA) - 也同步加大並移除黑色拼接感 */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* 🚨 底部大 Logo：使用透明 PNG，加大尺寸，加上更強的光暈 */}
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{
            height: isMobile ? '160px' : '240px',
            objectFit: 'contain',
            marginBottom: '2rem',
            mixBlendMode: 'screen', // 🚨 黑魔法加在這裡！
            filter: 'drop-shadow(0 0 25px rgba(252, 163, 17, 0.4))'
          }}
        />

        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem' }}>我們孵化聲音，也孵化創作的自由。</p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617',
          fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(255,255,255,0.1)'
        }}>
          進入控制台
        </Link>
        <div style={{ marginTop: '5rem', color: '#475569', fontSize: '0.9rem' }}>
          © 2026 Lifreedom Studio. All rights reserved.
        </div>
      </div>

    </div>
  );
}