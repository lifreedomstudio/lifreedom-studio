"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CoursesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) return null;

    const stepCard = {
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textAlign: 'center' as const
    };

    const stepWrapper = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
    };

    const arrow = (
        <div style={{ color: '#64748b', fontSize: '1.5rem' }}>↓</div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: '#020617',
            color: '#fff',
            padding: isMobile ? '1rem' : '3rem 2rem',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'sans-serif'
        }}>

            {/* 🔝 Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem'
            }}>
                <h1 style={{ color: '#fca311', fontWeight: '900' }}>
                    Lifreedom Studio
                </h1>

                {/* 📖 字彙表 → 降級成工具 */}
                <Link href="/glossary" style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px'
                }}>
                    📖 字彙翻譯器
                </Link>
            </div>

            {/* 🧭 主標 */}
            <h2 style={{
                textAlign: 'center',
                marginBottom: '3rem',
                fontSize: '1.5rem',
                color: '#cbd5e1'
            }}>
                不是選課，是開始聽懂聲音
            </h2>

            {/* 🎧 STEP 1 */}
            <div style={stepWrapper}>
                <Link href="/ear-opening" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={stepCard}>
                        <div style={{ fontSize: '2.5rem' }}>🎧</div>
                        <h3 style={{ color: '#38bdf8' }}>你真的有在聽音樂嗎？</h3>
                        <p style={{ color: '#94a3b8' }}>
                            在學之前，先確認你「有沒有真的聽到」
                        </p>
                        <div style={{ marginTop: '1rem', color: '#38bdf8' }}>
                            開始體驗 ➔
                        </div>
                    </div>
                </Link>
            </div>

            {arrow}

            {/* 🎹 STEP 2 編曲 */}
            <div style={stepWrapper}>
                <Link href="/courses/arrangement/intro" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={stepCard}>
                        <div style={{ fontSize: '2.5rem' }}>🎹</div>
                        <h3 style={{ color: '#10b981' }}>基礎編曲</h3>
                        <p style={{ color: '#94a3b8' }}>
                            讓聲音一開始就「不打架」
                        </p>
                        <div style={{ marginTop: '1rem', color: '#10b981' }}>
                            建立音樂骨架 ➔
                        </div>
                    </div>
                </Link>
            </div>

            {arrow}

            {/* 🎛️ STEP 3 混音 */}
            <div style={stepWrapper}>
                <Link href="/courses/mixing/intro" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={stepCard}>
                        <div style={{ fontSize: '2.5rem' }}>🎛️</div>
                        <h3 style={{ color: '#38bdf8' }}>基礎混音</h3>
                        <p style={{ color: '#94a3b8' }}>
                            從混亂到可控，第一次真正聽懂聲音
                        </p>
                        <div style={{ marginTop: '1rem', color: '#38bdf8' }}>
                            開始掌控 ➔
                        </div>
                    </div>
                </Link>
            </div>

            {arrow}

            {/* 🔥 STEP 4 试炼 */}
            <div style={stepWrapper}>
                <Link href="/training" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={stepCard}>
                        <div style={{ fontSize: '2.5rem' }}>🔥</div>
                        <h3 style={{ color: '#f97316' }}>聽覺試煉</h3>
                        <p style={{ color: '#94a3b8' }}>
                            用耳朵驗證你真的會了
                        </p>
                        <div style={{ marginTop: '1rem', color: '#f97316' }}>
                            進入實戰 ➔
                        </div>
                    </div>
                </Link>
            </div>

            {arrow}

            {/* 🎓 STEP 5 測驗 */}
            <div style={stepWrapper}>
                <Link href="/certification/novice" style={{ textDecoration: 'none', width: '100%' }}>
                    <div style={stepCard}>
                        <div style={{ fontSize: '2.5rem' }}>🎓</div>
                        <h3 style={{ color: '#10b981' }}>新手測驗</h3>
                        <p style={{ color: '#94a3b8' }}>
                            當你不再用猜的，你就過關了
                        </p>
                        <div style={{ marginTop: '1rem', color: '#10b981' }}>
                            證明自己 ➔
                        </div>
                    </div>
                </Link>
            </div>

        </div>
    );
}