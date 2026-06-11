"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 題庫升級：加入診斷選擇與 3 層翻譯 (技術 -> 聽感 -> 身體感)
const labChallenges = [
    {
        id: 1,
        title: 'STEP 1: 尋找低頻的錨點',
        problemDesc: '這段低頻聽起來有點鬆散、沒有拳頭感。你覺得問題出在哪？',
        fileBad: '/audio/groove/groove_1_bad.mp3',
        fileFixed: '/audio/groove/groove_1_fix.mp3',
        options: [
            { id: 'A', text: 'Kick (大鼓) 太小聲了' },
            { id: 'B', text: 'Kick 跟 Bass 時間沒對齊' },
            { id: 'C', text: 'Bass 缺少高頻的亮度' }
        ],
        correct: 'B',
        feedbackCorrect: '完全命中！微小的時間差正是低頻鬆散的元兇。',
        feedbackIncorrect: '其實音量跟頻率沒問題，真正的原因藏在「時間」裡。',
        insight: {
            tech: 'Bass 發聲點比 Kick 晚了約 15~30ms',
            audio: '低頻互相拉扯，聽起來像在拖地、沒有 Punch',
            physical: '沒有「一拳打在胸口」的感覺，身體點不下頭'
        }
    },
    {
        id: 2,
        title: 'STEP 2: 機器人 vs 真人',
        problemDesc: '這段節奏聽起來非常乾，像死板的 MIDI Demo。為什麼？',
        fileBad: '/audio/groove/groove_2_bad.mp3',
        fileFixed: '/audio/groove/groove_2_fix.mp3',
        options: [
            { id: 'A', text: '沒有加 Reverb (空間殘響)' },
            { id: 'B', text: '樂器的音色選錯了' },
            { id: 'C', text: '100% 對齊網格，力度死板' }
        ],
        correct: 'C',
        feedbackCorrect: '太敏銳了！不完美的「微小時間差」才是人類演奏的靈魂。',
        feedbackIncorrect: '其實音色與空間沒問題，問題出在「太過完美」的機械感。',
        insight: {
            tech: '100% Quantize (全對齊)，且力度 (Velocity) 毫無變化',
            audio: '聲音極度死板、乾扁，像機器人打鼓',
            physical: '聽了覺得身體很僵硬，沒有呼吸的感覺'
        }
    },
    {
        id: 3,
        title: 'STEP 3: 隱形的推進器',
        problemDesc: '音樂感覺「停在原地」，沒有前進的動力。問題是？',
        fileBad: '/audio/groove/groove_3_bad.mp3',
        fileFixed: '/audio/groove/groove_3_fix.mp3',
        options: [
            { id: 'A', text: 'BPM (拍速) 設定得太慢了' },
            { id: 'B', text: 'Hi-hat 缺乏輕重音 (Accent) 變化' },
            { id: 'C', text: 'Bass 彈得太少了' }
        ],
        correct: 'B',
        feedbackCorrect: '專業！速度感不只是 BPM，而是藏在輕重音的起伏裡。',
        feedbackIncorrect: '其實 BPM 是一樣的！真正的推進力藏在 Hi-hat 的動態裡。',
        insight: {
            tech: '16 分音符 Hi-hat 缺乏 Accent 與微 Swing',
            audio: '節奏平坦無聊，缺乏起伏的律動感',
            physical: '音樂停滯不前，沒有帶著你「往前走」的推力'
        }
    }
];

