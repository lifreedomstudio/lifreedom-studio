"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GrooveChapterPage() {
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
            minHeight: '100vh',
            background: '#020617',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '2rem 1.5rem' : '4rem 2rem',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
                <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: '900', color: '#fff', marginBottom: '1rem' }}>
                    Groove 理論與建構
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    你已經在剛剛的遊戲中證明了你的直覺。<br />
                    現在，我們要把直覺變成一套<strong style={{ color: '#fca311' }}>「可複製的理論模型」</strong>。<br /><br />
                    這個頁面正在搭建中，我們將在這裡揭開 Kick 與 Bass 鎖定的秘密，並設置進階能力的解鎖卡點。
                </p>
                <button
                    onClick={() => router.push('/courses/arrangement/groove-game')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        color: '#38bdf8',
                        border: '1px solid #38bdf8',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    ⬅️ 返回 Groove 遊戲測試
                </button>
            </div>
        </div>
    );
}