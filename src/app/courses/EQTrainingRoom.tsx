"use client";
import React, { useState, useRef, useEffect } from 'react';

// 🎯 定義頻率熱區與一體兩面理論 (木吉他全頻段旗艦版)
const FREQ_ZONES = [
    {
        name: '50Hz：極低頻 (Sub Bass)',
        range: [20, 75],
        tags: ['地板震動 📳', '轟隆隆 🌋', '無謂的能量 🗑️'],
        theory: '【製作人筆記：拿掉它就對了】\n對木吉他來說，這個頻段幾乎沒有有用的音樂資訊，通常只是冷氣聲、麥克風架震動，或是讓喇叭白白耗能的低頻垃圾。在混音時，我們通常會毫不猶豫地用 High-pass Filter 把這裡切掉 (Cut)，把空間讓給大鼓和貝斯。'
    },
    {
        name: '100Hz：琴身低頻 (Boom)',
        range: [76, 150],
        tags: ['溫暖 ☕️', '肥厚 🥩', '轟轟聲 💣'],
        theory: '【製作人筆記：溫暖還是轟炸？】\n這裡是木吉他琴身共鳴的基音。保留這裡會讓吉他聽起來很大把、很溫暖；但如果這首歌的編制很大（有鼓有貝斯），這裡通常是第一個要被 Cut 的地方，以免整個中低頻大塞車。'
    },
    {
        name: '200Hz：厚度與泥濘 (Warmth / Mud)',
        range: [151, 280],
        tags: ['厚實 🧱', '鼻音 👃', '混濁 泥濘 🌧️'],
        theory: '【製作人筆記：肉感的來源】\n這個頻段給予了吉他「肉感」。如果吉他聽起來太單薄，可以稍微 Boost；但如果錄音環境不好，這裡很容易積聚讓聲音聽起來「糊糊髒髒」的頻率。'
    },
    {
        name: '400Hz：紙箱悶音區 (Boxiness)',
        range: [281, 560],
        tags: ['紙箱味 📦', '悶悶的 🕳️', '木頭敲擊 🪵'],
        theory: '【製作人筆記：傳說中的紙箱聲】\n許多在一般房間錄製的木吉他，在這個頻段會特別肥大。適度挖空 (Cut) 這裡，是讓木吉他脫離「Demo 感」、瞬間獲得現代流行樂透明感的魔法秘訣。'
    },
    {
        name: '800Hz：廉價感與硬度 (Cheap Speaker)',
        range: [561, 1100],
        tags: ['便宜喇叭 📻', '塑膠味 🪣', '堅硬 🔨'],
        theory: '【製作人筆記：木頭變塑膠】\n木吉他在這裡如果太多，會聽起來像是一把便宜的塑膠玩具吉他，或是像大賣場廣播的聲音。稍微 Cut 掉一點，通常能有效提升吉他音色的「高級感」。'
    },
    {
        name: '1.5kHz：鼻音與攻擊性 (Nasal / Honk)',
        range: [1101, 2200],
        tags: ['電話聲 ☎️', '鼻腔共鳴 🗣️', '攻擊性 🤺'],
        theory: '【製作人筆記：刷扣的衝擊力】\n當你用力刷扣 (Strumming) 時，那種打在臉上的衝擊力就在這裡。如果吉他聽起來太刺耳、太搶戲，可以從這裡挖掉一點；相反的，如果在混音中吉他快被淹沒了，推高這裡能讓它馬上跳出來。'
    },
    {
        name: '3kHz：穿透力與刺耳 (Presence / Harsh)',
        range: [2201, 4500],
        tags: ['刺耳 🔪', '刮耳 😖', '穿透力 💎'],
        theory: '【製作人筆記：人類最敏感的區域】\n我們的耳朵對這個頻段極度敏感！適當的存在能讓吉他非常有存在感，但只要稍微推太多，聽眾的耳朵很快就會感到疲勞煩躁。這是一個需要小心對待的雙面刃。'
    },
    {
        name: '6kHz：清脆撥弦區 (Clarity / Pick)',
        range: [4501, 9000],
        tags: ['清脆 ✨', '金屬弦聲 🎸', '明亮 ☀️'],
        theory: '【製作人筆記：決定亮度的關鍵】\n這是木吉他「鋼弦」摩擦與 Pick 彈撥的聲音集中地。想要一把聽起來清脆、明亮、適合流行樂的木吉他？稍微 Boost 這個頻段就對了！'
    },
    {
        name: '12kHz：空氣感 (Air)',
        range: [9001, 20000],
        tags: ['空氣感 🌬️', '嘶嘶聲 🐍', '昂貴感 💎'],
        theory: '【製作人筆記：百萬錄音室的秘密】\n這裡是超高頻的「空氣感」。提升這裡不會改變吉他本身的音高，但會讓聲音充滿細節與呼吸感，彷彿你打開了高音單體，給了吉他一種「昂貴」的質感。'
    }
];

