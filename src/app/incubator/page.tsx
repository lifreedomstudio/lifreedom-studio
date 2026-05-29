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
        name: '📻 實驗單聲道',
        desc: '👉 先按播放，然後把『節奏吉他』與『旋律吉他』慢慢往左右拉，注意空間與主唱清晰度的變化。',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: 0, lead: 0 }
    },
    jrock: {
        name: '🔥 日系搖滾 (J-Rock)',
        desc: '聽見那個爽感了嗎？節奏與旋律吉他硬分左右 (LCR)，把它們不被閹割的飽滿音色推到兩側，中間完全讓給主唱與節奏組！',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 }
    },
    pop: {
        name: '🎧 現代流行 (Modern Pop)',
        desc: '安全集中。吉他稍微往中間靠攏，創造溫暖緊密的包覆感，但犧牲了兩側的極致寬廣度。',
        pan: { vocal: 0, drum: 0, bass: 0, rhythm: -40, lead: 40 }
    }
};

type PanState = Record<string, number>;

// 🚀 升級：驗證系統升級回傳 score 與「錯誤樂器清單 (errors)」
const LEVELS = [
    {
        id: "level-1",
        title: "Level 1：立體聲寬度 (Stereo Width)",
        instruction: "💡 任務：讓這個混音聽起來「更寬廣」。\n👉 不要看數值，請用耳朵判斷！找出是誰擠在中間，並把他們拉開。",
        evaluate: (panVals: PanState) => {
            let score = 0;
            const errors: string[] = [];

            if (panVals.rhythm <= -70) score += 50;
            else {
                if (panVals.rhythm <= -30) score += 25;
                errors.push('rhythm'); // 沒到位就標記錯誤
            }

            if (panVals.lead >= 70) score += 50;
            else {
                if (panVals.lead >= 30) score += 25;
                errors.push('lead'); // 沒到位就標記錯誤
            }
            return { score, errors };
        },
        unlockedSkill: "Stereo Width 感知",
        unlockDetails: [
            "✔ 具備拉開立體聲寬度的能力",
            "✔ 懂得為主唱騰出空間的判斷"
        ]
    },
    {
        id: "level-2",
        title: "Level 2：主唱清晰度 (Vocal Clarity)",
        instruction: "💡 任務：主唱現在被蓋住了！請保持主唱與節奏組 (Drum/Bass) 在正中央，並利用左右空間把干擾的樂器移開。",
        evaluate: (panVals: PanState) => {
            let score = 0;
            const errors: string[] = [];

            const checkCenter = (id: string) => {
                if (Math.abs(panVals[id]) <= 10) score += 13.33;
                else errors.push(id);
            };
            checkCenter('vocal');
            checkCenter('drum');
            checkCenter('bass');

            if (panVals.rhythm <= -50 || panVals.rhythm >= 50) score += 30;
            else errors.push('rhythm');

            if (panVals.lead <= -50 || panVals.lead >= 50) score += 30;
            else errors.push('lead');

            return { score: Math.min(Math.round(score), 100), errors };
        },
        unlockedSkill: "Vocal 頻段保護",
        unlockDetails: [
            "✔ 掌握核心樂器置中原則 (LCR)",
            "✔ 解除頻率遮蔽 (Masking) 技巧"
        ]
    }
];

