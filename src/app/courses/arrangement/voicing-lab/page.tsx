"use client";
import React, { useState, useEffect } from "react";
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

                {/* 返回按鈕 */}
                <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    ⬅️ 返回總部地圖
                </button>

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

                {/* 🔥 新增：直接試玩 CTA */}
                <div style={{ marginTop: "4rem", textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', borderRadius: '24px', border: '2px solid #a78bfa', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)', width: '100%', maxWidth: '800px' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '1.5rem' }}>我想學會怎麼讓聲音變清楚，不再靠運氣</h2>
                    <button
                        onClick={() => router.push('/eq-game')}
                        style={{ width: '100%', maxWidth: '400px', padding: '1.2rem', background: '#a78bfa', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.4)', transition: 'transform 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🎮 直接試玩（不用學） ➔
                    </button>
                </div>

                {/* ⬇️ 極小化的意見回饋與返回首頁 */}
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#64748b', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#94a3b8'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                        ⬅️ 返回總部地圖
                    </button>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            onClick={() => router.push('/feedback')}
                            style={{ background: 'transparent', color: '#475569', border: 'none', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            💡 有意見或遇到 Bug？點此回報
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