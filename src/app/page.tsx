"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- 🎧 首頁直接試聽組件 ---
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
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1rem' : '3.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
      <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem' }}>
        SHOCK MOMENT
      </span>
      <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900' }}>
        🎧 盲測盲聽：親耳驗證你的聽覺盲區
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

        <div style={{ display: 'flex', width: '100%', background: '#0f172a', padding: '6px', borderRadius: '12px', gap: '10px', boxSizing: 'border-box' }}>
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
                style={{ padding: '1rem 2rem', background: 'transparent', color: '#f87171', border: '2px solid #ef4444', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                版本 A 比較清晰
              </button>
              <button
                onClick={() => handleReveal('B')}
                style={{ padding: '1rem 2rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                版本 B 比較清晰
              </button>
              <button
                onClick={() => handleReveal('not_heard')}
                style={{ padding: '1rem 2rem', background: 'transparent', color: '#fbbf24', border: '2px solid #fbbf24', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                我聽不出來
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: 'bold', lineHeight: '1.6' }}>
              💡 這是一個還在測試中的聽覺訓練系統。<br />
              如果你覺得這種訓練方式對你有幫助，歡迎在後續留下 Email，我會優先通知你完整版上線。
            </p>
          </div>
        ) : (
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid #38bdf8', padding: '2rem', borderRadius: '16px', textAlign: 'left', animation: 'fadeIn 0.4s ease-out' }}>
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

      {/* ================= ❶ HERO 核心開場 ================= */}
      <div style={{
        minHeight: isMobile ? 'auto' : '85vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.8) 0%, #020617 100%), url('/console-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        padding: isMobile ? '5rem 1rem 3rem 1rem' : '4rem 2rem 4rem 2rem', boxSizing: 'border-box'
      }}>
        <img
          src="/lifreedom-logo-removebg-preview.png"
          alt="Lifreedom Studio"
          style={{ height: isMobile ? '100px' : '130px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.4))' }}
        />

        <div style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: isMobile ? '0.75rem' : '0.85rem', opacity: 0.9 }}>
          LIFREEDOM | AUDIO PERCEPTION LAB
        </div>

        {/* 【主標題】 */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)', fontWeight: '900', margin: '0 auto 1rem auto', maxWidth: '850px',
          lineHeight: 1.3, background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(0,0,0,0.5)', wordBreak: 'keep-all'
        }}>
          你真的「聽得到」音樂的差別嗎？
        </h1>
        <p style={{ color: '#38bdf8', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold', marginBottom: '3rem', margin: '0 0 3rem 0' }}>
          （不是喜不喜歡，是你能不能分辨）
        </p>

        {/* 【副標題結構框】 */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '1.5rem 1.2rem' : '2rem 2.5rem', borderRadius: '24px', textAlign: 'left', marginBottom: '3.5rem', maxWidth: '600px', width: '100%', boxSizing: 'border-box', boxShadow: 'inset 0 4px 30px rgba(0,0,0,0.3)' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.2rem', letterSpacing: '1px' }}>
            大多數人其實聽不出來：
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '14px', color: '#cbd5e1', fontSize: '1.05rem' }}>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}><span style={{ color: '#ef4444' }}>•</span> 為什麼有些歌很清楚，有些很糊</li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}><span style={{ color: '#ef4444' }}>•</span> 為什麼人聲有時候會被蓋住</li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}><span style={{ color: '#ef4444' }}>•</span> 為什麼調了 EQ 還是沒變好</li>
          </ul>
          <div style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.05rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem', textAlign: 'center' }}>
            💡 這不是設備問題，是耳朵還沒被訓練
          </div>
        </div>

        {/* 【CTA 主按鈕】 */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
            style={{ width: '100%', padding: isMobile ? '1.2rem' : '1.4rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            👉 7 題測試，看看你能不能聽出差異
          </button>
          {/* 【降低壓力補一句】 */}
          <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
            不用樂理、不用設備，只用耳朵
          </p>
        </div>
      </div>

      {/* ================= ❷ 🎧 互動試聽模組 ================= */}
      <div style={{ padding: '2rem 1rem 5rem 1rem', background: '#020617', boxSizing: 'border-box' }}>
        <HomeInteractivePlayer isMobile={isMobile} />
      </div>

      {/* ================= ❸ 中段：建立共鳴區塊 ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: '#070a13', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '650px', width: '100%', textAlign: 'left' }}>
          <span style={{ color: '#ef4444', fontWeight: '900', letterSpacing: '3px', fontSize: '0.85rem', display: 'block', textAlign: 'center', marginBottom: '1rem' }}>EMPATHY RESONANCE</span>
          <h2 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fff', margin: '0 0 2rem 0', fontWeight: '900', lineHeight: '1.4', textAlign: 'center' }}>
            你可能有過這些狀況：
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.7', background: 'rgba(0,0,0,0.2)', padding: '2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>•</span> 覺得自己做的音樂哪裡怪怪的，但說不出來</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>•</span> 調整了很久，結果還是一樣糊</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>•</span> 聽別人的作品覺得很好，但不知道差在哪</div>
          </div>

          <p style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '2.5rem', textAlign: 'center', letterSpacing: '1px' }}>
            👉 問題不是你不會，是你「還聽不到」
          </p>
        </div>
      </div>

      {/* ================= ❹ AI 時代痛點 (完美回歸) ================= */}
      <div style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', background: 'linear-gradient(135deg, #0f172a, #020617)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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

      {/* ================= ❺ 轉折與第二次 CTA 按鈕 ================= */}
      <div style={{
        padding: isMobile ? '5rem 1.5rem' : '6rem 2rem',
        background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', margin: '0 0 0.8rem 0' }}>當你開始聽得到：</p>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.6rem', fontWeight: '900', color: '#fff', margin: '0 0 3.5rem 0', letterSpacing: '2px' }}>
            你才有辦法做出選擇
          </h2>

          {/* CTA 第二次按鈕 */}
          <button
            onClick={() => { window.scrollTo(0, 0); router.push('/courses/ear-opening/intro'); }}
            style={{
              padding: '1.2rem 4rem', background: 'transparent', color: '#38bdf8',
              border: '2px solid #38bdf8', borderRadius: '50px', fontSize: '1.2rem',
              fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', maxWidth: '400px'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            👉 開始測試（免費）
          </button>
        </div>
      </div>

      {/* ================= ❻ 底部（微轉換面板與版權聲明） ================= */}
      <div style={{ padding: isMobile ? '4rem 1rem 6rem 1rem' : '5rem 2rem 7rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto 5rem auto', background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: isMobile ? '2rem 1.2rem' : '2.5rem', borderRadius: '24px', textAlign: 'left', boxSizing: 'border-box', boxShadow: '0 15px 40px rgba(0,0,0,0.4)' }}>
          <h4 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '1px' }}>
            測完後，你會知道：
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', color: '#cbd5e1', fontSize: '1rem', fontWeight: 'bold' }}>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✔</span> 你現在的耳朵等級</li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✔</span> 你卡在哪一種聲音問題</li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✔</span> 你能不能進入下一步訓練</li>
          </ul>
        </div>

        {/* 法律條款說明 */}
        <div style={{ maxWidth: '750px', margin: '0 auto 3rem auto', textAlign: 'left', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.7' }}>
            <strong>學習服務說明：</strong> 本平台採用「階段解鎖式任務設計」與「盲測實作練習」作為教學引導機制，旨在提升學習動機與專注度，<strong>此機制並非隨機或機率型獲取內容（非抽卡或賭博性機制）</strong>。所有數位內容與訓練服務皆為教育用途，學習成果將因個人實際練習與投入程度而產生個體差異。
          </div>
        </div>

        {/* 底部導航鏈結 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>使用條款</Link>
          <Link href="/privacy" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>隱私權政策</Link>
          <Link href="/refund" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>退款政策</Link>
          <a href="mailto:xlifreedom305x@gmail.com" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>聯絡我們</a>
        </div>
        <div style={{ marginTop: '2.5rem', color: '#334155', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
          © 2026 LiFreedom Studio. All rights reserved.
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}