"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- 🛠️ 1. 情緒曲線圖 ---
const EmotionCurveChart = () => (
    <svg viewBox="0 0 1000 200" style={{ width: '100%', height: 'auto', overflow: 'visible', maxWidth: '900px', margin: '0 auto 20px', display: 'block' }}>
        <defs>
            <linearGradient id="curve-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.5 }}></stop>
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }}></stop>
            </linearGradient>
        </defs>
        <path d="M 0 180 L 150 150 L 350 165 L 500 60 L 750 20 L 1000 30 L 1000 200 L 0 200 Z" fill="url(#curve-grad)" opacity="0.6"></path>
        <polyline points="0,180 150,150 350,165 500,60 750,20 1000,30" fill="none" stroke="#10b981" strokeWidth="5"></polyline>
        <g fill="#94a3b8" fontSize="12" fontFamily="Urbanist" fontWeight="bold">
            <text x="0" y="195">INTRO</text> <text x="140" y="195">VERSE</text> <text x="325" y="195">PRE-CHO</text> <text x="485" y="195">CHORUS</text> <text x="735" y="195">BRIDGE</text> <text x="940" y="195">OUTRO</text>
        </g>
    </svg>
);

// --- 🛠️ 2. Reverse 波形視覺圖 ---
const ReverseWaveformVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'center', width: '100%' }}>
        {/* Normal Waveform */}
        <div style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', width: '100%' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center' }}>原始音檔 (如銅鈸 Crash)</p>
            <svg viewBox="0 0 200 80" style={{ width: '100%', height: '80px' }}>
                <path d="M10,40 Q20,10 30,40 T50,40 T70,40 T100,40 T140,40 T190,40" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.5" />
                <path d="M10,40 L15,15 L20,65 L25,20 L30,60 L35,25 L40,55 L50,30 L60,50 L80,35 L100,45 L130,38 L190,40" fill="none" stroke="#94a3b8" strokeWidth="3" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>一擊即逝 (Attack 強，無蓄力感)</p>
        </div>

        <div style={{ color: '#10b981', fontSize: '24px', transform: isMobile ? 'rotate(90deg)' : 'none' }}>
            <i className="fa-solid fa-arrow-right"></i>
        </div>

        {/* Reversed Waveform */}
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px', width: '100%' }}>
            <p style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>Reverse 處理後</p>
            <svg viewBox="0 0 200 80" style={{ width: '100%', height: '80px' }}>
                {/* Reversed pattern (mirror of above) */}
                <path d="M10,40 L70,42 L100,45 L120,35 L140,50 L150,30 L160,55 L165,25 L170,60 L175,20 L180,65 L185,15 L190,40" fill="none" stroke="#10b981" strokeWidth="3" />
                {/* Downbeat Line */}
                <line x1="190" y1="0" x2="190" y2="80" stroke="#facc15" strokeWidth="2" strokeDasharray="4 4" />
                <text x="135" y="15" fill="#facc15" fontSize="12" fontWeight="bold">對齊重拍</text>
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>強大的「吸吮感」直到爆發</p>
        </div>
    </div>
);

// --- 🛠️ 3. 聽覺實驗室卡片 (共用元件) ---
const ListeningLabCard = ({
    tagNum, tagColor, song, time, listenGoal, learnGoal, isSingleCol = false
}: {
    tagNum: string, tagColor: string, song: string, time: string, listenGoal: string, learnGoal?: string, isSingleCol?: boolean
}) => (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: `2px solid ${tagColor}`, borderRadius: '24px', padding: '2rem', width: '100%' }}>
        <span style={{ background: tagColor, color: tagColor === '#10b981' ? '#020617' : '#fff', padding: '4px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', marginBottom: '15px', display: 'inline-block' }}>
            CASE STUDY {tagNum}
        </span>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>{song}</h3>
        <p style={{ color: tagColor, fontSize: '1.1rem', marginBottom: '20px', fontWeight: 'bold' }}>📍 關鍵時刻：{time}</p>

        {isSingleCol ? (
            <div style={{ marginTop: '15px' }}>
                <p style={{ color: '#f8fafc', fontSize: '1.1rem', lineHeight: '1.6' }}>{listenGoal}</p>
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '15px' }}>
                <div style={{ borderLeft: `4px solid ${tagColor}`, paddingLeft: '20px' }}>
                    <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>👂 聽：現象</p>
                    <p style={{ color: '#f8fafc', lineHeight: '1.6' }}>{listenGoal}</p>
                </div>
                {learnGoal && (
                    <div style={{ borderLeft: `4px solid #34d399`, paddingLeft: '20px' }}>
                        <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>💡 學：技巧</p>
                        <p style={{ color: '#f8fafc', lineHeight: '1.6' }}>{learnGoal}</p>
                    </div>
                )}
            </div>
        )}
    </div>
);

