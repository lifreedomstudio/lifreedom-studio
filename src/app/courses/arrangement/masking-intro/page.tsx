"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MaskingIntroPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 順暢滾動回頂部的功能
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '2rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>

                {/* 🎬 SECTION 1: 開場 (認知破壞與修正) */}
                <section style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
                    <div style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>
                        PHASE 03 — THE INVISIBLE CONFLICT
                    </div>

                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: '900', margin: '0 0 2rem 0', color: '#fff', textShadow: '0 0 30px rgba(249, 115, 22, 0.3)' }}>
                        第三關：看不見的衝突
                    </h1>

                    {/* 💡 優化：語意修正，避免絕對化打破後的認知崩壞 */}
                    <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', margin: 0, lineHeight: '1.6' }}>
                            你剛剛學會了一件很重要的事：<br />
                            <strong style={{ color: '#10b981', fontSize: '1.35rem' }}>「在大多數情況下，把樂器分開樓層，可以減少打架」</strong>
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', margin: '2rem 0', opacity: 0.7 }}>
                        <div style={{ width: '2px', height: '40px', background: 'linear-gradient(to bottom, #10b981, #ef4444)', margin: '0 auto' }}></div>
                        <div style={{ fontSize: '1.5rem', animation: 'bounce 2s infinite' }}>👇</div>
                    </div>

                    {/* ⚡ 痛點秒殺：認知斷點聚焦 */}
                    <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '24px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                        <div style={{ color: '#fca5a5', fontSize: '1.25rem', lineHeight: '2', fontWeight: 'bold' }}>
                            👉 Voicing 讓聲音「不打架」<br />
                            <strong style={{ color: '#ef4444', fontSize: '1.45rem' }}>👉 Masking 讓聲音「直接消失」</strong>
                        </div>
                    </div>
                </section>

                {/* 💥 SECTION 2: 觀念轉折 (情緒壓縮) */}
                <section style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>

                        <div style={{ color: '#fca311', fontSize: '1rem', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '0.5rem' }}>這種現象叫做：</div>
                        <h2 style={{ fontSize: isMobile ? '2.2rem' : '3rem', color: '#f97316', marginBottom: '0.5rem', fontWeight: '900', letterSpacing: '2px' }}>
                            MASKING <span style={{ fontSize: '1.5rem', color: '#fb923c' }}>(頻率遮蔽)</span>
                        </h2>
                        {/* 💡 心理轉場句 */}
                        <div style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 'bold', marginBottom: '2.5rem', opacity: 0.9 }}>
                            （從這一關開始，你的既有判斷會開始失效）
                        </div>

                        {/* 🔥 錯覺預告：讓玩家親身相信衝突 */}
                        <div style={{ background: 'rgba(249, 115, 22, 0.08)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '3rem', textAlign: 'left' }}>
                            <p style={{ color: '#fed7aa', fontSize: '1.1rem', margin: 0, lineHeight: '1.7' }}>
                                <strong>🚨 聽覺錯覺預告：</strong><br />
                                下一關你會聽到一段已經「完美分好樓層」的混音，這意味著它們在空間上本該清晰無比。但神奇的是——你仍然會完全聽不見其中一個樂器。
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', alignItems: 'stretch' }}>
                            <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ color: '#6ee7b7', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '10px' }}>上一關觀念</div>
                                <div style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>🏢 Voicing 解決</div>
                                <div style={{ color: '#fff', fontSize: '1.1rem' }}>「空間重疊」</div>
                            </div>

                            <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ color: '#fca5a5', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '10px' }}>這一關觀念</div>
                                <div style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}>👻 Masking 解決</div>
                                <div style={{ color: '#fff', fontSize: '1.1rem' }}>「即使不重疊，也會消失」</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🧠 SECTION 3: 房間比喻 (大腦注意力機制升級) */}
                <section style={{ background: '#0f172a', borderLeft: '4px solid #38bdf8', borderRadius: '0 24px 24px 0', padding: isMobile ? '2rem 1.5rem' : '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
                    <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>💡</span> 聲學物理與大腦機制的博弈：
                    </h3>

                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        想像你在一個房間裡：<br />
                        👉 有一個人在大聲說話（代表大鼓 Kick / 貝斯 Bass）<br />
                        👉 另一個人同時也在說話（代表細節 Vocal / 吉他 Guitar）
                    </p>

                    <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed rgba(56, 189, 248, 0.2)' }}>
                        <p style={{ color: '#bae6fd', fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                            你最後會完全聽不到第二個人說話。
                        </p>
                        <p style={{ color: '#fff', fontSize: '1.25rem', margin: 0, fontWeight: '900', lineHeight: '1.6' }}>
                            這不是因為他不在，也不是因為他音量小，<br />
                            <span style={{ color: '#fca311' }}>而是因為你大腦的聽覺神經，主動「選擇性忽略了其中一個」。</span>
                        </p>
                    </div>
                </section>

                {/* 🚪 SECTION 4: 可控式路徑導向 (CTA) */}
                <section style={{ textAlign: 'center', paddingBottom: '4rem', marginTop: '1rem', animation: 'fadeInUp 0.6s ease-out' }}>

                    {/* ⚡ 心理預期破壞點 */}
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '3rem', display: 'inline-block', maxWidth: '600px', textAlign: 'left' }}>
                        <p style={{ color: '#fca5a5', margin: 0, fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.6' }}>
                            🔥 慣性思考切斷門檻：<br />
                            從這一關開始，所有音樂變糊的正確答案，再也不是「將它們移往不同樓層分開」。
                        </p>
                    </div>

                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 2.5rem 0' }}>
                        開局選擇：你的下一步行動
                    </h2>

                    {/* 💡 產品級升級：三向可控學習路徑按鈕 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '480px', margin: '0 auto' }}>

                        {/* 主要動作按鈕 */}
                        <button
                            onClick={() => router.push('/courses/arrangement/masking-game')}
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff',
                                border: 'none', padding: '1.2rem 2rem', fontSize: '1.2rem', fontWeight: '900',
                                borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(234, 88, 12, 0.4)',
                                transition: 'transform 0.2s', width: '100%'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            🎧 找出被遮住的聲音 (開始實驗) ➔
                        </button>

                        {/* 輔助路徑 1：滾動回上方 */}
                        <button
                            onClick={scrollToTop}
                            style={{
                                background: 'rgba(255,255,255,0.03)', color: '#94a3b8',
                                border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 'bold',
                                borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                            }}
                            onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            🤔 我想重新看一次概念
                        </button>

                        {/* 輔助路徑 2：彈性提示 */}
                        <button
                            onClick={() => alert("💡 偵探提示：在即將到來的盲測中，不要去想音符有沒有撞車，而是去注意有哪個樂器『在樂曲大聲時不見，在小聲時又突然冒出來』。那就是被遮蔽的證據！")}
                            style={{
                                background: 'transparent', color: '#38bdf8',
                                border: '1px dashed rgba(56, 189, 248, 0.3)', padding: '1rem 2rem', fontSize: '0.95rem', fontWeight: 'bold',
                                borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                            🧠 我需要一些作弊提示
                        </button>
                    </div>
                </section>

            </div>

            {/* 🎨 高級感調校：大幅減少連續震盪動畫，保留純淨的高級感 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounce { 
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
                    40% { transform: translateY(-8px); } 
                    60% { transform: translateY(-4px); } 
                }
            ` }} />
        </div>
    );
}