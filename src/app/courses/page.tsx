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
                // 如果第一時間沒看到 session，再深度檢查一次 user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login'); // 真的沒票，才踢回登入頁
                } else {
                    setLoading(false); // 有票，放行
                }
            } else {
                setLoading(false); // 有票，放行
            }
        };
        checkUser();
    }, [router]);

    // 👇 3. 這是你原本偵測手機版的邏輯 (保持不變)
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 👇 4. 攔截器：如果還在驗票中，顯示帥氣的過場畫面
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

    // 🎨 統一卡片樣式設定
    const cardStyle = {
        background: 'rgba(20,20,30,0.7)',
        padding: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        minHeight: '220px',
        transition: 'all 0.3s ease'
    };

    // 🤖 快捷詢問按鈕組件
    const AskAssistantBtn = ({ question }: { question: string }) => (
        <Link
            href={`/mix-assistant?query=${encodeURIComponent(question)}`}
            style={{
                marginTop: '1rem', padding: '10px 12px', background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px',
                color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none',
                textAlign: 'center', fontWeight: 'bold', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
        >
            💡 想知道詳細做法？問混音助理
        </Link>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '1rem' : '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* 🔝 1. 頂部導覽列 */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '1.5rem' : '1rem',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1.5rem'
            }}>
                <h1 style={{ fontSize: isMobile ? '1.6rem' : '1.8rem', color: '#fca311', margin: 0, lineHeight: '1.4' }}>
                    📚 Lifreedom Studio <br style={{ display: isMobile ? 'block' : 'none' }} /> 修煉道場
                </h1>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                    <Link href="/collection" style={{
                        padding: '0.8rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24',
                        borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', textAlign: 'center'
                    }}>
                        📜 魔法圖鑑
                    </Link>
                    <button onClick={() => router.push('/mix-assistant')} style={{
                        padding: '0.8rem 1.2rem', background: '#3c096c', color: 'white', border: '1px solid #9d4edd',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center'
                    }}>
                        🤖 找混音助理協助
                    </button>
                </div>
            </div>

            {/* 📖 2. 混音魔導書傳送門 */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', padding: isMobile ? '1.5rem' : '2.5rem', background: 'linear-gradient(145deg, #0f172a, #1e1b4b)', borderRadius: '20px', border: '1px solid #4f46e5', boxShadow: '0 0 30px rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: '#a78bfa', margin: '0 0 1rem 0', fontSize: isMobile ? '1.3rem' : '1.6rem' }}>碰到看不懂的專有名詞？</h2>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>點擊查閱專屬字彙庫，包含 40+ 混音神技與硬體圖鑑。</p>
                <Link href="/glossary" style={{ display: 'inline-block', padding: '12px 24px', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
                    📖 翻閱混音魔導書
                </Link>
            </div>

            {/* 🌟 3. 新增區塊：選擇你的修練路徑 (編曲 vs 混音) */}
            <div style={{ marginBottom: '4rem', padding: '1rem 0' }}>
                <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', color: '#fff', letterSpacing: '2px' }}>
                    選擇你的修練路徑
                </h2>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'
                }}>
                    {/* 編曲區入口 */}
                    <Link href="/courses/arrangement/intro" style={{ textDecoration: 'none' }}>
                        <div style={{
                            ...cardStyle,
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            background: 'linear-gradient(180deg, rgba(20,20,30,0.8) 0%, rgba(249,115,22,0.05) 100%)',
                            boxShadow: '0 10px 30px rgba(249,115,22,0.1)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.3)'}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎹</div>
                            <h3 style={{ color: '#f97316', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>編曲學 (Arrangement)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>從 0 到 1 的劇本設計。學會建立 Groove、錯開樂器頻率與把位，為樂團寫出不打架的完美劇本。</p>
                            <div style={{ marginTop: '1.5rem', color: '#f97316', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                進入新手村 <span>➔</span>
                            </div>
                        </div>
                    </Link>

                    {/* 混音區入口 */}
                    <Link href="/courses/mixing/intro" style={{ textDecoration: 'none' }}>
                        <div style={{
                            ...cardStyle,
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            background: 'linear-gradient(180deg, rgba(20,20,30,0.8) 0%, rgba(59,130,246,0.05) 100%)',
                            boxShadow: '0 10px 30px rgba(59,130,246,0.1)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)'}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎛️</div>
                            <h3 style={{ color: '#3b82f6', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>混音學 (Mixing)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>從 1 到 100 的團隊管理學。不只調音量，更要學會安排立體舞台與頻率專屬領域，達到業界標準。</p>
                            <div style={{ marginTop: '1.5rem', color: '#3b82f6', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                進入新手村 <span>➔</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* 🟦 4. 第一層：基礎心法 (原有內容保留) */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '24px', background: '#38bdf8', borderRadius: '2px' }}></span>
                    第一層：基礎心法 (新手村)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fca311', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🎚️ Gain Staging 增益架構</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>混音的第一步。確保輸入訊號不破音，並留出健康的 Headroom。</p>
                        </div>
                        <AskAssistantBtn question="如何做好 Gain Staging 並留出健康的 Headroom？" />
                    </div>
                    {/* ... 略過其他卡片保持原樣 ... */}
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fca311', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🎛️ EQ 頻率分布指南</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>學會分配空間。透過削減 (Cut) 來解決吉他與主唱的頻率衝突。</p>
                        </div>
                        <AskAssistantBtn question="如何用 EQ 解決吉他與主唱的頻率打架問題？" />
                    </div>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#a78bfa', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🗜️ Compressor 奧義</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>掌握動態的忍耐極限。讓聲音聽起來結實、有力且不突兀。</p>
                        </div>
                        <AskAssistantBtn question="請用白話文解釋 Compressor 的 Threshold 和 Attack 該怎麼調？" />
                    </div>
                </div>
            </div>

            {/* 🟧 5. 第二層：實戰工作流程 (原有內容保留) */}
            <div style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '24px', background: '#f59e0b', borderRadius: '2px', boxShadow: '0 0 10px #f59e0b' }}></span>
                    第二層：實戰工作流程
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {/* 這裡面的卡片我也幫你保留了，沒有更動 */}
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🎙️ Vocal Chain 人聲處理</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>打造現代流行樂人聲。從除齒音到壓實動態，讓聲音極致靠前。</p>
                        </div>
                        <AskAssistantBtn question="如何建立一條專業的人聲處理鏈 (Vocal Chain)？" />
                    </div>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🧩 Glue 黏合術</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>利用總線壓縮把音軌「黏」在一起，創造唱片級的整體感。</p>
                        </div>
                        <AskAssistantBtn question="如何使用 Bus Compressor 做出 Glue 黏合感？" />
                    </div>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🔗 Sidechain 側鏈</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>騰出低頻空間。讓 Kick 穿透，讓 Bass 讓路，節奏拳拳到肉。</p>
                        </div>
                        <AskAssistantBtn question="如何設定 Sidechain 讓 Kick 跟 Bass 不再打架？" />
                    </div>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🎸 Ensemble 群奏擴展</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>單把吉他太單薄？利用 Ensemble 效果創造出寬廣立體感。</p>
                        </div>
                        <AskAssistantBtn question="如何使用 Ensemble 效果來增加樂器的寬廣度？" />
                    </div>
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🏓 Ping Pong Delay</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>左右橫跳的延遲效果。填補空間且不弄髒混音。</p>
                        </div>
                        <AskAssistantBtn question="如何製作專業的 Ping Pong Delay 效果？" />
                    </div>
                </div>
            </div>

            {/* ⚔️ 6. 聽覺極限道場 (原有內容保留) */}
            <div style={{
                margin: '4rem 0', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', textAlign: 'center',
                background: 'rgba(234, 88, 12, 0.03)', borderRadius: '24px',
                border: '2px solid #ea580c', boxShadow: '0 0 40px rgba(234, 88, 12, 0.1)'
            }}>
                <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 'bold', letterSpacing: '4px' }}>TRAINING DOJO</span>
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.2rem', margin: '1rem 0' }}>聽覺試煉場</h2>
                <p style={{ color: '#fed7aa', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1rem' }}>親自轉動旋鈕，訓練你的耳朵捕捉頻率的微小變化。</p>
                <Link href="/training" style={{ display: 'inline-block', padding: '1rem 2rem', background: '#ea580c', color: '#fff', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 'bold', borderRadius: '8px' }}>
                    🔥 進入道場自主練習
                </Link>
            </div>

            {/* 🎓 7. 混音大師綜合認證 (原有內容保留) */}
            <div style={{
                margin: '4rem 0', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', textAlign: 'center',
                background: 'rgba(56, 189, 248, 0.03)', borderRadius: '24px',
                border: '2px solid #38bdf8', boxShadow: '0 0 40px rgba(56, 189, 248, 0.1)'
            }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '4px' }}>FINAL EXAM</span>
                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.2rem', margin: '1rem 0' }}>大師綜合認證</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: isMobile ? '0.95rem' : '1rem' }}>挑戰 10 題實戰模擬。拿取 Lifreedom Studio 結業證書。</p>
                <Link href="/certification" style={{ display: 'inline-block', padding: '1rem 2rem', background: '#38bdf8', color: '#020617', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.3rem', fontWeight: '900', borderRadius: '50px' }}>
                    🎯 開始專業認證考試
                </Link>
            </div>

        </div>
    );
}