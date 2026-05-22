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

      {/* 🔝 導覽列 (新增 Pricing 導航) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '1.5rem' : '1.5rem 4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'absolute', width: '100%', top: 0, zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fca311', letterSpacing: '1px' }}>Lifreedom Studio</div>
        <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1.5rem', alignItems: 'center' }}>
          <button onClick={() => router.push('/pricing')} style={{ background: 'transparent', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)', borderRadius: '50px', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(250, 204, 21, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            💎 訂閱方案
          </button>
          <button onClick={() => router.push('/login')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
            登入
          </button>
        </div>
      </nav>

      {/* 🌟 1. 英雄視覺區 (Hero Section) */}
      <div style={{
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '8rem 1.5rem 2rem 1.5rem' : '6rem 2rem 2rem 2rem' // 增加 top padding 避開導覽列
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{
            height: isMobile ? '160px' : '200px',
            objectFit: 'contain',
            marginBottom: '2rem',
            filter: 'drop-shadow(0 0 20px rgba(252, 163, 17, 0.6))',
            transition: '0.3s',
            animation: 'float 3s ease-in-out infinite'
          }}
        />

        <div style={{ color: '#fca311', letterSpacing: '6px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.7rem' : '0.9rem', opacity: 0.9 }}>
          LIFREEDOM STUDIO PRESENTS
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4.8rem)',
          fontWeight: '900', margin: '0 auto 1.5rem auto', maxWidth: '800px',
          lineHeight: 1.2, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          預算有限，也值得擁有大師級的混音腦袋
        </h1>

        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem', color: '#cbd5e1', maxWidth: '750px',
          marginBottom: '3.5rem', lineHeight: '1.8', fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          wordBreak: 'keep-all'
        }}>
          找老師怕學不到想要的？看教學怕套用在自己的歌裡沒效？<br />
          <span style={{ color: '#fca311', fontWeight: 'bold' }}>Lifreedom STUDIO</span> 首創聽覺互動教學，為你開啟業界標準的任意門。
        </p>

        {/* 雙按鈕 CTA */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto', maxWidth: '500px' }}>
          <button onClick={() => router.push('/courses')} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: '#fca311', color: '#000', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(252, 163, 17, 0.4)', transition: 'transform 0.2s', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            🚀 免費開始修煉
          </button>
          <button onClick={() => router.push('/pricing')} style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.2rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(252, 163, 17, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            💎 查看訂閱方案
          </button>
        </div>
      </div>

      {/* 💥 2. 我們的 MVP：痛點對比區塊 (融合自新策略) */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '2rem' : '2.8rem', marginBottom: '4rem', color: '#fff' }}>
            為什麼看了一堆教學，混音還是<span style={{ color: '#ef4444' }}>糊成一團</span>？
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem' }}>
            {/* 痛點：傳統教學 */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '3rem 2rem', borderRadius: '24px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥱</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>傳統影片與圖文教學的致命傷</h3>
              <ul style={{ color: '#94a3b8', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li><strong style={{ color: '#cbd5e1' }}>單向輸出：</strong>你無法親自操作參數聽差異。</li>
                <li><strong style={{ color: '#cbd5e1' }}>抽象名詞：</strong>充滿「Q度」、「溫暖」，無法具象化。</li>
                <li><strong style={{ color: '#cbd5e1' }}>沒有變因：</strong>聽不出效果器掛上去前後的真實差別。</li>
                <li><strong style={{ color: '#cbd5e1' }}>理論脫節：</strong>樂理背很熟，但遇到混音實戰就當機。</li>
              </ul>
            </div>

            {/* 解藥：我們的 MVP */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3rem 2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', color: '#020617', padding: '8px 24px', borderBottomLeftRadius: '24px', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px' }}>OUR SOLUTION</div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ color: '#10b981', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Lifreedom 沉浸式互動系統</h3>
              <ul style={{ color: '#cbd5e1', lineHeight: '2.2', fontSize: '1.1rem', paddingLeft: '20px', margin: 0 }}>
                <li><strong style={{ color: '#fff' }}>A/B 聽覺實驗室：</strong> 災難示範 vs 完美混音，一鍵切換。</li>
                <li><strong style={{ color: '#fff' }}>視覺化介面：</strong> 將指板、琴鍵與 Compressor 具體呈現。</li>
                <li><strong style={{ color: '#fff' }}>大白話教學：</strong> 用「公寓主委」、「暴躁老爸」秒懂複雜理論。</li>
                <li><strong style={{ color: '#fff' }}>遊戲化認證：</strong> 學完立刻測驗，確保知識真正內化成直覺。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 🏗️ 3. THE TRUTH：製作人靈魂拷問 (保留原版精華) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)', borderTop: '1px solid rgba(252, 163, 17, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>THE TRUTH</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3.2rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>
              其實，你的混音問題<br />往往出在<span style={{ color: '#38bdf8' }}>「編曲的起點」</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
              如果樂器的頻段與空間一開始就撞車，再好的 EQ 也救不回來。我們帶你切換製作人視野，從源頭解決混音的無力感。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                q: '【單薄症候群】', title: '主唱跟 Solo 聽起來很虛？',
                ans: '這通常不是麥克風的問題。從疊軌、微小飽和度染色到哈斯效應，帶你掌握讓聲音從 2D 變 3D 的密技。',
                icon: '🎙️', color: '#fca311'
              },
              {
                q: '【頻率互毆】', title: '鋼琴跟貝斯永遠在泥淖打架？',
                ans: '低頻沒有做好口袋拼圖，EQ 轉到手斷掉依然是糊的。教你如何在編曲階段就規劃好頻率擺位。',
                icon: '🥊', color: '#ef4444'
              },
              {
                q: '【堆疊迷思】', title: '疊了幾十軌，混音卻是災難？',
                ans: '你缺的不是更強的 Compressor，而是學會八度音錯位的頻段編排。',
                icon: '🥞', color: '#38bdf8'
              },
              {
                q: '【預設陷阱】', title: '樂器單獨聽超神，合在一起卻糊？',
                ans: '懂得做減法讓出焦點，才是大師的起點。教你如何處理那些「佔空間」的預設音色。',
                icon: '🎛️', color: '#a78bfa'
              }
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

      {/* 🏆 4. 每日挑戰 (Gamification) (保留原版) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem' }}>DAILY CHALLENGE</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0' }}>混音界的 Duolingo</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              每天 5 分鐘，建立你的聽覺肌肉記憶。透過聽辨頻段與空間深度的挑戰，解鎖傳說級的魔法圖鑑。
            </p>
            <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '20px', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>🎯</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>今日任務：頻率聽診器</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>聽出木吉他中哪個頻率正在打架？</p>
                </div>
              </div>
              <div style={{ height: '8px', background: '#020617', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ width: '75%', height: '100%', background: '#10b981' }}></div>
              </div>
              <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem', margin: 0 }}>🔥 已連續 5 天！</p>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '220px', background: '#1e293b', borderRadius: '20px', border: '2px solid #38bdf8', padding: '1.2rem', transform: isMobile ? 'none' : 'rotate(-5deg)', transition: 'transform 0.3s' }}>
              <div style={{ height: '100px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem' }}>↔️</div>
              <h4 style={{ color: '#fff', margin: '10px 0 5px' }}>LCR 擺位法則</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LEGENDARY CARD</p>
            </div>
            <div style={{ width: '220px', background: '#1e293b', borderRadius: '20px', border: '2px solid #fca311', padding: '1.2rem', transform: isMobile ? 'none' : 'rotate(5deg)', transition: 'transform 0.3s' }}>
              <div style={{ height: '100px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem' }}>👻</div>
              <h4 style={{ color: '#fff', margin: '10px 0 5px' }}>哈斯效應</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>EPIC CARD</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 5. 品牌目標與贊助 (優化排版) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#0f172a', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>OUR MISSION</span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>讓你不再需要我們</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            我們期望你在一年內，鍛鍊出大師級的直覺，成為獨當一面的專家，最終自信地從這裡「徹底畢業」。
          </p>
          <div style={{ background: '#020617', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid rgba(252, 163, 17, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: '0 auto 2rem auto', maxWidth: '500px' }}>
              覺得這些教學有幫助嗎？歡迎贊助我們一杯咖啡，讓我們持續提升 AI 聽診品質，幫助更多迷惘的音樂人。
            </p>
            <button style={{ padding: '1rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(252, 163, 17, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              ❤️ 贊助支持開發
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 6. 底部引導 (Footer CTA) */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{ height: isMobile ? '160px' : '200px', objectFit: 'contain', marginBottom: '2rem', filter: 'drop-shadow(0 0 35px rgba(252, 163, 17, 0.5))' }}
        />
        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem' }}>我們孵化聲音，也孵化創作的自由。</p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617',
          fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
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