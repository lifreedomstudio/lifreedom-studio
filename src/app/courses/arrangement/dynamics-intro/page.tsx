"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DynamicsIntroPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

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
            padding: isMobile ? '2rem 1rem' : '6rem 2rem',
            fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>

            <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>

                {/* 章節標題 */}
                <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '3rem' }}>
                    PHASE 04 — THE BREATH OF SOUND
                </div>

                {/* 已知回顧 */}
                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem' : '3rem', marginBottom: '3rem' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>你現在已經知道：</h3>
                    <ul style={{ color: '#10b981', fontSize: '1.2rem', lineHeight: '2', margin: '0 0 2rem 0', listStyle: 'none', padding: 0 }}>
                        <li>✔ 怎麼讓聲音不打架 <span style={{ color: '#64748b', fontSize: '1rem' }}>(Voicing 樓層分配)</span></li>
                        <li>✔ 怎麼讓主體不被吃掉 <span style={{ color: '#64748b', fontSize: '1rem' }}>(Masking 空間切割)</span></li>
                    </ul>

                    {/* 破壞點 */}
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>但你可能已經發現一件事：</h3>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '1.5rem', borderRadius: '12px' }}>
                        <p style={{ color: '#fca5a5', margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>👉 有些聲音「一下出來，一下消失」</p>
                        <p style={{ color: '#fca5a5', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>👉 有些聲音「忽大忽小，無法穩定」</p>
                    </div>

                    {/* 💡 致命優化 1：痛點共鳴句 */}
                    <p style={{ color: '#fca5a5', marginTop: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: 0 }}>
                        你可能會開始懷疑：<br />
                        👉 <strong>「明明已經調好了，為什麼還是聽起來不專業？」</strong>
                    </p>
                </div>

                {/* 揭示真相 */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: '#fff', fontWeight: '900', margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>
                        這不是空間問題，<br />
                        這是<span style={{ color: '#facc15', textShadow: '0 0 20px rgba(250,204,21,0.3)' }}>「動態（Dynamics）」</span>
                    </h2>

                    {/* 💡 致命優化 2：具體化的能力感 */}
                    <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                        下一關，你會學會<strong style={{ color: '#fff' }}>「控制聲音的呼吸與穩定度，讓它該出來的時候出來」</strong>。
                    </p>

                    {/* 💡 致命優化 5：隱約威脅 (Loss Aversion) */}
                    <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
                        ⚠️ 記住：如果沒有控制動態，再好的編曲也會聽起來「業餘且不穩」。
                    </p>
                </div>

                {/* 底部行動區塊 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* 💡 致命優化 4：微成就感 */}
                    <div style={{ color: '#10b981', marginBottom: '1.2rem', fontSize: '1.15rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        🎉 你已經完成編曲核心 70%
                    </div>

                    {/* 💡 致命優化 3：更具誘惑力的 CTA */}
                    <button
                        onClick={() => router.push('/courses/arrangement/dynamics-game')}
                        style={{
                            padding: '1.4rem 3rem', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: '900', borderRadius: '16px',
                            border: 'none', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(56,189,248,0.4)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        🚀 進入動態實驗室（讓聲音開始「活起來」）➔
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}