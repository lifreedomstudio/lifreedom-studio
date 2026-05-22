"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 模擬用戶的「創世者點數」
    const [betaCredits, setBetaCredits] = useState(1500);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleUpgrade = () => {
        alert("Beta 封測期間，已使用你的創世點數解鎖此方案！");
        // 這裡未來可以接 Supabase 扣點數的邏輯
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

                {/* 頂部宣告：點數與 Beta 狀態 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer' }}>
                        ⬅️ 返回總部
                    </button>
                    <div style={{ background: 'rgba(250, 204, 21, 0.1)', border: '1px solid #facc15', padding: '0.6rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🪙</span>
                        <span style={{ color: '#fef08a', fontWeight: 'bold' }}>創世者 Beta 點數：</span>
                        <span style={{ color: '#facc15', fontWeight: '900', fontSize: '1.2rem' }}>{betaCredits}</span>
                    </div>
                </div>

                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        投資你的製作人職涯
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        業界唯一「聽覺互動式」學習系統。<br />
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>🎉 歡慶 Beta 封測，所有註冊用戶皆獲贈 1500 點，可免費兌換高階方案！</span>
                    </p>
                </header>

                {/* 方案卡片區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', alignItems: 'center' }}>

                    {/* 方案 1：免費版 */}
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>新手道場</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem' }}>
                            免費
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>永遠免費，建立基礎觀念</p>
                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1 }}>
                            <li>✔️ 基礎編曲與混音觀念</li>
                            <li>✔️ 混音魔導書 (字彙表)</li>
                            <li>✔️ 新手全面認證大會考</li>
                            <li style={{ color: '#475569' }}>❌ 高階 3D 空間處理</li>
                            <li style={{ color: '#475569' }}>❌ 商業母帶處理實戰</li>
                        </ul>
                        <button style={{ width: '100%', padding: '1rem', background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'not-allowed' }}>
                            你目前的方案
                        </button>
                    </div>

                    {/* 方案 2：高階進階版 (主推) */}
                    <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #38bdf8', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', boxShadow: '0 20px 40px rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#020617', padding: '4px 16px', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            MOST POPULAR
                        </div>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>獨立製作人</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#64748b', textDecoration: 'line-through' }}>NT$ 400</span>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>400<span style={{ fontSize: '1rem', color: '#facc15' }}> 點</span></span>
                        </div>
                        <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 'bold' }}>/ 月 (解鎖高階技巧)</p>

                        <ul style={{ color: '#e2e8f0', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1 }}>
                            <li>✔️ 包含「新手道場」所有內容</li>
                            <li>🔥 <strong style={{ color: '#fff' }}>高階編曲學</strong> (八度音錯位)</li>
                            <li>🔥 <strong style={{ color: '#fff' }}>高階混音學</strong> (Reverb 發送)</li>
                            <li>✔️ 解鎖大師綜合理論認證</li>
                        </ul>
                        <button onClick={handleUpgrade} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            用點數立即解鎖 🚀
                        </button>
                    </div>

                    {/* 方案 3：大師版 */}
                    <div style={{ background: '#0f172a', border: '1px solid #a78bfa', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }}>好萊塢大師</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#64748b', textDecoration: 'line-through' }}>NT$ 600</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>600<span style={{ fontSize: '1rem', color: '#facc15' }}> 點</span></span>
                        </div>
                        <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '2rem' }}>/ 月 (全知全能)</p>

                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1 }}>
                            <li>✔️ 包含前兩個方案所有內容</li>
                            <li>⭐ 每月專屬實戰分軌 (Stems) 下載</li>
                            <li>⭐ <strong style={{ color: '#a78bfa' }}>AI 混音助理無限次詢問</strong></li>
                            <li>⭐ 每月一次混音作品點評 (預約制)</li>
                        </ul>
                        <button onClick={handleUpgrade} style={{ width: '100%', padding: '1rem', background: '#1e1b4b', color: '#a78bfa', border: '1px solid #a78bfa', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#2e1065'} onMouseOut={e => e.currentTarget.style.background = '#1e1b4b'}>
                            用點數升級大師 👑
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}