"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- 🌊 1. 波形與爆音 (Clipping) 視覺對照圖 (加入太小聲的狀況) ---
const WaveformClippingVisual = ({ isMobile }: { isMobile: boolean }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%', marginTop: '20px' }}>

        {/* 1. 太小聲的波形 */}
        <div style={{ flex: 1, background: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#facc15', fontWeight: 'bold', margin: 0 }}><i className="fa-solid fa-volume-low"></i> 太小聲 (底噪危機)</p>
                <span style={{ background: '#facc15', color: '#020617', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>&lt; -24dB</span>
            </div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                {/* 0dB 天花板 */}
                <line x1="0" y1="10" x2="200" y2="10" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                {/* 微弱波形 */}
                <path d="M0,50 L20,48 L40,52 L50,49 L70,53 L90,46 L110,51 L130,48 L150,52 L180,49 L200,50" fill="none" stroke="#facc15" strokeWidth="2" strokeLinejoin="round" />
                {/* 底噪標示 */}
                <path d="M0,55 L20,53 L40,56 L60,54 L80,56 L100,54 L120,56 L140,54 L160,56 L180,54 L200,55" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.5" />
                <text x="5" y="90" fill="#64748b" fontSize="10">底噪 (Noise Floor)</text>
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '15px', lineHeight: '1.6' }}>
                波形幾乎是一條直線。如果你在混音時把這軌「硬拉大聲」，隱藏在背景的冷氣聲、電流聲（底噪）也會跟著被放大，導致聲音變得很髒。
            </p>
        </div>

        {/* 2. 健康波形 */}
        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}><i className="fa-solid fa-check-circle"></i> 健康波形 (有 Headroom)</p>
                <span style={{ background: '#10b981', color: '#020617', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>-18dB ~ -6dB</span>
            </div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <line x1="0" y1="10" x2="200" y2="10" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M0,50 L20,30 L40,70 L50,40 L70,25 L90,80 L110,45 L130,20 L150,60 L180,35 L200,50" fill="none" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '15px', lineHeight: '1.6' }}>
                聲音有高有低，保留完整的動態呼吸感。距離 0dB 天花板還有安全距離，不怕後續疊加效果器會破表。
            </p>
        </div>

        {/* 3. 爆音波形 */}
        <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}><i className="fa-solid fa-triangle-exclamation"></i> 數位爆音 (Clipping)</p>
                <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>&gt; 0dB</span>
            </div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <line x1="0" y1="20" x2="200" y2="20" stroke="#ef4444" strokeWidth="2" />
                <line x1="0" y1="80" x2="200" y2="80" stroke="#ef4444" strokeWidth="2" />
                <path d="M0,50 L10,20 L30,20 L40,80 L60,80 L70,20 L100,20 L110,80 L130,80 L140,20 L170,20 L180,80 L200,50" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinejoin="miter" />
                <rect x="10" y="18" width="20" height="4" fill="#ef4444" />
                <rect x="70" y="18" width="30" height="4" fill="#ef4444" />
                <rect x="140" y="18" width="30" height="4" fill="#ef4444" />
            </svg>
            <p style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '15px', lineHeight: '1.6' }}>
                輸入音量太大撞到 0dB，波形頂端被「強制切平」，會產生刺耳且無法修復的破音 (Distortion) 雜訊。
            </p>
        </div>
    </div>
);