export default function GrooveCorrectionLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 核心狀態
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'listen' | 'result'>('listen');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'bad' | 'fixed'>('bad');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // 🎧 Web Audio API Refs (零延遲切換核心)
    const audioCtxRef = useRef<AudioContext | null>(null);
    const badBufferRef = useRef<AudioBuffer | null>(null);
    const fixedBufferRef = useRef<AudioBuffer | null>(null);
    const badSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const fixedSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const badGainRef = useRef<GainNode | null>(null);
    const fixedGainRef = useRef<GainNode | null>(null);

    const q = labChallenges[currentIndex];

    // 視窗偵測 (Debounced)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let timeoutId: NodeJS.Timeout;
        const checkMobile = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 300);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timeoutId);
        };
    }, []);

    // 🔄 載入與解碼音檔
    useEffect(() => {
        let isCurrentEffect = true;
        const loadAudio = async () => {
            setIsLoading(true);
            stopAudio();

            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;

            try {
                const [resBad, resFixed] = await Promise.all([
                    fetch(q.fileBad),
                    fetch(q.fileFixed)
                ]);
                const [bufBad, bufFixed] = await Promise.all([
                    resBad.arrayBuffer(),
                    resFixed.arrayBuffer()
                ]);

                if (!isCurrentEffect) return;
                badBufferRef.current = await ctx.decodeAudioData(bufBad);
                fixedBufferRef.current = await ctx.decodeAudioData(bufFixed);
            } catch (error) {
                console.error("Audio Decode Error:", error);
            }

            if (isCurrentEffect) {
                setIsLoading(false);
                setPhase('listen');
                setCurrentTrack('bad');
                setSelectedOption(null);
            }
        };

        loadAudio();
        return () => {
            isCurrentEffect = false;
            stopAudio();
        };
    }, [currentIndex, q]);

    // ⏹️ 停止音訊
    const stopAudio = () => {
        if (badSourceRef.current) {
            badSourceRef.current.stop();
            badSourceRef.current.disconnect();
            badSourceRef.current = null;
        }
        if (fixedSourceRef.current) {
            fixedSourceRef.current.stop();
            fixedSourceRef.current.disconnect();
            fixedSourceRef.current = null;
        }
        setIsPlaying(false);
    };

    // ▶️ 大顆播放按鈕
    const togglePlay = async () => {
        if (isLoading || !badBufferRef.current || !fixedBufferRef.current) return;
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (isPlaying) {
            stopAudio();
            return;
        }

        if (ctx.state === 'suspended') await ctx.resume();

        badSourceRef.current = ctx.createBufferSource();
        fixedSourceRef.current = ctx.createBufferSource();
        badSourceRef.current.buffer = badBufferRef.current;
        fixedSourceRef.current.buffer = fixedBufferRef.current;
        badSourceRef.current.loop = true;
        fixedSourceRef.current.loop = true;

        badGainRef.current = ctx.createGain();
        fixedGainRef.current = ctx.createGain();

        // 初始音量設定：依據 currentTrack 決定誰發聲
        badGainRef.current.gain.value = currentTrack === 'bad' ? 1 : 0;
        fixedGainRef.current.gain.value = currentTrack === 'fixed' ? 1 : 0;

        badSourceRef.current.connect(badGainRef.current).connect(ctx.destination);
        fixedSourceRef.current.connect(fixedGainRef.current).connect(ctx.destination);

        const startTime = ctx.currentTime + 0.05;
        badSourceRef.current.start(startTime);
        fixedSourceRef.current.start(startTime);

        setIsPlaying(true);
    };

    // 🎚️ A/B 瞬間無縫切換 (Crossfade)
    const switchTrack = (track: 'bad' | 'fixed') => {
        setCurrentTrack(track);
        if (badGainRef.current && fixedGainRef.current && audioCtxRef.current) {
            const now = audioCtxRef.current.currentTime;
            badGainRef.current.gain.setTargetAtTime(track === 'bad' ? 1 : 0, now, 0.02);
            fixedGainRef.current.gain.setTargetAtTime(track === 'fixed' ? 1 : 0, now, 0.02);
        }
    };

    // 🎯 答題邏輯
    const handleDiagnose = (optionId: string) => {
        if (selectedOption) return; // 鎖定作答
        setSelectedOption(optionId);
        setPhase('result');
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

        // 答題後，自動切換到正確的聲音，讓使用者瞬間感受差異
        switchTrack('fixed');
    };

    const handleNext = () => {
        stopAudio();
        if (currentIndex < labChallenges.length - 1) {
            setCurrentIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/courses/arrangement/voicing-intro');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>

            {/* 🧠 HEADER */}
            <header style={{ width: '100%', maxWidth: '700px', textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: '900', margin: '0 0 1rem 0', letterSpacing: '2px', color: '#f8fafc' }}>
                    GROOVE 修正實驗室
                </h1>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {labChallenges.map((_, idx) => (
                            <div key={idx} style={{
                                width: '40px', height: '6px', borderRadius: '3px', transition: 'all 0.3s',
                                background: idx === currentIndex ? '#38bdf8' : idx < currentIndex ? '#10b981' : '#1e293b'
                            }} />
                        ))}
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {/* 🎧 主互動區 (播放與 A/B 切換) */}
                <section style={{ background: 'rgba(15, 23, 42, 0.6)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center' }}>

                    <div style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{q.title}</div>
                    <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', color: '#fff', marginBottom: '2rem', fontWeight: 'bold', lineHeight: '1.5' }}>
                        {q.problemDesc}
                    </h2>

                    {/* 🚀 Giant Play Button */}
                    <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        style={{
                            background: isPlaying ? 'rgba(56, 189, 248, 0.1)' : 'linear-gradient(135deg, #38bdf8, #2563eb)',
                            color: isPlaying ? '#38bdf8' : '#fff',
                            border: isPlaying ? '1px solid #38bdf8' : 'none',
                            padding: isMobile ? '1.2rem 2rem' : '1.5rem 4rem',
                            fontSize: isMobile ? '1.2rem' : '1.4rem',
                            fontWeight: '900',
                            borderRadius: '50px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isPlaying ? 'none' : '0 10px 30px rgba(56, 189, 248, 0.3)',
                            marginBottom: '2rem', width: '100%', transition: 'all 0.3s'
                        }}
                    >
                        {isLoading ? '⏳ 載入高音質音軌中...' : isPlaying ? '⏹ 停止播放' : '▶️ 播放 Loop 試聽'}
                    </button>

                    {/* 🔥 A/B Toggle (答題後解鎖) */}
                    {phase === 'result' && (
                        <div style={{ animation: 'fadeInUp 0.5s' }}>
                            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '10px' }}>
                                ✨ 已為你解鎖雙軌切換！在播放中點擊聽聽差異：
                            </p>
                            <div style={{ display: 'flex', background: '#020617', borderRadius: '50px', padding: '6px', border: '1px solid #334155' }}>
                                <button
                                    onClick={() => switchTrack('bad')}
                                    style={{
                                        flex: 1, padding: '1rem', borderRadius: '50px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s',
                                        background: currentTrack === 'bad' ? '#ef4444' : 'transparent', color: currentTrack === 'bad' ? '#fff' : '#64748b'
                                    }}
                                >
                                    👈 聽問題版
                                </button>
                                <button
                                    onClick={() => switchTrack('fixed')}
                                    style={{
                                        flex: 1, padding: '1rem', borderRadius: '50px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s',
                                        background: currentTrack === 'fixed' ? '#10b981' : 'transparent', color: currentTrack === 'fixed' ? '#fff' : '#64748b'
                                    }}
                                >
                                    聽修正版 👉
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* 🤔 診斷任務區 (Listen Phase) */}
                {phase === 'listen' && (
                    <section style={{ animation: 'fadeInUp 0.5s' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {q.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleDiagnose(opt.id)}
                                    disabled={!isPlaying}
                                    style={{
                                        background: '#1e293b', border: '1px solid transparent', padding: isMobile ? '1.2rem' : '1.5rem', borderRadius: '16px', color: '#fff', fontSize: '1.1rem', textAlign: 'left', cursor: isPlaying ? 'pointer' : 'not-allowed', opacity: isPlaying ? 1 : 0.5, transition: 'all 0.2s', display: 'flex', gap: '1rem'
                                    }}
                                    onMouseOver={e => isPlaying && (e.currentTarget.style.border = '1px solid #38bdf8')}
                                    onMouseOut={e => e.currentTarget.style.border = '1px solid transparent'}
                                >
                                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{opt.id}.</span> {opt.text}
                                </button>
                            ))}
                        </div>
                        {!isPlaying && <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem', fontSize: '0.9rem' }}>請先點擊上方播放按鈕，再進行作答</p>}
                    </section>
                )}

                {/* 🎯 結果與 3 層翻譯 Insight (Result Phase) */}
                {phase === 'result' && (
                    <section style={{ animation: 'fadeInUp 0.5s' }}>
                        <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid #a78bfa', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ color: selectedOption === q.correct ? '#34d399' : '#f87171', fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                                    {selectedOption === q.correct ? q.feedbackCorrect : q.feedbackIncorrect}
                                </div>
                            </div>

                            {/* 💡 3 層翻譯：技術 -> 聽感 -> 身體 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #94a3b8' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>🔧 技術層面</div>
                                    <div style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>{q.insight.tech}</div>
                                </div>
                                <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                                    <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>🎧 聽感表現</div>
                                    <div style={{ color: '#e0f2fe', fontSize: '1.05rem', lineHeight: '1.5' }}>{q.insight.audio}</div>
                                </div>
                                <div style={{ background: 'rgba(252, 163, 17, 0.08)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #fca311' }}>
                                    <div style={{ color: '#fca311', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>🕺 身體感受</div>
                                    <div style={{ color: '#fef3c7', fontSize: '1.05rem', lineHeight: '1.5' }}>{q.insight.physical}</div>
                                </div>
                            </div>

                            <button onClick={handleNext} style={{ width: '100%', padding: '1.2rem', background: '#fff', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }}>
                                {currentIndex < labChallenges.length - 1 ? '挑戰下一關 ➔' : '完成 Groove 修復 ➔'}
                            </button>
                        </div>
                    </section>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}