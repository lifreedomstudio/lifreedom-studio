"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 輔助函數：精準延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Phase = 'listen' | 'contrast' | 'result';

// 🎯 題庫移至組件外部 (未來可獨立為 config 檔)
const labChallenges = [
    {
        id: 1,
        title: 'STEP 1: Kick / Bass 沒有鎖住',
        problemDesc: '這段低頻聽起來有點鬆散、沒有拳頭感。',
        fixName: '鎖定 Kick & Bass',
        fileBad: '/audio/groove/groove_1_bad.mp3',
        fileFixed: '/audio/groove/groove_1_fix.mp3',
        badSymptom: '❌ 低頻像在拖地、沒有 Punch。Bass 稍微晚了 15~30ms。',
        fixedSymptom: '✅ 低頻變「一拳打出去」，身體會想點頭，Groove 明顯變穩。',
        insight: 'Kick = 100% on grid，Bass 完全貼齊 Kick (或微提前)，這就是低頻力量的來源。'
    },
    {
        id: 2,
        title: 'STEP 2: 機器人 vs 真人 (Humanize)',
        problemDesc: '這段節奏聽起來非常乾，像死板的 MIDI Demo。',
        fixName: '微人性化 (Humanize)',
        fileBad: '/audio/groove/groove_2_bad.mp3',
        fileFixed: '/audio/groove/groove_2_fix.mp3',
        badSymptom: '❌ 全 Quantize (100% grid)，力度全部一樣，沒有呼吸感。',
        fixedSymptom: '✅ 加入微小的時間偏移與力度變化後，音樂開始「活起來」了。',
        insight: '不用每一次都敲在正拍上。隨機的 ±5~15ms 偏移與輕重音，正是人類演奏的靈魂。'
    },
    {
        id: 3,
        title: 'STEP 3: Hi-hat 推進感',
        problemDesc: '這段節奏聽起來很平、很無聊，音樂感覺「停在原地」。',
        fixName: '加入動態推進 (Groove Push)',
        fileBad: '/audio/groove/groove_3_bad.mp3',
        fileFixed: '/audio/groove/groove_3_fix.mp3',
        badSymptom: '❌ 16 分音符完全機械化，Hi-hat 力度平坦無 Accent。',
        fixedSymptom: '✅ 加入 Accent (強弱音) 與微 Swing，音樂瞬間有了「走路感」。',
        insight: '速度感不只是 BPM，利用 Hi-hat 做出 1-弱-強-弱 的動態，才能推著音樂往前走。'
    }
];

