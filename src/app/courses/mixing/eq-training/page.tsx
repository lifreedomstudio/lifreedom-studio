"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 定義樂器庫與對應的檔案路徑
const TRACKS = {
    guitar: { id: 'guitar', name: '🎸 木吉他', file: '/audio/guitar-loop.mp3' }, // 🚨 確保音檔路徑正確 (建議統一放 /audio)
    drum: { id: 'drum', name: '🥁 大鼓', file: '/audio/drum-loop.mp3' },
    vocal: { id: 'vocal', name: '🎤 主唱', file: '/audio/vocal-dry.mp3' }
};

// 📚 定義多樂器頻率字典 (旗艦百科版)
const DICTIONARIES = {
    guitar: [
        { range: [20, 75], name: '50Hz：極低頻 (Sub Bass)', tags: ['地板震動 📳', '無謂能量 🗑️'], theory: '【主委筆記：拿掉它就對了】\n對木吉他來說，這裡通常是冷氣或環境震動。建議用 High-pass Filter (HPF) 切掉，把地下室空間讓給大鼓和貝斯。' },
        { range: [76, 150], name: '100Hz：琴身低頻 (Boom)', tags: ['溫暖 ☕️', '轟轟聲 💣'], theory: '【主委筆記：溫暖還是轟炸？】\n琴身共鳴基音。保留會讓吉他很溫暖；但編制大時，這裡是第一個要被 Cut 的地方。' },
        { range: [151, 280], name: '200Hz：厚度與泥濘 (Warmth)', tags: ['厚實 🧱', '鼻音 👃'], theory: '【主委筆記：肉感的來源】\n給予吉他「肉感」。如果太單薄可稍加；但環境不好時，這裡最容易積聚糊糊髒髒的聲音。' },
        { range: [281, 560], name: '400Hz：紙箱悶音區 (Boxiness)', tags: ['紙箱味 📦', '悶悶的 🕳️'], theory: '【主委筆記：傳說中的紙箱聲】\n適度挖空 (Cut) 這裡，是讓木吉他獲得現代流行樂「透明感」的魔法秘訣。' },
        { range: [561, 1100], name: '800Hz：廉價感與硬度', tags: ['便宜喇叭 📻', '塑膠味 🪣'], theory: '【主委筆記：木頭變塑膠】\n太多會聽起來像便宜玩具。稍微 Cut 掉能有效提升音色的「高級感」。' },
        { range: [1101, 2200], name: '1.5kHz：鼻音與攻擊性', tags: ['電話聲 ☎️', '攻擊性 🤺'], theory: '【主委筆記：刷扣的衝擊力】\n用力刷扣的衝擊力就在這。太刺耳就挖掉一點；快被淹沒了就推高讓它跳出來。' },
        { range: [2201, 4500], name: '3kHz：穿透力與刺耳', tags: ['刺耳 🔪', '穿透力 💎'], theory: '【主委筆記：人類最敏感區域】\n耳朵對這極度敏感！推太多聽眾很快就會疲勞，需要小心處理。' },
        { range: [4501, 9000], name: '6kHz：清脆撥弦區', tags: ['清脆 ✨', '金屬弦 🎸'], theory: '【主委筆記：決定的亮點】\n這是鋼弦摩擦與 Pick 彈撥的聲音。想要清脆明亮的吉他，稍微 Boost 這裡！' },
        { range: [9001, 20000], name: '12kHz：空氣感 (Air)', tags: ['空氣感 🌬️', '昂貴感 💎'], theory: '【主委筆記：百萬錄音室秘密】\n提升這裡會讓聲音充滿呼吸感與細節，賦予吉他一種「昂貴」的質感。' }
    ],
    drum: [
        { range: [20, 60], name: '50Hz：超低頻下潛', tags: ['褲管震動 👖', '深沉 🌊'], theory: '【主委筆記：舞池的靈魂】\n讓地板震動的頻率！EDM 必備；但流行搖滾推太多會變混濁且吃掉動態。' },
        { range: [61, 150], name: '100Hz：衝擊力 (Punch)', tags: ['拳拳到肉 🥊', '胸腔震擊 🫁'], theory: '【主委筆記：胸口碎大石】\n力量來源。Boost 會讓大鼓結實有力；注意不要跟貝斯 (Bass) 打架。' },
        { range: [151, 350], name: '250Hz：混濁泥濘區 (Mud)', tags: ['糊糊的 💩', '轟鳴 🌪️'], theory: '【主委筆記：大鼓清道夫】\n大鼓最容易聽起來「髒」的地方。專業混音師常做 Cut，讓貝斯有呼吸空間。' },
        { range: [351, 800], name: '500Hz：紙盒敲擊 (Cardboard)', tags: ['敲紙盒 📦', '塑膠桶 🪣'], theory: '【主委筆記：傳說中紙箱味】\n大膽挖空這裡吧，你會得到經典「微笑 EQ」大鼓聲，不再像在拍塑膠桶。' },
        { range: [801, 2500], name: '1.5kHz：籃球拍打聲', tags: ['拍皮球 🏀', '木頭敲擊 🪵'], theory: '【主委筆記：尷尬中頻】\n通常沒什麼好處。大部分情況會避開這裡，把頻段讓給人聲與吉他。' },
        { range: [2501, 6000], name: '4kHz：鼓槌撞擊 (Click)', tags: ['噠噠聲 🥢', '穿透力 ⚡️'], theory: '【主委筆記：穿透混音關鍵】\n鼓槌撞擊鼓皮瞬間。金屬或現代搖滾 Boost 這裡能讓大鼓「穿透」厚重吉他牆。' },
        { range: [6001, 20000], name: '8kHz：銅鈸串音 (Bleed)', tags: ['嘶嘶聲 🐍', '串音 🎧'], theory: '【主委筆記：小心漏音】\n大鼓本身在這幾乎沒聲。Boost 通常只會放大背景銅鈸聲，有時建議直接切掉。' }
    ],
    vocal: [
        { range: [20, 80], name: '50Hz：噴麥噪音 (Plosives)', tags: ['蹦蹦聲 💥', '震動 🎤'], theory: '【主委筆記：低頻殺手】\n人聲不會到這麼低！通常是發「P、B」子音時的噴麥聲。毫不猶豫地切掉它吧！' },
        { range: [81, 150], name: '120Hz：胸腔共鳴 (Chest)', tags: ['胸腔 🫁', '溫暖 ☕️'], theory: '【主委筆記：男聲底氣】\n男聲磁性的來源。對女聲來說這裡偏低，太多反而會顯得沉重。' },
        { range: [151, 300], name: '250Hz：鼻音與泥濘 (Mud)', tags: ['鼻音 👃', '糊糊的 🌧️'], theory: '【主委筆記：溫暖 vs 混濁】\n男聲易產生感冒鼻音需 Cut；但對偏尖的女聲，保留這裡能增加溫暖度。' },
        { range: [301, 800], name: '500Hz：廉價麥克風味', tags: ['電話聲 ☎️', '紙筒聲 🧻'], theory: '【主委筆記：塑膠感】\n太多會像用便宜麥克風在唱歌。稍微挖空能讓人聲立刻變得自然、昂貴。' },
        { range: [801, 2000], name: '1.5kHz：咬字清晰度', tags: ['捏鼻子 🤏', '清晰 📢'], theory: '【主委筆記：存在感】\n掌管咬字清晰。密集的配器中 Boost 能殺出重圍；但在抒情歌中太多會很刺。' },
        { range: [2001, 5000], name: '3.5kHz：穿透與貼近', tags: ['貼近感 💋', '穿透 💎'], theory: '【主委筆記：警報區】\n適當提升會有貼在耳邊唱的親密感；但也是最容易讓聽眾耳朵痛的區域。' },
        { range: [5001, 9000], name: '7kHz：唇齒音 (Sibilance)', tags: ['嘶嘶聲 🐍', '氣音 💨'], theory: '【主委筆記：齒音戰場】\n「斯、疵」等摩擦音。太多會極度不適（尤其戴耳機），需用 De-esser 壓制。' },
        { range: [9001, 20000], name: '12kHz：空氣感與光澤', tags: ['空氣感 🌬️', '光澤 🌟'], theory: '【主委筆記：公關行銷部】\n想讓女聲有「天使光環」？推高這裡吧！它能賦予人聲高貴的呼吸感與細節。' }
    ]
};

