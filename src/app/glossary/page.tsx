"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 如果你有 Supabase，請取消註解這行：
// import { supabase } from '@/lib/supabase';

// 📖 混音魔導書：終極字彙庫 (全 42 條)
const DICTIONARY = [
    // --- 第一卷：DAW 基礎與錄音 ---
    { term: "BPM", type: "基礎與錄音", desc: "歌曲心跳速度。數字越大越快，流行樂通常在 80-120 之間。" },
    // ... (保留你其他的項目，為節省篇幅此處省略，請自行補上原有的其他詞彙) ...

    // --- 第二卷：物理與聲學 ---
    { term: "Frequency (頻率)", type: "物理與聲學", desc: "聲音震動的快慢，決定音高。人耳範圍是 20Hz 到 20kHz。" },
    { term: "Phase (相位)", type: "物理與聲學", desc: "聲波的時間關係。若兩個波形相反會產生抵銷，導致低頻消失。" },

    // --- 第三卷：外掛法器 (Plugins) ---
    {
        term: "EQ (等化器)", type: "外掛法器", desc: "混音手術刀。用來切除不需要的頻率，或提亮好聽的頻率。",
        // 🌟 加入視覺化屬性
        concept: "聲音的收納櫃",
        illustration: "🗄️ 🧦 👕", // 這裡未來可以換成圖片路徑
        color: "#10b981"
    },
    { term: "Reverb (殘響)", type: "外掛法器", desc: "空間魔法。模擬房間、大廳或教堂的空間回饋感。" },
    {
        term: "Delay / Echo", type: "外掛法器", desc: "回音效果。填補空隙的神器，比 Reverb 更乾淨、不影響通透度。",
        // 🌟 加入視覺化屬性
        concept: "聲音的時間分身",
        illustration: "🗣️ 〰️ 🧱",
        color: "#38bdf8"
    },

    // --- 第四卷：壓縮器派系 ---
    {
        term: "Threshold", type: "壓縮器派系", desc: "觸發線。當音量跨過這條線，壓縮器才會開始工作。",
        // 🌟 加入視覺化屬性
        concept: "除草機法則",
        illustration: "🚜 🌱 ✂️",
        color: "#fca311"
    },
    { term: "Ratio", type: "壓縮器派系", desc: "壓縮強度。數字越大，壓得越暴力。4:1 是鼓組常見的起點。" }
];

const CATEGORIES = ["全部", "基礎與錄音", "物理與聲學", "外掛法器", "壓縮器派系", "鼓組解剖", "混音神技", "系統與母帶"];

export default function GlossaryPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 👇 佈署守門員 & 手機版偵測
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        /* 如果有 Supabase 驗證，請取消註解：
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
        };
        checkUser();
        */

        return () => window.removeEventListener('resize', checkMobile);
    }, [router]);

    const [activeTab, setActiveTab] = useState("全部");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = DICTIONARY.filter(item => {
        const matchesTab = activeTab === "全部" || item.type === activeTab;
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.desc.includes(searchTerm);
        return matchesTab && matchesSearch;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '3rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '1rem', textShadow: '0 0 20px rgba(56,189,248,0.3)' }}>📖 混音魔導書</h1>
                    <p style={{ color: '#94a3b8' }}>圖文並茂，用製作人的語言重新定義聲音形狀。</p>
                </div>

                {/* 🔍 搜尋列 */}
                <input
                    type="text"
                    placeholder="搜尋名詞或關鍵字 (例如：相位、Sidechain...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '50px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '1rem', marginBottom: '2rem', outline: 'none' }}
                />

                {/* 📑 分類標籤 (Tabs) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '4rem', justifyContent: 'center' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                padding: '10px 20px', borderRadius: '20px', border: activeTab === cat ? '1px solid #38bdf8' : '1px solid #334155',
                                background: activeTab === cat ? 'rgba(56,189,248,0.1)' : '#0f172a',
                                color: activeTab === cat ? '#38bdf8' : '#94a3b8',
                                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 🃏 列表區 (混合了視覺卡與一般卡) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {filteredData.map((item, index) => {

                        // 🌟 如果該詞彙有設定 illustration (視覺圖)，就渲染成「視覺百科橫幅」
                        if (item.illustration) {
                            const isImageRight = index % 2 === 0;
                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : (isImageRight ? 'row' : 'row-reverse'),
                                    gap: isMobile ? '2rem' : '3rem',
                                    alignItems: 'center',
                                    background: '#0f172a',
                                    padding: isMobile ? '2rem' : '3rem',
                                    borderRadius: '24px',
                                    border: `1px solid ${item.color}33`,
                                    boxShadow: `0 10px 30px rgba(0,0,0,0.2), inset 0 0 20px ${item.color}05`
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'inline-block', background: `${item.color}22`, color: item.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                            💡 {item.concept}
                                        </div>
                                        <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>{item.term}</h2>
                                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8' }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div style={{
                                        width: isMobile ? '100%' : '280px',
                                        height: isMobile ? '180px' : '220px',
                                        background: 'linear-gradient(145deg, #1e293b, #020617)',
                                        borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem',
                                        border: `2px dashed ${item.color}66`, flexShrink: 0
                                    }}>
                                        {/* 這裡未來可以直接換成 <img src="..." /> */}
                                        <span style={{ filter: `drop-shadow(0 0 15px ${item.color}88)` }}>{item.illustration}</span>
                                    </div>
                                </div>
                            );
                        }

                        // 🃏 如果沒有設定視覺圖，就渲染成你原本的「一般知識小卡」
                        return (
                            <div key={index} style={{
                                background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                                borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '1.2rem' }}>{item.term}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: '#334155', color: '#38bdf8', fontWeight: 'bold' }}>{item.type}</span>
                                </div>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ... (其餘底部導航保留) ... */}

            </div>
        </div>
    );
}