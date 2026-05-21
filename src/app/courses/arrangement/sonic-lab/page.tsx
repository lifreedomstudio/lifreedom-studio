"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 定義樂器配置與檔案路徑
const INSTRUMENTS = [
    { id: 'vocal', name: '🎤 主唱 (Vocal)', color: '#fff', file: '/audio/vocal.mp3' },
    { id: 'drum', name: '🥁 鼓組 (Drums)', color: '#ef4444', file: '/audio/drum.mp3' },
    { id: 'bass', name: '🎸 貝斯 (Bass)', color: '#3b82f6', file: '/audio/bass.mp3' },
    { id: 'rhythm', name: '🎸 節奏吉他 (Rhythm)', color: '#10b981', file: '/audio/rhythm.mp3' },
    { id: 'lead', name: '🎹 旋律吉他 (Lead)', color: '#a78bfa', file: '/audio/lead.mp3' }
];

const PRESETS = {
    mono: {
        name: '📻 實驗：單聲道 (Mono)',
        desc: '【聽覺災難示範】所有樂器全部擠在正中間！頻率嚴重互撞，聲音聽起來糊成一團，毫無層次感。這就是為什麼你需要學會分配舞台空間。',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: 0, lead: 0 }
    },
    jrock: {
        name: '🔥 實戰：日系搖滾 (J-Rock)',
        desc: '【極致寬廣舞台】雙吉他採用 LCR 擺位法，分別硬分到最左（L100）與最右（R100）。兩側飽和音色全開，將正中間的精華領域完全留給主唱與貝斯！',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 }
    },
    pop: {
        name: '🎧 實戰：現代流行 (Modern Pop)',
        desc: '【溫暖緊密包覆】雙吉他稍微往中間靠攏（L40 / R40），樂器之間產生更凝聚的融合感，雖然犧牲了極兩側的寬廣度，但整體聽感非常溫柔平衡。',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: -40, lead: 40 }
    }
};

type PanState = Record<string, number>;

