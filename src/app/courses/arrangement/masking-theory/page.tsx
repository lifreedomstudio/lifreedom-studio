"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 盲測 A/B 試聽播放器 (完美無縫切換版) ---
const AudioBlindTest = ({ title, description, badSrc, goodSrc, isMobile }: { title: string, description: string, badSrc: string, goodSrc: string, isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isB, setIsB] = useState(false); // false = A (Bad), true = B (Good)
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const currentTime = audio.currentTime;
            const wasPlaying = !audio.paused;

            setIsLoading(true);
            audio.src = isB ? goodSrc : badSrc;
            audio.load();

            audio.onloadedmetadata = () => {
                audio.currentTime = currentTime;
                if (wasPlaying) {
                    audio.play().catch(() => { });
                }
            };
        }
    }, [isB, badSrc, goodSrc]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current || isLoading) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div style={{ background: 'rgba(20, 20, 30, 0.8)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '2rem', boxSizing: 'border-box' }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>{title}</h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{description}</p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1rem' }}>
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    style={{
                        background: isLoading ? '#334155' : isPlaying ? '#38bdf8' : '#0284c7',
                        color: '#fff', border: 'none', width: isMobile ? '100%' : '60px', height: isMobile ? '50px' : '60px',
                        borderRadius: isMobile ? '12px' : '50%', fontSize: '1.2rem', cursor: isLoading ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isLoading ? 'none' : '0 4px 15px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s'
                    }}
                >
                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                </button>

                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '6px', flex: 1 }}>
                    <button onClick={() => setIsB(false)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: !isB ? 'rgba(255, 255, 255, 0.1)' : 'transparent', color: !isB ? '#fff' : '#64748b', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
                        🎧 版本 A
                    </button>
                    <button onClick={() => setIsB(true)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: isB ? 'rgba(255, 255, 255, 0.1)' : 'transparent', color: isB ? '#fff' : '#64748b', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
                        🎧 版本 B
                    </button>
                </div>
            </div>
            <audio ref={audioRef} onCanPlay={() => setIsLoading(false)} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🛠️ 1. 簡易頻譜示意圖 ---
const SimplifiedSpectrumMap = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: isMobile ? '15px' : '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <svg viewBox="0 0 500 250" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <line x1="20" y1="220" x2="480" y2="220" stroke="#334155" strokeWidth="2" />
            <line x1="20" y1="20" x2="20" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="120" y1="20" x2="120" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="320" y1="20" x2="320" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="480" y1="20" x2="480" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="20" y="240" fill="#64748b" fontSize="12">20Hz</text>
            <text x="120" y="240" fill="#64748b" fontSize="12">300Hz</text>
            <text x="320" y="240" fill="#64748b" fontSize="12">2kHz</text>
            <text x="480" y="240" fill="#64748b" fontSize="12">20kHz</text>
            <rect x="25" y="40" width="90" height="170" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" rx="8" />
            <text x="70" y="110" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="14">地基層</text>
            <rect x="125" y="40" width="190" height="170" fill="rgba(250, 204, 21, 0.15)" stroke="#facc15" rx="8" />
            <text x="220" y="110" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="14">擁擠層</text>
            <rect x="360" y="40" width="115" height="170" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" rx="8" />
            <text x="417" y="110" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="14">空氣層</text>
        </svg>
    </div>
);

// --- 🛠️ 合成器 (Synth) 頻譜佔用與 ADSR 圖卡 (全新加入) ---
const SynthVisualCard = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '24px', marginTop: '2.5rem' }}>
        <h4 style={{ color: '#a78bfa', fontSize: '1.2rem', margin: '0 0 1rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎛️</span> 製作人核心：合成器 (Synth) 的頻率侵略性
        </h4>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
            傳統樂器（如木吉他）的頻率通常很固定。但<strong>合成器 (Synth)</strong> 是靠振盪器產生波形，它具備極度豐富的泛音，寬度能直接橫跨「中頻到高頻」。如果沒有做好外殼動態 (ADSR) 與濾波器控制，它一進場就會化身為音頻海嘯，把人聲遮蔽得一乾二淨。
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#a78bfa', marginBottom: '10px', fontWeight: 'bold' }}>【 鋸齒波 Sawtooth 泛音分佈 】</div>
                <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto' }}>
                    {/* 模擬合成器豐富的鋸齒泛音 */}
                    <line x1="20" y1="90" x2="20" y2="20" stroke="#a78bfa" strokeWidth="3" />
                    <line x1="60" y1="90" x2="60" y2="40" stroke="#a78bfa" strokeWidth="2" />
                    <line x1="100" y1="90" x2="100" y2="55" stroke="#a78bfa" strokeWidth="2" />
                    <line x1="140" y1="90" x2="140" y2="65" stroke="#a78bfa" strokeWidth="1.5" />
                    <line x1="180" y1="90" x2="180" y2="75" stroke="#a78bfa" strokeWidth="1.5" />
                    <line x1="220" y1="90" x2="220" y2="82" stroke="#a78bfa" strokeWidth="1" />
                    <line x1="260" y1="90" x2="260" y2="87" stroke="#a78bfa" strokeWidth="1" />
                    <line x1="10" y1="90" x2="290" y2="90" stroke="#475569" strokeWidth="2" />
                </svg>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>基音與密密麻麻的霸道泛音牆</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <div>• <strong>音色特性：</strong> 鋸齒波 (Saw) / 方波 (Square) 帶有強烈的包圍感。</div>
                <div>• <strong>遮蔽風險：</strong> 鋪底合成器 (Pad) 容易吃掉人聲厚度；主奏合成器 (Lead) 容易搶走主唱歌詞的清晰度。</div>
            </div>
        </div>
    </div>
);

// --- 🛠️ 2. 中頻擁擠與人聲領空 ---
const MidFreqJamVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: isMobile ? '15px' : '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <svg viewBox="0 0 1000 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <line x1="50" y1="350" x2="950" y2="350" stroke="#334155" strokeWidth="2" />
            <text x="50" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20Hz</text>
            <text x="250" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">300Hz</text>
            <text x="500" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">1kHz</text>
            <text x="750" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">2kHz</text>
            <text x="950" y="375" fill="#64748b" fontSize="14" fontFamily="Urbanist" textAnchor="middle">20kHz</text>

            <line x1="250" y1="100" x2="250" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="750" y1="100" x2="750" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

            <path d="M50,348 Q150,50 240,348" fill="rgba(234, 88, 12, 0.1)" stroke="#ea580c" strokeWidth="3" />
            <text x="145" y="290" textAnchor="middle" fill="#ea580c" fontWeight="bold" fontSize="18">Bass & 大鼓</text>

            <path d="M260,348 Q500,20 740,348" fill="rgba(250, 204, 21, 0.08)" stroke="#facc15" strokeWidth="3" />

            <g transform="translate(500, 80)">
                <text x="0" y="0" textAnchor="middle" fill="#facc15" fontWeight="bold" fontSize="18">木吉他、鋼琴 (300Hz - 2kHz)</text>
                <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontWeight="bold" fontSize="16">電吉他、弦樂 (300Hz - 1.5kHz)</text>
            </g>

            <rect x="350" y="160" width="300" height="120" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="4" rx="15" />
            <text x="500" y="215" textAnchor="middle" fill="#f8fafc" fontWeight="900" fontSize="24">人聲領空 (Vocal)</text>
            <text x="500" y="250" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="16">神幕核心安全區</text>
        </svg>
    </div>
);

