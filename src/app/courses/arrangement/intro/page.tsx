"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ArrangementIntro() {
    const router = useRouter();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        position: 'relative' as const, // 讓進度標籤可以絕對定位
    };

    const levelBadgeStyle = {
        position: 'absolute' as const,
        top: '1rem',
        right: '1.5rem',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '1px'
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>

            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* --- 1. Header 區塊 (沉浸破題) --- */}
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

                    {/* 重新定義編曲與旋律 */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(249, 115, 22, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                        <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1.05rem' : '1.15rem', lineHeight: '1.7' }}>
                            <strong style={{ color: '#38bdf8' }}>🎵 旋律 (Melody)</strong> 是這首歌的主角在「說什麼話」。<br />
                            <strong style={{ color: '#f97316' }}>📖 編曲 (Arrangement)</strong> 則是為這段對話設計出完美的場景、燈光與配角。<br /><br />
                            編曲不是單純把一堆樂器全加上去，而是決定：<br />
                            👉 什麼時候出現｜👉 誰該站前面｜👉 誰該退後｜👉 哪裡該讓開。<br /><br />
                            這是把一段凌亂的「想法」，變成一個<strong style={{ color: '#fff' }}>「可以被記住的聲音」</strong>的過程。
                        </p>
                    </div>

                    <p style={{
                        color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.15rem', maxWidth: '700px', margin: '0 auto',
                        lineHeight: '1.8', padding: isMobile ? '0 0.5rem' : '0'
                    }}>
                        你明明什麼都有寫（鼓、和弦、旋律），但聽起來卻不像一首「作品」。<br />
                        <strong style={{ color: '#fca311' }}>不是因為你不會寫，而是因為你還不會「安排」。</strong>
                    </p>
                </header>

                {/* --- 2. 核心觀念：電影比喻 --- */}
                <section style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px', padding: isMobile ? '1.5rem' : '3.5rem', marginBottom: '3rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', width: '100%', boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '2rem' : '3rem', alignItems: 'stretch' }}>

                        {/* 左側：文案區 */}
                        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'keep-all', lineHeight: '1.4' }}>
                                <span style={{ background: '#f97316', padding: isMobile ? '6px' : '8px', borderRadius: '12px', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🎬</span>
                                如果這首歌是一部電影...
                            </h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: isMobile ? '1rem' : '1.1rem', textAlign: 'justify' }}>
                                你現在的狀態是：<strong style={{ color: '#ef4444' }}>所有角色同時搶鏡頭。</strong><br />
                                觀眾只會覺得——亂。<br /><br />
                                但真正的作品，是這樣：<br />
                                👉 該安靜的時候安靜<br />
                                👉 該爆發的時候爆發<br />
                                👉 每一個聲音，都有位置
                            </p>
                            <div style={{ borderLeft: '4px solid #f97316', padding: '1.2rem', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '0 12px 12px 0' }}>
                                <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: '1.6', display: 'block' }}>
                                    接下來這一章你會學到：不是怎麼寫更多。<br />
                                    而是——<strong style={{ color: '#fff' }}>👉 怎麼讓已經有的東西「變好聽」。</strong>
                                </span>
                            </div>
                        </div>

                        {/* 右側：重點卡片 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#fca311', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>📝 決定類型</h4>
                                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    這首歌，是要讓人點頭，還是讓人掉淚？
                                    👉 這一步，決定了整首歌的靈魂走向。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#f97316', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🎸 角色分配</h4>
                                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    不是每個聲音都要大聲，而是要讓「重要的聲音被聽見」。
                                    👉 頻率分配做對，不用混音也很清楚。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#e2e8f0', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🎢 劇情轉折</h4>
                                <p style={{ color: '#cbd5e1', margin: '0 0 10px 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    沒有起伏的音樂，就像沒有高潮的電影。
                                    👉 真正厲害的，是讓副歌出來那一刻，觀眾有感覺。
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- 🔬 2.5 實驗室傳送門 (強化點擊版) --- */}
                <section style={{ marginBottom: isMobile ? '3rem' : '5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.03), rgba(252, 163, 17, 0.08))',
                        padding: isMobile ? '2rem' : '2.5rem 3rem', borderRadius: '24px',
                        border: '1px solid rgba(252, 163, 17, 0.25)', display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center', gap: '2.5rem', boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.85rem', color: '#fca311', fontWeight: 'bold', letterSpacing: '3px' }}>互動式聲場舞台設計 (INTERACTIVE STAGE DESIGN)</span>
                            <h3 style={{ color: '#fff', fontSize: '1.6rem', margin: '0.5rem 0 1rem 0', fontWeight: 'bold' }}>
                                在編寫音符之前，先學會一件更關鍵的事：<br />👉「聲音要站在哪裡」
                            </h3>
                            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.7', fontSize: '1.05rem' }}>
                                戴上耳機進來體驗：你會聽到 『混亂 vs 清晰』 與 『擁擠 vs 寬廣』。
                                這一關，會直接改變你的耳朵。<br />
                                <strong style={{ color: '#ef4444', display: 'inline-block', marginTop: '10px' }}>
                                    👉 進來玩玩看，你會第一次聽到：「為什麼你的歌會糊」。
                                </strong>
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

                {/* --- 3. 四大里程碑 (加入 LEVEL 標籤與名詞解釋) --- */}
                <section style={{ marginBottom: isMobile ? '3rem' : '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', color: '#fff', margin: 0, wordBreak: 'keep-all' }}>🗺️ 編曲破關路線圖</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                        gap: '1.5rem'
                    }}>

                        {/* 關卡 1 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #ea580c' }}>
                            <div style={levelBadgeStyle}>LEVEL 1 / 4</div>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🥁</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>Groove (節奏骨架)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                不是節奏而已，是「會讓人動的節奏」。當 Kick 跟 Bass 開始鎖在一起，你的音樂才會開始有生命。
                            </p>
                        </div>

                        {/* 關卡 2 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #facc15' }}>
                            <div style={levelBadgeStyle}>LEVEL 2 / 4</div>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🎹</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>Voicing (把位與音區)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                決定每個樂器要在哪一個「八度」或「指板位置」發聲。學會把樂器錯開在不同頻率樓層，而不是全擠在一樓，你會第一次聽到清澈的「空間感」。
                            </p>
                        </div>

                        {/* 關卡 3 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #22c55e' }}>
                            <div style={levelBadgeStyle}>LEVEL 3 / 4</div>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🛡️</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>Masking (頻率遮蔽預防)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                當兩個聲音頻率重疊，強勢的聲音會把弱勢的聲音「吃掉」或變糊。問題不是 EQ 不夠強，而是你一開始就寫錯了。這關教你在編曲階段就避開頻率車禍。
                            </p>
                        </div>

                        {/* 關卡 4 */}
                        <div style={{ ...cardStyle, borderTop: '4px solid #3b82f6' }}>
                            <div style={levelBadgeStyle}>LEVEL 4 / 4</div>
                            <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem' }}>🎢</div>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>Dynamics (動態與曲式)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                音樂的呼吸與劇情張力。不是從頭到尾把音軌塞滿、弄得很大聲，而是精心設計「收與放、起與伏」。何時該安靜、何時該爆發，這才是讓人起雞皮疙瘩的關鍵。
                            </p>
                        </div>

                    </div>
                </section>

                {/* --- 4. CTA 按鈕 (核彈級轉換) --- */}
                <section style={{ textAlign: 'center', marginTop: isMobile ? '4rem' : '6rem', paddingBottom: '3rem' }}>

                    <p style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                        讓你的音樂，<br />第一次開始<strong style={{ color: '#fca311', fontSize: '1.8rem' }}>「會動」</strong>。
                    </p>

                    <button
                        onClick={() => router.push('/courses/arrangement/groove-game')}
                        style={{
                            background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem',
                            fontSize: isMobile ? '1.1rem' : '1.4rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(234, 88, 12, 0.4)',
                            transition: 'transform 0.2s',
                            width: isMobile ? '100%' : 'auto',
                            boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 LEVEL 1：Groove 節奏骨架 ➔
                    </button>
                    <div style={{ marginTop: '2.5rem', color: '#475569', letterSpacing: isMobile ? '1px' : '3px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        LIFREEDOM STUDIO | ACADEMY SYSTEM
                    </div>
                </section>

            </div>
        </div>
    );
}