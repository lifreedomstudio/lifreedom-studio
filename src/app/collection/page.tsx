"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// 引入工具與資料
import { SKILLS, initialProgress, isSkillUnlocked } from '../../lib/gameData';

export default function CollectionPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [userProgress, setUserProgress] = useState(initialProgress);

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
            localStorage.setItem('mix_progress', JSON.stringify(initialProgress));
        }

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [router]);

    // 🔒 目前訓練關卡與圖鑑上鎖中，保留函式以供未來開啟使用
    const handleCardClick = (skillId: string) => {
        // router.push(`/skill/${skillId}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* 返回按鈕 (可以根據你的佈局決定是否保留) */}
                <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.4rem', borderRadius: '50px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    ← 返回總部
                </button>

                {/* ================= 標題區 (新增主標與副標) ================= */}
                <header style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        LOCKED AREA
                    </div>
                    <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '900', color: '#fff', marginBottom: '1rem', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        這片圖鑑領域尚未完全解鎖
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        完成聽力特訓地圖中的關卡後，將逐步開放能力圖鑑庫
                    </p>
                </header>

                {/* ================= 🗺️ 特訓地圖 ================= */}
                <div style={{ background: '#0f172a', borderRadius: '24px', padding: '3rem 1rem', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <h2 style={{ color: '#38bdf8', marginBottom: '2rem', zIndex: 2 }}>🗺️ 聽力特訓地圖</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'20\' viewBox=\'0 0 4 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'4\' height=\'10\' fill=\'%23334155\'/%3E%3C/svg%3E")', transform: 'translateX(-50%)', zIndex: 0 }}></div>

                        {SKILLS.map((skill, index) => {
                            const isUnlocked = isSkillUnlocked(skill.id, userProgress.unlockedLevels);
                            const isPlayable = isUnlocked || index === 0 || isSkillUnlocked(SKILLS[index - 1].id, userProgress.unlockedLevels);

                            const marginLeft = index % 2 === 0 ? '0' : '150px';
                            const marginRight = index % 2 === 0 ? '150px' : '0';

                            return (
                                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1, marginLeft: isMobile ? '0' : marginLeft, marginRight: isMobile ? '0' : marginRight }}>
                                    {/* 左側文字 (省略) */}

                                    <div
                                        // 🔒 鎖定狀態：移除點擊與 Hover，強制改為不可點擊樣式
                                        className="map-node locked"
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed',
                                            background: '#020617',
                                            border: `4px solid #1e293b`,
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.6rem', marginBottom: '2px' }}>🔒</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '1px' }}>即將開放</span>
                                    </div>

                                    {/* 右側文字 (省略) */}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= 🗂️ 圖鑑庫 ================= */}
                <h2 style={{ color: '#f8fafc', marginBottom: '2rem', borderLeft: '4px solid #10b981', paddingLeft: '15px' }}>🎴 能力圖鑑庫</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {SKILLS.map((skill) => {
                        const isUnlocked = isSkillUnlocked(skill.id, userProgress.unlockedLevels);

                        return (
                            <div key={skill.id} style={{
                                background: '#020617',
                                borderRadius: '20px',
                                border: `2px solid #1e293b`,
                                boxShadow: 'none',
                                overflow: 'hidden', transition: 'all 0.3s',
                                filter: 'grayscale(0.8) opacity(0.8)' // 🔒 強制加上灰階濾鏡
                            }}>
                                {/* 卡牌上半部資訊 (省略) */}

                                <div style={{ padding: '1.5rem' }}>
                                    {/* 卡牌中段教學 (省略) */}

                                    {/* 🎮 橋接按鈕 (強制上鎖) */}
                                    <div style={{ borderTop: '1px dashed #334155', paddingTop: '1.5rem', textAlign: 'center' }}>
                                        <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>🔒 尚未解鎖圖鑑領域</div>
                                        <button disabled style={{ background: '#1e293b', color: '#475569', padding: '10px 16px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', border: 'none', cursor: 'not-allowed', width: '100%' }}>
                                            ⏳ 即將開放
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}