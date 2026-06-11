"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function FrequencyClashGamePage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const [stage, setStage] = useState<"intro" | "play" | "answer" | "reveal">("intro");
    const [selected, setSelected] = useState<string | null>(null);
    const [activeTrack, setActiveTrack] = useState<'clash' | 'fixed'>('clash');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Web Audio API Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const clashBufferRef = useRef<AudioBuffer | null>(null);
    const fixedBufferRef = useRef<AudioBuffer | null>(null);
    const clashSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const fixedSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const clashGainRef = useRef<GainNode | null>(null);
    const fixedGainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // 載入音檔
    useEffect(() => {
        const loadAudio = async () => {
            setIsLoading(true);
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;

            try {
                const [resClash, resFixed] = await Promise.all([
                    fetch('/audio/voicing-clash.mp3'),
                    fetch('/audio/voicing-fixed.mp3')
                ]);
                const [bufClash, bufFixed] = await Promise.all([
                    resClash.arrayBuffer(),
                    resFixed.arrayBuffer()
                ]);
                clashBufferRef.current = await ctx.decodeAudioData(bufClash);
                fixedBufferRef.current = await ctx.decodeAudioData(bufFixed);
            } catch (error) {
                console.error("Audio Decode Error:", error);
            }
            setIsLoading(false);
        };
        loadAudio();
    }, []);

    // 🛑 核心安全修正：徹底停止音訊並銷毀節點，防止背景空轉與洩漏
    const stopAudio = () => {
        if (clashSourceRef.current) {
            try { clashSourceRef.current.stop(); } catch (e) { }
            clashSourceRef.current.disconnect();
            clashSourceRef.current = null;
        }
        if (fixedSourceRef.current) {
            try { fixedSourceRef.current.stop(); } catch (e) { }
            fixedSourceRef.current.disconnect();
            fixedSourceRef.current = null;
        }
        setIsPlaying(false);
    };

    // 🚨 核心生命週期修正：當元件卸載、離開頁面時，全自動切斷電源、釋放系統時鐘
    useEffect(() => {
        return () => {
            stopAudio();
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const playAudio = async () => {
        if (!clashBufferRef.current || !fixedBufferRef.current) return;
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (ctx.state === 'suspended') await ctx.resume();

        // 建立新節點前，先徹底清理舊的殘留
        stopAudio();

        clashSourceRef.current = ctx.createBufferSource();
        fixedSourceRef.current = ctx.createBufferSource();
        clashSourceRef.current.buffer = clashBufferRef.current;
        fixedSourceRef.current.buffer = fixedBufferRef.current;
        clashSourceRef.current.loop = true;
        fixedSourceRef.current.loop = true;

        clashGainRef.current = ctx.createGain();
        fixedGainRef.current = ctx.createGain();

        clashGainRef.current.gain.value = activeTrack === 'clash' ? 1 : 0;
        fixedGainRef.current.gain.value = activeTrack === 'fixed' ? 1 : 0;

        clashSourceRef.current.connect(clashGainRef.current).connect(ctx.destination);
        fixedSourceRef.current.connect(fixedGainRef.current).connect(ctx.destination);

        const startTime = ctx.currentTime + 0.05;
        clashSourceRef.current.start(startTime);
        fixedSourceRef.current.start(startTime);

        setIsPlaying(true);
    };

    // ▶️ 開始播放混亂音
    const startChaos = () => {
        setStage("play");
        setActiveTrack('clash');
        playAudio();
    };

    // 🛑 玩家主動停止混亂（直接切斷，不使用會殘留的 suspend）
    const stopChaosAndAnswer = () => {
        stopAudio();
        setStage("answer");
    };

    // 🎚️ 結算頁面的無縫切換
    const switchTrack = async (track: 'clash' | 'fixed') => {
        setActiveTrack(track);

        // 如果目前不是播放狀態，點擊切換直接啟動播放
        if (!isPlaying) {
            await playAudio();
            return;
        }

        if (clashGainRef.current && fixedGainRef.current && audioCtxRef.current) {
            const now = audioCtxRef.current.currentTime;
            clashGainRef.current.gain.setTargetAtTime(track === 'clash' ? 1 : 0, now, 0.02);
            fixedGainRef.current.gain.setTargetAtTime(track === 'fixed' ? 1 : 0, now, 0.02);
        }
    };

    const reveal = () => {
        setStage("reveal");
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#020617",
            color: "#f8fafc",
            padding: isMobile ? "2rem 1rem" : "4rem 2rem",
            fontFamily: "sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <div style={{ maxWidth: "800px", width: "100%", flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                {/* 🧠 INTRO */}
                {stage === "intro" && (
                    <section style={{ textAlign: "center", animation: "fadeIn 0.6s ease" }}>
                        <div style={{
                            color: "#38bdf8",
                            letterSpacing: "4px",
                            fontWeight: "bold",
                            marginBottom: "1rem"
                        }}>
                            FREQUENCY CLASH SIMULATION
                        </div>

                        <h1 style={{ fontSize: isMobile ? "2.2rem" : "3rem", fontWeight: 900 }}>
                            🎧 你能讓這段音樂<br style={{ display: isMobile ? "block" : "none" }} />不糊掉嗎？
                        </h1>

                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "16px", marginTop: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <p style={{ color: "#cbd5e1", margin: 0, lineHeight: 1.8, fontSize: "1.1rem" }}>
                                接下來，你將聽到一段「所有樂器都在對的時間」的編曲。<br /><br />
                                聽起來應該很完美對吧？<br />
                                <strong style={{ color: "#fca311" }}>但請戴上耳機，親自感受一下「聲音的車禍現場」。</strong>
                            </p>
                        </div>

                        <button
                            onClick={startChaos}
                            disabled={isLoading}
                            style={{
                                marginTop: "3rem",
                                background: isLoading ? "#1e293b" : "linear-gradient(135deg, #38bdf8, #2563eb)",
                                border: "none",
                                padding: "1.2rem 3.5rem",
                                borderRadius: "50px",
                                color: isLoading ? "#94a3b8" : "#fff",
                                fontWeight: 900,
                                fontSize: "1.2rem",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                boxShadow: isLoading ? "none" : "0 10px 30px rgba(56,189,248,0.3)",
                                transition: "transform 0.2s"
                            }}
                            onMouseOver={e => !isLoading && (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={e => !isLoading && (e.currentTarget.style.transform = "scale(1)")}
                        >
                            {isLoading ? '⏳ 載入高音質測試檔中...' : '▶ 進入混亂測試'}
                        </button>
                    </section>
                )}

                {/* 🔊 CHAOS MODE */}
                {stage === "play" && (
                    <section style={{ textAlign: "center", animation: "fadeIn 0.3s ease" }}>
                        <h2 style={{ color: "#ef4444", fontWeight: 900, fontSize: "2.5rem", letterSpacing: "2px", animation: "pulseText 0.5s infinite alternate" }}>
                            ⚠️ MID RANGE OVERLOAD
                        </h2>

                        <p style={{ color: "#cbd5e1", marginTop: "1rem", fontSize: "1.2rem" }}>
                            木吉他、電吉他、鋼琴 正在爭奪同一個空間...
                        </p>

                        <div style={{
                            margin: "3rem auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            gap: "4px",
                            height: "120px",
                            padding: "1rem",
                            background: "rgba(239, 68, 68, 0.05)",
                            borderRadius: "16px",
                            border: "1px dashed rgba(239, 68, 68, 0.3)",
                            maxWidth: "400px"
                        }}>
                            {[...Array(6)].map((_, i) => <div key={`low-${i}`} style={{ width: "12px", height: `${20 + Math.random() * 20}px`, background: "#3b82f6", borderRadius: "2px", opacity: 0.5 }} />)}
                            {[...Array(12)].map((_, i) => <div key={`mid-${i}`} style={{ width: "14px", height: `${80 + Math.random() * 40}px`, background: "#ef4444", borderRadius: "2px", animation: "glitchBar 0.3s infinite alternate", animationDelay: `${Math.random() * 0.2}s`, boxShadow: "0 0 10px rgba(239,68,68,0.5)" }} />)}
                            {[...Array(6)].map((_, i) => <div key={`high-${i}`} style={{ width: "12px", height: `${15 + Math.random() * 25}px`, background: "#10b981", borderRadius: "2px", opacity: 0.5 }} />)}
                        </div>

                        <button
                            onClick={stopChaosAndAnswer}
                            style={{
                                background: "transparent",
                                border: "2px solid #ef4444",
                                color: "#fca5a5",
                                padding: "1rem 2.5rem",
                                borderRadius: "50px",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fca5a5"; }}
                        >
                            聽夠了，停止測試 ➔
                        </button>
                    </section>
                )}

                {/* ❓ QUESTION */}
                {stage === "answer" && (
                    <section style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
                        <h2 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "2rem" }}>
                            你覺得問題出在哪裡？
                        </h2>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            maxWidth: "500px",
                            margin: "0 auto"
                        }}>
                            {[
                                { key: "A", text: "某個樂器音量太大了" },
                                { key: "B", text: "節奏沒有對準 (Groove 問題)" },
                                { key: "C", text: "頻率空間重疊了" }
                            ].map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => setSelected(opt.key)}
                                    style={{
                                        padding: "1.2rem",
                                        borderRadius: "16px",
                                        border: selected === opt.key ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                                        background: selected === opt.key ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)",
                                        color: selected === opt.key ? "#fff" : "#cbd5e1",
                                        fontSize: "1.1rem",
                                        fontWeight: selected === opt.key ? "bold" : "normal",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <span style={{ color: selected === opt.key ? "#38bdf8" : "#64748b", marginRight: "10px", fontWeight: "bold" }}>{opt.key}.</span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>

                        {selected && (
                            <div style={{ animation: "fadeInUp 0.4s" }}>
                                <button
                                    onClick={reveal}
                                    style={{
                                        marginTop: "3rem",
                                        padding: "1.2rem 4rem",
                                        borderRadius: "50px",
                                        border: "none",
                                        fontWeight: 900,
                                        fontSize: "1.2rem",
                                        cursor: "pointer",
                                        background: "#38bdf8",
                                        color: "#020617",
                                        boxShadow: "0 10px 20px rgba(56, 189, 248, 0.3)"
                                    }}
                                >
                                    看診斷結果
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* 🔥 REVEAL & A/B TEST */}
                {stage === "reveal" && (
                    <section style={{ textAlign: "center", animation: "fadeIn 0.6s ease" }}>

                        {selected === 'C' ? (
                            <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>🎯 完全正確！你突破盲點了。</div>
                        ) : (
                            <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>❌ 這一次，不是音量或節奏的問題。</div>
                        )}

                        <h1 style={{ fontWeight: 900, color: "#fca311", fontSize: isMobile ? "2rem" : "2.8rem", margin: "0 0 2rem 0" }}>
                            真相不是「混音技術」不夠
                        </h1>

                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
                            <p style={{ marginTop: 0, fontSize: "1.1rem", lineHeight: 1.8, color: "#cbd5e1", marginBottom: 0 }}>
                                真正的兇手是：<strong style={{ color: "#38bdf8", fontSize: "1.2rem" }}>「頻率空間重疊」</strong>。<br /><br />
                                你剛剛聽到的「糊」，就是所有中頻樂器（吉他、鋼琴、合成器）都在搶同一個樓層。<br />
                                不解決這個問題，用再多 EQ 也是白費力氣。
                            </p>
                        </div>

                        {/* 🎧 A/B 對照面板 */}
                        <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(16, 185, 129, 0.2)", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
                            <h3 style={{ color: "#10b981", margin: "0 0 1.5rem 0", fontSize: "1.2rem" }}>✨ 親耳驗證：空間分配的力量</h3>
                            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1.5rem" }}>我們把原本的樂器分別移動到高低八度 (Octave) 與不同的節奏空隙，<strong style={{ color: "#fff" }}>音量完全沒變</strong>，聽聽看差異：</p>

                            <div style={{ display: "flex", background: "#020617", borderRadius: "50px", padding: "6px", border: "1px solid #334155", marginBottom: "1rem" }}>
                                <button
                                    onClick={() => switchTrack('clash')}
                                    style={{
                                        flex: 1, padding: "1rem", borderRadius: "50px", border: "none", fontWeight: "900", fontSize: "1.1rem", cursor: "pointer", transition: "all 0.2s",
                                        background: activeTrack === 'clash' && isPlaying ? '#ef4444' : 'transparent', color: activeTrack === 'clash' && isPlaying ? '#fff' : '#64748b'
                                    }}
                                >
                                    👈 聽撞車版 (Chaos)
                                </button>
                                <button
                                    onClick={() => switchTrack('fixed')}
                                    style={{
                                        flex: 1, padding: "1rem", borderRadius: "50px", border: "none", fontWeight: "900", fontSize: "1.1rem", cursor: "pointer", transition: "all 0.2s",
                                        background: activeTrack === 'fixed' && isPlaying ? '#10b981' : 'transparent', color: activeTrack === 'fixed' && isPlaying ? '#fff' : '#64748b'
                                    }}
                                >
                                    聽修正版 (Voiced) 👉
                                </button>
                            </div>

                            {/* 🛠️ 修正 3：加入結算頁面專屬的「手動停止播放」控制鈕 */}
                            <div style={{ minHeight: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {isPlaying ? (
                                    <button
                                        onClick={stopAudio}
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #475569", color: "#94a3b8", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
                                    >
                                        ⏹️ 停止播放比對
                                    </button>
                                ) : (
                                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        💡 點擊上方任一版本即可重新啟動無縫切換
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                stopAudio(); // 離開前徹底清理，防止背景空轉
                                router.push("/courses/arrangement/voicing-theory");
                            }}
                            style={{
                                marginTop: "1rem",
                                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                color: "#fff",
                                border: "none",
                                padding: "1.2rem 3rem",
                                borderRadius: "50px",
                                fontSize: "1.2rem",
                                fontWeight: 900,
                                cursor: "pointer",
                                boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)",
                                transition: "transform 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            🚀 進入 Voicing 世界：分配樓層 ➔
                        </button>
                    </section>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseText {
                    from { opacity: 0.6; text-shadow: none; }
                    to { opacity: 1; text-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
                }
                @keyframes glitchBar {
                    from { transform: scaleY(0.5); opacity: 0.6; }
                    to { transform: scaleY(1.5); opacity: 1; }
                }
                `
            }} />
        </div>
    );
}