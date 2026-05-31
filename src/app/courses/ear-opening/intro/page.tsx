"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EarOpeningIntroPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* 🌌 背景氛圍：動態模糊的音樂光暈效果 */}
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(16,185,129,0.03) 50%, transparent 100%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                pointerEvents: 'none',
                animation: 'pulseBg 8s infinite alternate'
            }} />

            {/* 📦 核心內容容器 */}
            <div style={{
                maxWidth: '550px',
                width: '100%',
                textAlign: 'center',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                {/* 🤫 靈魂提問 (0.5s 出現) */}
                <h1 className="fade-in-line" style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    marginBottom: '3rem',
                    letterSpacing: '3px',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animationDelay: '0.5s'
                }}>
                    你真的有在聽音樂嗎？
                </h1>

                {/* 📜 詩歌節奏段落 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>

                    {/* 直接命中自己 (1.5s 出現) */}
                    <p className="fade-in-line" style={{ fontSize: '1.2rem', color: '#cbd5e1', margin: 0, animationDelay: '1.5s' }}>
                        你可能一直都只是在聽主唱。
                    </p>

                    {/* 帶入感官提示 (2.5s 出現) */}
                    <p className="fade-in-line" style={{ fontSize: '1.2rem', color: '#94a3b8', margin: 0, animationDelay: '2.5s', letterSpacing: '2px' }}>
                        但一首歌裡，<br />
                        還有節奏、空間、重量，<br />
                        還有很多你從來沒注意過的聲音。
                    </p>

                    {/* 解除防備心 (3.5s 出現) */}
                    <p className="fade-in-line" style={{ fontSize: '1.2rem', color: '#cbd5e1', margin: 0, animationDelay: '3.5s' }}>
                        不是因為你不夠專業，<br />
                        而是從來沒有人帶你去「聽見」。
                    </p>

                    {/* 引發好奇心 (4.5s 出現) */}
                    <p className="fade-in-line" style={{
                        fontSize: '1.25rem',
                        color: '#38bdf8',
                        fontWeight: 'bold',
                        margin: 0,
                        animationDelay: '4.5s',
                        textShadow: '0 0 20px rgba(56,189,248,0.2)'
                    }}>
                        接下來這幾個小體驗，<br />
                        可能會讓你第一次發現——<br />
                        原來你一直錯過了這些。
                    </p>
                </div>

                {/* ⚡ 懷疑自我 + 雙路徑 CTA 提早出現 (3.8s 開始淡入，4.5s 完全可見) */}
                <div className="fade-in-line" style={{ animationDelay: '3.8s', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                    {/* 選擇性加入的 Hook：讓他懷疑自己 */}
                    <div style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.8 }}>
                        你確定你真的有在聽嗎？
                    </div>

                    <button
                        onClick={() => router.push('/courses/ear-opening/play')} // 導向 Bass 體驗關卡
                        style={{
                            background: 'linear-gradient(135deg, #38bdf8, #10b981)',
                            color: '#020617',
                            border: 'none',
                            padding: '1.2rem 3.5rem',
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 30px rgba(56,189,248,0.3)',
                            letterSpacing: '1px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(56,189,248,0.3)';
                        }}
                    >
                        我到底漏掉了什麼？ ✨
                    </button>
                </div>

            </div>

            {/* 🎨 核心動畫樣式注入 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .fade-in-line {
                    opacity: 0;
                    transform: translateY(15px);
                    animation: fadeInUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulseBg {
                    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                }
            `}} />
        </div>
    );
}