// --- 🛠️ 3. 檢查流程 Timeline ---
const MaskingTimeline = ({ isMobile }: { isMobile: boolean }) => {
    const steps = [
        { title: "1. 選色 (Tone)", desc: "挑選本質互補的音色。", example: "❌ 兩把木吉他同時齊刷\n✅ 木吉他 + Pad 合成器鋪底", pos: "top" },
        { title: "2. 佈局 (Layout)", desc: "分配到不同音域。", example: "❌ 鋼琴吉他都在 C3 音域區\n✅ 鋼琴移高八度上二樓", pos: "bottom" },
        { title: "3. 節奏 (Rhythm)", desc: "確保節奏互補。", example: "❌ 貝斯大鼓各做各的\n✅ 音符貼齊大鼓", pos: "top" },
        { title: "4. 修整 (Trim)", desc: "刪除多餘裝飾，保留敘事主線。", example: "❌ 每件樂器都在 Solo\n✅ 簡化複雜的伴奏插音與樂器過門", pos: "bottom" }, // 💡 優化：精準白話名詞替換
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '300px', marginTop: '3rem' }}>
            <div style={{ position: 'absolute', top: isMobile ? 0 : '50%', left: isMobile ? '20px' : 0, right: 0, bottom: isMobile ? 0 : 'auto', width: isMobile ? '2px' : '100%', height: isMobile ? '100%' : '3px', background: 'rgba(16, 185, 129, 0.2)', transform: isMobile ? 'none' : 'translateY(-1.5px)', zIndex: 1 }} />
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', height: '100%', gap: isMobile ? '2.5rem' : '0' }}>
                {steps.map((step, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', paddingLeft: isMobile ? '50px' : '0' }}>
                        <div style={{ position: 'absolute', top: isMobile ? '50%' : '50%', left: isMobile ? '20px' : '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: '#10b981', borderRadius: '50%', border: '3px solid #020617', zIndex: 10 }} />
                        <div style={{ textAlign: isMobile ? 'left' : 'center', width: isMobile ? '100%' : '240px', position: isMobile ? 'static' : 'absolute', bottom: !isMobile && step.pos === 'top' ? 'calc(50% + 30px)' : 'auto', top: !isMobile && step.pos === 'bottom' ? 'calc(50% + 30px)' : 'auto', padding: isMobile ? '0.5rem 0' : '0' }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.1rem', marginBottom: '8px', fontWeight: 'bold' }}>{step.title}</h4>
                            <p style={{ color: '#f8fafc', fontSize: '0.9rem', margin: '0 0 10px 0' }}>{step.desc}</p>
                            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', padding: '10px', borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'pre-line' }}>{step.example}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 📖 課程主頁面 ---
export default function MaskingTheoryPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

            {/* 🎓 本課程定位區塊 */}
            <div style={{ background: 'rgba(56, 189, 248, 0.05)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', padding: '10px 0', textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#bae6fd', fontWeight: 'bold' }}>
                    🎓 音樂製作教育訓練 | 課程代碼：MASK-301 | 頻率遮蔽分析流程 (SOP)
                </p>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 03 : AIRSPACE MANAGEMENT
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Masking 頻率遮蔽理論
                    </h1>
                </header>

                <section style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: isMobile ? '2rem 1rem' : '3rem', borderRadius: '24px', marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', color: '#10b981', marginBottom: '1.5rem' }}>別讓樂器「卡門」了！</h2>
                    <p style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', color: '#cbd5e1', lineHeight: '1.8', maxWidth: '850px', margin: '0 auto' }}>
                        「多個同頻樂器同時彈奏，就像五個人同時要過一個門。結果就是誰也出不去，觀眾聽起來就是一團糊。」
                    </p>
                </section>

                {/* 1. 頻段口袋學 */}
                <section style={{ marginBottom: '5rem' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1.5rem' : '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>1. 頻段口袋學 (The Pockets)</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                在混音台的頻譜上，每個樂器都有自己的「專屬口袋」。如果一開始就選錯音色，或者大家都擠在同一個口袋，後期的 EQ 就算調到極限也救不回來。
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#ea580c' }}>🟠 地基層 (20-100Hz):</strong> 專屬大鼓與 Bass。</li>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#facc15' }}>🟡 擁擠層 (300-2kHz):</strong> 災難現場。</li>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#38bdf8' }}>🔵 空氣層 (7k-20kHz):</strong> 弦樂高音與空氣感。</li>
                                <li style={{ marginBottom: '15px' }}><strong style={{ color: '#a78bfa' }}>🔮 空間變色龍 (Synth):</strong> 橫跨多重頻段，最易遮蔽主唱。</li>
                            </ul>
                        </div>
                        <div style={{ flex: 1.2, width: '100%' }}>
                            <SimplifiedSpectrumMap isMobile={isMobile} />
                        </div>
                    </div>

                    {/* 💡 帶有視覺圖的合成器說明卡片 */}
                    <SynthVisualCard isMobile={isMobile} />
                </section>

                {/* 2. 捍衛人聲領空 */}
                <section style={{ marginBottom: '5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <p style={{ color: '#fca5a5', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>⚠️ 殘酷的現實是：</p>
                        <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '900', lineHeight: 1.4 }}>
                            即便你已經把樂器分到不同樓層，<br />
                            它們仍然可能讓彼此「消失」。
                        </h3>
                    </div>

                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', marginBottom: '1.5rem' }}>2. 捍衛人聲領空</h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        300Hz 到 2kHz 為什麼叫擁擠層？因為這是人耳最敏感的區域，也是人聲 (Vocal) 最核心的領空。偏偏吉他、鋼琴、合成器最肥厚的聲音也都擠在這裡。
                    </p>

                    <MidFreqJamVisual isMobile={isMobile} />

                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
                        <p style={{ color: '#fca5a5', fontWeight: 'bold', margin: '0 0 8px 0' }}>⚠ 常見新手錯誤：</p>
                        <p style={{ color: '#cbd5e1', margin: '0 0 8px 0' }}>以為聲音不清楚 = EQ 亮度不夠，所以拼命把所有樂器的 EQ 拉亮。</p>
                        <p style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}>❌ 事實：不是因為不夠亮，而是「太多聲音一起亮」。</p>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold' }}>
                            🧠 核心規則：「Masking 的本質不是減少聲音，而是讓重要的聲音被看見」
                        </p>
                    </div>
                </section>

                {/* 3. 檢查流程 SOP */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#10b981', textAlign: 'center' }}>Masking 頻率遮蔽分析流程 (SOP)</h2>
                    <MaskingTimeline isMobile={isMobile} />
                </section>

                {/* 🚀 Mini Challenge 盲測收束 */}
                <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem', paddingBottom: '4rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '5px', marginBottom: '1rem' }}>FINAL CHECK</div>
                        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', fontWeight: '900' }}>哪一個版本，人聲比較清楚？</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>仔細聽聽看頻率的空間感，選出你的答案。</p>
                    </div>

                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <AudioBlindTest
                            title="🎧 空間切割盲測"
                            description="播放以下兩段音軌，找出已經做過「空間切割 (EQ Carving)」的版本。"
                            badSrc="/audio/masking-bad.mp3"
                            goodSrc="/audio/masking-good.mp3"
                            isMobile={isMobile}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: isMobile ? 'column' : 'row' }}>
                            <button
                                onClick={() => setChallengeAnswer('A')}
                                style={{ flex: 1, padding: '1.2rem', background: challengeAnswer === 'A' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', border: challengeAnswer === 'A' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                我選版本 A
                            </button>
                            <button
                                onClick={() => setChallengeAnswer('B')}
                                style={{ flex: 1, padding: '1.2rem', background: challengeAnswer === 'B' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: challengeAnswer === 'B' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                我選版本 B
                            </button>
                        </div>

                        {challengeAnswer && (
                            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', animation: 'fadeInUp 0.4s' }}>
                                {challengeAnswer === 'A' ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 10px 0' }}>❌ 這就是 Masking 最容易騙人的地方</p>
                                        <p style={{ color: '#fca5a5', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                                            聲音「聽起來很多、很滿」≠「聽得清楚」。<br />
                                            A 版本的吉他和合成器把中頻全堆滿了，導致主唱的聲音完全被吃掉。
                                        </p>
                                        <button onClick={() => setChallengeAnswer(null)} style={{ background: 'transparent', border: '1px dashed #ef4444', color: '#fca5a5', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer' }}>🔄 再試一次，直到做出工程師級選擇</button>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 10px 0' }}>✅ 完全正確！</p>
                                        <p style={{ color: '#86efac', margin: '0 0 15px 0' }}>
                                            你已經開始能「聽出空間」了，這是進入專業混音的第一步！
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* 🎯 解鎖與下一步 (僅在答對 B 時解鎖) */}
                {challengeAnswer === 'B' && (
                    <section style={{ animation: 'fadeInUp 0.8s', paddingBottom: '4rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(249, 115, 22, 0.1))', border: '1px solid #facc15', padding: '1.5rem 3rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(250, 204, 21, 0.2)' }}>
                                <div style={{ color: '#facc15', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>🎯 新技能解鎖</div>
                                <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>🔓 「Masking Detection Lv.1」</div>
                                <div style={{ color: '#cbd5e1', fontSize: '1rem', textAlign: 'left', lineHeight: '1.8' }}>
                                    你現在可以：<br />
                                    ✔ 聽出人聲被壓住的「悶感」<br />
                                    ✔ 發現中頻過度擁擠造成的「模糊」<br />
                                    ✔ 理解「不是不夠亮，而是太多一起亮」
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/courses/arrangement/dynamics-intro')}
                            style={{
                                padding: '1.4rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px',
                                border: 'none', background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#022c22', cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(34,197,94,0.4)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            🚀 章節完成：領取下一階段任務 ➔
                        </button>
                    </section>
                )}

            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}