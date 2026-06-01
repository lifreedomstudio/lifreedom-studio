"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// 💡 優化 1：直接將資料調整為「上高下低」的視覺順序，附帶頻寬佔用圖示
const slots = [
    { id: "high", label: "UPPER FLOOR (高頻區)", color: "#38bdf8", desc: "旋律線與點綴的挑高空間", bar: "██████" },
    { id: "mid", label: "MID FLOOR (中頻區)", color: "#facc15", desc: "和弦基底與人聲的主戰場", bar: "█████████████" },
    { id: "low", label: "GROUND FLOOR (低頻/基底區)", color: "#ef4444", desc: "Bass 與 大鼓 的專屬地盤", bar: "████████" },
];

// 💡 優化 2：封裝獨立元件解決 React 直接修改 DOM 的 UX Bug
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

export default function VoicingLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const [placed, setPlaced] = useState<Record<string, string>>({});
    const [selectedIns, setSelectedIns] = useState<string | null>(null);

    // 📊 產品級優化：Progress Memory 成長型統計狀態
    const [historyErrors, setHistoryErrors] = useState({ lowClash: 0, midCongested: 0 });
    const [hasCalculated, setHasCalculated] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, []);

    // 💡 優化 3：支援按鍵盤 ESC 取消選取樂器
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedIns(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // 💡 優化 4：再點擊一次已選取的樂器即可取消選取 (Deselect)
    const handleSelectInstrument = (id: string) => {
        if (selectedIns === id) {
            setSelectedIns(null);
        } else {
            setSelectedIns(id);
        }
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

    // 💡 優化 5：動態分數系統（非二元歸零，改採加扣分制）
    const getScoreDetails = () => {
        let currentScore = 0;
        let penalties = 0;
        let midCount = 0;
        let lowClashDetected = false;
        let midCongestedDetected = false;

        instruments.forEach((ins) => {
            const slot = placed[ins.id];
            if (!slot) return;

            // 正確配對積分
            if (ins.id === "guitar" && slot === "mid") currentScore++;
            if (ins.id === "piano" && slot === "high") currentScore++;
            if (ins.id === "synth" && slot === "high") currentScore++;

            // 致命低頻車禍懲罰：一個扣 2 分
            if (slot === "low") {
                penalties += 2;
                lowClashDetected = true;
            }
            if (slot === "mid") midCount++;
        });

        // 中頻擁擠懲罰
        if (midCount >= 2) {
            penalties += 1;
            midCongestedDetected = true;
        }

        const finalScore = Math.max(0, currentScore - penalties);
        return { finalScore, lowClashDetected, midCongestedDetected };
    };

    const { finalScore, lowClashDetected, midCongestedDetected } = getScoreDetails();
    const allPlaced = instruments.every((i) => placed[i.id]);
    const isFreeze = allPlaced && finalScore === 3; // 滿分時鎖定操作

    // 📊 異步記錄錯誤軌跡 (記憶成長系統)
    useEffect(() => {
        if (allPlaced && !hasCalculated) {
            setHistoryErrors(prev => ({
                lowClash: prev.lowClash + (lowClashDetected ? 1 : 0),
                midCongested: prev.midCongested + (midCongestedDetected ? 1 : 0)
            }));
            setHasCalculated(true);
        }
    }, [allPlaced, finalScore]);

    // 💡 優化 6：非機械化判定，改為「提示型」擁擠度 UI
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

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "2.5rem" }}>

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

                        {/* 📊 成長型大腦小面板面板 (Progress Memory) */}
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

                                                {/* 💡 優化 7：增加視覺頻譜，彰顯「頻寬佔用感」 */}
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

                {/* 🔥 RESULT 反饋 */}
                {allPlaced && (
                    <div style={{
                        marginTop: "4rem", padding: isMobile ? "2rem 1.5rem" : "3rem", borderRadius: "24px", animation: "fadeInUp 0.5s ease",
                        background: finalScore === 3 ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                        border: finalScore === 3 ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "0.5rem", fontWeight: "bold" }}>當前決策評分</div>
                            <div style={{ fontSize: "3.5rem", fontWeight: "900", color: finalScore === 3 ? "#10b981" : "#facc15", marginBottom: "1.5rem" }}>
                                {finalScore} <span style={{ fontSize: "1.5rem", color: "#475569" }}>/ 3 分</span>
                            </div>

                            {finalScore === 3 ? (
                                <>
                                    <h2 style={{ color: "#10b981", fontSize: "1.8rem", margin: "0 0 1rem 0", fontWeight: 900 }}>🎯 完美空間編配！布局已鎖定</h2>
                                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
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

                        {/* CTA - 滿分過關 */}
                        {finalScore === 3 && (
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2.5rem", marginTop: "2.5rem", textAlign: "center" }}>
                                <p style={{ color: "#fca311", fontWeight: "bold", letterSpacing: "2px", fontSize: "0.9rem", marginBottom: "1.5rem" }}>NEXT CHAPTER</p>
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
                                    🚀 前往下一章：Masking 頻率遮蔽 ➔
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulseBg { 0% { opacity: 0.1; } 100% { opacity: 0.3; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}