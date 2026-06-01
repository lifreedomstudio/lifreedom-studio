"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎨 輔助視覺：地雷區示意圖 (強化對比感) ---
const TrapVisual = ({ type }: { type: 'contrast' | 'silence' | 'curve' }) => {
    if (type === 'contrast') {
        return (
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '5px' }}>❌ 錯誤：音量全滿</div>
                    <svg viewBox="0 0 100 40"><rect x="0" y="5" width="100" height="30" fill="#ef4444" opacity="0.3" /><line x1="0" y1="5" x2="100" y2="5" stroke="#ef4444" strokeWidth="2" /><line x1="0" y1="35" x2="100" y2="35" stroke="#ef4444" strokeWidth="2" /></svg>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '5px' }}>✅ 正確：先小後大</div>
                    <svg viewBox="0 0 100 40"><path d="M0 35 L50 35 L50 5 L100 5 L100 35 L0 35" fill="#10b981" opacity="0.3" /><path d="M0 35 L50 35 L50 5 L100 5" fill="none" stroke="#10b981" strokeWidth="2" /></svg>
                </div>
            </div>
        );
    }
    if (type === 'silence') {
        return (
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '5px' }}>❌ 錯誤：塞滿過門</div>
                    <svg viewBox="0 0 100 40">
                        {[10, 25, 40, 55, 70, 85].map(x => <rect key={x} x={x} y="15" width="5" height="10" fill="#ef4444" />)}
                        <rect x="0" y="5" width="100" height="30" fill="none" stroke="#ef4444" strokeDasharray="2 2" />
                    </svg>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '5px' }}>✅ 正確：留出真空</div>
                    <svg viewBox="0 0 100 40">
                        {[10, 25, 40].map(x => <rect key={x} x={x} y="15" width="5" height="10" fill="#10b981" />)}
                        <rect x="75" y="5" width="20" height="30" fill="#10b981" />
                        <text x="52" y="28" fill="#facc15" fontSize="14" fontWeight="bold">!</text>
                    </svg>
                </div>
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '5px' }}>❌ 錯誤：僵硬直角</div>
                <svg viewBox="0 0 100 40"><polyline points="10,35 50,35 50,5 90,5" fill="none" stroke="#ef4444" strokeWidth="2" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '5px' }}>✅ 正確：平滑弧線</div>
                <svg viewBox="0 0 100 40"><path d="M10,35 C40,35 60,5 90,5" fill="none" stroke="#10b981" strokeWidth="2" /></svg>
            </div>
        </div>
    );
};

