"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 A/B 試聽播放器元件 ---
const AudioComparer = ({ title, description, badSrc, goodSrc, isMobile, badLabel, goodLabel }: { title: string, description: string, badSrc: string, goodSrc: string, isMobile: boolean, badLabel: string, goodLabel: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGood, setIsGood] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const wasPlaying = !audioRef.current.paused;

            audioRef.current.src = isGood ? goodSrc : badSrc;
            audioRef.current.currentTime = currentTime;

            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            }
        }
    }, [isGood, badSrc, goodSrc]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div style={{
            background: 'rgba(20, 20, 30, 0.8)', padding: isMobile ? '1.5rem' : '2rem',
            borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '2rem', boxSizing: 'border-box'
        }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>{title}</h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{description}</p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1rem' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        background: isPlaying ? '#eab308' : '#facc15', color: '#020617', border: 'none',
                        width: isMobile ? '100%' : '60px', height: isMobile ? '50px' : '60px', borderRadius: isMobile ? '12px' : '50%',
                        fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)', transition: 'background 0.2s'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '6px', flex: 1 }}>
                    <button
                        onClick={() => setIsGood(false)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                            background: !isGood ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: !isGood ? '#fca5a5' : '#64748b',
                            borderBottom: !isGood ? '2px solid #ef4444' : '2px solid transparent',
                            transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        ❌ {badLabel}
                    </button>
                    <button
                        onClick={() => setIsGood(true)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                            background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: isGood ? '#86efac' : '#64748b',
                            borderBottom: isGood ? '2px solid #22c55e' : '2px solid transparent',
                            transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        ✅ {goodLabel}
                    </button>
                </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🎸 吉他指板 CSS 示意圖 ---
const GuitarFretboard = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#111827', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '0' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', zIndex: 1, padding: '20px 0' }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ width: '100%', height: i < 3 ? '1px' : '2px', background: '#94a3b8', boxShadow: '0 1px 1px rgba(0,0,0,0.5)' }}></div>
                ))}
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 2 }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ flex: 1, borderRight: '2px solid #cbd5e1', position: 'relative' }}>
                        {[2, 4, 6, 8].includes(i) && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '50%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}></div>
                        )}
                        {i === 11 && (
                            <>
                                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '50%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}></div>
                                <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '50%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}></div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '0%', width: '25%', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px', boxSizing: 'border-box' }}>
                <span style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>紅色警戒 (0-3格)</span>
            </div>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '33.33%', width: '33.33%', background: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px', boxSizing: 'border-box' }}>
                <span style={{ color: '#86efac', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>綠色安全 (5-8格)</span>
            </div>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '66.66%', width: '33.33%', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid #3b82f6', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px', boxSizing: 'border-box' }}>
                <span style={{ color: '#93c5fd', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>藍色高空 (9格+)</span>
            </div>
        </div>
    );
};

// --- 🎹 鋼琴鍵盤 CSS 示意圖 ---
const PianoKeyboard = () => {
    const whiteKeys = Array.from({ length: 21 });
    const blackKeyIndices = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19];

    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '20px' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', background: '#f8fafc', borderRadius: '6px', border: '2px solid #0f172a', overflow: 'hidden' }}>
                {whiteKeys.map((_, i) => (
                    <div key={`white-${i}`} style={{ flex: 1, borderRight: '1px solid #cbd5e1', position: 'relative' }}>
                        {i % 7 === 0 && (
                            <span style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold' }}>C{3 + i / 7}</span>
                        )}
                    </div>
                ))}
                {blackKeyIndices.map(i => (
                    <div key={`black-${i}`} style={{
                        position: 'absolute', left: `calc(${(i + 1) * (100 / 21)}% - ${(100 / 21) * 0.3}%)`,
                        width: `${(100 / 21) * 0.6}%`, height: '60%', background: '#0f172a', borderRadius: '0 0 4px 4px', zIndex: 2
                    }}></div>
                ))}
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(7 / 21) * 100}%`,
                    background: 'rgba(239, 68, 68, 0.25)', border: '3px solid #ef4444', borderLeft: 'none',
                    zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px', pointerEvents: 'none'
                }}>
                    <span style={{ background: 'rgba(0,0,0,0.8)', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>🔴 吉他激戰區 (C3)</span>
                </div>
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: `${(7 / 21) * 100}%`, right: 0,
                    background: 'rgba(34, 197, 94, 0.25)', border: '3px solid #22c55e', borderRight: 'none',
                    zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px', pointerEvents: 'none'
                }}>
                    <span style={{ background: 'rgba(0,0,0,0.8)', color: '#86efac', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>🟢 鍵盤推薦降落區 (C4-C5)</span>
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
                        破解迷思：<strong style={{ color: '#fff' }}>「樂理上的轉位」不等於「聲學上的錯位」</strong>。學會運用 Capo 與八度音，把黏在一起的頻率物理性拆開。
                    </p>
                </div>

                {/* 內容區塊 1：吉他指板 */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#facc15', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        1. 吉他指板：別在同一個房間刷和弦
                    </h2>

                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '15px', borderRadius: '0 12px 12px 0', marginBottom: '2rem' }}>
                        <p style={{ color: '#fca5a5', margin: 0, lineHeight: '1.6', fontSize: '1.05rem', fontWeight: 'bold' }}>
                            ⚠️ 新手致命錯誤：在 0-3 格彈奏轉位和弦。
                        </p>
                        <p style={{ color: '#cbd5e1', margin: '5px 0 0 0', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            很多新手知道兩把吉他不能彈一樣的，於是吉他 1 彈 C，吉他 2 彈 C/E (轉位)。但在混音台的頻譜上看，它們都在「紅色警戒區」發聲，根本是同一坨頻率，完全沒有錯開！
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <GuitarFretboard />
                    </div>

                    <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ef4444' }}>🔴 紅色警戒區 (0-3格)：</strong> 吉他 1 專屬的溫暖地基。如果吉他 1 在此刷開放和弦，吉他 2 請勿進入。</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#22c55e' }}>🟢 綠色安全區 (5-8格)：</strong> 吉他 2 的最佳解法！使用 <strong>Capo (移調夾)</strong> 夾在第 5 格，或者直接使用高把位封閉和弦。讓清脆的高頻點綴流出，這才是真正的物理頻率錯開。</li>
                    </ul>

                    {/* 🎧 吉他聽覺實戰 */}
                    <AudioComparer
                        title="🎧 聽覺實驗：Capo 物理錯位術"
                        description="請聽聽看兩把吉他都在低把位刷和弦的混濁感。接著切換版本，感受吉他 2 夾上 Capo 來到『綠色安全區』後，兩把吉他瞬間立體起來的 3D 感！"
                        badSrc="/audio/guitar-clash.mp3"
                        goodSrc="/audio/guitar-capo.mp3"
                        badLabel="低把位打架 (糊)"
                        goodLabel="Capo 高把位 (清脆)"
                        isMobile={isMobile}
                    />
                </section>

                {/* 內容區塊 2：鋼琴鍵盤 */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#facc15', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        2. 鋼琴鍵盤：移高八度 + 轉位輔助
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        木吉他的開放和弦通常落在 <strong style={{ color: '#fca5a5' }}>C3 八度音域（紅色區塊）</strong>。如果此時鋼琴也在這個區域彈奏厚實的柱式和弦，主唱的位子就會被完全塞滿。
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <PianoKeyboard />
                    </div>

                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '20px', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h4 style={{ color: '#86efac', fontSize: '1.1rem', marginBottom: '10px' }}>🎹 正確的雙管齊下策略：</h4>
                        <ol style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0, paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#fff' }}>第一步：Octave Up (移高八度避車禍)。</strong><br />
                                鍵盤手請整個人往右坐！將右手移到 C4-C5 的「綠色安全區」。吉他在一樓，鋼琴去二樓，這能直接解決頻率重疊。
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>第二步：和弦轉位 (Inversion 解決呆板)。</strong><br />
                                移高八度後，為了讓鋼琴的旋律線聽起來像在「滑順地唱歌」而不是跳來跳去，我們才需要運用樂理上的「轉位」，讓最高音（Top Note）平穩流動。
                            </li>
                        </ol>
                    </div>

                    {/* 🎧 鋼琴聽覺實戰 */}
                    <AudioComparer
                        title="🎧 聽覺實驗：鋼琴的二樓視角"
                        description="注意聽吉他與鋼琴疊在一起的感覺。在完美版中，我們將鋼琴的 MIDI 往上提了一個八度 (Octave Up)，這首歌的空間感瞬間就被撐開了。"
                        badSrc="/audio/piano-clash.mp3"
                        goodSrc="/audio/piano-octave-up.mp3"
                        badLabel="C3 互搶地盤"
                        goodLabel="鋼琴升級二樓"
                        isMobile={isMobile}
                    />
                </section>

                {/* 🎧 吉他聽覺實戰 (你原本的程式碼) */}
                <AudioComparer
                    title="🎧 聽覺實驗：Capo 物理錯位術"
                    description="請聽聽看兩把吉他都在低把位刷和弦的混濁感。接著切換版本，感受吉他 2 夾上 Capo 來到『綠色安全區』後，兩把吉他瞬間立體起來的 3D 感！"
                    badSrc="/audio/guitar-clash.mp3"
                    goodSrc="/audio/guitar-capo.mp3"
                    badLabel="低把位打架 (糊)"
                    goodLabel="Capo 高把位 (清脆)"
                    isMobile={isMobile}
                />

                {/* 👇 新增的：編曲的企業管理學卡片 */}
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8', padding: '1.5rem', borderRadius: '0 16px 16px 0', marginTop: '2rem', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        💼 企業管理學：不只錯開音區，更要錯開「工作」
                    </h4>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                        就像一間公司，如果所有人都在做「第一線業務（用力刷和弦）」，卻沒有人負責「研發產品（彈奏單音或分散和弦）」，整間公司就會空轉，聽眾也會覺得資訊量爆炸。
                        <br /><br />
                        <strong>這就是為什麼吉他 2 移到高把位後，絕對不能再跟著刷和弦！</strong> 木吉他 1 已經把「節奏地基」鋪滿了，電吉他 2 的任務應該轉為「精緻包裝」，改用 <strong style={{ color: '#fff' }}>分散和弦 (Arpeggio)</strong> 或單音來點綴。這種「工作職位的錯開」，才是創造無敵 3D 聽感的終極秘密。
                    </p>
                </div>

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