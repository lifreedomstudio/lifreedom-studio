"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainingHubPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* 🔝 頂部導航 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem', flexDirection: isMobile ? 'column' : 'row', gap: '2rem' }}>
                    <div>
                        <span style={{ color: '#ea580c', fontWeight: 'bold', letterSpacing: '4px', fontSize: '0.9rem' }}>LIFREEDOM TRAINING HUB</span>
                        <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', margin: '0.5rem 0', color: '#fff', fontWeight: '900' }}>聽覺試煉大廳</h1>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>
                            這是免費對外開放的混音遊樂園。<br />
                            選擇你要鍛鍊的聽覺肌肉，進入專屬實驗室與大師一較高下。
                        </p>
                    </div>
                    <Link href="/courses" style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', textDecoration: 'none', color: '#e2e8f0', border: '1px solid #334155', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = '#334155'; }}
                    >
                        ⬅️ 返回課程總覽
                    </Link>
                </div>

                {/* ⛩️ 傳送門選單 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* 傳送門 1：EQ 實驗室 */}
                    <Link href="/courses/mixing/eq-training" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '2px solid #10b981', borderRadius: '24px', padding: '3rem 2rem',
                            transition: 'all 0.3s', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.1)';
                            }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎛️</div>
                            <h2 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>EQ 頻率管理學</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', margin: '0 0 2rem 0', flex: 1 }}>
                                前往社區管委會。訓練你的頻率聽診能力，學習如何掃頻抓蟲與互補擺位。
                            </p>
                            <div style={{ padding: '1rem', background: '#10b981', color: '#020617', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem' }}>
                                進入實驗室 ➔
                            </div>
                        </div>
                    </Link>

                    {/* 傳送門 2：Compressor 實驗室 */}
                    <Link href="/courses/mixing/compressor-training" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '2px solid #f59e0b', borderRadius: '24px', padding: '3rem 2rem',
                            transition: 'all 0.3s', cursor: 'pointer', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.1)';
                            }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🗜️</div>
                            <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>Compressor 動態老爸</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', margin: '0 0 2rem 0', flex: 1 }}>
                                進入終極道場。挑戰控制動態、創造 Punch，親自轉動旋鈕感受波形被壓扁的震撼。
                            </p>
                            <div style={{ padding: '1rem', background: '#f59e0b', color: '#020617', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem' }}>
                                進入道場 ➔
                            </div>
                        </div>
                    </Link>

                </div>

                {/* 🚀 Upsell 導購區塊 (為未來的付費牆鋪路) */}
                <div style={{ marginTop: '5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #334155', borderRadius: '24px', padding: isMobile ? '2rem' : '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
                    <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>挑戰完基礎關卡了嗎？</h3>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        當你搞懂了 EQ 與 Compressor，你已經超越了 80% 的新手。<br />
                        解鎖付費專區，學習 Reverb 空間魔法、Delay 節奏律動，以及最重要的「編曲源頭頻率學」。
                    </p>
                    <button style={{ padding: '1rem 3rem', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#020617', border: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)' }}>
                        解鎖完整製作人方案 🔓
                    </button>
                </div>

            </div>
        </div>
    );
}