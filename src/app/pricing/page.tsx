"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 假門測試 Waitlist 狀態
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistPlanType, setWaitlistPlanType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const openWaitlist = (planName: string) => {
        setWaitlistPlanType(planName);
        setShowWaitlistModal(true);
        setSubmitSuccess(false);
        setWaitlistEmail('');
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waitlistEmail) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
        }, 1000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <button onClick={() => router.push('/')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer' }}>
                        ⬅️ 返回首頁
                    </button>
                </div>

                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        把耳朵訓練成一個可以做決策的工具
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                        業界唯一的「聽覺互動式」學習系統。<br />
                        選擇適合你的方案，持續建立你的聲音判斷力。
                    </p>
                </header>

                {/* 方案卡片區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', alignItems: 'center' }}>

                    {/* 🟢 方案 1：免費層 (Awareness Layer) */}
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>聽覺覺醒 (Awareness)</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem' }}>
                            免費
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>開始第一次「真的聽見差異」</p>

                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '1.8', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '10px' }}>✔️ <strong style={{ color: '#fff' }}>A/B 聽覺測試 (完整體驗)</strong></li>
                            <li style={{ marginBottom: '10px' }}>✔️ 解鎖前 3 關基礎訓練體驗</li>
                            <li style={{ marginBottom: '10px' }}>✔️ 每日 2 次 AI 輔助發問</li>
                            <li style={{ color: '#475569', marginBottom: '10px' }}>❌ 無限制聽覺訓練與進階音檔</li>
                            <li style={{ color: '#475569' }}>❌ 完整訓練解析與實戰內容</li>
                        </ul>
                        <button onClick={() => router.push('/courses/ear-opening/intro')} style={{ width: '100%', padding: '1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                            立即體驗
                        </button>
                    </div>

                    {/* 🔵 方案 2：付費核心層 (Skill Layer) */}
                    <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #38bdf8', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', boxShadow: '0 20px 40px rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#020617', padding: '4px 16px', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            持續變強
                        </div>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>聲音建構者</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>399</span>
                        </div>
                        <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 'bold' }}>/ 月 (從「聽見差異」到「能做出判斷」)</p>

                        <ul style={{ color: '#e2e8f0', textAlign: 'left', lineHeight: '1.8', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '10px' }}>🔥 <strong style={{ color: '#fff' }}>解鎖所有基礎與進階聽覺訓練</strong></li>
                            <li style={{ marginBottom: '10px' }}>🔥 <strong style={{ color: '#fff' }}>無限制重複練習與進階音檔</strong></li>
                            <li style={{ marginBottom: '10px' }}>✔️ 解鎖每一關的「完整訓練解析」</li>
                            <li style={{ marginBottom: '10px' }}>✔️ 支援上傳 DAW 截圖，AI 輔助分析參數</li>
                            <li>✔️ 每月 50 次 AI 分析額度</li>
                        </ul>
                        <button onClick={() => openWaitlist('聲音建構者方案')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            🚀 解鎖完整訓練 (加入等候名單)
                        </button>
                    </div>

                    {/* 🟣 方案 3：高階層 (Pro Layer) */}
                    <div style={{ background: '#0f172a', border: '1px solid #a78bfa', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }}>混音實戰系統</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>899</span>
                        </div>
                        <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '2rem' }}>/ 月 (從理解聲音 → 進入實戰決策)</p>

                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '1.8', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '10px' }}>⭐ <strong style={{ color: '#fff' }}>每月 1 次真人混音作品深度分析</strong></li>
                            <li style={{ marginBottom: '10px' }}>⭐ <strong style={{ color: '#fff' }}>解鎖最高難度實戰訓練內容</strong></li>
                            <li style={{ marginBottom: '10px' }}>✔️ 包含聲音建構者所有訓練內容</li>
                            <li style={{ marginBottom: '10px' }}>✔️ 每月 200 次 AI 分析額度</li>
                            <li>✔️ 每月專屬實戰分軌 (Stems) 練習</li>
                        </ul>
                        <button onClick={() => openWaitlist('混音實戰系統方案')} style={{ width: '100%', padding: '1rem', background: '#1e1b4b', color: '#a78bfa', border: '1px solid #a78bfa', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#2e1065'} onMouseOut={e => e.currentTarget.style.background = '#1e1b4b'}>
                            🚀 準備實戰 (加入等候名單)
                        </button>
                    </div>

                </div>
            </div>

            {/* 🚨 Waitlist 彈出視窗 (Modal) */}
            {showWaitlistModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(8px)', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #0f172a, #1e293b)', width: '100%', maxWidth: '450px', borderRadius: '24px',
                        border: '1px solid #475569', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <button onClick={() => setShowWaitlistModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>

                        {!submitSuccess ? (
                            <>
                                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>💎</div>
                                <h3 style={{ color: '#fff', fontSize: '1.5rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>
                                    {waitlistPlanType} 籌備中！
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', textAlign: 'center', lineHeight: '1.6', marginBottom: '2rem' }}>
                                    付費解鎖機制與進階訓練系統正在做最後的調校。留下 Email 加入等候名單，上線時我們將發送 <strong style={{ color: '#38bdf8' }}>首月 5 折專屬優惠碼</strong> 給你！
                                </p>
                                <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input type="email" required placeholder="輸入你的常用 Email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: '#020617', color: '#fff', fontSize: '1rem', outline: 'none' }} />
                                    <button type="submit" disabled={isSubmitting} style={{ padding: '1rem', borderRadius: '12px', background: isSubmitting ? '#475569' : '#38bdf8', color: '#020617', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                        {isSubmitting ? '處理中...' : '加入早鳥名單 🎟️'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>加入成功！</h3>
                                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>感謝你的支持！專屬折扣碼已經為你預留。<br />當進階訓練系統準備就緒時，我們會第一時間通知你。</p>
                                <button onClick={() => setShowWaitlistModal(false)} style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: 'transparent', border: '1px solid #64748b', color: '#94a3b8', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>關閉視窗</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <style jsx global>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}