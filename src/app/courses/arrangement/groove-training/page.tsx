"use client";
import { useState, useRef, useEffect } from 'react';

// 🥁 鼓組資料庫 (加入音檔路徑與修正後的座標)
// ⚠️ 請確保你的音檔放在專案的 public/audio/ 資料夾底下
const DRUM_PARTS = [
    {
        id: 'kick',
        name: '大鼓 Kick',
        desc: '音樂的心臟。提供最低沉的衝擊力，決定了歌曲的重拍位置。',
        color: '#f97316', // 橘色
        audioSrc: '/audio/kick.mp3',
        pos: { top: '75%', left: '50%' } // 修正：正下方
    },
    {
        id: 'snare',
        name: '小鼓 Snare',
        desc: '音樂的巴掌。通常落在第 2、4 拍，是讓人忍不住拍手的清脆聲響。',
        color: '#eab308', // 黃色
        audioSrc: '/audio/snare.mp3',
        pos: { top: '55%', left: '38%' } // 修正：大鼓的左上方，小鼓本體的位置
    },
    {
        id: 'hihat',
        name: '踩鈸 Hi-Hat',
        desc: '音樂的時鐘。負責切分時間（如 8 或 16 分音符），決定歌曲的速度感。',
        color: '#22c55e', // 綠色
        audioSrc: '/audio/hihat.mp3',
        pos: { top: '48%', left: '25%' } // 修正：最左側的中間高度
    },
    {
        id: 'tom',
        name: '中鼓 / 落地鼓 Tom Tom',
        desc: '點綴與過門 (Fill-in)。在段落銜接時，提供極具張力的低頻打擊感。',
        color: '#a855f7', // 紫色
        audioSrc: '/audio/tom.mp3',
        pos: { top: '40%', left: '62%' } // 修正：大鼓的右上方與右側
    },
    {
        id: 'crash',
        name: '銅鈸 Crash',
        desc: '轉場特效。在段落轉換時（如進入大副歌），用來製造能量爆發的巨響。',
        color: '#38bdf8', // 藍色
        audioSrc: '/audio/crash.mp3',
        pos: { top: '25%', left: '28%' } // 修正：左上方的金屬鈸
    }
];

export default function DrumAnatomySection() {
    const [playingId, setPlayingId] = useState<string | null>(null);

    // 使用 useRef 來儲存 Audio 物件，這樣才不會因為畫面重新渲染而流失音檔進度
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

    // 初始化音檔
    useEffect(() => {
        DRUM_PARTS.forEach(part => {
            const audio = new Audio(part.audioSrc);
            // 當播完 8 個小節自動停止時，解除播放狀態
            audio.addEventListener('ended', () => setPlayingId(null));
            audioRefs.current[part.id] = audio;
        });

        // 離開頁面時停止所有聲音 (Clean up)
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    // 🎵 播放/停止控制邏輯
    const togglePlay = (id: string) => {
        const currentAudio = audioRefs.current[id];

        if (playingId === id) {
            // 情況 A：點擊正在播放的鼓 -> 停止並歸零
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setPlayingId(null);
        } else {
            // 情況 B：點擊另一個鼓 -> 先停掉前一個，再播新的
            if (playingId && audioRefs.current[playingId]) {
                audioRefs.current[playingId].pause();
                audioRefs.current[playingId].currentTime = 0;
            }
            currentAudio.play();
            setPlayingId(id);
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', background: '#020617', color: '#fff', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* 標題區塊 */}
                <div style={{ borderLeft: '4px solid #f97316', paddingLeft: '1rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#f97316', margin: '0 0 0.5rem 0' }}>1. 聽見節奏：鼓組解剖學</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                        很多新手聽歌時只注意到主唱跟吉他，卻忽略了撐起整首歌靈魂的「鼓組」。戴上耳機，點擊下方區塊來認識它們的聲音與職責：
                    </p>
                </div>

                {/* 🥁 互動大圖區塊 */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    background: "url('/drum-kit-bg.jpg') center/cover no-repeat", // ⚠️ 換成你乾淨的鼓組背景圖路徑
                    borderRadius: '24px',
                    marginBottom: '3rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {DRUM_PARTS.map((part) => (
                        <button
                            key={`label-${part.id}`}
                            onClick={() => togglePlay(part.id)}
                            style={{
                                position: 'absolute',
                                top: part.pos.top,
                                left: part.pos.left,
                                transform: 'translate(-50%, -50%)', // 確保座標對準標籤正中心
                                background: part.color,
                                color: '#000',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: playingId === part.id ? `0 0 20px ${part.color}` : '0 4px 10px rgba(0,0,0,0.5)',
                                transition: 'all 0.2s ease',
                                zIndex: playingId === part.id ? 10 : 1,
                                // 正在播放時，給一點心跳放大的效果
                                scale: playingId === part.id ? '1.1' : '1'
                            }}
                        >
                            {playingId === part.id ? '⏸ 停止' : part.name.split(' ')[0]}
                        </button>
                    ))}
                </div>

                {/* 🃏 下方卡片解說區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {DRUM_PARTS.map((part) => (
                        <div
                            key={`card-${part.id}`}
                            onClick={() => togglePlay(part.id)}
                            style={{
                                background: '#0f172a',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: playingId === part.id ? `2px solid ${part.color}` : '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: playingId === part.id ? `0 0 15px ${part.color}44` : 'none',
                                textAlign: 'center'
                            }}
                        >
                            {/* 用一個圓圈模擬樂器小圖示，這裡用顏色代替，你也可以放真實圖片 */}
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b', border: `3px solid ${part.color}`,
                                margin: '0 auto 1rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'
                            }}>
                                {playingId === part.id ? '🔊' : '🥁'}
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                                {part.name.split(' ')[0]} <span style={{ color: part.color, fontSize: '0.9rem' }}>{part.name.split(' ')[1]}</span>
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                                {part.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}