"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎛️ 1. 混音控制台視覺組件 (模擬具體樂器 Faders) ---
const MixingConsoleVisual = ({ isMobile }: { isMobile: boolean }) => {
    // 🚨 修正：將 generic CH 1.. 改為具體的專業樂器軌命名
    const channelNames = ['Kick (大鼓)', 'Snare (小鼓)', 'Bass (貝斯)', 'Gtr (吉他)', 'Keys (鋼琴/合成器)', 'Vocal (主唱)'];

    return (
        <div style={{ display: 'flex', gap: '15px', background: '#0f172a', padding: '30px', borderRadius: '24px', border: '2px solid #334155', justifyContent: 'center', height: '300px' }}>
            {channelNames.map((name, i) => (
                <div key={i} style={{ width: '40px', background: '#1e293b', borderRadius: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ width: '2px', height: '180px', background: '#334155', position: 'absolute', top: '40px' }}></div>
                    <div style={{
                        width: '30px', height: '50px', background: '#38bdf8', borderRadius: '6px',
                        position: 'absolute', top: `${40 + (i * 20) + (i === 5 ? -10 : 0)}px`, cursor: 'grab', // Vocal Fader 推高一點
                        boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ width: '20px', height: '2px', background: 'rgba(0,0,0,0.3)' }}></div>
                    </div>
                    {/* 🚨 修正：顯示樂器軌名稱 */}
                    <span style={{ position: 'absolute', bottom: '15px', fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', width: '38px', textAlign: 'center', lineHeight: '1.2', whiteSpace: 'wrap' }}>
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
};

// --- 🧠 2. 頻率分工視覺圖 (公司職位比喻) ---
const EQRolesVisual = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '30px' }}>
        {[
            { range: '20-100Hz', role: '地基保全 (Kick/Bass)', desc: '提供重量，保持穩定，不准亂跑。', color: '#ef4444' },
            { range: '200-500Hz', role: '溫暖主管 (Body)', desc: '聲音的厚度，太多會變混濁。', color: '#f59e0b' },
            { range: '1k-3kHz', role: '執行長 CEO (Vocal)', desc: '最核心的穿透力，必須清晰亮眼。', color: '#10b981' },
            // 🚨 修正：將「貴氣門面」改為「公關宣傳部門 (PR)」
            { range: '10k-20kHz', role: '公關宣傳部門 (Air)', desc: '負責把最好的質感行銷出去，細膩呼吸感。', color: '#38bdf8' },
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
                <button onClick={togglePlay} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: '#38bdf8', cursor: 'pointer', fontSize: '1.5rem', color: '#0f172a' }}>
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

// --- 📖 混音課程主頁面 (前言總覽) ---
export default function MixingIntroduction() {
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

                {/* Header 🚨 修正：Header 標籤與內容從 Phase 改為前言總覽寫法 */}
                <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #38bdf8', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        混音新手村：大師見面會 (INTRO)
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        混音學：打造聲音的立體舞台
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        歡迎來到混音的世界！這裡是將雜亂音軌化身為專業唱片的空間。在真正開始深造 Gain/EQ/Compressor 之前，我們先花三分鐘搞懂它的核心目的與這堂課你將學會的強大魔法。
                    </p>
                </header>

                {/* 🚨 文字論述更新，讓這頁聽起來像是一個高含金量的懶人包 */}

                {/* 混音的核心目的 */}
                <section style={{ marginBottom: '6rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
                    <div style={{ flex: 1.5, background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1.2rem', fontWeight: 'bold' }}><i className="fa-solid fa-bullseye"></i> 混音的終極目的不是把聲音變大！</h3>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'justify' }}>
                            新手最常犯的錯就是覺得混音就是「調大音量」。其實，混音真正的目的是：<strong style={{ color: '#fff' }}>讓每個音軌在「正確的位置」被聽見。</strong>
                        </p>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', margin: 0, textAlign: 'justify' }}>
                            這是一場關於「立體空間」與「頻率領域」的管理學。我们要學會讓聲音有前後距離感、有左右開展度，並讓每個頻段（從地基到門面）都有專人負責，創造出一張平衡、飽滿、具備高級質感的唱片聽感。
                        </p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: isMobile ? '5rem' : '7rem', fontWeight: '900', color: '#10b981', lineHeight: '1' }}>1 ➔ 100</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', marginTop: '10px' }}>團隊管理學</div>
                    </div>
                </section>

                {/* 這堂課你將學到的三大魔法 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 'bold' }}>🔮 這堂課你將解鎖的三大混音魔法</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', textAlign: 'center', lineHeight: '1.6' }}>
                        這頁只是總覽，後續我們會有獨立且超詳細的「聽覺實驗室」頁面來深入研究。先睹為快！
                    </p>

                    {/* 1. Gain Staging 增益佈局 */}
                    <div style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                        <div style={{ borderLeft: '8px solid #0284c7', paddingLeft: '20px' }}>
                            <h3 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '1rem', fontWeight: 'bold' }}>魔法 1：Gain Staging (增益佈局)</h3>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                在掛上任何效果器之前，你必須先調整每個音軌的「原始音量」。
                                <strong style={{ color: '#fff' }}>黃金法則：</strong> 確保總輸出 (Master) 不要爆音，並給後續的效果器留白處理空間。
                            </p>
                        </div>
                        <MixingConsoleVisual isMobile={isMobile} />
                    </div>

                    {/* 2. EQ 公司分工法則 */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ borderLeft: '8px solid #059669', paddingLeft: '20px', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.6rem', color: '#10b981', marginBottom: '1rem', fontWeight: 'bold' }}>魔法 2：EQ (頻率分工法則)</h3>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                想像你的歌曲是一間公司。如果大家都想當「執行長」搶佔中高頻，就會亂成一團。EQ 手就是讓樂器負責自己擅長的職位：
                            </p>
                        </div>
                        <EQRolesVisual />
                    </div>

                    {/* 3. 壓縮器：溫柔的除草機 */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ borderLeft: '8px solid #d97706', paddingLeft: '20px', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.6rem', color: '#f59e0b', marginBottom: '1rem', fontWeight: 'bold' }}>魔法 3：Compression (動態除草機)</h3>
                        </div>
                        <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                壓縮器能「壓住爆大聲的音量」，並「提升變超小聲的音量」，讓樂器在整首歌中聽起來音量穩定，增加穿透力。我們用最白話的比喻：
                                <br /><br />
                                <strong style={{ color: '#fff' }}>Threshold (閾值)：</strong> 你設定除草的高度。
                                <br />
                                <strong style={{ color: '#fff' }}>Ratio (壓縮比)：</strong> 你除草的狠度。
                            </p>
                            <div style={{ marginTop: '20px', height: '10px', background: '#1e293b', borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ width: '70%', height: '100%', background: '#f59e0b', boxShadow: '0 0 15px #f59e0b' }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. 混音實戰 A/B 測試 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                        🎧 搶先體驗：混音的魔石點金
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', textAlign: 'center', lineHeight: '1.6' }}>
                        感受一下，透過正確的 Gain/EQ/Compressor 處理後，聲音會產生什麼樣的高級質感！
                    </p>
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
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight: 'bold' }}>準備好進入空間魔法了嗎？</h2>
                    <button
                        onClick={() => router.push('/courses/mixing/eq-training')} // 我們把 eq-training 當作真正的第一關
                        style={{
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', border: 'none',
                            padding: '1.2rem 4rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 1. EQ 頻率分工 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}