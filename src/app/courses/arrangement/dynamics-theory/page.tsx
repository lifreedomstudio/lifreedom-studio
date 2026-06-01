"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎬 核心優化：Scrollytelling 高階流暢動畫導覽引擎 ---
const ScrollytellingHero = ({ isMobile }: { isMobile: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 💡 優化 1：使用 requestAnimationFrame 鎖定重繪頻率，杜絕 CPU 抖動
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        const windowH = window.innerHeight;
                        const scrollable = rect.height - windowH;
                        const p = Math.max(0, Math.min(1, -rect.top / scrollable));
                        setProgress(p);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 隨滾動進度動態運算
    const peakY = 200 - (progress * 150);
    const spaceOpacity = Math.max(0, 1 - (progress * 2));
    const burstIntensity = Math.max(0, (progress - 0.7) * 3.33);
    const glowSize = burstIntensity * 100;

    const dynamicPath = `M 0 200 L 200 200 C 350 200, 400 ${peakY}, 550 ${peakY} L 750 ${peakY} C 850 ${peakY}, 900 200, 1000 200`;
    const phase = progress < 0.35 ? 'space' : progress < 0.75 ? 'motion' : 'burst';

    return (
        <div ref={containerRef} style={{ position: 'relative', height: '300vh', width: '100%', marginBottom: '2rem' }}>

            {/* 📌 固定黏性視窗 */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

                {/* 標題與核心公式 */}
                <div style={{ position: 'absolute', top: isMobile ? '10%' : '15%', textAlign: 'center', zIndex: 10 }}>
                    <div style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>
                        THE CORE MODEL
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Dynamics = 呼吸控制
                    </h1>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '1px', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
                            Silence × Contrast × Motion
                        </span>
                    </div>
                </div>

                {/* 動態文字疊加區 */}
                <div style={{ position: 'absolute', top: '42%', zIndex: 10, textAlign: 'center', width: '100%', padding: '0 1rem', height: '160px' }}>

                    {/* 💡 優化 2：結合 translateY 與 0.6s transition 創造 Apple 懸浮滑行過渡 */}
                    {/* 🫁 Phase 1: Space */}
                    <div style={{
                        position: 'absolute', width: '100%', left: '50%', pointerEvents: 'none',
                        opacity: phase === 'space' ? 1 : 0,
                        transform: phase === 'space' ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 20px))',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫁</div>
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#10b981', fontWeight: '900', margin: '0 0 1rem 0' }}>Space（呼吸）：有沒有空？</h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 10px #000' }}>「空白，才是推動情緒的力量。」</p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1.5rem' }}>向下滾動，看見情緒的堆疊 ⬇</p>
                    </div>

                    {/* 🚀 Phase 2: Motion & Contrast */}
                    <div style={{
                        position: 'absolute', width: '100%', left: '50%', pointerEvents: 'none',
                        opacity: phase === 'motion' ? 1 : 0,
                        transform: phase === 'motion' ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 20px))',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '2.5rem' }}>⚖️</div>
                            <div style={{ fontSize: '2.5rem' }}>🚀</div>
                        </div>
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#facc15', fontWeight: '900', margin: '0 0 1rem 0' }}>Contrast & Motion</h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 10px #000' }}>「情緒不是跳躍，是被推上去的。」</p>
                        <p style={{ color: '#fca311', fontSize: '1rem', marginTop: '1rem', fontWeight: 'bold' }}>拉開落差，製造蓄力感...</p>
                    </div>

                    {/* 💥 Phase 3: Chorus Burst */}
                    <div style={{
                        position: 'absolute', width: '100%', left: '50%', pointerEvents: 'none',
                        opacity: phase === 'burst' ? 1 : 0,
                        transform: phase === 'burst' ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 20px))',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: phase === 'burst' ? 'pulseText 1s infinite alternate' : 'none' }}>💥</div>
                        <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', fontWeight: '900', margin: '0 0 1rem 0', textShadow: `0 0 ${glowSize}px #38bdf8` }}>
                            CHORUS 爆發
                        </h2>
                        <p style={{ color: '#bae6fd', fontSize: '1.3rem', fontWeight: '900', textShadow: '0 2px 10px #000' }}>「沒有前面的安靜，就沒有現在的爆炸。」</p>
                    </div>
                </div>

                {/* 〰️ 核心 SVG 渲染引擎 */}
                <div style={{ width: '100%', maxWidth: '1000px', position: 'absolute', bottom: '15%' }}>
                    {/* 空間粒子 */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: spaceOpacity, backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px', transition: 'opacity 0.1s' }} />

                    {/* 高潮發光 */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '200px', background: '#38bdf8', opacity: burstIntensity * 0.3, filter: `blur(${glowSize}px)`, transition: 'opacity 0.1s' }} />

                    <svg viewBox="0 0 1000 250" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="curve-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={phase === 'burst' ? '#38bdf8' : '#10b981'} stopOpacity={0.6 + burstIntensity * 0.4}></stop>
                                <stop offset="100%" stopColor={phase === 'burst' ? '#38bdf8' : '#10b981'} stopOpacity={0}></stop>
                            </linearGradient>
                        </defs>

                        {/* 💡 優化 3：加入對照灰色基準線，凸顯動態能量的物理對比 */}
                        <path d="M 0 200 L 1000 200" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

                        {/* 動態曲線 */}
                        <path d={`${dynamicPath} L 1000 250 L 0 250 Z`} fill="url(#curve-grad)" style={{ transition: 'all 0.05s linear' }} />
                        <path d={dynamicPath} fill="none" stroke={phase === 'burst' ? '#fff' : '#10b981'} strokeWidth={4 + burstIntensity * 3} style={{ transition: 'all 0.05s linear', filter: `drop-shadow(0 0 ${glowSize / 2}px #38bdf8)` }} />

                        <g fill={phase === 'burst' ? '#fff' : "#64748b"} fontSize="12" fontFamily="sans-serif" fontWeight="bold" style={{ transition: 'fill 0.5s' }}>
                            <text x="50" y="240">VERSE</text>
                            <text x="350" y="240">PRE-CHORUS</text>
                            <text x="600" y="240">CHORUS</text>
                        </g>
                    </svg>
                </div>

            </div>
        </div>
    );
};

export default function DynamicsTheoryPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [openCard, setOpenCard] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleCard = (id: string) => setOpenCard(openCard === id ? null : id);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

            {/* 🌟 滾動敘事導覽視窗 */}
            <ScrollytellingHero isMobile={isMobile} />

            <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', padding: isMobile ? '2rem 1rem' : '0 2rem 5rem 2rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                {/* 🔵 曲式結構 */}
                <section style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>🎬 曲式，只是情緒的載體</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>它不是死板的樂理，它是用來裝載能量起伏的容器。</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.2rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>Verse (主歌)</span><br /><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>穩定敘事，鋪陳情節</span></div>
                            <span style={{ fontWeight: '900', color: '#10b981' }}>📉 壓低能量</span>
                        </div>

                        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.2rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #facc15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>Pre-Chorus (導歌)</span><br /><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>堆疊懸念，製造渴望</span></div>
                            <span style={{ fontWeight: '900', color: '#facc15' }}>📈 拉高張力</span>
                        </div>

                        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.2rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>Chorus (副歌)</span><br /><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>核心主題釋放，音場全開</span></div>
                            <span style={{ fontWeight: '900', color: '#38bdf8' }}>💥 能量爆發</span>
                        </div>
                    </div>

                    {/* 次要摺疊區 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                        {[
                            { id: 'intro', title: 'Intro (前奏)', desc: '建立世界觀。定調整部音樂的第一氣氛。' },
                            { id: 'bridge', title: 'Bridge (橋段)', desc: '迎來劇情大反轉。通常和弦走向會劇烈改變或節奏瞬間慢下，提供新鮮感。' },
                            { id: 'outro', title: 'Outro (尾奏)', desc: '故事終章消散。樂器一件件有序抽離，引導大腦情緒平復。' }
                        ].map((item) => {
                            const isOpen = openCard === item.id;
                            return (
                                <div key={item.id} style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                                    <div onClick={() => toggleCard(item.id)} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                        <span style={{ fontWeight: 'bold', color: '#64748b', fontSize: '1rem' }}>{item.title}</span>
                                        <span style={{ color: '#475569', fontSize: '1rem' }}>{isOpen ? '−' : '＋'}</span>
                                    </div>
                                    {isOpen && (
                                        <div style={{ padding: '0 1.5rem 1.2rem 1.5rem', color: '#cbd5e1', fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '1rem', animation: 'fadeInUp 0.2s' }}>
                                            {item.desc}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 🔴 核心轉化：🧲 真空理論 */}
                <section style={{ background: 'linear-gradient(135deg, #4c0519, #0f172a)', border: '1px solid #9f1239', padding: isMobile ? '2rem 1.5rem' : '3.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(159, 18, 57, 0.15)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ color: '#fb7185', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '4px', marginBottom: '8px' }}>SIGNATURE THEORY</div>
                        <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: '900', color: '#fff', margin: 0 }}>
                            🧲 能量轟炸的「真空理論」
                        </h3>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '3rem', borderLeft: '4px solid #fb7185' }}>
                        <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
                            「音樂爆炸不是推上去的，是『被吸過去的』」
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#ef4444', fontWeight: '900', marginBottom: '10px', fontSize: '1.1rem' }}>1. Silence Gap (呼吸瞬切)</div>
                            <span style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, display: 'block' }}>在重拍砸下前，狠心抽乾背景 0.3 秒，製造讓大腦瞬間屏息的失重引力。</span>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#facc15', fontWeight: '900', marginBottom: '10px', fontSize: '1.1rem' }}>2. Anticipation (預期引導)</div>
                            <span style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, display: 'block' }}>利用反轉音效 (Reverse) 給予耳朵暗示，讓大腦知道海嘯即將撲來。</span>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#38bdf8', fontWeight: '900', marginBottom: '10px', fontSize: '1.1rem' }}>3. Tension Pull (張力拉扯)</div>
                            <span style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, display: 'block' }}>將頻率與能量像拉弓一樣往後拉緊，直到極限，蓄積重拍落下的反彈衝力。</span>
                        </div>
                    </div>
                </section>

                {/* 🧭 前往實戰 CTA */}
                <footer style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '3rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>心智模型已建立。現在，讓我們進軟體把這個手感做出來。</p>
                    <button
                        onClick={() => router.push('/courses/arrangement/dynamics-lab')}
                        style={{
                            background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 2rem' : '1.4rem 4.5rem', fontSize: '1.2rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        ⚡ 進入實戰：動態編配工具箱 ➔
                    </button>
                </footer>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseText { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; text-shadow: 0 0 30px #fff; } }
            ` }} />
        </div>
    );
}