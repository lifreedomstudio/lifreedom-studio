"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 🎛️ 樂器配置
const INSTRUMENTS = [
    { id: 'vocal', name: '🎤 主唱 (Vocal)', color: '#ffffff', file: '/audio/vocal.mp3' },
    { id: 'drum', name: '🥁 鼓組 (Drums)', color: '#ef4444', file: '/audio/drum.mp3' },
    { id: 'bass', name: '🎸 貝斯 (Bass)', color: '#3b82f6', file: '/audio/bass.mp3' },
    { id: 'rhythm', name: '🎸 節奏吉他 (Rhythm)', color: '#10b981', file: '/audio/rhythm.mp3' },
    { id: 'lead', name: '🎹 旋律吉他 (Lead)', color: '#a78bfa', file: '/audio/lead.mp3' }
];

// 💡 預設環境
const PRESETS = {
    mono: { name: '📻 擠在中間 (Mono)', desc: '所有樂器全部擠在中央。注意聽，主唱的細節完全被旁邊的吉他吃掉了。', pan: { vocal: 0, drum: 0, bass: 0, rhythm: 0, lead: 0 } },
    pop: { name: '🎧 流行音樂 (Modern Pop)', desc: '吉他稍微往中間靠攏，雖然犧牲了極致的寬廣度，但創造出了把主唱溫暖「包覆」起來的安全聽感。', pan: { vocal: 0, drum: 0, bass: 0, rhythm: -45, lead: 45 } },
    jrock: { name: '🔥 空間爆破 (LCR法)', desc: '兩把吉他強行推到左右最深處。中間的黃金通道完全讓給主唱與節奏組，音場瞬間無比寬廣！', pan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 } }
};

type PanState = Record<string, number>;

// 🐛 修正 2：補上 errors 屬性
type EvaluationResult = { widthScore: number; clarityScore: number; totalScore: number; dynamicHints: string[]; errors: string[] };

