"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 A/B 試聽播放器元件 (繼承自前兩章) ---
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
        <div style={{ background: 'rgba(20, 20, 30, 0.8)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '2rem', boxSizing: 'border-box' }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>{title}</h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{description}</p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1rem' }}>
                <button onClick={togglePlay} style={{ background: isPlaying ? '#eab308' : '#facc15', color: '#020617', border: 'none', width: isMobile ? '100%' : '60px', height: isMobile ? '50px' : '60px', borderRadius: isMobile ? '12px' : '50%', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)', transition: 'background 0.2s' }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '6px', flex: 1 }}>
                    <button onClick={() => setIsGood(false)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: !isGood ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: !isGood ? '#fca5a5' : '#64748b', borderBottom: !isGood ? '2px solid #ef4444' : '2px solid transparent', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        ❌ {badLabel}
                    </button>
                    <button onClick={() => setIsGood(true)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: isGood ? '#86efac' : '#64748b', borderBottom: isGood ? '2px solid #22c55e' : '2px solid transparent', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        ✅ {goodLabel}
                    </button>
                </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🛠️ 1. 簡易頻譜示意圖 (精準對齊版) ---
const SimplifiedSpectrumMap = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: isMobile ? '15px' : '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 500 250" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* 座標軸與刻度線 (模擬 Log 刻度) */}
                <line x1="20" y1="220" x2="480" y2="220" stroke="#334155" strokeWidth="2" />
                <line x1="20" y1="20" x2="20" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="120" y1="20" x2="120" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="320" y1="20" x2="320" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="480" y1="20" x2="480" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                <text x="20" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20Hz</text>
                <text x="120" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">300Hz</text>
                <text x="320" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">2kHz</text>
                <text x="480" y="240" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20kHz</text>

                {/* 🔴 地基層 (20-100Hz) - 這裡視覺上稍微拉寬到 300Hz 邊界以便觀看，但明確標示 20-100Hz */}
                <rect x="25" y="40" width="90" height="170" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" strokeDasharray="5 5" strokeWidth="2" rx="8" />
                <text x="70" y="110" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="16">地基層</text>
                <text x="70" y="130" textAnchor="middle" fill="#fdba74" fontSize="12">20-100Hz</text>

                {/* 🟡 車禍層 (300-2kHz) */}
                <rect x="125" y="40" width="190" height="170" fill="rgba(250, 204, 21, 0.15)" stroke="#facc15" strokeDasharray="5 5" strokeWidth="2" rx="8" />
                <text x="220" y="110" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="16">車禍層</text>
                <text x="220" y="130" textAnchor="middle" fill="#fef08a" fontSize="12">300Hz-2kHz</text>

                {/* 🔵 空氣層 (7k-20kHz) */}
                <rect x="360" y="40" width="115" height="170" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeDasharray="5 5" strokeWidth="2" rx="8" />
                <text x="417" y="110" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="16">空氣層</text>
                <text x="417" y="130" textAnchor="middle" fill="#bae6fd" fontSize="12">7k-20kHz</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 2. 中頻車禍與人聲領空 (精準對齊版) ---
const MidFreqJamVisual = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: isMobile ? '15px' : '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <svg viewBox="0 0 1000 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* 座標軸 */}
                <line x1="50" y1="350" x2="950" y2="350" stroke="#334155" strokeWidth="2" />
                <text x="50" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20Hz</text>
                <text x="250" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">300Hz</text>
                <text x="500" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">1kHz</text>
                <text x="750" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">2kHz</text>
                <text x="950" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20kHz</text>

                <line x1="250" y1="100" x2="250" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="750" y1="100" x2="750" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                {/* 橘色：Bass/大鼓 */}
                <path d="M50,348 Q150,50 240,348" fill="rgba(234, 88, 12, 0.1)" stroke="#ea580c" strokeWidth="3" />
                <text x="145" y="290" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="18">Bass & 大鼓</text>

                {/* 黃色：中頻樂器混戰 */}
                <path d="M260,348 Q500,20 740,348" fill="rgba(250, 204, 21, 0.08)" stroke="#facc15" strokeWidth="3" />

                <g transform="translate(500, 80)">
                    <text x="0" y="0" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="18">木吉他、鋼琴 (300Hz - 2kHz)</text>
                    <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontWeight="bold" fontSize="16">電吉他、弦樂 (300Hz - 1.5kHz)</text>
                </g>

                {/* 綠色：人聲專屬護城河 */}
                <rect x="350" y="160" width="300" height="120" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="4" rx="15" />
                <text x="500" y="215" textAnchor="middle" fill="#f8fafc" fontWeight="900" fontSize="24">人聲領空 (Vocal)</text>
                <text x="500" y="250" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="16">神聖不可侵犯區</text>
            </svg>
        </div>
    );
};

// --- 🛠️ 3. 檢查流程 Timeline (加入實戰舉例) ---
const MaskingTimeline = ({ isMobile }: { isMobile: boolean }) => {
    const steps = [
        {
            title: "1. 選色 (Tone)",
            desc: "挑選本質就互補的音色。",
            example: "❌ 兩把木吉他刷扣 \n✅ 一把木吉他 + 一個 Pad 合成器鋪底",
            pos: "top"
        },
        {
            title: "2. 佈局 (Layout)",
            desc: "將樂器分配到不同音域口袋。",
            example: "❌ 鋼琴和吉他都在 C3 彈和弦 \n✅ 吉他留在一樓，鋼琴移高八度上二樓",
            pos: "bottom"
        },
        {
            title: "3. 節奏 (Rhythm)",
            desc: "確保樂器間節奏互補而非碰撞。",
            example: "❌ 貝斯和大鼓各彈各的 \n✅ 讓貝斯的音符完美「貼齊 (Lock-in)」大鼓",
            pos: "top"
        },
        {
            title: "4. 修整 (Trim)",
            desc: "刪除多餘裝飾，保留敘事線。",
            example: "❌ 副歌每件樂器都在 Solo \n✅ 副歌抽掉過於複雜的吉他過弦，把焦點還給主唱",
            pos: "bottom"
        },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '300px', marginTop: '3rem' }}>
            <div style={{ position: 'absolute', top: isMobile ? 0 : '50%', left: isMobile ? '20px' : 0, right: 0, bottom: isMobile ? 0 : 'auto', width: isMobile ? '2px' : '100%', height: isMobile ? '100%' : '3px', background: 'rgba(16, 185, 129, 0.2)', transform: isMobile ? 'none' : 'translateY(-1.5px)', zIndex: 1 }} />

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', height: '100%', gap: isMobile ? '2.5rem' : '0' }}>
                {steps.map((step, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', paddingLeft: isMobile ? '50px' : '0' }}>

                        <div style={{ position: 'absolute', top: isMobile ? '50%' : '50%', left: isMobile ? '20px' : '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: '#10b981', borderRadius: '50%', border: '3px solid #020617', boxShadow: '0 0 10px #10b981', zIndex: 10 }} />

                        <div style={{
                            textAlign: isMobile ? 'left' : 'center',
                            width: isMobile ? '100%' : '240px',
                            position: isMobile ? 'static' : 'absolute',
                            bottom: !isMobile && step.pos === 'top' ? 'calc(50% + 30px)' : 'auto',
                            top: !isMobile && step.pos === 'bottom' ? 'calc(50% + 30px)' : 'auto',
                            padding: isMobile ? '0.5rem 0' : '0'
                        }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '8px', fontWeight: 'bold' }}>{step.title}</h4>
                            <p style={{ color: '#f8fafc', fontSize: '1rem', margin: '0 0 10px 0', lineHeight: '1.5' }}>{step.desc}</p>
                            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', padding: '10px', borderRadius: '8px', textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                {step.example}
                            </div>
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
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 03 : AIRSPACE MANAGEMENT
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Masking 頻率遮蔽預防
                    </h1>
                </header>

                {/* 🎬 卡門比喻卡片 */}
                <section style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: isMobile ? '2rem 1rem' : '3rem', borderRadius: '24px', marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', color: '#10b981', marginBottom: '1.5rem' }}>別讓樂器「卡門」了！</h2>
                    <p style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', color: '#cbd5e1', lineHeight: '1.8', maxWidth: '850px', margin: '0 auto' }}>
                        「多個同頻樂器同時彈奏，就像五個人同時要過一個門。結果就是誰也出不去，觀眾聽起來就是一團糊。」
                    </p>
                </section>

                {/* 1. 簡易頻譜示意圖 */}
                <section style={{ marginBottom: '5rem' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1.5rem' : '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>1. 頻段口袋學 (The Pockets)</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                在混音台的頻譜上，每個樂器都有自己的「專屬口袋」。如果一開始就選錯音色，或者大家都擠在同一個口袋，後期的 EQ 就算調到極限也救不回來。
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#ea580c' }}>🟠 地基層 (20-100Hz):</strong> 專屬大鼓與 Bass。</li>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#facc15' }}>🟡 車禍層 (300-2kHz):</strong> 最容易發生慘案的地方。</li>
                                <li><strong style={{ color: '#38bdf8' }}>🔵 空氣層 (7k-20kHz):</strong> 弦樂高音與銅鈸的亮點區。</li>
                            </ul>
                        </div>
                        <div style={{ flex: 1.2, width: '100%' }}>
                            <SimplifiedSpectrumMap isMobile={isMobile} />
                        </div>
                    </div>
                </section>

                {/* 2. 中頻車禍現場與人聲護航 */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>2. 捍衛人聲領空</h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        300Hz 到 2kHz 為什麼叫車禍層？因為這是**人耳最敏感的區域**，也是人聲 (Vocal) 最核心的領空。偏偏吉他、鋼琴、合成器最肥厚的聲音也都擠在這裡。
                    </p>

                    <MidFreqJamVisual isMobile={isMobile} />

                    {/* 🎧 A/B 聽覺實驗室：EQ 挖空技術 */}
                    <div style={{ marginTop: '3rem' }}>
                        <AudioComparer
                            title="🎧 聽覺實驗：幫主唱清出跑道 (EQ Carving)"
                            description="聽聽看災難版：吉他跟合成器把中頻塞滿，主唱的聲音像被棉被悶住。完美版：我們只做了一件事，就是在吉他與合成器的 EQ 上，把 1kHz 附近微微挖空 (降 2dB)，主唱瞬間就亮出來了！"
                            badSrc="/audio/masking-bad.mp3"
                            goodSrc="/audio/masking-good.mp3"
                            badLabel="頻率塞滿打架"
                            goodLabel="EQ 挖空讓道"
                            isMobile={isMobile}
                        />
                    </div>
                </section>

                {/* 3. 檢查流程 */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', textAlign: 'center' }}>Masking 預防 SOP</h2>
                    <MaskingTimeline isMobile={isMobile} />
                </section>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#fff', marginBottom: '2rem' }}>準備好進入最後的情緒管理了嗎？</h2>
                    <button
                        onClick={() => router.push('/courses/arrangement/dynamics-training')}
                        style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)', color: '#020617', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4.5rem', fontSize: isMobile ? '1.1rem' : '1.5rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        前往最後一關：4. Dynamics 動態與曲式 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}