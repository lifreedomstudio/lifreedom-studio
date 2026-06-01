"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 升級版 Spatial Audio Comparer ---
const SpatialAudioComparer = ({ title, description, badSrc, goodSrc, isMobile }: { title: string, description: string, badSrc: string, goodSrc: string, isMobile: boolean }) => {
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

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    <div style={{
                        height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.3s',
                        background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: isGood ? '#86efac' : '#475569',
                        border: isGood ? '1px solid #22c55e' : '1px solid transparent'
                    }}>
                        🟢 2F: 鋼琴
                    </div>
                    <div style={{
                        height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.3s',
                        background: !isGood ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: !isGood ? '#fca5a5' : '#bae6fd',
                        border: !isGood ? '1px solid #ef4444' : '1px solid transparent'
                    }}>
                        {isGood ? '🔵 1F: 吉他' : '🔴 1F: 鋼琴+吉他'}
                    </div>
                </div>

                <button
                    onClick={togglePlay}
                    style={{
                        background: isPlaying ? '#eab308' : '#facc15', color: '#020617', border: 'none',
                        width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0,
                        fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)', transition: 'background 0.2s'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                    onClick={() => setIsGood(!isGood)}
                    style={{
                        flex: 1, padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%',
                        background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isGood ? '#86efac' : '#fca5a5',
                        transition: 'all 0.2s', fontSize: isMobile ? '1rem' : '1.1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    {isGood ? '✅ 修復後 (分層住)' : '❌ 修復前 (擠一樓)'}
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(點擊切換)</span>
                </button>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🧩 殺手級功能：頻率重疊與分離視覺圖 (Text-based Visual) ---
const FrequencyOverlapVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', width: '100%', margin: '2rem 0', boxSizing: 'border-box' }}>
        {/* Before 混濁車禍 */}
        <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.03)', border: '1px dashed rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '1px' }}>BEFORE：頻率重疊（灰色糊成一塊）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '12px', background: '#475569', borderRadius: '4px' }}></div> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Guitar</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '12px', background: '#475569', borderRadius: '4px' }}></div> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Piano</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '12px', background: '#475569', borderRadius: '4px' }}></div> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Synth</span>
                </div>
            </div>
            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 'bold' }}>⚠️ 樂器擠在同一個窄小的房間，互相重疊遮蔽</div>
        </div>

        {/* After 完美分離 */}
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(16,185,129,0.1)' }}>
            <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '1px' }}>AFTER：完美分離（各安其位）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '12px', background: '#f97316', borderRadius: '4px' }}></div>
                    <div style={{ width: '80px' }}></div>
                    <span style={{ color: '#fca311', fontSize: '0.85rem' }}>Guitar (中低)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px' }}></div>
                    <div style={{ width: '40px', height: '12px', background: '#10b981', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px' }}></div>
                    <span style={{ color: '#86efac', fontSize: '0.85rem' }}>Piano (中高)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '80px' }}></div>
                    <div style={{ width: '40px', height: '12px', background: '#38bdf8', borderRadius: '4px' }}></div>
                    <span style={{ color: '#93c5fd', fontSize: '0.85rem' }}>Synth (高頻)</span>
                </div>
            </div>
            <div style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 'bold' }}>✨ 建立各自的聲學樓層，音色乾淨且立體</div>
        </div>
    </div>
);

// --- 🔽 可展開的深潛知識區 ---
const ExpandableSection = ({ title, children, isMobile }: { title: string, children: React.ReactNode, isMobile: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
                }}
            >
                <span>{title}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

