"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase'; // 根據你的環境決定是否取消註解

// 📖 混音魔導書：終極字彙庫 (全 42 條完整版！)
const DICTIONARY = [
    // --- 第一卷：DAW 基礎與錄音 ---
    {
        term: "BPM", type: "基礎與錄音",
        desc: "歌曲心跳速度。數字越大越快，流行樂通常在 80-120 之間。",
        example: "就像你跑步的步伐頻率。EDM 舞曲的 BPM 大約是快跑 (128)，而抒情歌則是散步 (70)。"
    },
    { term: "Track (音軌)", type: "基礎與錄音", desc: "樂器的專屬跑道。主唱、吉他、大鼓通常各自擁有獨立音軌。" },
    { term: "Mono / Stereo", type: "基礎與錄音", desc: "Mono 是單點發聲（大鼓、Bass）；Stereo 具有左右寬度（合成器、Reverb）。" },
    { term: "Bus / Aux", type: "基礎與錄音", desc: "聲音的公車。把多個音軌送進同一個通道集體處理（例如集體加 Reverb）。" },
    { term: "Automation", type: "基礎與錄音", desc: "自動化。讓電腦自動在指定時間推高音量或旋轉效果器旋鈕。" },
    { term: "MIDI", type: "基礎與錄音", desc: "數位樂器訊號。它不是聲音，而是告訴電腦什麼時候彈什麼音符的「樂譜」。" },
    { term: "Inst vs. Line", type: "基礎與錄音", desc: "Inst 是樂器電平（阻抗高、訊號弱）；Line 是標準線路電平（訊號強且穩定）。" },
    { term: "Preamp (前級)", type: "基礎與錄音", desc: "錄音介面的核心，負責把微弱的麥克風訊號放大到能混音的強度。" },
    { term: "DI (Direct Injection)", type: "基礎與錄音", desc: "阻抗轉換器。讓電吉他或 Bass 的訊號能正確地進入錄音介面或混音機。" },
    { term: "底噪 (Noise Floor)", type: "基礎與錄音", desc: "硬體或環境自帶的嘶嘶聲。錄音時應盡量保持訊噪比，遠離底噪。" },

    // --- 第二卷：物理與聲學 ---
    { term: "Frequency (頻率)", type: "物理與聲學", desc: "聲音震動的快慢，決定音高。人耳範圍是 20Hz 到 20kHz。" },
    {
        term: "Phase (相位)", type: "物理與聲學",
        desc: "聲波的時間關係。若兩個波形相反會產生抵銷，導致低頻消失。",
        example: "想像兩個人同時推一扇門，如果兩邊推的力氣一樣大方向卻相反，門就不會動（聲音互相抵銷不見）。"
    },
    { term: "Phase Flip", type: "物理與聲學", desc: "相位反轉。常用於處理鼓組錄音，修正兩支麥克風之間產生的相位抵銷。" },
    { term: "Harmonics (諧波)", type: "物理與聲學", desc: "聲音的副產物。輕微的諧波能讓聲音聽起來更溫暖、有磁性。" },
    { term: "Muddy (渾濁)", type: "物理與聲學", desc: "發生在 200-500Hz。過多時聽起來像主唱被關在紙箱裡唱歌。" },
    { term: "Air (空氣感)", type: "物理與聲學", desc: "10kHz 以上的極高頻。提升它能讓聲音更有呼吸感與貴氣。" },
    { term: "底噪 (Noise Floor) - 聲學", type: "物理與聲學", desc: "器材自帶的嘶嘶聲。好的錄音要確保「訊噪比」夠高。" },

    // --- 第三卷：外掛法器 (Plugins) ---
    {
        term: "EQ (等化器)", type: "外掛法器",
        desc: "混音手術刀。用來切除不需要的頻率，或提亮好聽的頻率。",
        example: "公司團隊分工法則。每樣樂器都有自己最擅長發揮的頻段（職位），EQ 能幫你加強它的強項，並削減不重要的部分。就像一間公司需要各司其職，而不是讓一個人同時做五份工作互相干擾。"
    },
    { term: "Low & High Filter", type: "外掛法器", desc: "高/低通濾波器。暴力地切除極低頻（Low Cut）或極高頻（High Cut）。" },
    { term: "Dynamic EQ", type: "外掛法器", desc: "EQ 與壓縮的混血兒。只有在頻率太過刺耳時才會自動削減。" },
    { term: "Reverb (殘響)", type: "外掛法器", desc: "空間魔法。模擬房間、大廳或教堂的空間回饋感。" },
    {
        term: "Delay / Echo", type: "外掛法器",
        desc: "回音效果。填補空隙的神器，比 Reverb 更乾淨、不影響通透度。",
        example: "對著山谷大喊。你可以控制聲音撞到山壁反彈回來的時間 (Time)，以及它在山谷間重複反彈的次數 (Feedback)。"
    },
    { term: "Shimmer", type: "外掛法器", desc: "閃爍殘響。帶有高八度染色的夢幻 Reverb，常用於環境音樂或氛圍吉他。" },
    { term: "Noise Gate", type: "外掛法器", desc: "噪音門。當音量低於設定值就直接靜音，清除背景雜音或漏音。" },
    { term: "De-clip", type: "外掛法器", desc: "破音修復術。用來拯救因錄音音量過大而產生的數位失真。" },
    { term: "Native vs DSP", type: "外掛法器", desc: "Native 靠電腦 CPU 算；DSP 靠專用的硬體卡算，延遲極低。" },

    // --- 第四卷：壓縮器派系 ---
    {
        term: "Threshold (閾值)", type: "壓縮器派系",
        desc: "觸發線。當音量跨過這條線，壓縮器才會開始工作。",
        example: "除草機法則。設定好除草的高度，只有長得超過這個高度的草（突發的爆音）才會被刀片砍掉，沒超過的完全不受影響。"
    },
    {
        term: "Ratio (壓縮比)", type: "壓縮器派系",
        desc: "壓縮強度。數字越大，壓得越暴力。4:1 是鼓組常見的起點。",
        example: "除草機的下刀狠度。設定 4:1，代表草（音量）每超出警戒線 4 公分，除草機只允許 1 公分留下來。"
    },
    { term: "Knee", type: "壓縮器派系", desc: "發動平滑度。Hard Knee 像撞牆；Soft Knee 像緩踩煞車。" },
    { term: "FET (例如 1176)", type: "壓縮器派系", desc: "動作極快且具攻擊感。捕捉大鼓瞬態或讓主唱「跳出來」的首選。" },
    { term: "Opto (例如 LA-2A)", type: "壓縮器派系", desc: "光學原理，動作溫柔。讓主唱跟 Bass 變得平滑自然的利器。" },
    { term: "VCA (例如 SSL Bus)", type: "壓縮器派系", desc: "極度透明、反應精準。最適合放在總線進行 Glue (黏合) 處理。" },
    { term: "Tube (例如 Fairchild)", type: "壓縮器派系", desc: "真空管染色。動作慢但聲音極度肥厚且具有復古貴氣。" },

    // --- 第五卷：鼓組解剖室 ---
    { term: "Kick (大鼓)", type: "鼓組解剖", desc: "節奏的地基。需要注意與 Bass 頻率的避讓（Sidechain）。" },
    { term: "Snare (小鼓)", type: "鼓組解剖", desc: "歌曲的核心打擊。需要 200Hz 的厚度與 5kHz 的響弦亮度。" },
    { term: "Hi-hat (雙片鈸)", type: "鼓組解剖", desc: "控制歌曲的細碎節奏感，頻率偏高。" },
    { term: "Tom (中鼓)", type: "鼓組解剖", desc: "過門時的咚咚聲。通常需要做比較強的 Gate 來保持乾淨。" },
    { term: "Crash (碎音鈸)", type: "鼓組解剖", desc: "高潮處的「鏘！」聲。在頻譜上佔據極高的空氣感。" },

    // --- 第六卷：混音神技 ---
    { term: "Glue (黏合)", type: "混音神技", desc: "用壓縮器讓各個音軌聽起來像是一個整體的樂團，而不是分開的音檔。" },
    { term: "Sidechain (側鏈)", type: "混音神技", desc: "最常用於大鼓打下去時讓 Bass 自動變小聲，騰出低頻空間。" },
    { term: "Summing", type: "混音神技", desc: "將多軌混合成兩軌的過程。類比 Summing 能增加聲音的寬度與染色。" },
    {
        term: "Pan (聲相)", type: "混音神技",
        desc: "調整聲音在左右聲道的位置，創造立體聲舞台感。除了單純的左右，還包含 LCR (極左、中、極右) 的極端擺位法。",
        example: "就像是安排樂團成員在舞台上的站位，如果你把所有人都擠在正中央 (Pan = 0)，聲音聽起來就會很悶且打架。"
    },
    { term: "Punch", type: "混音神技", desc: "聲音的「拳頭感」。通常來自於保留良好的 Transient (瞬態)。" },
    { term: "Parallel Comp", type: "混音神技", desc: "平行壓縮。保留原始動態的同時，混入重壓後的肥厚音色。" },

    // --- 第七卷：系統與母帶 ---
    { term: "Mixing (混音)", type: "系統與母帶", desc: "處理多個音軌的平衡、頻率與空間，做出一首好聽的歌。" },
    { term: "Mastering (母帶)", type: "系統與母帶", desc: "混音後的最後一道關卡。處理響度與色彩，讓音樂在所有喇叭上都好聽。" },
    { term: "Analog (類比)", type: "系統與母帶", desc: "模擬實體機器（真空管、變壓器）帶來的非線性染色與溫暖感。" },
    { term: "Dither (抖動)", type: "系統與母帶", desc: "降位元（例如 24轉16）輸出時加入的極小噪音，用來防止截斷失真。" }
];

