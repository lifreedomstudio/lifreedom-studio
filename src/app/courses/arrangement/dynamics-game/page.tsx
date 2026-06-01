"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 💡 優化 1：關卡語意轉化為中文遊戲化術語
type GamePhase = '導言篇章' | '音量布局' | '張力鋪陳' | '瞬間留白' | '大師模式';

export default function DynamicsGamePage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const [phase, setPhase] = useState<GamePhase>('導言篇章');
    const [producerVoice, setProducerVoice] = useState<string | null>(null);

    // 🎛️ 沙盒狀態管理
    const [verseVolume, setVerseVolume] = useState(70);
    const [chorusVolume, setChorusVolume] = useState(70);
    const [hasGap, setHasGap] = useState(false);
    const [tensionLevel, setTensionLevel] = useState<'平淡' | '高亢'>('平淡');

    // 0.3秒全黑體感狀態
    const [isBlackout, setIsBlackout] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 🎛️ 製作人導師監聽回饋
    const triggerProducerVoice = (msg: string) => {
        setProducerVoice(msg);
        setTimeout(() => setProducerVoice(null), 3500);
    };

    // 處理 Q1 布局提交
    const submitVolumeLayout = () => {
        if (verseVolume >= chorusVolume) {
            triggerProducerVoice("🎛️ 製作人視角：「主歌的能量高於或等於副歌？這樣會讓副歌進場時失去重力，聽眾抓不到高潮。」");
        } else if (chorusVolume - verseVolume < 25) {
            triggerProducerVoice("🎛️ 製作人視角：「對比度不夠強烈。主歌太滿了，你正在削弱副歌爆發時的情緒落差。」");
        } else {
            setPhase('張力鋪陳');
        }
    };

    // 處理 Q3 瞬間留白體感
    const triggerDropExperice = (chooseGap: boolean) => {
        if (chooseGap) {
            setHasGap(true);
            setIsBlackout(true); // 觸發全黑
            setTimeout(() => {
                setIsBlackout(false);
                setPhase('大師模式');
            }, 400); // 體感核心 0.3~0.4 秒
        } else {
            triggerProducerVoice("🎛️ 製作人視角：「直接衝進去雖然有速度感，但少了進副歌前那一瞬間的『屏息感』，爆發力會大打折扣。再試一次！」");
        }
    };

    // 📊 即時變動的沙盒波形 Timeline (玩家操作直接改變波形)
    const renderSandboxTimeline = () => {
        const colors = {
            default: '#1e293b',
            active: '#38bdf8',
            success: '#10b981',
            drop: '#ef4444'
        };

        return (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: isMobile ? '6px' : '12px', height: '180px', marginBottom: '3rem', padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>

                {/* Verse 區塊：高度直接連動 verseVolume state */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '100%', height: `${verseVolume * 1.3}px`, background: phase === '音量布局' ? colors.active : colors.success, borderRadius: '6px', transition: 'height 0.2s ease' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Verse ({verseVolume}%)</span>
                </div>

                {/* Pre-Chorus 區塊：高度與形狀連動 tensionLevel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                        width: '100%',
                        height: tensionLevel === '高亢' ? '110px' : `${verseVolume * 1.2}px`,
                        background: phase === '張力鋪陳' ? colors.active : '#facc15',
                        borderRadius: '6px', transition: 'all 0.3s ease',
                        clipPath: tensionLevel === '高亢' ? 'polygon(0% 60%, 100% 0%, 100% 100%, 0% 100%)' : 'none' // 創造斜率張力感
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Pre-Chorus</span>
                </div>

                {/* 0.3秒斷崖留白 Gap 視覺 */}
                <div style={{
                    width: hasGap ? (isMobile ? '12px' : '20px') : '0px',
                    height: '130px',
                    background: 'transparent',
                    borderLeft: hasGap ? '1px dashed #ef4444' : 'none',
                    borderRight: hasGap ? '1px dashed #ef4444' : 'none',
                    transition: 'width 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {hasGap && <span style={{ fontSize: '10px', color: '#ef4444', writingMode: 'vertical-lr' }}>GAP</span>}
                </div>

                {/* Chorus 1 區塊：高度連動 chorusVolume */}
                <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '100%', height: `${chorusVolume * 1.3}px`, background: phase === '音量布局' ? colors.active : colors.drop, borderRadius: '6px', transition: 'height 0.2s ease', boxShadow: phase === '大師模式' ? '0 0 25px rgba(239, 68, 68, 0.4)' : 'none' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Chorus ({chorusVolume}%)</span>
                </div>

                {/* Bridge 區塊 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '100%', height: `${verseVolume * 0.9}px`, background: '#475569', borderRadius: '6px' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Bridge</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '2rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', transition: 'background 0.1s ease'
        }}>

            {/* 💡 優化 2：Q3 專屬全黑心跳體感核心 */}
            {isBlackout && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: '#000', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulseHeartbeat 0.4s infinite'
                }}>
                    <div style={{ color: '#ef4444', fontSize: '3rem', fontWeight: 'bold', letterSpacing: '4px', opacity: 0.8 }}>💓 BUM...</div>
                </div>
            )}

            <div style={{ maxWidth: '800px', width: '100%' }}>

                {/* --- 關卡階段 0：導言篇章 --- */}
                {phase === '導言篇章' && (
                    <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
                        <div style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '2rem' }}>
                            DYNAMIC GAME SYSTEM
                        </div>
                        <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1.5rem 0', color: '#fff' }}>
                            你能讓這首歌<span style={{ color: '#facc15' }}>「活過來」</span>嗎？
                        </h1>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px', marginBottom: '3rem' }}>
                            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.8', margin: 0 }}>
                                你已經完成了完美的編配，樂器整齊劃一，空間毫無遮蔽。<br />
                                但在監聽耳機裡，你發現音樂聽起來像一條死板的直線（🟦 太平）。<br /><br />
                                <strong>這首歌曲現在缺乏呼吸與能量落差。</strong><br />
                                接下來，你將親自調整推桿，在極簡沙盒中雕塑這首歌的「能量曲線」。
                            </p>
                        </div>
                        <button
                            onClick={() => setPhase('音量布局')}
                            style={{
                                padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px',
                                border: 'none', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s'
                            }}
                        >
                            🎮 進入音樂沙盒大廈 ➔
                        </button>
                    </div>
                )}

                {/* --- 遊戲核心運作介面 --- */}
                {phase !== '導言篇章' && (
                    <>
                        {/* 頂部波形沙盒監聽器 */}
                        {renderSandboxTimeline()}

                        <div style={{ position: 'relative', minHeight: '260px' }}>

                            {/* 製作人導師聲音反饋 */}
                            {producerVoice && (
                                <div style={{ position: 'absolute', top: '-40px', left: '0', right: '0', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '14px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', animation: 'shake 0.4s', zIndex: 10 }}>
                                    {producerVoice}
                                </div>
                            )}

                            {/* 關卡一：音量布局 */}
                            {phase === '音量布局' && (
                                <div style={{ animation: 'fadeInUp 0.5s ease-out', textAlign: 'center' }}>
                                    <div style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>STAGE 01：音量布局 (Volume Layout)</div>
                                    <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 'bold' }}>請推動滑桿，設計主歌與副歌的「核心能量落差」：</h2>

                                    {/* 實時滑桿控制 */}
                                    <div style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ width: '120px', textAlign: 'left', color: '#cbd5e1' }}>主歌 (Verse) 音量</span>
                                            <input type="range" min="10" max="100" value={verseVolume} onChange={(e) => setVerseVolume(Number(e.target.value))} style={{ flex: 1, accentColor: '#38bdf8' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ width: '120px', textAlign: 'left', color: '#cbd5e1' }}>副歌 (Chorus) 音量</span>
                                            <input type="range" min="10" max="100" value={chorusVolume} onChange={(e) => setChorusVolume(Number(e.target.value))} style={{ flex: 1, accentColor: '#ef4444' }} />
                                        </div>
                                    </div>

                                    <button onClick={submitVolumeLayout} style={{ padding: '1rem 3rem', background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                                        確認推桿布局，送出監聽 ➔
                                    </button>
                                </div>
                            )}

                            {/* 關卡二：張力鋪陳 */}
                            {phase === '張力鋪陳' && (
                                <div style={{ animation: 'fadeInUp 0.5s ease-out', textAlign: 'center' }}>
                                    <div style={{ color: '#facc15', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>STAGE 02：張力鋪陳 (Tension Build)</div>
                                    <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '2rem' }}>在進入大爆發前，你打算怎麼處理「導歌 (Pre-Chorus)」的情緒曲線？</h2>

                                    <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', maxWidth: '600px', margin: '0 auto' }}>
                                        <button
                                            onClick={() => { setTensionLevel('平淡'); triggerProducerVoice("🎛️ 製作人視角：「導歌如果跟主歌一樣平淡，副歌進來時會顯得很突兀，沒有被托上去的感覺。」"); }}
                                            style={{ ...btnStyle, border: tensionLevel === '平淡' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)' }}
                                        >
                                            讓音量保持平穩
                                        </button>
                                        <button
                                            onClick={() => { setTensionLevel('高亢'); setTimeout(() => setPhase('瞬間留白'), 800); }}
                                            style={{ ...btnStyle, background: 'rgba(250, 204, 21, 0.1)', border: tensionLevel === '高亢' ? '1px solid #facc15' : '1px solid rgba(255,255,255,0.1)' }}
                                        >
                                            向上拉起斜率，堆疊張力
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 關卡三：瞬間留白 */}
                            {phase === '瞬間留白' && (
                                <div style={{ animation: 'fadeInUp 0.5s ease-out', textAlign: 'center' }}>
                                    <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>STAGE 03：瞬間留白 (The Drop Test)</div>
                                    <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '2rem' }}>張力拉到極限了！在砸下副歌的第一個重音前，你要不要安排「全場安靜 0.3 秒」？</h2>

                                    <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', maxWidth: '600px', margin: '0 auto' }}>
                                        <button onClick={() => triggerDropExperice(true)} style={{ ...btnStyle, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', fontWeight: 'bold' }}>
                                            要！安排一瞬間的呼吸留白
                                        </button>
                                        <button onClick={() => triggerDropExperice(false)} style={btnStyle}>
                                            不要，直接毫無保留地衝進副歌
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 結算關卡：大師模式 */}
                            {phase === '大師模式' && (
                                <div style={{ animation: 'fadeInUp 0.8s ease-out', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', background: 'linear-gradient(145deg, #0f172a, #020617)', border: '1px solid #10b981', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)', width: '100%' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                                        <h2 style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 1.5rem 0', letterSpacing: '2px' }}>
                                            音樂成功復活！(YOUR MIX IS ALIVE)
                                        </h2>

                                        {/* 💡 優化 4：回放玩家剛剛親自雕塑的音樂大師決策 */}
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', textAlign: 'left', margin: '0 auto 2rem auto', maxWidth: '450px', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.85rem' }}>📊 你的製作人編配曲線紀錄：</div>
                                            <div style={{ color: '#cbd5e1', marginBottom: '6px' }}>• <strong>音量落差：</strong> 主歌保持輕柔的 {verseVolume}% ➔ 副歌衝上爆發的 {chorusVolume}% (落差高達 {chorusVolume - verseVolume}%)</div>
                                            <div style={{ color: '#cbd5e1', marginBottom: '6px' }}>• <strong>張力過渡：</strong> 成功引導導歌向上堆疊斜率，完成情緒鋪墊。</div>
                                            <div style={{ color: '#cbd5e1' }}>• <strong>呼吸設計：</strong> 成功嵌入 0.3 秒空氣感留白，製造完美的斷崖 Drop 衝擊。</div>
                                        </div>

                                        <ul style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '2', margin: '0 0 2.5rem 0', listStyle: 'none', padding: 0, textAlign: 'center' }}>
                                            <li><strong style={{ color: '#10b981' }}>✔ 你創造了強烈的對比感 (Contrast)</strong></li>
                                            <li><strong style={{ color: '#facc15' }}>✔ 你建立了音軌的張力拉扯 (Tension)</strong></li>
                                            <li><strong style={{ color: '#38bdf8' }}>✔ 你給予了音樂最缺乏的呼吸感 (Breath)</strong></li>
                                        </ul>

                                        <button
                                            onClick={() => router.push('/courses/arrangement/dynamics-theory')}
                                            style={{
                                                width: '100%', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '14px',
                                                border: 'none', background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#022c22', cursor: 'pointer',
                                                boxShadow: '0 10px 30px rgba(34,197,94,0.4)', transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        >
                                            解鎖大腦：進入 Dynamics 核心理論 ➔
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                @keyframes pulseHeartbeat {
                    0% { transform: scale(1); }
                    30% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
            ` }} />
        </div>
    );
}

const btnStyle = {
    flex: 1, padding: '1.2rem', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
    borderRadius: '16px', cursor: 'pointer', fontSize: '1.05rem', transition: 'all 0.2s'
};