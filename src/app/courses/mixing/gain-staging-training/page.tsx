"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🌊 1. 波形與爆音 (Clipping) 視覺對照圖 ---
const WaveformClippingVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%', marginTop: '20px' }}>
        {/* 健康波形 */}
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}><i className="fa-solid fa-check-circle"></i> 健康波形 (有 Headroom)</p>
                <span style={{ background: '#10b981', color: '#020617', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>-12dB ~ -6dB</span>
            </div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                {/* 0dB 天花板 */}
                <line x1="0" y1="10" x2="200" y2="10" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                <text x="5" y="22" fill="#ef4444" fontSize="10">0dB (死亡天花板)</text>
                {/* 波形 */}
                <path d="M0,50 L20,30 L40,70 L50,40 L70,25 L90,80 L110,45 L130,20 L150,60 L180,35 L200,50" fill="none" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', marginTop: '15px', lineHeight: '1.6' }}>聲音有高有低，保留了完整的動態呼吸感。距離 0dB 還有安全距離，不怕後續加效果器會破表。</p>
        </div>

        {/* 爆音波形 */}
        <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}><i className="fa-solid fa-triangle-exclamation"></i> 數位爆音 (Clipping)</p>
                <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>&gt; 0dB</span>
            </div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                {/* 0dB 天花板 */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#ef4444" strokeWidth="2" />
                <line x1="0" y1="80" x2="200" y2="80" stroke="#ef4444" strokeWidth="2" />
                {/* 被切平的波形 */}
                <path d="M0,50 L10,20 L30,20 L40,80 L60,80 L70,20 L100,20 L110,80 L130,80 L140,20 L170,20 L180,80 L200,50" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinejoin="miter" />
                {/* 標示切平處 */}
                <rect x="10" y="18" width="20" height="4" fill="#ef4444" />
                <rect x="70" y="18" width="30" height="4" fill="#ef4444" />
                <rect x="140" y="18" width="30" height="4" fill="#ef4444" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', marginTop: '15px', lineHeight: '1.6' }}>錄音時輸入音量太大，撞到 0dB 天花板，波形頂端被「強制切平」，產生無法修復的破音 (Distortion) 雜訊。</p>
        </div>
    </div>
);

// --- 🎙️ 2. 宅錄防呆指南卡片 ---
const RecordingHackCard = ({ num, title, desc, icon, color }: { num: string, title: string, desc: string, icon: string, color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}40`, borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '6rem', color: `${color}15`, fontWeight: '900', zIndex: 0 }}>{num}</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '50px', height: '50px', background: `${color}20`, color: color, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', marginBottom: '15px' }}>
                <i className={icon}></i>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>{title}</h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
        </div>
    </div>
);

// --- 📖 課程主頁面 ---
export default function GainStagingTraining() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 01 : THE SOURCE
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Gain Staging<br />源頭管理與防爆音
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        業界鐵則：「Garbage in, garbage out (垃圾進，垃圾出)」。<br />沒有任何一顆神級 EQ 或 Compressor，能救得回一軌從源頭就錄壞的聲音。
                    </p>
                </header>

                {/* 1. 波形與防爆音 (Clipping) */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#3b82f6', marginBottom: '1.5rem', borderLeft: '8px solid #2563eb', paddingLeft: '20px', fontWeight: 'bold' }}>
                        1. 數位錄音的死神：爆音 (Clipping)
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        在類比磁帶時代，聲音稍微錄得太大聲，會產生一種溫暖的飽和感。但在現今的「數位 DAW」裡，只要音量超過 <strong style={{ color: '#ef4444' }}>0dB (零分貝)</strong>，多出來的聲音就會被無情地「削平」，變成刺耳、難聽的雜訊。
                    </p>

                    <WaveformClippingVisual isMobile={isMobile} />

                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed #3b82f6', padding: '20px', borderRadius: '16px', marginTop: '30px' }}>
                        <h4 style={{ color: '#3b82f6', margin: '0 0 10px 0', fontSize: '1.2rem' }}>📐 黃金錄音音量：-18dB 到 -12dB</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                            永遠不要讓你的錄音軌道亮起紅燈！錄音時，請確保音量的 Peak (最大值) 落在 <strong>-12dB 到 -6dB</strong> 之間，平均音量落在 <strong>-18dB</strong> 左右。這樣你就能保留充足的 <strong>Headroom (安全動態空間)</strong>，讓後續混音有發揮的餘地。
                        </p>
                    </div>
                </section>

                {/* 2. 零成本宅錄神技 (IG 貼文精華轉化) */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '1.5rem', borderLeft: '8px solid #059669', paddingLeft: '20px', fontWeight: 'bold' }}>
                        2. 源頭品管：零成本宅錄系統
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                        就算只用手機錄音，只要掌握這四個環境與格式設定的訣竅，你也能獲得乾淨、高品質的混音素材。
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                        <RecordingHackCard
                            num="01" color="#10b981" icon="fa-solid fa-headphones"
                            title="伴奏入耳，徹底隔離"
                            desc="永遠戴著耳機聽伴奏錄音！千萬不能讓伴奏從喇叭播出來被麥克風錄進去，這種「漏音 (Bleed)」會讓後續混音完全無法單獨處理人聲。"
                        />
                        <RecordingHackCard
                            num="02" color="#f59e0b" icon="fa-solid fa-shirt"
                            title="天然吸音牆：衣櫥"
                            desc="避開冷氣風聲與空曠房間的回音 (Reverb)。拉開你的衣櫥，充滿軟布料的衣服堆，就是世界上最棒的天然吸音棉！"
                        />
                        <RecordingHackCard
                            num="03" color="#38bdf8" icon="fa-solid fa-file-audio"
                            title="無損音質：WAV 格式"
                            desc="MP3 是一種破壞性壓縮格式，會閹割掉高低頻細節。錄音與輸出時，請務必選擇 WAV 或 AIFF 等無損格式，保留聲音最完整的靈魂。"
                        />
                        <RecordingHackCard
                            num="04" color="#a855f7" icon="fa-solid fa-magnet"
                            title="精準對位 (Lock-in)"
                            desc="將錄好的手機音檔匯入 DAW 後，第一件事就是找到人聲的「第一個重拍」，精準對齊伴奏的節拍網格 (Downbeat)，確保節奏緊密咬合。"
                        />
                    </div>
                </section>

                {/* 3. Gain Staging 的實戰意義 */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))', padding: isMobile ? '2rem' : '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                            為什麼混音前要先做 Gain Staging？
                        </h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: '1.8', textAlign: 'justify' }}>
                            在掛上任何 EQ 或 Compressor 之前，把所有軌道的音量都統一調降到安全範圍（-18dB 左右），這個動作就叫做 <strong>Gain Staging (增益佈局)</strong>。
                            <br /><br />
                            因為所有的混音效果器（特別是模擬類比硬體的 Plugin），都是預設你的輸入音量是健康的。如果輸入太大聲，效果器就會直接「被塞爆」產生失真。做好 Gain Staging，等於幫你的混音打下最堅固、最乾淨的地基！
                        </p>
                    </div>
                </section>

                {/* 下一章 CTA */}
                <section style={{ textAlign: 'center', padding: '2rem 0 5rem 0' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>源頭乾淨了，準備好分配頻率領空了嗎？</h2>
                    <button
                        onClick={() => router.push('/courses/mixing/eq-training')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', border: 'none',
                            padding: '1.2rem 4rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        進入 2. EQ 頻率分工 ➔
                    </button>
                </section>

            </div>
        </div>
    );
}