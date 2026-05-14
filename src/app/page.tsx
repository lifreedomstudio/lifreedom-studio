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

      {/* 🚀 導覽列 (Navbar) - Lifreedom f孔專屬 Logo */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)', position: 'fixed', width: '100%', zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', cursor: 'pointer' }}>
          {/* 金色 Lifreedom (f 使用斜體襯線字模擬小提琴 f 孔) */}
          <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '1px' }}>
            Li<span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', margin: '0 -1px' }}>f</span>reedom
          </span>
          <span style={{ color: '#fff', fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.8, fontWeight: 'bold' }}>STUDIO</span>
        </div>
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '2.5rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.2s' }}>EQ 實驗室</Link>
          <Link href="/courses" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.2s' }}>壓縮器道場</Link>
          <Link href="#pricing" style={{ color: '#fca311', textDecoration: 'none' }}>⭐ 製作人方案</Link>
        </div>
      </nav>

      {/* 🌟 1. 英雄視覺區 (Hero Section) - 虛擬控台背景 */}
      <div style={{
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        // 🚨 這裡設定了虛擬控台背景！只要把一張錄音室控台的圖命名為 console-bg.jpg 放在 public 資料夾即可
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

      {/* 🛠️ 2. 核心優勢區 (Core Features) */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
            <h3 style={{ color: '#fca311', fontSize: '1.4rem', marginBottom: '1rem' }}>破解所有介面限制</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>不需要死背參數。我們教你最核心的聲學邏輯，無論你使用哪一款主流 DAW 或第三方 Plugin，都能無痛接軌。</p>
          </div>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📸</div>
            <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', marginBottom: '1rem' }}>專屬 AI 聽診對策</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>卡關了？只要上傳一張截圖、丟出一段音檔，AI 助理就會針對「你的真實專案」，給出一步步的具體解法。</p>
          </div>
          <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '30px', border: '1px solid rgba(167, 139, 250, 0.2)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎧</div>
            <h3 style={{ color: '#a78bfa', fontSize: '1.4rem', marginBottom: '1rem' }}>解決你的真實問題</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>告別「拿別人的乾淨音檔教學，套在自己歌裡卻翻車」的慘況。在專屬道場裡盲測對決，只學實戰技術。</p>
          </div>
        </div>
      </div>

      {/* 🏗️ 3. THE TRUTH：製作人靈魂拷問 (編曲 vs 混音) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)', borderTop: '1px solid rgba(252, 163, 17, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>THE TRUTH</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3.2rem', color: '#fff', margin: '1rem 0 1.5rem 0' }}>
              其實，你的混音問題<br />往往出在<span style={{ color: '#38bdf8' }}>「編曲的起點」</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
              如果樂器的頻段與空間一開始就撞車，再好的 EQ 也救不回來。我們帶你切換「製作人視野」，從源頭解決混音的無力感。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              {
                q: '【單薄症候群】', title: '別人的主唱跟 Solo 肥厚扎實，自己的卻像一張紙？',
                ans: '總覺得聲音很「虛」？這通常不是麥克風的問題。從疊軌、微小的飽和度染色，到微秒級的哈斯效應 (Haas Effect)，這些才是讓聲音從 2D 變 3D 的密技。',
                icon: '🎙️', color: '#fca311'
              },
              {
                q: '【頻率互毆】', title: '左手鋼琴跟貝斯永遠在泥淖裡打架？',
                ans: '詞曲創作者最常犯的錯！在鋼琴上彈得很爽的左手低音，直接把貝斯的空間吃乾淨。當低頻沒有做好「口袋拼圖」，EQ 轉到手斷掉依然是糊的。',
                icon: '🥊', color: '#ef4444'
              },
              {
                q: '【堆疊迷思】', title: '軌道疊了幾十軌，混音卻變成一場災難？',
                ans: '覺得歌聽起來空，就瘋狂加樂器，結果木吉他、合成器全部擠在中頻。你缺的不是更強的 Compressor，而是學會「八度音錯位」的頻段編排。',
                icon: '🥞', color: '#38bdf8'
              },
              {
                q: '【預設陷阱】', title: '單獨聽樂器都超神，合在一起卻糊成一團？',
                ans: 'Plugin 預設音色為了好賣，單聽都超滿、超寬。但把五個「超寬」的樂器擺在一起，整首歌就沒了焦點。懂得「做減法」讓出空間，才是大師起點。',
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

      {/* 🏆 4. 魔法卡與每日挑戰 (Gamification) */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem' }}>DAILY CHALLENGE</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', margin: '1rem 0' }}>混音界的 Duolingo</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              每天 5 分鐘，建立你的聽覺肌肉記憶。透過聽辨頻段與空間深度的挑戰，累積經驗值，並解鎖隱藏在系統中的「傳說級魔法圖鑑」。
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
              <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem', margin: 0 }}>🔥 連續修煉 5 天！再兩天解鎖稀有碎片。</p>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', justifyContent: 'center', width: '100%' }}>
            <div style={{ width: isMobile ? '100%' : '220px', background: '#1e293b', borderRadius: '20px', border: '2px solid #38bdf8', overflow: 'hidden', transform: isMobile ? 'none' : 'rotate(-5deg) translateY(20px)', boxShadow: isMobile ? '0 5px 15px rgba(0,0,0,0.3)' : '-10px 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ height: '140px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>↔️</div>
              <div style={{ padding: '1.2rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px' }}>LEGENDARY CARD</div>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '5px 0' }}>LCR 擺位法則</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>將節奏組推向極左極右，為中高頻讓出聽覺高速公路。</p>
              </div>
            </div>
            <div style={{ width: isMobile ? '100%' : '220px', background: '#1e293b', borderRadius: '20px', border: '2px solid #fca311', overflow: 'hidden', transform: isMobile ? 'none' : 'rotate(5deg)', zIndex: 2, boxShadow: isMobile ? '0 5px 15px rgba(0,0,0,0.3)' : '10px 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ height: '140px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>👻</div>
              <div style={{ padding: '1.2rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#fca311', fontWeight: 'bold', letterSpacing: '1px' }}>EPIC CARD</div>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '5px 0' }}>哈斯效應假身術</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>利用微秒延遲人耳錯覺，將單聲道瞬間拉寬成立體音牆。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💰 5. 定價方案區 (Pricing) - 呈現 599 的牛肉 */}
      <div id="pricing" style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', textAlign: 'center', marginBottom: '1rem' }}>選擇您的<span style={{ color: '#fca311' }}>修煉等級</span></h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '5rem', fontSize: '1.1rem' }}>從基礎小白到獨立製作人，我們準備了不同份量的「牛肉」</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Basic 方案 */}
            <div style={{ background: '#020617', padding: '3rem 2rem', borderRadius: '32px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem' }}>學徒級 (Basic)</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$0 <span style={{ fontSize: '1rem', color: '#64748b' }}>TWD</span></div>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '1rem', lineHeight: '2.5', marginBottom: '3rem' }}>
                <li>✔️ 每日 3 次 AI 聽診基礎對話</li>
                <li>✔️ 解鎖基礎 EQ & 壓縮器道場</li>
                <li>✔️ 參與每日聽覺小挑戰</li>
                <li>✔️ 收集上限 5 張基礎魔法卡</li>
              </ul>
              <button style={{ width: '100%', padding: '1.2rem', background: 'transparent', color: '#fff', border: '1px solid #334155', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem' }}>開始免費修煉</button>
            </div>

            {/* Producer 方案 */}
            <div style={{
              background: 'linear-gradient(145deg, #1e293b, #020617)', padding: '3rem 2rem', borderRadius: '32px',
              border: '2px solid #fca311', position: 'relative', boxShadow: '0 20px 50px rgba(252, 163, 17, 0.15)'
            }}>
              <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: '#fca311', color: '#000', padding: '6px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '900' }}>PRODUCER 推薦方案</div>
              <h3 style={{ color: '#fca311', fontSize: '1.6rem', marginBottom: '0.5rem' }}>製作人 (Producer)</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>$599 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>TWD /月</span></div>

              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1.2rem' }}>🥩 解鎖專屬特權：</p>
                <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', fontSize: '1rem', lineHeight: '2.2' }}>
                  <li>🚀 <b>無限制</b> AI 聽診助理 (Suno 模式點數)</li>
                  <li>📤 <b>上傳個人分軌</b> 進場實戰測試</li>
                  <li>🃏 <b>高階實戰圖鑑</b> 與卡片掉落率 UP</li>
                  <li>🧪 解鎖 <b>空間、飽和度、母帶</b> 實驗室</li>
                  <li>📑 <b>DAW 參數一鍵打包</b> 成 Cheat Sheet</li>
                </ul>
              </div>
              <button style={{
                width: '100%', padding: '1.2rem', background: '#fca311', color: '#000',
                border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(252, 163, 17, 0.2)'
              }}>立即解鎖大師腦袋</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 底部引導 (Footer CTA) */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 80%)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', marginBottom: '1rem', color: '#f8fafc' }}>
          Li<span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.1em' }}>f</span>reedom STUDIO
        </h2>
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