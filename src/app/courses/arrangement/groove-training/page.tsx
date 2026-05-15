"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🎧 A/B 試聽播放器元件 (Inline Style 版) ---
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
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{description}</p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1rem' }}>
                {/* 播放按鈕 */}
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

                {/* 切換按鈕組 */}
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

// --- 📖 課程主頁面 ---
export default function GrooveTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '1.5rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-block', border: '1px solid rgba(249, 115, 22, 0.5)', background: 'rgba(249, 115, 22, 0.1)',
                        color: '#f97316', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold'
                    }}>
                        PHASE 01 : THE FOUNDATION
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff' }}>
                        Groove 節奏骨架
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        音樂的地基。當大鼓與貝斯成為最好的朋友，你的音樂就會開始產生「呼吸感」。
                    </p>
                </header>

                {/* 🎯 破關目標卡片 */}
                <div style={{
                    background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.1) 0%, rgba(0,0,0,0) 100%)',
                    borderLeft: '4px solid #f97316', padding: '1.5rem', borderRadius: '0 16px 16px 0',
                    marginBottom: '4rem', boxSizing: 'border-box'
                }}>
                    <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                        <span>🎯</span> 本章破關目標
                    </h3>
                    <p style={{ color: '#fed7aa', margin: 0, lineHeight: '1.6' }}>
                        聽懂 Kick (底鼓) 與 Bass (貝斯) 的交織關係。學會在編曲時讓這兩個低頻巨獸「Lock-in (鎖定)」，創造出讓聽眾不自覺跟著點頭的強大律動。
                    </p>
                </div>

                {/* 內容區塊 1 */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#f97316', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        1. 為什麼大鼓和貝斯會打架？
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        在一個樂團中，大鼓 (Kick) 負責提供「衝擊力 (Punch)」，而貝斯 (Bass) 負責提供「音高與厚度」。問題在於：<strong style={{ color: '#fff' }}>它們都在爭奪 40Hz 到 100Hz 的極低頻空間。</strong>
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>
                            如果編曲時，貝斯手彈奏的節奏跟鼓手踩大鼓的節奏完全對不上，這兩個低頻怪物就會互相碰撞，產生嚴重的「頻率遮蔽」，導致整首歌聽起來轟轟作響，完全沒有力道。
                        </p>
                    </div>
                </section>

                {/* 內容區塊 2：Lock-in */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#fca311', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                        2. 終極奧義：Lock-in (鎖定)
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        業界稱為「Lock-in」，意思就是：<strong style={{ color: '#fff' }}>大鼓踩下去的那一瞬間，貝斯剛好也彈出那個音。</strong>
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                        <li style={{ marginBottom: '10px' }}>把它們想像成同一個超級樂器：大鼓是「發聲的瞬間」，貝斯是「聲音的延續」。</li>
                        <li>貝斯不需要每一個音都跟著大鼓，但<strong style={{ color: '#fca311' }}>在重拍（特別是第一拍和第三拍）</strong>上，它們必須是最好的朋友。</li>
                    </ul>

                    {/* 🎧 聽覺道場 A/B Test */}
                    <AudioComparer
                        title="🎧 聽覺試煉：感受 Lock-in 的魔力"
                        description="點擊播放，並切換兩個版本。注意聽底下那個低沉的推動力，有沒有覺得「完美鎖定」的版本聽起來比較有彈性、比較爽？"
                        badSrc="/audio/kick-bass-bad.mp3"
                        goodSrc="/audio/kick-bass-good.mp3"
                        isMobile={isMobile}
                    />
                </section>

                {/* 💡 混音助理提示 */}
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed #38bdf8', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '5rem' }}>
                    <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🤖 來自混音助理的進階提示</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                        如果編曲上真的無法完全對齊，混音師會使用一種叫做 <strong>「Sidechain Compression (側鏈壓縮)」</strong> 的技巧：設定成當大鼓發聲時，貝斯音量瞬間自動變小讓路。想學這招嗎？之後在混音區我們會詳細教你！
                    </p>
                </div>

                {/* --- 下一關 CTA --- */}
                <section style={{ textAlign: 'center', paddingBottom: '3rem' }}>
                    <button
                        onClick={() => router.push('/courses/arrangement/voicing-training')}
                        style={{
                            background: 'linear-gradient(135deg, #facc15, #ca8a04)', color: '#000', border: 'none',
                            padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 3.5rem', fontSize: isMobile ? '1.1rem' : '1.3rem',
                            fontWeight: '900', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(250, 204, 21, 0.3)',
                            transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = isMobile ? 'scale(1)' : 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        前往下一關：2. Voicing 把位與音區 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}