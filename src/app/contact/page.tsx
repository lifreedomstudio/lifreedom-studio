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

                {/* Email & Response Time 整合區塊 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

                    <div style={{ background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.2)", padding: "2rem", borderRadius: "16px" }}>
                        <h2 style={{ color: "#38bdf8", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📩 聯絡信箱
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1rem" }}>請將您的需求寄至此信箱：</p>
                        <a href="mailto:xlifreedom305x@gmail.com" style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fff", textDecoration: "none", borderBottom: "2px solid #38bdf8", paddingBottom: "2px", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseOut={(e) => e.currentTarget.style.color = '#fff'}>
                            xlifreedom305x@gmail.com
                        </a>
                    </div>

                    <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2rem", borderRadius: "16px" }}>
                        <h2 style={{ color: "#10b981", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ⏱ 預期回覆時間
                        </h2>
                        <p style={{ color: "#cbd5e1", lineHeight: "1.7", fontSize: "0.95rem", margin: 0 }}>
                            我們通常會在 <strong style={{ color: "#fff" }}>24–48 小時內</strong> 回覆您的訊息。<br />
                            在 Early Access 階段，回覆時間可能會略有波動，感謝您的耐心等候 🙏
                        </p>
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