"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

type Instrument = {
    id: string;
    name: string;
    task: string;
    icon: string;
};

const instruments: Instrument[] = [
    { id: "guitar", name: "木吉他", task: "負責：穩定刷和弦 (Rhythm)", icon: "🎸" },
    { id: "piano", name: "平台鋼琴", task: "負責：流動的分散和弦 (Arpeggio)", icon: "🎹" },
    { id: "synth", name: "合成器", task: "負責：最亮眼的主旋律 (Lead)", icon: "🎛" },
];

const slots = [
    { id: "high", label: "UPPER FLOOR (高頻區)", color: "#38bdf8", desc: "旋律線與點綴的挑高空間", bar: "██████" },
    { id: "mid", label: "MID FLOOR (中頻區)", color: "#facc15", desc: "和弦基底與人聲的主戰場", bar: "█████████████" },
    { id: "low", label: "GROUND FLOOR (低頻/基底區)", color: "#ef4444", desc: "Bass 與 大鼓 的專屬地盤", bar: "████████" },
];

const PlacedBadge = ({ name, icon, onRemove, disabled }: { name: string, icon: string, onRemove: (e: React.MouseEvent) => void, disabled: boolean }) => {
    const [isHover, setIsHover] = useState(false);
    return (
        <div
            onClick={(e) => !disabled && onRemove(e)}
            onMouseEnter={() => !disabled && setIsHover(true)}
            onMouseLeave={() => !disabled && setIsHover(false)}
            style={{
                padding: "8px 16px",
                background: isHover ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)",
                border: isHover ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50px", display: "flex", alignItems: "center", gap: "8px",
                cursor: disabled ? "default" : "pointer", transition: "all 0.2s"
            }}
        >
            <span>{icon}</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#fff" }}>{name}</span>
            {!disabled && <span style={{ color: isHover ? "#fff" : "#64748b", fontSize: "0.8rem", marginLeft: "4px" }}>✕</span>}
        </div>
    );
};

