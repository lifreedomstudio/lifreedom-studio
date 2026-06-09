"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContactPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "3rem 1.5rem", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                {/* 返回按鈕 */}
                <button
                    onClick={() => router.push("/")}
                    style={{
                        background: "transparent",
                        color: "#94a3b8",
                        border: "1px solid #334155",
                        padding: "0.6rem 1.4rem",
                        borderRadius: "50px",
                        cursor: "pointer",
                        marginBottom: "2.5rem",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#64748b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                    ← 返回首頁 Back to Home
                </button>

                {/* Header */}
                <div style={{ marginBottom: "2.5rem" }}>
                    <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        🚀 LIFREEDOM SUPPORT
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "1rem", color: "#fff" }}>
                        聯絡我們 (Contact)
                    </h1>
                    <p style={{ color: "#cbd5e1", fontSize: "1.1rem", lineHeight: "1.8" }}>
                        如果你在使用 Lifreedom 時遇到任何問題、或有建議想法，我們很樂意聽你說。
                    </p>
                </div>

                {/* 💡 UX 加分：FAQ Shortcut (有效攔截不必要訊息與退款衝動) */}
                <div style={{ background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
                    <h3 style={{ color: '#fbbf24', fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🛑 在發送郵件前，您可以先查看：
                    </h3>
                    <ul style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li>關於扣款與退費資格，請先閱讀 <Link href="/refund" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>退款政策 (Refund Policy)</Link>。</li>
                        <li>關於帳號安全與平台規範，請參考 <Link href="/terms" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>使用條款 (Terms of Service)</Link>。</li>
                    </ul>
                </div>

                {/* Intro Card */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "2rem",
                    borderRadius: "16px",
                    marginBottom: "2.5rem"
                }}>
                    <p style={{ marginBottom: "1rem", color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>
                        💡 如果遇到以下情況，請隨時聯絡我們：
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", color: "#94a3b8", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>遇到 Bug、聲音無法播放或系統技術問題。</li>
                        <li>對聽覺訓練內容、AI 助理的回覆有疑問。</li>
                        <li>有很棒的功能建議或合作想法。</li>
                        <li>需要取消訂閱、退款或帳務協助。</li>
                    </ul>
                </div>

                {/* Email & 表單 雙通道區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

                    {/* 方式 1: 直接 Email */}
                    <div style={{ background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.2)", padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column" }}>
                        <h2 style={{ color: "#38bdf8", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📩 寄送 Email
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1rem" }}>直接發送郵件給客服團隊：</p>
                        <a href="mailto:xlifreedom305x@gmail.com" style={{ fontSize: "1.1rem", fontWeight: "900", color: "#fff", textDecoration: "none", borderBottom: "2px solid #38bdf8", paddingBottom: "2px", transition: "color 0.2s", alignSelf: "flex-start" }} onMouseOver={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseOut={(e) => e.currentTarget.style.color = '#fff'}>
                            xlifreedom305x@gmail.com
                        </a>
                        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.8rem", fontWeight: "bold" }}>
                            ⏱ 通常 24–48 小時內回覆
                        </p>

                        {/* 💡 關鍵升級：引導提供具體資訊以加速處理 */}
                        <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                            <div style={{ borderTop: "1px dashed rgba(56, 189, 248, 0.3)", paddingTop: "1rem" }}>
                                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0, lineHeight: "1.6" }}>
                                    <strong>加速處理小技巧：</strong><br />
                                    請在信件中簡單描述您的問題（例如：使用的裝置、瀏覽器、發生情境），我們可以更快幫助您 🙏
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 方式 2: 線上表單 (Tally) */}
                    <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h2 style={{ color: "#10b981", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📝 線上回饋表單 <span style={{ fontSize: "0.85rem", background: "#10b981", color: "#020617", padding: "2px 8px", borderRadius: "12px", marginLeft: "5px" }}>推薦</span>
                        </h2>
                        <p style={{ color: "#cbd5e1", lineHeight: "1.7", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                            適合回報問題、功能建議、或使用體驗。
                        </p>
                        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "2rem" }}>
                            利用表單分類，能幫助我們更快精準定位問題！
                        </p>

                        <Link href="/feedback" style={{ textDecoration: 'none', marginTop: "auto" }}>
                            <button
                                style={{
                                    background: "#10b981",
                                    color: "#020617",
                                    padding: "0.9rem 1.5rem",
                                    borderRadius: "999px",
                                    border: "none",
                                    fontWeight: "900",
                                    fontSize: "1.05rem",
                                    cursor: "pointer",
                                    width: "100%",
                                    transition: "all 0.2s",
                                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)"; }}
                            >
                                前往填寫回饋表單 ➔
                            </button>
                        </Link>
                    </div>

                </div>

                {/* Note / Footer */}
                <div style={{
                    fontSize: "0.85rem",
                    color: "#475569",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "2rem",
                    textAlign: "center",
                    fontFamily: "monospace"
                }}>
                    <div>Lifreedom — AI Ear Training for Musicians</div>
                    <div style={{ marginTop: "0.5rem" }}>© 2026 LiFreedom Studio. All rights reserved.</div>
                </div>

            </div>
        </div>
    );
}