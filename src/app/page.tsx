"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 ❶ 打臉瞬間（Shock Moment）轉換引擎播放器 ---
const HomeInteractivePlayer = ({ isMobile }: { isMobile: boolean }) => {
  const [activeVersion, setActiveVersion] = useState<'A' | 'B'>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userChoice, setUserChoice] = useState<'A' | 'B' | 'not_heard' | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }
  };

  const handleSwitchVersion = (version: 'A' | 'B') => {
    if (version === activeVersion) return;
    setActiveVersion(version);

    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const wasPlaying = !audioRef.current.paused;

      audioRef.current.src = version === 'A' ? '/audio/demo-mono-masked.mp3' : '/audio/demo-lcr-wide.mp3';
      audioRef.current.load();
      audioRef.current.currentTime = currentTime;

      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const handleReveal = (choice: 'A' | 'B' | 'not_heard') => {
    setUserChoice(choice);
    setShowAnswer(true);
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>
        SHOCK MOMENT
      </span>
      <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900' }}>
        🎧 你真的聽得出來嗎？
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.8', margin: '0 0 2rem 0' }}>
        請戴上耳機，分別切換播放音軌 A 與音軌 B。<br />
        然後回答底下的問題：
      </p>

      {/* 播放器 UI */}
      <div style={{ background: '#020617', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>

        <button
          onClick={handleTogglePlay}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: isPlaying ? '#ef4444' : 'rgba(255,255,255,0.1)', color: isPlaying ? '#fff' : '#ef4444', border: isPlaying ? 'none' : '2px solid #ef4444', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, transition: 'all 0.2s' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div style={{ display: 'flex', width: '100%', background: '#0f172a', padding: '6px', borderRadius: '12px', gap: '10px' }}>
          <button
            onClick={() => handleSwitchVersion('A')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', background: activeVersion === 'A' ? '#475569' : 'transparent', color: activeVersion === 'A' ? '#fff' : '#64748b' }}
          >
            音軌 A
          </button>
          <button
            onClick={() => handleSwitchVersion('B')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', background: activeVersion === 'B' ? '#38bdf8' : 'transparent', color: activeVersion === 'B' ? '#020617' : '#64748b' }}
          >
            音軌 B
          </button>
        </div>
      </div>

      <audio ref={audioRef} src="/audio/demo-mono-masked.mp3" onEnded={() => setIsPlaying(false)} />

      {/* 決策打臉區 */}
      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>

        {!showAnswer ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              ❓ 哪一個版本聽起來比較清晰、層次分明？
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                onClick={() => handleReveal('A')}
                style={{ padding: '1rem 2.5rem', background: 'transparent', color: '#f87171', border: '2px solid #ef4444', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}
              >
                版本 A 比較清晰
              </button>
              <button
                onClick={() => handleReveal('B')}
                style={{ padding: '1rem 2.5rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}
              >
                版本 B 比較清晰
              </button>
              <button
                onClick={() => handleReveal('not_heard')}
                style={{ padding: '1rem 2.5rem', background: 'transparent', color: '#fbbf24', border: '2px solid #fbbf24', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}
              >
                我聽不出來
              </button>
            </div>

            {/* 🟢 修正 1：移除虛假數據，換上高級的「誠實透明」文案建立信任 */}
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: 'bold', lineHeight: '1.6' }}>
              💡 這是一個還在測試中的聽覺訓練系統。<br />
              如果你覺得這種訓練方式對你有幫助，歡迎在後續留下 Email，我會優先通知你完整版上線。
            </p>
          </div>
        ) : (
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid #38bdf8', padding: '2rem', borderRadius: '16px', textAlign: 'left', animation: 'fadeIn 0.4s ease-out' }}>

            {/* 3 種精準回饋 */}
            {userChoice === 'A' && (
              <h4 style={{ color: '#ef4444', fontWeight: '900', fontSize: '1.3rem', margin: '0 0 12px 0' }}>
                ❌ 選錯 👉「這就是問題」
              </h4>
            )}
            {userChoice === 'B' && (
              <h4 style={{ color: '#10b981', fontWeight: '900', fontSize: '1.3rem', margin: '0 0 12px 0' }}>
                🎯 選對 👉「你有潛力，但還不穩」
              </h4>
            )}
            {userChoice === 'not_heard' && (
              <h4 style={{ color: '#fbbf24', fontWeight: '900', fontSize: '1.3rem', margin: '0 0 12px 0' }}>
                💡 聽不出 👉「這正是你卡關的原因」
              </h4>
            )}

            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.8', margin: 0 }}>
              這兩段音樂的軌道結構完全一樣。在<strong>版本 A</strong> 中，所有樂器都擠在正中央，造成了聲學上的「頻率遮蔽」，導致主唱的聲音被吉他死死悶住。<br /><br />
              而在<strong>版本 B</strong> 中，我們僅僅把兩把吉他往左右兩側拉開（LCR 空間佈局）。中間通道一清空，主唱瞬間釋放。聽不出差別或選錯，代表你的大腦目前正被遮蔽效應欺騙，這正是你做出來的作品總是混濁、沒層次的元兇！
            </p>

            <button
              onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
              style={{ marginTop: '2rem', width: '100%', padding: '15px', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)' }}
            >
              立刻開啟免費耳朵洗禮 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => { clearTimeout(timeoutId); timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 150); };
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    window.scrollTo(0, 0);
    return () => { window.removeEventListener('resize', checkMobile); clearTimeout(timeoutId); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* ================= HERO 核心開場 ================= */}
      <div style={{
        minHeight: isMobile ? '85vh' : '90vh',
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
          LIFREEDOM | AI EAR TRAINING FOR MUSICIANS
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

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto', maxWidth: '700px' }}>
          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
            style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.3rem 2.5rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            我有「創作者耳朵」嗎？(免費挑戰)
          </button>

          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/courses'); }}
            style={{ flex: 1, padding: isMobile ? '1.2rem' : '1.3rem 2.5rem', background: 'transparent', color: '#38bdf8', border: '2px solid #38bdf8', fontSize: '1.1rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            查看「聽覺系統」訓練藍圖
          </button>
        </div>
      </div>

      {/* ================= 2️⃣ 🎧 首頁直接試聽組件 ================= */}
      <div style={{ padding: '2rem 1.5rem 5rem 1.5rem', background: '#020617' }}>
        <HomeInteractivePlayer isMobile={isMobile} />
      </div>

      {/* ================= 🚀 3️⃣ 升級：EQ 體驗 CTA (痛點解決 + 驗證自我升級版) ================= */}
      <div style={{
        padding: isMobile ? '4rem 1.5rem' : '5rem 2rem',
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <span style={{ color: '#f59e0b', fontWeight: '900', letterSpacing: '3px', fontSize: '0.85rem' }}>
            INTERACTIVE EQ LAB
          </span>

          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.4rem',
            fontWeight: '900',
            color: '#fff',
            margin: '1rem 0 1rem 0',
            lineHeight: 1.3
          }}>
            多數人調 EQ 是「用猜的」
          </h2>

          <p style={{
            color: '#ef4444',
            fontSize: '1.2rem',
            lineHeight: '1.8',
            marginBottom: '2rem',
            fontWeight: 'bold'
          }}>
            👉 這就是為什麼越調越糊
          </p>

          <p style={{
            color: '#cbd5e1',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            marginBottom: '1.5rem'
          }}>
            在這個實驗室裡，你將會<strong style={{ color: '#fff' }}>第一次「真的聽到」</strong>什麼叫：
          </p>

          <div style={{
            color: '#cbd5e1',
            fontSize: '1.1rem',
            lineHeight: '2',
            marginBottom: '2.5rem',
            textAlign: 'left',
            display: 'inline-block',
            background: 'rgba(0,0,0,0.3)',
            padding: '1.5rem 2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            • 🪵 <strong>悶</strong>（200 – 400Hz）<br />
            • 🔪 <strong>刺</strong>（2 – 4kHz）<br />
            • ✨ <strong>空氣感</strong>（10kHz）
          </div>

          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/eq-game'); }}
            style={{
              padding: '1.4rem 3rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#020617',
              fontWeight: '900',
              fontSize: '1.2rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <span>🎛️ 30 秒測試：你找得到讓人聲變乾淨的頻率嗎？ ➔</span>
          </button>
        </div>
      </div>

      {/* ================= 4️⃣ 狠毒痛點對號入座區 ================= */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '6rem 2rem', background: '#070a13', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ color: '#ef4444', fontWeight: '900', letterSpacing: '3px', fontSize: '0.85rem' }}>CORE PROBLEM</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '1rem 0 2rem 0', fontWeight: '900', lineHeight: '1.4' }}>
            你不是不會做音樂，<br /><span style={{ color: '#ef4444' }}>你是「根本聽不出問題在哪」</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem' }}>這也就是為什麼，不論你換多貴的軟體，你的作品依然卡在同一個業餘水平：</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '550px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 'bold' }}>
              ❌ EQ 一直調，但越調越糊
            </div>
            <div style={{ background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 'bold' }}>
              ❌ 覺得差不多，但別人一聽就知道有問題
            </div>
            <div style={{ background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 'bold' }}>
              ❌ 每次都靠運氣，而不是判斷
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5️⃣ 適合對象 ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#facc15', fontWeight: '900', letterSpacing: '3px', fontSize: '0.85rem' }}>TARGET AUDIENCE</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', color: '#fff', margin: '1rem 0 3rem 0', fontWeight: '900' }}>這套訓練系統適合誰？</h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#070a13', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 完全不懂音樂的愛好者</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>純粹想知道自己耳機裡每天播的流行歌，到底藏了哪些樂器結構與細節空間。</p>
            </div>
            <div style={{ background: '#070a13', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 有在做音樂但遇到瓶頸的創作者</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>總覺得自己的音樂作品哪裡聽起來怪怪的，卻完全說不出是哪個頻率出問題。</p>
            </div>
            <div style={{ background: '#070a13', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#a78bfa', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 頻繁使用 AI 音樂（如 Suno）的玩家</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>希望生成的音樂不再碰運氣，想讓 AI 作品具備商業音質的方向感與穩定度。</p>
            </div>
            <div style={{ background: '#070a13', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <h4 style={{ color: '#facc15', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>✔ 未來想進入專業製作的準音樂人</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>不想只死記硬背插件參數，渴望在進軟體實作前，先建立起硬核的聽覺判斷力。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 6️⃣ 轉變承諾（Transformation）能力型語言 ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', background: '#070a13', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>TRANSFORMATION PROMISE</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', margin: '1rem 0 1.5rem 0', fontWeight: '900' }}>這不是一堂傳統的混音課</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            我們不強迫你死記硬背插件的固定參數。<br />
            落實核心特訓後，<strong>在踏入軟體實作的那一秒起：</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '550px', margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.15)', boxShadow: 'inset 0 4px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✔</span> 聽出刺耳的頻率（不用猜）
            </div>
            <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✔</span> 知道問題在哪（不是亂試）
            </div>
            <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✔</span> 做出有根據的混音決策
            </div>

            <div style={{ color: '#a78bfa', fontSize: '1.05rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '10px' }}>
              🤖 <strong>獨家支援：</strong> 內建 AI 混音聽診助理，當你卡關時，隨時為你的實戰工程進行深度分析抓漏。
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7️⃣ AI 區塊 ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: 'linear-gradient(135deg, #0f172a, #020617)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1.2 }}>
            <span style={{ color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>AI MUSIC ERA</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '1rem 0 1.5rem 0', fontWeight: '900', lineHeight: 1.3 }}>
              當生成工具降低了門檻，<br />核心差距就在於「判斷力」
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              現在任何人都可以用 AI 快速做出一段完整的音樂，但多數創作者隨後都會卡在兩件事上：<br /><br />
              <span style={{ color: '#fca5a5' }}>👉 1. 你不確定自己要什麼（風格/結構/情緒不夠精準）</span><br />
              <span style={{ color: '#fca5a5' }}>👉 2. 導出音訊後，不知道怎麼變更好（混音/空間/能量打架）</span><br /><br />
              這本質上不是 AI 工具的問題，而是<strong>聽覺判斷能力</strong>的問題。
            </p>
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

      {/* ================= 8️⃣ ROADMAP ================= */}
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

      {/* ================= 9️⃣ 最終 CTA ================= */}
      <div style={{ padding: isMobile ? '5rem 1.5rem' : '8rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, #111827 0%, #020617 80%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', color: '#fff', marginBottom: '1rem', fontWeight: '900', maxWidth: '850px', margin: '0 auto 1.5rem', lineHeight: 1.3 }}>
          🎧 你現在的耳朵，其實漏掉了 80% 的聲音細節
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3.5rem', fontWeight: 'bold' }}>
          要不要試著把它們找回來？
        </p>

        <button
          onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
          style={{ display: 'inline-block', padding: '1.4rem 5rem', background: '#fff', color: '#020617', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(255,255,255,0.3)', marginBottom: '4rem', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          🚀 立即開啟免費訓練
        </button>

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
          <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.7' }}>
            <strong>學習服務說明：</strong> 本平台採用「階段解鎖式任務設計()」與「盲測實作練習」作為教學引導機制，旨在提升學習動機與專注度，<strong>此機制並非隨機或機率型獲取內容（非抽卡或賭博性機制）</strong>。所有數位內容與訓練服務皆為教育用途，學習成果將因個人實際練習與投入程度而產生個體差異。
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>使用條款</Link>
          <Link href="/privacy" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>隱私權政策</Link>
          <Link href="/refund" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>退款政策</Link>
          <a href="mailto:xlifreedom305x@gmail.com" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>聯絡我們</a>
        </div>
        <div style={{ marginTop: '2rem', color: '#334155', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          © 2026 LiFreedom Studio. All rights reserved.
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}