"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // Waitlist 狀態
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
                    <button onClick={() => router.push('/')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#64748b'; }} onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}>
                        ⬅️ 返回首頁
                    </button>
                </div>

                {/* 🎯 HERO 升級版：直擊 AI 時代痛點 */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '4rem', fontWeight: '900', margin: '0 0 2rem 0', color: '#fff', lineHeight: '1.2' }}>
                        你不是缺工具<br />
                        <span style={{ color: '#38bdf8' }}>你是缺「判斷聲音的能力」</span>
                    </h1>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                            現在這個時代：<br />
                            AI 可以幫你生成歌（像 Suno）<br />
                            DAW 可以幫你修聲音<br />
                            Plugin 可以自動混音<br />
                            <strong style={{ color: '#fca311', fontSize: '1.3rem', display: 'inline-block', marginTop: '1rem' }}>👉 但問題是：你不知道什麼是「好的」</strong>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '12px 24px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'left', fontWeight: 'bold' }}>❌ 生成出來不知道好不好</div>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '12px 24px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'left', fontWeight: 'bold' }}>❌ 混音後覺得怪但說不出來</div>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '12px 24px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'left', fontWeight: 'bold' }}>❌ 永遠卡在「好像差一點」</div>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
                            我們不是再給你一個工具<br />
                            我們在做的是：<strong style={{ color: '#10b981' }}>讓你的耳朵，變成工具</strong>
                        </h3>
                    </div>
                </header>

                {/* 💥 核心差異與分層 */}
                <section style={{ marginBottom: '6rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2rem' }}>

                    {/* 核心差異 */}
                    <div style={{ flex: 1, background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid #7c3aed', borderRadius: '24px', padding: '2.5rem' }}>
                        <h2 style={{ color: '#a78bfa', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '900' }}>💥 核心差異</h2>
                        <p style={{ color: '#cbd5e1', marginBottom: '2rem', lineHeight: '1.6' }}>這套系統將直接拉開你跟 AI 工具使用者的差距：</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <div style={{ color: '#94a3b8', textDecoration: 'line-through', marginBottom: '5px' }}>❌ AI 工具：幫你做</div>
                                <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>✅ 我們：讓你知道「為什麼這樣做」</div>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div>
                                <div style={{ color: '#94a3b8', textDecoration: 'line-through', marginBottom: '5px' }}>❌ 教學影片：告訴你怎麼調</div>
                                <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem' }}>✅ 我們：讓你「聽出來要不要調」</div>
                            </div>
                        </div>
                    </div>

                    {/* 適合誰 */}
                    <div style={{ flex: 1.5, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2.5rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '900' }}>這套系統適合誰？</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>🟢 完全不懂音樂的人</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>第一次「聽見差異」，建立感覺</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #facc15' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>🟡 用 AI 做歌的創作者</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>知道怎麼修改，讓作品「變好聽」</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>🔵 有在用 DAW 混音的人</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>從「亂調」變成「有依據的決策」</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #a78bfa' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>🟣 想進階到專業製作的人</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>建立真正的「混音判斷力」</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#fca311', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            你不需要先會，👉 你只需要開始「聽」
                        </div>
                    </div>
                </section>

                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '3rem' }}>
                    選擇你的訓練方案
                </h2>

                {/* 方案卡片區塊 (收斂主軸：你會學到什麼) */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', alignItems: 'center' }}>

                    {/* 🟢 方案 1：免費層 */}
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>聽覺覺醒 (Awareness)</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem' }}>
                            免費體驗
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>打破「聽不出來」的瓶頸</p>

                        <div style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: '1rem', fontSize: '1.1rem' }}>🎧 你會體驗到：</div>
                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li>✔️ 第一次真實感受到「頻率」的存在</li>
                            <li>✔️ 發現「動態起伏」對情緒的影響</li>
                            <li>✔️ 了解什麼叫做「聲音的立體感」</li>
                            <li style={{ color: '#475569', marginTop: '10px' }}>❌ 進階頻率遮蔽與實戰混音決策</li>
                        </ul>
                        <button onClick={() => router.push('/courses/ear-opening/intro')} style={{ width: '100%', padding: '1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#475569'} onMouseOut={e => e.currentTarget.style.background = '#334155'}>
                            開始免費探索
                        </button>
                    </div>

                    {/* 🔵 方案 2：付費核心層 */}
                    <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #38bdf8', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', boxShadow: '0 20px 40px rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#020617', padding: '4px 16px', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            核心訓練系統
                        </div>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>聲音建構者</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>399</span>
                        </div>
                        <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 'bold' }}>/ 月 (最完整的耳朵重訓計畫)</p>

                        <div style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: '1rem', fontSize: '1.1rem' }}>🎧 你會學會 (且真的聽得出來)：</div>
                        <ul style={{ color: '#e2e8f0', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li>🔥 <strong style={{ color: '#38bdf8' }}>為什麼你的音樂會糊？</strong></li>
                            <li>🔥 <strong style={{ color: '#38bdf8' }}>怎麼讓人聲站出來？</strong></li>
                            <li>🔥 <strong style={{ color: '#38bdf8' }}>為什麼低頻會鬆散？</strong></li>
                            <li>🔥 <strong style={{ color: '#38bdf8' }}>怎麼讓整體變「專業感」？</strong></li>
                            <li style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px' }}>*(包含無限制的訓練音檔與 AI 輔助解析)*</li>
                        </ul>
                        <button onClick={() => openWaitlist('聲音建構者方案')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            🚀 解鎖完整訓練 (加入等候名單)
                        </button>
                    </div>

                    {/* 🟣 方案 3：高階層 */}
                    <div style={{ background: '#0f172a', border: '1px solid #a78bfa', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }}>混音實戰系統</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>899</span>
                        </div>
                        <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '2rem' }}>/ 月 (掌握大師級的決策邏輯)</p>

                        <div style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: '1rem', fontSize: '1.1rem' }}>🎧 你會精通：</div>
                        <ul style={{ color: '#cbd5e1', textAlign: 'left', lineHeight: '2', margin: '0 0 2rem 0', padding: 0, listStyle: 'none', flex: 1, fontSize: '0.95rem' }}>
                            <li>⭐ 在 30 軌的複雜專案中找出衝突點</li>
                            <li>⭐ 判斷極限動態範圍的壓縮時機</li>
                            <li>⭐ 建立自己的混音 S.O.P 與審美標準</li>
                            <li>⭐ 參與每月真人混音作品深度拆解</li>
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