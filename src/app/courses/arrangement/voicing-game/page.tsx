"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function FrequencyClashGamePage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const [stage, setStage] = useState<"intro" | "play" | "answer" | "reveal">("intro");
    const [selected, setSelected] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ▶️ 開始播放混亂音 (解決 Safari Autoplay 阻擋問題)
    const startChaos = () => {
        setStage("play");
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.volume = 0.8;
                audioRef.current.play().catch(e => console.error("Audio block:", e));
            }
        }, 50);
    };

    // 🛑 玩家主動停止混亂
    const stopChaosAndAnswer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setStage("answer");
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
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{ maxWidth: "800px", width: "100%" }}>

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
                            style={{
                                marginTop: "3rem",
                                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                                border: "none",
                                padding: "1.2rem 3.5rem",
                                borderRadius: "50px",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                boxShadow: "0 10px 30px rgba(56,189,248,0.3)",
                                transition: "transform 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            ▶ 進入混亂測試
                        </button>
                    </section>
                )}

                {/* 🔊 CHAOS MODE */}
                {stage === "play" && (
                    <section style={{ textAlign: "center", animation: "fadeIn 0.3s ease" }}>
                        <h2 style={{ color: "#ef4444", fontWeight: 900, fontSize: "2.5rem", letterSpacing: "2px", animation: "pulseText 0.5s infinite alternate" }}>
                            ⚠️ SYSTEM OVERLOAD
                        </h2>

                        <p style={{ color: "#cbd5e1", marginTop: "1rem", fontSize: "1.2rem" }}>
                            木吉他、電吉他、鋼琴 正在爭奪同一個空間...
                        </p>

                        {/* 強化版：錯落有致的 Glitch 視覺 */}
                        <div style={{
                            marginTop: "4rem",
                            marginBottom: "4rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "6px",
                            height: "80px"
                        }}>
                            {[...Array(24)].map((_, i) => (
                                <div key={i} style={{
                                    width: "8px",
                                    height: "20px",
                                    background: i % 3 === 0 ? "#ef4444" : i % 2 === 0 ? "#f97316" : "#fca311",
                                    borderRadius: "4px",
                                    animation: `glitchBar 0.4s infinite alternate`,
                                    animationDelay: `${Math.random() * 0.5}s` // 隨機延遲製造混亂感
                                }} />
                            ))}
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

                        <audio
                            ref={audioRef}
                            src="/audio/voicing-clash.mp3"
                            loop
                        />
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
                                { key: "C", text: "頻率空間重疊了" } // 🚨 移除了「(正解)」
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

                {/* 🔥 REVEAL */}
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

                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
                            <p style={{ marginTop: 0, fontSize: "1.2rem", lineHeight: 1.8, color: "#cbd5e1" }}>
                                ❌ 不是因為某個樂器太大聲<br />
                                ❌ 更不是因為節奏沒有對準<br /><br />

                                真正的兇手是：<strong style={{ color: "#38bdf8", fontSize: "1.3rem" }}>「頻率空間重疊」</strong>。<br /><br />

                                你剛剛聽到的「糊」，就是所有中頻樂器（吉他、鋼琴、合成器）都在搶同一個樓層。<br />
                                <strong style={{ color: "#fff" }}>不解決這個問題，用再多 EQ 也是白費力氣。</strong>
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/courses/arrangement/voicing-theory")}
                            style={{
                                marginTop: "3rem",
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

            {/* 🎨 animations */}
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
                    from { transform: scaleY(0.2); opacity: 0.4; }
                    to { transform: scaleY(1.8); opacity: 1; }
                }
                `
            }} />
        </div>
    );
}