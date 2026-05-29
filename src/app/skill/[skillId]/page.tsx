"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SKILLS, LEVELS, initialProgress, UserProgressType } from '@/lib/gameData';

export default function SkillWorldPage() {
    const router = useRouter();
    const params = useParams();
    const skillId = params.skillId as string;

    const [userProgress, setUserProgress] = useState<UserProgressType>(initialProgress);
    const [skill, setSkill] = useState<any>(null);
    const [skillLevels, setSkillLevels] = useState<typeof LEVELS>([]);

    useEffect(() => {
        if (!skillId) return;

        try {
            const stored = localStorage.getItem('mix_progress');
            if (stored) {
                setUserProgress(JSON.parse(stored));
            }
        } catch (error) {
            console.warn("舊進度解析失敗，已自動套用預設值", error);
            localStorage.removeItem('mix_progress');
        }

        const targetSkill = SKILLS.find(s => s.id === skillId);
        if (targetSkill) {
            setSkill(targetSkill);
        } else {
            console.error("找不到這張卡牌的資料：", skillId);
        }

        const levels = LEVELS.filter(l => l.skillId === skillId).sort((a, b) => a.order - b.order);
        setSkillLevels(levels);
    }, [skillId]);

    if (!skill) return <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>正在解析訓練環境... <br />(如果卡住請確認網址是否正確)</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                <button onClick={() => router.push('/collection')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem' }}>
                    ⬅️ 返回特訓地圖
                </button>

                {/* 🟢 上半部（理解） */}
                <div style={{ background: `linear-gradient(135deg, ${skill.theme}20, transparent)`, border: `1px solid ${skill.theme}50`, borderRadius: '24px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                    <h1 style={{ color: skill.theme, margin: '0 0 1rem 0', fontSize: '2.5rem' }}>{skill.name}</h1>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                        {skill.learn}
                    </p>
                </div>

                {/* 🔵 中段（能力提示） */}
                <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', border: '1px solid #1e293b' }}>
                    <h3 style={{ color: '#94a3b8', margin: '0 0 1.5rem 0', textAlign: 'center' }}>🎯 你要聽的是：</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>❌</span>
                            <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>{skill.detect.tooMuch}</span>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>✅</span>
                            <span style={{ color: '#6ee7b7', fontWeight: 'bold' }}>{skill.detect.reduced}</span>
                        </div>
                    </div>
                </div>

                {/* 🟡 下半部（關卡地圖） */}
                <h3 style={{ color: '#f8fafc', marginBottom: '1rem', marginLeft: '10px' }}>🚀 特訓關卡</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {skillLevels.map((level) => {
                        const isCompleted = userProgress.completedLevels.includes(level.id);
                        const isUnlocked = userProgress.unlockedLevels.includes(level.id);

                        return (
                            <div
                                key={level.id}
                                onClick={() => {
                                    if (isUnlocked || isCompleted) {
                                        alert(`準備進入關卡：${level.id}\n難度：${level.difficulty}`);
                                    }
                                }}
                                style={{
                                    background: isCompleted ? `${skill.theme}20` : isUnlocked ? '#1e293b' : '#020617',
                                    border: `2px solid ${isCompleted ? skill.theme : isUnlocked ? '#475569' : '#0f172a'}`,
                                    padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    cursor: (isUnlocked || isCompleted) ? 'pointer' : 'not-allowed',
                                    opacity: (isUnlocked || isCompleted) ? 1 : 0.5,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', color: isCompleted ? skill.theme : isUnlocked ? '#fff' : '#64748b', fontSize: '1.2rem', marginBottom: '4px' }}>
                                        Level {level.order}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>難度：{level.difficulty.toUpperCase()}</div>
                                </div>
                                <div style={{ fontSize: '1.5rem' }}>
                                    {isCompleted ? '⭐' : isUnlocked ? '🎯' : '🔒'}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}