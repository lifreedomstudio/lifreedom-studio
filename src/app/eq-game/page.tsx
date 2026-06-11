"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ==========================================
// 🎯 一、新增實戰題型 (加入 track 綁定)
// ==========================================
const MISSIONS = [
    {
        id: 1,
        type: "find-problem",
        track: "guitar", // 👈 綁定木吉他
        question: "這段木吉他聽起來太悶 (Muddy)，請找出問題頻率並削減",
        target: { min: 200, max: 400, mode: "cut" },
        hint: "切換到『🔽 CUTTING (削減)』狀態，在 200Hz-400Hz 之間左右掃描",
        answer: "這段 250–400Hz 過多會造成 Muddiness，挖空後聲音瞬間變透明乾淨！"
    },
    {
        id: 2,
        type: "tone-shaping",
        track: "vocal", // 👈 綁定主唱
        question: "讓這段主唱更清亮、更貼近耳朵 (Presence)",
        target: { min: 3000, max: 5000, mode: "boost" },
        hint: "切換到『🔼 BOOSTING (放大)』狀態，尋找 3kHz-5kHz 區間",
        answer: "沒錯！Boost 這裡能讓人聲瞬間跳出混音，獲得強烈的存在感與貼耳感。"
    },
    {
        id: 3,
        type: "find-problem",
        track: "drum", // 👈 綁定大鼓
        question: "找出讓大鼓聽起來像在『敲紙箱 (Boxy)』的頻率並削減",
        target: { min: 350, max: 600, mode: "cut" },
        hint: "切換到『🔽 CUTTING (削減)』狀態，在中低頻段 (350-600Hz) 尋找",
        answer: "漂亮！大膽挖空這個區域，大鼓就會呈現經典的『微笑 EQ』紮實衝擊力。"
    },
    {
        id: 4,
        type: "tone-shaping",
        track: "vocal", // 👈 綁定主唱
        question: "賦予這段人聲昂貴的『空氣感 (Air)』",
        target: { min: 8000, max: 15000, mode: "boost" },
        hint: "切換到『🔼 BOOSTING (放大)』狀態，往頻譜最右側高頻端 (8kHz 以上) 找找",
        answer: "完美！8kHz 以上充滿了呼吸感與細節，能讓聲音充滿仙氣與錄音室光澤。"
    }
];

const TRACKS = {
    guitar: { id: 'guitar', name: '🎸 木吉他', focus: '重點：Muddy (混濁) / Body (琴身共鳴)', file: '/audio/guitar-loop.mp3' },
    drum: { id: 'drum', name: '🥁 大鼓', focus: '重點：Punch (衝擊力) / Boxy (紙箱味)', file: '/audio/drum-loop.mp3' },
    vocal: { id: 'vocal', name: '🎤 主唱', focus: '重點：Presence (貼近感) / Air (空氣感)', file: '/audio/vocal-dry.mp3' }
};

const getExploreCoachText = (freq: number) => {
    if (freq >= 20 && freq < 80) return { title: "🌪️ 超低頻 (Sub)", desc: "大鼓和貝斯的地盤。其他樂器若有此頻段通常是環境噪音，建議 HPF 切除。" };
    if (freq >= 80 && freq < 200) return { title: "🥊 衝擊力與底氣 (Punch/Warmth)", desc: "大鼓拳拳到肉的力量，以及人聲溫暖磁性的來源。" };
    if (freq >= 200 && freq < 500) return { title: "📦 混濁與紙箱味 (Mud/Boxy)", desc: "過多會刺耳或糊在一起！適度挖空能讓混音瞬間變得透明乾淨。" };
    if (freq >= 500 && freq < 1500) return { title: "☎️ 廉價感與鼻音", desc: "這段不是主要問題，但過多會聽起來像便宜塑膠玩具或透過電話唱歌，影響 Clarity。" };
    if (freq >= 1500 && freq < 5000) return { title: "🔪 刺耳與貼近感 (Harsh/Presence)", desc: "人類耳朵最敏感的區域！決定聲音有多「貼耳」，但極容易讓人疲勞。" };
    if (freq >= 5000 && freq < 9000) return { title: "🐍 唇齒音與清脆感 (Sibilance)", desc: "主唱發出「斯、疵」的刺耳氣音區，也是金屬弦撥弦最清脆的地方。" };
    if (freq >= 9000) return { title: "✨ 空氣感 (Air)", desc: "賦予聲音昂貴的光澤、仙氣與呼吸感。" };
    return { title: "探測中...", desc: "拖曳滑桿來發掘各頻段的秘密。" };
};