// --- 🎸 吉他指板 CSS 示意圖 ---
const GuitarFretboard = () => (
    <div style={{ position: 'relative', width: '100%', height: '220px', background: '#111827', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '0', marginBottom: '1rem' }}>
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
                </div>
            ))}
        </div>
        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '0%', width: '25%', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px', boxSizing: 'border-box' }}>
            <span style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>紅色警戒 (0-3格)</span>
        </div>
        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '33.33%', width: '33.33%', background: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '8px', boxSizing: 'border-box' }}>
            <span style={{ color: '#86efac', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>綠色安全 (5-8格)</span>
        </div>
    </div>
);

// --- 🎹 鋼琴鍵盤 CSS 示意圖 ---
const PianoKeyboard = () => {
    const whiteKeys = Array.from({ length: 21 });
    const blackKeyIndices = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19];
    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '20px', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', background: '#f8fafc', borderRadius: '6px', border: '2px solid #0f172a', overflow: 'hidden' }}>
                {whiteKeys.map((_, i) => (
                    <div key={`white-${i}`} style={{ flex: 1, borderRight: '1px solid #cbd5e1', position: 'relative' }}>
                        {i % 7 === 0 && <span style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold' }}>C{3 + i / 7}</span>}
                    </div>
                ))}
                {blackKeyIndices.map(i => (
                    <div key={`black-${i}`} style={{ position: 'absolute', left: `calc(${(i + 1) * (100 / 21)}% - ${(100 / 21) * 0.3}%)`, width: `${(100 / 21) * 0.6}%`, height: '60%', background: '#0f172a', borderRadius: '0 0 4px 4px', zIndex: 2 }}></div>
                ))}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(7 / 21) * 100}%`, background: 'rgba(239, 68, 68, 0.25)', border: '3px solid #ef4444', borderLeft: 'none', zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px' }}><span style={{ background: 'rgba(0,0,0,0.8)', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>🔴 吉他激戰區 (C3)</span></div>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(7 / 21) * 100}%`, right: 0, background: 'rgba(34, 197, 94, 0.25)', border: '3px solid #22c55e', borderRight: 'none', zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15px' }}><span style={{ background: 'rgba(0,0,0,0.8)', color: '#86efac', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>🟢 鍵盤推薦降落區 (C4)</span></div>
            </div>
        </div>
    );
};

