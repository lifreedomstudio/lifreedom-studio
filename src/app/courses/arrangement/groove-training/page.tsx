"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 A/B 試聽播放器元件 ---
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
                            background: !isGood ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                            color: !isGood ? '#fca5a5' : '#64748b',
                            borderBottom: !isGood ? '2px solid #ef4444' : '2px solid transparent',
                            transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        ❌ 災難示範 (各走各的路)
                    </button>
                    <button
                        onClick={() => setIsGood(true)}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                            background: isGood ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                            color: isGood ? '#86efac' : '#64748b',
                            borderBottom: isGood ? '2px solid #22c55e' : '2px solid transparent',
                            transition: 'all 0.2s', fontSize: isMobile ? '0.9rem' : '1rem'
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

// --- 🖼️ 全鼓組標註大圖 ---
const FullDrumKitVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '0 auto 2.5rem auto', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 15px 40px rgba(0,0,0,0.5)' }}>
        {/* 🚨 修正：移除 padding-bottom 固定比例容器，移除 object-fit: 'cover'，
           直接使用 img 標籤自然展開，確保整張圖（包含上方標籤）都能顯示 */}
        <img src="/images/full drum-kit.jpg" alt="Full Drum Kit" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '24px' }} />

        {/* 🚨 移除所有 position: 'absolute' 的部件標籤疊加層，圖片上不應再有點擊事件 */}
    </div>
);

// --- 🥁 互動式按鈕 (支援播放/暫停與排他性) ---
const DrumPad = ({ name, engName, desc, imgSrc, color, isPlaying, onToggle }: { name: string, engName: string, desc: string, imgSrc: string, color: string, isPlaying: boolean, onToggle: () => void }) => {
    return (
        <div
            onClick={onToggle}
            style={{
                background: 'rgba(30, 30, 40, 0.7)', border: `2px solid ${isPlaying ? color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px', padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease',
                transform: isPlaying ? 'scale(0.96)' : 'scale(1)',
                boxShadow: isPlaying ? `0 0 20px ${color}80` : '0 10px 20px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}
        >
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#1e293b', marginBottom: '15px', overflow: 'hidden', border: `3px solid ${isPlaying ? color : 'rgba(255,255,255,0.2)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }}>
                {isPlaying ? (
                    <span style={{ fontSize: '2rem' }}>⏸</span>
                ) : (
                    <img src={imgSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<i class="fa-solid fa-drum" style="font-size: 1.8rem; color: #64748b;"></i>'; }} />
                )}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>{name} <span style={{ color, fontSize: '0.9rem' }}>{engName}</span></h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{desc}</p>
        </div>
    );
};

// --- 🎹 MIDI 人味對照圖 ---
const MidiHumanizeVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%' }}>
        <div style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}><i className="fa-solid fa-robot"></i> 死板的機器人 (100% 對齊)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" />
                <rect x="50" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="150" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="250" y="20" width="30" height="15" fill="#ef4444" rx="2" />
            </svg>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '15px', textAlign: 'justify', lineHeight: '1.5' }}>每個音符都完美貼在網格線上，且力度完全一樣。聽起來像機關槍，毫無律動感。</p>
        </div>

        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}><i className="fa-solid fa-person"></i> 注入人味 (Humanized)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <rect x="53" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="1" />
                <rect x="148" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.5" />
                <rect x="255" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.8" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', marginTop: '15px', textAlign: 'justify', lineHeight: '1.5' }}>時間有微小的偏差 (稍微提早或延遲)，且打擊力度 (Velocity) 有輕重之分，這才是人類打鼓的真實呼吸感。</p>
        </div>
    </div>
);