// --- 🎙️ 2. 宅錄防呆指南卡片 (修正版：不裁剪圖片，完整顯示) ---
const RecordingHackCard = ({ num, title, desc, imgSrc, color }: { num: string, title: string, desc: string, imgSrc: string, color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `2px solid ${color}40`, borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* 背景數字 */}
        <div style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '6rem', color: `${color}15`, fontWeight: '900', zIndex: 0 }}>{num}</div>

        {/* 卡片內容區 */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* 🚨 修正：移除固定高度 height: '160px' 改為 height: 'auto'，讓它自然展開 */}
            <div style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden', border: `1px solid ${color}30` }}>
                {/* 🚨 修正：img 設為 width: '100%', height: 'auto'，移除 objectFit: 'cover' */}
                <img src={imgSrc} alt={title} style={{ width: '100%', height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div style="width:100%;height:100px;display:flex;justify-content:center;align-items:center;color:${color}80;font-size:2rem;"><i class="fa-solid fa-image"></i></div>`; }} />
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
                        1. 觀察你的聲音：波形健檢
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        在數位 DAW 裡，音量只要超過 <strong style={{ color: '#ef4444' }}>0dB (零分貝)</strong>，聲音就會被無情地「削平」，變成刺耳的雜訊。但錄得太小聲，又會把隱藏的「底噪」給拉出來。
                    </p>

                    <WaveformClippingVisual isMobile={isMobile} />
                </section>

                {/* 2. 零成本宅錄神技 (IG 貼文精華轉化，準備好放你的圖) */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#10b981', marginBottom: '1.5rem', borderLeft: '8px solid #059669', paddingLeft: '20px', fontWeight: 'bold' }}>
                        2. 源頭品管：零成本宅錄系統
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                        就算只用手機錄音，只要掌握這四個環境與格式設定的訣竅，你也能獲得乾淨、高品質的混音素材。
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                        <RecordingHackCard
                            num="01" color="#10b981"
                            imgSrc="/images/hack-headphone.jpg"
                            title="伴奏不外洩，徹底隔離"
                            desc="永遠戴著耳機聽伴奏錄音！千萬不能讓伴奏從喇叭播出來被麥克風錄進去，這種「漏音 (Bleed)」會讓後續混音完全無法單獨處理人聲。"
                        />
                        <RecordingHackCard
                            num="02" color="#f59e0b"
                            imgSrc="/images/hack-closet.jpg"
                            title="天然吸音牆：衣櫥"
                            desc="避開冷氣風聲與空曠房間的回音 (Reverb)。拉開你的衣櫥，面對充滿軟布料的衣服堆錄音，這就是世界上最棒的天然吸音棉！"
                        />
                        <RecordingHackCard
                            num="03" color="#38bdf8"
                            imgSrc="/images/hack-wav.jpg"
                            title="無損音質：WAV 格式"
                            desc="MP3 是一種破壞性壓縮格式，會閹割掉高低頻細節。錄音與輸出時，請務必選擇 WAV 或 AIFF 等無損格式，保留聲音最完整的靈魂。"
                        />
                        <RecordingHackCard
                            num="04" color="#a855f7"
                            imgSrc="/images/hack-grid.jpg"
                            title="精準對位 (Lock-in)"
                            desc="將錄好的音檔匯入 DAW 後，第一件事就是找到人聲的「第一個字」，精準對齊伴奏的節拍網格 (Grid)，確保節奏緊密咬合。"
                        />
                    </div>
                </section>
                {/* 2.5 名詞釐清：Gain、Volume、Master 差在哪？ */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#facc15', marginBottom: '1.5rem', borderLeft: '8px solid #ca8a04', paddingLeft: '20px', fontWeight: 'bold' }}>
                        必考題：Gain、Volume、Master 差在哪？
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        這三個詞都跟「音量」有關，但它們在混音流程中扮演的角色完全不同。把它想像成一套「自來水系統」：
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#3b82f6', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🚰 1. Gain (增益)</h4>
                            <p style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 5px 0' }}>自來水廠的總水壓</p>
                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                這是**源頭**的訊號大小（進效果器前）。如果水廠水壓太小，你家水龍頭開到底也只有幾滴水（底噪）；如果水壓太大，水管就會爆裂（爆音 Clipping）。
                            </p>
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🎚️ 2. Volume (推桿音量)</h4>
                            <p style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 5px 0' }}>你家廚房的水龍頭</p>
                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                這是聲音經過各種效果器處理後，最後**輸出**的音量（Fader）。你用它來調整這項樂器在整首歌裡的比例（大鼓大聲一點，吉他小聲一點）。它不會改變波形本體。
                            </p>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ color: '#ef4444', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🔊 3. Master (總輸出)</h4>
                            <p style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 5px 0' }}>整棟大樓的總排水管</p>
                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                所有軌道（所有住戶的廢水）最後都會匯集到這裡。如果每軌的 Volume 都推得很高，Master 就會瞬間爆滿亮紅燈。**混音時，Master 永遠必須低於 0dB！**
                            </p>
                        </div>
                    </div>
                </section>
                {/* 3. 實戰做法：Gain Staging 到底在哪裡調？ */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: '#facc15', marginBottom: '1.5rem', borderLeft: '8px solid #ca8a04', paddingLeft: '20px', fontWeight: 'bold' }}>
                        3. 實戰操作：到底在哪裡調整 Gain？
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        新手最常犯的致命錯誤，就是想改變音量時，直接去拉下方的「音量推桿 (Volume Fader)」。<br />
                        記住一個大原則：<strong style={{ color: '#facc15' }}>Gain 是「進去」效果器前的音量，Fader 是「出來」後的音量。</strong>
                    </p>

                    <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: isMobile ? '20px' : '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>

                        {/* 訊號流程視覺化 */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '600px', gap: '15px' }}>

                            {/* Step 1: 音檔 */}
                            <div style={{ flex: 1, textAlign: 'center', background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎙️</div>
                                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>音訊檔</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>(Audio Region)</p>
                            </div>

                            <div style={{ color: '#38bdf8', fontSize: '1.5rem' }}><i className="fa-solid fa-chevron-right"></i></div>

                            {/* Step 2: Clip Gain (正確操作點) */}
                            <div style={{ flex: 1.5, textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '16px', border: '2px solid #10b981', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#020617', padding: '2px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>✅ 在這裡調！</div>
                                <h4 style={{ color: '#10b981', margin: '15px 0 5px 0', fontSize: '1.2rem' }}>Clip Gain / 增益插件</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>直接調波形本身的音量<br />或在最上層掛 Gain Plugin</p>
                            </div>

                            <div style={{ color: '#38bdf8', fontSize: '1.5rem' }}><i className="fa-solid fa-chevron-right"></i></div>

                            {/* Step 3: 效果器 */}
                            <div style={{ flex: 1, textAlign: 'center', background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎛️</div>
                                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>效果器</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>(EQ, Compressor)</p>
                            </div>

                            <div style={{ color: '#38bdf8', fontSize: '1.5rem' }}><i className="fa-solid fa-chevron-right"></i></div>

                            {/* Step 4: Fader (錯誤操作點) */}
                            <div style={{ flex: 1.2, textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '2px dashed #ef4444', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>❌ 混音前別動它</div>
                                <div style={{ height: '30px', width: '10px', background: '#334155', margin: '15px auto 10px auto', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '8px', background: '#f8fafc', position: 'absolute', top: '10px', left: '-5px', borderRadius: '2px' }}></div>
                                </div>
                                <h4 style={{ color: '#fca5a5', margin: '0 0 5px 0' }}>音量推桿 (Fader)</h4>
                            </div>

                        </div>
                    </div>

                    <div style={{ marginTop: '20px', background: 'rgba(250, 204, 21, 0.05)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #facc15' }}>
                        <p style={{ color: '#facc15', margin: 0, lineHeight: '1.6', fontWeight: 'bold' }}>
                            💡 實戰 SOP：<br />
                            1. 把下方所有的音量推桿 (Fader) 保持在 0 (歸零狀態)。<br />
                            2. 播放歌曲，調整音訊本身的「Clip Gain」，讓儀表板的跳動最高點落在 -12dB 到 -6dB 之間。<br />
                            3. 恭喜你，你已經為後續的 EQ 和 Compressor 打造了最完美的乾淨地基！
                        </p>
                    </div>
                </section>

                {/* 下一章 CTA */}
                <section style={{ textAlign: 'center', padding: '2rem 0 5rem 0' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>地基打穩了，來認識公寓主委吧！</h2>
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