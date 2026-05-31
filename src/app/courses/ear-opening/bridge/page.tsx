"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EarOpeningBridgePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#020617',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isMobile ? '3rem 1.5rem' : '5rem 2rem',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflowX: 'hidden'
        }}>

            {/* 🌌 電影感背景：緩慢飄移的深邃星雲光暈 */}
            <div style={{
                position: 'fixed',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, rgba(56,189,248,0.02) 50%, transparent 100%)',
                top: '30%',
                left: '70%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                pointerEvents: 'none',
                animation: 'driftBg 20s infinite alternate'
            }} />

            <div style={{ maxWidth: '650px', width: '100%', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {/* 🟣 1. Hook + 🟡 2. Proof (0.5s ~ 1.5s 浮現，快速建立認知) */}
                <section style={{ textAlign: 'center' }}>
                    <h2 className="cinematic-fade" style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.4', animationDelay: '0.5s' }}>
                        你剛剛不是在猜 A 或 B。<br />你是在建立一種能力：
                    </h2>
                    <p className="cinematic-fade" style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: '900', animationDelay: '1.2s', marginBottom: '3rem', letterSpacing: '1px' }}>
                        👉 分辨聲音之間的關係。
                    </p>

                    <div className="cinematic-fade" style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.8', animationDelay: '2.0s' }}>
                        <p style={{ margin: '0 0 1rem 0' }}>有些人聽音樂 10 年，還停留在旋律。</p>
                        <p style={{ margin: 0 }}>但你剛剛已經開始分辨：</p>
                        <p style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0 0 0', letterSpacing: '2px' }}>
                            重量 ｜ 距離 ｜ 空間 ｜ 清晰度
                        </p>
                    </div>
                </section>

                {/* 🔵 3. Naming：能力命名 (3.0s 浮現) */}
                <section className="cinematic-fade" style={{ textAlign: 'center', animationDelay: '3.0s' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>我們幫這個能力取一個名字：</p>
                    <h3 style={{ color: '#10b981', fontWeight: '900', fontSize: '1.6rem', margin: '0 0 1rem 0', textShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
                        🎧「聲音結構感知能力」
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
                        也可以叫它更簡單一點：<br />
                        <strong style={{ color: '#fff', fontSize: '1.3rem', display: 'inline-block', marginTop: '0.5rem' }}>👉「編曲耳朵」</strong>
                    </p>
                </section>

                {/* 🟠 4. World Shift + 🔥 5. Punchline (4.0s 浮現) */}
                <section className="cinematic-fade" style={{
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.01)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '3rem 1rem',
                    borderRadius: '16px',
                    animationDelay: '4.0s'
                }}>
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', marginBottom: '1rem', color: '#cbd5e1' }}>
                        接下來你要學的不是「聽音樂」
                    </h2>
                    <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', margin: '0 0 3rem 0', letterSpacing: '2px' }}>
                        是「安排音樂」
                    </p>

                    <div style={{ color: '#fca311', fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: '900', lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 1rem 0' }}>一首歌變得專業，不是因為用了更多音色。</p>
                        <p style={{ margin: '0 0 1rem 0' }}>而是因為——</p>
                        <p style={{ fontSize: '1.6rem', margin: 0, textShadow: '0 0 20px rgba(252, 163, 17, 0.3)' }}>
                            👉 每個聲音，都有位置
                        </p>
                    </div>
                </section>

                {/* 🟢 6. CTA 前鋪墊 + 🚀 7. 轉換按鈕 (5.5s 壓軸出現) */}
                <section className="cinematic-fade" style={{ textAlign: 'center', animationDelay: '5.5s', marginBottom: '3rem' }}>

                    <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        接下來，你會開始學會一件事：<br />
                        <strong style={{ color: '#38bdf8', fontSize: '1.3rem', display: 'inline-block', marginTop: '0.8rem' }}>👉 怎麼決定每個聲音的位置</strong>
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', letterSpacing: '1px', fontWeight: 'bold' }}>
                        🎧 進入編曲學：從 0 到 1 的劇本設計
                    </h3>

                    <button
                        onClick={() => router.push('/courses/arrangement/intro')}
                        style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#020617',
                            border: 'none',
                            padding: '1.2rem 3rem',
                            fontSize: isMobile ? '1.1rem' : '1.2rem',
                            fontWeight: '900',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                            letterSpacing: '1px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.3)';
                        }}
                    >
                        🎬 進入下一階段：編曲決策訓練
                    </button>
                </section>

            </div>

            {/* 🎨 核心動畫樣式 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .cinematic-fade {
                    opacity: 0;
                    transform: translateY(15px);
                    animation: fadeUpReveal 1.2s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
                }
                @keyframes fadeUpReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes driftBg {
                    0% { transform: translate(-50%, -50%) scale(0.9) rotate(0deg); opacity: 0.6; }
                    100% { transform: translate(-45%, -55%) scale(1.1) rotate(10deg); opacity: 0.9; }
                }
            `}} />
        </div>
    );
}