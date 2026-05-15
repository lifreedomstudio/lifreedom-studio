"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🛠️ 1. 簡易頻譜示意圖 (RWD 修正版) ---
const SimplifiedSpectrumMap = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            // 🛠️ 修正：手機版減少內部水平 padding (從 30px 變成 10px)，讓圖案更大
            padding: isMobile ? '20px 10px' : '30px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <svg viewBox="0 0 450 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="20" y1="220" x2="430" y2="220" stroke="#334155" strokeWidth="2" />
                <text x="20" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">20Hz</text>
                <text x="160" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">1kHz</text>
                <text x="300" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">10kHz</text>
                <text x="430" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">20kHz</text>

                <rect x="20" y="20" width="100" height="190" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="70" y="115" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="20">地基層</text>

                <rect x="150" y="20" width="180" height="190" fill="rgba(250, 204, 21, 0.15)" stroke="#facc15" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="240" y="115" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="20">車禍層</text>

                <rect x="350" y="20" width="100" height="190" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="400" y="115" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="20">空氣層</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 2. 中頻車禍與人聲領空 (RWD 修正版) ---
const MidFreqJamVisual = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            // 🛠️ 修正：手機版減少內部水平 padding (從 25px 變成 10px)，讓圖案更大
            padding: isMobile ? '20px 10px' : '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <svg viewBox="0 0 1000 380" style={{ width: '100%', height: '360px', overflow: 'visible' }}>
                <text x="50" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">20Hz</text>
                <text x="250" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">300Hz</text>
                <text x="500" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">1kHz</text>
                <text x="750" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">2kHz</text>
                <text x="950" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">20kHz</text>

                <path d="M50,320 Q120,50 220,320 Z" fill="rgba(234, 88, 12, 0.1)" stroke="#ea580c" strokeWidth="2" />
                <text x="100" y="270" fill="#ea580c" fontWeight="bold" fontSize="18">Bass 跟大鼓</text>

                <path d="M250,320 Q450,20 750,320 Z" fill="rgba(250, 204, 21, 0.08)" stroke="#facc15" strokeWidth="2" />

                <g transform="translate(420, 50)">
                    <text x="0" y="0" fill="#facc15" fontWeight="bold" fontSize="18">木吉他、鋼琴 (300Hz - 2kHz)</text>
                    <text x="0" y="35" fill="#94a3b8" fontWeight="bold" fontSize="18">電吉他、弦樂 (300Hz - 1.5kHz)</text>
                </g>

                <rect x="350" y="160" width="300" height="120" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="4" rx="15" />
                <text x="500" y="215" textAnchor="middle" fill="#f8fafc" fontWeight="900" fontSize="24">人聲領空 (Vocal)</text>
                <text x="500" y="245" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="18">300Hz - 2kHz</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 3. 檢查流程 Timeline ---
const MaskingTimeline = ({ isMobile }: { isMobile: boolean }) => {
    const steps = [
        { title: "1. 選色 (Tone)", desc: "挑選本質就互補的音色，減少後製負擔。", pos: "top" },
        { title: "2. 佈局 (Layout)", desc: "將樂器分配到不同音域口袋 (公寓層次)。", pos: "bottom" },
        { title: "3. 節奏 (Rhythm)", desc: "確保樂器間節奏互補而非互相碰撞。", pos: "top" },
        { title: "4. 修整 (Trim)", desc: "刪除多餘裝飾，只保留最重要的敘事線。", pos: "bottom" },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '400px', marginTop: '4rem' }}>
            {!isMobile && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', background: 'rgba(16, 185, 129, 0.2)', transform: 'translateY(-1.5px)' }} />}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? '3rem' : '0' }}>
                {steps.map((step, i) => (
                    <div key={i} style={{
                        flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: step.pos === 'top' ? 'flex-start' : 'flex-end',
                        height: isMobile ? 'auto' : '100%'
                    }}>
                        {!isMobile && <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%', width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', border: '4px solid #020617', boxShadow: '0 0 15px #10b981', zIndex: 2 }} />}

                        <div style={{
                            textAlign: 'center', width: isMobile ? '100%' : '200px',
                            marginBottom: step.pos === 'top' ? '60px' : '0',
                            marginTop: step.pos === 'bottom' ? '60px' : '0',
                            background: isMobile ? 'rgba(255,255,255,0.03)' : 'transparent',
                            padding: isMobile ? '1.5rem' : '0',
                            borderRadius: '12px'
                        }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '10px' }}>{step.title}</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 📖 課程主頁面 ---
export default function MaskingTraining() {
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
            // 🛠️ 修正：整體頁面水平 padding 手機版從 1rem 降為更窄的 0.5rem，釋放空間
            padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 03 : AIRSPACE MANAGEMENT
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Masking 頻率遮蔽預防
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        別讓樂器在窄門前擠成一團。編曲的核心不是加法，而是為每個靈魂找到專屬的領空。
                    </p>
                </header>

                {/* 🎬 卡門比喻卡片 */}
                <section style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: isMobile ? '2rem 1.5rem' : '4rem', borderRadius: '32px', marginBottom: '5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem' }}>別讓樂器「卡門」了！</h2>
                    <p style={{ fontSize: '1.3rem', color: '#cbd5e1', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
                        「多個同頻樂器同時彈奏，就像五個人同時要過一個門，最後誰也沒辦法真的過去，觀眾也抓不到重點。」
                    </p>
                </section>

                {/* 1. 簡易頻譜示意圖 */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1.5rem' }}>1. 簡易頻譜示意圖</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '20px' }}><strong style={{ color: '#ea580c' }}>🟠 地基層 (20-100Hz):</strong> 大鼓與 Bass 的地盤。</li>
                                <li style={{ marginBottom: '20px' }}><strong style={{ color: '#facc15' }}>🟡 車禍層 (300-2kHz):</strong> 吉他、鋼琴、人聲。</li>
                                <li><strong style={{ color: '#38bdf8' }}>🔵 空氣層 (7k-20kHz):</strong> 弦樂高音與銅鈸。</li>
                            </ul>
                        </div>
                        <div style={{ flex: 1.2, width: '100%' }}>
                            {/* 🛠️ 修正：將 isMobile 傳入圖表元件，使其能 conditionally 調整內部 padding */}
                            <SimplifiedSpectrumMap isMobile={isMobile} />
                        </div>
                    </div>
                </section>

                {/* 2. 中頻車禍現場 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1.5rem' }}>2. 中頻車禍現場與人聲領空</h2>
                    {/* 🛠️ 修正：將 isMobile 傳入圖表元件，使其能 conditionally 調整內部 padding */}
                    <MidFreqJamVisual isMobile={isMobile} />
                    <p style={{ marginTop: '2rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        在編曲階段，就要讓樂器換把位 (Voicing) 或留白，把翡翠綠區塊讓給人聲！
                    </p>
                </section>

                {/* 3. 檢查流程 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2rem', color: '#10b981', textAlign: 'center' }}>Masking 檢查流程</h2>
                    <MaskingTimeline isMobile={isMobile} />
                </section>

                {/* 💡 留白的力量 */}
                <section style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ fontSize: '4rem', fontWeight: '900', color: '#10b981' }}>30%</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>建議留白比例</h3>
                    <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        編曲不是要把空間填滿，而是要把空間留出來。留出呼吸空間，主唱才會顯得高貴。
                    </p>
                </section>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '5rem' }}>
                    <button
                        onClick={() => router.push('/courses/arrangement/dynamics-training')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem', fontSize: isMobile ? '1.1rem' : '1.4rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        最後一關：4. Dynamics 動態與曲式 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}