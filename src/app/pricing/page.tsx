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
        setWaitlistEmail('');
        setSubmitSuccess(false);
        setIsSubmitting(false);
        setShowWaitlistModal(true);
    };

    const closeWaitlist = () => {
        setShowWaitlistModal(false);
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waitlistEmail) return;
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: waitlistEmail, plan: waitlistPlanType })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "提交失敗");

            setSubmitSuccess(true);
        } catch (error: any) {
            console.error("Waitlist submission failed:", error);
            alert(error.message || "發生錯誤，請稍後再試！");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <button className="nav-btn" onClick={() => router.push('/')}>
                        ⬅️ 返回首頁
                    </button>
                </div>

                {/* 💥 HERO：補上致命一刀 */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.8rem', fontWeight: '900', margin: '0 0 1.5rem 0', color: '#fff', lineHeight: '1.3' }}>
                        如果你現在還聽不出差別，<br />
                        那你做的音樂，別人也<span style={{ color: '#ef4444' }}>聽得出來差在哪</span>。
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6', fontWeight: 'bold' }}>
                        🎧 讓你第一次真正聽出差別。<br />
                        <span style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>不再憑感覺瞎猜，透過互動式特訓，建立有根據的混音決策力。</span>
                    </p>
                </header>

                {/* 🎯 痛點區：更狠、更對號入座 */}
                <section style={{ marginBottom: '6rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', maxWidth: '800px', width: '100%' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: '#fff', fontWeight: '900', marginBottom: '2rem' }}>
                            你不是不會做音樂，<br />
                            <span style={{ color: '#ef4444', fontSize: '1.8rem' }}>你是「根本聽不出問題在哪」</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div className="pain-point-card">❌ <strong>EQ 一直調</strong>，但越調越糊，完全不知道自己在幹嘛</div>
                            <div className="pain-point-card">❌ <strong>覺得差不多</strong>，但別人一聽就知道你的作品有業餘味</div>
                            <div className="pain-point-card">❌ <strong>每次都靠運氣</strong>，套 Preset 祈禱好聽，而不是靠聽覺判斷</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button className="cta-btn-primary" onClick={() => router.push('/courses/ear-opening/intro')}>
                                立即開始打破盲點 (免費)
                            </button>
                        </div>
                    </div>
                </section>

                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '3rem' }}>
                    選擇適合你的訓練方案
                </h2>

                {/* 方案卡片區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', alignItems: 'stretch' }}>

                    {/* 方案 1：Free */}
                    <div className="pricing-card free-card">
                        <h3 style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>聽覺覺醒</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem' }}>$0</div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>開始第一次「真的聽見差異」</p>

                        <ul className="feature-list">
                            <li>✔️ 基礎聽覺覺醒 (Step 0)</li>
                            <li>✔️ 解鎖基礎概念與部分互動題目</li>
                            <li>✔️ <span style={{ color: '#facc15' }}>限制音檔播放次數</span> (挑戰直覺)</li>
                            <li>✔️ <strong>3 次 AI 提示額度</strong> (體驗用)</li>
                            <li className="disabled-feature">❌ 完整訓練章節解鎖</li>
                            <li className="disabled-feature">❌ 無限重播與完整 AI 分析</li>
                        </ul>
                        <button className="plan-btn free-btn" onClick={() => router.push('/courses/ear-opening/intro')}>
                            免費體驗
                        </button>
                    </div>

                    {/* 方案 2：Core */}
                    <div className="pricing-card core-card">
                        <div className="popular-badge">推薦方案</div>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>核心訓練系統</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>399</span>
                        </div>
                        <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>/ 月 (建立真正的決策力)</p>

                        <div style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: '1rem', fontSize: '1.05rem' }}>🎧 你將獲得的能力：</div>
                        <ul className="feature-list core-features">
                            <li>🔥 <strong style={{ color: '#fff' }}>一聽就知道哪裡刺</strong>（不用再掃頻亂試）</li>
                            <li>🔥 <strong style={{ color: '#fff' }}>聽出混濁的來源</strong>（不是憑感覺）</li>
                            <li>🔥 <strong style={{ color: '#fff' }}>知道每個樂器該在哪</strong>（精準空間分配）</li>
                            <li style={{ marginTop: '10px' }}>✔️ 解鎖全部互動訓練與高階章節</li>
                            <li>✔️ <strong>無限制音檔重複播放對比</strong></li>
                            <li>✔️ <strong>每月 30 次 AI 深度分析額度</strong></li>
                        </ul>

                        {/* 💥 迫切性推力：FOMO 限量早鳥區塊 */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#fca5a5', lineHeight: '1.6' }}>
                            ⚠️ <strong>完整版即將開放</strong><br />第一批名額：限量 50 人<br />
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>現在加入名單 = 獲得專屬早鳥價</span>
                        </div>

                        <button className="plan-btn core-btn" onClick={() => openWaitlist('核心訓練系統')}>
                            獲取早鳥優先權
                        </button>
                    </div>

                    {/* 方案 3：Pro */}
                    <div className="pricing-card pro-card">
                        <h3 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }}>混音實戰系統</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>NT$</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>899</span>
                        </div>
                        <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '2rem' }}>/ 月 (大師級的極限訓練)</p>

                        <ul className="feature-list">
                            <li>⭐ <strong>進階 AI 混音 parameters 深度分析</strong></li>
                            <li>⭐ 針對弱點的個人化訓練建議</li>
                            <li>✔️ 包含 Core 方案所有內容</li>
                            <li>✔️ 每月大額度 AI 分析點數</li>
                            <li>✔️ 進階母帶動態與多軌實戰拆解</li>
                        </ul>
                        <button className="plan-btn pro-btn" onClick={() => openWaitlist('混音實戰系統')}>
                            加入早鳥等待名單
                        </button>
                    </div>

                </div>
            </div>

            {/* 🔥 升級版 Waitlist 彈出視窗 (Modal) */}
            {showWaitlistModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeWaitlist} className="modal-close-btn">✕</button>

                        {!submitSuccess ? (
                            <>
                                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>🎟️</div>
                                <h3 style={{ color: '#fff', fontSize: '1.6rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: '900' }}>
                                    {waitlistPlanType} 完整版即將開放
                                </h3>

                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
                                    <p style={{ color: '#fca311', fontSize: '1.1rem', textAlign: 'center', fontWeight: '900', margin: '0 0 1rem 0' }}>
                                        🔥 第一批名額：限量 50 人
                                    </p>
                                    <ul style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem', textAlign: 'left' }}>
                                        <li>✔ 享有<strong style={{ color: '#38bdf8' }}>專屬早鳥價格</strong></li>
                                        <li>✔ 優先通知與開通完整版權限</li>
                                        <li>✔ 解鎖隱藏訓練模組（內測版）</li>
                                    </ul>
                                </div>

                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>
                                    👇 留下 email → 我會優先通知你
                                </p>

                                <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="email"
                                        required
                                        placeholder="輸入你的常用 Email"
                                        value={waitlistEmail}
                                        onChange={(e) => setWaitlistEmail(e.target.value)}
                                        className="waitlist-input"
                                    />
                                    <button type="submit" disabled={isSubmitting} className={`waitlist-submit ${isSubmitting ? 'submitting' : ''}`}>
                                        {isSubmitting ? '保留名額中...' : '加入早鳥優先名單 🚀'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>名額保留成功！</h3>
                                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                    你已經成功進入前 50 名早鳥梯隊。<br />
                                    當完整版準備就緒時，我們會第一時間將專屬早鳥方案寄到你的信箱。
                                </p>
                                <button onClick={closeWaitlist} className="modal-close-success-btn">繼續免費體驗</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .nav-btn {
                    background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 0.6rem 1.2rem; border-radius: 50px; cursor: pointer; transition: all 0.2s;
                }
                .nav-btn:hover { color: #fff; border-color: #64748b; background: rgba(255,255,255,0.05); }

                .pain-point-card {
                    background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 18px 24px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); width: 100%; max-width: 550px; text-align: left; font-size: 1.1rem; line-height: 1.5;
                }

                .cta-btn-primary {
                    background: linear-gradient(135deg, #38bdf8, #2563eb); color: #fff; border: none; padding: 1.2rem 2.5rem; border-radius: 50px; font-weight: 900; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3);
                }
                .cta-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(56, 189, 248, 0.4); }

                .pricing-card {
                    padding: 2.5rem 2rem; border-radius: 24px; text-align: center; display: flex; flex-direction: column; height: 100%; transition: transform 0.3s;
                }
                .free-card { background: #0f172a; border: 1px solid #334155; }
                .core-card { background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 2px solid #38bdf8; position: relative; box-shadow: 0 20px 40px rgba(56, 189, 248, 0.2); transform: scale(1.02); }
                .pro-card { background: #0f172a; border: 1px solid #a78bfa; }
                
                @media (max-width: 768px) { .core-card { transform: scale(1); } }

                .popular-badge {
                    position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #38bdf8; color: #020617; padding: 4px 16px; border-radius: 20px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px;
                }

                .feature-list {
                    text-align: left; line-height: 2; margin: 0 0 2rem 0; padding: 0; list-style: none; flex: 1; font-size: 0.95rem; color: #cbd5e1;
                }
                .core-features { color: #e2e8f0; }
                .disabled-feature { color: #475569; margin-top: 5px; }

                .plan-btn { width: 100%; padding: 1rem; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: none; }
                .free-btn { background: #334155; color: #fff; }
                .free-btn:hover { background: #475569; }
                
                .core-btn { background: linear-gradient(135deg, #38bdf8, #2563eb); color: #fff; font-weight: 900; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3); }
                .core-btn:hover { transform: translateY(-3px); }
                
                .pro-btn { background: #1e1b4b; color: #a78bfa; border: 1px solid #a78bfa; }
                .pro-btn:hover { background: #2e1065; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.85); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(8px); padding: 1rem;
                }
                .modal-content {
                    background: linear-gradient(145deg, #0f172a, #1e293b); width: 100%; max-width: 450px; border-radius: 24px; border: 1px solid #475569; padding: 2.5rem; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: fadeIn 0.3s ease;
                }
                .modal-close-btn {
                    position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: color 0.2s;
                }
                .modal-close-btn:hover { color: #fff; }
                
                .waitlist-input {
                    padding: 1rem; border-radius: 12px; border: 1px solid #334155; background: #020617; color: #fff; font-size: 1rem; outline: none; transition: border-color 0.2s; text-align: center;
                }
                .waitlist-input:focus { border-color: #38bdf8; }
                
                .waitlist-submit {
                    padding: 1rem; border-radius: 12px; background: #38bdf8; color: #020617; border: none; font-size: 1.1rem; font-weight: 900; cursor: pointer; transition: background 0.2s;
                }
                .waitlist-submit:hover { background: #7dd3fc; }
                .waitlist-submit.submitting { background: #475569; cursor: not-allowed; }

                .modal-close-success-btn {
                    margin-top: 2rem; padding: 0.8rem 2rem; background: transparent; border: 1px solid #64748b; color: #94a3b8; border-radius: 50px; cursor: pointer; font-weight: bold; transition: all 0.2s;
                }
                .modal-close-success-btn:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    );
}