function EQGameContent() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 🎮 遊戲狀態
    const [mode, setMode] = useState<"explore" | "challenge">("explore");
    const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
    const [isMissionPassed, setIsMissionPassed] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isFlash, setIsFlash] = useState(false);

    // 🔓 解鎖與名單狀態
    const [hasUnlockedFull, setHasUnlockedFull] = useState(false);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentMission = MISSIONS[currentMissionIndex];

    // 🎛️ EQ 引擎狀態
    const [activeTrack, setActiveTrack] = useState<'guitar' | 'drum' | 'vocal'>('guitar');
    const [sliderValue, setSliderValue] = useState(420);
    const [isPlayingManual, setIsPlayingManual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [eqMode, setEqMode] = useState<'boost' | 'cut' | 'flat'>('boost');

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    const minFreq = 20;
    const maxFreq = 20000;
    const minLog = Math.log10(minFreq);
    const maxLog = Math.log10(maxFreq);
    const frequency = Math.round(Math.pow(10, minLog + ((maxLog - minLog) * (sliderValue / 1000))));

    const displayFreq = frequency >= 1000 ? (frequency / 1000).toFixed(1) + 'k' : frequency;

    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) { console.log(e); }
    };

    // 💡 確保組件卸載時，音檔會被強制關閉
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
            if (sourceRef.current) {
                try { sourceRef.current.stop(); } catch (e) { }
            }
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // 💡 自動跟隨題目切換音軌
    useEffect(() => {
        if (mode === 'challenge' && currentMission) {
            setActiveTrack(currentMission.track as 'guitar' | 'drum' | 'vocal');
        }
    }, [currentMissionIndex, mode, currentMission]);

    // ⚙️ 核心：命中判定
    useEffect(() => {
        if (mode !== "challenge" || !currentMission || isMissionPassed) return;

        const target = currentMission.target;
        const isCorrect = frequency >= target.min && frequency <= target.max && eqMode === target.mode;

        if (isCorrect) {
            playSuccessSound();
            setIsMissionPassed(true);
            setFeedback("🎯 命中！ " + currentMission.answer);
            setIsFlash(true);
            setTimeout(() => setIsFlash(false), 300);
        } else {
            if (eqMode !== target.mode) {
                setFeedback("❌ 狀態錯誤：請注意題目要求是『削減』還是『放大』");
            } else if (frequency < target.min) {
                setFeedback("🔥 不是這裡... 這段不是主要問題，再往「高頻 (右邊)」找找");
            } else if (frequency > target.max) {
                setFeedback("❄️ 衝過頭了，這裡會影響 Clarity，再往「低頻 (左邊)」修正");
            }
        }
    }, [frequency, eqMode, mode, currentMission, isMissionPassed]);

    const loadAudio = async (trackId: 'guitar' | 'drum' | 'vocal') => {
        if (isPlayingManual) { sourceRef.current?.stop(); setIsPlayingManual(false); }
        setIsLoading(true);
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        try {
            const response = await fetch(TRACKS[trackId].file);
            if (!response.ok) throw new Error('音檔載入失敗');
            const arrayBuffer = await response.arrayBuffer();
            bufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);

            // 如果在播放狀態下切換音檔，讓它自動繼續播
            if (isPlayingManual) {
                const ctx = audioCtxRef.current;
                sourceRef.current = ctx.createBufferSource();
                sourceRef.current.buffer = bufferRef.current;
                sourceRef.current.loop = true;
                sourceRef.current.connect(filterRef.current!);
                sourceRef.current.start();
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    useEffect(() => { loadAudio(activeTrack); }, [activeTrack]);

    useEffect(() => {
        if (!filterRef.current || !audioCtxRef.current) return;
        filterRef.current.frequency.setTargetAtTime(frequency, audioCtxRef.current.currentTime, 0.05);

        if (eqMode === 'boost') {
            filterRef.current.gain.setTargetAtTime(15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(6.0, audioCtxRef.current.currentTime, 0.1);
        } else if (eqMode === 'cut') {
            filterRef.current.gain.setTargetAtTime(-15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(3.0, audioCtxRef.current.currentTime, 0.1);
        } else {
            filterRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        }
    }, [frequency, eqMode]);

    const togglePlayManual = async () => {
        if (!audioCtxRef.current || !bufferRef.current) return;
        if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();

        if (isPlayingManual) {
            sourceRef.current?.stop();
            setIsPlayingManual(false);
        } else {
            const ctx = audioCtxRef.current;
            sourceRef.current = ctx.createBufferSource();
            sourceRef.current.buffer = bufferRef.current;
            sourceRef.current.loop = true;

            filterRef.current = ctx.createBiquadFilter();
            filterRef.current.type = 'peaking';
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = eqMode === 'cut' ? 3.0 : 6.0;
            filterRef.current.gain.value = eqMode === 'flat' ? 0 : (eqMode === 'boost' ? 15 : -15);

            sourceRef.current.connect(filterRef.current);
            filterRef.current.connect(ctx.destination);
            sourceRef.current.start();
            setIsPlayingManual(true);
        }
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waitlistEmail) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: waitlistEmail, plan: "EQ遊戲解鎖名單" })
            });
            if (!res.ok) throw new Error("提交失敗");
            setHasUnlockedFull(true);
        } catch (error) {
            alert("發生錯誤，請稍後再試！");
        } finally {
            setIsSubmitting(false);
        }
    };

    const mapFreqToX = (f: number) => ((Math.log10(f) - minLog) / (maxLog - minLog)) * 1000;
    const peakX = mapFreqToX(frequency);
    const gainOffset = eqMode === 'boost' ? -100 : (eqMode === 'cut' ? 80 : 0);
    const qWidth = eqMode === 'cut' ? 120 : 60;

    const eqPath = eqMode === 'flat'
        ? `M 0,150 L 1000,150`
        : `M 0,150 L ${peakX - qWidth},150 C ${peakX - qWidth / 2},150 ${peakX - 10},${150 + gainOffset} ${peakX},${150 + gainOffset} C ${peakX + 10},${150 + gainOffset} ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    const themeColor = eqMode === 'cut' ? '#ef4444' : (eqMode === 'boost' ? '#10b981' : '#64748b');
    const coachData = getExploreCoachText(frequency);

    return (
        <div className={`game-container ${isFlash ? 'correct-flash' : ''}`} style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif', transition: 'background-color 0.1s ease' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <button onClick={() => {
                    // 💡 返回時強制關閉聲音
                    if (isPlayingManual && sourceRef.current) {
                        try { sourceRef.current.stop(); } catch (e) { }
                        setIsPlayingManual(false);
                    }
                    router.push('/');
                }} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.4rem', borderRadius: '50px', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    ← 返回首頁
                </button>

                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        EQ 耳朵測試
                    </h1>
                </header>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    <button onClick={() => {
                        // 💡 切換模式時強制關閉聲音
                        if (isPlayingManual && sourceRef.current) {
                            try { sourceRef.current.stop(); } catch (e) { }
                            setIsPlayingManual(false);
                        }
                        setMode("explore");
                        setIsMissionPassed(false);
                    }} style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: mode === 'explore' ? '#10b981' : '#1e293b', color: mode === 'explore' ? '#020617' : '#94a3b8', transition: 'all 0.2s' }}>
                        🧭 EQ Playground
                    </button>
                    <button onClick={() => {
                        // 💡 切換模式時強制關閉聲音
                        if (isPlayingManual && sourceRef.current) {
                            try { sourceRef.current.stop(); } catch (e) { }
                            setIsPlayingManual(false);
                        }
                        setMode("challenge");
                        setFeedback("▶️ 點擊『開始監聽』並切換至正確狀態，拖曳滑桿尋找...");
                        setIsMissionPassed(false);
                    }} style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: mode === 'challenge' ? '#fbbf24' : '#1e293b', color: mode === 'challenge' ? '#020617' : '#94a3b8', transition: 'all 0.2s', boxShadow: mode === 'challenge' ? '0 0 15px rgba(251, 191, 36, 0.3)' : 'none' }}>
                        ⚔️ 聽覺挑戰模式
                    </button>
                </div>

                <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', padding: isMobile ? '1.5rem' : '3rem', borderRadius: '32px', border: '1px solid #1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                    {mode === "challenge" && currentMissionIndex >= MISSIONS.length ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                                你已完成 EQ 聽感訓練！
                            </h2>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', maxWidth: '500px', margin: '0 auto 2rem auto', textAlign: 'left', border: '1px solid #334155' }}>
                                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>你的耳朵現在已經能辨識：</p>
                                <ul style={{ color: '#a7f3d0', fontSize: '1.1rem', lineHeight: '2', paddingLeft: '1.5rem', margin: 0 }}>
                                    <li>✔ Muddy（混濁與紙箱味）</li>
                                    <li>✔ Harsh（尖銳刺耳頻段）</li>
                                    <li>✔ Air（空氣感與光澤）</li>
                                    <li>✔ Presence（聲音存在感）</li>
                                </ul>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem' }}>
                                👉 想學「怎麼實際把這些 EQ 技巧用在混音專案」嗎？
                            </p>
                            <Link href="/pricing" style={{ textDecoration: 'none' }}>
                                <button style={{ padding: '1.2rem 3rem', borderRadius: '50px', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', fontSize: '1.2rem', fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s' }}>
                                    解鎖完整混音實戰課程 🔒
                                </button>
                            </Link>
                        </div>

                    ) : mode === "challenge" && currentMissionIndex === 2 && !hasUnlockedFull ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👀</div>
                            <h3 style={{ color: '#fbbf24', fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem' }}>
                                你已經超越 80% 的初學者了！
                            </h3>
                            <div style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', maxWidth: '400px', margin: '0 auto 2rem auto', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                                <p style={{ margin: '0 0 10px 0', color: '#38bdf8', fontWeight: 'bold' }}>👉 完整訓練還包含：</p>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                    <li>壓縮器動態特訓 (Compressor)</li>
                                    <li>空間感訓練 (Reverb / Delay)</li>
                                    <li>多軌編曲與實戰盲測</li>
                                </ul>
                            </div>
                            <form onSubmit={handleWaitlistSubmit} style={{ maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ color: '#38bdf8', fontSize: '0.95rem', fontWeight: 'bold' }}>🎁 留下 Email 解鎖後續關卡，再送首月 5 折優惠：</div>
                                <input type="email" required placeholder="輸入您的常用 Email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: '#020617', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' }} />
                                <button type="submit" disabled={isSubmitting} style={{ padding: '1rem', borderRadius: '12px', background: '#38bdf8', color: '#020617', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                    {isSubmitting ? '處理中...' : '加入等待名單並繼續挑戰 🚀'}
                                </button>
                            </form>
                        </div>

                    ) : (
                        <>
                            {mode === "challenge" && currentMission && (
                                <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' }}>
                                            MISSION {currentMissionIndex + 1} / {MISSIONS.length}
                                        </span>
                                        <div style={{ width: '150px', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${((currentMissionIndex) / MISSIONS.length) * 100}%`, height: '100%', background: '#fbbf24', transition: 'width 0.3s ease' }}></div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '900', margin: '0 0 8px 0' }}>{currentMission.question}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>💡 <strong>提示：</strong>{currentMission.hint}</p>
                                </div>
                            )}

                            {mode === "explore" && (
                                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '2rem' }}>👨‍🏫</div>
                                    <div>
                                        <h3 style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '1.1rem' }}>{coachData.title}</h3>
                                        <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{coachData.desc}</p>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                {Object.values(TRACKS).map(track => (
                                    <button
                                        key={track.id} onClick={() => setActiveTrack(track.id as any)}
                                        style={{ padding: '0.8rem 1.2rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', background: activeTrack === track.id ? '#10b981' : 'rgba(255,255,255,0.05)', color: activeTrack === track.id ? '#020617' : '#94a3b8', border: `1px solid ${activeTrack === track.id ? '#10b981' : '#334155'}` }}
                                    >
                                        <div style={{ fontWeight: '900', fontSize: '1.05rem', marginBottom: '4px' }}>{track.name}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: activeTrack === track.id ? 0.9 : 0.6 }}>{track.focus}</div>
                                    </button>
                                ))}
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <span style={{
                                    background: eqMode === 'boost' ? 'rgba(16, 185, 129, 0.2)' : eqMode === 'cut' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
                                    color: eqMode === 'boost' ? '#10b981' : eqMode === 'cut' ? '#ef4444' : '#94a3b8',
                                    padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', border: `1px solid ${themeColor}`
                                }}>
                                    {eqMode === 'boost' ? '🔼 BOOSTING (放大特徵)' : eqMode === 'cut' ? '🔽 CUTTING (削減問題)' : '⚪ BYPASS (原聲比對)'}
                                </span>
                            </div>

                            <div style={{ width: '100%', height: isMobile ? '180px' : '240px', background: '#020617', borderRadius: '20px', border: '2px solid #1e293b', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    {[50, 100, 500, 1000, 5000, 10000].map(f => (
                                        <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255, 255, 255, 0.05)' }}>
                                            <span style={{ position: 'absolute', bottom: '10px', left: '6px', color: '#475569', fontSize: '0.75rem', fontWeight: 'bold' }}>{f >= 1000 ? `${f / 1000}k` : f}Hz</span>
                                        </div>
                                    ))}
                                    <div style={{ position: 'absolute', top: '150px', width: '100%', borderTop: '2px dashed rgba(255,255,255,0.15)' }}>
                                        <span style={{ position: 'absolute', right: '10px', top: '-20px', color: '#475569', fontSize: '0.75rem', fontWeight: 'bold' }}>0 dB</span>
                                    </div>
                                </div>

                                <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 10px ${themeColor}40)` }}>
                                    <path d={eqPath} fill="none" stroke={themeColor} strokeWidth="5" style={{ transition: 'all 0.05s ease' }} />
                                    {eqMode !== 'flat' && (
                                        <g style={{ transition: 'all 0.05s ease' }}>
                                            <circle cx={peakX} cy={150 + gainOffset} r="10" fill={themeColor} />
                                            <circle cx={peakX} cy={150 + gainOffset} r="4" fill="#020617" />
                                        </g>
                                    )}
                                </svg>
                                <div style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '2.5rem', fontWeight: '900', color: themeColor, fontFamily: 'monospace' }}>
                                    {displayFreq} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Hz</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', marginBottom: '2rem' }}>
                                <button onClick={togglePlayManual} disabled={isLoading} style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', border: 'none', cursor: 'pointer', background: isPlayingManual ? '#ef4444' : '#10b981', color: '#fff', boxShadow: isPlayingManual ? '0 0 20px rgba(239,68,68,0.2)' : 'none' }}>
                                    {isLoading ? '⏳ 載入音軌中...' : isPlayingManual ? '⏹️ 停止監聽' : '▶️ 開始監聽'}
                                </button>
                                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '6px', flex: 1.5, border: '1px solid #1e293b' }}>
                                    <button onClick={() => setEqMode('flat')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'flat' ? '#334155' : 'transparent', color: eqMode === 'flat' ? '#fff' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Bypass</button>
                                    <button onClick={() => setEqMode('boost')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'boost' ? 'rgba(16,185,129,0.2)' : 'transparent', color: eqMode === 'boost' ? '#10b981' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔼 Boost</button>
                                    <button onClick={() => setEqMode('cut')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'cut' ? 'rgba(239,68,68,0.2)' : 'transparent', color: eqMode === 'cut' ? '#ef4444' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔽 Cut</button>
                                </div>
                            </div>

                            <div style={{ background: '#020617', padding: '1.8rem', borderRadius: '20px', marginBottom: '2rem', border: '1px solid #1e293b' }}>
                                <input type="range" min="0" max="1000" value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: themeColor }} />
                            </div>

                            {mode === "challenge" && feedback && (
                                <div style={{
                                    padding: '1.5rem',
                                    background: isMissionPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.3)',
                                    border: `1px solid ${isMissionPassed ? '#10b981' : '#334155'}`,
                                    borderRadius: '16px',
                                    color: isMissionPassed ? '#6ee7b7' : '#fbbf24',
                                    fontWeight: '900',
                                    fontSize: '1.15rem',
                                    lineHeight: '1.6',
                                    animation: isMissionPassed ? 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
                                }}>
                                    {feedback}
                                </div>
                            )}

                            {mode === "challenge" && isMissionPassed && (
                                <button
                                    style={{
                                        marginTop: '1.5rem', padding: '1.1rem', width: '100%',
                                        background: '#fff', color: '#020617', border: 'none', borderRadius: '12px',
                                        fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer',
                                        boxShadow: '0 5px 20px rgba(255, 255, 255, 0.3)',
                                        animation: 'bounce 2s infinite'
                                    }}
                                    onClick={() => {
                                        // 💡 解鎖下一關時強制關閉聲音
                                        if (isPlayingManual && sourceRef.current) {
                                            try { sourceRef.current.stop(); } catch (e) { }
                                            setIsPlayingManual(false);
                                        }
                                        setCurrentMissionIndex((prev) => prev + 1);
                                        setIsMissionPassed(false);
                                        setFeedback("▶️ 點擊『開始監聽』並切換至正確狀態，拖曳滑桿尋找目標...");
                                    }}
                                >
                                    解鎖下一關 →
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* 放在「解鎖完整混音實戰課程 🔒」按鈕的下方 */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    💡 覺得這個 EQ 實驗室好玩嗎？告訴我們你想增加什麼功能！
                </p>
                <button
                    onClick={() => router.push('/feedback')}
                    style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.8rem 2rem', borderRadius: '50px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
                >
                    填寫回饋送早鳥 5 折優惠 ➔
                </button>
            </div>
            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes flash { 0% { background-color: #020617; } 50% { background-color: #064e3b; } 100% { background-color: #020617; } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .correct-flash { animation: flash 0.3s ease-out; }
            `}</style>
        </div>
    );
}

export default function EQGamePage() {
    return (
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>特訓艙載入中...</div>}>
            <EQGameContent />
        </Suspense>
    );
}