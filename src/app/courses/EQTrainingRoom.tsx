"use client";
import React, { useState, useRef, useEffect } from 'react';

// 🎯 定義樂器庫與對應的檔案路徑
const TRACKS = {
    guitar: { id: 'guitar', name: '🎸 木吉他', file: '/guitar-loop.mp3' },
    kick: { id: 'kick', name: '🥁 大鼓', file: '/kick-loop.mp3' },
    vocal: { id: 'vocal', name: '🎤 主唱', file: '/vocal-dry.mp3' }
};

// 📚 定義多樂器頻率字典 (旗艦百科版)
const DICTIONARIES = {
    guitar: [
        { range: [20, 75], name: '50Hz：極低頻 (Sub Bass)', tags: ['地板震動 📳', '無謂能量 🗑️'], theory: '【製作人筆記：拿掉它就對了】\n對木吉他來說，這裡通常是冷氣或環境震動。建議用 High-pass Filter 切掉，把空間讓給大鼓和貝斯。' },
        { range: [76, 150], name: '100Hz：琴身低頻 (Boom)', tags: ['溫暖 ☕️', '轟轟聲 💣'], theory: '【製作人筆記：溫暖還是轟炸？】\n琴身共鳴基音。保留會讓吉他很溫暖；但編制大時，這裡是第一個要被 Cut 的地方。' },
        { range: [151, 280], name: '200Hz：厚度與泥濘 (Warmth)', tags: ['厚實 🧱', '鼻音 👃'], theory: '【製作人筆記：肉感的來源】\n給予吉他「肉感」。如果太單薄可稍加；但環境不好時，這裡最容易積聚糊糊髒髒的聲音。' },
        { range: [281, 560], name: '400Hz：紙箱悶音區 (Boxiness)', tags: ['紙箱味 📦', '悶悶的 🕳️'], theory: '【製作人筆記：傳說中的紙箱聲】\n適度挖空 (Cut) 這裡，是讓木吉他獲得現代流行樂「透明感」的魔法秘訣。' },
        { range: [561, 1100], name: '800Hz：廉價感與硬度', tags: ['便宜喇叭 📻', '塑膠味 🪣'], theory: '【製作人筆記：木頭變塑膠】\n太多會聽起來像便宜玩具。稍微 Cut 掉能有效提升音色的「高級感」。' },
        { range: [1101, 2200], name: '1.5kHz：鼻音與攻擊性', tags: ['電話聲 ☎️', '攻擊性 🤺'], theory: '【製作人筆記：刷扣的衝擊力】\n用力刷扣的衝擊力就在這。太刺耳就挖掉一點；快被淹沒了就推高讓它跳出來。' },
        { range: [2201, 4500], name: '3kHz：穿透力與刺耳', tags: ['刺耳 🔪', '穿透力 💎'], theory: '【製作人筆記：人類最敏感區域】\n耳朵對這極度敏感！推太多聽眾很快就會疲勞，需要小心處理。' },
        { range: [4501, 9000], name: '6kHz：清脆撥弦區', tags: ['清脆 ✨', '金屬弦 🎸'], theory: '【製作人筆記：決定的亮點】\n這是鋼弦摩擦與 Pick 彈撥的聲音。想要清脆明亮的吉他，稍微 Boost 這裡！' },
        { range: [9001, 20000], name: '12kHz：空氣感 (Air)', tags: ['空氣感 🌬️', '昂貴感 💎'], theory: '【製作人筆記：百萬錄音室秘密】\n提升這裡會讓聲音充滿呼吸感與細節，賦予吉他一種「昂貴」的質感。' }
    ],
    kick: [
        { range: [20, 60], name: '50Hz：超低頻下潛', tags: ['褲管震動 👖', '深沉 🌊'], theory: '【製作人筆記：舞池的靈魂】\n讓地板震動的頻率！EDM 必備；但流行搖滾推太多會變混濁且吃掉動態。' },
        { range: [61, 150], name: '100Hz：衝擊力 (Punch)', tags: ['拳拳到肉 🥊', '胸腔震擊 🫁'], theory: '【製作人筆記：胸口碎大石】\n力量來源。Boost 會讓大鼓結實有力；注意不要跟貝斯 (Bass) 打架。' },
        { range: [151, 350], name: '250Hz：混濁泥濘區 (Mud)', tags: ['糊糊的 💩', '轟鳴 🌪️'], theory: '【製作人筆記：大鼓清道夫】\n大鼓最容易聽起來「髒」的地方。專業混音師常做 Cut，讓貝斯有呼吸空間。' },
        { range: [351, 800], name: '500Hz：紙盒敲擊 (Cardboard)', tags: ['敲紙盒 📦', '塑膠桶 🪣'], theory: '【製作人筆記：傳說中紙箱味】\n大膽挖空這裡吧，你會得到經典「微笑 EQ」大鼓聲，不再像在拍塑膠桶。' },
        { range: [801, 2500], name: '1.5kHz：籃球拍打聲', tags: ['拍皮球 🏀', '木頭敲擊 🪵'], theory: '【製作人筆記：尷尬中頻】\n通常沒什麼好處。大部分情況會避開這裡，把頻段讓給人聲與吉他。' },
        { range: [2501, 6000], name: '4kHz：鼓槌撞擊 (Click)', tags: ['噠噠聲 🥢', '穿透力 ⚡️'], theory: '【製作人筆記：穿透混音關鍵】\n鼓槌撞擊鼓皮瞬間。金屬或現代搖滾 Boost 這裡能讓大鼓「穿透」厚重吉他牆。' },
        { range: [6001, 20000], name: '8kHz：銅鈸串音 (Bleed)', tags: ['嘶嘶聲 🐍', '串音 🎧'], theory: '【製作人筆記：小心漏音】\n大鼓本身在這幾乎沒聲。Boost 通常只會放大背景銅鈸聲，有時建議直接切掉。' }
    ],
    vocal: [
        { range: [20, 80], name: '50Hz：噴麥噪音 (Plosives)', tags: ['蹦蹦聲 💥', '震動 🎤'], theory: '【製作人筆記：低頻殺手】\n人聲不會到這麼低！通常是發「P、B」子音時的噴麥聲。毫不猶豫地切掉它吧！' },
        { range: [81, 150], name: '120Hz：胸腔共鳴 (Chest)', tags: ['胸腔 🫁', '溫暖 ☕️'], theory: '【製作人筆記：男聲底氣】\n男聲磁性的來源。對女聲來說這裡偏低，太多反而會顯得沉重。' },
        { range: [151, 300], name: '250Hz：鼻音與泥濘 (Mud)', tags: ['鼻音 👃', '糊糊的 🌧️'], theory: '【製作人筆記：溫暖 vs 混濁】\n男聲易產生感冒鼻音需 Cut；但對偏尖的女聲，保留這裡能增加溫暖度。' },
        { range: [301, 800], name: '500Hz：廉價麥克風味', tags: ['電話聲 ☎️', '紙筒聲 🧻'], theory: '【製作人筆記：塑膠感】\n太多會像用便宜麥克風在唱歌。稍微挖空能讓人聲立刻變得自然、昂貴。' },
        { range: [801, 2000], name: '1.5kHz：咬字清晰度', tags: ['捏鼻子 🤏', '清晰 📢'], theory: '【製作人筆記：存在感】\n掌管咬字清晰。密集的配器中 Boost 能殺出重圍；但在抒情歌中太多會很刺。' },
        { range: [2001, 5000], name: '3.5kHz：穿透與貼近', tags: ['貼近感 💋', '穿透 💎'], theory: '【製作人筆記：警報區】\n適當提升會有貼在耳邊唱的親密感；但也是最容易讓聽眾耳朵痛的區域。' },
        { range: [5001, 9000], name: '7kHz：唇齒音 (Sibilance)', tags: ['嘶嘶聲 🐍', '氣音 💨'], theory: '【製作人筆記：齒音戰場】\n「斯、疵」等摩擦音。太多會極度不適（尤其戴耳機），需用 De-esser 壓制。' },
        { range: [9001, 20000], name: '12kHz：空氣感與光澤', tags: ['空氣感 🌬️', '光澤 🌟'], theory: '【製作人筆記：財富密碼】\n想讓女聲有「天使光環」？推高這裡吧！它能賦予人聲高貴的呼吸感與細節。' }
    ]
};

