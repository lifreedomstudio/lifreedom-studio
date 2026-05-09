"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// 定義樂器配置與檔案路徑
const INSTRUMENTS = [
    { id: 'vocal', name: '🎤 主唱 (Vocal)', color: '#fff', file: '/audio/vocal.mp3' },
    { id: 'kick', name: '🥁 鼓組 (Drums)', color: '#ef4444', file: '/audio/kick.mp3' },
    { id: 'bass', name: '🎸 貝斯 (Bass)', color: '#3b82f6', file: '/audio/bass.mp3' },
    { id: 'rhythm', name: '🎸 節奏吉他 (Rhythm)', color: '#10b981', file: '/audio/rhythm.mp3' },
    { id: 'lead', name: '🎹 旋律吉他 (Lead)', color: '#a78bfa', file: '/audio/lead.mp3' }
];

const PRESETS = {
    mono: {
        name: '📻 實驗單聲道',
        desc: '這就是為什麼你的混音會「糊」！所有樂器擠在正中間，頻率完全打架，親耳聽聽看它們有多擠吧。',
        pan: { vocal: 0, kick: 0, bass: 0, rhythm: 0, lead: 0 }
    },
    jrock: {
        name: '🔥 日系搖滾 (J-Rock)',
        desc: '聽見那個爽感了嗎？節奏與旋律吉他硬分左右 (LCR)，把它們不被閹割的飽滿音色推到兩側，中間完全讓給主唱與節奏組！',
        pan: { vocal: 0, kick: 0, bass: 0, rhythm: -100, lead: 100 }
    },
    pop: {
        name: '🎧 現代流行 (Modern Pop)',
        desc: '安全集中。吉他稍微往中間靠攏，創造溫暖緊密的包覆感，但犧牲了兩側的極致寬廣度。',
        pan: { vocal: 0, kick: 0, bass: 0, rhythm: -40, lead: 40 }
    }
};

type PanState = Record<string, number>;

