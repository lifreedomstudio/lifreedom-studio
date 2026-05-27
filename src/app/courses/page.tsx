"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CoursesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // 佈署守門員：驗證登入狀態
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const [isMobile, setIsMobile] = useState(false);
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

    const basicCardStyle = {
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '1rem' : '3rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* 🔝 頂部導覽列 */}
            <div style={{
                display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '1.5rem' : '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem'
            }}>
                <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fca311', margin: 0, lineHeight: '1.4', fontWeight: '900' }}>
                    Lifreedom Studio <br style={{ display: isMobile ? 'block' : 'none' }} /> Lifreedom Studio
                    製作人訓練總部
                </h1>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                    <Link href="/pricing" style={{ padding: '0.8rem 1.2rem', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid #facc15', borderRadius: '8px', textDecoration: 'none', color: '#facc15', fontWeight: 'bold', textAlign: 'center' }}>
                        💎 訂閱方案
                    </Link>
                    <Link href="/collection" style={{ padding: '0.8rem 1.2rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textDecoration: 'none', color: '#cbd5e1', fontWeight: 'bold', textAlign: 'center' }}>
                        📜 魔法圖鑑
                    </Link>
                    <button onClick={() => router.push('/mix-assistant')} style={{ padding: '0.8rem 1.2rem', background: 'linear-gradient(135deg, #3c096c, #5a189a)', color: 'white', border: '1px solid #9d4edd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 15px rgba(60, 9, 108, 0.4)' }}>
                        🤖 召喚專屬 AI 助理
                    </button>
                </div>
            </div>

            {/* 📖 1. 混音魔導書傳送門 */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem', background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', borderRadius: '24px', border: '1px solid #4f46e5', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: '#a78bfa', margin: '0 0 1rem 0', fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 'bold' }}>卡住了？那不是你不會
                    是你缺一個「翻譯器」</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>所有你看不懂的專有名詞，
                    都在這裡變成「你聽得懂的東西」，

                    隨時查閱，隨時升級理解力</p>
                <Link href="/glossary" style={{ display: 'inline-block', padding: '14px 32px', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    📖 打開你的混音翻譯器
                </Link>
            </div>

            {/* 🌱 2. 基礎課程區 (新手村) */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem', color: '#fff', fontWeight: 'bold' }}>
                    新手村：從「聽不懂」到「開始掌控」
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* 基礎編曲學 */}
                    <Link href="/courses/arrangement/intro" style={{ textDecoration: 'none' }}>
                        <div style={{ ...basicCardStyle }}
                            onMouseOver={e => { e.currentTarget.style.border = '1px solid #10b981'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                            onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎹</div>
                            <h3 style={{ color: '#10b981', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎編曲學</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>從 0 到 1，不再亂堆聲音

                                你會開始理解：
                                為什麼有些歌一開始就不會打架，
                                為什麼有些歌天生就很「穩」？

                                掌握 Groove、和弦與音色選擇，
                                寫出真正能被混音的編曲</p>
                            <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>開始建立你的第一個音樂骨架 ➔</div>
                        </div>
                    </Link>

                    {/* 基礎混音學 */}
                    <Link href="/courses/mixing/intro" style={{ textDecoration: 'none' }}>
                        <div style={{ ...basicCardStyle }}
                            onMouseOver={e => { e.currentTarget.style.border = '1px solid #38bdf8'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                            onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                            <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎混音學</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>不是讓聲音變好聽
                                而是讓你「知道自己在幹嘛」，

                                你會第一次聽懂：
                                EQ 到底改了什麼？
                                Compressor 為什麼有差？
                                聲音為什麼會變乾淨？

                                從混亂 → 可控</p>
                            <div style={{ marginTop: '1.5rem', color: '#38bdf8', fontWeight: 'bold' }}>第一次真正聽懂混音 ➔</div>
                        </div>
                    </Link>

                </div>
            </div>

            {/* ⚔️ 3. 免費體驗區導流 (聽覺試煉大廳) */}
            <div style={{
                marginBottom: '4rem', padding: isMobile ? '2rem 1.5rem' : '3rem',
                background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.1))', borderRadius: '24px',
                border: '1px solid rgba(234, 88, 12, 0.3)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '2rem'
            }}>
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 'bold', letterSpacing: '3px' }}>TRAINING HUB</span>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: '0.5rem 0 1rem 0' }}>聽覺試煉大廳</h2>
                    <p style={{ color: '#fed7aa', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>看懂，不代表你會。

                        進來這裡，
                        用耳朵證明你真的學會了！

                        親自轉動旋鈕，
                        親自聽出差異，
                        把「知道」變成「能力」</p>
                </div>
                <Link href="/training" style={{ padding: '1.2rem 2rem', background: '#ea580c', color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: '900', borderRadius: '16px', boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    🔥 進入實戰，驗證你的耳朵
                </Link>
            </div>

            {/* 🎖️ 4. 新手綜合理論認證 */}
            <div style={{
                marginBottom: '6rem', padding: '2rem', textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', border: '1px dashed #10b981'
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
                <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem' }}>新手村畢業測驗</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>當你能夠判斷，而不是猜，

                    你就已經不是新手了。

                    用 12 題，確認你真的跨過那條線！</p>
                <Link href="/certification/novice" style={{ display: 'inline-block', padding: '0.8rem 2rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none' }}>
                    開始你的第一次證明
                </Link>
            </div>

            {/* 🌟 5. 高階修煉地圖 (深水區) - 已無縫整合訂閱頁面 */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: '#fff', fontWeight: '900', letterSpacing: '2px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    下一階段：開始做出「別人聽得出來差別」的作品
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* 高階編曲區 */}
                    <div style={{
                        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', padding: '2.5rem', borderRadius: '24px', border: '1px solid #f97316',
                        boxShadow: '0 20px 50px rgba(249, 115, 22, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎼</div>
                        <h3 style={{ color: '#f97316', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            高階編曲學
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                            問題不是混音不夠強，
                            而是你一開始就寫錯了。

                            學會讓聲音「自動不打架」的編曲邏輯，

                            讓你的音樂在還沒混音前，
                            就已經贏一半。
                        </p>
                        <Link href="/pricing" style={{
                            padding: '1.2rem', background: '#f97316', color: '#020617', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none', display: 'block'
                        }}>
                            解鎖編曲進階思維 ➔
                        </Link>
                    </div>

                    {/* 高階混音區 */}
                    <div style={{
                        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', padding: '2.5rem', borderRadius: '24px', border: '1px solid #3b82f6',
                        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎚️</div>
                        <h3 style={{ color: '#3b82f6', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            高階混音學
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                            從「調整聲音」進入「控制空間」

                            你會開始掌握：
                            前後距離、
                            空間深度、
                            聲音層次。

                            讓你的作品第一次有「專業感」。
                        </p>
                        <Link href="/pricing" style={{
                            padding: '1.2rem', background: '#3b82f6', color: '#fff', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none', display: 'block'
                        }}>
                            解鎖專業混音能力 ➔
                        </Link>
                    </div>

                </div>
            </div>

            {/* 🏆 6. 高階大師綜合理論認證 */}
            <div style={{
                margin: '4rem 0', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(139, 92, 246, 0.05))', borderRadius: '32px',
                border: '1px solid #a78bfa', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.2)'
            }}>
                <span style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 'bold', letterSpacing: '4px' }}>MASTER EXAM</span>
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '1rem 0', fontWeight: '900' }}>最終試煉：大師認證</h2>
                <p style={{ color: '#e2e8f0', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.6' }}>這不是考試，

                    是你是否真的「聽懂聲音」的分水嶺，

                    當你通過，
                    你已經不再需要依賴教學。</p>
                <Link href="/certification/master" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#a78bfa', color: '#020617', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '900', borderRadius: '50px', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)' }}>
                    👑 挑戰最終試煉
                </Link>
            </div>

        </div>
    );
}