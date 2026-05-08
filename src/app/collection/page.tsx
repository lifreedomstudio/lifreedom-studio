"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
// 📚 魔法圖鑑資料庫 (包含隱藏的未來擴充包)
const COLLECTION_DATA = [
    {
        sectionTitle: "🧱 基礎元件圖鑑 (新手村)",
        progress: "成就進度：12 / 12",
        isHidden: false, // 🟢 顯示中
        cards: [
            { title: "純粹均衡 ‧ Channel EQ", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要雕刻聲音頻率、消除共鳴時使用。", params: "Band / Gain / Q-Factor", flavor: "「混音界的手術刀。懂得切除不要的，比盲目增加想要的更重要。」" },
            { title: "動態守門員 ‧ Compressor", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "聲音忽大忽小、動態失控時使用。", params: "Threshold / Ratio / Attack / Release", flavor: "「看不見的音量控制員。它不僅讓聲音平穩，更能塑造打擊感。」" },
            { title: "寂靜之門 ‧ Noise Gate", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "麥克風收到太多環境冷氣聲或底噪時發動。", params: "Threshold / Attack / Hold", flavor: "「鐵面無私的警衛。把不該出現的雜音關在門外，留下純粹的安靜。」" },
            { title: "絕對音牆 ‧ Adaptive Limiter", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "總輸出 (Master) 音量不夠，或需要防止破音時。", params: "Out Ceiling: -0.1dB / Gain", flavor: "「混音的最後一道防線。把聲音推向極限的同時，保證絕對不爆走。」" },
            { title: "空間幻象 ‧ ChromaVerb", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "聲音過於乾扁，需要建立虛擬空間時使用。", params: "Decay / Pre-Delay / Wet Mix", flavor: "「為乾燥的聲音蓋一間虛擬房間。從小澡堂到大教堂，由你決定。」" },
            { title: "復古殘影 ‧ Tape Delay", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要溫暖且帶有磁帶老舊感的延遲迴音時。", params: "Delay Time / Feedback / Flutter", flavor: "「模擬老式磁帶的溫暖耗損。每一次迴音，都比上一次更加模糊而迷人。」" },
            { title: "波紋搖擺 ‧ Chorus", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "吉他、合成器或人聲太單薄，需要合唱厚度時。", params: "Rate / Depth / Mix", flavor: "「將單一的聲音複製並微調音準，創造出一群人同時發聲的錯覺。」" },
            { title: "絕對音準 ‧ Pitch Correction", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "歌手音準飄忽不定，或需要電子 Auto-Tune 效果時。", params: "Scale / Root / Response Time", flavor: "「現代流行樂的基石。可以溫柔地扶正音符，也能暴力地製造機械人聲。」" },
            { title: "數位崩壞 ‧ Bitcrusher", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要 8-bit 遊戲感或極端數位失真時發動。", params: "Resolution (Bits) / Downsampling", flavor: "「透過降低取樣率來毀滅音質。粗糙、刺耳，卻充滿了 Lo-Fi 的獨特魅力。」" },
            { title: "真空管怒吼 ‧ Overdrive", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "聲音太平滑，需要增加顆粒感與侵略性時。", params: "Drive / Tone / Output", flavor: "「模擬類比電路過載的溫暖破音。讓溫馴的樂器瞬間長出獠牙。」" },
            { title: "虛擬箱體 ‧ Amp Designer", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "電吉他或貝斯直接 Line-in，需要真實音箱空間感時。", params: "Amp Model / Cab / Mic Position", flavor: "「把頂級的吉他音箱和麥克風收音室，直接搬進你的筆記型電腦裡。」" },
            { title: "肥厚染色 ‧ Phat FX", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "貝斯或合成器太單薄，需要極致的破壞與肥厚感時。", params: "Distortion / Filter / Saturation", flavor: "「給太乾淨的聲音一點破壞，破壞就是重生的開始。讓低頻瞬間胖起來。」" }
        ]
    },
    {
        sectionTitle: "🎛️ Lifreedom 混音圖鑑 (進階應用)",
        progress: "成就進度：5 / 5",
        isHidden: false, // 🟢 顯示中
        cards: [
            { title: "空間撕裂者 ‧ 乒乓延遲", rarity: "傳說魔法", stars: "⭐⭐⭐", theme: "#38bdf8", bgGradient: "radial-gradient(circle, #0ea5e9 0%, #0284c7 50%, #0f172a 100%)", condition: "當人聲與伴奏黏在一起時可發動。", params: "Time: 1/4 | Feedback: 25% | Low-Cut: 300Hz", flavor: "「讓聲音在左右聲道瘋狂橫跳，創造極致寬廣的異次元空間。」" },
            { title: "重力束縛 ‧ 爸爸壓縮器", rarity: "實戰魔法", stars: "⭐⭐", theme: "#8b5cf6", bgGradient: "radial-gradient(circle, #a855f7 0%, #7e22ce 50%, #0f172a 100%)", condition: "當訊號超過忍耐極限 (Threshold) 時發動。", params: "Ratio: 4:1 | Attack: 30ms | Release: Auto", flavor: "「這是老爸最後的慈悲，讓你的音量乖乖聽話，否則皮帶伺候。」" },
            { title: "幻影分身 ‧ 平行壓縮", rarity: "傳說魔法", stars: "⭐⭐⭐", theme: "#ef4444", bgGradient: "radial-gradient(circle, #f43f5e 0%, #be123c 50%, #0f172a 100%)", condition: "當鼓組聽起來軟弱無力時發動。", params: "Mix: 40% | Ratio: 10:1 | Makeup: +4dB", flavor: "「召喚一個充滿力量的影子分身與原聲融合，創造拳拳到肉的撞擊感。」" },
            { title: "維度切割 ‧ M/S 等化器", rarity: "史詩魔法", stars: "⭐⭐⭐", theme: "#fbbf24", bgGradient: "radial-gradient(circle, #f59e0b 0%, #b45309 50%, #0f172a 100%)", condition: "當混音中間太擠、兩旁太空時發動。", params: "Side: High +2dB | Mid: Low Cut 100Hz", flavor: "「將亮麗留給兩旁，將力道留給中間，切開聲音的維度。」" },
            { title: "蛇語者 ‧ 齒音獵人", rarity: "實戰魔法", stars: "⭐⭐", theme: "#10b981", bgGradient: "radial-gradient(circle, #34d399 0%, #047857 50%, #0f172a 100%)", condition: "當歌手的『嘶』聲刺耳如蛇鳴時發動。", params: "Freq: 6kHz | Range: -5dB | Mode: Wide", flavor: "「在不經意間，溫柔地按住那些尖銳如毒牙般的齒音。」" }
        ]
    },
    {
        sectionTitle: "🏗️ 聲學建築 編曲圖鑑",
        progress: "成就進度：4 / 4",
        isHidden: false, // 🟢 顯示中
        cards: [
            { title: "摩西分海 ‧ LCR 擺位", rarity: "神話魔法", stars: "⭐⭐⭐⭐", theme: "#fca311", bgGradient: "radial-gradient(circle, #fbbf24 0%, #d97706 50%, #0f172a 100%)", condition: "當節奏吉他與主唱嚴重搶奪中央空間時發動。", params: "Rhythm L: 100L | Rhythm R: 100R", flavor: "「將障礙物硬生生推向兩極，為主唱開闢一條神聖的聽覺高速公路。」" },
            { title: "音程煉金術 ‧ 八度錯位", rarity: "史詩魔法", stars: "⭐⭐⭐", theme: "#2dd4bf", bgGradient: "radial-gradient(circle, #2dd4bf 0%, #0f766e 50%, #0f172a 100%)", condition: "兩把樂器彈奏相同音域時發動。", params: "Capo: +5 | Octave: +12st", flavor: "「拒絕破壞性 EQ！在源頭改變物理法則，讓樂器在天然頻段中完美共存。」" },
            { title: "絕對地基 ‧ 低頻口袋", rarity: "實戰魔法", stars: "⭐⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #cbd5e1 0%, #475569 50%, #0f172a 100%)", condition: "大鼓 (Kick) 與貝斯 (Bass) 轟隆作響、泥濘不堪時發動。", params: "Kick Sub: 50Hz | Bass Punch: 90Hz", flavor: "「決定誰住一樓、誰住地下室。完美咬合的拼圖，是不可撼動的低頻基石。」" },
            { title: "哈斯幻影 ‧ 偽立體聲", rarity: "稀有魔法", stars: "⭐⭐", theme: "#f472b6", bgGradient: "radial-gradient(circle, #fbcfe8 0%, #be185d 50%, #0f172a 100%)", condition: "只有錄製單一軌道，卻渴望擁有立體聲牆時發動。", params: "Pan: 100L / 100R | Delay Right: 20ms", flavor: "「欺騙大腦的終極幻術。僅需 20 毫秒的延遲，單薄的聲音瞬間膨脹為巨大音牆。」" }
        ]
    },
    // ----------------------------------------------------------------------------------
    // 🤫 未來擴充包 (目前隱藏中，未來要開放時，只要把 isHidden 改成 false 即可！)
    // ----------------------------------------------------------------------------------
    {
        sectionTitle: "🚀 第二彈擴充：動態與情緒 (Coming Soon)",
        progress: "成就進度：0 / 8",
        isHidden: true, // 🔴 隱藏中
        cards: [
            { title: "心跳同步 ‧ Sidechain", rarity: "神話魔法", stars: "⭐⭐⭐⭐", theme: "#fca311", bgGradient: "radial-gradient(circle, #fbbf24 0%, #d97706 50%, #0f172a 100%)", condition: "當大鼓踩下時，貝斯完全擋住大鼓的衝擊力時。", params: "Audio from: Kick | Ratio: 8:1", flavor: "「讓整個世界隨著大鼓的心跳而呼吸。當王者降臨，萬物皆須低頭迴避。」" },
            { title: "萬物歸一 ‧ Bus Compression", rarity: "傳說魔法", stars: "⭐⭐⭐", theme: "#38bdf8", bgGradient: "radial-gradient(circle, #0ea5e9 0%, #0284c7 50%, #0f172a 100%)", condition: "當所有軌道聽起來像一盤散沙，無法融合時。", params: "Ratio: 2:1 | Attack: 30ms | GR: -2dB", flavor: "「用無形的黏著劑將散落的拼圖緊緊擁抱，這就是唱片級質感的最後一哩路。」" },
            { title: "幽靈之手 ‧ Automation", rarity: "神話魔法", stars: "⭐⭐⭐⭐", theme: "#fca311", bgGradient: "radial-gradient(circle, #fbbf24 0%, #d97706 50%, #0f172a 100%)", condition: "當歌曲情緒平淡，副歌爆發力不足時。", params: "Chorus Volume +1.5dB", flavor: "「沒有任何參數是永恆不變的，情緒的起伏才是音樂的真理。」" },
            { title: "人聲疊影 ‧ MicroShift", rarity: "史詩魔法", stars: "⭐⭐", theme: "#a78bfa", bgGradient: "radial-gradient(circle, #8b5cf6 0%, #6d28d9 50%, #0f172a 100%)", condition: "主唱單薄，又沒有錄製和聲雙軌時。", params: "Pitch L: -9c | Pitch R: +9c | Delay: 15ms", flavor: "「將時間與音準微幅錯開。你以為是一個人，其實是一個完美克隆的合唱團。」" },
            { title: "動態雕刻 ‧ Enveloper", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "小鼓不夠脆，或大鼓尾音太長時。", params: "Attack: +20% | Release: -10%", flavor: "「捨棄壓縮器的繁瑣，直接用雙手捏出聲音起承轉合的形狀。」" },
            { title: "基因突變 ‧ Vocal Transformer", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要改變人聲的性別感或製造怪獸音效時。", params: "Formant: -4 | Pitch: 0", flavor: "「不改變音高，只改變咽喉的物理構造，創造出不存在於世上的聲帶。」" },
            { title: "相位拓荒 ‧ Direction Mixer", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要強行拉寬合成器，或縮窄低頻寬度時。", params: "Spread: 1.5 | Crossover: 150Hz", flavor: "「打破左右聲道的物理疆界，自由揉捏立體聲的寬度與方向。」" },
            { title: "濾波清道夫 ‧ AutoFilter", rarity: "原初元件", stars: "⭐", theme: "#94a3b8", bgGradient: "radial-gradient(circle, #64748b 0%, #334155 50%, #0f172a 100%)", condition: "需要製造聲音從水底慢慢浮出水面的過場時。", params: "Cutoff: LFO Sync 1/1 | Resonance: 30%", flavor: "「讓頻率隨著節奏自動開闔，製造出 EDM 最經典的呼吸感與期待感。」" }
        ]
    }
];

export default function CollectionPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* 🔝 頂部導航 (修復主標題換行與按鈕擠壓) */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row', // 手機版改為上下排
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    marginBottom: isMobile ? '2rem' : '4rem',
                    gap: '1.5rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: isMobile ? '1.8rem' : '2.5rem', // 手機版字體縮小
                            margin: '0 0 0.5rem 0',
                            background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: '1.2'
                        }}>
                            📜 Lifreedom 魔法圖鑑
                        </h1>
                        <p style={{ color: '#64748b', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            解鎖並收集傳說級技巧，從基礎元件建立你的專屬兵器庫。
                        </p>
                    </div>
                    <Link href="/courses" style={{
                        padding: '0.8rem 1.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        border: '1px solid #1e293b',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        width: isMobile ? '100%' : 'auto', // 手機版按鈕撐滿寬度
                        textAlign: 'center'
                    }}>
                        ⬅️ 返回大廳
                    </Link>
                </div>

                {/* 🗂️ 動態渲染套牌 */}
                {COLLECTION_DATA.map((section, secIdx) => (
                    <div key={secIdx} style={{
                        marginBottom: isMobile ? '4rem' : '6rem',
                        display: section.isHidden ? 'none' : 'block'
                    }}>
                        {/* 📛 區塊標題 (修復成就進度撞車問題) */}
                        <div style={{
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            paddingBottom: '1rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row', // 手機版上下分層
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'flex-end',
                            gap: isMobile ? '0.5rem' : '0' // 手機版給一點上下間距
                        }}>
                            <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#f8fafc', margin: 0 }}>
                                {section.sectionTitle}
                            </h2>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: isMobile ? '0.85rem' : '1rem', fontWeight: 'bold' }}>
                                {section.progress}
                            </p>
                        </div>

                        {/* 卡片網格 (原本的 auto-fit 已經很完美，無需大改) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                            {section.cards.map((card, idx) => (
                                <div key={idx} style={{
                                    background: '#1e293b', borderRadius: '16px', padding: '10px',
                                    border: `2px solid ${card.theme}`, boxShadow: `0 0 20px ${card.theme}30`,
                                    transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer'
                                }}>
                                    {/* 卡片標頭 */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem 1rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{card.title}</h3>
                                        <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: card.theme, color: card.theme === '#94a3b8' ? '#fff' : '#000', borderRadius: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>
                                            {card.rarity}
                                        </span>
                                    </div>
                                    <div style={{ padding: '0 0.5rem 0.5rem', color: card.theme, fontSize: '0.8rem', letterSpacing: '2px' }}>
                                        技術等級 {card.stars}
                                    </div>

                                    {/* 視覺圖像區 */}
                                    <div style={{ height: '160px', background: card.bgGradient, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 100%)', transform: 'rotate(30deg)' }}></div>
                                    </div>

                                    {/* 卡片數值與描述 */}
                                    <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '8px', border: `1px solid ${card.theme}40` }}>
                                        <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 'bold', marginBottom: '0.8rem', lineHeight: '1.6' }}>
                                            <span style={{ color: card.theme }}>【發動條件】</span><br />{card.condition}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: card.theme, marginBottom: '1.2rem', fontFamily: 'monospace', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            🗡️ 實戰參數:<br />{card.params}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.6', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                            {card.flavor}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* ⚔️ 行動呼籲 (Call to Action) */}
                <div style={{ marginTop: isMobile ? '3rem' : '5rem', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', background: 'linear-gradient(145deg, #0f172a, #020617)', borderRadius: '24px', border: '1px solid #1e293b', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#f8fafc', marginBottom: '1rem' }}>渴望解鎖更多傳說級魔法嗎？</h2>
                    <p style={{ color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                        高階魔法卡片無法用金錢購買，唯有透過實戰與頓悟才能獲得。現在就前往建築所大廳完成每日修煉，或讓 AI 助理為你的專案進行深度聽診，獲取隨機卡片掉落！
                    </p>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/courses" style={{ padding: '1rem 3rem', background: '#38bdf8', color: '#020617', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto' }}>
                            前往大廳修煉 ⚔️
                        </Link>
                        <Link href="/mix-assistant" style={{ padding: '1rem 3rem', background: 'transparent', color: '#38bdf8', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', textDecoration: 'none', border: '2px solid #38bdf8', transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto' }}>
                            呼叫 AI 聽診 🤖
                        </Link>
                    </div>
                </div>

                {/* 🔮 未來擴充預告 */}
                <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>🔮 魔法卡池持續擴充中...</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>第二彈「動態與情緒」擴充包正在鑄造中，敬請期待。</p>
                </div>

            </div>
        </div>
    );
}