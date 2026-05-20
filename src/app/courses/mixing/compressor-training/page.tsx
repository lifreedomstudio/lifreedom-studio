"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 定義壓縮器情境關卡
const MISSIONS = [
    {
        id: 'drum_glue',
        shortName: '🥁 鼓組 Glue',
        title: '第一關：全套鼓的膠水 (Glue)',
        desc: '鼓組裡面的各個樂器聽起來像是各打各的。試著把 Threshold 壓深一點，Attack 調快，Release 放慢，讓所有鼓聲被「黏」在一起。',
        target: { threshold: -30, ratio: 8, attack: 5, release: 250, knee: 30 },
        file: '/audio/drum-loop.mp3'
    },
    {
        id: 'vocal_leveling',
        shortName: '🎤 主唱 Leveling',
        title: '第二關：馴服失控的主唱 (Vocal Leveling)',
        desc: '主唱的動態太大了！副歌突然爆發的音量會刺傷耳朵。請設定「極快的 Attack」瞬間抓住那些突發的音量，並將 Threshold 設在能壓出約 6~8dB 的位置，讓聲音結實又平滑。',
        target: { threshold: -24, ratio: 4, attack: 3, release: 150, knee: 15 },
        file: '/audio/vocal-dry.mp3'
    },
    {
        id: 'guitar_strum',
        shortName: '🎸 吉他 Strum',
        title: '第三關：木吉他的平穩刷扣 (Acoustic Strumming)',
        desc: '木吉他的刷扣 (Pick) 聲音太突兀了，會干擾到主唱。請適度壓低 Threshold，並用偏快的 Attack，把那些太刺耳的金屬撞擊聲給撫平約 6dB 左右。',
        target: { threshold: -26, ratio: 4, attack: 10, release: 100, knee: 15 },
        file: '/audio/guitar-loop.mp3'
    }
];

// --- 輔助組件：用原生 SVG 繪製 Compressor 實戰圖表 ---
const CompressorSvgCard = ({ type, color }: { type: 'curve' | 'transient' | 'glue', color: string }) => {
    const renderSvg = () => {
        switch (type) {
            case 'curve':
                return (
                    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
                        <line x1="0" y1="200" x2="400" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5,5" />
                        <text x="350" y="190" fill="#cbd5e1" fontSize="12">Input</text>
                        <text x="10" y="20" fill="#cbd5e1" fontSize="12">Output</text>
                        <path d="M 0,200 L 200,100 L 400,60" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                        <circle cx="200" cy="100" r="6" fill="#fff" />
                        <text x="210" y="120" fill="#fff" fontSize="14" fontWeight="bold">Threshold (閾值)</text>
                    </svg>
                );
            case 'transient':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0,100 L 50,20 L 80,90 L 120,40 L 150,100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4,4" />
                        <path d="M 0,100 L 45,20 L 55,60 L 80,90 L 120,60 L 150,100" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                        <text x="40" y="15" fill={color} fontSize="14" fontWeight="bold">保留 Attack (Punch)</text>
                    </svg>
                );
            case 'glue':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0,100 L 50,40 L 100,100 M 100,100 L 150,20 L 200,100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M 220,100 L 270,50 L 320,100 M 320,100 L 370,50 L 400,100" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                        <text x="60" y="130" fill="#cbd5e1" fontSize="14">各唱各的</text>
                        <text x="270" y="130" fill={color} fontSize="14" fontWeight="bold">融為一體 (Glue)</text>
                    </svg>
                );
        }
    };

    return (
        <div style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', marginBottom: '15px', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
                {renderSvg()}
            </div>
        </div>
    );
};

