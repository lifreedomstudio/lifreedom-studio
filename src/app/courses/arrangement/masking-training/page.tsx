"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🛠️ 1. 簡易頻譜示意圖 (補完色塊範圍) ---
const SimplifiedSpectrumMap = () => {
    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 450 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="20" y1="220" x2="430" y2="220" stroke="#334155" strokeWidth="2" />
                <text x="20" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">20Hz</text>
                <text x="160" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">1kHz</text>
                <text x="300" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">10kHz</text>
                <text x="430" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist">20kHz</text>

                {/* 🟠 地基層 (Dash線圈出範圍) */}
                <rect x="20" y="20" width="100" height="190" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="70" y="115" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="18">地基層</text>

                {/* 🟡 車禍層 (Dash線圈出範圍) */}
                <rect x="150" y="20" width="180" height="190" fill="rgba(250, 204, 21, 0.15)" stroke="#facc15" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="240" y="115" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="18">車禍層</text>

                {/* 🔵 空氣層 (Dash線圈出範圍) */}
                <rect x="350" y="20" width="80" height="190" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeDasharray="5 5" strokeWidth="2" rx="12" />
                <text x="390" y="115" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="18">空氣層</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 2. 中頻車禍與人聲領空 (修正文字分離) ---
const MidFreqJamVisual = () => {
    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <svg viewBox="0 0 1000 380" style={{ width: '100%', height: '360px', overflow: 'visible' }}>
                <text x="50" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">20Hz</text>
                <text x="250" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">300Hz</text>
                <text x="500" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">1kHz</text>
                <text x="750" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">2kHz</text>
                <text x="950" y="350" fill="#64748b" fontSize="14" fontFamily="Urbanist">20kHz</text>

                {/* 地基 */}
                <path d="M50,320 Q120,50 220,320 Z" fill="rgba(234, 88, 12, 0.1)" stroke="#ea580c" strokeWidth="2" />
                <text x="100" y="270" fill="#ea580c" fontWeight="bold" fontSize="18">Bass 跟大鼓</text>

                {/* 車禍區域色塊 */}
                <path d="M250,320 Q450,20 750,320 Z" fill="rgba(250, 204, 21, 0.08)" stroke="#facc15" strokeWidth="2" />

                {/* 樂器組文字 (移到最上方) */}
                <g transform="translate(420, 50)">
                    <text x="0" y="0" fill="#facc15" fontWeight="bold" fontSize="18">木吉他、鋼琴 (300Hz - 2kHz)</text>
                    <text x="0" y="35" fill="#94a3b8" fontWeight="bold" fontSize="18">電吉他、弦樂 (300Hz - 1.5kHz)</text>
                </g>

                {/* 人聲專屬領空 (移到中間偏下方，與樂器分開) */}
                <rect x="350" y="160" width="300" height="120" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="4" rx="15" />
                <text x="500" y="215" textAnchor="middle" fill="#f8fafc" fontWeight="900" fontSize="24">人聲領空 (Vocal)</text>
                <text x="500" y="245" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="18">300Hz - 2kHz</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 3. 檢查流程 Timeline (徹底解決重疊) ---
const MaskingTimeline = ({ isMobile }: { isMobile: boolean }) => {
    const steps = [
        { title: "1. 選色 (Tone)", desc: "挑選本質就互補的音色，減少後製負擔。", pos: "top" },
        { title: "2. 佈局 (Layout)", desc: "將樂器分配到不同音域口袋 (公寓層次)。", pos: "bottom" },
        { title: "3. 節奏 (Rhythm)", desc: "確保樂器間節奏互補而非互相碰撞。", pos: "top" },
        { title: "4. 修整 (Trim)", desc: "刪除多餘裝飾，只保留最重要的敘事線。", pos: "bottom" },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '450px', marginTop: '4rem' }}>
            {/* 中央橫線 */}
            {!isMobile && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', background: 'rgba(16, 185, 129, 0.2)', transform: 'translateY(-1.5px)' }} />}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', height: '100%', gap: isMobile ? '2rem' : '0' }}>
                {steps.map((step, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* 綠色發光點 - 固定在 50% 處 */}
                        {!isMobile && (
                            <div style={{
                                position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%',
                                width: '22px', height: '22px', background: '#10b981', borderRadius: '50%',
                                border: '4px solid #020617', boxShadow: '0 0 15px #10b981', zIndex: 10
                            }} />
                        )}

                        {/* 文字內容區塊 - 使用絕對定位與 50% 錨點完全切開 */}
                        <div style={{
                            textAlign: 'center',
                            width: isMobile ? '100%' : '240px',
                            position: isMobile ? 'static' : 'absolute',
                            // 關鍵修正：透過 bottom: 50% + padding 或 top: 50% + padding 讓文字塊永遠不跨越中線
                            bottom: !isMobile && step.pos === 'top' ? 'calc(50% + 40px)' : 'auto',
                            top: !isMobile && step.pos === 'bottom' ? 'calc(50% + 40px)' : 'auto',
                            background: isMobile ? 'rgba(255,255,255,0.03)' : 'transparent',
                            padding: isMobile ? '1.5rem' : '0',
                            borderRadius: '12px',
                        }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 'bold' }}>{step.title}</h4>
                            <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>{step.desc}</p>
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
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

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
                    <p style={{ fontSize: '1.3rem', color: '#cbd5e1', lineHeight: '1.8', maxWidth: '850px', margin: '0 auto' }}>
                        「多個同頻樂器同時彈奏，就像五個人同時要過一個門，最後誰也沒辦法真的過去，觀眾也抓不到重點。」
                    </p>
                </section>

                {/* 1. 簡易頻譜示意圖 */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>1. 簡易頻譜示意圖</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '20px' }}><strong style={{ color: '#ea580c' }}>🟠 地基層 (20-100Hz):</strong> 大鼓與 Bass 的地盤。</li>
                                <li style={{ marginBottom: '20px' }}><strong style={{ color: '#facc15' }}>🟡 車禍層 (300-2kHz):</strong> 吉他、鋼琴、人聲激戰區。</li>
                                <li><strong style={{ color: '#38bdf8' }}>🔵 空氣層 (7k-20kHz):</strong> 弦樂高音與銅鈸的空氣感。</li>
                            </ul>
                        </div>
                        <div style={{ flex: 1.2, width: '100%' }}>
                            <SimplifiedSpectrumMap />
                        </div>
                    </div>
                </section>

                {/* 2. 中頻車禍現場 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>2. 中頻車禍現場與人聲領空</h2>
                    <MidFreqJamVisual />
                    <p style={{ marginTop: '2.5rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', fontSize: '1.1rem' }}>
                        在編曲階段，就要讓樂器換把位 (Voicing) 或留白，把翡翠綠區塊讓給人聲！
                    </p>
                </section>

                {/* 3. 檢查流程 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.2rem', color: '#10b981', textAlign: 'center', marginBottom: '2rem' }}>Masking 檢查流程</h2>
                    <MaskingTimeline isMobile={isMobile} />
                </section>

                {/* 💡 留白的力量 */}
                <section style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)', padding: '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ fontSize: '5rem', fontWeight: '900', color: '#10b981', lineHeight: 1 }}>30%</div>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', marginTop: '1rem' }}>建議留白比例</h3>
                    <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.1rem' }}>
                        最高級的編曲是「簡化」。讓特定樂器適時安靜，可以讓聽眾在下一段「全樂器齊奏」時，感受到排山倒海的能量。
                    </p>
                </section>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '5rem' }}>
                    <button
                        onClick={() => router.push('/courses/arrangement/dynamics-training')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4.5rem', fontSize: isMobile ? '1.1rem' : '1.5rem',
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