// --- 🎧 互動音效卡片 ---
const TransitionCard = ({ title, subtitle, desc, audioSrc, color, icon }: { title: string, subtitle: string, desc: string, audioSrc: string, color: string, icon: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
            else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
        }
    };
    return (
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: `1px solid ${isPlaying ? color : 'rgba(255,255,255,0.05)'}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: isPlaying ? `0 0 20px ${color}40` : 'none', transition: 'all 0.3s ease', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={togglePlay} style={{ width: '50px', height: '50px', borderRadius: '50%', background: isPlaying ? color : 'rgba(255,255,255,0.1)', color: isPlaying ? '#020617' : color, border: `2px solid ${color}`, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{isPlaying ? '⏸' : '▶'}</button>
                <div><h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 6px 0', fontWeight: 'bold' }}>{icon} {title}</h4><span style={{ color: color, fontSize: '0.8rem', fontWeight: 'bold', background: `${color}20`, padding: '4px 10px', borderRadius: '12px' }}>{subtitle}</span></div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
            <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🎛️ 即時矩陣控制台 ---
const UltimateDemoPlayer = ({ isMobile }: { isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [automationMode, setAutomationMode] = useState<'Dry' | 'Wide'>('Dry');
    const [tensionMode, setTensionMode] = useState<'Flat' | 'Rising'>('Flat');
    const [fillMode, setFillMode] = useState<'NoFill' | 'WithFill'>('NoFill');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        let targetVolume = 0.7;
        if (automationMode === 'Wide') targetVolume += 0.15;
        if (tensionMode === 'Rising') targetVolume += 0.05;
        if (fillMode === 'WithFill') targetVolume += 0.1;
        audio.volume = Math.min(targetVolume, 1.0);
    }, [automationMode, tensionMode, fillMode]);

    useEffect(() => {
        if (audioRef.current && !audioRef.current.src) { audioRef.current.src = "/audio/dynamics-matrix-demo.mp3"; audioRef.current.load(); }
        return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current.load(); } };
    }, []);

    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <button onClick={() => { if (!audioRef.current || isLoading) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); } }} disabled={isLoading} style={{ width: '75px', height: '75px', borderRadius: '50%', background: isPlaying ? '#10b981' : '#38bdf8', color: '#020617', border: 'none', fontSize: '1.8rem', cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}</button>
                <div style={{ textAlign: 'left', flex: 1 }}><h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>動態矩陣控制台 v1</h4><p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>即時切換參數，親耳感受「情緒雕塑」帶來的巨大落差。</p></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}><span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace' }}>[01] 空間距離 (Automation)</span><div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}><button onClick={() => setAutomationMode('Dry')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Dry' ? '#475569' : 'transparent', color: automationMode === 'Dry' ? '#fff' : '#64748b' }}>🎤 貼臉直白</button><button onClick={() => setAutomationMode('Wide')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Wide' ? '#38bdf8' : 'transparent', color: automationMode === 'Wide' ? '#020617' : '#64748b' }}>🌌 寬廣電影感</button></div></div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}><span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#facc15', fontFamily: 'monospace' }}>[02] 情緒斜率 (Tension)</span><div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}><button onClick={() => setTensionMode('Flat')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Flat' ? '#475569' : 'transparent', color: tensionMode === 'Flat' ? '#fff' : '#64748b' }}>😐 平穩壓制</button><button onClick={() => setTensionMode('Rising')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Rising' ? '#facc15' : 'transparent', color: tensionMode === 'Rising' ? '#020617' : '#64748b' }}>🔥 爬升蓄力</button></div></div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}><span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>[03] 衝突引爆 (Impact)</span><div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}><button onClick={() => setFillMode('NoFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'NoFill' ? '#475569' : 'transparent', color: fillMode === 'NoFill' ? '#fff' : '#64748b' }}>🧊 直接切入</button><button onClick={() => setFillMode('WithFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'WithFill' ? '#10b981' : 'transparent', color: fillMode === 'WithFill' ? '#020617' : '#64748b' }}>💥 真空爆破</button></div></div>
            </div>
            <audio ref={audioRef} onCanPlay={() => setIsLoading(false)} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

export default function DynamicsLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [openTrap, setOpenTrap] = useState<string | null>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check(); window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '5rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                <header style={{ textAlign: 'center' }}>
                    <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem', fontFamily: 'monospace' }}>實戰工具箱 // 04</div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>現在，把情緒做出來</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.6' }}>真正的編曲不是死磕音符，而是用物理手段，在空氣的震動裡雕刻出人類潛意識的起伏。</p>
                </header>

                {/* 🎧 聽覺驗證區 */}
                <section style={{ background: 'rgba(56, 189, 248, 0.05)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}><h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>🎧 聽覺驗證：真空吸力</h2><p style={{ color: '#94a3b8', fontSize: '1rem' }}>上一頁學到的「海水倒退」，聽起來就是這樣：</p></div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                        <TransitionCard title="反向碎音鈸" subtitle="逆向吸力效果" desc="將銅鈸倒轉播放。聲音從微弱逐漸放大，形成強大的真空吸力，暗示聽眾：巨浪要來了。" audioSrc="/audio/reverse-crash.mp3" color="#38bdf8" icon="⏪" />
                        <TransitionCard title="低頻滑音" subtitle="張力拉扯效果" desc="進入重拍前，讓貝斯快速下滑，產生深沉的『Wrooom』轟炸感，將情緒拉緊到極限。" audioSrc="/audio/bass-slide.mp3" color="#10b981" icon="🎸" />
                    </div>
                </section>

                {/* 💡 補回：真空三部曲 (視覺解釋流程) */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', textAlign: 'center' }}>🛠️ 真空音效製作三步驟</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px' }}>1. 挑選素材</div>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>找一個尾音長的聲音，如 Crash 銅鈸或合成器長音。</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#facc15', fontWeight: 'bold', marginBottom: '10px' }}>2. 倒放處理 (Reverse)</div>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>使用軟體功能將音軌反轉，讓聲音從「漸弱」變成「漸強」。</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '10px' }}>3. 對齊重拍</div>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>將爆發點精準對齊到下一段的第一拍，完成吸力銜接。</p>
                        </div>
                    </div>
                </section>

                {/* 控制台 */}
                <section><UltimateDemoPlayer isMobile={isMobile} /></section>

                {/* ⚠️ 認知重寫區 */}
                <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>⚠️ 錯誤心智模型解剖</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't1' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't1' ? null : 't1')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：音量推大 = 震撼力</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真相：震撼力來自「安靜 vs 爆炸」的瞬間落差</span></div><span style={{ color: '#ef4444' }}>{openTrap === 't1' ? '−' : '+'}</span></div>
                            {openTrap === 't1' && <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}><TrapVisual type="contrast" />如果整首歌都很滿，聽眾耳朵會疲勞。試著把前面的主歌做得很空，副歌撞進來那一瞬間的對比落差，才是爆炸感的源頭。</div>}
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't2' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't2' ? null : 't2')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：過門一定要塞滿才豐富</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真話：留白 0.3 秒才是扣下板機的瞬間</span></div><span style={{ color: '#ef4444' }}>{openTrap === 't2' ? '−' : '+'}</span></div>
                            {openTrap === 't2' && <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}><TrapVisual type="silence" />新手喜歡把音符填滿，大師則精準留白。砸下副歌重音前的「完全靜音」，會強迫聽眾屏住呼吸，那才是爆發力死活的致命開關。</div>}
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't3' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't3' ? null : 't3')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：畫線控制音量時直接畫直角</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真相：聽眾在聽的是「平滑的呼吸曲線」</span></div><span style={{ color: '#ef4444' }}>{openTrap === 't3' ? '−' : '+'}</span></div>
                            {openTrap === 't3' && <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem', whiteSpace: 'pre-line' }}><TrapVisual type="curve" />用直角切換音量會有僵硬的機械感。大師的做法是用平滑的弧線過渡。{"\n\n"}<strong>🔥 製作人的黑盒秘密：</strong>在副歌進場的那一瞬間，偷偷將全曲的總音量（Master）平滑推高 0.5dB。聽不出音量變大，但大腦會主動釋放多巴胺，覺得這段特別激昂！</div>}
                        </div>
                    </div>
                </section>

                <footer style={{ textAlign: 'center', paddingBottom: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
                    <div style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>ARRANGEMENT COMPLETED</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>恭喜通關「編曲編配」全模組</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>下一步，我們將學習如何正式操控聲音物理，進入混音的世界。</p>
                    <button onClick={() => router.push('/courses/mixing/intro')} style={{ padding: '1.5rem 3.5rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#022c22', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.4)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto' }}>🎧 進入混音層級：操控聲音現實 ➔</button>
                </footer>
            </div>
        </div>
    );
}