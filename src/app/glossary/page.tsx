"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase'; // 根據你的環境決定是否取消註解

// 📖 混音魔導書：終極字彙庫 (加入 example 欄位)
const DICTIONARY = [
    // --- 第一卷：DAW 基礎與錄音 ---
    {
        term: "BPM",
        type: "基礎與錄音",
        desc: "歌曲心跳速度。數字越大越快，流行樂通常在 80-120 之間。",
        example: "就像你跑步的步伐頻率。EDM 舞曲的 BPM 大約是快跑 (128)，而抒情歌則是散步 (70)。"
    },
    // --- 第二卷：物理與聲學 ---
    {
        term: "Phase (相位)",
        type: "物理與聲學",
        desc: "聲波的時間關係。若兩個波形相反會產生抵銷，導致低頻消失。",
        example: "想像兩個人同時推一扇門，如果兩邊推的力氣一樣大（波形相反），門就不會動（聲音抵銷）。"
    },
    // --- 第三卷：外掛法器 (Plugins) ---
    {
        term: "EQ (等化器)",
        type: "外掛法器",
        desc: "混音手術刀。用來切除不需要的頻率，或提亮好聽的頻率。",
        example: "聲音的收納櫃。把大鼓跟貝斯放在同一個低頻抽屜會卡死，EQ 能幫你把樂器分門別類放好。"
    },
    {
        term: "Delay / Echo",
        type: "外掛法器",
        desc: "回音效果。填補空隙的神器，比 Reverb 更乾淨、不影響通透度。",
        example: "對著山谷大喊。你可以控制聲音撞到山壁反彈回來的時間 (Time)，以及它在山谷間重複反彈的次數 (Feedback)。"
    },
    // --- 第四卷：壓縮器派系 ---
    {
        term: "Threshold (閾值)",
        type: "壓縮器派系",
        desc: "觸發線。當音量跨過這條線，壓縮器才會開始工作。",
        example: "除草機法則。設定好除草的高度，只有長得超過這個高度的草（突發的爆音）才會被刀片砍掉，沒超過的完全不受影響。"
    },
    {
        term: "Ratio (壓縮比)",
        type: "壓縮器派系",
        desc: "壓縮強度。數字越大，壓得越暴力。4:1 是鼓組常見的起點。",
        example: "除草機的下刀狠度。設定 4:1，代表草（音量）每超出警戒線 4 公分，除草機只允許 1 公分留下來。"
    }
    // ... 你可以把剩下的 42 條慢慢補上 example 欄位
];

const CATEGORIES = ["全部", "基礎與錄音", "物理與聲學", "外掛法器", "壓縮器派系", "鼓組解剖", "混音神技", "系統與母帶"];

export default function GlossaryPage() {
    const router = useRouter();

    // 👇 佈署守門員
    /* useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
        };
        checkUser();
    }, [router]);
    */

    const [activeTab, setActiveTab] = useState("全部");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = DICTIONARY.filter(item => {
        const matchesTab = activeTab === "全部" || item.type === activeTab;
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.desc.includes(searchTerm);
        return matchesTab && matchesSearch;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '3rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '1rem', textShadow: '0 0 20px rgba(56,189,248,0.3)' }}>📖 混音魔導書</h1>
                    <p style={{ color: '#94a3b8' }}>字典不該冷冰冰。從定義到實戰舉例，解鎖所有混音咒語。</p>
                </div>

                {/* 🔍 搜尋列 */}
                <input
                    type="text"
                    placeholder="搜尋名詞或關鍵字 (例如：相位、Sidechain...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', maxWidth: '800px', display: 'block', margin: '0 auto 2rem auto', padding: '1rem 1.5rem', borderRadius: '50px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '1rem', outline: 'none' }}
                />

                {/* 📑 分類標籤 (Tabs) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '3rem', justifyContent: 'center' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                padding: '8px 18px', borderRadius: '20px', border: activeTab === cat ? '1px solid #38bdf8' : '1px solid #334155',
                                background: activeTab === cat ? 'rgba(56,189,248,0.1)' : '#0f172a',
                                color: activeTab === cat ? '#38bdf8' : '#94a3b8',
                                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold', fontSize: '0.9rem'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 🃏 卡牌列表 (純文字優化版) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredData.map((item, idx) => (
                        <div key={idx} style={{
                            background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                            borderRadius: '16px', padding: '1.8rem', border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem', fontWeight: 'bold' }}>{item.term}</h3>
                                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: 'bold', border: '1px solid rgba(56,189,248,0.2)' }}>
                                    {item.type}
                                </span>
                            </div>

                            {/* 標準定義 */}
                            <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {item.desc}
                            </p>

                            {/* 💡 實戰/生活舉例區塊 (若有填寫 example 才會顯示) */}
                            {item.example && (
                                <div style={{
                                    marginTop: 'auto', // 讓這個區塊自動靠下對齊
                                    background: 'rgba(252, 163, 17, 0.05)',
                                    borderLeft: '3px solid #fca311',
                                    padding: '1rem',
                                    borderRadius: '0 8px 8px 0'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#fca311', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                        💡 製作人秒懂：
                                    </div>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {item.example}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>找不到相關名詞，試試其他關鍵字吧！</div>
                )}

                {/* 💡 底部提示與返回導航 */}
                <div style={{ marginTop: '5rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link href="/mix-assistant" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(56,189,248,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'inline-block',
                            marginBottom: '2rem', border: '1px dashed rgba(56,189,248,0.3)', cursor: 'pointer', transition: 'all 0.3s ease'
                        }}>
                            <p style={{ margin: 0, color: '#bae6fd', fontSize: '1rem' }}>💡 找不到你要的答案？或術語太艱澀？</p>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                請直接點擊尋找「AI 混音助理」協助！
                            </p>
                        </div>
                    </Link>
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/courses" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 'bold' }}>⬅️ 返回課程大廳</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}