export default function CompressorTrainingRoom() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const [missionIdx, setMissionIdx] = useState(0);
    const currentMission = MISSIONS[missionIdx];
    const [gameState, setGameState] = useState<'playing' | 'answer'>('playing');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHearingMaster, setIsHearingMaster] = useState(false);

    const [showTips, setShowTips] = useState(false);

    const isPlayingRef = useRef(false);
    const grBarRef = useRef<HTMLDivElement>(null);
    const grTextRef = useRef<HTMLSpanElement>(null);
    const [userSettings, setUserSettings] = useState({ threshold: -10, ratio: 2, attack: 50, release: 300, knee: 20 });

    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const compRef = useRef<DynamicsCompressorNode | null>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentMission.file;
            audioRef.current.load();
        }
    }, [currentMission.file]);

    const togglePlay = async () => {
        if (!audioCtxRef.current) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = ctx;
            const audio = new Audio(currentMission.file);
            audio.loop = true;
            audioRef.current = audio;

            const source = ctx.createMediaElementSource(audio);
            const compressor = ctx.createDynamicsCompressor();
            compRef.current = compressor;

            source.connect(compressor);
            compressor.connect(ctx.destination);
        }

        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }

        if (isPlaying) {
            audioRef.current?.pause();
            isPlayingRef.current = false;
            cancelAnimationFrame(animationRef.current);
            if (grBarRef.current) grBarRef.current.style.width = '0%';
            if (grTextRef.current) grTextRef.current.innerText = '0.0 dB';
        } else {
            audioRef.current?.play().catch(e => {
                console.error("播放失敗，確認音檔路徑", e);
                alert("音軌播放失敗！請確認 public/audio 裡有對應檔案。");
            });
            isPlayingRef.current = true;
            updateAnimation();
        }
        setIsPlaying(!isPlaying);
    };

    const updateAnimation = () => {
        if (!isPlayingRef.current) return;
        if (compRef.current) {
            const reduction = compRef.current.reduction;
            const currentGR = typeof reduction === 'number' ? reduction : (reduction as any).value;
            if (grBarRef.current) grBarRef.current.style.width = `${Math.min(100, Math.abs(currentGR || 0) * 5)}%`;
            if (grTextRef.current) grTextRef.current.innerText = `${(currentGR || 0).toFixed(1)} dB`;
        }
        animationRef.current = requestAnimationFrame(updateAnimation);
    };

    useEffect(() => {
        if (!compRef.current || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const activeSettings = isHearingMaster ? currentMission.target : userSettings;

        compRef.current.threshold.setTargetAtTime(activeSettings.threshold, ctx.currentTime, 0.05);
        compRef.current.ratio.setTargetAtTime(activeSettings.ratio, ctx.currentTime, 0.05);
        compRef.current.attack.setTargetAtTime(activeSettings.attack / 1000, ctx.currentTime, 0.05);
        compRef.current.release.setTargetAtTime(activeSettings.release / 1000, ctx.currentTime, 0.05);
        compRef.current.knee.setTargetAtTime(activeSettings.knee, ctx.currentTime, 0.05);
    }, [userSettings, isHearingMaster, currentMission]);

    const nextMission = () => {
        setMissionIdx((prev) => (prev + 1) % MISSIONS.length);
        setGameState('playing');
        setUserSettings({ threshold: -10, ratio: 2, attack: 50, release: 300, knee: 20 });
    };

    const selectMission = (index: number) => {
        if (isPlaying) {
            audioRef.current?.pause();
            isPlayingRef.current = false;
            setIsPlaying(false);
            cancelAnimationFrame(animationRef.current);
        }
        setMissionIdx(index);
        setGameState('playing');
        setUserSettings({ threshold: -10, ratio: 2, attack: 50, release: 300, knee: 20 });
        if (grBarRef.current) grBarRef.current.style.width = '0%';
        if (grTextRef.current) grTextRef.current.innerText = '0.0 dB';
    };

    const CompareRow = ({ label, user, target, unit, color, min, max }: any) => (
        <div style={{ marginBottom: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '12px', border: `1px solid ${color}40` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>{label}</span>
                <span>大師: <b style={{ color }}>{target}</b> {unit} | 你的: <b>{user}</b> {unit}</span>
            </div>
            <div style={{ position: 'relative', height: '10px', background: '#020617', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', left: `${((target - min) / (max - min)) * 100}%`, width: '4px', height: '14px', background: color, zIndex: 2, top: '-2px', boxShadow: `0 0 10px ${color}` }}></div>
                <div style={{ position: 'absolute', left: `${((user - min) / (max - min)) * 100}%`, width: '12px', height: '12px', background: '#fff', borderRadius: '50%', transform: 'translateX(-50%)', top: '-1px' }}></div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* 1. Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        PHASE 03 : DYNAMIC CONTROL
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Compressor 動態老爸
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        混音中最難懂，但也最強大的魔法。<br />
                        它不是把聲音變小，而是把聲音「變穩、變結實」。讓我們先看懂老爸的脾氣，再親自下道場挑戰！
                    </p>
                </header>

                {/* --- 📖 理論區塊 1：動態老爸的五大脾氣 --- */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '2rem', borderLeft: '6px solid #f59e0b', paddingLeft: '15px' }}>
                        1. 核心參數：動態老爸的五大脾氣
                    </h2>

                    <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.1))', padding: isMobile ? '20px' : '35px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '30px' }}>
                            <div>
                                <h4 style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 10px 0' }}>😡 Threshold (老爸的容忍度)</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                    你犯的錯超過這條底線，老爸就發火開扁。（設定啟動壓縮的音量線）
                                </p>

                                <h4 style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 10px 0' }}>🏏 Ratio (教訓的武器)</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                    2:1 是原子筆，4:1 是愛的小手，無限大 (Limiter) 就是平底鍋。數值越大，把你壓得越扁。
                                </p>

                                <h4 style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 10px 0' }}>〰️ Knee (老爸的脾氣)</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                                    Soft (軟) 代表會先碎碎念警告，慢慢增加力道；Hard (硬) 代表瞬間暴怒直接開扁。
                                </p>
                            </div>

                            <div>
                                <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 10px 0' }}>⚡ Attack (衝過來的速度)</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                    衝得慢，你還能先逃跑偷打一下 (保留聲音的 Punch 打擊感)；衝得快，你一出聲就被瞬間按在地上。
                                </p>

                                <h4 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 10px 0' }}>⏱️ Release (多久放過你)</h4>
                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                                    放太快，你又會馬上開始作怪 (產生奇怪的抽吸效應)；放太慢，你整天都被壓抑著，聲音毫無生氣。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 🥷 理論區塊 2：業界三大實戰手法 --- */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '2rem', borderLeft: '6px solid #10b981', paddingLeft: '15px' }}>
                        2. 業界三大實戰手法
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px' }}>
                            <h3 style={{ color: '#ef4444', fontSize: '1.2rem', margin: '0 0 15px 0' }}>📉 Peak Control (削平尖峰)</h3>
                            <CompressorSvgCard type="curve" color="#ef4444" />
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem' }}>
                                <strong>目標：主唱、貝斯。</strong><br />
                                用來對付忽然爆大聲的字眼。設定快速的 Attack 抓住音頭，用 4:1 的 Ratio 削平突出的尖峰，讓聲音在混音中穩如泰山。
                            </p>
                        </div>

                        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px' }}>
                            <h3 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 15px 0' }}>🥊 Punch (創造打擊感)</h3>
                            <CompressorSvgCard type="transient" color="#38bdf8" />
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem' }}>
                                <strong>目標：大鼓、小鼓。</strong><br />
                                將 Attack 調慢，讓鼓槌打下去的「噠」聲溜過去不被壓縮，Compressor 才啟動壓住後面的尾音。鼓聲會超級有彈性！
                            </p>
                        </div>

                        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px' }}>
                            <h3 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 15px 0' }}>🤝 Glue (膠合技術)</h3>
                            <CompressorSvgCard type="glue" color="#10b981" />
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem' }}>
                                <strong>目標：總輸出、疊加自己的樂器。</strong><br />
                                就像照片後製時「套上同一個濾鏡」。當你拿到別人的伴奏，疊加自己錄的吉他進去時，聽起來通常是「分離的」。這時將伴奏與吉他送到同一個bus
                                群組，用 2:1 的 Ratio 輕輕壓過，創造一致的動態起伏，就能讓它們「黏」在一起，聽起來像是在同一個時空演奏。
                            </p>
                        </div>
                    </div>

                    {/* --- 🚌 課外輔導：什麼是 Bus？ (微導購鋪陳) --- */}
                    <div style={{ marginTop: '2rem', background: 'linear-gradient(145deg, rgba(167, 139, 250, 0.1), transparent)', border: '1px dashed #a78bfa', padding: '25px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '3rem' }}>🚌</div>
                        <div>
                            <h4 style={{ color: '#a78bfa', fontSize: '1.2rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>等等，什麼是 Bus (總線/群組)？</h4>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 15px 0', fontSize: '0.95rem' }}>
                                想像 Bus 就是聲音的「接駁車」。你可以把你錄的吉他、別人的伴奏通通送上同一台車，然後我們只要對這台「車」掛上一個 Compressor，車上所有的聲音就會一起被擠壓。這就是 Glue (膠合) 能讓聲音融為一體的核心原理！
                            </p>
                            <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 18px', borderRadius: '12px', borderLeft: '4px solid #fca311', display: 'inline-block' }}>
                                <span style={{ color: '#fca311', fontSize: '0.9rem', fontWeight: 'bold' }}>🚀 製作人進階預告：</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginLeft: '8px', lineHeight: '1.6' }}>
                                    Bus 其實是混音界最強的「空間魔法」。在解鎖付費的進階實驗室中，我們將完整解析 Bus 的終極應用——包含讓鼓聲炸裂的「平行壓縮」，以及打造 3D 演唱會聽感的「Reverb 空間發送魔法」。
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 🔌 理論區塊 3：壓縮器的三大門派 (硬體模擬) --- */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '2rem', borderLeft: '6px solid #a78bfa', paddingLeft: '15px' }}>
                        3. 壓縮器的三大門派 (硬體模擬)
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                        你可能注意過，在 DAW（例如 Logic Pro）的壓縮器裡，總是可以切換不同的「型號」或「面板」。這絕對不是只有外觀改變！它們模擬了真實世界中三種不同物理電路的硬體，擁有完全不同的個性與「染色」。選擇對的門派，混音就贏了一半。
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                        {/* VCA */}
                        <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #38bdf8', padding: '25px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.1 }}>⚡</div>
                            <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>VCA</span> <span style={{ fontSize: '0.9rem', background: '#38bdf8', color: '#000', padding: '2px 8px', borderRadius: '12px' }}>外科醫生</span>
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' }}>Voltage Controlled Amplifier</p>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 15px 0' }}>
                                <li><b>特色：</b> 控制精準、反應極快、音色乾淨不染色。</li>
                                <li><b>聽感：</b> 收得緊、推得穩，Punch 感十足。</li>
                                <li><b>最佳用途：</b> 鼓組總線 (Drum Bus)、Master 總輸出。</li>
                            </ul>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#38bdf8' }}>
                                <b>經典代表：</b> SSL G-Bus, DBX 160<br />
                                <b>Logic Pro 對應：</b> Studio VCA, Vintage VCA
                            </div>
                        </div>

                        {/* FET */}
                        <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #ef4444', padding: '25px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.1 }}>🎸</div>
                            <h3 style={{ color: '#ef4444', fontSize: '1.4rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>FET</span> <span style={{ fontSize: '0.9rem', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>搖滾樂手</span>
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' }}>Field Effect Transistor</p>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 15px 0' }}>
                                <li><b>特色：</b> 速度極快、帶有強烈侵略性與飽和度 (染色)。</li>
                                <li><b>聽感：</b> 聲音前衛、充滿顆粒感與態度。</li>
                                <li><b>最佳用途：</b> 搖滾主唱、小鼓 (Snare)、電吉他。</li>
                            </ul>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#ef4444' }}>
                                <b>經典代表：</b> UREI 1176<br />
                                <b>Logic Pro 對應：</b> Vintage FET, Studio FET
                            </div>
                        </div>

                        {/* OPTO */}
                        <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #fca311', padding: '25px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.1 }}>💡</div>
                            <h3 style={{ color: '#fca311', fontSize: '1.4rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>Opto</span> <span style={{ fontSize: '0.9rem', background: '#fca311', color: '#000', padding: '2px 8px', borderRadius: '12px' }}>氣氛歌手</span>
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' }}>Optical (光學感測)</p>
                            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 15px 0' }}>
                                <li><b>特色：</b> 透過光源控制，反應遲緩、溫和自然。</li>
                                <li><b>聽感：</b> 壓縮曲線不死板，聲音像在「呼吸」般滑順。</li>
                                <li><b>最佳用途：</b> 抒情主唱、貝斯 (Bass)、弦樂。</li>
                            </ul>
                            <div style={{ background: 'rgba(252, 163, 17, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#fca311' }}>
                                <b>經典代表：</b> Teletronix LA-2A<br />
                                <b>Logic Pro 對應：</b> Vintage Opto
                            </div>
                        </div>
                    </div>
                </section>

                <div style={{ textAlign: 'center', margin: '4rem 0 2rem 0' }}>
                    <h2 style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>👇 立刻進入壓縮器道場 👇</h2>
                </div>

                {/* --- 🎮 互動道場區塊 --- */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {/* 🎵 關卡快速切換 Tabs */}
                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        {MISSIONS.map((mission, idx) => (
                            <button
                                key={mission.id}
                                onClick={() => selectMission(idx)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.9rem',
                                    background: missionIdx === idx ? '#fca311' : '#1e293b',
                                    color: missionIdx === idx ? '#020617' : '#94a3b8',
                                    border: `1px solid ${missionIdx === idx ? '#fca311' : '#334155'}`,
                                    boxShadow: missionIdx === idx ? '0 0 15px rgba(252, 163, 17, 0.4)' : 'none'
                                }}
                            >
                                {mission.shortName}
                            </button>
                        ))}
                    </div>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px' }}>MISSION {missionIdx + 1} / {MISSIONS.length}</span>
                    <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: '#fbbf24' }}>{currentMission.title}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>{currentMission.desc}</p>
                </div>

                {/* 道場知識補帖 */}
                <div style={{ marginBottom: '3rem' }}>
                    <button
                        onClick={() => setShowTips(!showTips)}
                        style={{ width: '100%', padding: '1rem', background: '#1e293b', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>📖 破除迷思：為什麼要壓扁聲音？</span>
                        <span>{showTips ? '▲ 收起' : '▼ 展開看解答'}</span>
                    </button>

                    {showTips && (
                        <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0 0 12px 12px', borderTop: 'none', padding: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', animation: 'fadeIn 0.3s' }}>
                            <p><b>壓縮器不是用來變大聲的工具！它是用來「縮小動態範圍」的。</b></p>
                            <p>把大聲的地方壓小之後，我們再配合 <b>Auto Gain (自動音量補償)</b> 把整體音量推回原本的大小。這時候，原本聽不見的「小細節、尾音、呼吸聲」就會跟著被放大，聲音就變「厚、變穩」了！</p>
                        </div>
                    )}
                </div>

                {gameState === 'playing' ? (
                    <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '32px', border: '1px solid #1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                        {/* GR 儀表板 */}
                        <div style={{ background: '#020617', height: '60px', borderRadius: '16px', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden', border: '2px solid #334155', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                            <div ref={grBarRef} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '0%', background: 'linear-gradient(90deg, transparent, #ef4444)', transition: 'width 0.05s linear' }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#fca311', fontSize: '1rem', letterSpacing: '1px' }}>GAIN REDUCTION (壓了多少)</span>
                                <span ref={grTextRef} style={{ color: '#fff', fontSize: '1.2rem', textShadow: '0 0 5px #000' }}>0.0 dB</span>
                            </div>
                        </div>

                        {/* 控制面板區 */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '3rem', marginBottom: '2.5rem' }}>
                            {/* 左側：門檻與武器 */}
                            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem' }}>THRESHOLD</label>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userSettings.threshold} dB</span>
                                    </div>
                                    <input type="range" min="-60" max="0" value={userSettings.threshold} onChange={e => setUserSettings({ ...userSettings, threshold: +e.target.value })} style={{ width: '100%', accentColor: '#fbbf24' }} />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem' }}>RATIO</label>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userSettings.ratio}:1</span>
                                    </div>
                                    <input type="range" min="1" max="20" step="0.1" value={userSettings.ratio} onChange={e => setUserSettings({ ...userSettings, ratio: +e.target.value })} style={{ width: '100%', accentColor: '#38bdf8' }} />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '1.1rem' }}>KNEE</label>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userSettings.knee}</span>
                                    </div>
                                    <input type="range" min="0" max="40" value={userSettings.knee} onChange={e => setUserSettings({ ...userSettings, knee: +e.target.value })} style={{ width: '100%', accentColor: '#ec4899' }} />
                                </div>
                            </div>

                            {/* 右側：時間控制 */}
                            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.1rem' }}>ATTACK</label>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userSettings.attack} ms</span>
                                    </div>
                                    <input type="range" min="1" max="100" value={userSettings.attack} onChange={e => setUserSettings({ ...userSettings, attack: +e.target.value })} style={{ width: '100%', accentColor: '#fca311' }} />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '1.1rem' }}>RELEASE</label>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userSettings.release} ms</span>
                                    </div>
                                    <input type="range" min="10" max="1000" value={userSettings.release} onChange={e => setUserSettings({ ...userSettings, release: +e.target.value })} style={{ width: '100%', accentColor: '#a78bfa' }} />
                                </div>
                            </div>
                        </div>

                        {/* 動作按鈕 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                <button onClick={togglePlay} style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: isPlaying ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                                    {isPlaying ? '⏹️ 停止監聽' : '🔊 播放音軌'}
                                </button>

                                {/* 🚨 神級功能：按住聽大師 A/B Test */}
                                <button
                                    onMouseDown={() => setIsHearingMaster(true)}
                                    onMouseUp={() => setIsHearingMaster(false)}
                                    onMouseLeave={() => setIsHearingMaster(false)}
                                    onTouchStart={() => setIsHearingMaster(true)}
                                    onTouchEnd={() => setIsHearingMaster(false)}
                                    disabled={!isPlaying}
                                    style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: isHearingMaster ? '#38bdf8' : '#1e293b', color: isHearingMaster ? '#020617' : '#38bdf8', border: '2px solid #38bdf8', fontSize: '1.1rem', fontWeight: '900', cursor: isPlaying ? 'pointer' : 'not-allowed', transition: 'all 0.1s' }}
                                >
                                    {isHearingMaster ? '🎧 (大師參數作用中)' : '👆 長按比較大師設定'}
                                </button>
                            </div>

                            <button onClick={() => { if (isPlaying) { setIsPlaying(false); audioRef.current?.pause(); } setGameState('answer'); }} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px dashed #fbbf24', color: '#fbbf24', background: 'transparent', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                ⚔️ 提交答案，查看大師參數
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#0f172a', padding: isMobile ? '1.5rem' : '3rem', borderRadius: '32px', border: '2px solid #fbbf24', animation: 'slideUp 0.4s ease', boxShadow: '0 20px 50px rgba(251, 191, 36, 0.2)' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fbbf24', fontSize: '2rem' }}>大師鑑定報告</h2>
                        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '3rem' }}>不要灰心，這需要時間累積，對比一下參數差異！</p>

                        <CompareRow label="THRESHOLD (容忍度)" user={userSettings.threshold} target={currentMission.target.threshold} unit="dB" color="#fbbf24" min={-60} max={0} />
                        <CompareRow label="RATIO (武器)" user={userSettings.ratio} target={currentMission.target.ratio} unit=":1" color="#38bdf8" min={1} max={20} />
                        <CompareRow label="KNEE (脾氣)" user={userSettings.knee} target={currentMission.target.knee} unit="" color="#ec4899" min={0} max={40} />
                        <CompareRow label="ATTACK (打擊感)" user={userSettings.attack} target={currentMission.target.attack} unit="ms" color="#fca311" min={1} max={100} />
                        <CompareRow label="RELEASE (呼吸感)" user={userSettings.release} target={currentMission.target.release} unit="ms" color="#a78bfa" min={10} max={1000} />

                        <button onClick={nextMission} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#020617', border: 'none', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', marginTop: '2rem', boxShadow: '0 10px 20px rgba(251, 191, 36, 0.3)' }}>
                            🔥 挑戰下一關
                        </button>
                    </div>
                )}

                {/* 3. 底部導覽 (CTA) */}
                <section style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', gap: '20px' }}>
                    <button
                        onClick={() => router.push('/courses/mixing/eq-training')}
                        style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '1rem 2rem', fontSize: '1rem', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                    >
                        ⬅️ 上一關：EQ 頻率管理
                    </button>

                    <button
                        style={{ background: '#1e293b', color: '#64748b', border: 'none', padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'not-allowed' }}
                    >
                        混音新手村：完結 🎉
                    </button>
                </section>
            </div>
        </div>
    );
}