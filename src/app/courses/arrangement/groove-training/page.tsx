"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🛠️ 1. 互動式鼓機面板 (Drum Pad) ---
const DrumPad = ({ name, engName, desc, audioSrc, imgSrc, color }: { name: string, engName: string, desc: string, audioSrc: string, imgSrc: string, color: string }) => {
    const [isPressed, setIsPressed] = useState(false);

    const playSound = () => {
        setIsPressed(true);
        const audio = new Audio(audioSrc);
        audio.play();
        setTimeout(() => setIsPressed(false), 150);
    };

    return (
        <div
            onClick={playSound}
            style={{
                background: 'rgba(30, 30, 40, 0.8)', border: `2px solid ${isPressed ? color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px', padding: '20px', cursor: 'pointer', transition: 'all 0.1s ease',
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                boxShadow: isPressed ? `0 0 20px ${color}80` : '0 10px 30px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}
        >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', marginBottom: '15px', overflow: 'hidden', border: `2px solid ${color}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* 鼓組圖片：請將圖片放至 public/images/ 目錄下 */}
                <img src={imgSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<i class="fa-solid fa-drum" style="font-size: 2rem; color: #64748b;"></i>'; }} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 5px 0' }}>{name} <span style={{ color, fontSize: '0.9rem' }}>{engName}</span></h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{desc}</p>
        </div>
    );
};

// --- 🛠️ 2. MIDI 人味對照圖 ---
const MidiHumanizeVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%' }}>
        {/* Robotic MIDI */}
        <div style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}><i className="fa-solid fa-robot"></i> 死板的機器人 (Quantized 100%)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                {/* 網格線 */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" />
                {/* MIDI Notes - 完美對齊且顏色一樣深 (力度相同) */}
                <rect x="50" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="150" y="20" width="30" height="15" fill="#ef4444" rx="2" />
                <rect x="250" y="20" width="30" height="15" fill="#ef4444" rx="2" />
            </svg>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>每個音符都完美貼在網格線上，且力度完全一樣，聽起來像機關槍，毫無律動感。</p>
        </div>

        {/* Humanized MIDI */}
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}><i className="fa-solid fa-person"></i> 注入人味 (Humanized)</p>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                {/* 網格線 */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="150" y1="0" x2="150" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="250" y1="0" x2="250" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                {/* MIDI Notes - 些微偏離且透明度不同 (力度變化) */}
                <rect x="53" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="1" />    {/* 略晚，重音 */}
                <rect x="148" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.6" />  {/* 略早，輕音 */}
                <rect x="254" y="20" width="30" height="15" fill="#10b981" rx="2" opacity="0.8" />  {/* 晚一點點，中音 */}
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>時間有微小偏差 (Swing)，且打擊力度 (Velocity) 有強弱之分，這才是人類打鼓的真實呼吸感。</p>
        </div>
    </div>
);

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
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(234, 88, 12, 0.5)', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 01 : RHYTHM & FOUNDATION
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1.5rem 0', background: 'linear-gradient(135deg, #ea580c, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Groove<br />節奏骨架
                    </h1>

                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(234, 88, 12, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto', textAlign: 'left' }}>
                        <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                            <strong style={{ color: '#ea580c' }}>📖 字彙定義：Groove (律動感)</strong> 是音樂中讓人忍不住想跟著點頭、抖腳的「脈搏」。它主要由爵士鼓與 Bass 構成，決定了整首歌的動力與心跳。
                        </p>
                    </div>
                </header>

                {/* 1. 鼓組解剖學 (互動區) */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>1. 聽見節奏：鼓組解剖學</h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        很多新手聽歌時只注意到主唱跟吉他，卻忽略了撐起整首歌靈魂的「鼓組」。點擊下方按鈕，認識它們的聲音與職責：
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <DrumPad
                            name="大鼓" engName="Kick"
                            desc="音樂的心臟。提供最低沉的衝擊力，決定了歌曲的重拍位置。"
                            audioSrc="/audio/kick.mp3" imgSrc="/images/kick.jpg" color="#ea580c"
                        />
                        <DrumPad
                            name="小鼓" engName="Snare"
                            desc="音樂的巴掌。通常落在第 2、4 拍，是讓人忍不住拍手的清脆聲響。"
                            audioSrc="/audio/snare.mp3" imgSrc="/images/snare.jpg" color="#facc15"
                        />
                        <DrumPad
                            name="踩鈸" engName="Hi-Hat"
                            desc="音樂的時鐘。負責切分時間（如 8 分或 16 分音符），決定了歌曲的「速度感」。"
                            audioSrc="/audio/hihat.mp3" imgSrc="/images/hihat.jpg" color="#38bdf8"
                        />
                        <DrumPad
                            name="銅鈸" engName="Cymbals / Toms"
                            desc="轉場特效。在段落轉換時（如進入副歌），用來製造能量爆發的尾音殘響。"
                            audioSrc="/audio/cymbal.mp3" imgSrc="/images/cymbal.jpg" color="#10b981"
                        />
                    </div>
                </section>

                {/* 2. MIDI 注入人味 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#ea580c', marginBottom: '1rem', borderLeft: '8px solid #c2410c', paddingLeft: '20px' }}>2. 注入靈魂：MIDI 的「人味」</h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        在軟體中編輯鼓組 MIDI 時，最忌諱的就是將所有音符 100% 貼齊在網格線上。真實世界的樂手是不完美的，正是這些微小的瑕疵創造了 Groove。
                    </p>

                    <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <MidiHumanizeVisual isMobile={isMobile} />

                        <div style={{ marginTop: '2rem', borderLeft: '4px solid #ea580c', paddingLeft: '20px' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}><i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#ea580c' }}></i> 實戰手法 (Humanization)</h4>
                            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0, paddingLeft: '20px' }}>
                                <li><strong>力度 (Velocity) 變化：</strong> 不要讓每個音的力度都是 127 (最大值)。設計重音與輕音（Ghost Notes）。</li>
                                <li><strong>時間偏移 (Micro-timing)：</strong> 試著讓 Hi-Hat 比網格線「晚」個幾毫秒出現，會產生一種慵懶、向後拖拽的舒適律動感 (Laid-back)。</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. 核心觀念：鎖定 */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, background: 'rgba(234, 88, 12, 0.05)', padding: '2.5rem', borderRadius: '24px', border: '2px solid rgba(234,88,12,0.3)' }}>
                            <h3 style={{ color: '#ea580c', fontSize: '1.5rem', marginBottom: '1rem' }}>終極密碼：Kick 與 Bass 的鎖定</h3>
                            <p style={{ color: '#f1f5f9', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1rem' }}>
                                鼓提供了骨架，而 Bass 則是包覆骨架的肌肉。編曲時最重要的法則：<strong>確保 Bass 彈奏的節奏，與大鼓 (Kick) 踩下的時間點高度重疊。</strong>
                            </p>
                            <p style={{ color: '#f1f5f9', lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>
                                當這兩個低頻樂器在同一時間發出聲音，音樂的地基就如同水泥般堅不可摧。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 下一關 CTA */}
                <section style={{ textAlign: 'center', paddingBottom: '3rem' }}>
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