export default function EQDictionaryRoom() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [activeTrack, setActiveTrack] = useState<'guitar' | 'drum' | 'vocal'>('guitar');
    const [sliderValue, setSliderValue] = useState(420);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [eqMode, setEqMode] = useState<'boost' | 'cut' | 'flat'>('boost');

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    const minFreq = 20;
    const maxFreq = 20000;
    const minLog = Math.log10(minFreq);
    const maxLog = Math.log10(maxFreq);
    const frequency = Math.round(Math.pow(10, minLog + ((maxLog - minLog) * (sliderValue / 1000))));

    const currentDictionary = DICTIONARIES[activeTrack];
    const currentZone = currentDictionary.find(z => frequency >= z.range[0] && frequency <= z.range[1]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const loadAudio = async (trackId: 'guitar' | 'drum' | 'vocal') => {
        if (isPlaying) {
            sourceRef.current?.stop();
            setIsPlaying(false);
        }
        setIsLoading(true);
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        try {
            const response = await fetch(TRACKS[trackId].file);
            const arrayBuffer = await response.arrayBuffer();
            bufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error("音檔載入失敗，請確認 /public/audio/ 底下有無對應音檔", e);
        }
        setIsLoading(false);
    };

    useEffect(() => { loadAudio(activeTrack); }, [activeTrack]);

    useEffect(() => {
        if (!filterRef.current || !audioCtxRef.current) return;

        // 🚨 使用 setTargetAtTime 平滑過渡頻率，避免調整滑桿時產生雜音 (Zipper Noise)
        filterRef.current.frequency.setTargetAtTime(frequency, audioCtxRef.current.currentTime, 0.05);

        if (eqMode === 'boost') {
            filterRef.current.gain.setTargetAtTime(15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(6.0, audioCtxRef.current.currentTime, 0.1);
        } else if (eqMode === 'cut') {
            filterRef.current.gain.setTargetAtTime(-15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(3.0, audioCtxRef.current.currentTime, 0.1);
        } else {
            filterRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
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
            filterRef.current.type = 'peaking';
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = eqMode === 'cut' ? 3.0 : 6.0;
            filterRef.current.gain.value = eqMode === 'flat' ? 0 : (eqMode === 'boost' ? 15 : -15);

            sourceRef.current.connect(filterRef.current);
            filterRef.current.connect(ctx.destination);
            sourceRef.current.start();
            setIsPlaying(true);
        }
    };

    // --- 繪製 EQ 曲線邏輯 ---
    const mapFreqToX = (f: number) => ((Math.log10(f) - minLog) / (maxLog - minLog)) * 1000;
    const peakX = mapFreqToX(frequency);
    const gainOffset = eqMode === 'boost' ? -100 : (eqMode === 'cut' ? 80 : 0);
    const qWidth = eqMode === 'cut' ? 120 : 60;

    // 繪製平滑的鐘型曲線 (Bell Curve)
    const eqPath = eqMode === 'flat'
        ? `M 0,150 L 1000,150`
        : `M 0,150 L ${peakX - qWidth},150 C ${peakX - qWidth / 2},150 ${peakX - 10},${150 + gainOffset} ${peakX},${150 + gainOffset} C ${peakX + 10},${150 + gainOffset} ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    // 依據模式切換顏色
    const themeColor = eqMode === 'cut' ? '#ef4444' : (eqMode === 'boost' ? '#10b981' : '#64748b');

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* 1. Header (接續公寓主委比喻) */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 02 : THE FREQUENCY MANAGER
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        EQ 頻率實驗室
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        歡迎來到社區管委會！在這裡，我們不調音量，我們調的是「特徵」。<br />
                        打開喇叭或戴上耳機，透過誇張的 <strong>Boost (放大)</strong> 與 <strong>Cut (挖空)</strong>，<br />訓練你的大腦記住這些關鍵的頻率長什麼樣子。
                    </p>
                </header>

                {/* 2. 實驗室主體 */}
                <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', padding: isMobile ? '1.5rem' : '3rem', borderRadius: '32px', border: '1px solid #1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                    {/* 樂器切換 */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {Object.values(TRACKS).map(track => (
                            <button
                                key={track.id}
                                onClick={() => setActiveTrack(track.id as any)}
                                style={{
                                    padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem',
                                    background: activeTrack === track.id ? '#10b981' : 'rgba(255,255,255,0.05)',
                                    color: activeTrack === track.id ? '#020617' : '#94a3b8',
                                    border: `1px solid ${activeTrack === track.id ? '#10b981' : '#334155'}`,
                                    boxShadow: activeTrack === track.id ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                                }}
                            >
                                {track.name}
                            </button>
                        ))}
                    </div>

                    {/* EQ 視覺面板 (SVG) */}
                    <div style={{ width: '100%', height: isMobile ? '200px' : '280px', background: '#020617', borderRadius: '20px', border: '2px solid #1e293b', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)' }}>
                        {/* 網格線 */}
                        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                            {[50, 100, 500, 1000, 5000, 10000].map(f => (
                                <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255, 255, 255, 0.05)' }}>
                                    <span style={{ position: 'absolute', bottom: '10px', left: '6px', color: '#475569', fontSize: '0.75rem', fontWeight: 'bold' }}>{f >= 1000 ? `${f / 1000}k` : f}Hz</span>
                                </div>
                            ))}
                            {/* 0dB 基準線 */}
                            <div style={{ position: 'absolute', top: '150px', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.2)' }}></div>
                        </div>

                        {/* 動態曲線 */}
                        <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.3))' }}>
                            <path d={eqPath} fill="none" stroke={themeColor} strokeWidth="5" style={{ transition: 'all 0.1s ease' }} />
                            {/* 頻率控制點 */}
                            {eqMode !== 'flat' && (
                                <g style={{ transition: 'all 0.1s ease' }}>
                                    <circle cx={peakX} cy={150 + gainOffset} r="10" fill={themeColor} />
                                    <circle cx={peakX} cy={150 + gainOffset} r="4" fill="#020617" />
                                </g>
                            )}
                        </svg>

                        {/* 當前頻率顯示 */}
                        <div style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '2rem', fontWeight: '900', color: themeColor, fontFamily: 'monospace', textShadow: `0 0 20px ${themeColor}80` }}>
                            {frequency} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Hz</span>
                        </div>
                    </div>

                    {/* 控制面板：播放與模式 */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* 播放鈕 */}
                        <button
                            onClick={togglePlay}
                            disabled={isLoading}
                            style={{
                                flex: 1, padding: '1.2rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: isPlaying ? '#ef4444' : '#10b981',
                                color: '#fff',
                                boxShadow: isPlaying ? '0 0 30px rgba(239,68,68,0.4)' : '0 10px 30px rgba(16,185,129,0.3)'
                            }}
                        >
                            {isLoading ? '⏳ 載入音檔中...' : isPlaying ? '⏹️ 停止掃頻' : '▶️ 開始監聽'}
                        </button>

                        {/* 模式切換 */}
                        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '6px', flex: 1.5, border: '1px solid #1e293b' }}>
                            <button onClick={() => setEqMode('flat')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'flat' ? '#334155' : 'transparent', color: eqMode === 'flat' ? '#fff' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Bypass (原聲)</button>
                            <button onClick={() => setEqMode('boost')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'boost' ? 'rgba(16,185,129,0.2)' : 'transparent', color: eqMode === 'boost' ? '#10b981' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔼 放大特徵</button>
                            <button onClick={() => setEqMode('cut')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'cut' ? 'rgba(239,68,68,0.2)' : 'transparent', color: eqMode === 'cut' ? '#ef4444' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔽 挖空差異</button>
                        </div>
                    </div>

                    {/* 滑桿區 */}
                    <div style={{ background: '#020617', padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>
                        <p style={{ color: '#94a3b8', margin: '0 0 15px 0', fontSize: '0.9rem', textAlign: 'center' }}>左右拖曳滑桿，進行 Frequency Sweeping (頻率掃描)</p>
                        <input
                            type="range" min="0" max="1000" value={sliderValue}
                            onChange={e => setSliderValue(Number(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer', accentColor: themeColor }}
                        />
                    </div>

                    {/* 解說面板 (主委筆記) */}
                    <div style={{ minHeight: '220px' }}>
                        {currentZone && (
                            <div style={{ animation: 'fadeIn 0.4s ease', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px dashed #334155' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>{currentZone.name}</h3>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {currentZone.tags.map(tag => (
                                            <span key={tag} style={{ background: themeColor, color: eqMode === 'cut' ? '#fff' : '#020617', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ borderLeft: `4px solid ${themeColor}`, paddingLeft: '1.5rem' }}>
                                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                        {currentZone.theory}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. 底部導覽 (CTA) */}
                <section style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', gap: '20px' }}>
                    <button
                        onClick={() => router.push('/courses/mixing/gain-staging-training')}
                        style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '1rem 2rem', fontSize: '1rem', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                    >
                        ⬅️ 上一關：Gain 源頭管理
                    </button>

                    <button
                        onClick={() => router.push('/courses/mixing/compressor-training')}
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        下一關：Compressor 動態老爸 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}