// 🧠 平滑曲線與雙軸評分引擎
const LEVELS = [
    {
        id: "level-1",
        title: "聽覺任務 1：撕開空間 (Width Expansion)",
        instruction: "💡 目標：讓這首歌聽起來「比現在更寬廣」。\n請用耳朵找出擠在中間的頻率，把它們完全拉開，直到空間感徹底炸開。",
        proPan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 },
        evaluate: (panVals: PanState): EvaluationResult => {
            let r = panVals.rhythm;
            let l = panVals.lead;
            if (r > l) { const temp = r; r = l; l = temp; }

            let widthScore = Math.max(0, 100 - (Math.abs(-100 - r) + Math.abs(100 - l)) / 2);
            if (r * l > 0) widthScore = 0;

            const stemDeviation = Math.abs(panVals.vocal) + Math.abs(panVals.drum) + Math.abs(panVals.bass);
            let clarityScore = Math.max(0, 100 - stemDeviation * 2);

            const dynamicHints: string[] = [];
            const errors: string[] = []; // 同步收集需要亮紅燈的樂器

            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：兩把吉他擠在同側，導致左右重量嚴重失衡。");
                clarityScore = Math.max(0, clarityScore - 40);
                errors.push('rhythm', 'lead');
            }
            if (stemDeviation > 15) {
                dynamicHints.push("❌ Anchor Instability (骨架偏移)：主唱或大鼓偏離 C 點，整首歌失去視覺重心。");
                if (Math.abs(panVals.vocal) > 10) errors.push('vocal');
                if (Math.abs(panVals.drum) > 10) errors.push('drum');
                if (Math.abs(panVals.bass) > 10) errors.push('bass');
            }
            if (widthScore < 60 && r * l <= 0) {
                dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：吉他離中心太近，沒有真正撕開空間。");
                if (Math.abs(r) < 70) errors.push('rhythm');
                if (Math.abs(l) < 70) errors.push('lead');
            }

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints, errors };
        },
        unlockedSkill: "空間擴張 (Stereo Width) 感知"
    },
    {
        id: "level-2",
        title: "聽覺任務 2：保護主唱 (Vocal Clarity)",
        instruction: "💡 目標：解除遮蔽，讓「主唱」變得最清晰。\n主唱快被吉他淹沒了。請穩住核心骨架，並把干擾的樂器移開，還給主唱一條乾淨的走道。",
        proPan: { vocal: 0, drum: 0, bass: 0, rhythm: -80, lead: 80 },
        evaluate: (panVals: PanState): EvaluationResult => {
            let r = panVals.rhythm;
            let l = panVals.lead;
            if (r > l) { const temp = r; r = l; l = temp; }

            let widthScore = Math.max(0, 100 - (Math.abs(-80 - r) + Math.abs(80 - l)) / 1.5);
            if (r * l > 0) widthScore = 0;

            const stemDeviation = Math.abs(panVals.vocal) + Math.abs(panVals.drum) + Math.abs(panVals.bass);
            let clarityScore = Math.max(0, 100 - stemDeviation * 2.5);

            const dynamicHints: string[] = [];
            const errors: string[] = [];

            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：吉他同側互撞，反而製造了新的遮蔽點。");
                clarityScore = Math.max(0, clarityScore - 50);
                errors.push('rhythm', 'lead');
            }
            if (stemDeviation > 10) {
                dynamicHints.push("❌ Anchor Instability (骨架偏移)：你動到了主唱或節奏組！把它們釘回 C 點。");
                if (Math.abs(panVals.vocal) > 10) errors.push('vocal');
                if (Math.abs(panVals.drum) > 10) errors.push('drum');
                if (Math.abs(panVals.bass) > 10) errors.push('bass');
            }
            if (Math.abs(r) < 40 || Math.abs(l) < 40) {
                dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：干擾物還沒完全移開，主唱聽起來還是糊的。");
                if (Math.abs(r) < 40) errors.push('rhythm');
                if (Math.abs(l) < 40) errors.push('lead');
            }

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints, errors };
        },
        unlockedSkill: "頻率防遮蔽 (Masking) 意識"
    },
    {
        id: "level-3",
        title: "聽覺任務 3：溫暖的親密感 (Intimacy)",
        instruction: "💡 目標：做出一種「溫暖、緊密包覆」的現代流行聽感。\n這次請把吉他往中間「收攏」一點。既不能吃掉主唱，又要創造出把聽眾包起來的親暱感。",
        proPan: { vocal: 0, drum: 0, bass: 0, rhythm: -45, lead: 45 },
        evaluate: (panVals: PanState): EvaluationResult => {
            let r = panVals.rhythm;
            let l = panVals.lead;
            if (r > l) { const temp = r; r = l; l = temp; }

            let widthScore = Math.max(0, 100 - (Math.abs(-45 - r) + Math.abs(45 - l)));
            if (r * l > 0) widthScore = 0;

            const stemDeviation = Math.abs(panVals.vocal) + Math.abs(panVals.drum) + Math.abs(panVals.bass);
            let clarityScore = Math.max(0, 100 - stemDeviation * 2);

            const dynamicHints: string[] = [];
            const errors: string[] = [];

            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：左右失去平衡。");
                clarityScore = Math.max(0, clarityScore - 40);
                errors.push('rhythm', 'lead');
            }
            if (Math.abs(r) > 75 || Math.abs(l) > 75) {
                dynamicHints.push("⚠️ Space Disconnected (空間解離)：拉得太遠了，認知上失去了包覆主唱的親密感。");
                if (Math.abs(r) > 75) errors.push('rhythm');
                if (Math.abs(l) > 75) errors.push('lead');
            } else if (Math.abs(r) < 25 || Math.abs(l) < 25) {
                dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：收得太緊，快要把主唱悶死了。");
                if (Math.abs(r) < 25) errors.push('rhythm');
                if (Math.abs(l) < 25) errors.push('lead');
            }

            if (stemDeviation > 10) {
                if (Math.abs(panVals.vocal) > 10) errors.push('vocal');
                if (Math.abs(panVals.drum) > 10) errors.push('drum');
                if (Math.abs(panVals.bass) > 10) errors.push('bass');
            }

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints, errors };
        },
        unlockedSkill: "親暱度 (Intimacy) 控制藝術"
    }
];

