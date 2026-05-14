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

      {/* 🚀 導覽列 (Navbar) - Logo 隨畫面滑動固定於頂部 */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 2rem', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)', position: 'fixed', width: '100%', zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {/* 🚨 這裡呼叫你的實體 Logo 圖片 */}
          <img src="/lifreedom-logo.png" alt="Lifreedom Studio Logo" style={{ height: isMobile ? '35px' : '45px', objectFit: 'contain' }} />
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

      {/* 🛠️ 2. 核心優勢區... (與上一版相同，為節省篇幅此處省略詳細代碼，請保留上一版的 2. 核心優勢區) */}
      {/* 🏗️ 3. THE TRUTH... (與上一版相同，請保留) */}
      {/* 🏆 4. 魔法卡與每日挑戰... (與上一版相同，請保留) */}
      {/* 💰 5. 定價方案區... (與上一版相同，請保留) */}

      {/* 🎯 6. 全新區塊：品牌終極目標與贊助 (The Mission) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(252, 163, 17, 0.1)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>OUR MISSION</span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 2rem 0' }}>
            我們的終極目標：<br />讓你<span style={{ color: '#ef4444' }}>不再需要我們</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '2', marginBottom: '1.5rem', textAlign: 'justify' }}>
            Lifreedom STUDIO 的存在，是為了打造真正的音樂製作與混音人才。我們不打算把你一輩子綁在訂閱制裡。
          </p>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '2', marginBottom: '3rem', textAlign: 'justify', fontWeight: 'bold' }}>
            我們期望你在一年內，透過這套系統鍛鍊出大師級的直覺，成為能獨當一面的專家，最終自信地「徹底刪除這款 App」。
          </p>

          <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>☕</div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>支持聲學建築所計畫</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '600px' }}>
              這是一場有期限的孵化計畫。如果你認同這個「讓你畢業」的願景，或是你已經成功在這裡找回了音樂的主導權，歡迎透過小額捐款贊助我們，讓我們能把 App 的伺服器與 AI 品質提升得更好，幫助下一批迷惘的音樂人。
            </p>
            <button style={{
              padding: '1rem 3rem', background: 'transparent', color: '#fca311',
              border: '2px solid #fca311', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem',
              cursor: 'pointer', transition: '0.3s'
            }}>
              ❤️ 贊助我們一杯咖啡
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 7. 底部引導 (Footer CTA) - 加上實體大 Logo */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* 🚨 底部大 Logo，加上淡淡的光暈效果 */}
        <img src="/lifreedom-logo.png" alt="Lifreedom Studio Logo" style={{ height: '120px', objectFit: 'contain', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px rgba(252, 163, 17, 0.3))' }} />

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