export default function IncubatorPage() {
    const router = useRouter();

    // 👇 佈署守門員：頁面一載入就檢查有沒有入場券
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login'); // 沒票就踢去登入頁面
            }
        };
        checkUser();
    }, [router]);
    const [panVals, setPanVals] = useState<PanState>(PRESETS.mono.pan);
    const [activePreset, setActivePreset] = useState<string>('mono');
    const [infoText, setInfoText] = useState(PRESETS.mono.desc);

    // Web Audio API 狀態
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioReady, setIsAudioReady] = useState(false);

    // 儲存音訊節點的 References
    const audioCtxRef = useRef<AudioContext | null>(null);
    const pannersRef = useRef<Record<string, StereoPannerNode>>({});
    const audiosRef = useRef<Record<string, HTMLAudioElement>>({});
    const masterGainRef = useRef<GainNode | null>(null); // 新增：總音量控制器

    // 初始化音訊 (必須由使用者點擊按鈕觸發)
    const initAudio = () => {
        if (audioCtxRef.current) return; // 避免重複初始化

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // 🌟 建立總音量控制器 (Master Bus)，解決 Pan Law 帶來的破音問題
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.6; // 降音量拉出 Headroom
        masterGain.connect(ctx.destination); // 總控連向喇叭
        masterGainRef.current = masterGain;

        INSTRUMENTS.forEach(inst => {
            const audio = new Audio(inst.file);
            audio.loop = true; // 讓精華片段無限循環
            audiosRef.current[inst.id] = audio;

            const source = ctx.createMediaElementSource(audio);
            const panner = ctx.createStereoPanner();

            // 設定初始 Pan 值 (包含 TypeScript 型別修復)
            panner.pan.value = (PRESETS.mono.pan as PanState)[inst.id] / 100;
            pannersRef.current[inst.id] = panner;

            // 路由：音檔 -> Panner -> Master Gain (不再直通喇叭)
            source.connect(panner);
            panner.connect(masterGain);
        });

        setIsAudioReady(true);
    };

    // 播放/暫停控制
    const togglePlay = () => {
        if (!isAudioReady) initAudio();

        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (isPlaying) {
            Object.values(audiosRef.current).forEach(audio => audio.pause());
            ctx.suspend();
        } else {
            ctx.resume();
            Object.values(audiosRef.current).forEach(audio => audio.play());
        }
        setIsPlaying(!isPlaying);
    };

    // 當 UI 滑桿改變時，即時更新 Web Audio 的 Panner
    useEffect(() => {
        if (!isAudioReady) return;
        Object.entries(panVals).forEach(([id, val]) => {
            if (pannersRef.current[id]) {
                // Web Audio API 的 pan 值範圍是 -1.0 到 1.0
                // 加上一點平滑過渡，避免聲音突然跳動產生爆音
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
        setInfoText('🔧 自訂擺位中... 戴上耳機，聽聽看聲音是如何在你的腦海中移動的。');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>SONIC ARCHITECTURE LAB</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0.5rem 0' }}>立體聲場構築實驗室</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>親自解剖神級製作人的空間魔術。請務必戴上耳機體驗 🎧</p>
            </div>

            {/* 🎵 總控台：播放按鈕 */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        padding: '1rem 3rem', fontSize: '1.5rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                        background: isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none',
                        boxShadow: `0 0 30px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                        transition: 'all 0.3s'
                    }}
                >
                    {isPlaying ? '⏸️ 暫停實驗' : '▶️ 開始試聽混音'}
                </button>
                {!isAudioReady && <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px' }}>點擊開始後將載入音軌，請確保網路順暢</p>}
            </div>

            {/* 💡 知識提示框 */}
            <div style={{ background: '#0f172a', borderLeft: '4px solid #fca311', padding: '1.5rem', borderRadius: '4px 16px 16px 4px', marginBottom: '2rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#fed7aa', lineHeight: '1.6' }}>{infoText}</p>
            </div>

            {/* 🎛️ 曲風預設按鈕區 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        style={{
                            padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s',
                            background: activePreset === key ? '#fca311' : '#1e293b',
                            color: activePreset === key ? '#000' : '#e2e8f0',
                            border: `1px solid ${activePreset === key ? '#fca311' : '#334155'}`,
                            boxShadow: activePreset === key ? '0 0 20px rgba(252, 163, 17, 0.3)' : 'none'
                        }}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            {/* 🏟️ 立體聲場視覺化舞台 */}
            <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                    <span>LEFT</span>
                    <span>CENTER</span>
                    <span>RIGHT</span>
                </div>

                <div style={{ height: '180px', background: 'radial-gradient(circle at 50% 50%, rgba(30,41,59,1) 0%, rgba(2,6,23,1) 100%)', borderRadius: '12px', position: 'relative', border: '1px dashed rgba(56, 189, 248, 0.1)' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                    {INSTRUMENTS.map((inst, idx) => {
                        const panValue = panVals[inst.id];
                        const leftPos = `${((panValue + 100) / 200) * 100}%`;

                        return (
                            <div key={inst.id} style={{
                                position: 'absolute', top: `${20 + idx * 15}%`, left: leftPos,
                                transform: 'translateX(-50%)', width: '45px', height: '45px',
                                background: inst.color, borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                boxShadow: activePreset === 'jrock' && (inst.id === 'rhythm' || inst.id === 'lead') ? `0 0 25px ${inst.color}cc` : `0 0 15px ${inst.color}60`,
                                transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                zIndex: 10, border: '3px solid #fff', fontSize: '1.3rem'
                            }}>
                                {inst.name.split(' ')[0]}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 🎚️ 樂器滑桿控制區 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {INSTRUMENTS.map(inst => (
                    <div key={inst.id} style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #1e293b' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: inst.color, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{inst.name}</div>
                            <input
                                type="range"
                                min="-100" max="100"
                                value={panVals[inst.id]}
                                onChange={(e) => handlePanChange(inst.id, parseInt(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer', accentColor: inst.color }}
                            />
                        </div>
                        <div style={{ width: '45px', textAlign: 'right', color: '#fca311', fontVariantNumeric: 'tabular-nums', fontWeight: 'bold' }}>
                            {panVals[inst.id] === 0 ? 'C' : panVals[inst.id] < 0 ? `L${Math.abs(panVals[inst.id])}` : `R${panVals[inst.id]}`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}