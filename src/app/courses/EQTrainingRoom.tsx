"use client";
import React, { useState, useRef, useEffect } from 'react';

// 🎯 定義頻率熱區與一體兩面理論
const FREQ_ZONES = [
    {
        name: '低頻厚度區',
        range: [200, 350],
        tags: ['溫暖 ☕️', '厚實 🧱', '鼻音 👃', '混濁 泥濘 🌧️'],
        theory: '【製作人筆記：溫暖還是泥濘？】\n這就是混音最迷人的矛盾！對單薄的男聲來說，稍微 Boost 這裡能帶來迷人的「胸腔共鳴」與「溫度」；但如果這首歌樂器很多，這裡也是最容易跟 Bass、吉他打架的「混濁區 (Mud)」。\n👉 思考點：你要讓他溫暖，還是要讓整體乾淨？'
    },
    {
        name: '中頻穿透區',
        range: [800, 1500],
        tags: ['廉價喇叭 📻', '電話聲 ☎️', '咬字清晰 🗣️', '硬朗 🔨'],
        theory: '【製作人筆記：存在感與大聲公】\n這個頻段像是一個「大聲公」。Boost 它可以讓人聲的咬字瞬間跳到聽眾面前，非常適合在吵雜的搖滾樂中使用；但在抒情歌裡如果太多，聽起來就會很像用「大賣場廣播」或「便宜耳機」在唱歌。\n👉 思考點：這首歌需要攻擊性，還是需要柔和？'
    },
    {
        name: '高頻空氣區',
        range: [3000, 6000],
        tags: ['刺耳 🔪', '唇齒音 (嘶嘶) 🐍', '明亮 🌟', '親密感 💋'],
        theory: '【製作人筆記：親密感還是刮黑板？】\n這裡是人類耳朵最敏感的區域！適當的存在能讓人聲聽起來非常「昂貴、有空氣感」，彷彿歌手就在你耳邊唱歌；但如果過多，那些「嘶 (S)」、「ㄘ (T)」的氣音就會像指甲刮黑板一樣讓人煩躁。\n👉 思考點：距離感要拉多近？'
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
            // 🚨 這裡記得放你準備好的人聲檔案路徑
            const response = await fetch('/audio/vocal-dry.mp3');
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