// --- 🛠️ 4. 極簡實戰音檔播放器 ---
const TransitionAudioPlayer = ({ isMobile }: { isMobile: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
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

    const handleEnded = () => setIsPlaying(false);

    return (
        <div style={{
            background: '#0f172a', border: '2px solid #334155', borderRadius: '40px',
            padding: isMobile ? '20px' : '20px 40px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '20px', width: '100%', maxWidth: '400px',
            margin: '30px auto', boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
        }}>
            <audio
                ref={audioRef}
                src="/audio/reverse-sweep.mp3"
                onEnded={handleEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <div onClick={togglePlay} style={{
                minWidth: '60px', height: '60px', background: '#10b981', borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#020617',
                fontSize: '24px', cursor: 'pointer', boxShadow: isPlaying ? '0 0 20px #10b981' : 'none',
                transition: 'all 0.2s'
            }}>
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </div>

            <div style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px', width: '120px', textAlign: 'left' }}>
                {isPlaying ? 'PLAYING...' : 'LISTEN'}
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

    const termItemStyle = {
        fontSize: '0.9rem',
        background: 'rgba(16, 185, 129, 0.08)',
        padding: '12px',
        borderRadius: '10px',
        borderLeft: '4px solid #10b981',
        color: '#f1f5f9'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 0.5rem' : '4rem 2rem', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 04 : EMOTION & IMPACT
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1.5rem 0', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Dynamics<br />動態：音樂的劇本
                    </h1>

                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '850px', margin: '0 auto', textAlign: 'left' }}>
                        <p style={{ color: '#f8fafc', marginBottom: 0, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
                            <strong style={{ color: '#10b981' }}>📖 字彙定義：Dynamics (動態)</strong> 指的是音樂中的「強弱變化」與「能量管理」。它是透過樂器編制、音量控制與空間感，來設計並引導聽眾情緒起伏的核心技術。
                        </p>
                    </div>
                </header>

                {/* 1. 情緒劇本 & 曲式定義 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>1. 設計你的情緒劇本 (Story Script)</h2>
                    <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px 10px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <EmotionCurveChart />

                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>1. 敘事期 (Verse)</p>
                                <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>以簡約伴奏敘述故事，為後續爆發預留巨大空間。</p>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <p style={{ color: '#facc15', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>2. 蓄力期 (Pre-Cho)</p>
                                <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>加入 Bass 與打擊樂，暗示情緒即將進入高潮。</p>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.5)' }}>
                                <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>3. 爆發期 (Chorus)</p>
                                <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: '1.5', margin: 0 }}>全編制炸進來，呈現最壯闊、飽滿的聽覺震撼。</p>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px dashed rgba(16, 185, 129, 0.4)', padding: '20px', borderRadius: '14px' }}>
                            <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1rem', marginBottom: '15px' }}><i className="fa-solid fa-book-open"></i> 曲式結構字彙定義 (Arrangement Terms)：</p>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Intro (前奏)</b> 引導進入歌曲氛圍的開場。</div>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Verse (主歌)</b> 建立背景與敘事的情節核心。</div>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Pre-Chorus (導歌)</b> 連結主副歌，創造上行張力。</div>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Chorus (副歌)</b> 能量最高點，重複性強的主題。</div>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Bridge (橋段)</b> 提供對比與新鮮感的過渡。</div>
                                <div style={termItemStyle}><b style={{ color: '#facc15', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>Outro (尾奏)</b> 故事終章，引導情緒平復。</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 黃金法則留白 */}
                <section style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: isMobile ? '6rem' : '8rem', fontWeight: '900', color: '#10b981', lineHeight: '1' }}>30%</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', marginTop: '10px' }}>關鍵時刻的「留白」</div>
                    </div>
                    <div style={{ flex: 1.5, background: 'rgba(16, 185, 129, 0.05)', padding: '2.5rem', borderRadius: '24px', border: '2px solid rgba(16,185,129,0.3)' }}>
                        <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>退一步，進兩步</h3>
                        <p style={{ color: '#f1f5f9', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1rem' }}>
                            在進入大副歌的前一刻，試著將所有背景音樂「抽乾」約 200-500 毫秒，<strong style={{ color: '#10b981' }}>讓所有聲響瞬間消失。</strong>
                        </p>
                        <p style={{ color: '#f1f5f9', lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>
                            這種真空狀態，會讓聽眾產生強烈的補償心理，使隨後爆發的音浪具備無比震撼的撞擊力。
                        </p>
                    </div>
                </section>

                {/* 3. Automation 與 Reverb 的聯動 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>2. Automation：賦予空間靈魂</h2>
                    <p style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                        <strong>Automation (自動化控制)</strong> 是混音中非常重要的動態技巧，它允許我們在 DAW 中畫一條線，讓參數「隨著時間自動改變」。
                    </p>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        例如，我們可以利用 Automation 畫一條線，在進入副歌的瞬間，將 Reverb (空間殘響) 的乾濕比自動「拉乾」，這能確保主唱在龐大樂團中依然保持極強的穿透力：
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(15,23,42,0.6)', borderRadius: '15px', overflow: 'hidden', minWidth: '600px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <thead>
                                <tr style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>時間軸 (Timeline)</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>Automation 自動化設定</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: '#10b981', fontSize: '1.1rem' }}>空間戰術 (Tactics)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', color: '#f8fafc' }}>主歌 (Verse) 期間</td>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>維持在 25% - 30%</td>
                                    <td style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' }}>利用較「濕」的空間營造孤獨與親暱氛圍。</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '20px', fontWeight: 'bold', color: '#10b981' }}>進入副歌 (Chorus) 瞬間</td>
                                    <td style={{ padding: '20px', color: '#10b981', fontWeight: 'bold' }}>自動向下降至 18% - 20%</td>
                                    <td style={{ padding: '20px', color: '#cbd5e1' }}>調「乾」讓主唱跳到最前面，清晰且具備能量權威。</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '30px', border: '1px dashed rgba(250, 204, 21, 0.5)', background: 'rgba(250, 204, 21, 0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ color: '#facc15', margin: 0, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> <strong>注意：</strong>以上為利用 Automation 進行空間佈局的觀念。具體 DAW 中如何畫線與操作，<strong>請詳閱後續的《混音實戰篇》課程。</strong>
                        </p>
                    </div>
                </section>

                {/* 4. 轉場魔法：Reverse 原理與實戰 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>3. 轉場魔法：Reverse (反轉音效)</h2>

                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            在現代流行與電子音樂中，<strong>Reverse (音頻反轉)</strong> 是創造「吸吮感」最常用的技巧。它能強迫聽眾將注意力轉移，將他們物理性地「拉」進下一個段落。
                        </p>

                        <div style={{ background: 'rgba(15,23,42,0.4)', padding: isMobile ? '20px' : '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ color: '#10b981', fontSize: '1.3rem', marginBottom: '20px' }}><i className="fa-solid fa-wrench"></i> Reverse 製作三步驟：</h3>
                            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '20px', marginBottom: '30px' }}>
                                <li style={{ marginBottom: '10px' }}><strong>Step 1. 找素材：</strong> 挑選一個打擊感強烈且尾音長的聲音（例如銅鈸 Crash 或合成器 Sweep）。</li>
                                <li style={{ marginBottom: '10px' }}><strong>Step 2. 倒放處理：</strong> 使用軟體中的 Reverse 功能將音頻波形完全倒轉。原本「碰——斯」的聲音會變成「斯——碰」。</li>
                                <li><strong style={{ color: '#facc15' }}>Step 3. 對齊重拍：</strong> 將反轉後聲音的<strong>「最大音量點 (Peak)」</strong>，精準對齊到進入副歌的第一拍 (Downbeat) 上。</li>
                            </ul>

                            <ReverseWaveformVisual isMobile={isMobile} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: isMobile ? '2rem 1rem' : '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '1rem' }}>🎧 轉場實戰：主歌進副歌</h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                            這是一段實戰音檔。戴上耳機，注意聽進入副歌前，背景的 Reverse 效果結合了 <strong>Pan (聲道轉向)</strong>，從左耳一路拉扯到右耳，接著瞬間引爆副歌的所有樂器！
                        </p>

                        <TransitionAudioPlayer isMobile={isMobile} />
                    </div>
                </section>

                {/* 5. 案例研究 */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '2rem', borderLeft: '8px solid #059669', paddingLeft: '20px' }}>4. 名曲實戰解析</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <ListeningLabCard
                            tagNum="01" tagColor="#facc15" song="Official 髭男 dism - 《Pretender》" time="00:58 (情緒斷點)"
                            listenGoal="注意進入副歌的第一個字「Goodbye」。所有聲響瞬間消失，只剩下主唱的乾淨人聲，創造了強大的情緒撞擊力。"
                            isSingleCol={true}
                        />
                        <ListeningLabCard
                            tagNum="02" tagColor="#3b82f6" song="ONE OK ROCK - 《Wherever you are》" time="03:00 (能量堆疊)"
                            listenGoal="感受副歌時吉他在兩耳張開的寬度（Pan），以及鼓組如何填滿整個空間感。"
                            learnGoal="觀察最後一段副歌如何透過「弦樂群」與「堆疊樂器」達到能量沸點，展現全曲最廣闊的音場寬度。"
                        />
                    </div>
                </section>

                {/* 結訓 CTA */}
                <section style={{ textAlign: 'center', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#10b981', marginBottom: '1.5rem' }}>編曲修煉達成</h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '4rem' }}>你已經掌握了：架構、佈局、領空與情緒劇本。</p>
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