export default function SonicLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 守門員驗票
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [panVals, setPanVals] = useState<PanState>(PRESETS.mono.pan);
    const [activePreset, setActivePreset] = useState<string>('mono');
    const [infoText, setInfoText] = useState(PRESETS.mono.desc);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const pannersRef = useRef<Record<string, StereoPannerNode>>({});
    const masterGainRef = useRef<GainNode | null>(null);
    const buffersRef = useRef<Record<string, AudioBuffer>>({});
    const sourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});

    const initAudio = async () => {
        setIsLoading(true);
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        const loadPromises = INSTRUMENTS.map(async (inst) => {
            try {
                const response = await fetch(inst.file);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                buffersRef.current[inst.id] = audioBuffer;

                const panner = ctx.createStereoPanner();
                panner.pan.value = (PRESETS.mono.pan as PanState)[inst.id] / 100;
                pannersRef.current[inst.id] = panner;
                panner.connect(masterGain);
            } catch (error) {
                console.error(`無法載入音軌 ${inst.name}:`, error);
            }
        });

        await Promise.all(loadPromises);
        setIsAudioReady(true);
        setIsLoading(false);
        return ctx;
    };

    const playTracks = (ctx: AudioContext) => {
        INSTRUMENTS.forEach(inst => {
            if (!buffersRef.current[inst.id]) return;
            const source = ctx.createBufferSource();
            source.buffer = buffersRef.current[inst.id];
            source.loop = true;
            source.connect(pannersRef.current[inst.id]);
            sourcesRef.current[inst.id] = source;
            source.start(ctx.currentTime + 0.05);
        });
    };

    const stopTracks = () => {
        Object.values(sourcesRef.current).forEach(source => {
            try { source.stop(); source.disconnect(); } catch (e) { }
        });
        sourcesRef.current = {};
    };

    const togglePlay = async () => {
        if (!isAudioReady || !audioCtxRef.current) {
            const ctx = await initAudio();
            playTracks(ctx);
            setIsPlaying(true);
            return;
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') await ctx.resume();

        if (isPlaying) {
            stopTracks();
        } else {
            playTracks(ctx);
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (!isAudioReady || !audioCtxRef.current) return;
        Object.entries(panVals).forEach(([id, val]) => {
            if (pannersRef.current[id]) {
                pannersRef.current[id].pan.setTargetAtTime(val / 100, audioCtxRef.current!.currentTime, 0.1);
            }
        });
    }, [panVals, isAudioReady]);

    const applyPreset = (key: string) => {
        setPanVals(PRESETS[key as keyof typeof PRESETS].pan);
        setActivePreset(key);
        setInfoText(PRESETS[key as keyof typeof PRESETS].desc);
    };

    const handlePanChange = (id: string, val: number) => {
        setPanVals(prev => ({ ...prev, [id]: val }));
        setActivePreset('custom');
        setInfoText('🔧 正在自訂聲場舞台... 戴上耳機，親耳感受聲音在左右耳之間的物理移動。');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* 返回按鈕 */}
                <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    ⬅️ 返回總部地圖
                </button>

                {/* 1. 標題區 */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>STAGE 01 : SONIC ARCHITECTURE</span>
                    <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', margin: '0.5rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        立體聲場構築實驗室
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        這是基礎編曲與混音的交界點。學會像建築師一樣搭建樂團舞台。<br />
                        <b style={{ color: '#fca311' }}>請務必戴上耳機體驗 🎧</b>
                    </p>
                </div>

                {/* 2. 播放主控台 */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        style={{
                            padding: '1.2rem 3.5rem', fontSize: '1.3rem', fontWeight: '900', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer',
                            background: isLoading ? '#475569' : isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none',
                            boxShadow: `0 10px 30px ${isPlaying ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            transition: 'all 0.3s'
                        }}
                    >
                        {isLoading ? '⏳ 正在拼命解碼音軌...' : isPlaying ? '⏹️ 停止聲音實驗' : '▶️ 啟動聲場實驗室'}
                    </button>
                    {!isAudioReady && !isLoading && <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '12px' }}>點擊將同時載入五條高清樂器分軌，請稍候</p>}
                </div>

                {/* 3. 聲學知識提示框 */}
                <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>💡</span>
                        <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '1rem', letterSpacing: '1px' }}>大師聲學導引</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.7' }}>{infoText}</p>
                </div>

                {/* 4. 曲風預設切換區 */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {Object.entries(PRESETS).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            style={{
                                padding: '12px 28px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s', fontSize: '0.95rem',
                                background: activePreset === key ? '#fca311' : '#1e293b',
                                color: activePreset === key ? '#020617' : '#94a3b8',
                                border: `1px solid ${activePreset === key ? '#fca311' : '#334155'}`,
                                boxShadow: activePreset === key ? '0 0 20px rgba(252, 163, 17, 0.4)' : 'none'
                            }}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                {/* 5. 3D 聲場視覺化舞台 */}
                <div style={{ background: '#0f172a', padding: '2rem 1.5rem', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '3rem', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '4px' }}>
                        <span>LEFT (左耳)</span>
                        <span>CENTER (正中央)</span>
                        <span>RIGHT (右耳)</span>
                    </div>

                    <div style={{ height: '200px', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)', borderRadius: '16px', position: 'relative', border: '1px dashed rgba(56, 189, 248, 0.15)', overflow: 'hidden' }}>
                        {/* 中央分割線 */}
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                        {INSTRUMENTS.map((inst, idx) => {
                            const panValue = panVals[inst.id];
                            const leftPos = `${((panValue + 100) / 200) * 100}%`;

                            return (
                                <div key={inst.id} style={{
                                    position: 'absolute', top: `${15 + idx * 16}%`, left: leftPos,
                                    transform: 'translateX(-50%)', width: '42px', height: '42px',
                                    background: '#020617', borderRadius: '50%',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    boxShadow: `0 0 20px ${inst.color}40`,
                                    transition: 'left 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                                    zIndex: 10, border: `3px solid ${inst.color}`
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{inst.name.split(' ')[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. 樂器實時控制推軌 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                    {INSTRUMENTS.map(inst => (
                        <div key={inst.id} style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid #1e293b' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: inst.color, fontSize: '0.95rem', marginBottom: '0.75rem' }}>{inst.name}</div>
                                <input
                                    type="range"
                                    min="-100" max="100"
                                    value={panVals[inst.id]}
                                    disabled={!isAudioReady}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePanChange(inst.id, parseInt(e.target.value))}
                                    style={{ width: '100%', cursor: isAudioReady ? 'pointer' : 'not-allowed', accentColor: inst.color }}
                                />
                            </div>
                            <div style={{ width: '55px', textAlign: 'right', color: '#fbbf24', fontVariantNumeric: 'tabular-nums', fontWeight: '900', fontSize: '1.1rem', textShadow: '0 0 8px rgba(251,191,36,0.2)' }}>
                                {panVals[inst.id] === 0 ? 'C' : panVals[inst.id] < 0 ? `L${Math.abs(panVals[inst.id])}` : `R${panVals[inst.id]}`}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}