export default function VoicingTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* 🔵 SECTION 1：核心精神 */}
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-block', border: '1px solid rgba(250, 204, 21, 0.5)', background: 'rgba(250, 204, 21, 0.1)',
                        color: '#facc15', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold'
                    }}>
                        PHASE 02 : THE SPATIAL PUZZLE
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Voicing
                    </h1>

                    <div style={{ background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '2rem', borderRadius: '16px', marginTop: '2rem' }}>
                        {/* ⚡ 痛點秒殺句升級 */}
                        <p style={{ color: '#fff', fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: '900', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                            「你不是不會編曲，你只是把所有樂器都塞進同一層樓。」
                        </p>
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', color: '#facc15', margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>
                            👉 這章你只需要學會：讓聲音住進不同的樓層。
                        </h2>
                    </div>
                </header>

                <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2rem', textAlign: 'center' }}>
                    當你疊了木吉他、電吉他、鋼琴、合成器... 聽起來卻像一團泥巴？<br />
                    <strong style={{ color: '#ef4444' }}>因為它們全部擠在同一層樓 (中頻)。</strong>
                </p>

                {/* 📖 Voicing 專業定義 */}
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(250, 204, 21, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                    <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                        <strong style={{ color: '#facc15' }}>📖 字彙定義：Voicing (聲部排列與音區分配)</strong><br /><br />
                        在編曲實戰中，它是指：<strong>決定每個樂器要在哪一個「八度」或「把位」發聲。</strong><br /><br />
                        即使彈的是完全相同的和弦，只要分配在不同的樓層，它們就能在頻率空間中和平共處，讓音樂瞬間產生 3D 立體感。
                    </p>
                </div>

                {/* 🧩 殺手級理解工具：頻率重疊視覺圖 */}
                <FrequencyOverlapVisual isMobile={isMobile} />

                {/* 🎮 SECTION 1.5：空間決策互動 */}
                <section style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', textAlign: 'center', marginBottom: '4rem' }}>
                    <h3 style={{ color: '#facc15', fontSize: '1.3rem', marginBottom: '1.5rem' }}>🤔 製作人測驗：分配空間</h3>
                    <p style={{ color: '#f8fafc', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        如果現在三個樂器（Guitar, Piano, Synth）都在中頻同時演奏，你會怎麼處理？
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        <button onClick={() => setSelectedDecision('A')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'A' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'A' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>A：全部一起彈</button>
                        <button onClick={() => setSelectedDecision('B')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'B' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'B' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>B：錯開時間出現</button>
                        <button onClick={() => setSelectedDecision('C')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'C' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'C' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>C：錯開「音高區域與位置」</button>
                    </div>

                    {/* 🔥 答題反饋：升級為高階系統設計思維 */}
                    {selectedDecision && (
                        <div style={{ marginTop: '2rem', animation: 'fadeInUp 0.3s' }}>
                            {selectedDecision === 'C' ? (
                                <div style={{ color: '#22c55e', fontSize: '1.15rem', fontWeight: 'bold', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'inline-block', textAlign: 'left' }}>
                                    🎯 正確。你已經開始進入「空間編曲」思維。<br /><br />
                                    <span style={{ fontSize: '1.05rem', color: '#86efac', fontWeight: 'normal', lineHeight: '1.6', display: 'block' }}>
                                        🧠 核心高階認知：<br />
                                        你不是在做單純的排列，而是在進行系統設計——<strong style={{ color: '#fff' }}>「讓頻率互相不需要競爭」</strong>。當每個聲音都有各自的頻率樓層，音樂自然乾淨，根本不需要大動 EQ 砍聲音。
                                    </span>
                                </div>
                            ) : (
                                <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'inline-block' }}>
                                    還停留在「時間控制」。真正的關鍵是空間分配。
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 🟢 SECTION 2：Audio Clash (直覺體驗) */}
                {selectedDecision === 'C' && (
                    <section style={{ marginBottom: '4rem', animation: 'fadeIn 0.5s' }}>
                        <SpatialAudioComparer
                            title="🎧 聽覺實驗：感受樓層的威力"
                            description="先聽修復前：吉他跟鋼琴都在 1F (C3) 頻段用力彈和弦，聽起來很悶。接著點擊切換：我們把鋼琴搬到 2F (Octave Up)，吉他則用 Capo 錯開指板位置。"
                            badSrc="/audio/voicing-clash.mp3"
                            goodSrc="/audio/voicing-fixed.mp3"
                            isMobile={isMobile}
                        />
                    </section>
                )}

                {/* 🔵 SECTION 3：深潛知識庫 */}
                <section style={{ marginBottom: '5rem', opacity: selectedDecision === 'C' ? 1 : 0.4, pointerEvents: selectedDecision === 'C' ? 'auto' : 'none', transition: 'opacity 0.5s' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        想要更深入？點擊探索實作技巧
                    </h3>

                    <ExpandableSection title="🎸 吉他手必看：別在同一個房間刷和弦" isMobile={isMobile}>
                        <GuitarFretboard />
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem', marginTop: '10px' }}>
                            <strong>迷思：</strong>以為木吉他跟電吉他「音色不同」就不會打架。<br />
                            <strong>真相：</strong>只要都在 0-3 格發聲，在頻譜儀上就是同一坨頻率！<br />
                            木吉他刷和弦時，電吉他請用 Capo 移高，不要擠在同一個房間。
                        </p>
                    </ExpandableSection>

                    <ExpandableSection title="🎹 鍵盤手必看：滑順的 Voice Leading" isMobile={isMobile}>
                        <PianoKeyboard />
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
                            把鋼琴移高八度後，不要每個和弦都彈「原位」，那聽起來會一直跳躍。尋找共同音，讓手指移動越少越好。
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '8px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
                                <div style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '12px' }}>❌ 永遠彈原位 (C ➜ F)</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}><span>最高音： G</span> <span style={{ color: '#ef4444' }}>➜</span> <span>C</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}><span>中間音： E</span> <span style={{ color: '#ef4444' }}>➜</span> <span>A</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}><span>最低音： C</span> <span style={{ color: '#ef4444' }}>➜</span> <span>F</span></div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '15px', borderRadius: '8px', border: '1px dashed rgba(34, 197, 94, 0.3)' }}>
                                <div style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '12px' }}>✅ 轉位連接 (C ➜ F/C)</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}><span>最高音： G</span> <span style={{ color: '#10b981' }}>➜</span> <span>A</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}><span>中間音： E</span> <span style={{ color: '#10b981' }}>➜</span> <span>F</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(250, 204, 21, 0.2)', padding: '4px 8px', borderRadius: '4px' }}><span>最低音： C</span> <span style={{ color: '#facc15' }}>➜</span> <span style={{ color: '#facc15', fontWeight: 'bold' }}>C</span></div>
                                </div>
                            </div>
                        </div>
                    </ExpandableSection>

                    <ExpandableSection title="💼 編曲的企業管理學" isMobile={isMobile}>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                            就像一間公司，如果木吉他已經負責「第一線銷售（用力刷和弦）」，電吉他跟鋼琴就該負責「研發（彈奏單音或分散和弦）」。<br /><br />
                            <strong>工作職位與手法的錯開</strong>，才是創造無敵 3D 聽感的終極秘密。
                        </p>
                    </ExpandableSection>
                </section>

                {/* 🟣 SECTION 5：下一章 CTA */}
                <section style={{ textAlign: 'center', paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    <p style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        錯開樓層後，接下來要處理「隱形的衝突」
                    </p>
                    <button
                        onClick={() => router.push('/courses/arrangement/masking-training')}
                        style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem', fontSize: isMobile ? '1.1rem' : '1.3rem',
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

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}