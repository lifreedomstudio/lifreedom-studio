"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎨 輔助視覺組件：地雷區示意圖 ---
const TrapVisual = ({ type }: { type: 'contrast' | 'silence' | 'curve' }) => {
    if (type === 'contrast') {
        return (
            <svg viewBox="0 0 200 80" style={{ width: '100%', maxWidth: '250px', height: 'auto', marginBottom: '15px' }}>
                {/* 錯誤版：平的 */}
                <rect x="10" y="20" width="30" height="40" fill="#475569" />
                <rect x="45" y="20" width="30" height="40" fill="#475569" />
                <line x1="10" y1="15" x2="75" y2="15" stroke="#ef4444" strokeWidth="2" />
                <text x="80" y="35" fill="#ef4444" fontSize="12" fontWeight="bold">❌ 沒落差</text>
                {/* 正確版：有層次 */}
                <rect x="10" y="50" width="30" height="10" fill="#10b981" opacity="0.5" />
                <rect x="45" y="10" width="30" height="50" fill="#10b981" />
                <text x="80" y="70" fill="#10b981" fontSize="12" fontWeight="bold">✅ 有對比</text>
            </svg>
        );
    }
    if (type === 'silence') {
        return (
            <svg viewBox="0 0 200 80" style={{ width: '100%', maxWidth: '250px', height: 'auto', marginBottom: '15px' }}>
                {/* 錯誤版：塞滿 */}
                <rect x="10" y="30" width="65" height="20" fill="#475569" />
                <rect x="75" y="20" width="40" height="40" fill="#475569" />
                <text x="120" y="35" fill="#ef4444" fontSize="12" fontWeight="bold">❌ 塞太滿</text>
                {/* 正確版：留白 */}
                <rect x="10" y="30" width="50" height="20" fill="#10b981" opacity="0.5" />
                <rect x="75" y="10" width="40" height="60" fill="#10b981" />
                <circle cx="67" cy="40" r="5" fill="none" stroke="#facc15" strokeDasharray="2 2" />
                <text x="120" y="70" fill="#10b981" fontSize="12" fontWeight="bold">✅ 留真空</text>
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 200 80" style={{ width: '100%', maxWidth: '250px', height: 'auto', marginBottom: '15px' }}>
            {/* 錯誤版：直角 */}
            <polyline points="10,60 50,60 50,20 90,20" fill="none" stroke="#ef4444" strokeWidth="3" />
            <text x="100" y="35" fill="#ef4444" fontSize="12" fontWeight="bold">❌ 僵硬轉折</text>
            {/* 正確版：弧線 */}
            <path d="M10,60 C40,60 60,20 90,20" fill="none" stroke="#10b981" strokeWidth="3" />
            <text x="100" y="70" fill="#10b981" fontSize="12" fontWeight="bold">✅ 平滑呼吸</text>
        </svg>
    );
};

// --- 🎧 互動音效卡片 ---
const TransitionCard = ({ title, subtitle, desc, audioSrc, color, icon }: { title: string, subtitle: string, desc: string, audioSrc: string, color: string, icon: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.warn("播放攔截", e));
            }
        }
    };

    return (
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: `1px solid ${isPlaying ? color : 'rgba(255,255,255,0.05)'}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: isPlaying ? `0 0 20px ${color}40` : 'none', transition: 'all 0.3s ease', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={togglePlay} style={{ width: '50px', height: '50px', borderRadius: '50%', background: isPlaying ? color : 'rgba(255,255,255,0.1)', color: isPlaying ? '#020617' : color, border: `2px solid ${color}`, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 6px 0', fontWeight: 'bold' }}>{icon} {title}</h4>
                    <span style={{ color: color, fontSize: '0.8rem', fontWeight: 'bold', background: `${color}20`, padding: '4px 10px', borderRadius: '12px', letterSpacing: '1px' }}>{subtitle}</span>
                </div>
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
        if (audioRef.current && !audioRef.current.src) {
            audioRef.current.src = "/audio/dynamics-matrix-demo.mp3";
            audioRef.current.load();
        }
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
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
    };

    return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <button onClick={togglePlay} disabled={isLoading} style={{ width: '75px', height: '75px', borderRadius: '50%', background: isPlaying ? '#10b981' : '#38bdf8', color: '#020617', border: 'none', fontSize: '1.8rem', cursor: isLoading ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: isPlaying ? '0 0 30px rgba(16, 185, 129, 0.5)' : '0 10px 25px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s' }}>
                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ textAlign: 'left', flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', letterSpacing: '2px', fontFamily: 'monospace' }}>情緒雕塑控制台 v1</h4>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>這是一台「聲音現實」的操控器。當你切換開關，改變的不是數據，而是聽眾感受到的空間遠近與情緒心跳。</p>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace' }}>[01] 空間距離 (Automation)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setAutomationMode('Dry')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Dry' ? '#475569' : 'transparent', color: automationMode === 'Dry' ? '#fff' : '#64748b' }}>🎤 貼臉直白</button>
                        <button onClick={() => setAutomationMode('Wide')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: automationMode === 'Wide' ? '#38bdf8' : 'transparent', color: automationMode === 'Wide' ? '#020617' : '#64748b' }}>🌌 寬廣電影感</button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#facc15', fontFamily: 'monospace' }}>[02] 情緒斜率 (Tension)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setTensionMode('Flat')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Flat' ? '#475569' : 'transparent', color: tensionMode === 'Flat' ? '#fff' : '#64748b' }}>😐 平穩壓制</button>
                        <button onClick={() => setTensionMode('Rising')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: tensionMode === 'Rising' ? '#facc15' : 'transparent', color: tensionMode === 'Rising' ? '#020617' : '#64748b' }}>🔥 爬升蓄力</button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>[03] 衝突引爆 (Impact)</span>
                    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', width: isMobile ? '100%' : 'auto' }}>
                        <button onClick={() => setFillMode('NoFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'NoFill' ? '#475569' : 'transparent', color: fillMode === 'NoFill' ? '#fff' : '#64748b' }}>🧊 直接切入</button>
                        <button onClick={() => setFillMode('WithFill')} style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', background: fillMode === 'WithFill' ? '#10b981' : 'transparent', color: fillMode === 'WithFill' ? '#020617' : '#64748b' }}>💥 真空爆破</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DynamicsLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [openTrap, setOpenTrap] = useState<string | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const checkMobile = () => { clearTimeout(timeoutId); timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 150); };
        setIsMobile(window.innerWidth < 768); window.addEventListener('resize', checkMobile);
        return () => { window.removeEventListener('resize', checkMobile); clearTimeout(timeoutId); };
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '2rem 1rem' : '5rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                <header style={{ textAlign: 'center' }}>
                    <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem', fontFamily: 'monospace' }}>PRACTICAL TOOLBOX // 04</div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>現在，把情緒做出來</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: 0, lineHeight: '1.6' }}>真正的編曲不是死磕音符，而是用物理手段，在空氣的震動裡雕刻出人類潛意識的起伏。</p>
                </header>

                {/* 🎧 聽覺驗證區 */}
                <section style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(16, 185, 129, 0.05))', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>🎧 聽覺驗證：真空吸力</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>上一頁學到的「海水倒退」，聽起來就像這樣：</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                        <TransitionCard title="反向碎音鈸" subtitle="逆向吸力效果" desc="將銅鈸倒轉播放。聲音從微弱逐漸放大，形成強大的真空吸力，暗示聽眾：巨浪要來了。" audioSrc="/audio/reverse-crash.mp3" color="#38bdf8" icon="⏪" />
                        <TransitionCard title="低頻滑音" subtitle="張力拉扯效果" desc="進入重拍前，讓貝斯快速下滑，產生深沉的『Wrooom』轟炸感，將情緒拉緊到極限。" audioSrc="/audio/bass-slide.mp3" color="#10b981" icon="🎸" />
                    </div>
                </section>

                {/* 控制台 */}
                <section><UltimateDemoPlayer isMobile={isMobile} /></section>

                {/* ⚠️ 認知重寫區 (加入圖片與白話文) */}
                <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>⚠️ 錯誤心智模型解剖</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't1' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't1' ? null : 't1')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：大聲才會有衝擊力</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真相：衝擊力來自「安靜 vs 爆炸」的落差</span></div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't1' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't1' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}>
                                    <TrapVisual type="contrast" />
                                    不要盲目推高音量，那只會讓耳朵疲勞。試著把前面的主歌做得很小、很空，副歌撞進來那一瞬間的對比落差，才是爆炸感的源頭。
                                </div>
                            )}
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't2' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't2' ? null : 't2')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：鼓過門一定要塞滿才豐富</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真相：留白 0.3 秒才是扣下板機的瞬間</span></div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't2' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't2' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem' }}>
                                    <TrapVisual type="silence" />
                                    新手喜歡把音符填滿，大師則精準留白。砸下副歌重音前的 0.3 秒「完全靜音」，會強迫聽眾瞬間屏住呼吸，那才是爆發力死活的致命開關。
                                </div>
                            )}
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.01)', borderRadius: '12px', border: openTrap === 't3' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'all 0.2s' }}>
                            <div onClick={() => setOpenTrap(openTrap === 't3' ? null : 't3')} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div><span style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>❌ 誤區：畫線控制音量時直接畫直角</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>👉 真相：聽眾在聽的是「平滑的呼吸曲線」</span></div>
                                <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{openTrap === 't3' ? '−' : '+'}</span>
                            </div>
                            {openTrap === 't3' && (
                                <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '1rem', whiteSpace: 'pre-line' }}>
                                    <TrapVisual type="curve" />
                                    用直角切換音量會有僵硬的機械感。大師的做法是用平滑的弧線過渡。
                                    {"\n\n"}
                                    <strong>🔥 製作人的黑盒秘密：</strong>
                                    在副歌進場的那一瞬間，偷偷將全曲的總音量（Master）平滑推高 0.5dB。這個幅度微小到聽不出音量變大，但大腦會主動釋放多巴胺，告訴自己：「這段的情緒簡直太神了！」
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 💡 術語小字典 */}
                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>💡 本頁小筆記：</h4>
                        <ul style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: '1.6', margin: 0, paddingLeft: '1.2rem' }}>
                            <li>• <strong>自動化控制 (Automation)：</strong> 畫一條線，讓電腦幫你隨時間自動轉動旋鈕（如音量或殘響）。</li>
                            <li>• <strong>反轉音效 (Reverse)：</strong> 把聲音錄音檔「倒著播」，製造一種海水倒退的吸力感。</li>
                            <li>• <strong>總輸出母帶 (Master)：</strong> 決定整首歌最終輸出的那一個總開關。</li>
                        </ul>
                    </div>
                </section>

                <footer style={{ textAlign: 'center', paddingBottom: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
                    <div style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem', fontFamily: 'monospace' }}>ARRANGEMENT COMPLETED</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>恭喜通關「編曲編配」全模組</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>你的大腦已經安裝了專業製作人的心智模型。下一步，我們將學習如何正式操控聲音物理，進入混音的世界。</p>
                    <button onClick={() => router.push('/courses/mixing/intro')} style={{ padding: '1.5rem 3.5rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#022c22', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.4)', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto' }}>🎧 進入混音層級：操控聲音現實 ➔</button>
                </footer>
            </div>
        </div>
    );
}