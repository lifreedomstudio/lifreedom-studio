"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 升級版 Spatial Audio Comparer (空間感視覺化) ---
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

                {/* 🏢 視覺化樓層 UI (產品化升級) */}
                <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
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

const GuitarVisual = () => (
    <div style={{ background: '#111827', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '5px 15px', borderRadius: '6px', fontSize: '0.9rem' }}>0-3格 (吉他1專用)</div>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#86efac', padding: '5px 15px', borderRadius: '6px', fontSize: '0.9rem' }}>5格以上 (用Capo錯開)</div>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>木吉他刷和弦時，電吉他請用 Capo 移高，不要擠在同一個房間。</p>
    </div>
);

const VoicingVisual = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '8px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
            <div style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px' }}>❌ 永遠彈原位 (C ➜ F)</div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>手移動很大，聽起來像在跳躍，斷裂感重。</p>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '15px', borderRadius: '8px', border: '1px dashed rgba(34, 197, 94, 0.3)' }}>
            <div style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px' }}>✅ 轉位連接 (C ➜ F/C)</div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>尋找「共同音」(C)，手指移動最小，聽起來滑順像唱歌。</p>
        </div>
    </div>
);


export default function VoicingTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 🎮 Mini 互動狀態
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
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* 🔵 SECTION 1：核心精神 (感覺) */}
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
                        <p style={{ color: '#facc15', fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
                            這章你只需要記住一句話：
                        </p>
                        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '1px' }}>
                            「每個聲音，都有自己的樓層」
                        </h2>
                    </div>
                </header>

                <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '3rem', textAlign: 'center' }}>
                    當你疊了木吉他、電吉他、鋼琴、合成器... 聽起來卻像一團泥巴？<br />
                    <strong style={{ color: '#ef4444' }}>因為它們全部擠在同一層樓 (中頻)。</strong>
                </p>

                {/* 🎮 SECTION 1.5：空間決策互動 (超關鍵認知轉換) */}
                <section style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', textAlign: 'center', marginBottom: '4rem' }}>
                    <h3 style={{ color: '#facc15', fontSize: '1.3rem', marginBottom: '1.5rem' }}>🤔 製作人測驗：分配空間</h3>
                    <p style={{ color: '#f8fafc', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        如果現在有三個中頻樂器（Guitar, Piano, Synth），你會怎麼處理？
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        <button
                            onClick={() => setSelectedDecision('A')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'A' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'A' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            A：全部在同一層（結果：❌ 混濁）
                        </button>
                        <button
                            onClick={() => setSelectedDecision('B')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'B' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'B' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            B：分開時間出現（Groove 思維）
                        </button>
                        <button
                            onClick={() => setSelectedDecision('C')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedDecision === 'C' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedDecision === 'C' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            C：分開樓層（Voicing 思維）
                        </button>
                    </div>

                    {selectedDecision && (
                        <div style={{ marginTop: '2rem', animation: 'fadeInUp 0.3s' }}>
                            {selectedDecision === 'C' ? (
                                <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'inline-block' }}>
                                    🎯 正解！你已正式從「時間思維」進入「空間思維」。<br />往下聽聽看這個決策的威力。
                                </div>
                            ) : (
                                <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    這是中頻空間的問題。答案是 C：分開樓層。
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

                {/* 🔵 SECTION 3：深潛知識庫 (展開式) */}
                <section style={{ marginBottom: '5rem', opacity: selectedDecision === 'C' ? 1 : 0.4, pointerEvents: selectedDecision === 'C' ? 'auto' : 'none', transition: 'opacity 0.5s' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        想要更深入？點擊探索實作技巧
                    </h3>

                    <ExpandableSection title="🎸 吉他手必看：別在同一個房間刷和弦" isMobile={isMobile}>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
                            <strong>迷思：</strong>以為木吉他跟電吉他「音色不同」就不會打架。<br />
                            <strong>真相：</strong>只要都在 0-3 格發聲，在頻譜儀上就是同一坨頻率！
                        </p>
                        <GuitarVisual />
                    </ExpandableSection>

                    <ExpandableSection title="🎹 鍵盤手必看：滑順的 Voice Leading" isMobile={isMobile}>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
                            把鋼琴移高八度後，不要每個和弦都彈「原位」，那聽起來會一直跳躍。尋找共同音，讓手指移動越少越好。
                        </p>
                        <VoicingVisual />
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