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

const PRESETS = {
    mono: { name: '📻 擁擠音牆模式', desc: '所有樂器擠在中間，主唱被吉他嚴重 Masking。', pan: { vocal: 0, drum: 0, bass: 0, rhythm: 0, lead: 0 } },
    jrock: { name: '🔥 日系空間爆破', desc: '兩把吉他極端 LCR 佈局，撕開最狂暴的寬廣度。', pan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 } },
    pop: { name: '🎧 流行溫暖包覆', desc: '吉他向內收攏，犧牲極致寬廣，換取把聽眾包裹的親密感。', pan: { vocal: 0, drum: 0, bass: 0, rhythm: -45, lead: 45 } }
};

type PanState = Record<string, number>;
type EvaluationResult = { widthScore: number; clarityScore: number; totalScore: number; dynamicHints: string[] };

// 🧠 核心升級 1：平滑曲線與雙軸評分引擎 (Width & Clarity)
const LEVELS = [
    {
        id: "level-1",
        title: "聽覺任務 1：撕開空間 (Width Expansion)",
        instruction: "💡 目標：讓這首歌聽起來「比現在更寬廣」。\n請用耳朵找出擠在中間的頻率，把它們完全拉開，直到空間感徹底炸開。",
        proPan: { vocal: 0, drum: 0, bass: 0, rhythm: -100, lead: 100 }, // 標準答案音場
        evaluate: (panVals: PanState): EvaluationResult => {
            let r = panVals.rhythm;
            let l = panVals.lead;
            if (r > l) { const temp = r; r = l; l = temp; } // 確保 r 在左, l 在右

            // 軸 1：Width Score (平滑計算離 ±100 的距離)
            let widthScore = Math.max(0, 100 - (Math.abs(-100 - r) + Math.abs(100 - l)) / 2);
            if (r * l > 0) widthScore = 0; // 同側撞車直接 0 分

            // 軸 2：Clarity Score (核心骨架偏移度)
            const stemDeviation = Math.abs(panVals.vocal) + Math.abs(panVals.drum) + Math.abs(panVals.bass);
            let clarityScore = Math.max(0, 100 - stemDeviation * 2);

            // 🧠 錯誤感知導航 (Error-driven Hints)
            const dynamicHints: string[] = [];
            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：兩把吉他擠在同側，導致左右重量嚴重失衡。");
                clarityScore = Math.max(0, clarityScore - 40);
            }
            if (stemDeviation > 15) dynamicHints.push("❌ Anchor Instability (骨架偏移)：主唱或大鼓偏離 C 點，整首歌失去視覺重心。");
            if (widthScore < 60 && r * l <= 0) dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：吉他離中心太近，沒有真正撕開空間。");

            if (dynamicHints.length === 0 && widthScore >= 85) dynamicHints.push("🔥 Perfect Width：空間已經完全被撕開，這就是 LCR 的威力！");

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints };
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
            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：吉他同側互撞，反而製造了新的遮蔽點。");
                clarityScore = Math.max(0, clarityScore - 50);
            }
            if (stemDeviation > 10) dynamicHints.push("❌ Anchor Instability (骨架偏移)：你動到了主唱或節奏組！把它們釘回 C 點。");
            if (Math.abs(r) < 40 || Math.abs(l) < 40) dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：干擾物還沒完全移開，主唱聽起來還是糊的。");

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints };
        },
        unlockedSkill: "頻率防遮蔽 (Masking) 意識"
    },
    {
        id: "level-3",
        title: "聽覺任務 3：溫暖的親密感 (Intimacy)",
        instruction: "💡 目標：做出一種「溫暖、緊密包覆」的現代流行聽感。\n極端拉開雖然很爽，但有時中間會太散。請把吉他往中間「收攏」一點，找到那個剛好包住主唱的甜蜜點。",
        proPan: { vocal: 0, drum: 0, bass: 0, rhythm: -45, lead: 45 },
        evaluate: (panVals: PanState): EvaluationResult => {
            let r = panVals.rhythm;
            let l = panVals.lead;
            if (r > l) { const temp = r; r = l; l = temp; }

            // 最佳寬度在 ±45 左右，平滑衰減
            let widthScore = Math.max(0, 100 - (Math.abs(-45 - r) + Math.abs(45 - l)));
            if (r * l > 0) widthScore = 0;

            const stemDeviation = Math.abs(panVals.vocal) + Math.abs(panVals.drum) + Math.abs(panVals.bass);
            let clarityScore = Math.max(0, 100 - stemDeviation * 2);

            const dynamicHints: string[] = [];
            if (r * l > 0 && Math.abs(r) > 15 && Math.abs(l) > 15) {
                dynamicHints.push("❌ Phase Crowding (相位擁擠)：左右失衡。");
                clarityScore = Math.max(0, clarityScore - 40);
            }
            if (Math.abs(r) > 75 || Math.abs(l) > 75) dynamicHints.push("⚠️ Space Disconnected (空間解離)：拉得太遠了，失去了包覆主唱的親密感。");
            else if (Math.abs(r) < 25 || Math.abs(l) < 25) dynamicHints.push("⚠️ Center Masking (中心頻率遮蔽)：收得太緊，快要把主唱勒死了。");

            return { widthScore: Math.round(widthScore), clarityScore: Math.round(clarityScore), totalScore: Math.round((widthScore + clarityScore) / 2), dynamicHints };
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

    // 🧠 核心升級 2：加入 Pro Mix 參考音軌狀態
    const [isProMix, setIsProMix] = useState(false);

    const [challengeStatus, setChallengeStatus] = useState<"pending" | "evaluated">("pending");
    const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
    const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);

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

    // 🧠 核心升級 2：Pro Mix A/B 切換引擎
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
        setChallengeStatus("evaluated");
    };

    const exitChallengeMode = () => {
        setMode('free');
        setChallengeStatus('pending');
        setEvalResult(null);
        setInfoText(PRESETS.mono.desc);
    };

    // 💡 雙軸評分 UI 組件
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
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>閉上眼睛盲飛。用大腦感知聲音在空氣中構築的物理層次 🎧</p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <button onClick={togglePlay} disabled={isLoading} style={{ padding: '1.2rem 3.5rem', fontSize: '1.5rem', fontWeight: '900', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', background: isLoading ? '#475569' : isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', boxShadow: `0 0 40px ${isPlaying ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`, transition: 'all 0.3s' }}>
                    {isLoading ? '⏳ 音訊引擎初始化...' : isPlaying ? '⏸️ 關閉音訊引擎' : '▶️ 播放音樂'}
                </button>
            </div>

            {/* 🎯 挑戰模式：Pro Simulator */}
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

                            {/* 🧠 錯誤感知導航 */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 10px 0', letterSpacing: '1px' }}>🧠 聽覺盲區偵測 (Error-driven Hints)</h4>
                                {evalResult?.dynamicHints.map((hint, i) => (
                                    <div key={i} style={{ color: hint.includes('🔥') ? '#10b981' : '#fca5a5', fontSize: '0.95rem', margin: '0 0 8px 0', paddingLeft: '10px', borderLeft: `3px solid ${hint.includes('🔥') ? '#10b981' : '#ef4444'}` }}>
                                        {hint}
                                    </div>
                                ))}
                                {evalResult?.dynamicHints.length === 0 && evalResult!.totalScore < 80 && (
                                    <div style={{ color: '#cbd5e1', paddingLeft: '10px', borderLeft: '3px solid #64748b' }}>👉 方向沒錯，但還沒有達到完美平衡。微調看看！</div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* 🎧 Reference Track (Pro Mix) 按鈕 */}
                                <button
                                    onMouseDown={() => setIsProMix(true)}
                                    onMouseUp={() => setIsProMix(false)}
                                    onMouseLeave={() => setIsProMix(false)}
                                    onTouchStart={() => setIsProMix(true)}
                                    onTouchEnd={() => setIsProMix(false)}
                                    style={{ flex: 1, padding: '1rem', background: isProMix ? '#a78bfa' : 'transparent', color: isProMix ? '#020617' : '#a78bfa', border: '2px solid #a78bfa', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.1s' }}
                                >
                                    {isProMix ? '🎧 正在播放大師解答 (Pro Mix)...' : '🎧 壓住對比大師解答 (A/B Test)'}
                                </button>

                                {evalResult!.totalScore >= 80 ? (
                                    currentLevelIdx < LEVELS.length - 1 ? (
                                        <button onClick={() => { setCurrentLevelIdx(prev => prev + 1); setChallengeStatus('pending'); setEvalResult(null); setPanVals(PRESETS.mono.pan); }} style={{ flex: 1, padding: '1rem', background: '#10b981', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                                            👉 聽感一致！前往下一維度
                                        </button>
                                    ) : (
                                        <button onClick={exitChallengeMode} style={{ flex: 1, padding: '1rem', background: '#fca311', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(252, 163, 17, 0.3)' }}>
                                            🏆 聽覺完全覺醒！解鎖自由模式
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
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, color: '#fca311', fontWeight: '900' }}>🎛️ 自由探索模式 (已解鎖)</h2>
                        <button onClick={() => { setMode('challenge'); setCurrentLevelIdx(0); setChallengeStatus('pending'); setPanVals(PRESETS.mono.pan); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #4f46e5', color: '#818cf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ↩ 重新進入聽覺測驗
                        </button>
                    </div>
                    <div style={{ background: '#0f172a', borderLeft: '4px solid #fca311', padding: '1.5rem', borderRadius: '4px 16px 16px 4px', marginBottom: '2rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <p style={{ margin: 0, fontSize: '1.05rem', color: '#fed7aa', lineHeight: '1.7' }}>{infoText}</p>
                    </div>
                </>
            )}

            {/* 〰️ 控制推子滑桿 (隱藏數值強制盲飛) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                {INSTRUMENTS.map(inst => {
                    return (
                        <div key={inst.id} style={{
                            background: '#0f172a', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem',
                            border: '1px solid #1e293b', transition: 'all 0.3s'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontFamily: 'monospace' }}>{inst.name}</div>
                                <input
                                    type="range" min="-100" max="100" value={panVals[inst.id]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePanChange(inst.id, parseInt(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
                                />
                            </div>
                            <div style={{ width: '60px', textAlign: 'right', color: '#64748b', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace', opacity: mode === 'challenge' ? 0.3 : 1 }}>
                                {mode === 'challenge' ? '???' : (panVals[inst.id] === 0 ? 'C' : panVals[inst.id] < 0 ? `L${Math.abs(panVals[inst.id])}` : `R${panVals[inst.id]}`)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}