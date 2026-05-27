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
          fontSize: 'clamp(2rem, 8vw, 4.8rem)', fontWeight: '900', margin: '0 auto 1.5rem auto', maxWidth: '800px',
          lineHeight: 1.2, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          你不是不會混音，只是從來沒「真正聽懂」
        </h1>

        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem', color: '#cbd5e1', maxWidth: '750px',
          marginBottom: '3.5rem', lineHeight: '1.8', fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.8)', wordBreak: 'keep-all'
        }}>
          看了教學卻做不出一樣的聲音？<br />
          轉了一堆 EQ，卻不知道自己到底改了什麼？<br />
          <span style={{ color: '#fca311', fontWeight: 'bold' }}>Lifreedom STUDIO</span> 不是教你「怎麼做」 <br />
          而是讓你第一次真正「聽懂差別」。</p>


        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto', maxWidth: '500px' }}>
          <button onClick={() => router.push('/courses')} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: '#fca311', color: '#000', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(252, 163, 17, 0.4)' }}>
            🚀 開始第一次「聽懂混音」
          </button>
          <button onClick={() => router.push('/pricing')} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer' }}>
            💎 解鎖完整製作能力
          </button>
        </div>
      </div>

      {/* 💥 2. 痛點對比：MVP 核心價值 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '2rem' : '2.8rem', marginBottom: '4rem', color: '#fff' }}>
            為什麼你已經很努力了<br />
            混音卻還是<span style={{ color: '#ef4444' }}>糊掉</span>？
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem' }}>
            {/* 痛點 */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '3rem 2rem', borderRadius: '24px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥱</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>你不是學不會，而是卡在這裡</h3>
              <ul style={{ color: '#94a3b8', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li><strong>盲盒學習：</strong> 花了時間和錢，卻不確定學的東西能不能用在你的音樂。</li>
                <li><strong>設備落差：</strong> 教學裡的插件與環境，回到自己電腦完全對不上。</li>
                <li><strong>只會形容，不會判斷：</strong> 「溫暖」「厚」這些詞，你聽過，但你調不出來。</li>
                <li><strong>知道理論，做不出聲音：</strong> 你懂 EQ / Compressor，但聲音還是沒變好。</li>
              </ul>
            </div>

            {/* 解藥 */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3rem 2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', color: '#020617', padding: '8px 24px', borderBottomLeftRadius: '24px', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px' }}>OUR SOLUTION</div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ color: '#10b981', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>我們不是教學，是「可操作的聽覺系統」</h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li><strong>AI 聽診：</strong> 丟你的混音進來，直接告訴你哪裡出問題、怎麼修。</li>
                <li><strong>A/B 聽覺訓練：</strong> 不是看懂，是「聽到差異」並內化。</li>
                <li><strong>翻譯複雜理論：</strong> 把艱深音訊概念變成你腦中有畫面的東西。</li>
                <li><strong>脫離插件依賴：</strong> 不管你用什麼 DAW，都能做出正確判斷。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 3. 新增亮點：AI 音樂生成音質優化 */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderTop: '1px solid rgba(167, 139, 250, 0.2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>NEW FEATURE</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}> AI 可以幫你做歌<br />
              但救不了你的聲音</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              用 Suno / Udio 做出來的音樂，為什麼總是「差一點」？<br />
              問題不是創作，而是<strong>聲音品質</strong>。<br /><br />

              在這裡你會學會：<br />
              ✔ 清掉 AI 音樂的數位濁感<br />
              ✔ 把扁平聲音拉回立體<br />
              ✔ 做出可以上架的商業音質
            </p>
            <button onClick={() => router.push('/courses')} style={{ background: '#a78bfa', color: '#020617', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: '900', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)' }}>
              讓 AI 音樂變成「能發行的作品」 ⚡
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {/* 視覺化圖表：展示低保真變成高保真 */}
            <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid #4c1d95', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px' }}>Before: 悶糊的 AI 原檔</div>
              <div style={{ height: '40px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" /></svg>
              </div>
              <div style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>After: Lifreedom 後期優化</div>
              <div style={{ height: '60px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid #a78bfa', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 L5,2 L10,18 L15,5 L20,15 L25,1 L30,19 L35,8 L40,12 L50,0 L60,20 L100,10" fill="none" stroke="#a78bfa" strokeWidth="2" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏗️ 4. THE TRUTH：製作人靈魂拷問 (保留原版精華) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)', borderTop: '1px solid rgba(252, 163, 17, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>THE TRUTH</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3.2rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>
              問題從來不在混音技巧<br />
              而是在<span style={{ color: '#38bdf8' }}>你一開始就寫錯了</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { q: '【單薄症候群】', title: '主唱跟 Solo 聽起來很虛？', ans: '這通常不是麥克風的問題。帶你掌握哈斯效應與飽和度染色，讓聲音從 2D 變 3D。', icon: '🎙️', color: '#fca311' },
              { q: '【頻率互毆】', title: '鋼琴跟貝斯永遠在泥淖打架？', ans: '教你在編曲階段就規劃好頻率擺位，不用再把 EQ 轉到手斷掉。', icon: '🥊', color: '#ef4444' },
              { q: '【堆疊迷思】', title: '疊了幾十軌，混音卻是災難？', ans: '你缺的不是更強的 Compressor，而是學會八度音錯位的頻段編排。', icon: '🥞', color: '#38bdf8' },
              { q: '【預設陷阱】', title: '樂器單獨聽超神，合在一起卻糊？', ans: '懂得做減法讓出焦點，才是大師的起點。教你處理那些「佔空間」的預設音色。', icon: '🎛️', color: '#a78bfa' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '2rem', background: '#020617', borderRadius: '24px', borderLeft: `4px solid ${item.color}`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h4 style={{ color: item.color, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.q}</h4>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', lineHeight: '1.5' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>{item.ans}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🎯 5. 品牌目標與精確贊助 (優化文案) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#0f172a', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>OUR MISSION</span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>我們的目標，是讓你不再需要教學</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            當你能夠「聽出問題 → 自己修正」<br />
            你就已經超越 90% 的創作者。<br /><br />

            我們做的，不是課程<br />
            是讓你擁有判斷聲音的能力。
          </p>
          <div style={{ background: '#020617', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid rgba(252, 163, 17, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: '0 auto 2rem auto', maxWidth: '550px' }}>
              我們正在打造一套讓創作者真正變強的系統。<br />
              如果它幫助過你，<br />
              <strong style={{ color: '#fca311' }}>你的一點支持，會讓它幫助更多人。</strong>
            </p>
            <button style={{ padding: '1rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(252, 163, 17, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              ❤️ 支持這個系統繼續存在
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 6. Footer CTA */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem' }}>下一次打開 DAW，你會開始聽見以前沒聽過的東西。
        </p>
        <Link href="/courses" style={{ display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
          進入你的製作人世界
        </Link>
        <div style={{ marginTop: '5rem', color: '#475569', fontSize: '0.9rem' }}>© 2026 Lifreedom Studio. All rights reserved.</div>
      </div>
    </div>
  );
}