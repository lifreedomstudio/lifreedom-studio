"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 A/B 試聽播放器元件 (Kick & Bass Lock-in) ---
const AudioComparer = ({ title, description, badSrc, goodSrc, isMobile }: { title: string, description: string, badSrc: string, goodSrc: string, isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGood, setIsGood] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = isGood ? goodSrc : badSrc;
            audioRef.current.currentTime = currentTime;
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            }
        }
    }, [isGood, badSrc, goodSrc]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div style={{
            background: 'rgba(20, 20, 30, 0.8)', padding: isMobile ? '1.5rem' : '2rem',
            borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '2rem', boxSizing: 'border-box'
        }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.5rem 0' }}>{title}</h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{description}</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1rem' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        background: isPlaying ? '#ea580c' : '#f97316', color: '#fff', border: 'none',
                        width: isMobile ? '100%' : '60px', height: isMobile ? '50px' : '60px', borderRadius: isMobile ? '12px' : '50%',
                        fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)', transition: 'background 0.2s'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '6px', flex: 1 }}>
                    <button
                        onClick={() => setIsGood(false)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                            background: !isGood ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: !isGood ? '#fca5a5' : '#64748b',
                            borderBottom: !isGood ? '2px solid #ef4444' : '2px solid transparent', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        ❌ 災難示範 (各走各的路)
                    </button>
                    <button
                        onClick={() => setIsGood(true)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                            background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: isGood ? '#86efac' : '#64748b',
                            borderBottom: isGood ? '2px solid #22c55e' : '2px solid transparent', transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        ✅ 完美 Lock-in (鎖定律動)
                    </button>
                </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

// --- 🖼️ 全鼓組標註大圖 (互動式) ---
// ⚠️ 請確保 /drum-kit.jpg 放在 public/ 目錄下
const DRUM_PARTS = [
    { id: 'kick', name: '大鼓 Kick', desc: '音樂的心臟。提供最低沉的衝擊力，決定歌曲重拍。', color: '#ea580c', audioSrc: '/audio/kick.mp3', pos: { top: '75%', left: '50%' } },
    { id: 'snare', name: '小鼓 Snare', desc: '音樂的巴掌。通常在第 2、4 拍，清脆響亮。', color: '#facc15', audioSrc: '/audio/snare.mp3', pos: { top: '55%', left: '38%' } },
    { id: 'hihat', name: '踩鈸 Hi-Hat', desc: '音樂的時鐘。切分時間，決定速度感。', color: '#10b981', audioSrc: '/audio/hihat.mp3', pos: { top: '48%', left: '25%' } },
    { id: 'tom', name: '中鼓 Tom Tom', desc: '點綴與過門。提供極具張力的低頻打擊感。', color: '#a855f7', audioSrc: '/audio/tom.mp3', pos: { top: '40%', left: '62%' } },
    { id: 'crash', name: '銅鈸 Crash', desc: '轉場特效。段落轉換製造能量爆發。', color: '#38bdf8', audioSrc: '/audio/crash.mp3', pos: { top: '25%', left: '28%' } }
];

const InteractiveDrumKit = ({ isMobile }: { isMobile: boolean }) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

    useEffect(() => {
        DRUM_PARTS.forEach(part => {
            const audio = new Audio(part.audioSrc);
            audio.addEventListener('ended', () => setPlayingId(null));
            audioRefs.current[part.id] = audio;
        });
        return () => {
            Object.values(audioRefs.current).forEach(audio => { audio.pause(); audio.currentTime = 0; });
        };
    }, []);

    const togglePlay = (id: string) => {
        const currentAudio = audioRefs.current[id];
        if (playingId === id) {
            currentAudio.pause(); currentAudio.currentTime = 0; setPlayingId(null);
        } else {
            if (playingId && audioRefs.current[playingId]) {
                audioRefs.current[playingId].pause(); audioRefs.current[playingId].currentTime = 0;
            }
            currentAudio.play().catch(e => console.log('音檔未找到')); setPlayingId(id);
        }
    };

    return (
        <div>
            {/* 大圖區 */}
            <div style={{ position: 'relative', width: '100%', height: isMobile ? '350px' : '500px', background: "url('/drum-kit.jpg') center/cover no-repeat", borderRadius: '24px', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {DRUM_PARTS.map((part) => (
                    <button
                        key={part.id} onClick={() => togglePlay(part.id)}
                        style={{
                            position: 'absolute', top: part.pos.top, left: part.pos.left, transform: 'translate(-50%, -50%)',
                            background: part.color, color: '#000', padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '900',
                            fontSize: isMobile ? '0.8rem' : '1rem', cursor: 'pointer',
                            boxShadow: playingId === part.id ? `0 0 20px ${part.color}` : '0 4px 10px rgba(0,0,0,0.5)',
                            transition: 'all 0.2s ease', zIndex: playingId === part.id ? 10 : 1, scale: playingId === part.id ? '1.1' : '1'
                        }}
                    >
                        {playingId === part.id ? '⏸ 停止' : part.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* 下方卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {DRUM_PARTS.map((part) => (
                    <div key={`card-${part.id}`} onClick={() => togglePlay(part.id)}
                        style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', border: playingId === part.id ? `2px solid ${part.color}` : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', boxShadow: playingId === part.id ? `0 0 15px ${part.color}44` : 'none' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1e293b', border: `2px solid ${part.color}`, margin: '0 auto 1rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                            {playingId === part.id ? '🔊' : '🥁'}
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#f8fafc' }}>{part.name.split(' ')[0]} <span style={{ color: part.color, fontSize: '0.8rem' }}>{part.id.toUpperCase()}</span></h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>{part.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 🎹 MIDI 人味對照圖 ---
const MidiHumanizeVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%' }}>
        <div style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>🤖 死板的機器人 (100% 對齊)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" />
                <rect x="50" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="150" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="250" y="20" width="30" height="15" fill="#ef4444" rx="2" />
            </svg>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '15px', textAlign: 'justify', lineHeight: '1.5' }}>每個音符都完美貼在網格線上，力度完全一樣。聽起來像機關槍，毫無律動。</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>🧍 注入人味 (Humanized)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <rect x="53" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="1" />
                <rect x="148" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.5" />
                <rect x="255" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.8" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', marginTop: '15px', textAlign: 'justify', lineHeight: '1.5' }}>時間有微小的偏差，打擊力度有輕重之分，這才是人類打鼓的真實呼吸感。</p>
        </div>
    </div>
);

// --- 📖 課程主頁面 (融合 Groove 與 Reverb 教學) ---
export default function MasterClassPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [showBassAnswer, setShowBassAnswer] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* =========================================
                    上半部：GROOVE 節奏骨架
                ========================================== */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(249, 115, 22, 0.5)', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 01 : THE FOUNDATION
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #ea580c, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Groove<br />節奏骨架
                    </h1>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        音樂的地基。當大鼓與貝斯成為最好的朋友，你的音樂就會開始產生強大的呼吸感。
                    </p>
                </header>

                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>
                        1. 聽見節奏：鼓組解剖學
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        撐起整首歌靈魂的「鼓組」。戴上耳機，點擊下方區塊來認識它們的聲音與職責：
                    </p>
                    {/* 使用更新後的互動式鼓組 */}
                    <InteractiveDrumKit isMobile={isMobile} />
                </section>

                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>
                        2. 注入靈魂：MIDI 的「人味」
                    </h2>
                    <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <MidiHumanizeVisual isMobile={isMobile} />
                    </div>
                </section>

                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fca311', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        3. 終極奧義：Lock-in (鎖定)
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        大鼓跟貝斯都在爭奪低頻空間，如果節奏對不上就會轟轟作響。業界稱為「Lock-in」，意思就是：<strong style={{ color: '#fff' }}>大鼓踩下去的那一瞬間，貝斯剛好也彈出那個音。</strong>
                    </p>
                    <AudioComparer
                        title="🎧 聽覺試煉：感受 Lock-in 的魔力"
                        description="點擊播放，注意聽底下低沉的推動力，完美鎖定的版本聽起來是不是比較有彈性？"
                        badSrc="/audio/kick-bass-bad.mp3"
                        goodSrc="/audio/kick-bass-good.mp3"
                        isMobile={isMobile}
                    />
                </section>


                {/* =========================================
                    下半部：REVERB 空間魔法
                ========================================== */}
                <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '8rem', paddingTop: '4rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(56, 189, 248, 0.5)', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 02 : THE ATMOSPHERE
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Reverb<br />殘響解剖學
                    </h1>
                </header>

                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#38bdf8', marginBottom: '1rem', borderLeft: '8px solid #0284c7', paddingLeft: '20px' }}>
                        1. 殘響尾巴的三個階段
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        一個完美的 Reverb 其實是由「三個時間段」組成的，搞懂它們，你就能精準捏出想要的空間感：
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Pre-delay */}
                        <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>⏳ Pre-delay (預延遲)</h3>
                            <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>💡 聲音撞到第一面牆之前的「飛行時間」</p>
                            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                                <li><strong>主唱要大空間但聲音要貼耳？</strong> ➡️ 調大 Pre-delay (約 20-40ms)。讓乾淨人聲先出來，殘響才跟上，確保咬字不糊。</li>
                                <li><strong>樂器想推到深處 (如背景 Pad)？</strong> ➡️ 調小 Pre-delay (0-5ms)。聲音瞬間被殘響包覆，聽覺上就會退到後方。</li>
                            </ul>
                        </div>

                        {/* Early Reflection */}
                        <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>🧱 Early Reflection (早期反射)</h3>
                            <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>💡 房間形狀的「身分證」</p>
                            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                                <li>聲音撞牆後最先彈回來的清晰回音，決定了這是「木頭房」還是「浴室」。</li>
                                <li><strong>鼓組想要真實空間感又不能拖泥帶水？</strong> ➡️ 拉高 Early Reflection，關小後方的 Tail。創造結實的小空間厚度。</li>
                            </ul>
                        </div>

                        {/* Tail */}
                        <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>🌊 Reverb Tail / Decay (殘響尾音)</h3>
                            <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>💡 空間的「容積與浪漫」</p>
                            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                                <li><strong>快節奏流行/搖滾？</strong> ➡️ 縮短 Tail (約 0.8s-1.5s)，才不會干擾下一個節拍。</li>
                                <li><strong>空靈抒情、吉他 Solo？</strong> ➡️ 拉長 Tail (2.5s-4s+)，創造漂浮在雲端的夢幻感。</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#818cf8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        2. 業界標準：Send vs. Insert
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2rem', borderRadius: '16px' }}>
                            <h4 style={{ color: '#fca5a5', fontSize: '1.2rem', marginBottom: '1rem' }}>❌ 新手陷阱 (Insert)</h4>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>直接把 Reverb 掛在主唱音軌上，調低 Dry/Wet。</p>
                            <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold' }}>結果：佔用 CPU，且殘響與人聲糊在一起，無法單獨做 EQ 處理。</p>
                        </div>

                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '2rem', borderRadius: '16px' }}>
                            <h4 style={{ color: '#86efac', fontSize: '1.2rem', marginBottom: '1rem' }}>✅ 業界標準 (Send/Return)</h4>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>開一個 Aux 軌道掛 Reverb (設定 100% Wet)，再用 Send 把樂器訊號送過去。</p>
                            <p style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold' }}>結果：把大家送進同一個房間創造 Glue，並能單獨對殘響做低頻切除 (Abbey Road 秘技)！</p>
                        </div>
                    </div>
                </section>

                {/* --- 💡 AI 助理導流 CTA --- */}
                <section style={{ background: 'linear-gradient(145deg, #1e1b4b, #020617)', border: '1px solid #6366f1', padding: isMobile ? '2rem 1.5rem' : '3rem', borderRadius: '24px', textAlign: 'center', marginBottom: '5rem', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)' }}>
                    <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '1rem' }}>
                        參數太多，不知道怎麼調？
                    </h2>
                    <p style={{ color: '#a5b4fc', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                        別讓複雜的理論卡住你的靈魂！打開 <strong>AI 混音助理</strong>，告訴它你的樂器和想要的空間感，助理會立刻為你算出最完美的 Reverb 設定值！
                    </p>
                    <button
                        onClick={() => router.push('/mix-assistant')}
                        style={{
                            background: '#fca311', color: '#000', border: 'none', padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(252, 163, 17, 0.4)', transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        ⚡ 立即啟動 AI 助理
                    </button>
                </section>

                {/* --- 底部預告 --- */}
                <div style={{ textAlign: 'center', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 'bold' }}>⏭️ 下一堂預告：Compressor 壓縮器實戰</p>
                </div>

            </div>
        </div>
    );
}