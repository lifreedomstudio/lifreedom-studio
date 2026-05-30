"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // 💡 自動動態偵測當前網域 (本地或生產環境)，防止硬編碼 redirectTo 導致崩潰
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${baseUrl}/update-password`,
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
        } else {
            setSent(true);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "1rem"
        }}>
            <div className="glass-panel" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "2.5rem 2rem",
                borderRadius: "24px",
                background: "rgba(30,41,59,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center"
            }}>

                {!sent ? (
                    <>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎧</div>
                        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "1rem", letterSpacing: "1px" }}>
                            找回你的聲音通行證
                        </h2>

                        <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: "1.6" }}>
                            輸入你的 Email<br />
                            我們會帶你回到聲音的世界
                        </p>

                        <form onSubmit={handleReset}>
                            <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                    電子信箱
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.8rem 1rem",
                                        borderRadius: "10px",
                                        background: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "white",
                                        fontSize: "1rem"
                                    }}
                                />
                            </div>

                            {message && (
                                <div style={{ color: "#f87171", marginBottom: "1rem", fontSize: "0.875rem" }}>
                                    ⚠️ {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #38bdf8, #10b981)",
                                    color: "#020617",
                                    fontWeight: "900",
                                    fontSize: "1rem",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    boxShadow: "0 4px 15px rgba(56, 189, 248, 0.2)"
                                }}
                            >
                                {loading ? "發送中..." : "寄送重設信"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
                        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "1rem" }}>已成功寄出</h2>
                        <p style={{ color: "#cbd5e1", lineHeight: "1.8", fontSize: "1rem", marginBottom: "2rem" }}>
                            去信箱看看吧！<br />
                            有一封來自 <span style={{ color: "#38bdf8", fontWeight: "bold" }}>Lifreedom</span> 的專屬引導信件。
                        </p>
                        <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}>
                            ← 返回登入
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}