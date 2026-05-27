"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎛️ 1. Gain (增益) 視覺組件：波形縮放 ---
const GainWaveformVisual = ({ isMobile }: { isMobile: boolean }) => {
    const [gainLevel, setGainLevel] = useState(50); // 0-100

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#0f172a', padding: '30px', borderRadius: '24px', border: '2px solid #334155', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' }}>Clip Gain</span>
                <span style={{ color: gainLevel > 80 ? '#ef4444' : '#38bdf8', fontWeight: 'bold' }}>
                    {gainLevel > 80 ? '危險 (Clipping)' : '健康 (-12dB)'}
                </span>
            </div>

            {/* 波形展示區 */}
            <div style={{ width: '100%', height: '120px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: `1px solid ${gainLevel > 80 ? '#ef4444' : '#38bdf8'}`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* 0dB 天花板線 */}
                <div style={{ position: 'absolute', top: '10%', left: 0, width: '100%', height: '1px', borderTop: '1px dashed #ef4444', opacity: 0.5 }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: 0, width: '100%', height: '1px', borderTop: '1px dashed #ef4444', opacity: 0.5 }}></div>

                {/* 動態變化的波形 */}
                <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%', transform: `scaleY(${gainLevel / 50})`, transition: 'transform 0.1s linear' }}>
                    <path d="M0,50 L20,30 L40,70 L60,20 L80,80 L100,10 L120,90 L140,30 L160,70 L180,40 L200,50" fill="none" stroke={gainLevel > 80 ? '#fca5a5' : '#38bdf8'} strokeWidth="3" strokeLinejoin="round" />
                </svg>
            </div>

            {/* 互動滑桿 */}
            <input
                type="range"
                min="10"
                max="100"
                value={gainLevel}
                onChange={(e) => setGainLevel(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: gainLevel > 80 ? '#ef4444' : '#38bdf8' }}
            />
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
                試著拉動滑桿：Gain 是直接放大「波形本身」。太大聲撞到紅線就會產生刺耳的爆音！
            </p>
        </div>
    );
};