export default function GrooveCorrectionLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 核心狀態
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('listen');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'bad' | 'fixed'>('bad');

    // 🎧 專業 Web Audio API Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const badBufferRef = useRef<AudioBuffer | null>(null);
    const fixedBufferRef = useRef<AudioBuffer | null>(null);
    const badSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const fixedSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const badGainRef = useRef<GainNode | null>(null);
    const fixedGainRef = useRef<GainNode | null>(null);

    // 鎖定機制
    const isProcessingRef = useRef(false);

    const q = labChallenges[currentIndex];

    // 視窗偵測 (Debounced)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        let timeoutId: NodeJS.Timeout;
        const checkMobile = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 150);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timeoutId);
        };
    }, []);

    // 🔄 載入與解碼音檔 (每次換題時觸發)
    useEffect(() => {
        let isCurrentEffect = true;

        const loadAudio = async () => {
            setIsLoading(true);
            stopAudio(); // 確保上一題的聲音被停止

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

                if (!isCurrentEffect) return; // 避免組件卸載後繼續解碼

                badBufferRef.current = await ctx.decodeAudioData(bufBad);
                fixedBufferRef.current = await ctx.decodeAudioData(bufFixed);
            } catch (error) {
                console.error("Audio Decode Error:", error);
            }

            if (isCurrentEffect) {
                setIsLoading(false);
                setPhase('listen');
                setCurrentTrack('bad');
                isProcessingRef.current = false;
            }
        };

        loadAudio();

        return () => {
            isCurrentEffect = false;
            stopAudio();
        };
    }, [currentIndex, q]);

    // ⏹️ 停止音訊並清理 Node
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

    // ▶️ Web Audio 播放控制
    const togglePlay = async () => {
        if (isLoading || !badBufferRef.current || !fixedBufferRef.current) return;

        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (isPlaying) {
            stopAudio();
            return;
        }

        // 必須在使用者互動時 Resume 確保 Safari 允許播放
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        // 建立 Source
        badSourceRef.current = ctx.createBufferSource();
        fixedSourceRef.current = ctx.createBufferSource();
        badSourceRef.current.buffer = badBufferRef.current;
        fixedSourceRef.current.buffer = fixedBufferRef.current;
        badSourceRef.current.loop = true;
        fixedSourceRef.current.loop = true;

        // 建立 Gain (音量) 控制器
        badGainRef.current = ctx.createGain();
        fixedGainRef.current = ctx.createGain();

        // 初始音量設定
        badGainRef.current.gain.value = currentTrack === 'bad' ? 1 : 0;
        fixedGainRef.current.gain.value = currentTrack === 'fixed' ? 1 : 0;

        // 連接線路：Source -> Gain -> Destination(喇叭)
        badSourceRef.current.connect(badGainRef.current).connect(ctx.destination);
        fixedSourceRef.current.connect(fixedGainRef.current).connect(ctx.destination);

        // 確保兩者在未來同一個精準時間點一起播放 (Sample-accurate sync)
        const startTime = ctx.currentTime + 0.05;
        badSourceRef.current.start(startTime);
        fixedSourceRef.current.start(startTime);

        setIsPlaying(true);
    };

    // 🎚️ 使用 GainNode 進行無縫音軌切換 (0.02秒 Crossfade 防爆音)
    const switchTrack = (track: 'bad' | 'fixed') => {
        setCurrentTrack(track);
        if (badGainRef.current && fixedGainRef.current && audioCtxRef.current) {
            const ctx = audioCtxRef.current;
            const now = ctx.currentTime;

            // 使用 setTargetAtTime 建立平滑的淡入淡出曲線
            badGainRef.current.gain.setTargetAtTime(track === 'bad' ? 1 : 0, now, 0.02);
            fixedGainRef.current.gain.setTargetAtTime(track === 'fixed' ? 1 : 0, now, 0.02);
        }
    };

    // 🔧 執行修正，觸發安全保護的自動切段對比
    const handleApplyFix = async () => {
        if (phase === 'contrast' || !isPlaying || isProcessingRef.current) return;

        isProcessingRef.current = true;
        setPhase('contrast');

        const steps = ['bad', 'fixed', 'bad', 'fixed'] as const;

        for (const track of steps) {
            if (!isProcessingRef.current) break; // 如果提早按了下一題，立刻中斷
            switchTrack(track);
            await delay(1200); // Groove 需要稍微長一點的時間感受
        }

        if (isProcessingRef.current) {
            setPhase('result');
            isProcessingRef.current = false;
        }
    };

    const handleNext = () => {
        isProcessingRef.current = false; // 中斷正在進行的動畫與切換
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

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: isMobile ? '1rem' : '1.15rem' }}>
                        你現在不是在學理論。<br />
                        <strong style={{ color: '#fca311' }}>你是在「修一段壞掉的音樂」。</strong>
                    </p>
                </div>
            </header>

            <div style={{ maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {/* 🎧 SECTION 1: 問題音 (核心刺激) */}
                <section style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    {phase === 'contrast' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(16, 185, 129, 0.1)', zIndex: 0, animation: 'pulseBg 0.8s infinite alternate' }} />
                    )}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{q.title}</div>
                        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>{q.problemDesc}</h2>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
                            點擊播放，先聽聽看哪裡出了狀況。
                        </p>

                        <button
                            onClick={togglePlay}
                            disabled={isLoading}
                            style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#38bdf8' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)', marginBottom: '1.5rem', width: isMobile ? '100%' : 'auto', transition: 'all 0.3s' }}
                        >
                            {isLoading ? '⏳ 載入高音質圖檔中...' : isPlaying ? '⏹ 停止播放' : '▶ 載入並播放'}
                        </button>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => switchTrack('bad')}
                                disabled={phase === 'contrast' || !isPlaying}
                                style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: currentTrack === 'bad' && isPlaying ? '2px solid #ef4444' : '1px solid #334155', background: currentTrack === 'bad' && isPlaying ? 'rgba(239, 68, 68, 0.1)' : '#0f172a', color: currentTrack === 'bad' && isPlaying ? '#ef4444' : '#64748b', fontWeight: 'bold', cursor: (phase === 'contrast' || !isPlaying) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flex: 1, boxShadow: currentTrack === 'bad' && isPlaying ? '0 0 15px rgba(239,68,68,0.3)' : 'none' }}
                            >
                                ❌ 問題版 (Bad)
                            </button>
                            <button
                                onClick={() => switchTrack('fixed')}
                                disabled={phase === 'listen' || phase === 'contrast' || !isPlaying}
                                style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: currentTrack === 'fixed' && isPlaying ? '2px solid #10b981' : '1px solid #334155', background: currentTrack === 'fixed' && isPlaying ? 'rgba(16, 185, 129, 0.1)' : '#0f172a', color: currentTrack === 'fixed' && isPlaying ? '#10b981' : '#64748b', fontWeight: 'bold', cursor: (phase === 'listen' || phase === 'contrast' || !isPlaying) ? 'not-allowed' : 'pointer', opacity: phase === 'listen' ? 0.5 : 1, transition: 'all 0.2s', flex: 1, boxShadow: currentTrack === 'fixed' && isPlaying ? '0 0 15px rgba(16,185,129,0.3)' : 'none' }}
                            >
                                {phase === 'listen' ? '🔒 正常版 (未解鎖)' : '✅ 對照版 (Good)'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* 🔧 SECTION 2: 修正工具 */}
                {(phase === 'listen' || phase === 'contrast' || phase === 'result') && (
                    <section style={{ animation: 'fadeInUp 0.5s' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '1rem', fontWeight: 'bold' }}>現在，親手修復這段 Groove</h3>
                        </div>

                        <button
                            onClick={handleApplyFix}
                            disabled={phase === 'contrast' || !isPlaying || phase === 'result'}
                            style={{
                                width: '100%', background: phase === 'result' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                                border: phase === 'result' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
                                padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem',
                                cursor: (phase === 'contrast' || !isPlaying || phase === 'result') ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s', textAlign: 'left',
                                boxShadow: phase === 'listen' && isPlaying ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem' }}>🔧</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: phase === 'result' ? '#10b981' : '#fff', fontWeight: '900', fontSize: '1.3rem', marginBottom: '4px' }}>
                                    套用修正：{q.fixName}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{isPlaying ? '點擊立刻對比聽感差異' : '請先點擊上方載入播放'}</div>
                            </div>
                        </button>

                        {/* 🧨 視覺化 Feedback：動態 Waveform */}
                        {phase === 'contrast' && (
                            <div style={{ textAlign: 'center', marginTop: '2rem', animation: 'fadeIn 0.3s' }}>
                                <div style={{ color: currentTrack === 'fixed' ? '#10b981' : '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', transition: 'color 0.3s' }}>
                                    ✨ 正在自動切換比對... ({currentTrack === 'fixed' ? 'Good' : 'Bad'})
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '40px', alignItems: 'center' }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} style={{ width: '6px', background: currentTrack === 'fixed' ? '#10b981' : '#ef4444', borderRadius: '3px', transition: 'background 0.3s', animation: `wave 1s infinite alternate ${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* 🧠 SECTION 3: 認知重塑 (結果解析) */}
                {phase === 'result' && (
                    <section style={{ animation: 'fadeInUp 0.8s', marginTop: '1rem' }}>
                        <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid #a78bfa', padding: '2.5rem 2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <h2 style={{ fontSize: '1.6rem', color: '#10b981', fontWeight: '900', marginBottom: '1.5rem', textAlign: 'center' }}>
                                👏 聽出差異了嗎？
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '1rem 1.5rem', borderRadius: '0 12px 12px 0' }}>
                                    <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '5px' }}>修正前 (Bad)</div>
                                    <div style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.6' }}>{q.badSymptom}</div>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', padding: '1rem 1.5rem', borderRadius: '0 12px 12px 0' }}>
                                    <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>修正後 (Good)</div>
                                    <div style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.6' }}>{q.fixedSymptom}</div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed #fca311', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ color: '#fca311', fontWeight: 'bold', marginBottom: '8px' }}>💡 製作人心法</div>
                                <div style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>{q.insight}</div>
                            </div>

                            <button onClick={handleNext} style={{ width: '100%', padding: '1.2rem', background: '#fff', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }}>
                                {currentIndex < labChallenges.length - 1 ? '進入下一關修復 ➔' : '完成 Groove 修復，進入下一章 ➔'}
                            </button>
                        </div>
                    </section>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseBg { 0% { opacity: 0.3; } 100% { opacity: 0.8; } }
                @keyframes pulseText { 0% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } 100% { opacity: 0.6; transform: scale(0.98); } }
                @keyframes wave { 0% { height: 10px; } 100% { height: 40px; } }
            ` }} />
        </div>
    );
}