// --- 📖 課程主頁面 ---
export default function GrooveTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [showBassAnswer, setShowBassAnswer] = useState(false);

    // 音訊播放狀態管理 (確保一次只播一個)
    const [playingDrumId, setPlayingDrumId] = useState<string | null>(null);
    const drumAudioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // 初始化鼓組音檔
        const drums = [
            { id: 'kick', src: '/audio/kick.mp3' },
            { id: 'snare', src: '/audio/snare.mp3' },
            { id: 'hihat', src: '/audio/hihat.mp3' },
            { id: 'tom', src: '/audio/tom.mp3' },
            { id: 'crash', src: '/audio/crash.mp3' }
        ];
        drums.forEach(d => {
            const audio = new Audio(d.src);
            audio.addEventListener('ended', () => setPlayingDrumId(null));
            drumAudioRefs.current[d.id] = audio;
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            Object.values(drumAudioRefs.current).forEach(a => { a.pause(); a.src = ""; });
        };
    }, []);

    const toggleDrumPlay = (id: string) => {
        const currentAudio = drumAudioRefs.current[id];
        if (!currentAudio) return;

        if (playingDrumId === id) {
            // 如果點擊正在播放的 -> 暫停並重置時間
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setPlayingDrumId(null);
        } else {
            // 點擊別的 -> 暫停前一個，播放新的
            if (playingDrumId && drumAudioRefs.current[playingDrumId]) {
                drumAudioRefs.current[playingDrumId].pause();
                drumAudioRefs.current[playingDrumId].currentTime = 0;
            }
            currentAudio.play().catch(e => console.log("等待音檔置入"));
            setPlayingDrumId(id);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{
                        display: 'inline-block', border: '1px solid rgba(249, 115, 22, 0.5)', background: 'rgba(249, 115, 22, 0.1)',
                        color: '#f97316', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold'
                    }}>
                        PHASE 01 : THE FOUNDATION
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #ea580c, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Groove<br />節奏骨架
                    </h1>

                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(234, 88, 12, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto 1.5rem auto', textAlign: 'left' }}>
                        <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                            <strong style={{ color: '#ea580c' }}>📖 字彙定義：Groove (律動感)</strong> 是音樂中讓人忍不住想跟著點頭、抖腳的「脈搏」。它主要由爵士鼓與 Bass 構成，決定了整首歌的動力與心跳。
                        </p>
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        音樂的地基。當大鼓與貝斯成為最好的朋友，你的音樂就會開始產生強大的呼吸感。
                    </p>
                </header>

                {/* 1. 鼓組解剖學 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>
                        1. 聽見節奏：鼓組解剖學
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        很多新手聽歌時只注意到主唱跟吉他，卻忽略了撐起整首歌靈魂的「鼓組」。戴上耳機，點擊下方區塊來認識它們的聲音與職責：
                    </p>

                    <FullDrumKitVisual isMobile={isMobile} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        <DrumPad
                            name="大鼓" engName="Kick" desc="音樂的心臟。提供最低沉的衝擊力，決定了歌曲的重拍位置。"
                            imgSrc="/images/kick.png" color="#ea580c"
                            isPlaying={playingDrumId === 'kick'} onToggle={() => toggleDrumPlay('kick')}
                        />
                        <DrumPad
                            name="小鼓" engName="Snare" desc="音樂的巴掌。通常落在第 2、4 拍，是讓人忍不住拍手的清脆聲響。"
                            imgSrc="/images/snare.png" color="#facc15"
                            isPlaying={playingDrumId === 'snare'} onToggle={() => toggleDrumPlay('snare')}
                        />
                        <DrumPad
                            name="踩鈸" engName="Hi-Hat" desc="音樂的時鐘。負責切分時間（如 8 或 16 分音符），決定歌曲的速度感。"
                            imgSrc="/images/hihat.png" color="#10b981"
                            isPlaying={playingDrumId === 'hihat'} onToggle={() => toggleDrumPlay('hihat')}
                        />
                        <DrumPad
                            name="中鼓 / 落地鼓" engName="Tom Tom" desc="點綴與過門 (Fill-in)。在段落銜接時，提供極具張力的低頻打擊感。"
                            imgSrc="/images/tom.png" color="#a855f7"
                            isPlaying={playingDrumId === 'tom'} onToggle={() => toggleDrumPlay('tom')}
                        />
                        <DrumPad
                            name="銅鈸" engName="Crash" desc="轉場特效。在段落轉換時（如進入大副歌），用來製造能量爆發的巨響。"
                            imgSrc="/images/crash.png" color="#38bdf8"
                            isPlaying={playingDrumId === 'crash'} onToggle={() => toggleDrumPlay('crash')}
                        />
                    </div>
                </section>

                {/* 2. MIDI 注入人味 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>
                        2. 注入靈魂：MIDI 的「人味」
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        在軟體中編輯鼓組 MIDI 時，最忌諱的就是將所有音符 100% 貼齊在網格線上。真實世界的樂手是不完美的，正是這些微小的瑕疵創造了律動。
                    </p>

                    <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <MidiHumanizeVisual isMobile={isMobile} />

                        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ borderLeft: '4px solid #ea580c', paddingLeft: '20px' }}>
                                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}><i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#ea580c' }}></i> 實戰手法 (Humanization)</h4>
                                <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0, paddingLeft: '20px' }}>
                                    <li><strong>力度 (Velocity) 變化：</strong> 不要讓每個音的力度都是 127 (最大值)。加入輕音（Ghost Notes）讓節奏有起伏。</li>
                                    <li><strong>時間偏移 (Micro-timing)：</strong> 讓 Hi-Hat 稍微晚於網格線出現，會產生一種慵懶、向後拖拽的舒適感 (Laid-back)。</li>
                                </ul>
                            </div>

                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '20px' }}>
                                <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-brands fa-youtube" style={{ color: '#ef4444', fontSize: '1.5rem' }}></i> 進階學習推薦
                                </h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '15px' }}>
                                    想進一步了解真實鼓手是如何打擊的？推薦觀看 GQ Taiwan 的《專業鼓手示範13個難度級別的鼓技》。影片中詳細示範了不同樂風的拍點差異，以及如何透過 Velocity 創造出無可取代的呼吸感！
                                </p>
                                <a href="https://www.youtube.com/watch?v=aKHgDLm2f0o" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem', transition: 'background 0.2s' }}>
                                    前往觀看 YouTube 影片 ➔
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. 為什麼大鼓和貝斯會打架？ */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#f97316', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        3. 為什麼大鼓和貝斯會打架？
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        在一個樂團中，大鼓 (Kick) 負責提供「衝擊力」，而貝斯 (Bass) 負責提供「音高與厚度」。問題在於：<strong style={{ color: '#fff' }}>它們都在爭奪 40Hz 到 100Hz 的極低頻空間。</strong>
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>
                            如果編曲時，貝斯彈奏的節奏跟鼓手踩大鼓的節奏完全對不上，這兩個低頻怪物就會互相碰撞，產生嚴重的「頻率遮蔽」，導致整首歌聽起來轟轟作響，完全沒有力道。
                        </p>
                    </div>
                </section>

                {/* 4. 終極奧義：Lock-in */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fca311', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        4. 終極奧義：Lock-in (鎖定)
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        業界稱為「Lock-in」，意思就是：<strong style={{ color: '#fff' }}>大鼓踩下去的那一瞬間，貝斯剛好也彈出那個音。</strong>
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                        <li style={{ marginBottom: '10px' }}>把它們想像成同一個超級樂器：大鼓是「發聲的瞬間」，貝斯是「聲音的延續」。</li>
                        <li>貝斯不需要每一個音都跟著大鼓，但<strong style={{ color: '#fca311' }}>在重拍（特別是第一拍和第三拍）</strong>上，它們必須是最好的朋友。</li>
                    </ul>

                    <AudioComparer
                        title="🎧 聽覺試煉：感受 Lock-in 的魔力"
                        description="點擊播放，並切換兩個版本。注意聽底下那個低沉的推動力，有沒有覺得「完美鎖定」的版本聽起來比較有彈性、比較爽？"
                        badSrc="/audio/kick-bass-bad.mp3"
                        goodSrc="/audio/kick-bass-good.mp3"
                        isMobile={isMobile}
                    />
                </section>

                {/* 5. Bass 的雙重人格：節奏與和聲的橋樑 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>
                        5. Bass 的雙重人格：節奏與和聲的橋樑
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        很多人以為吉他手彈什麼和弦，Bass 就只能死死地跟著彈同一個字（根音）。這樣雖然安全，但聽起來就像在「立正站好」，非常單調。
                    </p>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        其實 Bass 手有一個改變整首歌風景的超能力，叫做 <strong>「根音下行 (Descending Bassline)」</strong>。只要你彈的音包含在當時的和弦內，聽起來就會非常合理（也就是和弦轉位），能讓低音線像一條滑順的旋律線一樣往下流動！
                    </p>

                    {/* 隨堂互動作業區 */}
                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: '#facc15', fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-guitar"></i> 🎸 實戰隨堂考：請拿起你的 Bass！
                        </h4>
                        <p style={{ color: '#f8fafc', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '20px' }}>
                            假設你的吉他手寫了一段非常常見的情歌和弦進行：<br />
                            <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px' }}>[ C ] ➔ [ G ] ➔ [ Am ] ➔ [ Em ] ➔ [ F ]</span>
                        </p>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1rem', marginBottom: '25px' }}>
                            最普通的呆板彈法是直接跟著跳：<code style={{ color: '#fca5a5' }}>C ➔ G ➔ A ➔ E ➔ F</code>。<br />
                            現在，請拿起你的琴，試著運用<strong>「順滑往下走」</strong>的樓梯邏輯，設計一條高級的 Bass 路線。想好後，點擊下方按鈕公布答案！
                        </p>

                        <button
                            onClick={() => setShowBassAnswer(!showBassAnswer)}
                            style={{
                                background: 'rgba(250, 204, 21, 0.1)', color: '#facc15', border: '1px solid #facc15',
                                padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                                transition: 'all 0.2s', fontSize: '0.95rem'
                            }}
                        >
                            {showBassAnswer ? '🙈 隱藏解答' : '👁️ 顯示 Bass 手解答'}
                        </button>

                        {/* 答案隱藏與展開區 */}
                        {showBassAnswer && (
                            <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.3s' }}>
                                <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>
                                    ✅ 職人解答路線：C ➔ B ➔ A ➔ G ➔ F
                                </p>
                                <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '20px', margin: 0 }}>
                                    <li style={{ marginBottom: '8px' }}><strong>[ C ] 和弦：</strong> Bass 彈 <code style={{ color: '#fff' }}>C</code>（正常發揮）</li>
                                    <li style={{ marginBottom: '8px' }}><strong>[ G ] 和弦：</strong> Bass 往下走一格彈 <code style={{ color: '#facc15' }}>B</code>（這就是經典的 <strong>G/B</strong> 和弦！因為 B 是 G 和弦的組成音，超級合理！）</li>
                                    <li style={{ marginBottom: '8px' }}><strong>[ Am ] 和弦：</strong> Bass 順勢再往下走一格彈 <code style={{ color: '#fff' }}>A</code>（正常發揮）</li>
                                    <li style={{ marginBottom: '8px' }}><strong>[ Em ] 和弦：</strong> Bass 繼續往下走一格彈 <code style={{ color: '#facc15' }}>G</code>（這就是 <strong>Em/G</strong>！聽感極度絲滑）</li>
                                    <li><strong>[ F ] 和弦：</strong> Bass 最終落腳到 <code style={{ color: '#fff' }}>F</code></li>
                                </ul>
                                <p style={{ color: '#fca311', marginTop: '20px', fontWeight: 'bold', fontSize: '1rem', margin: '20px 0 0 0' }}>
                                    💡 試彈心得：現在照著 C - B - A - G - F 彈一遍！你會發現 Bass 不再只是呆板的伴奏，而是變成了一條引導整首歌流暢推進的「情緒線」。
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 💡 混音助理提示 */}
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed #38bdf8', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '5rem' }}>
                    <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🤖 來自混音助理的進階提示</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                        如果編曲上因為某些原因無法完全對齊，混音師會使用一種叫做 <strong>「Sidechain Compression (側鏈壓縮)」</strong> 的技巧：設定成當大鼓發聲時，貝斯音量瞬間自動變小讓路。想學這招嗎？之後在《混音實戰篇》我們會詳細教你！
                    </p>
                </div>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    <p style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        搞定地基了，接下來往中頻公寓前進！
                    </p>
                    <button
                        onClick={() => router.push('/courses/arrangement/voicing-training')}
                        style={{
                            background: 'linear-gradient(135deg, #facc15, #ca8a04)', color: '#020617', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem', fontSize: isMobile ? '1.1rem' : '1.3rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(250, 204, 21, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 2. Voicing (把位與音區) ➔
                    </button>
                </section>

            </div>
        </div>
    );
}