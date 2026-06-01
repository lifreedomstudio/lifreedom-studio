"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Instrument = {
    id: string;
    name: string;
    role: string;
    icon: string;
};

const instruments: Instrument[] = [
    { id: "guitar", name: "Rhythm Guitar", icon: "🎸", role: "mid" },
    { id: "piano", name: "Grand Piano", icon: "🎹", role: "mid-high" },
    { id: "synth", name: "Lead Synth", icon: "🎛", role: "high" },
];

const slots = [
    { id: "low", label: "GROUND FLOOR (低頻/基底區)", color: "#ef4444", desc: "Bass與大鼓的地盤" },
    { id: "mid", label: "MID FLOOR (中頻區)", color: "#facc15", desc: "節奏樂器與人聲的主戰場" },
    { id: "high", label: "UPPER FLOOR (高頻區)", color: "#38bdf8", desc: "高音點綴與空氣感" },
];

export default function VoicingLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 狀態管理：記錄樂器放在哪層樓
    const [placed, setPlaced] = useState<Record<string, string>>({});
    // 狀態管理：目前被選中的樂器（準備被放入樓層）
    const [selectedIns, setSelectedIns] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // 點擊樂器庫中的樂器
    const handleSelectInstrument = (id: string) => {
        setSelectedIns(id);
    };

    // 點擊樓層，將選中的樂器放入，或將已放入的樂器移出
    const handleSlotClick = (slotId: string) => {
        if (selectedIns) {
            // 放進去
            setPlaced((prev) => ({ ...prev, [selectedIns]: slotId }));
            setSelectedIns(null); // 放完後取消選取
        }
    };

    // 點擊已放置的樂器，將其移回庫存
    const handleRemoveInstrument = (insId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // 避免觸發樓層的點擊事件
        setPlaced((prev) => {
            const newPlaced = { ...prev };
            delete newPlaced[insId];
            return newPlaced;
        });
    };

    const getScore = () => {
        let score = 0;
        instruments.forEach((ins) => {
            const slot = placed[ins.id];
            if (!slot) return;
            // 判斷邏輯：Guitar 在 mid，Piano 和 Synth 要錯開，這裡設定 Piano 和 Synth 都可以去 high
            if (ins.id === "guitar" && slot === "mid") score++;
            if (ins.id === "piano" && slot === "high") score++;
            if (ins.id === "synth" && slot === "high") score++;
        });
        return score;
    };

    const allPlaced = instruments.every((i) => placed[i.id]);

    // 檢查是否有樓層過度擁擠 (大於等於2個樂器)
    const checkCongestion = (slotId: string) => {
        const count = Object.values(placed).filter(v => v === slotId).length;
        return count >= 2;
    };

    const resetLab = () => {
        setPlaced({});
        setSelectedIns(null);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#020617",
            color: "#f8fafc",
            padding: isMobile ? "2rem 1rem" : "4rem 2rem",
            fontFamily: "sans-serif",
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{ maxWidth: "900px", width: "100%" }}>

                {/* 🧠 HEADER */}
                <header style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{
                        color: "#a78bfa", letterSpacing: "4px", fontWeight: "bold", marginBottom: "1rem"
                    }}>
                        VOICING REPAIR LAB
                    </div>

                    <h1 style={{ fontSize: isMobile ? "2rem" : "3rem", fontWeight: 900, margin: "0 0 1rem 0" }}>
                        空間分配實驗室
                    </h1>

                    <p style={{ color: "#cbd5e1", marginTop: "1rem", lineHeight: 1.6, fontSize: "1.1rem" }}>
                        這三個樂器原本擠在同一個房間，請把它們分配到對的樓層。<br />
                        <strong style={{ color: "#fff" }}>👉 點擊選擇樂器 ➔ 點擊樓層放入。</strong>
                    </p>
                </header>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "2.5rem" }}>

                    {/* 🎼 樂器庫 */}
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ marginBottom: "1.5rem", color: "#facc15", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>📋</span> 待分配樂器
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {instruments.map((ins) => {
                                const isPlaced = !!placed[ins.id];
                                const isSelected = selectedIns === ins.id;

                                if (isPlaced) return null; // 如果已經放好了就不顯示在庫存

                                return (
                                    <button
                                        key={ins.id}
                                        onClick={() => handleSelectInstrument(ins.id)}
                                        style={{
                                            padding: "1.2rem", background: isSelected ? "rgba(250, 204, 21, 0.2)" : "#0f172a",
                                            border: isSelected ? "2px solid #facc15" : "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "15px",
                                            transition: "all 0.2s", textAlign: "left", transform: isSelected ? "scale(1.02)" : "scale(1)"
                                        }}
                                    >
                                        <div style={{ fontSize: "2rem" }}>{ins.icon}</div>
                                        <div>
                                            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>{ins.name}</div>
                                            <div style={{ color: isSelected ? "#fef08a" : "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
                                                {isSelected ? "準備移入樓層..." : "點擊選取"}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {Object.keys(placed).length === instruments.length && (
                                <div style={{ color: "#10b981", textAlign: "center", padding: "2rem 0", fontWeight: "bold" }}>
                                    ✨ 所有樂器皆已移出
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 🏢 頻率樓層 */}
                    <div style={{ flex: 1.2 }}>
                        <h3 style={{ marginBottom: "1.5rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>🏢</span> 頻譜空間大廈
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* 反轉陣列，讓 High 在最上面 */}
                            {[...slots].reverse().map((slot) => {
                                const isCongested = checkCongestion(slot.id);
                                const isTargetable = selectedIns !== null;

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
                                        {/* 警告動畫背景 */}
                                        {isCongested && (
                                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(239, 68, 68, 0.1)", zIndex: 0, animation: "pulseBg 1s infinite alternate" }} />
                                        )}

                                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <div style={{ color: slot.color, fontWeight: 900, letterSpacing: "1px", marginBottom: "4px" }}>
                                                    {slot.label}
                                                </div>
                                                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{slot.desc}</div>
                                            </div>

                                            {isCongested && (
                                                <div style={{ background: "#ef4444", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                                    ⚠️ 擁擠
                                                </div>
                                            )}
                                        </div>

                                        {/* 放置的樂器 */}
                                        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px", position: "relative", zIndex: 1 }}>
                                            {Object.entries(placed)
                                                .filter(([_, v]) => v === slot.id)
                                                .map(([k]) => {
                                                    const ins = instruments.find(i => i.id === k);
                                                    return (
                                                        <div key={k} onClick={(e) => handleRemoveInstrument(k, e)} style={{
                                                            padding: "8px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                                                            borderRadius: "50px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
                                                            transition: "background 0.2s"
                                                        }} onMouseOver={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                                                            <span>{ins?.icon}</span>
                                                            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{ins?.name}</span>
                                                            <span style={{ color: "#ef4444", fontSize: "0.8rem", marginLeft: "4px" }}>✕</span>
                                                        </div>
                                                    );
                                                })}
                                            {isTargetable && !isCongested && Object.values(placed).filter(v => v === slot.id).length === 0 && (
                                                <div style={{ color: slot.color, opacity: 0.5, fontSize: "0.9rem", fontStyle: "italic", marginTop: "10px", width: "100%", textAlign: "center" }}>
                                                    點擊放置於此
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 🔥 RESULT 診斷回饋 */}
                {allPlaced && (
                    <div style={{
                        marginTop: "4rem", padding: isMobile ? "2rem 1.5rem" : "3rem", borderRadius: "24px", animation: "fadeInUp 0.5s ease",
                        background: getScore() === 3 ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                        border: getScore() === 3 ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                        textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}>
                        {getScore() === 3 ? (
                            <>
                                <h2 style={{ color: "#10b981", fontSize: "2rem", margin: "0 0 1rem 0", fontWeight: 900 }}>🎯 完美空間分配！</h2>
                                <p style={{ color: "#cbd5e1", fontSize: "1.1rem", lineHeight: 1.6, margin: "0 0 2rem 0" }}>
                                    你成功讓吉他穩住中頻，並把鋼琴和合成器推向高樓層。<br />
                                    現在，每個樂器都不需要競爭，你的混音將會非常乾淨立體。
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 style={{ color: "#ef4444", fontSize: "2rem", margin: "0 0 1rem 0", fontWeight: 900 }}>⚠️ 產生頻率遮蔽</h2>
                                <p style={{ color: "#cbd5e1", fontSize: "1.1rem", lineHeight: 1.6, margin: "0 0 2rem 0" }}>
                                    有樂器擠在同一個樓層了！<br />
                                    記住：吉他通常負責中頻節奏，而鋼琴或合成器旋律應該利用八度音 (Octave Up) 移往高頻空間。
                                </p>
                                <button onClick={resetLab} style={{ background: "transparent", color: "#fca5a5", border: "1px dashed #ef4444", padding: "10px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: "bold" }}>
                                    🔄 重新分配
                                </button>
                            </>
                        )}

                        {/* CTA - 成功後顯示 */}
                        {getScore() === 3 && (
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2.5rem" }}>
                                <p style={{ color: "#fca311", fontWeight: "bold", letterSpacing: "2px", fontSize: "0.9rem", marginBottom: "1.5rem" }}>NEXT CHALLENGE</p>
                                <button
                                    onClick={() => router.push("/courses/arrangement/masking-intro")}
                                    style={{
                                        padding: isMobile ? "1.2rem 2rem" : "1.2rem 4rem", borderRadius: "50px", border: "none",
                                        background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff",
                                        fontWeight: 900, fontSize: "1.2rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)",
                                        transition: "transform 0.2s", width: isMobile ? "100%" : "auto"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    🚀 進入下一章：Masking 遮蔽效應 ➔
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulseBg { 0% { opacity: 0.3; } 100% { opacity: 0.8; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}