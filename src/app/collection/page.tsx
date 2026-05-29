"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 📚 產品級第一套卡牌：Core 10
const CARDS_DATA = [
    // 🟢 🥇 第一組：核心聽感（必做）
    {
        id: "mud_250hz", name: "Mud（混濁）", freq: "200–400Hz", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#10b981",
        unlockBy: "完成任務：讓混音變乾淨", learn: "這個頻段過多會讓聲音糊在一起，是新手混音最常翻車的地方。",
        detect: { tooMuch: "悶、糊、擠在一起", reduced: "乾淨、分離、清楚" },
        task: "找出哪一段比較乾淨", reward: "你現在能聽出混濁低頻", next: "挑戰：人聲 Mud 修正",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "air_12khz", name: "Air（空氣感）", freq: "10kHz+", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#38bdf8",
        unlockBy: "完成任務：尋找高頻呼吸感", learn: "高頻會影響聲音的開闊感，賦予聲音昂貴的仙氣。",
        detect: { tooMuch: "刺耳、單薄、假亮", reduced: "自然、通透、有呼吸感" },
        task: "分辨有沒有加 Air 的差別", reward: "你現在能感知極高頻的光澤", next: "挑戰：提升主唱呼吸感",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "punch_100hz", name: "Punch（衝擊感）", freq: "80–120Hz", category: "EQ", tier: "Beginner", rarity: "Common", theme: "#ef4444",
        unlockBy: "完成任務：尋找大鼓的力量", learn: "低頻與瞬態決定打擊感，是節奏的心臟。",
        detect: { tooMuch: "轟鳴、混濁、蓋住貝斯", reduced: "有力、清楚、拳拳到肉" },
        task: "調整大鼓的 Punch 頻段", reward: "你現在能掌握低頻衝擊力", next: "挑戰：大鼓與貝斯融合",
        route: "/courses/mixing/eq-training"
    },

    // 🔵 🥈 第二組：混音核心能力
    {
        id: "vocal_position", name: "Vocal Forward（人聲前後）", freq: "1kHz-3kHz", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#8b5cf6",
        unlockBy: "完成任務：讓人聲跳出來", learn: "人聲的位置影響整體平衡，中頻決定了歌手離聽眾有多近。",
        detect: { tooMuch: "貼臉、壓迫、聽覺疲勞", reduced: "自然、融入、有深度" },
        task: "利用中頻讓人聲往前靠", reward: "你現在能控制人聲的遠近", next: "挑戰：背景和聲退後",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "masking", name: "Masking（頻率遮蔽）", freq: "全頻段", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#f59e0b",
        unlockBy: "完成任務：解除樂器打架", learn: "頻率重疊會讓元素互相吃掉，大聲的會掩蓋小聲的細節。",
        detect: { tooMuch: "聽不清、擠、樂器打架", reduced: "分離、清楚、各有空間" },
        task: "用減法 EQ 讓吉他讓出空間", reward: "你現在能聽出頻率衝突", next: "挑戰：Kick & Bass 避讓",
        route: "/courses/mixing/eq-training"
    },
    {
        id: "stereo_width", name: "Stereo Width（寬度）", freq: "L/R 聲相", category: "Mixing Core", tier: "Intermediate", rarity: "Uncommon", theme: "#06b6d4",
        unlockBy: "完成任務：拉開聲場", learn: "左右分佈影響空間感，LCR 擺位能瞬間拓寬舞台。",
        detect: { tooMuch: "空洞、鬆散、失去力量", reduced: "集中、有重心、包覆感" },
        task: "將兩把吉他 Pan 開", reward: "你現在能判斷立體聲寬度", next: "挑戰：LCR 擺位實戰",
        route: "/incubator"
    },

    // 🟣 🥉 第三組：進階感知
    {
        id: "compression", name: "Compression Feel（壓縮感）", freq: "動態範圍", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#d946ef",
        unlockBy: "完成任務：控制失控的動態", learn: "壓縮會影響動態與穩定，甚至能改變樂器的物理打擊感。",
        detect: { tooMuch: "扁平、沒生命、呼吸困難", reduced: "自然、有起伏、具衝擊力" },
        task: "聽出過度壓縮的鼓組", reward: "你現在能感知壓縮器的運作", next: "挑戰：Glue 黏合混音",
        route: "/courses/mixing/compressor-training"
    },
    {
        id: "transient", name: "Transient（瞬態）", freq: "Attack 階段", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#ec4899",
        unlockBy: "完成任務：塑造打擊音頭", learn: "開頭的瞬間決定清晰度，是聲音輪廓的刀刃。",
        detect: { tooMuch: "刺耳、生硬、刮耳", reduced: "柔順、但清楚、有彈性" },
        task: "保留小鼓的 Transient", reward: "你現在能捕捉聲音的輪廓", next: "挑戰：平行壓縮應用",
        route: "/courses/mixing/compressor-training"
    },
    {
        id: "low_end_control", name: "Low End Control（低頻控制）", freq: "20-150Hz", category: "Advanced", tier: "Pro", rarity: "Epic", theme: "#14b8a6",
        unlockBy: "合成卡牌：需先收集 Mud, Punch, Masking", combine: ["mud_250hz", "punch_100hz", "masking"], learn: "低頻是混音的地基，決定歌曲的能量與夜店的震動感。",
        detect: { tooMuch: "轟鳴、吃掉 Headroom", reduced: "結實、乾淨、有律動" },
        task: "完美平衡 Kick 與 Bass", reward: "你現在能建構穩固的低頻", next: "挑戰：Sub Bass 混音",
        route: "/courses/mixing/eq-training"
    },

    // 🟡 🏆 第四組：成就卡
    {
        id: "clean_mix", name: "Clean Mix（乾淨混音）", freq: "全頻段平衡", category: "Achievement", tier: "Master", rarity: "Rare", theme: "#fbbf24",
        unlockBy: "完成 5 個基礎任務解鎖", learn: "所有的分離、動態與空間最終的完美融合。",
        detect: { tooMuch: "過度處理、失去自然感", reduced: "清晰、寬廣、如臨現場" },
        task: "完成一首歌曲的基礎混音", reward: "你已經能做出乾淨的混音判斷", next: "挑戰：Mastering 母帶處理",
        route: "/courses/mixing/eq-training"
    }
];