export default function EQDictionaryRoom() {
    const [sliderValue, setSliderValue] = useState(420);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [eqMode, setEqMode] = useState<'boost' | 'cut' | 'flat'>('boost'); // 新增 EQ 模式切換

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    // 頻率對數換算
    const minFreq = 20;
    const maxFreq = 20000;
    const minLog = Math.log10(minFreq);
    const maxLog = Math.log10(maxFreq);
    const frequency = Math.round(Math.pow(10, minLog + ((maxLog - minLog) * (sliderValue / 1000))));

    // 找出目前滑桿落在哪個熱區
    const currentZone = FREQ_ZONES.find(z => frequency >= z.range[0] && frequency <= z.range[1]);

    const loadAudio = async () => {
        setIsLoading(true);
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        try {
            // 🚨 這裡改回你原本的木吉他路徑
            const response = await fetch('/guitar-loop.mp3');
            const arrayBuffer = await response.arrayBuffer();
            bufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error("音檔載入失敗", e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadAudio();
    }, []);

    // 監聽滑桿與模式變化
    useEffect(() => {
        if (!filterRef.current) return;

        filterRef.current.frequency.value = frequency;

        // 根據模式切換 Gain 與 Q 值
        if (eqMode === 'boost') {
            filterRef.current.gain.setTargetAtTime(15, audioCtxRef.current!.currentTime, 0.1);
            filterRef.current.Q.value = 6.0; // 窄 Q 抓蟲
        } else if (eqMode === 'cut') {
            filterRef.current.gain.setTargetAtTime(-12, audioCtxRef.current!.currentTime, 0.1);
            filterRef.current.Q.value = 3.0; // 稍微寬一點的 Cut
        } else {
            filterRef.current.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.1);
        }
    }, [frequency, eqMode]);

    const togglePlay = () => {
        if (!audioCtxRef.current || !bufferRef.current) return;

        if (isPlaying) {
            sourceRef.current?.stop();
            setIsPlaying(false);
        } else {
            const ctx = audioCtxRef.current;
            sourceRef.current = ctx.createBufferSource();
            sourceRef.current.buffer = bufferRef.current;
            sourceRef.current.loop = true;

            filterRef.current = ctx.createBiquadFilter();
            filterRef.current.type = 'peaking'; // 鐘型曲線
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = eqMode === 'cut' ? 3.0 : 6.0;
            filterRef.current.gain.value = eqMode === 'flat' ? 0 : (eqMode === 'boost' ? 15 : -12);

            sourceRef.current.connect(filterRef.current);
            filterRef.current.connect(ctx.destination);

            sourceRef.current.start();
            setIsPlaying(true);
        }
    };

    const mapFreqToX = (f: number) => ((Math.log10(f) - minLog) / (maxLog - minLog)) * 1000;
    const peakX = mapFreqToX(frequency);

    // 動態計算 SVG 曲線 (Boost / Cut / Flat)
    const gainOffset = eqMode === 'boost' ? -110 : (eqMode === 'cut' ? 60 : 0);
    const qWidth = eqMode === 'cut' ? 100 : 50;
    const eqPath = eqMode === 'flat'
        ? `M 0,150 L 1000,150`
        : `M 0,150 L ${peakX - qWidth},150 C ${peakX - qWidth / 2},150 ${peakX - 10},${150 + gainOffset} ${peakX},${150 + gainOffset} C ${peakX + 10},${150 + gainOffset} ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', background: '#020617', borderRadius: '24px', color: '#fff', border: '1px solid #1e293b' }}>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{ color: '#fca311', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>FREQUENCY DICTIONARY</span>
                <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>個人聽覺字典：人聲篇</h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '0.95rem' }}>
                    拋棄「正確答案」，尋找你的感覺。<br />滑動下方 EQ，並切換 Boost (放大) 與 Cut (挖空) 來建立你的頻率記憶。
                </p>
            </div>

            {/* EQ 視覺化視窗 */}
            <div style={{ width: '100%', height: '250px', background: '#0f172a', borderRadius: '16px', border: '1px solid #334155', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* 背景格線 */}
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {[100, 500, 1000, 5000, 10000].map((f) => (
                        <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(56, 189, 248, 0.1)' }}>
                            <span style={{ position: 'absolute', bottom: '8px', left: '4px', color: '#475569', fontSize: '0.65rem' }}>{f >= 1000 ? `${f / 1000}k` : f}Hz</span>
                        </div>
                    ))}
                    {/* 中間零基準線 */}
                    <div style={{ position: 'absolute', top: '150px', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.3)' }}></div>
                </div>
                <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%' }}>
                    <path d={eqPath} fill="none" stroke={eqMode === 'cut' ? '#ef4444' : '#38bdf8'} strokeWidth="4" style={{ transition: 'all 0.3s' }} />
                    {eqMode !== 'flat' && (
                        <circle cx={peakX} cy={150 + gainOffset} r="8" fill="#fff" style={{ filter: `drop-shadow(0 0 8px ${eqMode === 'cut' ? '#ef4444' : '#38bdf8'})`, transition: 'all 0.3s' }} />
                    )}
                </svg>

                <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                    {frequency} Hz <span style={{ fontSize: '1rem', color: eqMode === 'boost' ? '#38bdf8' : (eqMode === 'cut' ? '#ef4444' : '#94a3b8') }}>
                        {eqMode === 'boost' ? '+15dB' : (eqMode === 'cut' ? '-12dB' : '0dB')}
                    </span>
                </div>
            </div>

            {/* 核心操作區：播放與模式切換 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={togglePlay} disabled={isLoading}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: isPlaying ? '#1e293b' : '#10b981', color: '#fff', fontWeight: '900', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    {isLoading ? '載入中...' : isPlaying ? '⏹️ 停止' : '▶️ 播放音檔'}
                </button>

                <div style={{ display: 'flex', background: '#1e293b', borderRadius: '12px', padding: '0.2rem' }}>
                    <button onClick={() => setEqMode('flat')} style={{ padding: '0.8rem 1.5rem', border: 'none', background: eqMode === 'flat' ? '#334155' : 'transparent', color: eqMode === 'flat' ? '#fff' : '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Bypass (原聲)</button>
                    <button onClick={() => setEqMode('boost')} style={{ padding: '0.8rem 1.5rem', border: 'none', background: eqMode === 'boost' ? '#38bdf8' : 'transparent', color: eqMode === 'boost' ? '#020617' : '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🔼 放大聽特徵</button>
                    <button onClick={() => setEqMode('cut')} style={{ padding: '0.8rem 1.5rem', border: 'none', background: eqMode === 'cut' ? '#ef4444' : 'transparent', color: eqMode === 'cut' ? '#fff' : '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🔽 挖空聽差異</button>
                </div>
            </div>

            {/* 掃頻滑桿 */}
            <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #1e293b' }}>
                <input
                    type="range" min="0" max="1000" value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#fca311' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#475569', fontSize: '0.75rem' }}>
                    <span>20Hz</span><span>滑動尋找共鳴點</span><span>20kHz</span>
                </div>
            </div>

            {/* 動態展示：聽覺感受與筆記 (只在熱區顯示) */}
            <div style={{ minHeight: '200px' }}>
                {currentZone ? (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                            <h3 style={{ margin: 0, color: '#e2e8f0' }}>你進入了：<span style={{ color: '#10b981' }}>{currentZone.name}</span></h3>
                        </div>

                        {/* 感覺標籤 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', alignSelf: 'center', marginRight: '0.5rem' }}>聽起來像：</span>
                            {currentZone.tags.map(tag => (
                                <span key={tag} style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', color: '#cbd5e1' }}>{tag}</span>
                            ))}
                        </div>

                        {/* 製作人筆記 */}
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8', padding: '1.2rem', borderRadius: '0 12px 12px 0' }}>
                            <p style={{ margin: 0, color: '#f8fafc', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{currentZone.theory}</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#475569', paddingTop: '3rem' }}>
                        <span style={{ fontSize: '2rem' }}>🎧</span>
                        <p>持續滑動，尋找下一個頻率熱區...</p>
                    </div>
                )}
            </div>
        </div>
    );
}