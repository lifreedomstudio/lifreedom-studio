"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 升級版 Spatial Audio Comparer (含自動銷毀保護) ---
const SpatialAudioComparer = ({ title, description, badSrc, goodSrc, isMobile }: { title: string, description: string, badSrc: string, goodSrc: string, isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGood, setIsGood] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 💡 修正 1：處理音源切換與無縫時間對齊
    useEffect(() => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const wasPlaying = !audioRef.current.paused;

            audioRef.current.src = isGood ? goodSrc : badSrc;
            audioRef.current.load(); // 確保新音源載入
            audioRef.current.currentTime = currentTime;

            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            }
        }
    }, [isGood, badSrc, goodSrc]);

    // 💡 修正 2：核心安全保護 —— 元件卸載時強制閉嘴
    useEffect(() => {
        const audio = audioRef.current;
        return () => {
            if (audio) {
                audio.pause();
                audio.src = ""; // 釋放資源
            }
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log(e));
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
                    {isGood ? '✅ 已修復 (分層住)' : '❌ 修復前 (擠一樓)'}
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(點擊切換)</span>
                </button>
            </div>
            <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🧩 頻率重疊與分離視覺圖 ---
const FrequencyOverlapVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', width: '100%', margin: '2rem 0', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.03)', border: '1px dashed rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '1px' }}>BEFORE：頻率重疊（灰色糊成一塊）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '12px', background: '#475569', borderRadius: '4px' }}></div> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Guitar</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '12px', background: '#475569', borderRadius: '4px' }}></div> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Piano</span>
                </div>
            </div>
            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 'bold' }}>⚠️ 樂器擠在同一個窄小的房間，互相重疊遮蔽</div>
        </div>

        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(16,185,129,0.1)' }}>
            <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '1px' }}>AFTER：完美分離（各安其位）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '80px', height: '12px', background: '#f97316', borderRadius: '4px' }}></div>
                    <span style={{ color: '#fca311', fontSize: '0.85rem' }}>Guitar (1F)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '80px' }}></div>
                    <div style={{ width: '40px', height: '12px', background: '#10b981', borderRadius: '4px' }}></div>
                    <span style={{ color: '#86efac', fontSize: '0.85rem' }}>Piano (2F)</span>
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
            {isOpen && <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', animation: 'fadeIn 0.3s ease-out' }}>{children}</div>}
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

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(250, 204, 21, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                    <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                        <strong style={{ color: '#facc15' }}>📖 字彙定義：Voicing (聲部排列與音區分配)</strong><br /><br />
                        在編曲實戰中，它是指：<strong>決定每個樂器要在哪一個「八度」或「把位」發聲。</strong><br /><br />
                        即使彈的是完全相同的和弦，只要分配在不同的樓層，它們就能在頻率空間中和平共處，讓音樂瞬間產生 3D 立體感。
                    </p>
                </div>

                <FrequencyOverlapVisual isMobile={isMobile} />

                <section style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', textAlign: 'center', marginBottom: '4rem' }}>
                    <h3 style={{ color: '#facc15', fontSize: '1.3rem', marginBottom: '1.5rem' }}>🤔 製作人測驗：分配空間</h3>
                    <p style={{ color: '#f8fafc', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        如果現在兩個樂器（木吉他與鋼琴）都在中頻同時演奏，你會怎麼處理？
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        <button onClick={() => setSelectedDecision('A')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'A' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'A' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>A：全部一起擠在一樓彈</button>
                        <button onClick={() => setSelectedDecision('B')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'B' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'B' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>B：錯開時間先後出現</button>
                        <button onClick={() => setSelectedDecision('C')} style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'C' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'C' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>C：將鋼琴移高一個八度 (2F)</button>
                    </div>

                    {selectedDecision && (
                        <div style={{ marginTop: '2rem', animation: 'fadeInUp 0.3s' }}>
                            {selectedDecision === 'C' ? (
                                <div style={{ color: '#22c55e', fontSize: '1.15rem', fontWeight: 'bold', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'inline-block', textAlign: 'left' }}>
                                    🎯 正確。你已經進入了「空間分配」的思維。<br /><br />
                                    <span style={{ fontSize: '1.05rem', color: '#86efac', fontWeight: 'normal', lineHeight: '1.6', display: 'block' }}>
                                        🧠 核心高階認知：<br />
                                        你不是在做單純的排列，而是在進行系統設計 —— <strong style={{ color: '#fff' }}>讓頻率互相不需要競爭</strong>。當每個聲音都有各自的樓層，音樂自然乾淨，根本不需要大動 EQ。
                                    </span>
                                </div>
                            ) : (
                                <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'inline-block' }}>
                                    這只能暫時解決問題。真正的關鍵是頻率空間分配。
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 🎧 實戰 A/B 聽感對比 */}
                {selectedDecision === 'C' && (
                    <section style={{ marginBottom: '4rem', animation: 'fadeIn 0.5s' }}>
                        <SpatialAudioComparer
                            title="🎧 聽覺實驗：感受樓層的威力"
                            description="先聽修復前：吉他跟鋼琴都在 1F (C3) 頻段用力彈和弦，聽起來很悶糊。接著點擊切換：我們把鋼琴搬到 2F (Octave Up)，中間的泥巴感瞬間消失了！"
                            badSrc="/audio/piano-clash.mp3"
                            goodSrc="/audio/piano-octave-up.mp3"
                            isMobile={isMobile}
                        />
                    </section>
                )}

                <section style={{ textAlign: 'center', paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    <p style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        學會分配樓層後，讓我們進入實戰實驗室
                    </p>
                    <button
                        onClick={() => router.push('/courses/arrangement/voicing-lab')}
                        style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem', fontSize: isMobile ? '1.1rem' : '1.3rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        前往下一關：3. Voicing 空間分配實驗室 ➔
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