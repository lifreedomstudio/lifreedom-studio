"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f8fafc",
        fontFamily: "sans-serif",
        padding: isMobile ? "2rem 1rem" : "4rem 2rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* ================= HERO ================= */}
        <section style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h1
            style={{
              fontSize: isMobile ? "2.2rem" : "3.5rem",
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            你每天都在聽音樂，
            <br />
            但你真的<span style={{ color: "#38bdf8" }}>「聽懂」了嗎？</span>
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.2rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            多數人聽到的是「感覺」<br />
            但創作者聽到的是「結構、空間、能量」
            <br />
            <br />
            這裡會帶你跨過那條線。
          </p>

          <button
            onClick={() => router.push("/step0")}
            style={{
              padding: "1.4rem 3rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #38bdf8, #2563eb)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(56,189,248,0.4)",
            }}
          >
            🎮 開始第一個聽覺挑戰（免費）
          </button>
        </section>

        {/* ================= STEP 0 引導 ================= */}
        <section
          style={{
            marginBottom: "5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "24px",
            padding: isMobile ? "2rem" : "3rem",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
            👉 你真的聽得出差別嗎？
          </h2>

          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            兩段幾乎一樣的音樂，
            <br />
            只有一個地方不同。
            <br />
            <br />
            你能聽出來嗎？
          </p>

          <button
            onClick={() => router.push("/step0")}
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              borderRadius: "12px",
              border: "1px solid #38bdf8",
              background: "transparent",
              color: "#38bdf8",
              cursor: "pointer",
            }}
          >
            試試看 →
          </button>
        </section>

        {/* ================= 系統介紹 ================= */}
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
            這不是一堂混音課
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            這是一套「訓練你聽覺判斷能力」的系統
          </p>

          <ul style={{ lineHeight: 2, fontSize: "1.1rem" }}>
            <li>✔ 聽出差異（不是猜）</li>
            <li>✔ 理解聲音（不是感覺）</li>
            <li>✔ 做出選擇（不是亂試）</li>
          </ul>
        </section>

        {/* ================= 痛點 ================= */}
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
            你可能遇過這些狀況
          </h2>

          <div style={{ color: "#fca5a5", lineHeight: 2 }}>
            <p>👉 覺得哪裡怪，但說不出來</p>
            <p>👉 調整很多，但不知道差在哪</p>
            <p>👉 做出來的東西總覺得不穩定</p>
          </div>

          <p style={{ marginTop: "2rem", color: "#94a3b8" }}>
            問題不是你不夠努力，
            <br />
            是你還沒有「聽的系統」。
          </p>
        </section>

        {/* ================= AI 區（降權） ================= */}
        <section
          style={{
            marginBottom: "5rem",
            padding: isMobile ? "2rem" : "3rem",
            borderRadius: "24px",
            background: "rgba(56,189,248,0.05)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
            AI 不是答案，但它可以幫助你
          </h2>

          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            當你開始「聽得出來」之後，
            <br />
            你才會知道 AI 該怎麼幫你。
            <br />
            <br />
            👉 我們提供輔助分析工具
            <br />
            👉 但真正的判斷，來自你自己的耳朵
          </p>
        </section>

        {/* ================= CTA ================= */}
        <section style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
            開始訓練你的耳朵
          </h2>

          <button
            onClick={() => router.push("/step0")}
            style={{
              padding: "1.4rem 3rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            🚀 立即開始
          </button>
        </section>
      </div>
    </div>
  );
}