export default function EQDictionaryRoom() {
    const [activeTrack, setActiveTrack] = useState<'guitar' | 'kick' | 'vocal'>('guitar');
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

    const loadAudio = async (trackId: 'guitar' | 'kick' | 'vocal') => {
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
            console.error("載入失敗", e);
        }
        setIsLoading(false);
    };

    useEffect(() => { loadAudio(activeTrack); }, [activeTrack]);

    useEffect(() => {
        if (!filterRef.current) return;
        filterRef.current.frequency.value = frequency;
        if (eqMode === 'boost') {
            filterRef.current.gain.setTargetAtTime(15, audioCtxRef.current!.currentTime, 0.1);
            filterRef.current.Q.value = 6.0;
        } else if (eqMode === 'cut') {
            filterRef.current.gain.setTargetAtTime(-12, audioCtxRef.current!.currentTime, 0.1);
            filterRef.current.Q.value = 3.0;
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
            filterRef.current.type = 'peaking';
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
    const gainOffset = eqMode === 'boost' ? -110 : (eqMode === 'cut' ? 60 : 0);
    const qWidth = eqMode === 'cut' ? 100 : 50;
    const eqPath = eqMode === 'flat' ? `M 0,150 L 1000,150` : `M 0,150 L ${peakX - qWidth},150 C ${peakX - qWidth / 2},150 ${peakX - 10},${150 + gainOffset} ${peakX},${150 + gainOffset} C ${peakX + 10},${150 + gainOffset} ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', background: '#020617', borderRadius: '24px', color: '#fff', border: '1px solid #1e293b' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{ color: '#fca311', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>FREQUENCY DICTIONARY</span>
                <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>個人聽覺字典</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>切換樂器，點擊「放大特徵」或「挖空差異」來建立你的頻率記憶。</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {Object.values(TRACKS).map(track => (
                    <button key={track.id} onClick={() => setActiveTrack(track.id as any)} style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTrack === track.id ? '#38bdf8' : '#1e293b', color: activeTrack === track.id ? '#020617' : '#94a3b8', border: `1px solid ${activeTrack === track.id ? '#38bdf8' : '#334155'}` }}>{track.name}</button>
                ))}
            </div>

            <div style={{ width: '100%', height: '250px', background: '#0f172a', borderRadius: '16px', border: '1px solid #334155', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {[100, 500, 1000, 5000, 10000].map(f => (
                        <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(56, 189, 248, 0.1)' }}>
                            <span style={{ position: 'absolute', bottom: '8px', left: '4px', color: '#475569', fontSize: '0.65rem' }}>{f >= 1000 ? `${f / 1000}k` : f}Hz</span>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', top: '150px', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.3)' }}></div>
                </div>
                <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%' }}>
                    <path d={eqPath} fill="none" stroke={eqMode === 'cut' ? '#ef4444' : '#38bdf8'} strokeWidth="4" />
                    {eqMode !== 'flat' && <circle cx={peakX} cy={150 + gainOffset} r="8" fill="#fff" />}
                </svg>
                <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>{frequency} Hz</div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={togglePlay} disabled={isLoading} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: isPlaying ? '#1e293b' : '#10b981', color: '#fff', fontWeight: '900', border: 'none', cursor: 'pointer' }}>{isLoading ? '載入中...' : isPlaying ? '⏹️ 停止' : '▶️ 播放'}</button>
                <div style={{ display: 'flex', background: '#1e293b', borderRadius: '12px', padding: '0.2rem' }}>
                    <button onClick={() => setEqMode('flat')} style={{ padding: '0.8rem 1rem', border: 'none', background: eqMode === 'flat' ? '#334155' : 'transparent', color: eqMode === 'flat' ? '#fff' : '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>Bypass</button>
                    <button onClick={() => setEqMode('boost')} style={{ padding: '0.8rem 1rem', border: 'none', background: eqMode === 'boost' ? '#38bdf8' : 'transparent', color: eqMode === 'boost' ? '#020617' : '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>🔼 放大特徵</button>
                    <button onClick={() => setEqMode('cut')} style={{ padding: '0.8rem 1rem', border: 'none', background: eqMode === 'cut' ? '#ef4444' : 'transparent', color: eqMode === 'cut' ? '#fff' : '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>🔽 挖空差異</button>
                </div>
            </div>

            <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #1e293b' }}>
                <input type="range" min="0" max="1000" value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#fca311' }} />
            </div>

            <div style={{ minHeight: '200px' }}>
                {currentZone && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>{currentZone.name}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {currentZone.tags.map(tag => (<span key={tag} style={{ background: '#1e293b', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem' }}>{tag}</span>))}
                        </div>
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8', padding: '1.2rem', borderRadius: '0 12px 12px 0' }}>
                            <p style={{ margin: 0, color: '#f8fafc', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{currentZone.theory}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}