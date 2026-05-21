"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 👈 1. 補上這行，啟用傳送門組件

export default function ArrangementIntro() {
    const router = useRouter();

    // 偵測手機版以調整排版
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 統一卡片樣式
    const cardStyle = {
        background: 'rgba(30, 30, 40, 0.6)',
        padding: isMobile ? '1.5rem' : '2rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.3s ease',
        boxSizing: 'border-box' as const,
        width: '100%',
        overflowWrap: 'break-word' as const,
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>

            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* --- 1. Header 區塊 --- */}
                <header style={{ textAlign: 'center', marginBottom: isMobile ? '3rem' : '5rem' }}>
                    <div style={{
                        display: 'inline-block', border: '1px solid rgba(249, 115, 22, 0.5)', background: 'rgba(249, 115, 22, 0.1)',
                        color: '#f97316', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold'
                    }}>
                        ARRANGEMENT STAGE
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '2.2rem' : '4rem', fontWeight: '900', margin: '0 0 1.5rem 0',
                        lineHeight: '1.3', wordBreak: 'keep-all'
                    }}>
                        <span style={{ color: '#f97316' }}>編曲學：</span>
                        {isMobile ? <br /> : ' '}
                        從 0 到 1 的劇本設計
                    </h1>

                    {/* 編曲定義區塊 */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(249, 115, 22, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                        <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                            <strong style={{ color: '#f97316' }}>📖 字彙定義：Arrangement (編曲)</strong> 是將一首只有和弦與旋律的「清唱或木吉他 Demo」，穿上衣服、賦予風格的過程。它包含了決定節奏速度、挑選樂器編制、設計段落起伏，最終將靈感打造成一首完整的音樂作品。
                        </p>
                    </div>

                    <p style={{
                        color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.2rem', maxWidth: '700px', margin: '0 auto',
                        lineHeight: '1.6', padding: isMobile ? '0 0.5rem' : '0'
                    }}>
                        在動手錄音之前，你必須先給樂團一份好劇本。編曲決定了這首歌的靈魂、情緒起伏，以及誰是真正的主角。
                    </p>
                </header>

                {/* --- 2. 核心觀念：電影比喻 --- */}
                <section style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px', padding: isMobile ? '1.5rem' : '3.5rem', marginBottom: '3rem', // 縮小底邊距，準備迎接實驗室
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', width: '100%', boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '2rem' : '3rem', alignItems: 'stretch' }}>

                        {/* 左側：文案區 */}
                        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'keep-all' }}>
                                <span style={{ background: '#f97316', padding: isMobile ? '6px' : '8px', borderRadius: '12px', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🎬</span>
                                如果這首歌是一部電影...
                            </h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: isMobile ? '1rem' : '1.1rem', textAlign: 'justify' }}>
                                編曲就像是「選角」與「執導」。如果同時特寫蜘蛛人、美國隊長、雷神索爾及鋼鐵人每個英雄的動作畫面，觀眾會感到混亂，無法好好去感受每個角色；正如太多樂器同時擠在中頻，聽眾會覺得混濁。
                            </p>
                            <div style={{ borderLeft: '4px solid #f97316', padding: '1rem', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '0 12px 12px 0' }}>
                                <span style={{ color: '#fca311', fontStyle: 'italic', fontWeight: 'bold', fontSize: isMobile ? '0.95rem' : '1rem', lineHeight: '1.5', display: 'block' }}>
                                    「好的編曲決定了誰是當下的英雄，誰該退居幕後。一個亂疊樂器的編曲，再神級的混音師也救不回來。」
                                </span>
                            </div>
                        </div>

                        {/* 右側：重點卡片 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#fca311', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>📝 決定類型</h4>
                                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>這是一部浪漫愛情片還是動作爽片？第一步必須確立曲風（如 R&B、EDM 或 Rock）與節奏速度 (BPM)。這會直接決定聽眾是要慵懶放鬆，還是跟著跳舞。</p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#f97316', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🎸 角色分配</h4>
                                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>誰是主角？誰是配角？該用溫暖的木吉他鋪底，還是用侵略性的合成器當作記憶點 (Hook)？合理的頻率分配能讓每個樂器都有自己的伸展台，互不搶戲。</p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#e2e8f0', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🎢 劇情轉折</h4>
                                <p style={{ color: '#cbd5e1', margin: '0 0 10px 0', fontSize: '0.95rem', lineHeight: '1.5' }}>平鋪直敘會讓人睡著，我們需要運用轉場巧思來引爆副歌的能量：</p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                                    <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>• Reverse FX (反轉音效)</strong>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>將鈸聲或合成器倒著播放，創造一種把聽眾「吸入」下一個段落的物理拉扯感。</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                                    <strong style={{ color: '#facc15', fontSize: '0.9rem' }}>• Build-up (能量堆疊)</strong>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>在副歌前透過小鼓連擊加速，或讓頻率越變越窄，藉此累積期待感，直到副歌瞬間釋放。</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- 🔬 2.5 新增：立體聲場實驗室傳送門卡片 (Upgrade!) --- */}
                <section style={{ marginBottom: isMobile ? '3rem' : '5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.03), rgba(252, 163, 17, 0.08))',
                        padding: isMobile ? '2rem' : '2.5rem 3rem', borderRadius: '24px',
                        border: '1px solid rgba(252, 163, 17, 0.25)', display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center', gap: '2.5rem', boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.85rem', color: '#fca311', fontWeight: 'bold', letterSpacing: '3px' }}>INTERACTIVE STAGE DESIGN</span>
                            <h3 style={{ color: '#fff', fontSize: '1.6rem', margin: '0.5rem 0 1rem 0', fontWeight: 'bold' }}>在編寫音符前，先學會搭建舞台</h3>
                            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.7', fontSize: '1.05rem' }}>
                                編曲不只是選樂器，更是分配「聲學空間」。<br />
                                戴上耳機進來玩玩看：親耳體驗所有樂器擠在中間的「頻率災難」，並感受 J-Rock LCR 擺位法帶來的震撼寬廣度。
                            </p>
                        </div>
                        <Link href="/courses/arrangement/sonic-lab" style={{
                            padding: '1.2rem 2.5rem', background: 'linear-gradient(135deg, #f97316, #fca311)', color: '#020617',
                            textDecoration: 'none', fontSize: '1.1rem', fontWeight: '900', borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(249, 115, 22, 0.25)', textAlign: 'center', whiteSpace: 'nowrap', transition: 'transform 0.2s'
                        }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                            🚀 進場體驗：聲場構築實驗室
                        </Link>
                    </div>
                </section>

                {/* --- 3. 四大里程碑 --- */}
                <section style={{ marginBottom: isMobile ? '3rem' : '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', color: '#fff', margin: 0, wordBreak: 'keep-all' }}>🗺️ 編曲破關路線圖</h2>
                        {!isMobile && <span style={{ color: 'rgba(249, 115, 22, 0.6)', letterSpacing: '2px', fontSize: '0.9rem' }}>PHASE 01 / 04</span>}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                        gap: '1.5rem'
                    }}>

                        {/* 關卡 1 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #ea580c' }}>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🥁</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>1. Groove (節奏骨架)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>音樂的地基。搞懂 Kick 與 Bass 的鎖定關係，建立歌曲的「脈搏」與呼吸感。</p>
                        </div>

                        {/* 關卡 2 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #facc15' }}>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🎹</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>2. Voicing (把位與音區)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>中頻生存指南。解決吉他與鋼琴同時擠在一起打架的問題，學會完美錯開物理空間。</p>
                        </div>

                        {/* 關卡 3 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #22c55e' }}>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🛡️</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>3. Masking (頻率遮蔽預防)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>在編曲階段就搞定混音。學會不彈奏的「留白藝術」，為每個聲音留出專屬窗口。</p>
                        </div>

                        {/* 關卡 4 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🎢</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>4. Dynamics (動態與曲式)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>情緒的過山車。運用 Reverse、濾波器掃描與加減法，讓副歌能量瞬間引爆。</p>
                        </div>

                    </div>
                </section>

                {/* --- 4. CTA 按鈕 --- */}
                <section style={{ textAlign: 'center', marginTop: isMobile ? '4rem' : '6rem', paddingBottom: '3rem' }}>

                    <p style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        準備好開始第一課了嗎？
                    </p>

                    <button
                        onClick={() => router.push('/courses/arrangement/groove-training')}
                        style={{
                            background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 3.5rem',
                            fontSize: isMobile ? '1.1rem' : '1.5rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(234, 88, 12, 0.4)',
                            transition: 'transform 0.2s',
                            width: isMobile ? '100%' : 'auto',
                            boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 1. Groove (節奏骨架) ➔
                    </button>
                    <div style={{ marginTop: '2.5rem', color: '#475569', letterSpacing: isMobile ? '1px' : '3px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        LIFREEDOM STUDIO | ACADEMY SYSTEM
                    </div>
                </section>

            </div>
        </div>
    );
}