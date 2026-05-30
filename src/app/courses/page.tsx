"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CoursesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // 佈署守門員：驗證登入狀態
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) router.push('/login');
                else setLoading(false);
            } else setLoading(false);
        };
        checkUser();
    }, [router]);

    // 判斷手機版
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#38bdf8' }}>
                    <h2 style={{ letterSpacing: '4px', marginBottom: '1rem' }}>正在驗證聲學通行證...</h2>
                    <p style={{ color: '#94a3b8' }}>Lifreedom Studio 載入中 🎧</p>
                </div>
            </div>
        );
    }

    // --- 共用樣式定義 ---
    const stepCard = {
        background: 'rgba(30, 41, 59, 0.5)',
        padding: isMobile ? '1.5rem' : '2.5rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textAlign: 'center' as const,
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    const stepWrapper = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        width: '100%'
    };

    const badgeStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '6px 16px',
        borderRadius: '50px',
        fontSize: '0.85rem',
        fontWeight: '900',
        letterSpacing: '2px',
        color: '#94a3b8',
        marginBottom: '0.5rem'
    };

    // 高質感 SVG 動態箭頭
    const Arrow = () => (
        <div style={{ margin: '1rem 0 2rem 0', animation: 'bounce 2s infinite', color: '#475569', display: 'flex', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    );

    const currentStep = 0;
    const progressPercent = (currentStep / 5) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#020617',
            color: '#fff',
            padding: isMobile ? '1rem' : '3rem 2rem',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: 'sans-serif'
        }}>

            {/* 🔝 Header */}
            <div style={{
                display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '1.5rem' : '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem'
            }}>
                <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fca311', margin: 0, lineHeight: '1.4', fontWeight: '900' }}>
                    Lifreedom Studio <br style={{ display: isMobile ? 'block' : 'none' }} /> 製作人訓練總部
                </h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                    <Link href="/pricing" style={{ padding: '0.6rem 1rem', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid #facc15', borderRadius: '8px', textDecoration: 'none', color: '#facc15', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        💎 方案
                    </Link>
                    <Link href="/glossary" style={{ padding: '0.6rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textDecoration: 'none', color: '#cbd5e1', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        📖 翻譯器
                    </Link>
                    <Link href="/collection" style={{ padding: '0.6rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textDecoration: 'none', color: '#cbd5e1', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        📜 圖鑑
                    </Link>
                    <button onClick={() => router.push('/mix-assistant')} style={{ padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #3c096c, #5a189a)', color: 'white', border: '1px solid #9d4edd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        🤖 AI 助理
                    </button>
                </div>
            </div>

            {/* 💥 HERO 爆擊區 (成功插入於 Header 與進度條中間) */}
            <div style={{
                marginBottom: '3rem',
                padding: isMobile ? '2rem 1.5rem' : '3rem',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(16,185,129,0.08))',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: isMobile ? '1.6rem' : '2rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    lineHeight: '1.4'
                }}>
                    你以為你在聽音樂<br />
                    其實你只聽到 <span style={{ color: '#38bdf8' }}>30%</span>
                </h2>

                <p style={{
                    color: '#94a3b8',
                    lineHeight: '1.7',
                    marginBottom: '2rem'
                }}>
                    鼓、Bass、空間、細節…<br />
                    大部分的人從來沒真的聽過它們
                </p>

                <Link href="/courses/ear-opening/intro" style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg,#38bdf8,#10b981)',
                    color: '#020617',
                    fontWeight: '900',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.2)'
                }}>
                    🎧 讓我聽一次真的音樂
                </Link>

                {/* ⚡ Killer 心理暗示小字 */}
                <p style={{
                    marginTop: '1rem',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    letterSpacing: '1px'
                }}>
                    ⚠️ 多數人第一次都會嚇到
                </p>
            </div>

            {/* 🎯 總體進度條 */}
            <div style={{ marginBottom: '4rem', background: 'rgba(30,41,59,0.4)', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>製作人覺醒進度</span>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{currentStep} / 5</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #10b981)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
                </div>
            </div>

            {/* 🧭 主標 */}
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.8rem', color: '#fff', fontWeight: 'bold' }}>
                不是選課，是開始聽懂聲音
            </h2>

            {/* =========================================
                🔥 新手村主軸 (Step 0 ~ Step 4)
            ========================================= */}

            {/* 🎧 STEP 0: 聽覺啟蒙 */}
            <div style={stepWrapper}>
                <div style={{ ...badgeStyle, color: '#fca311', borderColor: 'rgba(252, 163, 17, 0.3)' }}>STEP 0 / 啟蒙</div>
                <Link href="/courses/ear-opening/intro" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={{ ...stepCard }}
                        onMouseOver={e => { e.currentTarget.style.border = '1px solid #fca311'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
                        <h3 style={{ color: '#fca311', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>你真的有在聽音樂嗎？</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>在學技術之前，先確認你「有沒有真的聽到」。這幾個體驗會打破你的聽覺認知。</p>
                        <div style={{ marginTop: '1.5rem', color: '#fca311', fontWeight: 'bold' }}>看看我漏掉了什麼 ➔</div>
                    </div>
                </Link>
            </div>

            <Arrow />

            {/* 🎹 STEP 1: 基礎編曲 */}
            <div style={stepWrapper}>
                <div style={{ ...badgeStyle, color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>STEP 1 / 建構</div>
                <Link href="/courses/arrangement/intro" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={{ ...stepCard }}
                        onMouseOver={e => { e.currentTarget.style.border = '1px solid #10b981'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎹</div>
                        <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎編曲學</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>從 0 到 1，不再亂堆聲音。學會讓聲音一開始就「不打架」，建立穩固的音樂骨架。</p>
                        <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>開始建構 ➔</div>
                    </div>
                </Link>
            </div>

            <Arrow />

            {/* 🎛️ STEP 2: 基礎混音 */}
            <div style={stepWrapper}>
                <div style={{ ...badgeStyle, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>STEP 2 / 控制</div>
                <Link href="/courses/mixing/intro" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={{ ...stepCard }}
                        onMouseOver={e => { e.currentTarget.style.border = '1px solid #38bdf8'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎混音學</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>不是讓聲音變好聽，而是讓你「知道自己在幹嘛」。從混亂到可控，第一次真正聽懂聲音。</p>
                        <div style={{ marginTop: '1.5rem', color: '#38bdf8', fontWeight: 'bold' }}>開始掌控 ➔</div>
                    </div>
                </Link>
            </div>

            <Arrow />

            {/* 🔥 STEP 3: 聽覺試煉 */}
            <div style={stepWrapper}>
                <div style={{ ...badgeStyle, color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.3)' }}>STEP 3 / 實戰</div>
                <Link href="/training" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={{ ...stepCard, background: 'linear-gradient(145deg, rgba(234, 88, 12, 0.1), rgba(15, 23, 42, 1))' }}
                        onMouseOver={e => { e.currentTarget.style.border = '1px solid #ea580c'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                        <h3 style={{ color: '#f97316', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>聽覺試煉大廳</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>看懂不代表會。進來這裡，親自轉動旋鈕，用耳朵驗證你真的會了。</p>
                        <div style={{ marginTop: '1.5rem', color: '#f97316', fontWeight: 'bold' }}>進入實戰 ➔</div>
                    </div>
                </Link>
            </div>

            <Arrow />

            {/* 🎓 STEP 4: 新手測驗 */}
            <div style={stepWrapper}>
                <div style={{ ...badgeStyle, color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.5)' }}>STEP 4 / 驗證</div>
                <Link href="/certification/novice" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={{ ...stepCard, border: '1px dashed rgba(16, 185, 129, 0.5)' }}
                        onMouseOver={e => { e.currentTarget.style.border = '1px solid #10b981'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { e.currentTarget.style.border = '1px dashed rgba(16, 185, 129, 0.5)'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                        <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>新手村畢業測驗</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>當你能夠判斷，而不是用猜的，你就過關了。用 12 題確認你跨過了那條線！</p>
                        <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>證明自己 ➔</div>
                    </div>
                </Link>
            </div>

            <div style={{ margin: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

            {/* =========================================
                🌟 深水區 (高階課程與最終試煉)
            ========================================= */}
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: '#fff', fontWeight: '900', letterSpacing: '2px' }}>
                下一階段：做別人聽得出差別的作品
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                {/* 高階編曲區 */}
                <div style={{
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', padding: '2.5rem', borderRadius: '24px', border: '1px solid #f97316',
                    boxShadow: '0 20px 50px rgba(249, 115, 22, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎼</div>
                    <h3 style={{ color: '#f97316', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold' }}>高階編曲學</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                        問題不是混音不夠強，而是你一開始就寫錯了。學會讓聲音「自動不打架」的編曲邏輯。
                    </p>
                    <Link href="/pricing" style={{
                        padding: '1.2rem', background: '#f97316', color: '#020617', textAlign: 'center',
                        borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none', display: 'block'
                    }}>
                        解鎖進階思維 ➔
                    </Link>
                </div>

                {/* 高階混音區 */}
                <div style={{
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', padding: '2.5rem', borderRadius: '24px', border: '1px solid #3b82f6',
                    boxShadow: '0 20px 50px rgba(59, 130, 246, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎚️</div>
                    <h3 style={{ color: '#3b82f6', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold' }}>高階混音學</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                        從「調整聲音」進入「控制空間」。掌握前後距離、空間深度，讓作品第一次有專業感。
                    </p>
                    <Link href="/pricing" style={{
                        padding: '1.2rem', background: '#3b82f6', color: '#fff', textAlign: 'center',
                        borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none', display: 'block'
                    }}>
                        解鎖專業能力 ➔
                    </Link>
                </div>
            </div>

            {/* 🏆 最終試煉 */}
            <div style={{
                padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(139, 92, 246, 0.05))', borderRadius: '32px',
                border: '1px solid #a78bfa', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.2)'
            }}>
                <span style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 'bold', letterSpacing: '4px' }}>MASTER EXAM</span>
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '1rem 0', fontWeight: '900' }}>最終試煉：大師認證</h2>
                <p style={{ color: '#e2e8f0', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.6' }}>
                    這不是考試，是你是否真的「聽懂聲音」的分水嶺。<br />當你通過，你已經不再需要依賴教學。
                </p>
                <Link href="/certification/master" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#a78bfa', color: '#020617', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '900', borderRadius: '50px', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)' }}>
                    👑 挑戰最終試煉
                </Link>
            </div>

            {/* 加入 CSS 動畫 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
            `}} />

        </div>
    );
}