export default function IncubatorPage() {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
        };
        checkUser();
    }, [router]);

    const [panVals, setPanVals] = useState<PanState>(PRESETS.mono.pan);
    const [activePreset, setActivePreset] = useState<string>('mono');
    const [infoText, setInfoText] = useState(PRESETS.mono.desc);

    const [mode, setMode] = useState<'free' | 'challenge'>('challenge');
    const [isProMix, setIsProMix] = useState(false);

    const [challengeStatus, setChallengeStatus] = useState<"pending" | "evaluated">("pending");
    const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
    const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
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
                const res = await fetch(inst.file);
                const buf = await ctx.decodeAudioData(await res.arrayBuffer());
                buffersRef.current[inst.id] = buf;
                const panner = ctx.createStereoPanner();
                panner.pan.value = (PRESETS.mono.pan as PanState)[inst.id] / 100;
                pannersRef.current[inst.id] = panner;
                panner.connect(masterGain);
            } catch (e) { console.error(e); }
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
        Object.values(sourcesRef.current).forEach(source => { try { source.stop(); source.disconnect(); } catch (e) { } });
        sourcesRef.current = {};
    };

    useEffect(() => {
        return () => { stopTracks(); if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close(); };
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
        if (isPlaying) stopTracks(); else playTracks(ctx);
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (!isAudioReady || !audioCtxRef.current) return;
        const activePanVals = isProMix ? LEVELS[currentLevelIdx].proPan : panVals;
        Object.entries(activePanVals).forEach(([id, val]) => {
            if (pannersRef.current[id]) {
                pannersRef.current[id].pan.setTargetAtTime(val / 100, audioCtxRef.current!.currentTime, 0.1);
            }
        });
    }, [panVals, isProMix, isAudioReady, currentLevelIdx]);

    const handlePanChange = (id: string, val: number) => {
        setPanVals({ ...panVals, [id]: val });
        setActivePreset('custom');
        if (mode === 'challenge') setChallengeStatus('pending');
    };

    const currentLevel = LEVELS[currentLevelIdx];

    const checkPanChallenge = () => {
        const result = currentLevel.evaluate(panVals);
        setEvalResult(result);
        setErrorInsts(result.errors); // 🐛 同步觸發錯誤樂器發紅光
        setChallengeStatus("evaluated");
    };

    const applyPreset = (key: keyof typeof PRESETS) => { // 🐛 修正 1：明確定義 Key 類型
        if (mode === 'challenge') return;
        setPanVals(PRESETS[key].pan);
        setActivePreset(key);
        setInfoText(PRESETS[key].desc);
        setErrorInsts([]);
    };

    const exitChallengeMode = () => {
        setMode('free');
        setChallengeStatus('pending');
        setEvalResult(null);
        setErrorInsts([]);
        setInfoText(PRESETS.mono.desc);
    };

    const DualAxisScoreBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                <span>{label}</span>
                <span style={{ color: color, fontWeight: 'bold' }}>{score}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>AUDIO PERCEPTION SYSTEM</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0.5rem 0', color: '#fff' }}>聽覺認知訓練引擎</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>用大腦感知聲音在空氣中構築的物理層次，解除盲區 🎧</p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <button onClick={togglePlay} disabled={isLoading} style={{ padding: '1.2rem 3.5rem', fontSize: '1.5rem', fontWeight: '900', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', background: isLoading ? '#475569' : isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', boxShadow: `0 0 40px ${isPlaying ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`, transition: 'all 0.3s' }}>
                    {isLoading ? '⏳ 音訊引擎初始化...' : isPlaying ? '⏸️ 關閉音訊引擎' : '▶️ 開啟音訊系統'}
                </button>
            </div>

            {/* 🎯 挑戰模式 */}
            {mode === 'challenge' && (
                <div style={{ marginBottom: '2rem', padding: '2rem', background: '#0b0f19', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.4rem', fontWeight: '900' }}>{currentLevel.title}</h3>
                        <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '12px', fontSize: '0.9rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            LEVEL {currentLevelIdx + 1} / {LEVELS.length}
                        </span>
                    </div>

                    <p style={{ margin: '0 0 2rem 0', color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                        {currentLevel.instruction}
                    </p>

                    {challengeStatus === 'pending' ? (
                        <button onClick={checkPanChallenge} style={{ width: '100%', padding: '1.2rem', background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}>
                            🔍 提交聽感分析 (Analyze Mix)
                        </button>
                    ) : (
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <h4 style={{ color: '#fff', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📊 空間聽感分析報告</h4>
                                    <DualAxisScoreBar label="空間寬廣度 (Width Score)" score={evalResult?.widthScore || 0} color="#38bdf8" />
                                    <DualAxisScoreBar label="核心清晰度 (Clarity Score)" score={evalResult?.clarityScore || 0} color="#facc15" />
                                </div>
                                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '5px' }}>TOTAL MATCH</div>
                                    <div style={{ color: evalResult!.totalScore >= 80 ? '#10b981' : '#fca5a5', fontSize: '2rem', fontWeight: '900' }}>{evalResult?.totalScore}%</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 10px 0', letterSpacing: '1px' }}>🧠 聽覺盲區偵測 (Error-driven Hints)</h4>
                                {evalResult?.dynamicHints.map((hint, i) => (
                                    <div key={i} style={{ color: hint.includes('🔥') ? '#10b981' : '#fca5a5', fontSize: '0.95rem', margin: '0 0 8px 0', paddingLeft: '10px', borderLeft: `3px solid ${hint.includes('🔥') ? '#10b981' : '#ef4444'}` }}>
                                        {hint}
                                    </div>
                                ))}
                                {evalResult?.dynamicHints.length === 0 && evalResult!.totalScore < 80 && (
                                    <div style={{ color: '#cbd5e1', paddingLeft: '10px', borderLeft: '3px solid #64748b' }}>👉 方向沒錯，但還沒有達到完美平衡。請微調紅光警示的軌道！</div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    onMouseDown={() => setIsProMix(true)} onMouseUp={() => setIsProMix(false)} onMouseLeave={() => setIsProMix(false)} onTouchStart={() => setIsProMix(true)} onTouchEnd={() => setIsProMix(false)}
                                    style={{ flex: 1, padding: '1rem', background: isProMix ? '#a78bfa' : 'transparent', color: isProMix ? '#020617' : '#a78bfa', border: '2px solid #a78bfa', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.1s' }}
                                >
                                    {isProMix ? '🎧 正在播放大師解答 (Pro Mix)...' : '🎧 壓住對比大師解答 (A/B Test)'}
                                </button>

                                {evalResult!.totalScore >= 80 ? (
                                    currentLevelIdx < LEVELS.length - 1 ? (
                                        <button onClick={() => { setCurrentLevelIdx(prev => prev + 1); setChallengeStatus('pending'); setEvalResult(null); setErrorInsts([]); setPanVals(PRESETS.mono.pan); }} style={{ flex: 1, padding: '1rem', background: '#10b981', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                                            👉 聽感匹配！前往下一空間維度
                                        </button>
                                    ) : (
                                        <button onClick={exitChallengeMode} style={{ flex: 1, padding: '1rem', background: '#fca311', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(252, 163, 17, 0.3)' }}>
                                            🏆 聽覺完全覺醒！解鎖自由探索與三大環境 ➔
                                        </button>
                                    )
                                ) : (
                                    <button onClick={() => setChallengeStatus('pending')} style={{ flex: 1, padding: '1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        🔧 重新調整聽感
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {mode === 'free' && (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, color: '#fca311', fontWeight: '900', fontSize: '1.4rem' }}>🎛️ 自由探索大師控制台</h2>
                        <button onClick={() => { setMode('challenge'); setCurrentLevelIdx(0); setChallengeStatus('pending'); setEvalResult(null); setErrorInsts([]); setPanVals(PRESETS.mono.pan); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #4f46e5', color: '#818cf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ↩ 重新進入聽覺測驗
                        </button>
                    </div>

                    <div style={{ background: '#0f172a', borderLeft: '4px solid #fca311', padding: '1.5rem', borderRadius: '4px 16px 16px 4px', marginBottom: '2rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <p style={{ margin: 0, fontSize: '1.05rem', color: '#fed7aa', lineHeight: '1.7' }}>{infoText}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {Object.keys(PRESETS).map((key) => {
                            const presetKey = key as keyof typeof PRESETS; // 🐛 強制轉型確保按鈕 Key 正確
                            return (
                                <button
                                    key={presetKey}
                                    onClick={() => applyPreset(presetKey)}
                                    style={{
                                        padding: '12px 28px', borderRadius: '50px', fontWeight: 'bold', transition: 'all 0.3s',
                                        background: activePreset === presetKey ? '#38bdf8' : '#1e293b',
                                        color: activePreset === presetKey ? '#020617' : '#e2e8f0',
                                        border: `1px solid ${activePreset === presetKey ? '#38bdf8' : '#334155'}`,
                                        boxShadow: activePreset === presetKey ? '0 0 20px rgba(56, 189, 248, 0.3)' : 'none',
                                        cursor: 'pointer', fontSize: '0.95rem'
                                    }}
                                >
                                    {PRESETS[presetKey].name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 〰️ 虛擬 3D 聲場示範軌跡 */}
            <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    <span>LEFT // 左方音場</span>
                    <span>CENTER // 正中央通道</span>
                    <span>RIGHT // 右方音場</span>
                </div>

                <div style={{ height: '180px', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)', borderRadius: '12px', position: 'relative', border: '1px dashed rgba(56, 189, 248, 0.1)' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    {INSTRUMENTS.map((inst, idx) => {
                        const panValue = panVals[inst.id];
                        const leftPos = `${((panValue + 100) / 200) * 100}%`;
                        const isError = errorInsts.includes(inst.id);
                        const glowEffect = isError ? `0 0 25px #ef4444` : `0 0 15px ${inst.color}40`;

                        return (
                            <div key={inst.id} style={{
                                position: 'absolute', top: `${15 + idx * 16}%`, left: leftPos,
                                transform: 'translateX(-50%)', width: '42px', height: '42px',
                                background: isError ? '#ef4444' : '#0f172a', borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                boxShadow: glowEffect,
                                transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, background 0.3s',
                                zIndex: isError ? 20 : 10, border: `2px solid ${isError ? '#ef4444' : inst.color}`, fontSize: '1.2rem'
                            }}>
                                {inst.name.split(' ')[0]}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 控制推子滑桿 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                {INSTRUMENTS.map(inst => {
                    const isError = errorInsts.includes(inst.id);
                    return (
                        <div key={inst.id} style={{
                            background: '#0f172a', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.8rem',
                            border: isError ? '1px solid #ef4444' : '1px solid #1e293b', transition: 'all 0.3s'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div style={{ fontWeight: 'bold', color: isError ? '#ef4444' : '#fff', fontSize: '1rem', fontFamily: 'monospace' }}>{inst.name}</div>
                                <div style={{ width: '70px', textAlign: 'right', color: isError ? '#ef4444' : '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                                    {mode === 'challenge' ? '???' : (panVals[inst.id] === 0 ? '中央' : panVals[inst.id] < 0 ? `左 ${Math.abs(panVals[inst.id])}` : `右 ${panVals[inst.id]}`)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold', fontFamily: 'monospace' }}>左 (L)</span>
                                <input
                                    type="range" min="-100" max="100" value={panVals[inst.id]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePanChange(inst.id, parseInt(e.target.value))}
                                    style={{ flex: 1, cursor: 'pointer', accentColor: isError ? '#ef4444' : '#38bdf8' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold', fontFamily: 'monospace' }}>右 (R)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}