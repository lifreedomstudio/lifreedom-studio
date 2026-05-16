"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🛠️ 1. 情緒曲線圖 ---
const EmotionCurveChart = () => (
    <svg viewBox="0 0 1000 350" style={{ width: '100%', height: 'auto', overflow: 'visible', maxWidth: '900px', margin: '0 auto', display: 'block' }}>
        <defs>
            <linearGradient id="curve-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.5 }}></stop>
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }}></stop>
            </linearGradient>
        </defs>
        <path d="M 0 300 L 150 250 L 350 280 L 500 150 L 750 80 L 1000 100 L 1000 350 L 0 350 Z" fill="url(#curve-grad)"></path>
        <polyline points="0,300 150,250 350,280 500,150 750,80 1000,100" fill="none" stroke="#10b981" strokeWidth="5"></polyline>
        <g fill="#64748b" fontSize="16" fontFamily="Urbanist" fontWeight="bold">
            <text x="0" y="340">Intro</text> <text x="140" y="340">Verse</text> <text x="330" y="340">Pre-Cho</text> <text x="490" y="340">Chorus</text> <text x="730" y="340">Outro</text>
        </g>
    </svg>
);

// --- 🛠️ 2. 聽覺實驗室卡片 (共用元件) ---
const ListeningLabCard = ({
    tagNum, tagColor, song, time, listenGoal, learnGoal, isSingleCol = false
}: {
    tagNum: string, tagColor: string, song: string, time: string, listenGoal: string, learnGoal?: string, isSingleCol?: boolean
}) => (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${tagColor}`, borderRadius: '24px', padding: '2rem', width: '100%' }}>
        <span style={{ background: tagColor, color: tagColor === '#10b981' ? '#020617' : '#fff', padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', display: 'inline-block' }}>
            CASE STUDY {tagNum}
        </span>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>{song}</h3>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '20px' }}>📍 關鍵時刻：<span style={{ color: tagColor, fontWeight: 'bold' }}>{time}</span></p>

        {isSingleCol ? (
            <div style={{ borderLeft: `4px solid ${tagColor}`, paddingLeft: '20px', marginTop: '20px' }}>
                <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>👂 聽什麼？</p>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{listenGoal}</p>
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                <div>
                    <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>👂 聽：現象</p>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{listenGoal}</p>
                </div>
                {learnGoal && (
                    <div>
                        <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>💡 學：技巧</p>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{learnGoal}</p>
                    </div>
                )}
            </div>
        )}
    </div>
);

// --- 🛠️ 3. 互動式 Reverse 播放器 ---
const ReversePanningPlayer = ({ isMobile }: { isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        if (duration) {
            setProgress((current / duration) * 100);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div style={{ background: '#0f172a', border: '2px solid #334155', borderRadius: '40px', padding: isMobile ? '20px' : '30px 50px', display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '30px', width: '100%', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', marginTop: '30px' }}>

            {/* 隱藏的真實音樂標籤，請確保檔案放在 public/audio/ 下 */}
            <audio
                ref={audioRef}
                src="/audio/reverse-sweep.mp3"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            <div onClick={togglePlay} style={{ minWidth: '60px', height: '60px', background: '#10b981', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#020617', fontSize: '24px', cursor: 'pointer', boxShadow: isPlaying ? '0 0 20px #10b981' : 'none', transition: 'all 0.2s' }}>
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </div>

            <div style={{ flexGrow: 1 }}>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', background: '#facc15', borderRadius: '50%', position: 'absolute', top: '50%', left: `${progress}%`, transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px #facc15', transition: 'left 0.1s linear' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: '#64748b', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '15px', letterSpacing: '1px' }}>
                    <span>LEFT</span>
                    <span style={{ color: isPlaying ? '#10b981' : '#64748b', transition: 'color 0.3s' }}>
                        {isPlaying ? 'SWEEPING...' : 'READY'}
                    </span>
                    <span>RIGHT</span>
                </div>
            </div>
        </div>
    );
};

// --- 📖 課程主頁面 ---
export default function DynamicsTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 04 : EMOTION & IMPACT
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1.5rem 0', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Dynamics<br />動態與曲式
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        這不是關於把音量推大，而是關於「期待感」的管理。沒有留白的深蹲，就沒有震撼的起跳。
                    </p>
                </header>

                {/* 1. 情緒曲線 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>1. 能量規劃：情緒曲線圖</h2>
                    <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px 10px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <EmotionCurveChart />
                        <p style={{ textAlign: 'center', color: '#10b981', marginTop: '30px', fontStyle: 'italic', fontSize: '1.1rem' }}>
                            專業製作人會在編曲前先「畫」出這條曲線，確保副歌永遠是最高點。
                        </p>
                    </div>
                </section>

                {/* 2. 黃金法則留白 */}
                <section style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: isMobile ? '6rem' : '8rem', fontWeight: '900', color: '#10b981', lineHeight: '1' }}>30%</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', marginTop: '10px' }}>留白，是為了呼吸</div>
                    </div>
                    <div style={{ flex: 1.5, background: 'rgba(16, 185, 129, 0.05)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>退一步，進兩步</h3>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            在進入副歌前，試著將所有樂器「抽乾」半拍。這種瞬間的真空，會讓接下來的音波撞擊顯得更有力量，這就是大師級的秘密配方。
                        </p>
                    </div>
                </section>

                {/* 3. Automation & Reverb Table */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>2. 自動化與空間感調配</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        為什麼副歌要調低 Reverb？因為副歌器樂擁擠，人聲需要更「乾」、更「前面」才能穿透伴奏。
                    </p>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(15,23,42,0.4)', borderRadius: '15px', overflow: 'hidden', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>段落 (Section)</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>Reverb 乾濕比</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>聽感效果 (Result)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>主歌 (Verse)</td>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>25% - 30%</td>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' }}>人聲深遠，營造孤獨與敘事的氛圍。</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '20px', fontWeight: 'bold' }}>副歌 (Chorus)</td>
                                    <td style={{ padding: '20px', color: '#10b981', fontWeight: 'bold' }}>18% - 20%</td>
                                    <td style={{ padding: '20px', color: '#cbd5e1' }}>人聲跳到最前面，清晰且具備權威感。</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. 聽覺實驗室：互動播放器 */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: isMobile ? '2rem 1rem' : '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '1rem' }}>🎧 轉場魔法：Reverse Sweep</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                            戴上耳機點擊播放。聽聽合成器如何從左聲道捲動到右聲道，創造一種把你「吸進副歌」的物理拉扯感。
                        </p>

                        <ReversePanningPlayer isMobile={isMobile} />
                    </div>
                </section>

                {/* 5. 案例研究 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>3. 名曲實戰解析</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <ListeningLabCard
                            tagNum="01" tagColor="#facc15" song="Official 髭男 dism - 《Pretender》" time="00:58 - 01:05"
                            listenGoal="注意聽進入副歌的第一個字「Goodbye」。背景所有樂器完全消失，只剩下人聲。這種極端的斷點創造了無與倫比的衝擊力。"
                            isSingleCol={true}
                        />
                        <ListeningLabCard
                            tagNum="02" tagColor="#3b82f6" song="ONE OK ROCK - 《Wherever you are》" time="03:00 - 03:20"
                            listenGoal="感受副歌時吉他在兩耳張開的寬度（Pan），以及鼓組如何填滿整個空間感。"
                            learnGoal="觀察最後一段副歌如何透過「疊加樂器」與「音場擴張」達到全曲的能量沸點。"
                        />
                    </div>
                </section>

                {/* 結訓 CTA */}
                <section style={{ textAlign: 'center', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#10b981', marginBottom: '1.5rem' }}>編曲修煉達成</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '4rem' }}>你已經掌握了佈局、領空，以及賦予音樂生命的動態。</p>
                    <button
                        onClick={() => router.push('/courses')}
                        style={{
                            background: '#f8fafc', color: '#0f172a', border: 'none',
                            padding: isMobile ? '1.2rem 2rem' : '1.2rem 4rem', fontSize: '1.2rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        返回課程大廳
                    </button>
                </section>

            </div>
        </div>
    );
}