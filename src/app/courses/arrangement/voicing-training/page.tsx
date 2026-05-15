"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎸 1. 原創無版權：吉他指板 CSS 示意圖 ---
const GuitarFretboard = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#111827', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' }}>
            {/* 琴弦 */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', padding: '20px 0', zIndex: 1 }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ width: '100%', height: i < 3 ? '2px' : '3px', background: '#475569', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }}></div>
                ))}
            </div>
            {/* 琴格線條 */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
                {[...Array(13)].map((_, i) => (
                    <div key={i} style={{ width: '4px', height: '100%', background: '#94a3b8', borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #64748b' }}></div>
                ))}
            </div>
            {/* 標記點 */}
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '25%', width: '15px', height: '15px', background: '#e2e8f0', borderRadius: '50%', zIndex: 2 }}></div>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '40%', width: '15px', height: '15px', background: '#e2e8f0', borderRadius: '50%', zIndex: 2 }}></div>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '55%', width: '15px', height: '15px', background: '#e2e8f0', borderRadius: '50%', zIndex: 2 }}></div>

            {/* 色塊區域 */}
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '20px', width: '22%', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
                <span style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>紅色警戒 (0-3格)</span>
            </div>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '38%', width: '22%', background: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
                <span style={{ color: '#86efac', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>綠色安全 (5-8格)</span>
            </div>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '70%', right: '20px', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid #3b82f6', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
                <span style={{ color: '#93c5fd', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>藍色高空 (9格+)</span>
            </div>
        </div>
    );
};

// --- 🎹 2. 原創無版權：實體鋼琴鍵盤 CSS 示意圖 ---
const PianoKeyboard = () => {
    // 建立 3 個八度的白鍵 (C3 到 B5，共 21 個白鍵)
    const whiteKeys = Array.from({ length: 21 });
    // 黑鍵的位置規律 (C-D, D-E, F-G, G-A, A-B 之間有黑鍵)
    const blackKeyIndices = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19];

    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '20px' }}>

            {/* 鍵盤本體容器 */}
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', background: '#f8fafc', borderRadius: '6px', border: '2px solid #0f172a', overflow: 'hidden' }}>

                {/* 白鍵 */}
                {whiteKeys.map((_, i) => (
                    <div key={`white-${i}`} style={{ flex: 1, borderRight: '1px solid #cbd5e1', position: 'relative' }}>
                        {/* 標示 C 鍵 (C3, C4, C5) */}
                        {i % 7 === 0 && (
                            <span style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                C{3 + i / 7}
                            </span>
                        )}
                    </div>
                ))}

                {/* 黑鍵 */}
                {blackKeyIndices.map(i => (
                    <div key={`black-${i}`} style={{
                        position: 'absolute',
                        // 每個白鍵寬度約為 100% / 21。黑鍵放在白鍵交界處。
                        left: `calc(${(i + 1) * (100 / 21)}% - ${(100 / 21) * 0.3}%)`,
                        width: `${(100 / 21) * 0.6}%`,
                        height: '60%',
                        background: '#0f172a',
                        borderRadius: '0 0 4px 4px',
                        zIndex: 2
                    }}></div>
                ))}

                {/* --- 色塊標記區域 --- */}

                {/* 紅色激戰區 (C3 到 B3，前 7 個白鍵) */}
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(7 / 21) * 100}%`,
                    background: 'rgba(239, 68, 68, 0.25)', border: '3px solid #ef4444', borderLeft: 'none',
                    zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px', pointerEvents: 'none'
                }}>
                    <span style={{ background: 'rgba(0,0,0,0.8)', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        🔴 吉他激戰區 (C3)
                    </span>
                </div>

                {/* 綠色安全區 (C4 到 B5，後 14 個白鍵) */}
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: `${(7 / 21) * 100}%`, right: 0,
                    background: 'rgba(34, 197, 94, 0.25)', border: '3px solid #22c55e', borderRight: 'none',
                    zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px', pointerEvents: 'none'
                }}>
                    <span style={{ background: 'rgba(0,0,0,0.8)', color: '#86efac', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        🟢 鍵盤推薦降落區 (C4-C5)
                    </span>
                </div>

            </div>
        </div>
    );
};


// --- 📖 課程主頁面 ---
export default function VoicingTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-block', border: '1px solid rgba(250, 204, 21, 0.5)', background: 'rgba(250, 204, 21, 0.1)',
                        color: '#facc15', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold'
                    }}>
                        PHASE 02 : THE SPATIAL PUZZLE
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff', wordBreak: 'keep-all' }}>
                        Voicing 把位與音區
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        中頻生存指南。當吉他與鋼琴都想當主角時，如何運用物理空間讓它們和平共處？
                    </p>
                </header>

                {/* 🎯 破關目標卡片 */}
                <div style={{
                    background: 'linear-gradient(90deg, rgba(250, 204, 21, 0.1) 0%, rgba(0,0,0,0) 100%)',
                    borderLeft: '4px solid #facc15', padding: '1.5rem', borderRadius: '0 16px 16px 0',
                    marginBottom: '4rem', boxSizing: 'border-box'
                }}>
                    <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                        <span>🎯</span> 本章破關目標
                    </h3>
                    <p style={{ color: '#fef08a', margin: 0, lineHeight: '1.6' }}>
                        理解「八度 (Octave)」與「和弦轉位 (Inversion)」的魔法。學會把黏在一起的樂器拆開，創造出寬廣且透明的編曲層次。
                    </p>
                </div>

                {/* 內容區塊 1：吉他指板 */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#facc15', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        1. 吉他指板：三色生存區塊
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        如果兩把吉他同時擠在同一個把位刷弦，聲音會糊成一團。我們必須把指板切分成三個物理空間：
                    </p>

                    {/* 呼叫自製無版權圖解 */}
                    <div style={{ marginBottom: '2rem' }}>
                        <GuitarFretboard />
                    </div>

                    <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ef4444' }}>🔴 紅色警戒區 (0-3格)：</strong> 溫暖厚實的地基。若吉他 1 已在此刷和弦，吉他 2 請勿進入。</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#22c55e' }}>🟢 綠色安全區 (5-8格)：</strong> 絕佳的對位空間。使用 Capo 或封閉和弦，讓清脆的高頻點綴流出。</li>
                        <li><strong style={{ color: '#3b82f6' }}>🔵 藍色高空區 (9格+)：</strong> 穿透力極強。適合 Solo 或琶音，完全避開中頻混亂。</li>
                    </ul>
                </section>

                {/* 內容區塊 2：鋼琴鍵盤 */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#facc15', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        2. 鋼琴鍵盤：尋找安全降落點
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        木吉他的開放和弦通常落在 <strong style={{ color: '#fca5a5' }}>C3 八度音域（紅色區塊）</strong>。如果此時鋼琴也在這個區域彈奏厚實的柱式和弦 (Block Chords)，主唱的位子就會被完全塞滿。
                    </p>

                    {/* 呼叫自製無版權 鋼琴鍵盤圖解 */}
                    <div style={{ marginBottom: '2rem' }}>
                        <PianoKeyboard />
                    </div>

                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
                        <strong style={{ color: '#86efac', display: 'block', marginBottom: '10px' }}>✅ 最佳解法：Octave Up (移高八度)</strong>
                        當吉他佔據了左側的紅色激戰區時，請讓鍵盤手直接將右手移到 <strong style={{ color: '#86efac' }}>右側的綠色安全區 (C4-C5)</strong> 彈奏轉位和弦。這樣吉他在一樓，鋼琴在二樓，層次瞬間打開！
                    </p>

                </section>

                {/* 💡 混音助理提示 */}
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed #38bdf8', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '5rem' }}>
                    <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🤖 來自混音助理的進階提示</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                        即便編曲已經盡力錯開，有時因為樂器本身的泛音太豐富，還是會干擾主唱。這時候我們就會在混音階段拿出大殺器：<strong>「動態 EQ (Dynamic EQ)」</strong> 或 <strong>「中低頻切除 (Low Cut)」</strong>，這也是我們之後混音課程的重點！
                    </p>
                </div>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '3rem' }}>
                    <button
                        onClick={() => router.push('/courses/arrangement/masking-training')}
                        style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 3.5rem', fontSize: isMobile ? '1.1rem' : '1.3rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        前往下一關：3. Masking 頻率遮蔽預防 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}