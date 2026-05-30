"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setMessage("密碼長度至少需要 6 位數");
            return;
        }

        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
        } else {
            setDone(true);
            // ✨ 完美重生儀式：2秒後自動跳轉到主幹道課程大廳
            setTimeout(() => {
                router.push("/courses");
            }, 2000);
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

                {!done ? (
                    <>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔑</div>
                        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "1rem", letterSpacing: "1px" }}>
                            設定新的聲音密碼
                        </h2>
                        <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "0.95rem" }}>
                            請輸入您全新對應的通行密鑰
                        </p>

                        <form onSubmit={handleUpdate}>
                            <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                    新密碼 (至少 6 位)
                                </label>
                                <input
                                    type="password"
                                    placeholder="請輸入新密碼"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
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
                                    background: "linear-gradient(135deg, #10b981, #38bdf8)",
                                    color: "#020617",
                                    fontWeight: "900",
                                    fontSize: "1rem",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
                                }}
                            >
                                {loading ? "更新中..." : "完成設定"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#34d399", marginBottom: "1rem" }}>重生完成</h2>
                        <p style={{ color: "#cbd5e1", lineHeight: '1.8', fontSize: "1rem" }}>
                            你已經重新取得你的聲音控制權。<br />
                            <span style={{ color: "#38bdf8" }}>正在帶你回到訓練場...</span>
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}