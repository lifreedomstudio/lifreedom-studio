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

    // 🎨 基礎區卡片統一樣式
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
                    Lifreedom Studio <br style={{ display: isMobile ? 'block' : 'none' }} /> 製作人總部
                </h1>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                    <Link href="/collection" style={{ padding: '0.8rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', textAlign: 'center' }}>
                        📜 魔法圖鑑
                    </Link>
                    <button onClick={() => router.push('/mix-assistant')} style={{ padding: '0.8rem 1.2rem', background: 'linear-gradient(135deg, #3c096c, #5a189a)', color: 'white', border: '1px solid #9d4edd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 15px rgba(60, 9, 108, 0.4)' }}>
                        🤖 召喚專屬 AI 助理
                    </button>
                </div>
            </div>

            {/* 📖 1. 混音魔導書傳送門 */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem', background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', borderRadius: '24px', border: '1px solid #4f46e5', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: '#a78bfa', margin: '0 0 1rem 0', fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 'bold' }}>碰到看不懂的專有名詞？</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>點擊查閱專屬字彙庫，包含 40+ 混音神技與硬體圖鑑，隨時補充電力。</p>
                <Link href="/glossary" style={{ display: 'inline-block', padding: '14px 32px', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    📖 翻閱混音魔導書
                </Link>
            </div>

            {/* 🌱 2. 基礎課程區 (新手村) */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem', color: '#fff', fontWeight: 'bold' }}>
                    新手村：奠定製作人地基
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* 基礎編曲學 */}
                    <Link href="/courses/arrangement/intro" style={{ textDecoration: 'none' }}>
                        <div style={{ ...basicCardStyle }}
                            onMouseOver={e => { e.currentTarget.style.border = '1px solid #10b981'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                            onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎹</div>
                            <h3 style={{ color: '#10b981', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎編曲學</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>從 0 到 1 寫出不打架的劇本。學會節奏 Groove、基礎和弦配置，以及如何為樂團挑選正確的音色。</p>
                            <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>進入基礎編曲 ➔</div>
                        </div>
                    </Link>

                    {/* 基礎混音學 */}
                    <Link href="/courses/mixing/intro" style={{ textDecoration: 'none' }}>
                        <div style={{ ...basicCardStyle }}
                            onMouseOver={e => { e.currentTarget.style.border = '1px solid #38bdf8'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                            onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                            <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>基礎混音學</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>掌握混音的「三位一體」。從 Gain Staging 增益架構開始，徹底搞懂 EQ 頻率分布與 Compressor 動態壓縮原理。</p>
                            <div style={{ marginTop: '1.5rem', color: '#38bdf8', fontWeight: 'bold' }}>進入基礎混音 ➔</div>
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
                    <p style={{ color: '#fed7aa', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>讀完基礎理論了？進入免費道場，親自轉動旋鈕，挑戰 EQ 掃頻抓蟲與 Compressor 壓縮實戰，驗證你的耳朵！</p>
                </div>
                <Link href="/training" style={{ padding: '1.2rem 2rem', background: '#ea580c', color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: '900', borderRadius: '16px', boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    🔥 進入實戰道場
                </Link>
            </div>

            {/* 🎖️ 4. 新手綜合理論認證 */}
            <div style={{
                marginBottom: '6rem', padding: '2rem', textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', border: '1px dashed #10b981'
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
                <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem' }}>新手綜合理論認證</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>完成基礎課程與道場試煉後，挑戰 10 題觀念測驗，證明你已脫離新手村。</p>
                <Link href="/certification/novice" style={{ display: 'inline-block', padding: '0.8rem 2rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none' }}>
                    開始新手測驗
                </Link>
            </div>

            {/* 🌟 5. 高階修煉地圖 (深水區) */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: '#fff', fontWeight: '900', letterSpacing: '2px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
                    解鎖高階製作人地圖
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
                            混音的災難，往往始於編曲的碰撞。<br /><br />
                            跳脫單純的樂理，學習「邏輯化」的配器思維。掌握八度音錯位、頻段切割法則，以及如何利用合成器與取樣（Sample）建立層次，在源頭就寫出極具商業感的厚實劇本。
                        </p>
                        <Link href="/courses/arrangement/advanced" style={{
                            padding: '1.2rem', background: '#f97316', color: '#020617', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none'
                        }}>
                            解鎖高階編曲 ➔
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
                            超越基礎 EQ 與壓縮，邁向 3D 空間管理的領域。<br /><br />
                            學習好萊塢級的空間配置。透過 Reverb/Delay 發送建立深邃的前後景，運用 Saturation (飽和度) 增加昂貴的硬體染色，並掌握 Bus 總線平行壓縮技巧，打造具備業界競爭力的寬廣聽感。
                        </p>
                        <Link href="/courses/mixing/advanced" style={{
                            padding: '1.2rem', background: '#3b82f6', color: '#fff', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none'
                        }}>
                            解鎖高階混音 ➔
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
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '1rem 0', fontWeight: '900' }}>大師綜合理論認證</h2>
                <p style={{ color: '#e2e8f0', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.6' }}>完成所有高階訓練後，挑戰終極實戰模擬測驗。取得 Lifreedom Studio 官方大師結業證書。</p>
                <Link href="/certification/master" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#a78bfa', color: '#020617', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '900', borderRadius: '50px', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)' }}>
                    👑 挑戰大師認證考試
                </Link>
            </div>

        </div>
    );
}