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
    window.scrollTo(0, 0);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* ================= 1️⃣ HERO 核心開場 ================= */}
      <div style={{
        minHeight: isMobile ? '80vh' : '90vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.7) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '6rem 1.5rem 2rem 1.5rem' : '4rem 2rem 2rem 2rem'
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio"
          style={{ height: isMobile ? '120px' : '150px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.4))' }}
        />

        <div style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.75rem' : '0.85rem', opacity: 0.9 }}>
          LIFREEDOM AUDITORY TRAINING SYSTEM
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 6vw, 3.8rem)', fontWeight: '900', margin: '0 auto 1.5rem auto', maxWidth: '850px',
          lineHeight: 1.3, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          你每天都在聽音樂，<br />
          但你真的<span style={{ color: '#38bdf8' }}>「聽懂」了嗎？</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '1.05rem' : '1.25rem', color: '#cbd5e1', maxWidth: '700px', marginBottom: '3rem',
          lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.8)', wordBreak: 'keep-all'
        }}>
          多數人聽到的是「感覺」<br />
          但創作者聽到的是<strong style={{ color: '#facc15' }}>「結構、空間、能量」</strong><br /><br />
          這裡會帶你跨過那條線。
        </p>

        {/* ================= 2️⃣ CTA 頂部轉換按鈕 ================= */}
        <div style={{ width: isMobile ? '100%' : 'auto', maxWidth: '400px' }}>
          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/step0'); }}
            style={{ width: '100%', padding: '1.3rem 3rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', fontSize: '1.15rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            🎮 開始第一個聽覺挑戰（免費）
          </button>
        </div>
      </div>

      {/* ================= 3️⃣ 🎮 STEP 0 盲測體驗引導 ================= */}
      <div style={{ padding: '2rem 1.5rem 4rem 1.5rem', background: '#020617', textAlign: 'center' }}>
        <div style={{
          maxWidth: '850px', margin: '0 auto', background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>
            👉 你真的聽得出差別嗎？
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.8', margin: 0 }}>
            兩段幾乎一模一樣的音樂旋律，中間只有一個極其微小的參數不同。<br />
            盲測開始——你能靠耳朵把它揪出來嗎？
          </p>
          <button
            onClick={() => router.push('/step0')}
            style={{ marginTop: '1.5rem', padding: '8px 24px', borderRadius: '50px', border: '1px solid #38bdf8', background: 'transparent', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            立即測試耳力 →
          </button>
        </div>
      </div>

      {/* ================= 4️⃣ 👥 適合對象（對號入座卡片） ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', background: '#070a13', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#facc15', fontWeight: '900', letterSpacing: '3px', fontSize: '0.85rem' }}>TARGET AUDIENCE</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', color: '#fff', margin: '1rem 0 3rem 0', fontWeight: '900' }}>這套訓練系統適合誰？</h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#020617', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 完全不懂音樂的愛好者</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>純粹想知道自己耳機裡每天播的流行歌，到底藏了哪些樂器結構與細節空間。</p>
            </div>
            <div style={{ background: '#020617', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 有在做音樂但遇到瓶頸的創作者</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>總覺得自己的音樂作品哪裡聽起來怪怪的，卻完全說不出是哪個頻率出問題。</p>
            </div>
            <div style={{ background: '#020617', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#a78bfa', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 頻繁使用 AI 音樂（如 Suno）的玩家</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>希望生成的音樂不再碰運氣，想讓 AI 作品具備商業音質的方向感與穩定度。</p>
            </div>
            <div style={{ background: '#020617', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#facc15', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 未來想進入專業製作的準音樂人</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>不想只死記硬背插件參數，渴望在進軟體實作前，先建立起硬核的聽覺判斷力。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5️⃣ 🧠 系統定義：Lifreedom 是什麼？ ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', background: '#020617', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>SYSTEM OVERVIEW</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', margin: '1rem 0 1.5rem 0', fontWeight: '900' }}>這不是一堂傳統的混音課</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            我們不教你死板地去調整特定的插件數值。<br />
            Lifreedom 是一套專門<strong style={{ color: '#fff' }}>「訓練你聽覺判斷能力」</strong>的心智系統。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>🚀 <strong>✔ 聽出差異</strong> —— 靠耳朵直覺咬合，而不是靠瞎猜</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>📦 <strong>✔ 理解聲音結構</strong> —— 看穿音頻的空間防線，而不是憑感覺</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>🎛️ <strong>✔ 做出決定</strong> —— 每一步都有清晰的科學邏輯，而不是亂試</div>
          </div>
        </div>
      </div>

      {/* ================= 6️⃣ 🤖 AI 區塊（降權與市場敘事升級） ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: 'linear-gradient(135deg, #0f172a, #020617)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1.2 }}>
            <span style={{ color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>AI MUSIC ERA</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '1rem 0 1.5rem 0', fontWeight: '900', lineHeight: 1.3 }}>
              當生成工具降低了門檻，<br />核心差距就在於「判斷力」
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              現在任何人都可以用 AI 快速做出一段完整的音樂（如 Suno 平台），但多數創作者隨後都會卡在兩件事上：<br /><br />
              <span style={{ color: '#fca5a5' }}>👉 1. 你不確定自己要什麼（風格/結構/情緒不夠精準）</span><br />
              <span style={{ color: '#fca5a5' }}>👉 2. 導出音訊後，不知道怎麼變更好（混音/空間/能量打架）</span><br /><br />
              這本質上不是 AI 工具的問題，而是<strong>聽覺判斷能力</strong>的問題。
            </p>
            <div style={{ background: 'rgba(167, 139, 250, 0.08)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #a78bfa', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <strong>💡 製作人心法：</strong><br />
              當你開始「聽得出來」之後，AI 才會真正變成你的生產力工具。我們提供輔助分析模組幫你定位方向，但最終扣下板機的決策，永遠來自你自己的耳朵。
            </div>
          </div>

          <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid #4c1d95', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '10px' }}>AI 生成的原始悶糊音訊 (Before)</div>
              <div style={{ height: '35px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 Q10,18 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" /></svg>
              </div>
              <div style={{ color: '#a78bfa', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>建立判斷力後修整的清澈參考 (After)</div>
              <div style={{ height: '55px', background: 'rgba(167, 139, 250, 0.05)', border: '1px solid #a78bfa', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}><path d="M0,10 L5,3 L10,17 L15,6 L20,14 L25,2 L30,18 L35,8 L40,12 L50,1 L60,19 L100,10" fill="none" stroke="#a78bfa" strokeWidth="2" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7️⃣ 🔓 未來解鎖（關卡期待感建立） ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: '#020617', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#22c55e', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>ROADMAP</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', color: '#fff', margin: '1rem 0 1.5rem 0', fontWeight: '900' }}>這只是起跑點</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            隨著你在平台上通關，你的大腦會像打怪升級一樣，逐步解鎖更深層的聲音維度：
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '650px', margin: '0 auto 3rem' }}>
            {['🥁 節奏律動 (Groove)', '🎼 結構編排 (Arrangement)', '🌌 空間配置 (Space / Voicing)', '🫁 動態控制 (Dynamics)', '🎛️ 物理混音 (Mixing)'].map((skill, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: '12px', fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 'bold' }}>
                {skill}
              </div>
            ))}
          </div>

          <p style={{ color: '#22c55e', fontSize: '1.15rem', fontWeight: 'bold', margin: 0 }}>
            ✨ 這一切都不需要靠死記硬背參數，而是你會真正「聽得出來」。
          </p>
        </div>
      </div>

      {/* ================= 8️⃣ CTA 底部最終一拳 ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, #111827 0%, #020617 80%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fff', marginBottom: '1rem', fontWeight: '900', maxWidth: '750px', margin: '0 auto 2rem' }}>
          開始訓練你的耳朵，建立受用終身的聽覺判斷力
        </h2>

        <button
          onClick={() => { window.scrollTo(0, 0); router.push('/step0'); }}
          style={{ display: 'inline-block', padding: '1.3rem 4.5rem', background: '#fff', color: '#020617', fontSize: '1.15rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)', marginBottom: '4rem' }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          🚀 立即開啟免費訓練
        </button>

        {/* ⚠️ 金流審查與服務合規宣告 */}
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
          <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.7' }}>
            <strong>學習服務說明：</strong> 本平台採用「階段解鎖式任務設計」與「盲測實作練習」作為教學引導機制，旨在提升學習動機與專注度，<strong>此機制並非隨機或機率型獲取內容（非抽卡或賭博性機制）</strong>。所有數位內容與訓練服務皆為教育用途，學習成果將因個人實際練習與投入程度而產生個體差異。
          </div>
        </div>

        {/* ================= 9️⃣ FOOTER 頁尾與法規宣告 ================= */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>使用條款</Link>
          <Link href="/privacy" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>隱私權政策</Link>
          <Link href="/refund" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>退款政策</Link>
          <a href="mailto:support@lifreedom.com" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>聯絡我們</a>
        </div>

        <div style={{ marginTop: '2rem', color: '#334155', fontSize: '0.8rem', fontFamily: 'monospace' }}>© 2026 Lifreedom Studio. All rights reserved.</div>
      </div>
    </div>
  );
}