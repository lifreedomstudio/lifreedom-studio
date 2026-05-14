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

      {/* 🌟 1. 英雄視覺區 (Hero Section) - Logo 霸氣置中 */}
      <div style={{
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '6rem 1.5rem 2rem 1.5rem' : '4rem 2rem'
      }}>

        {/* 置中的品牌 Logo */}
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{
            height: isMobile ? '120px' : '160px',
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

        {/* 🚨 修正：移除硬性的 <br />，讓文字自然換行，並調整字體大小範圍避免落單字 */}
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4.8rem)', // 微調最小值，讓手機版字體適中
          fontWeight: '900', margin: '0 auto 1.5rem auto', maxWidth: '800px', // 限制最大寬度幫助排版
          lineHeight: 1.2, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          預算有限，也值得擁有大師級的混音腦袋
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

      {/* 🛠️ 2. 核心優勢區 (Core Features) */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
            <h3 style={{ color: '#fca311', fontSize: '1.4rem', marginBottom: '1rem' }}>破解所有介面限制</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>不需要死背參數。教你最核心的聲學邏輯，無論使用哪款 DAW 或 Plugin 都能無痛接軌。</p>
          </div>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📸</div>
            <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', marginBottom: '1rem' }}>專屬 AI 聽診對策</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>上傳一張截圖或一段音檔，AI 助理就會針對你的真實專案，給出一步步的具體解法。</p>
          </div>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎧</div>
            <h3 style={{ color: '#a78bfa', fontSize: '1.4rem', marginBottom: '1rem' }}>解決你的真實問題</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>告別拿別人的教材練習卻無法應用的困境。在專屬道場裡，只學實戰中真正需要的技術。</p>
          </div>
        </div>
      </div>

      {/* 🏗️ 3. THE TRUTH：製作人靈魂拷問 */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              {
                q: '【單薄症候群】', title: '主唱跟 Solo 聽起來很虛？',
                ans: '這通常不是麥克風的問題。從疊軌、微小飽和度染色到哈斯效應 (Haas Effect)，帶你掌握讓聲音從 2D 變 3D 的質感密技。',
                icon: '🎙️', color: '#fca311'
              },
              {
                q: '【頻率互毆】', title: '鋼琴跟貝斯永遠在泥淖裡打架？',
                ans: '低頻沒有做好口袋拼圖，EQ 轉到手斷掉依然是糊的。教你如何在編曲階段就規劃好頻率擺位。',
                icon: '🥊', color: '#ef4444'
              },
              {
                q: '【堆疊迷思】', title: '軌道疊了幾十軌，混音卻是災難？',
                ans: '你缺的不是更強的 Compressor，而是學會八度音錯位的頻段編排。',
                icon: '🥞', color: '#38bdf8'
              },
              {
                q: '【預設陷阱】', title: '樂器單獨聽都超神，合在一起卻糊成一團？',
                ans: '懂得做減法讓出焦點，才是大師的起點。教你如何處理那些「佔空間」的預設音色。',
                icon: '🎛️', color: '#a78bfa'
              }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '2.5rem', background: '#020617', borderRadius: '24px', borderLeft: `4px solid ${item.color}` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h4 style={{ color: item.color, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.q}</h4>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem', lineHeight: '1.5' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7' }}>{item.ans}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏆 4. 每日挑戰 (Gamification) */}
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

          {/* 🚨 修正：魔法卡排版，手機版時改為上下排列，解決被切掉的問題 */}
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

      {/* 💰 5. 定價方案區 (Pricing) */}
      <div id="pricing" style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', textAlign: 'center', marginBottom: '1rem' }}>選擇您的<span style={{ color: '#fca311' }}>修煉等級</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem', marginTop: '4rem' }}>
            <div style={{ background: '#020617', padding: '3rem 2rem', borderRadius: '32px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem' }}>學徒級 (Basic)</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$0 <span style={{ fontSize: '1rem', color: '#64748b' }}>TWD</span></div>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', lineHeight: '2.5', marginBottom: '3rem' }}>
                <li>✔️ 每日 3 次 AI 聽診對話</li>
                <li>✔️ 解鎖基礎 EQ & 壓縮器道場</li>
                <li>✔️ 參與每日聽覺小挑戰</li>
              </ul>
              <button style={{ width: '100%', padding: '1.2rem', background: 'transparent', color: '#fff', border: '1px solid #334155', borderRadius: '16px', fontWeight: 'bold' }}>免費開始</button>
            </div>
            <div style={{ background: 'linear-gradient(145deg, #1e293b, #020617)', padding: '3rem 2rem', borderRadius: '32px', border: '2px solid #fca311', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: '#fca311', color: '#000', padding: '6px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '900' }}>RECOMMENDED</div>
              <h3 style={{ color: '#fca311', fontSize: '1.6rem', marginBottom: '0.5rem' }}>製作人 (Producer)</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$599 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>TWD /月</span></div>
              <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', lineHeight: '2.2', marginBottom: '2.5rem' }}>
                <li>🚀 <b>無限制</b> AI 聽診助理</li>
                <li>📤 <b>上傳個人分軌</b> 實戰測試</li>
                <li>🧪 解鎖 <b>空間、飽和度、母帶</b> 實驗室</li>
                <li>📑 <b>DAW 參數一鍵打包</b></li>
              </ul>
              <button style={{ width: '100%', padding: '1.2rem', background: '#fca311', color: '#000', border: 'none', borderRadius: '16px', fontWeight: '900' }}>立即解鎖</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 6. 品牌目標與贊助 */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#020617', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>我們的目標</span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0 2rem 0' }}>讓你不再需要我們</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '2', marginBottom: '3rem', fontWeight: 'bold' }}>
            我們期望你在一年內，鍛鍊出大師級的直覺，成為獨當一面的專家，最終自信地「徹底畢業」。
          </p>
          <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              歡迎贊助我們一杯咖啡，讓我們持續提升 AI 品質，幫助更多迷惘的音樂人。
            </p>
            <button style={{ padding: '1rem 3rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', borderRadius: '50px', fontWeight: 'bold' }}>❤️ 贊助支持</button>
          </div>
        </div>
      </div>

      {/* 🚀 7. 底部引導 (Footer CTA) */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio Logo"
          style={{
            height: isMobile ? '160px' : '240px',
            objectFit: 'contain',
            marginBottom: '2rem',
            filter: 'drop-shadow(0 0 35px rgba(252, 163, 17, 0.5))'
          }}
        />
        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem' }}>我們孵化聲音，也孵化創作的自由。</p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '1.2rem 4rem', background: '#fff', color: '#020617',
          fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', textDecoration: 'none'
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