// --- 🧠 2. 頻率分工視覺圖 (公司職位比喻) ---
const EQRolesVisual = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '30px' }}>
        {[
            { range: '20-100Hz', role: '地基保全 (Kick/Bass)', desc: '提供重量，保持穩定，不准亂跑。', color: '#ef4444' },
            { range: '200-500Hz', role: '溫暖主管 (Body)', desc: '聲音的厚度，太多會變混濁。', color: '#f59e0b' },
            { range: '1k-3kHz', role: '執行長 CEO (Vocal)', desc: '最核心的穿透力，必須清晰亮眼。', color: '#10b981' },
            { range: '10k-20kHz', role: '公關宣傳部門 (Air)', desc: '負責把最好的質感行銷出去，細膩呼吸感。', color: '#38bdf8' },
        ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${item.color}` }}>
                <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 'bold' }}>{item.range}</div>
                <h4 style={{ margin: '5px 0', color: '#fff' }}>{item.role}</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{item.desc}</p>
            </div>
        ))}
    </div>
);

// --- 📖 混音課程主頁面 (前言總覽) ---
export default function MixingIntroduction() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #38bdf8', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        混音新手村：大師見面會 (INTRO)
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        混音學：把聲音從 2D 拉進 3D 世界
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        你可能已經會寫歌、會編曲，
                        但只要一混音，整首歌就糊掉、扁掉、沒層次。
                        問題不是你不夠努力，
                        而是你還沒建立「混音的思維模型」。在真正開始深造各項魔法之前，讓我們先用最生活化的方式，搞懂這幾個每天都會聽到、卻總是似懂非懂的核心名詞。
                    </p>
                </header>

                {/* 什麼是混音？ */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: isMobile ? '2rem' : '3.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ color: '#38bdf8', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                            🏠 什麼是「混音 (Mixing)」？
                        </h2>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.15rem', marginBottom: '1.5rem', textAlign: 'justify' }}>
                            新手最常犯的錯就是覺得混音就是「把每個聲音調大」。其實，混音就像是在<strong style={{ color: '#fff' }}>「佈置一間新房子」混音，不是讓聲音變大聲
                                而是讓每個聲音「待在對的位置」。</strong>。
                        </p>
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '0 12px 12px 0' }}>
                            <p style={{ color: '#f8fafc', lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>
                                想像你買了沙發（大鼓）、電視（主唱）、餐桌（吉他）。如果全部擠在客廳正中間，不僅看起來很亂，連走路都會絆倒。<br /><br />
                                混音師就像是<strong style={{ color: '#38bdf8' }}>室內設計師</strong>，負責把沙發靠牆放（調整音量/Pan）、燈光精準打在電視上（凸顯頻率）、地毯鋪在對的位置（殘響空間）。讓每個樂器都有專屬的呼吸空間，整首歌聽起來才會高級、立體！
                            </p>
                        </div>
                    </div>
                </section>

                <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 'bold' }}>🔮 混音三大神器的白話文辭典</h2>

                {/* 1. Gain Staging */}
                <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <div style={{ borderLeft: '8px solid #0284c7', paddingLeft: '20px', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. 增益 (Gain)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>混音的第一塊磚，所有魔法的源頭。</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed #38bdf8', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🚰 白話文翻譯：水龍頭的總開關</h4>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                Gain 就像是廚房水龍頭的水量設定。水（聲音）要夠大你才能洗菜（掛效果器處理）；但如果水龍頭一開始就開到緊繃，水柱會噴得到處都是，把廚房弄得一團糟（<span style={{ color: '#ef4444' }}>紅燈爆音失真</span>）。<br /><br />
                                所以我們通常會讓軌道維持在 -12dB 到 -18dB 之間，給後續的效果器留一點處理的「空間 (Headroom)」如果 Gain 一開始就錯，
                                後面所有 EQ、Compressor 都只是在補破洞。
                            </p>
                        </div>
                    </div>
                    <GainWaveformVisual isMobile={isMobile} />
                </section>

                {/* 2. Frequency & EQ */}
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ borderLeft: '8px solid #059669', paddingLeft: '20px', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.6rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. 頻率 (Frequency) & 等化器 (EQ)</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>解決樂器打架、聲音混濁的最強武器。</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed #10b981', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🏢 頻率：多層樓的公寓</h4>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                想像一首歌是一棟公寓。<strong style={{ color: '#fff' }}>地下室</strong>住著大鼓和貝斯（低頻），<strong style={{ color: '#fff' }}>中間樓層</strong>住著主唱和吉他（中頻），<strong style={{ color: '#fff' }}>頂樓陽台</strong>則是銅鈸（高頻）。如果所有人都硬擠在二樓，地板就會塌陷（聲音糊在一起）。
                            </p>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 10px 0' }}>👮 EQ：公寓社區主委</h4>
                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                                EQ 就是這棟樓的主委。如果吉他手跑到地下室佔空間（低頻太多），主委就會用 EQ 把他趕回中間樓層；如果主唱覺得房間太暗，主委就幫他把頂樓窗戶打開（提亮高頻）。<strong style={{ color: '#fff' }}>嚴格管理每個人待在對的樓層！EQ 的本質不是「讓聲音好聽」
                                    而是「讓每個聲音有空間活下來」</strong>
                            </p>
                        </div>
                    </div>
                    <EQRolesVisual />
                </section>

                {/* 3. Compressor */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ borderLeft: '8px solid #d97706', paddingLeft: '20px', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.6rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. 壓縮器 (Compressor)</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>控制聲音動態，讓聲音穩如泰山、充滿力量。</p>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.1))', padding: isMobile ? '20px' : '35px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <h4 style={{ color: '#f59e0b', fontSize: '1.3rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.8rem' }}>😡</span> 這是最白話、但業界都在用的理解方式：正在教訓你的老爸
                        </h4>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '20px' }}>把 Compressor 想像成一個脾氣暴躁，但為了你好而在管教你的老爸：</p>

                        <ul style={{ color: '#f8fafc', lineHeight: '2', fontSize: '1.05rem', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><strong style={{ color: '#f59e0b' }}>Threshold (老爸的容忍度)：</strong> 你犯的錯只要超過這條底線，老爸就發火開扁。（設定啟動壓縮的音量線）</li>
                            <li><strong style={{ color: '#f59e0b' }}>Ratio (教訓的武器)：</strong> 2:1 是原子筆，4:1 是愛的小手，無限大 (Limiter) 就是平底鍋。數值越大，把你壓得越扁。</li>
                            <li><strong style={{ color: '#f59e0b' }}>Knee (老爸的脾氣)：</strong> Soft (軟) 代表會先碎碎念警告，慢慢增加力道；Hard (硬) 代表瞬間暴怒直接開扁。</li>
                            <li><strong style={{ color: '#f59e0b' }}>Attack (衝過來的速度)：</strong> 衝得慢，你還能先逃跑偷打一下 (保留聲音的 Punch 打擊感)；衝得快，你一出聲就被瞬間按在地上。</li>
                            <li><strong style={{ color: '#f59e0b' }}>Release (多久放過你)：</strong> 放太快，你又會馬上開始作怪 (產生奇怪的抽吸效應)；放太慢，你整天都被壓抑著，聲音毫無生氣。</li>
                        </ul>
                    </div>
                </section>

                {/* 下一章 CTA 與 成就回顧 */}
                <section style={{ textAlign: 'center', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>

                    {/* 🏆 新增：你現在已學會 (成就感區塊) */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '16px', padding: '2rem', maxWidth: '650px', margin: '0 auto 4rem auto', textAlign: 'left', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)' }}>
                        <h3 style={{ color: '#10b981', fontSize: '1.3rem', margin: '0 0 1.2rem 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                            <span style={{ fontSize: '1.5rem' }}>🏆</span> 你現在已學會：
                        </h3>
                        <ul style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '2', margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>混音的本質不是變大聲，而是<strong style={{ color: '#fff' }}>分配專屬的呼吸空間</strong>。</li>
                            <li><strong style={{ color: '#38bdf8' }}>Gain (增益)</strong>：水龍頭總開關，控制健康音量與 Headroom。</li>
                            <li><strong style={{ color: '#10b981' }}>EQ (等化器)</strong>：大樓主委，嚴格管理頻率，解決樂器打架。</li>
                            <li><strong style={{ color: '#f59e0b' }}>Compressor (壓縮器)</strong>：嚴厲老爸，控制聲音動態與力量。</li>
                        </ul>
                    </div>

                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>概念裝備完畢，準備進入實戰！</h2>

                    {/* 🎯 新增：痛點引導 CTA */}
                    <p style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem', textShadow: '0 2px 10px rgba(250, 204, 21, 0.3)' }}>
                        如果你現在混音常遇到「聲音一多就糊」，下一關會直接解決這個問題 👇
                    </p>

                    <button
                        onClick={() => router.push('/courses/mixing/gain-staging-training')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', border: 'none',
                            padding: '1.2rem 4rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 1. Gain Staging 源頭管理 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}