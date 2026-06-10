"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 首頁專屬互動組件：LCR 空間盲測播放器 ---
const HomeInteractivePlayer = ({ isMobile }: { isMobile: boolean }) => {
  const [activeVersion, setActiveVersion] = useState<'A' | 'B'>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userChoice, setUserChoice] = useState<'heard' | 'not_heard' | null>(null);

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

  const handleReveal = (choice: 'heard' | 'not_heard') => {
    setUserChoice(choice);
    setShowAnswer(true);
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#fff', margin: '0 0 1rem 0', fontWeight: '900' }}>
        🎧 如果你聽不出差別，那就是問題所在
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.8', margin: '0 0 2rem 0' }}>
        這兩段音樂的樂器與旋律<strong style={{ color: '#fff' }}>完全一模一樣</strong>。<br />
        請戴上耳機，先聽版本 A，再切換到版本 B。
      </p>

      {/* 播放器 UI */}
      <div style={{ background: '#020617', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>

        <button
          onClick={handleTogglePlay}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: isPlaying ? '#fca311' : 'rgba(255,255,255,0.1)', color: isPlaying ? '#020617' : '#fca311', border: isPlaying ? 'none' : '2px solid #fca311', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, transition: 'all 0.2s' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div style={{ display: 'flex', width: '100%', background: '#0f172a', padding: '6px', borderRadius: '12px', gap: '10px' }}>
          <button
            onClick={() => handleSwitchVersion('A')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', background: activeVersion === 'A' ? '#475569' : 'transparent', color: activeVersion === 'A' ? '#fff' : '#64748b' }}
          >
            版本 A (原始)
          </button>
          <button
            onClick={() => handleSwitchVersion('B')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', background: activeVersion === 'B' ? '#38bdf8' : 'transparent', color: activeVersion === 'B' ? '#020617' : '#64748b' }}
          >
            版本 B (調整後)
          </button>
        </div>
      </div>

      <audio ref={audioRef} src="/audio/demo-mono-masked.mp3" onEnded={() => setIsPlaying(false)} />

      {/* 答案揭曉區 (加入參與感與社會認同) */}
      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>

        {!showAnswer ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              🤔 聽完 A 與 B 之後，你覺得主唱跟吉他發生了什麼變化？
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                onClick={() => handleReveal('heard')}
                style={{ padding: '1rem 2rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                👂 我有聽到明顯差別
              </button>
              <button
                onClick={() => handleReveal('not_heard')}
                style={{ padding: '1rem 2rem', background: 'transparent', color: '#fca311', border: '2px solid #fca311', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(252, 163, 17, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                🤷‍♂️ 老實說，我聽不出來
              </button>
            </div>
            {/* 社會認同 (Social Proof) */}
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, fontWeight: 'bold' }}>
              🔥 目前已有 1,428 人完成測試，其中 <span style={{ color: '#fca311' }}>63% 的人第一次完全聽不出差別</span>
            </p>
          </div>
        ) : (
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid #38bdf8', padding: '2rem', borderRadius: '16px', textAlign: 'left', animation: 'fadeIn 0.4s ease-out' }}>
            <h4 style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 12px 0' }}>
              {userChoice === 'heard' ? '🎉 敏銳的耳朵！空間分配的真相是：' : '💡 沒關係！這是因為頻率遮蔽。真相是：'}
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.8', margin: 0 }}>
              在<strong>版本 A</strong> 中，所有樂器都擠在正中央。這會造成嚴重的「頻率遮蔽」，導致主唱的聲音被吉他稍微悶住、覆蓋，吉他本身的細節也聽不清楚。<br /><br />
              而在<strong>版本 B</strong> 中，我們只是把兩把吉他往左右兩側拉開（LCR 空間佈局）。中間的通道一清空，主唱瞬間就變得立體清晰，兩側的吉他細節也自然有了呼吸的空間！<br /><br />
              這就是為什麼你需要建立「聽覺系統」。你的耳朵其實漏掉了許多頻率與空間的細節，讓我們把它們找回來。
            </p>
            <button
              onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
              style={{ marginTop: '2rem', width: '100%', padding: '15px', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              進入正式聽覺特訓 ➔
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

      {/* ================= 1️⃣ HERO 核心開場 ================= */}
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

      {/* ================= 🚀 3️⃣ EQ 體驗 CTA (鉤子強化版) ================= */}
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
            fontSize: isMobile ? '1.6rem' : '2.4rem',
            fontWeight: '900',
            color: '#fff',
            margin: '1rem 0 1.5rem 0',
            lineHeight: 1.3
          }}>
            你真的知道「悶」、「刺」、「亮」是什麼聲音嗎？
          </h2>

          <p style={{
            color: '#94a3b8',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            marginBottom: '3rem'
          }}>
            多數人只是用形容詞在猜聲音。<br />
            在這個 EQ 實驗室裡，你可以<strong style={{ color: '#fff' }}>親手掃過頻率</strong>，<br />
            直接聽見每個區域對人聲與吉他的破壞與美化。
          </p>

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
            <span>🎛 30 秒內，你能找出讓人聲變清晰的頻率嗎？</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 'bold' }}>多數人都找不到，你可以嗎？ ➔</span>
          </button>
        </div>
      </div>

      {/* ================= 4️⃣ 👥 適合對象 ================= */}
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
            Lifreedom 是一套專為音樂人打造，專門<strong style={{ color: '#fff' }}>「訓練聽覺判斷力與空間感知」</strong>的 AI 陪練系統。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '550px', margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>🚀 <strong>✔ 聽出差異</strong> —— 靠耳朵直覺咬合，而不是靠瞎猜</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>📦 <strong>✔ 理解聲音結構</strong> —— 看穿音頻的空間防線，而不是憑感覺</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>🎛️ <strong>✔ 做出決定</strong> —— 每一步都有清晰的科學邏輯，而不是亂試</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '5px' }}>
              🤖 <strong>✔ AI 聽診輔助</strong> —— 專屬助理隨時為你的混音抓漏，提供修改建議
            </div>
          </div>
        </div>
      </div>

      {/* ================= 6️⃣ 🤖 AI 區塊 ================= */}
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
            <div style={{ background: 'rgba(167, 139, 250, 0.08)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #a78bfa', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <strong>💡 製作人心法：</strong><br />
              我們內建了專屬的 <strong>AI 混音聽診助理</strong>，當你卡關時，隨時上傳 DAW 截圖或發問，它會幫你指出頻率盲點。但記住，AI 只是導航，最終扣下板機的決策，永遠來自你訓練過的耳朵。
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

      {/* ================= 7️⃣ 🔓 未來解鎖 ================= */}
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

      {/* ================= 8️⃣ 最終 CTA (心理拉力強化版) ================= */}
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
            <strong>學習服務說明：</strong> 本平台採用「階段解鎖式任務設計」與「盲測實作練習」作為教學引導機制，旨在提升學習動機與專注度，<strong>此機制並非隨機或機率型獲取內容（非抽卡或賭博性機制）</strong>。所有數位內容與訓練服務皆為教育用途，學習成果將因個人實際練習與投入程度而產生個體差異。
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