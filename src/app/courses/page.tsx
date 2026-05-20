"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 👈 1. 補上這行：叫出驗票機器

export default function CoursesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // 👈 1. 新增驗票讀取狀態

    // 👇 2. 佈署守門員：耐力加強版（給 Magic Link 緩衝時間）
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

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '1rem' : '3rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* 🔝 1. 頂部導覽列 */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '1.5rem' : '1rem',
                marginBottom: '3rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1.5rem'
            }}>
                <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', color: '#fca311', margin: 0, lineHeight: '1.4', fontWeight: '900' }}>
                    Lifreedom Studio <br style={{ display: isMobile ? 'block' : 'none' }} /> 製作人總部
                </h1>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                    <Link href="/collection" style={{
                        padding: '0.8rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24',
                        borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', textAlign: 'center'
                    }}>
                        📜 魔法圖鑑
                    </Link>
                    <button onClick={() => router.push('/mix-assistant')} style={{
                        padding: '0.8rem 1.2rem', background: 'linear-gradient(135deg, #3c096c, #5a189a)', color: 'white', border: '1px solid #9d4edd',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 15px rgba(60, 9, 108, 0.4)'
                    }}>
                        🤖 召喚專屬 AI 助理
                    </button>
                </div>
            </div>

            {/* 📖 2. 混音魔導書傳送門 (保留) */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem', background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', borderRadius: '24px', border: '1px solid #4f46e5', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: '#a78bfa', margin: '0 0 1rem 0', fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 'bold' }}>碰到看不懂的專有名詞？</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6' }}>點擊查閱專屬字彙庫，包含 40+ 混音神技與硬體圖鑑，隨時補充電力。</p>
                <Link href="/glossary" style={{ display: 'inline-block', padding: '14px 32px', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    📖 翻閱混音魔導書
                </Link>
            </div>

            {/* ⚔️ 3. 免費體驗區導流 (原聽覺道場) */}
            <div style={{
                marginBottom: '4rem', padding: isMobile ? '2rem 1.5rem' : '3rem',
                background: 'rgba(234, 88, 12, 0.05)', borderRadius: '24px',
                border: '1px solid rgba(234, 88, 12, 0.3)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '2rem'
            }}>
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 'bold', letterSpacing: '3px' }}>FREE TRAINING HUB</span>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: '0.5rem 0 1rem 0' }}>聽覺試煉大廳</h2>
                    <p style={{ color: '#fed7aa', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>還沒準備好進入高階區？先到免費道場親自轉動旋鈕，挑戰 EQ 掃頻與 Compressor 的動態掌控。</p>
                </div>
                <Link href="/training" style={{ padding: '1.2rem 2rem', background: '#ea580c', color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: '900', borderRadius: '16px', boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    🔥 進入免費道場
                </Link>
            </div>

            {/* 🌟 4. 高階修煉地圖 (取代原本的第一第二層) */}
            <div style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: '#fff', fontWeight: '900', letterSpacing: '2px' }}>
                    解鎖高階製作人地圖
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* 高階編曲區 (Advanced Arrangement) */}
                    <div style={{
                        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                        padding: '2.5rem', borderRadius: '24px', border: '1px solid #f97316',
                        boxShadow: '0 20px 50px rgba(249, 115, 22, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎹</div>
                        <h3 style={{ color: '#f97316', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '2rem' }}>🎹</span> 高階編曲學
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                            混音的災難，往往始於編曲的碰撞。<br /><br />
                            跳脫單純的樂理，學習「邏輯化」的配器思維。掌握八度音錯位、頻段切割法則，以及如何利用合成器與取樣（Sample）建立層次，在源頭就寫出不打架的完美劇本。
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#fdba74', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>頻段配器法</span>
                            <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#fdba74', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>八度音錯位</span>
                            <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#fdba74', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>AI 輔助編曲</span>
                        </div>
                        <Link href="/courses/arrangement/advanced" style={{
                            padding: '1.2rem', background: '#f97316', color: '#020617', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none'
                        }}>
                            解鎖高階編曲 ➔
                        </Link>
                    </div>

                    {/* 高階混音區 (Advanced Mixing) */}
                    <div style={{
                        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                        padding: '2.5rem', borderRadius: '24px', border: '1px solid #3b82f6',
                        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>🎛️</div>
                        <h3 style={{ color: '#3b82f6', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '2rem' }}>🎛️</span> 高階混音學
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                            超越基礎 EQ 與壓縮，邁向 3D 空間管理的領域。<br /><br />
                            學習好萊塢級的空間配置。透過 Reverb/Delay 發送建立深邃的前後景，運用 Saturation (飽和度) 增加昂貴的硬體染色，並掌握 Bus 總線平行壓縮技巧，打造具備商業競爭力的寬廣聽感。
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>空間魔法 (Reverb/Delay)</span>
                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>飽和度染色</span>
                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>平行壓縮</span>
                        </div>
                        <Link href="/courses/mixing/advanced" style={{
                            padding: '1.2rem', background: '#3b82f6', color: '#fff', textAlign: 'center',
                            borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', textDecoration: 'none'
                        }}>
                            解鎖高階混音 ➔
                        </Link>
                    </div>

                </div>
            </div>

            {/* 🎓 5. 混音大師綜合認證 (保留) */}
            <div style={{
                margin: '4rem 0', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(79, 70, 229, 0.05))', borderRadius: '32px',
                border: '1px solid #38bdf8', boxShadow: '0 20px 40px rgba(56, 189, 248, 0.15)'
            }}>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '4px' }}>FINAL EXAM</span>
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '1rem 0', fontWeight: '900' }}>大師綜合認證</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.6' }}>完成所有高階訓練後，挑戰實戰模擬測驗。取得 Lifreedom Studio 官方結業證書。</p>
                <Link href="/certification" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#38bdf8', color: '#020617', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '900', borderRadius: '50px', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)' }}>
                    🎯 挑戰認證考試
                </Link>
            </div>

        </div>
    );
}