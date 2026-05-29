"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// 引入工具與資料
// 如果你的 gameData.ts 放在 src/lib 裡面，請用這個寫法：
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

    const handleCardClick = (skillId: string) => {
        router.push(`/skill/${skillId}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* 標題區 (省略) */}

                {/* 🗺️ 特訓地圖 */}
                <div style={{ background: '#0f172a', borderRadius: '24px', padding: '3rem 1rem', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <h2 style={{ color: '#38bdf8', marginBottom: '2rem', zIndex: 2 }}>🗺️ 聽力特訓地圖</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'20\' viewBox=\'0 0 4 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'4\' height=\'10\' fill=\'%23334155\'/%3E%3C/svg%3E")', transform: 'translateX(-50%)', zIndex: 0 }}></div>

                        {SKILLS.map((skill, index) => {
                            // ✅ 修正：使用解鎖陣列判斷
                            const isUnlocked = isSkillUnlocked(skill.id, userProgress.unlockedLevels);

                            // 判斷下一個可玩狀態 (如果是解鎖狀態，或者前一關已經解鎖)
                            const isPlayable = isUnlocked || index === 0 || isSkillUnlocked(SKILLS[index - 1].id, userProgress.unlockedLevels);

                            const marginLeft = index % 2 === 0 ? '0' : '150px';
                            const marginRight = index % 2 === 0 ? '150px' : '0';

                            return (
                                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1, marginLeft: isMobile ? '0' : marginLeft, marginRight: isMobile ? '0' : marginRight }}>
                                    {/* 左側文字 (省略) */}

                                    <div
                                        onClick={() => isPlayable && handleCardClick(skill.id)}
                                        className={`map-node ${isUnlocked ? 'unlocked' : isPlayable ? 'playable' : 'locked'}`}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', cursor: isPlayable ? 'pointer' : 'not-allowed',
                                            background: isUnlocked ? skill.theme : isPlayable ? '#1e293b' : '#020617',
                                            border: `4px solid ${isPlayable ? skill.theme : '#1e293b'}`,
                                            boxShadow: isUnlocked ? `0 0 30px ${skill.theme}80` : isPlayable ? `0 0 15px ${skill.theme}40` : 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={e => isPlayable && (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {/* 如果已經通關該技能所有的 Level，可以顯示 ⭐，這裡先簡單顯示 */}
                                        {isUnlocked ? '🎯' : isPlayable ? '🎯' : '🔒'}
                                    </div>

                                    {/* 右側文字 (省略) */}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🗂️ 圖鑑庫 */}
                <h2 style={{ color: '#f8fafc', marginBottom: '2rem', borderLeft: '4px solid #10b981', paddingLeft: '15px' }}>🎴 能力圖鑑庫</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {SKILLS.map((skill) => {
                        // ✅ 修正：使用陣列判斷
                        const isUnlocked = isSkillUnlocked(skill.id, userProgress.unlockedLevels);
                        const xp = userProgress.skillXP[skill.id as keyof typeof userProgress.skillXP] || 0;

                        return (
                            <div key={skill.id} style={{
                                background: isUnlocked ? '#0f172a' : '#020617',
                                borderRadius: '20px',
                                border: `2px solid ${isUnlocked ? skill.theme : '#1e293b'}`,
                                boxShadow: isUnlocked ? `0 10px 30px ${skill.theme}20` : 'none',
                                overflow: 'hidden', transition: 'all 0.3s',
                                filter: isUnlocked ? 'none' : 'grayscale(0.8) opacity(0.8)'
                            }}>
                                {/* 卡牌上半部資訊 (省略) */}

                                <div style={{ padding: '1.5rem' }}>
                                    {/* 卡牌中段教學 (省略) */}

                                    {/* 🎮 橋接按鈕 */}
                                    {isUnlocked ? (
                                        <div style={{ borderTop: `1px dashed ${skill.theme}50`, paddingTop: '1.5rem' }}>
                                            <div style={{ color: skill.theme, fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>✨ 技能熟練度：</span><span style={{ color: '#a7f3d0' }}>{xp} XP</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => handleCardClick(skill.id)}
                                                    style={{ background: `${skill.theme}20`, color: skill.theme, padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%' }}>
                                                    🎯 進入訓練關卡世界
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ borderTop: '1px dashed #334155', paddingTop: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>🔒 尚未解鎖圖鑑</div>
                                            <button disabled style={{ background: '#1e293b', color: '#475569', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', border: 'none', cursor: 'not-allowed', width: '100%' }}>
                                                需先通關前置能力
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}