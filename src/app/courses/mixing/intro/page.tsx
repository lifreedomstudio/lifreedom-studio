"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎛️ 1. 混音控制台視覺組件 (模擬 Faders) ---
const MixingConsoleVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', gap: '15px', background: '#0f172a', padding: '30px', borderRadius: '24px', border: '2px solid #334155', justifyContent: 'center', height: '300px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ width: '40px', background: '#1e293b', borderRadius: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
                <div style={{ width: '2px', height: '180px', background: '#334155', position: 'absolute', top: '40px' }}></div>
                <div style={{
                    width: '30px', height: '50px', background: '#38bdf8', borderRadius: '6px',
                    position: 'absolute', top: `${40 + (i * 20)}px`, cursor: 'grab',
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '20px', height: '2px', background: 'rgba(0,0,0,0.3)' }}></div>
                </div>
                <span style={{ position: 'absolute', bottom: '15px', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>CH {i}</span>
            </div>
        ))}
    </div>
);

// --- 🧠 2. 頻率分工視覺圖 (公司職位比喻) ---
const EQRolesVisual = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '30px' }}>
        {[
            { range: '20-100Hz', role: '地基保全 (Kick/Bass)', desc: '提供重量，保持穩定，不准亂跑。', color: '#ef4444' },
            { range: '200-500Hz', role: '溫暖主管 (Body)', desc: '聲音的厚度，太多會變混濁。', color: '#f59e0b' },
            { range: '1k-3kHz', role: '執行長 CEO (Vocal)', desc: '最核心的穿透力，必須清晰亮眼。', color: '#10b981' },
            { range: '10k-20kHz', role: '貴氣門面 (Air)', desc: '細膩的呼吸感與高級質感。', color: '#38bdf8' },
        ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${item.color}` }}>
                <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 'bold' }}>{item.range}</div>
                <h4 style={{ margin: '5px 0', color: '#fff' }}>{item.role}</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{item.desc}</p>
            </div>
        ))}
    </div>
);

// --- 🎧 3. A/B 混音試聽卡片 ---
const MixComparisonCard = ({ title, desc, badSrc, goodSrc }: { title: string, desc: string, badSrc: string, goodSrc: string }) => {
    const [isGood, setIsGood] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            audioRef.current.src = isGood ? goodSrc : badSrc;
            audioRef.current.currentTime = time;
            if (isPlaying) audioRef.current.play();
        }
    }, [isGood]);

    return (
        <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: '#fff', margin: '0 0 10px 0' }}>{title}</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>{desc}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={togglePlay} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: '#38bdf8', cursor: 'pointer' }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ flex: 1, display: 'flex', background: '#0f172a', borderRadius: '12px', padding: '4px' }}>
                    <button onClick={() => setIsGood(false)} style={{ flex: 1, border: 'none', borderRadius: '8px', background: !isGood ? '#ef4444' : 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>RAW 原始</button>
                    <button onClick={() => setIsGood(true)} style={{ flex: 1, border: 'none', borderRadius: '8px', background: isGood ? '#10b981' : 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>MIX 混音後</button>
                </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 📖 混音課程主頁面 ---
export default function MixingTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #38bdf8', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 02 : THE MIXING ART
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Mixing<br />混音：聲音的點石成金
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        混音不是為了把聲音變大，而是為了讓每個音軌在「正確的位置」被聽見。這是一場空間與頻率的平衡藝術。
                    </p>
                </header>

                {/* 1. Gain Staging 增益佈局 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#38bdf8', marginBottom: '1.5rem', borderLeft: '8px solid #0284c7', paddingLeft: '20px' }}>
                        1. Gain Staging：混音的第一塊磚
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                        <div>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                                在掛上任何效果器之前，你必須先調整每個音軌的「原始音量」。
                                <br /><br />
                                <strong style={{ color: '#fff' }}>黃金法則：</strong> 確保總輸出 (Master) 不要爆音（紅燈）。我們通常會讓每個軌道維持在 -12dB 到 -18dB 之間，這就是所謂的「留白 (Headroom)」，給效果器處理的空間。
                            </p>
                        </div>
                        <MixingConsoleVisual isMobile={isMobile} />
                    </div>
                </section>

                {/* 2. EQ 公司分工法則 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '1.5rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>
                        2. EQ：頻率的公司分工法則
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        想像你的歌曲是一間公司，每個樂器都是員工。如果大家都想當「執行長」去搶佔中高頻，公司就會亂成一團。EQ 的目的，就是讓每個人負責自己最擅長的職位：
                    </p>
                    <EQRolesVisual />
                </section>

                {/* 3. 壓縮器：溫柔的除草機 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#f59e0b', marginBottom: '1.5rem', borderLeft: '8px solid #d97706', paddingLeft: '20px' }}>
                        3. Compression：動態的除草機
                    </h2>
                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <h3 style={{ color: '#f59e0b', marginTop: 0 }}>Threshold & Ratio</h3>
                        <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                            <strong style={{ color: '#fff' }}>Threshold (閾值)：</strong> 你設定除草的高度，只有長太高的草（音量太大的部分）會被砍掉。
                            <br />
                            <strong style={{ color: '#fff' }}>Ratio (壓縮比)：</strong> 你除草的狠度。2:1 像修剪，10:1 像剃光頭。
                        </p>
                        <div style={{ marginTop: '20px', height: '10px', background: '#1e293b', borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ width: '70%', height: '100%', background: '#f59e0b', boxShadow: '0 0 15px #f59e0b' }}></div>
                        </div>
                    </div>
                </section>

                {/* 4. 混音實戰 A/B 測試 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>
                        🎧 混音實戰試煉
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                        <MixComparisonCard
                            title="主唱處理"
                            desc="EQ 去除鼻音，並用壓縮器讓歌聲「跳」到音樂最前面。"
                            badSrc="/audio/vocal-raw.mp3"
                            goodSrc="/audio/vocal-mix.mp3"
                        />
                        <MixComparisonCard
                            title="節奏組黏合"
                            desc="利用 Bus Compression 讓大鼓與貝斯融合，像同一個樂器。"
                            badSrc="/audio/drum-raw.mp3"
                            goodSrc="/audio/drum-mix.mp3"
                        />
                    </div>
                </section>

                {/* 下一章 CTA */}
                <section style={{ textAlign: 'center', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>準備好進入空間魔法了嗎？</h2>
                    <button
                        onClick={() => router.push('/courses/mixing/reverb-training')}
                        style={{
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', border: 'none',
                            padding: '1.2rem 4rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer'
                        }}
                    >
                        進入 Reverb & Space ➔
                    </button>
                </section>

            </div>
        </div>
    );
}