export default function CollectionPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 記錄玩家進度
    const [userProgress, setUserProgress] = useState<Record<string, { unlocked: boolean, progress: number, attempts: number }>>({});

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
        };
        checkUser();

        const stored = localStorage.getItem('mix_progress');
        if (stored) {
            setUserProgress(JSON.parse(stored));
        } else {
            // 預設解鎖第一關，以便測試
            setUserProgress({});
        }

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [router]);

    const handleStartTraining = (card: any) => {
        const progress = userProgress[card.id] || { unlocked: false, attempts: 0 };
        router.push(`${card.route}?mission=${card.id}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? '2rem' : '4rem', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 0.5rem 0', background: 'linear-gradient(to right, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>
                            📜 能力認證圖鑑與訓練地圖
                        </h1>
                        <p style={{ color: '#64748b', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            沿著地圖挑戰你的耳朵，收集所有混音核心感知能力。
                        </p>
                    </div>
                    <Link href="/courses" style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textDecoration: 'none', color: '#e2e8f0', border: '1px solid #1e293b', fontWeight: 'bold', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', textAlign: 'center' }}>
                        ⬅️ 返回大廳
                    </Link>
                </div>

                {/* 🗺️ Duolingo 任務地圖 */}
                <div style={{ background: '#0f172a', borderRadius: '24px', padding: '3rem 1rem', border: '1px solid #1e293b', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                    <h2 style={{ color: '#38bdf8', marginBottom: '2rem', zIndex: 2 }}>🗺️ 聽力特訓地圖</h2>

                    {/* 地圖節點：利用 flex 和 margin 模擬蜿蜒路徑 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}>
                        {/* 虛線背景軌道 */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'20\' viewBox=\'0 0 4 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'4\' height=\'10\' fill=\'%23334155\'/%3E%3C/svg%3E")', transform: 'translateX(-50%)', zIndex: 0 }}></div>

                        {CARDS_DATA.map((node, index) => {
                            const isUnlocked = userProgress[node.id]?.unlocked;
                            // 判斷是否為「下一個可挑戰」的關卡
                            const isPlayable = isUnlocked || index === 0 || userProgress[CARDS_DATA[index - 1].id]?.unlocked;

                            // 左右錯開的排版邏輯
                            const marginLeft = index % 2 === 0 ? '0' : '150px';
                            const marginRight = index % 2 === 0 ? '150px' : '0';

                            return (
                                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1, marginLeft: isMobile ? '0' : marginLeft, marginRight: isMobile ? '0' : marginRight }}>

                                    {/* 文字標籤 (左側或右側) */}
                                    {index % 2 === 1 && !isMobile && (
                                        <div style={{ width: '120px', textAlign: 'right', color: isPlayable ? node.theme : '#475569', fontWeight: 'bold' }}>{node.name}</div>
                                    )}

                                    {/* 節點本體 */}
                                    <div
                                        onClick={() => isPlayable && handleStartTraining(node)}
                                        className={`map-node ${isUnlocked ? 'unlocked' : isPlayable ? 'playable' : 'locked'}`}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', cursor: isPlayable ? 'pointer' : 'not-allowed',
                                            background: isUnlocked ? node.theme : isPlayable ? '#1e293b' : '#020617',
                                            border: `4px solid ${isPlayable ? node.theme : '#1e293b'}`,
                                            boxShadow: isUnlocked ? `0 0 30px ${node.theme}80` : isPlayable ? `0 0 15px ${node.theme}40` : 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={e => isPlayable && (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {isUnlocked ? '⭐' : isPlayable ? '🎯' : '🔒'}
                                    </div>

                                    {/* 文字標籤 (左側或右側) */}
                                    {(index % 2 === 0 || isMobile) && (
                                        <div style={{ width: '120px', textAlign: 'left', color: isPlayable ? node.theme : '#475569', fontWeight: 'bold' }}>{node.name}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🗂️ 核心卡牌網格 */}
                <h2 style={{ color: '#f8fafc', marginBottom: '2rem', borderLeft: '4px solid #10b981', paddingLeft: '15px' }}>🎴 能力圖鑑庫</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {CARDS_DATA.map((card) => {
                        const progress = userProgress[card.id] || { unlocked: false, attempts: 0, progress: 0 };
                        const isUnlocked = progress.unlocked;

                        return (
                            <div key={card.id} style={{
                                background: isUnlocked ? '#0f172a' : '#020617',
                                borderRadius: '20px',
                                border: `2px solid ${isUnlocked ? card.theme : '#1e293b'}`,
                                boxShadow: isUnlocked ? `0 10px 30px ${card.theme}20` : 'none',
                                overflow: 'hidden', transition: 'all 0.3s',
                                filter: isUnlocked ? 'none' : 'grayscale(0.8) opacity(0.8)'
                            }}
                            >
                                <div style={{ background: isUnlocked ? `linear-gradient(135deg, ${card.theme}20, transparent)` : '#0f172a', padding: '1.5rem', borderBottom: `1px solid ${isUnlocked ? card.theme + '40' : '#1e293b'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: isUnlocked ? card.theme : '#64748b', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '5px' }}>
                                                {card.tier} | {card.rarity}
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: isUnlocked ? '#fff' : '#64748b' }}>{card.name}</h3>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px' }}>
                                            {card.freq}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>🧠</span> <strong>核心聽感</strong></div>
                                        <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>{card.learn}</div>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                                        <div style={{ color: '#fca5a5', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', gap: '8px' }}><span>❌</span> <span><strong>過多：</strong>{card.detect.tooMuch}</span></div>
                                        <div style={{ color: '#6ee7b7', fontSize: '0.9rem', display: 'flex', gap: '8px' }}><span>✅</span> <span><strong>適當：</strong>{card.detect.reduced}</span></div>
                                    </div>

                                    {/* 🎮 成癮系統 UI */}
                                    {isUnlocked ? (
                                        <div style={{ borderTop: `1px dashed ${card.theme}50`, paddingTop: '1.5rem' }}>
                                            <div style={{ color: card.theme, fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>🎁 能力賦予：</span><span style={{ color: '#a7f3d0' }}>完成度 100%</span>
                                            </div>
                                            <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem' }}>{card.reward}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ background: `${card.theme}20`, color: card.theme, padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>🚀 {card.next}</div>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>通過挑戰次數：{progress.attempts} </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ borderTop: '1px dashed #334155', paddingTop: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>🔒 尚未解鎖圖鑑</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '10px' }}>{card.unlockBy}</div>

                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                                                挑戰次數：{progress.attempts}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .playable { animation: pulse 2s infinite; }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
                }
            `}} />
        </div>
    );
}