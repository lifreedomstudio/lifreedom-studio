"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎛️ 核心組件：Before ➔ After 即時參數矩陣控制台 ---
const UltimateDemoPlayer = ({ isMobile }: { isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 系統層參數矩陣狀態
    const [automationMode, setAutomationMode] = useState<'Dry' | 'Wide'>('Dry');
    const [tensionMode, setTensionMode] = useState<'Flat' | 'Rising'>('Flat');
    const [fillMode, setFillMode] = useState<'NoFill' | 'WithFill'>('NoFill');

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ⚙️ 參數連動引擎：即時變更聲學感知狀態，拒絕 Reload 音檔
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let targetVolume = 0.7; // 基準衰減值 (Calm UI Layer)

        if (automationMode === 'Wide') targetVolume += 0.15;
        if (tensionMode === 'Rising') targetVolume += 0.05;
        if (fillMode === 'WithFill') targetVolume += 0.1;

        audio.volume = Math.min(targetVolume, 1.0);
    }, [automationMode, tensionMode, fillMode]);

    // 初始化與終極記憶體資源清理機制
    useEffect(() => {
        if (audioRef.current && !audioRef.current.src) {
            audioRef.current.src = "/audio/dynamics-matrix-demo.mp3";
            audioRef.current.load();
        }

        // 💡 工程優化 3：最乾淨的資源釋放，避免音訊掛載殘留與爆音風險
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeAttribute('src');
                audioRef.current.load();
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current || isLoading) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // 💡 工程優化 1：加入 Promise Catch 機制，徹底封殺行動裝置 Autoplay 失敗造成的假狀態風險
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn("音訊播放被瀏覽器安全原則攔截:", err);
                    setIsPlaying(false);
                });
        }
    };

    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>

            {/* 播放器核心 UI 層 (冷靜工具風格) */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    style={{
                        width: '75px', height: '75px', borderRadius: '50%', background: isPlaying ? '#10b981' : '#38bdf8',
                        color: '#020617', border: 'none', fontSize: '1.8rem', cursor: isLoading ? 'wait' : 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: isPlaying ? '0 0 30px rgba(16, 185, 129, 0.5)' : '0 10px 25px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s'
                    }}
                >
                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ textAlign: 'left', flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', letterSpacing: '2px', fontFamily: 'monospace' }}>DYNAMICS MATRIX SYSTEM v1</h4>
                    {/* 解釋層：情緒與洞察 */}
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        這是聲音現實的操控台。當參數更動的瞬間，你不是在調整冷冰冰的數據，是在重塑聽眾內心最深處的情緒軌跡。
                    </p>
                </div>
            </div>

            {/* DAW 系統層控制矩陣 (極簡、等寬、冷靜) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid #1e293b' }}>

                {/* 1. SPACE */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '1px' }}>[01] SPACE (空間自動化)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setAutomationMode('Dry')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Dry' ? '#475569' : 'transparent', color: automationMode === 'Dry' ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
                            🎤 Close & Intimate (貼臉)
                        </button>
                        <button onClick={() => setAutomationMode('Wide')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Wide' ? '#38bdf8' : 'transparent', color: automationMode === 'Wide' ? '#020617' : '#64748b', transition: 'all 0.2s' }}>
                            🌌 Cinematic Space (電影感)
                        </button>
                    </div>
                </div>

                {/* 2. TENSION */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#facc15', fontFamily: 'monospace', letterSpacing: '1px' }}>[02] TENSION (張力斜率)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setTensionMode('Flat')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Flat' ? '#475569' : 'transparent', color: tensionMode === 'Flat' ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
                            😐 Emotion Held (壓住)
                        </button>
                        <button onClick={() => setTensionMode('Rising')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Rising' ? '#facc15' : 'transparent', color: tensionMode === 'Rising' ? '#020617' : '#64748b', transition: 'all 0.2s' }}>
                            🔥 Emotional Build (上升)
                        </button>
                    </div>
                </div>

                {/* 3. IMPACT */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace', letterSpacing: '1px' }}>[03] IMPACT (衝突引爆)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setFillMode('NoFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'NoFill' ? '#475569' : 'transparent', color: fillMode === 'NoFill' ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
                            🧊 Clean Impact (乾淨)
                        </button>
                        <button onClick={() => setFillMode('WithFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'WithFill' ? '#10b981' : 'transparent', color: fillMode === 'WithFill' ? '#020617' : '#64748b', transition: 'all 0.2s' }}>
                            💥 Impact Explosion (爆破)
                        </button>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} onCanPlay={() => setIsLoading(false)} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 主頁面元件 ---
export default function DynamicsLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [openTrap, setOpenTrap] = useState<string | null>(null);

    // 💡 工程優化 2：防抖型 Resize 監聽器，消除手機旋轉或視窗拉伸時的連續渲染阻滯
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const checkMobileWithDebounce = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsMobile(window.innerWidth < 768);
            }, 150);
        };
        setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobileWithDebounce);
        return () => {
            window.removeEventListener('resize', checkMobileWithDebounce);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '5rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

            <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                {/* UI 層：冷靜工具感 */}
                <header style={{ textAlign: 'center' }}>
                    <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        PRACTICAL TOOLBOX // MODULE 04
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        現在，把情緒做出來
                    </h1>
                    {/* 解釋層：深刻情緒洞察 */}
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: 0, lineHeight: '1.6' }}>
                        真正的編配不是在死磕音符，而是用物理手段，在空氣的震動裡雕刻出人類潛意識的起伏。
                    </p>
                </header>

                {/* 三大工具區 */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                        ⚙️ THE TACTICAL TOOLS
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px' }}>
                        {/* Tool 1 */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌪️</div>
                                <h3 style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>1. Automation</h3>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '12px', fontFamily: 'monospace' }}>[ 空間縱深與乾濕比調配 ]</span>
                                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>副歌瞬間將空間殘響收乾，強迫所有頻率凝聚在中心，將聽眾的全部焦距瞬間鎖死在核心主體身上。</p>
                            </div>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'block' }}>💡 核心：你不是在調整音量，是在改聽眾的凝視視角。</span>
                        </div>

                        {/* Tool 2 */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏪</div>
                                <h3 style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>2. Reverse</h3>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '12px', fontFamily: 'monospace' }}>[ 聲學逆向張力蓄積 ]</span>
                                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>將衝擊性素材進行倒放處理。最大能量的峰值點必須精準咬合進副歌的第一個重拍，構造極致的拉扯。</p>
                            </div>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'block' }}>💡 核心：爆炸前的真空引力，往往比爆炸本身更致命。</span>
                        </div>

                        {/* Tool 3 */}
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎸</div>
                                <h3 style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>3. Slide / Fill</h3>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '12px', fontFamily: 'monospace' }}>[ 時間軸物理動能推進 ]</span>
                                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>透過貝斯線低沉下墜的滑音（Bass Slide）或是鼓組過門，在沉悶的線性時間中強行扯出物理慣性。</p>
                            </div>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'block' }}>💡 核心：推進感，就是時間軸被極度強行拉緊。</span>
                        </div>
                    </div>
                </section>

                {/* 實戰控制台 */}
                <section>
                    <UltimateDemoPlayer isMobile={isMobile} />
                </section>

                {/* 💡 關鍵優化 2：地雷區重構（短 ➔ 中 ➔ 長 秘密黑盒的敘事節奏） */}
                <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>
                        ⚠️ CRITICAL REFRACTURING // 錯誤心智模型解剖
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* 1. 短（點破觀念） */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't1' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't1' ? null : 't1')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 迷思：大聲 = 衝擊力 (Loud = Impact)</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 事實：衝擊力 = 空間對比坍塌 (Contrast Collapse)</span>
                                </div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't1' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't1' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}>
                                    不要再盲目去推高副歌音量，那只會換來廉價的疲勞。動態是「比較」出來的，試著把主歌做得更低、更安靜，副歌撞進來那一瞬間的對比坍塌，才是爆炸感的源頭。
                                </div>
                            )}
                        </div>

                        {/* 2. 中（操作打臉） */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't2' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't2' ? null : 't2')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 迷思：過門必須瘋狂塞滿鼓點 (Filling Gaps)</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 事實：留白才是扣下板機的瞬間 (Silence is the trigger)</span>
                                </div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't2' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't2' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}>
                                    很多新手在導歌結尾拼命填滿所有音符，生怕露出一點空隙。你在愚蠢地填空，但大師在精準地留白。砸下副歌重音前的 0.3 秒「真空斷片（Silence Gap）」，會強迫聽眾大腦瞬間屏息，那才是決定爆發力死活的致命開關。
                                </div>
                            )}
                        </div>

                        {/* 3. 長（大師黑盒秘密） */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't3' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't3' ? null : 't3')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 迷思：畫死板剛硬的直角推子 (Drawing Lines)</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 事實：大腦接收的是平滑的呼吸 (Listening to Curves)</span>
                                </div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't3' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't3' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem', whiteSpace: 'pre-line' }}>
                                    在軟體裡畫自動化控制（Automation）如果都用直角推上去，會帶來極其粗糙的工業機械感。你自以為在畫線，但聽眾敏銳的耳朵在聽曲線的起伏。必須用貝茲曲線做平滑過渡。
                                    {"\n\n"}
                                    <strong>🔥 製作人不會公開的黑盒秘密 (The Secret Fader)：</strong>
                                    在業界混音中，許多資深混音師會在歌曲進副歌的那一瞬間，偷偷利用線性的 Automation 把「總輸出母帶推桿（Master Fader）」平滑地往上推高 0.5dB 到 1dB。這個幅度微弱到聽眾根本無法察覺是音量變大，但他們的大腦接收到物理能量的擴張，會主動釋放多巴胺，告訴自己：「這段的情緒簡直太激昂、太神了！」這就是透過錯覺操控潛意識的聲學魔法。
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 💡 關鍵優化 1：注入最高認知爆破感的終極 CTA */}
                <footer style={{ textAlign: 'center', paddingBottom: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
                    <div style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        ARRANGEMENT MODULE COMPLETE // LEVEL PASSED
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>
                        你已成功通關「結構與編配」全模組
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                        下一步不是學習更多死板的公式，而是把你的耳朵，正式訓練成能夠看透頻率偽裝的終極武器。
                    </p>

                    <button
                        onClick={() => router.push('/courses/mixing/intro')}
                        style={{
                            padding: '1.5rem 3.5rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px',
                            border: 'none', background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#022c22',
                            cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.4)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🎧 進入混音層級：開始真正「操控聲音現實」 ➔
                    </button>
                </footer>

            </div>
        </div>
    );
}