const CATEGORIES = ["全部", "基礎與錄音", "物理與聲學", "外掛法器", "壓縮器派系", "鼓組解剖", "混音神技", "系統與母帶"];

export default function GlossaryPage() {
    const router = useRouter();

    // 👇 佈署守門員 (若有 Supabase 可打開)
    /*
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
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

                {/* 🃏 卡牌列表 */}
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

                            <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {item.desc}
                            </p>

                            {/* 💡 實戰舉例區塊 */}
                            {item.example && (
                                <div style={{
                                    marginTop: 'auto',
                                    background: 'rgba(252, 163, 17, 0.05)',
                                    borderLeft: '3px solid #fca311',
                                    padding: '1rem',
                                    borderRadius: '0 8px 8px 0',
                                    marginBottom: item.term === "Pan (聲相)" ? '1rem' : '0' // 如果有按鈕，留點下邊距
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#fca311', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                        💡 製作人秒懂：
                                    </div>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {item.example}
                                    </p>
                                </div>
                            )}

                            {/* 🚀 專屬傳送門：只在 "Pan (聲相)" 出現 */}
                            {item.term === "Pan (聲相)" && (
                                <div style={{ marginTop: 'auto' }}>
                                    <Link
                                        href="/courses/arrangement/sonic-lab"
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '10px 15px', background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: '#fff', textDecoration: 'none', borderRadius: '12px',
                                            fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)',
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.5)'; }}
                                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.3)'; }}
                                    >
                                        <span>🎧</span> 親耳聽聽看：進入聲場構築實驗室 ➔
                                    </Link>
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
                                如果看了還是有疑問，可以馬上請「混音助理」協助喔！
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