export default function IncubatorPage() {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
        };
        checkUser();
    }, [router]);

    const [panVals, setPanVals] = useState<PanState>(PRESETS.mono.pan);
    const [activePreset, setActivePreset] = useState<string>('mono');
    const [infoText, setInfoText] = useState(PRESETS.mono.desc);

    const [mode, setMode] = useState<'free' | 'challenge'>('free');
    const [challengeStatus, setChallengeStatus] = useState<"pending" | "success" | "partial" | "fail">("pending");
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);

    const [combo, setCombo] = useState(0);
    const [errorInsts, setErrorInsts] = useState<string[]>([]);

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
        masterGain.gain.value = 0.6;
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

    // ✅ 新增：在元件卸載（離開頁面）時，強制拔掉虛擬混音機的電源
    useEffect(() => {
        return () => {
            stopTracks(); // 停止所有音軌
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close(); // 徹底釋放音訊引擎的記憶體
            }
        };
    }, []);

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
        if (mode === 'challenge') return;
        setPanVals(PRESETS[key as keyof typeof PRESETS].pan);
        setActivePreset(key);
        setInfoText(PRESETS[key as keyof typeof PRESETS].desc);
    };

    const handlePanChange = (id: string, val: number) => {
        const newVals = { ...panVals, [id]: val };
        setPanVals(newVals);
        setActivePreset('custom');

        if (mode === 'challenge') {
            setChallengeStatus('pending');
            setErrorInsts([]);
        }

        if (mode === 'free') {
            if (newVals.rhythm <= -70 && newVals.lead >= 70 && Math.abs(newVals.vocal) < 20) {
                setInfoText("🔥 厲害！你已經接近專業的 LCR (左-中-右) 擺位了！這是讓混音瞬間變寬的秘密。");
            } else if (Math.abs(newVals.rhythm) < 30 && Math.abs(newVals.lead) < 30) {
                setInfoText("🤔 所有的樂器好像都擠在中間了？聽聽看主唱是不是變得有點模糊。");
            } else {
                setInfoText('🔧 自訂擺位中... 戴上耳機，聽聽看聲音是如何在你的腦海中移動的。');
            }
        }
    };

    const checkPanChallenge = () => {
        const currentLevel = LEVELS[currentLevelIdx];
        const { score, errors } = currentLevel.evaluate(panVals);
        setCurrentScore(score);
        setErrorInsts(errors);

        if (score === 100) {
            setChallengeStatus("success");
            setCombo(prev => prev + 1);
        } else if (score >= 50) {
            setChallengeStatus("partial");
            setCombo(0);
        } else {
            setChallengeStatus("fail");
            setCombo(0);
        }
    };

    const getHint = (score: number) => {
        if (score < 30) return "👉 還是太集中了，有東西緊緊擠在中間。";
        if (score < 60) return "👉 方向對了！試著把你覺得有干擾的樂器拉到更兩側。";
        return "👉 已經很接近了，再大膽極端一點點！";
    };

    const enterChallengeMode = () => {
        setMode('challenge');
        setChallengeStatus('pending');
        setCombo(0);
        setErrorInsts([]);
        setPanVals(PRESETS.mono.pan);
        setActivePreset('mono');
    };

    const exitChallengeMode = () => {
        setMode('free');
        setChallengeStatus('pending');
        setCombo(0);
        setErrorInsts([]);
        setInfoText(PRESETS.mono.desc);
        setCurrentLevelIdx(0);
    };

    const currentLevel = LEVELS[currentLevelIdx];

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>SONIC ARCHITECTURE LAB</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0.5rem 0', color: '#fff' }}>立體聲場構築實驗室</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>親自解剖神級製作人的空間魔術。請務必戴上耳機體驗 🎧</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <button
                    onClick={exitChallengeMode}
                    style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #334155', background: mode === 'free' ? '#38bdf8' : '#1e293b', color: mode === 'free' ? '#000' : '#94a3b8', transition: '0.2s' }}
                >
                    🎛️ 自由探索模式
                </button>
                <button
                    onClick={enterChallengeMode}
                    style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #4f46e5', background: mode === 'challenge' ? '#4f46e5' : '#1e293b', color: '#fff', boxShadow: mode === 'challenge' ? '0 0 15px rgba(79, 70, 229, 0.4)' : 'none', transition: '0.2s' }}
                >
                    🎯 耳力挑戰模式
                </button>
            </div>

            {mode === 'challenge' && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#111827', borderRadius: '16px', border: '1px solid #4f46e5', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h3 style={{ margin: 0, color: '#818cf8', fontSize: '1.2rem' }}>🏆 {currentLevel.title}</h3>
                            {combo > 0 && (
                                <span style={{ color: '#fca311', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                                    🔥 連續成功：{combo} 次
                                </span>
                            )}
                        </div>
                        <span style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
                            關卡 {currentLevelIdx + 1} / {LEVELS.length}
                        </span>
                    </div>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#e2e8f0', lineHeight: '1.6', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                        {currentLevel.instruction}
                    </p>

                    {challengeStatus === 'pending' && (
                        <button
                            onClick={checkPanChallenge}
                            style={{ padding: '0.8rem 2rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', transition: '0.2s' }}
                            onMouseOver={e => e.currentTarget.style.background = '#4338ca'}
                            onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}
                        >
                            👂 聽好了，送出驗證
                        </button>
                    )}

                    {challengeStatus === 'partial' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '8px', color: '#fcd34d', fontWeight: 'bold', marginBottom: '1rem' }}>
                                👍 接近了！(得分: {currentScore}/100) <br />
                                <span style={{ fontSize: '0.9rem', color: '#fde68a', fontWeight: 'normal' }}>有抓到感覺，但還可以調得更好。</span>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                                💡 教練提示：{getHint(currentScore)} <span style={{ color: '#ef4444' }}>(發出紅光的樂器位置還不對喔)</span>
                            </p>
                        </div>
                    )}

                    {challengeStatus === 'fail' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontWeight: 'bold', marginBottom: '1rem' }}>
                                ❌ 再試試看！(得分: {currentScore}/100) <br />
                                <span style={{ fontSize: '0.9rem', color: '#fecaca', fontWeight: 'normal' }}>想想看，是誰擋住了空間？大膽用耳朵找出來！</span>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                                💡 教練提示：{getHint(currentScore)} <span style={{ color: '#ef4444' }}>(發出紅光的樂器位置還不對喔)</span>
                            </p>
                        </div>
                    )}

                    {challengeStatus === 'success' && (
                        <div style={{ animation: 'fadeIn 0.4s' }}>
                            <div style={{ padding: '1.5rem', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(6, 95, 70, 0.3))', border: '1px solid #10b981', borderRadius: '12px' }}>
                                <div style={{ color: '#6ee7b7', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                                    🔥 完美通關！(得分: 100/100)
                                </div>

                                <div style={{ background: 'rgba(2, 44, 34, 0.6)', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid #34d399' }}>
                                    <h4 style={{ margin: '0 0 0.8rem 0', color: '#10b981', fontSize: '1.1rem' }}>🧠 能力解鎖：{currentLevel.unlockedSkill}</h4>
                                    <div style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: '1.8' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>現在你已經具備：</p>
                                        {currentLevel.unlockDetails.map((detail, i) => (
                                            <div key={i}>{detail}</div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {currentLevelIdx < LEVELS.length - 1 ? (
                                        <button
                                            onClick={() => {
                                                setCurrentLevelIdx(prev => prev + 1);
                                                setChallengeStatus('pending');
                                                setErrorInsts([]);
                                                setPanVals(PRESETS.mono.pan);
                                            }}
                                            style={{ padding: '0.8rem 1.5rem', background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                                        >
                                            👉 趁勝追擊！解鎖下一關
                                        </button>
                                    ) : (
                                        <button
                                            onClick={exitChallengeMode}
                                            style={{ padding: '0.8rem 1.5rem', background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                                        >
                                            🏆 你已通關所有實驗！回到自由模式
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    style={{
                        padding: '1rem 3rem', fontSize: '1.5rem', fontWeight: '900', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer',
                        background: isLoading ? '#475569' : isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none',
                        boxShadow: `0 0 30px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                        transition: 'all 0.3s'
                    }}
                >
                    {isLoading ? '⏳ 音軌載入解碼中...' : isPlaying ? '⏸️ 暫停實驗' : '▶️ 開始試聽混音'}
                </button>
                {!isAudioReady && !isLoading && <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px' }}>點擊開始後將載入音軌，請確保網路順暢</p>}
            </div>

            {mode === 'free' && (
                <div style={{ background: '#0f172a', borderLeft: '4px solid #fca311', padding: '1.5rem', borderRadius: '4px 16px 16px 4px', marginBottom: '2rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#fed7aa', lineHeight: '1.6' }}>{infoText}</p>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        disabled={mode === 'challenge'}
                        style={{
                            padding: '12px 24px', borderRadius: '50px', fontWeight: 'bold', transition: 'all 0.3s',
                            background: activePreset === key ? '#fca311' : '#1e293b',
                            color: activePreset === key ? '#000' : '#e2e8f0',
                            border: `1px solid ${activePreset === key ? '#fca311' : '#334155'}`,
                            boxShadow: activePreset === key ? '0 0 20px rgba(252, 163, 17, 0.3)' : 'none',
                            opacity: mode === 'challenge' ? 0.4 : 1,
                            cursor: mode === 'challenge' ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

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
                        const isError = errorInsts.includes(inst.id);

                        const glowEffect = isError
                            ? `0 0 25px rgba(239, 68, 68, 0.9)`
                            : activePreset === 'jrock' && (inst.id === 'rhythm' || inst.id === 'lead')
                                ? `0 0 25px ${inst.color}cc`
                                : `0 0 15px ${inst.color}60`;

                        return (
                            <div key={inst.id} style={{
                                position: 'absolute', top: `${20 + idx * 15}%`, left: leftPos,
                                transform: 'translateX(-50%)', width: '45px', height: '45px',
                                background: inst.color, borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                boxShadow: glowEffect,
                                transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
                                zIndex: isError ? 20 : 10, border: `3px solid ${isError ? '#ef4444' : '#fff'}`, fontSize: '1.3rem'
                            }}>
                                {inst.name.split(' ')[0]}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {INSTRUMENTS.map(inst => {
                    const isError = errorInsts.includes(inst.id);
                    return (
                        <div key={inst.id} style={{
                            background: '#0f172a', padding: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem',
                            border: isError ? '1px solid #ef4444' : '1px solid #1e293b',
                            boxShadow: isError ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: inst.color, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{inst.name}</div>
                                <input
                                    type="range"
                                    min="-100" max="100"
                                    value={panVals[inst.id]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePanChange(inst.id, parseInt(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer', accentColor: inst.color }}
                                />
                            </div>
                            <div style={{ width: '45px', textAlign: 'right', color: isError ? '#ef4444' : '#fca311', fontVariantNumeric: 'tabular-nums', fontWeight: 'bold' }}>
                                {panVals[inst.id] === 0 ? 'C' : panVals[inst.id] < 0 ? `L${Math.abs(panVals[inst.id])}` : `R${panVals[inst.id]}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}