// 定義樂器配置與檔案路徑 (用於播放器區塊)
const AUDIO_INSTRUMENTS = [
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

export default function VoicingLabPage() {
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

    // 空間分配狀態
    const [placed, setPlaced] = useState<Record<string, string>>({});
    const [selectedIns, setSelectedIns] = useState<string | null>(null);
    const [historyErrors, setHistoryErrors] = useState({ lowClash: 0, midCongested: 0 });
    const [hasCalculated, setHasCalculated] = useState(false);

    // 播放器狀態
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

    useEffect(() => {
        window.scrollTo(0, 0);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedIns(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // 播放器音訊初始化
    const initAudio = async () => {
        setIsLoading(true);
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        const loadPromises = AUDIO_INSTRUMENTS.map(async (inst) => {
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
        AUDIO_INSTRUMENTS.forEach(inst => {
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

    // 清理機制
    useEffect(() => {
        return () => {
            stopTracks();
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
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
        setPanVals(PRESETS[key as keyof typeof PRESETS].pan);
        setActivePreset(key);
        setInfoText(PRESETS[key as keyof typeof PRESETS].desc);
    };

    const handlePanChange = (id: string, val: number) => {
        setPanVals(prev => ({ ...prev, [id]: val }));
        setActivePreset('custom');
        setInfoText('🔧 正在自訂聲場舞台... 戴上耳機，親耳感受聲音在左右耳之間的物理移動。');
    };

    // 空間分配邏輯
    const handleSelectInstrument = (id: string) => {
        if (selectedIns === id) setSelectedIns(null);
        else setSelectedIns(id);
    };

    const handleSlotClick = (slotId: string) => {
        if (selectedIns && !isFreeze) {
            setPlaced((prev) => ({ ...prev, [selectedIns]: slotId }));
            setSelectedIns(null);
            setHasCalculated(false);
        }
    };

    const handleRemoveInstrument = (insId: string, e: React.MouseEvent) => {
        setPlaced((prev) => {
            const newPlaced = { ...prev };
            delete newPlaced[insId];
            return newPlaced;
        });
        setHasCalculated(false);
    };

    const getScoreDetails = () => {
        let currentScore = 0;
        let penalties = 0;
        let midCount = 0;
        let lowClashDetected = false;
        let midCongestedDetected = false;

        instruments.forEach((ins) => {
            const slot = placed[ins.id];
            if (!slot) return;

            if (ins.id === "guitar" && slot === "mid") currentScore++;
            if (ins.id === "piano" && slot === "high") currentScore++;
            if (ins.id === "synth" && slot === "high") currentScore++;

            if (slot === "low") { penalties += 2; lowClashDetected = true; }
            if (slot === "mid") midCount++;
        });

        if (midCount >= 2) { penalties += 1; midCongestedDetected = true; }

        const finalScore = Math.max(0, currentScore - penalties);
        return { finalScore, lowClashDetected, midCongestedDetected };
    };

    const { finalScore, lowClashDetected, midCongestedDetected } = getScoreDetails();
    const allPlaced = instruments.every((i) => placed[i.id]);
    const isFreeze = allPlaced && finalScore === 3;

    useEffect(() => {
        if (allPlaced && !hasCalculated) {
            setHistoryErrors(prev => ({
                lowClash: prev.lowClash + (lowClashDetected ? 1 : 0),
                midCongested: prev.midCongested + (midCongestedDetected ? 1 : 0)
            }));
            setHasCalculated(true);
        }
    }, [allPlaced, finalScore, lowClashDetected, midCongestedDetected, hasCalculated]);

    const getCongestionUI = (slotId: string) => {
        const count = Object.values(placed).filter(v => v === slotId).length;
        if (slotId === "high") {
            if (count === 2) return { text: "💡 空間利用極佳", color: "#34d399", level: "fine" };
            if (count >= 3) return { text: "🔥 非常擁擠（建議拆開）", color: "#ef4444", level: "over" };
        } else {
            if (count === 1) return { text: "⚠️ 可能開始擁擠", color: "#fbbf24", level: "warn" };
            if (count >= 2) return { text: "🔥 非常擁擠（建議拆開）", color: "#ef4444", level: "over" };
        }
        return null;
    };

    const resetLab = () => {
        setPlaced({});
        setSelectedIns(null);
        setHasCalculated(false);
    };

    return (
        <div style={{
            minHeight: "100vh", background: "#020617", color: "#f8fafc",
            padding: isMobile ? "2rem 1rem" : "4rem 2rem", fontFamily: "sans-serif",
            display: "flex", justifyContent: "center"
        }}>
            <div style={{ maxWidth: "900px", width: "100%" }}>

                {/* HEADER */}
                <header style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ color: "#a78bfa", letterSpacing: "4px", fontWeight: "bold", marginBottom: "1rem" }}>
                        VOICING REPAIR LAB
                    </div>
                    <h1 style={{ fontSize: isMobile ? "2rem" : "3rem", fontWeight: 900, margin: "0 0 1rem 0" }}>
                        空間分配實驗室
                    </h1>

                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "16px", marginTop: "1.5rem" }}>
                        <p style={{ color: "#fca311", fontWeight: "bold", margin: "0 0 10px 0", fontSize: "1.1rem" }}>
                            ⚠️ 任務前提：Bass 和大鼓已經佔滿了低頻區。
                        </p>
                        <p style={{ color: "#cbd5e1", margin: 0, lineHeight: 1.6, fontSize: "1rem" }}>
                            請根據樂器的<strong style={{ color: "#fff" }}>「負責任務」</strong>進行樓層決策。滿分 3 分，錯誤擺放會觸發分數扣減。<br />
                            👉 點擊選擇樂器 ➔ 點擊樓層放入。按 <code style={{ background: "#334155", padding: "2px 6px", borderRadius: "4px" }}>ESC</code> 可取消選取。
                        </p>
                    </div>
                </header>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "2.5rem", marginBottom: "4rem" }}>

                    {/* 🎼 樂器庫 */}
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", height: "fit-content" }}>
                        <h3 style={{ marginBottom: "1.5rem", color: "#facc15", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>📋</span> 待分配樂器
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {instruments.map((ins) => {
                                const isPlaced = !!placed[ins.id];
                                const isSelected = selectedIns === ins.id;

                                if (isPlaced) return null;

                                return (
                                    <button
                                        key={ins.id}
                                        disabled={isFreeze}
                                        onClick={() => handleSelectInstrument(ins.id)}
                                        style={{
                                            padding: "1.2rem", background: isSelected ? "rgba(250, 204, 21, 0.2)" : "#0f172a",
                                            border: isSelected ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "16px", cursor: isFreeze ? "default" : "pointer", display: "flex", alignItems: "center", gap: "15px",
                                            transition: "all 0.2s", textAlign: "left", transform: isSelected ? "scale(1.02)" : "scale(1)", width: "100%"
                                        }}
                                    >
                                        <div style={{ fontSize: "2rem" }}>{ins.icon}</div>
                                        <div>
                                            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>{ins.name}</div>
                                            <div style={{ color: isSelected ? "#fef08a" : "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
                                                {ins.task}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {Object.keys(placed).length === instruments.length && (
                                <div style={{ color: "#10b981", textAlign: "center", padding: "2rem 0", fontWeight: "bold" }}>
                                    ✨ 所有樂器已配置入座
                                </div>
                            )}
                        </div>

                        {/* 📊 成長型大腦小面板面板 */}
                        {(historyErrors.lowClash > 0 || historyErrors.midCongested > 0) && (
                            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "bold", marginBottom: "8px", letterSpacing: "1px" }}>👂 耳朵決策軌跡</div>
                                {historyErrors.lowClash > 0 && <div style={{ fontSize: "0.85rem", color: "#fca5a5" }}>• 低頻車禍碰撞次數：{historyErrors.lowClash} 次</div>}
                                {historyErrors.midCongested > 0 && <div style={{ fontSize: "0.85rem", color: "#fef08a" }}>• 中頻過度堆疊次數：{historyErrors.midCongested} 次</div>}
                            </div>
                        )}
                    </div>

                    {/* 🏢 頻率樓層 */}
                    <div style={{ flex: 1.2 }}>
                        <h3 style={{ marginBottom: "1.5rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>🏢</span> 頻譜空間大廈
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {slots.map((slot) => {
                                const congestion = getCongestionUI(slot.id);
                                const isTargetable = selectedIns !== null && !isFreeze;

                                return (
                                    <div
                                        key={slot.id}
                                        onClick={() => handleSlotClick(slot.id)}
                                        style={{
                                            minHeight: "130px", padding: "1.5rem", borderRadius: "16px",
                                            border: isTargetable ? `2px dashed ${slot.color}` : `1px solid rgba(255,255,255,0.1)`,
                                            background: isTargetable ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.3)",
                                            cursor: isTargetable ? "pointer" : "default", transition: "all 0.3s",
                                            position: "relative", overflow: "hidden"
                                        }}
                                    >
                                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <div style={{ color: slot.color, fontWeight: 900, letterSpacing: "1px", marginBottom: "4px" }}>
                                                    {slot.label}
                                                </div>
                                                <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "8px" }}>{slot.desc}</div>

                                                <div style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.15)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                                                    頻寬：<span style={{ color: `${slot.color}40` }}>{slot.bar}</span>
                                                </div>
                                            </div>

                                            {/* 提示型狀態標籤 */}
                                            {congestion && (
                                                <div style={{
                                                    background: congestion.level === "over" ? "#ef4444" : "#d97706",
                                                    color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold"
                                                }}>
                                                    {congestion.text}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px", position: "relative", zIndex: 1 }}>
                                            {Object.entries(placed).filter(([_, v]) => v === slot.id).map(([k]) => {
                                                const ins = instruments.find(i => i.id === k);
                                                return (
                                                    <PlacedBadge
                                                        key={k}
                                                        name={ins?.name || ""}
                                                        icon={ins?.icon || ""}
                                                        disabled={isFreeze}
                                                        onRemove={(e) => handleRemoveInstrument(k, e)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ================= 播放主控台 ================= */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>LIFREEDOM EAR TRAINING : SPATIAL PERCEPTION</div>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', margin: '0.5rem 0', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        立體聲場實戰體驗
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                        學會頻率分配後，現在讓我們像建築師一樣搭建左右聲道的舞台。<br />
                        <b style={{ color: '#fca311' }}>請務必戴上耳機體驗 🎧</b>
                    </p>

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

                {/* 聲學知識提示框 */}
                <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>💡</span>
                        <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '1rem', letterSpacing: '1px' }}>大師聲學導引</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.7' }}>{infoText}</p>
                </div>

                {/* 曲風預設切換區 */}
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

                {/* 3D 聲場視覺化舞台 */}
                <div style={{ background: '#0f172a', padding: '2rem 1.5rem', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '3rem', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '4px' }}>
                        <span>LEFT (左耳)</span>
                        <span>CENTER (正中央)</span>
                        <span>RIGHT (右耳)</span>
                    </div>

                    <div style={{ height: '200px', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)', borderRadius: '16px', position: 'relative', border: '1px dashed rgba(56, 189, 248, 0.15)', overflow: 'hidden' }}>
                        {/* 中央分割線 */}
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                        {AUDIO_INSTRUMENTS.map((inst, idx) => {
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

                {/* 樂器實時控制推軌 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
                    {AUDIO_INSTRUMENTS.map(inst => (
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

                {/* 🔥 RESULT 反饋 & CTA 升級轉折頁 */}
                {allPlaced && (
                    <div style={{
                        marginTop: "2rem", padding: isMobile ? "2rem 1.5rem" : "4rem 3rem", borderRadius: "24px", animation: "fadeInUp 0.5s ease",
                        background: finalScore === 3 ? "linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.8) 100%)" : "rgba(239,68,68,0.05)",
                        border: finalScore === 3 ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid rgba(239,68,68,0.3)",
                        boxShadow: finalScore === 3 ? "0 20px 40px rgba(0,0,0,0.5)" : "none"
                    }}>
                        <div style={{ textAlign: "center", marginBottom: finalScore === 3 ? "3rem" : "0" }}>
                            <div style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "0.5rem", fontWeight: "bold" }}>頻率配置評分</div>
                            <div style={{ fontSize: "3.5rem", fontWeight: "900", color: finalScore === 3 ? "#10b981" : "#facc15", marginBottom: "1.5rem" }}>
                                {finalScore} <span style={{ fontSize: "1.5rem", color: "#475569" }}>/ 3 分</span>
                            </div>

                            {finalScore === 3 ? (
                                <>
                                    <h2 style={{ color: "#10b981", fontSize: "1.8rem", margin: "0 0 1rem 0", fontWeight: 900 }}>🎯 完美空間編配！布局已鎖定</h2>
                                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6, margin: '0' }}>
                                        你讓木吉他穩住二樓中頻，並成功把鋼琴和合成器利用「移高八度」推向高空。每個樂器都有自己的樓層，不再需要搶奪頻寬！
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 style={{ color: "#ef4444", fontSize: "1.6rem", margin: "0 0 1rem 0", fontWeight: 900 }}>⚠️ 監聽報告：聲音結構仍有衝突</h2>
                                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
                                        {lowClashDetected && "❌ 有樂器誤入了低頻禁區，那裡是大鼓跟 Bass 的地盤！\n"}
                                        {midCongestedDetected && "❌ 中頻樓層太過擁擠，多個和弦樂器正在互相遮蔽。"}
                                    </p>
                                    <button onClick={resetLab} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", border: "1px dashed #ef4444", padding: "12px 30px", borderRadius: "50px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", transition: "all 0.2s" }}>
                                        🔄 重新微調空間決策
                                    </button>
                                </>
                            )}
                        </div>

                        {/* 🔥 終極奧義：升級轉折文案 (僅滿分時顯示) */}
                        {finalScore === 3 && (
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "3rem", animation: "fadeInUp 0.8s ease 0.3s backwards" }}>

                                <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginBottom: "2rem", lineHeight: 1.5 }}>
                                        🎧 你剛剛做的，其實不是遊戲。<br />
                                        <span style={{ color: "#38bdf8" }}>是「混音師每天在做的決策」。</span>
                                    </h3>

                                    <div style={{ color: "#cbd5e1", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                                        <p style={{ marginBottom: "1rem" }}>
                                            大多數人學音樂會卡住，不是因為不努力<br />
                                            而是因為：<br />
                                            <span style={{ color: "#ef4444" }}>❌ 聽不出差異</span><br />
                                            <span style={{ color: "#ef4444" }}>❌ 不知道哪裡錯</span><br />
                                            <span style={{ color: "#ef4444" }}>❌ 更不知道怎麼修</span>
                                        </p>

                                        <p style={{ marginBottom: "1.5rem", color: "#fff", borderLeft: "3px solid #10b981", paddingLeft: "15px", background: "rgba(16, 185, 129, 0.05)", padding: "10px 15px", borderRadius: "0 8px 8px 0" }}>
                                            但你剛剛已經做到一件關鍵的事：<br />
                                            <strong style={{ color: "#10b981", fontSize: "1.15rem" }}>👉 你開始「用耳朵做選擇」</strong>
                                        </p>

                                        <hr style={{ border: "none", borderTop: "1px dashed rgba(255,255,255,0.1)", margin: "2rem 0" }} />

                                        <p style={{ marginBottom: "1.5rem" }}>
                                            而接下來你會遇到一個新的問題：<br />
                                            <span style={{ color: "#fca311", fontWeight: "bold" }}>👉 當聲音開始變多的時候</span><br />
                                            <span style={{ color: "#fca311", fontWeight: "bold" }}>👉 即使放對位置，也開始互相干擾</span>
                                        </p>

                                        <p style={{ marginBottom: "1.5rem" }}>
                                            這就是這堂課要解決的核心：<br />
                                            <strong style={{ color: "#a78bfa", fontSize: "1.3rem", display: "inline-block", marginTop: "8px", letterSpacing: "1px" }}>🎯 Masking（頻率遮蔽與立體聲場）</strong>
                                        </p>

                                        <hr style={{ border: "none", borderTop: "1px dashed rgba(255,255,255,0.1)", margin: "2rem 0" }} />

                                        <p style={{ marginBottom: "1.5rem" }}>
                                            但在結束之前<br />我想讓你先知道一件事：<br />
                                            <strong style={{ color: "#fff", display: "inline-block", marginTop: "8px" }}>👉 你現在，已經比 80% 的創作者更接近「專業」</strong><br />
                                            差的不是努力<br />
                                            而是<strong style={{ color: "#38bdf8" }}>「系統」</strong>
                                        </p>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 🟣 底部問卷/共創者 CTA */}
                <div style={{ marginTop: "4rem", textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', borderRadius: '24px', border: '1px solid #a78bfa', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>CO-CREATOR PROGRAM</div>
                    <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '1rem' }}>我們正在打造「完整版聽覺訓練系統」</h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                        與其自己閉門造車，我們更想聽聽你的聲音。<br />
                        告訴我們你最想解決的混音痛點，幫我們打造最適合你的功能！
                    </p>

                    <p style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                        🎁 填寫問卷，可於表單內留下 Email 領取上線 5 折早鳥優惠。
                    </p>

                    <button
                        onClick={() => {
                            if (isPlaying) {
                                togglePlay(); // 確保離開頁面前關閉背景引擎，不搶佔記憶體
                            }
                            router.push('/feedback');
                        }}
                        style={{ width: '100%', maxWidth: '400px', padding: '1.2rem', background: '#a78bfa', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)', transition: 'transform 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        📝 參與開發調查 (約需 1 分鐘) 🚀
                    </button>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <button onClick={() => router.push('/pricing')} style={{ background: 'transparent', color: '#38bdf8', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}>
                            查看訓練解鎖方案 ➔
                        </button>
                        <button onClick={() => router.push('/')} style={{ background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                            回到首頁
                        </button>
                    </div>
                </div>

            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulseBg { 0% { opacity: 0.1; } 100% { opacity: 0.3; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}