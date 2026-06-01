"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 遊戲題庫：Groove 感知測試
const grooveQuestions = [
    {
        id: 1,
        title: 'Round 1: 穩定與死板',
        question: '哪一個比較讓你想「點頭」？',
        fileA: '/audio/groove/q1_a_dead.mp3',
        fileB: '/audio/groove/q1_b_alive.mp3',
        correct: 'B',
        feedbackCorrect: '你感受到了！微小的時間偏移反而帶來了律動。',
        feedbackIncorrect: '完全對齊 (Quantized) 的節奏聽起來其實會像機器人。',
        insight: '🎧 好的 Groove 不是 100% 準準對在格子上，而是有呼吸的空間。'
    },
    {
        id: 2,
        title: 'Round 2: 重量的錨點',
        question: '哪一個聽起來比較「有重量」？',
        fileA: '/audio/groove/q2_a_unaligned.mp3',
        fileB: '/audio/groove/q2_b_locked.mp3',
        correct: 'B',
        feedbackCorrect: '沒錯，這就是頻率與節奏「鎖死」的威力！',
        feedbackIncorrect: '當 Kick 跟 Bass 沒有對齊，低頻會互相拉扯，聽起來反而虛浮。',
        insight: '🎧 黏度 = Kick (大鼓) 與 Bass (貝斯) 的發聲點與釋放點完全貼合。'
    },
    {
        id: 3,
        title: 'Round 3: 隱形的推進器',
        question: '哪一個聽起來比較「有速度感」？',
        fileA: '/audio/groove/q3_a_flat.mp3',
        fileB: '/audio/groove/q3_b_groove.mp3',
        correct: 'B',
        feedbackCorrect: '太敏銳了！你抓到了隱藏在細節裡的前進動力。',
        feedbackIncorrect: '平鋪直敘的力度會讓音樂失去前進的推力。',
        insight: '🎧 速度感不只是 BPM，更是 Hi-hat 的輕重音變化 (Accent)。'
    }
];

// 輔助函數：延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function GrooveGamePage() {
    const router = useRouter();

    // 📱 新增：手機版偵測狀態
    const [isMobile, setIsMobile] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A');
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [isAutoContrasting, setIsAutoContrasting] = useState(false);
    const [cheatMode, setCheatMode] = useState<'idle' | 'slow' | 'fast'>('idle');

    const audioARef = useRef<HTMLAudioElement | null>(null);
    const audioBRef = useRef<HTMLAudioElement | null>(null);
    const isMounted = useRef(true);
    const activeSequence = useRef(0);

    const q = grooveQuestions[currentIndex];

    // 視窗偵測與音檔清理
    useEffect(() => {
        window.scrollTo(0, 0); // 確保每次進入都在最上面
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        isMounted.current = true;
        return () => {
            isMounted.current = false;
            window.removeEventListener('resize', checkMobile);
            if (audioARef.current) {
                audioARef.current.pause();
                audioARef.current.src = "";
            }
            if (audioBRef.current) {
                audioBRef.current.pause();
                audioBRef.current.src = "";
            }
        };
    }, []);

    // 初始化與切換音檔
    useEffect(() => {
        if (showResult) return;
        if (audioARef.current && audioBRef.current && q) {
            audioARef.current.volume = 0.8;
            audioBRef.current.volume = 0.8;

            audioARef.current.src = q.fileA;
            audioBRef.current.src = q.fileB;
            audioARef.current.load();
            audioBRef.current.load();
            if (isPlaying) {
                audioARef.current.play();
                audioBRef.current.play();
            }
        }
        setCurrentTrack('A');
        setSelectedAnswer(null);
        setCheatMode('idle');
    }, [currentIndex, showResult, q]);

    const togglePlay = () => {
        if (!audioARef.current || !audioBRef.current) return;
        if (isPlaying) {
            audioARef.current.pause();
            audioBRef.current.pause();
        } else {
            audioARef.current.play();
            audioBRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const switchTrack = (track: 'A' | 'B') => {
        if (!isMounted.current) return;
        setCurrentTrack(track);
        if (audioARef.current && audioBRef.current) {
            audioARef.current.muted = track !== 'A';
            audioBRef.current.muted = track !== 'B';
        }
    };

    // ⚡ 兩段式作弊按鈕 (上癮探索機制)
    const handleFastSwitch = async () => {
        if (selectedAnswer || isAutoContrasting || !isPlaying) return;

        let speed = 800;
        if (cheatMode === 'idle') {
            setCheatMode('slow');
            speed = 800;
        } else if (cheatMode === 'slow') {
            setCheatMode('fast');
            speed = 400;
        } else {
            return;
        }

        const seq = Date.now();
        activeSequence.current = seq;
        const originalTrack = currentTrack;

        switchTrack('A'); await delay(speed); if (activeSequence.current !== seq || !isMounted.current) return;
        switchTrack('B'); await delay(speed); if (activeSequence.current !== seq || !isMounted.current) return;
        switchTrack('A'); await delay(speed); if (activeSequence.current !== seq || !isMounted.current) return;
        switchTrack('B'); await delay(speed); if (activeSequence.current !== seq || !isMounted.current) return;

        switchTrack(originalTrack);
        setCheatMode('idle');
    };

    // 🎯 答題與不對等時間爆點對比
    const handleSelect = async (answer: 'A' | 'B') => {
        if (selectedAnswer || isAutoContrasting || cheatMode !== 'idle') return;
        setSelectedAnswer(answer);

        if (answer === q.correct) {
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

        setIsAutoContrasting(true);
        switchTrack('A'); await delay(700); if (!isMounted.current) return;
        switchTrack('B'); await delay(700); if (!isMounted.current) return;
        switchTrack('A'); await delay(700); if (!isMounted.current) return;
        switchTrack('B'); await delay(1200); if (!isMounted.current) return;

        switchTrack(q.correct as 'A' | 'B');
        setIsAutoContrasting(false);
    };

    const handleNext = () => {
        if (currentIndex < grooveQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (audioARef.current) audioARef.current.pause();
            if (audioBRef.current) audioBRef.current.pause();
            setShowResult(true);
        }
    };

    const resetGame = () => {
        setScore(0);
        setStreak(0);
        setCurrentIndex(0);
        setShowResult(false);
    };

    const getStreakMessage = () => {
        if (streak === 2) return "不錯喔，耳朵有點東西";
        if (streak === 3) return "👉 你開始穩了";
        if (streak >= 4) return "👉 這不是運氣了";
        return "";
    };

    // 🎬 結算畫面
    if (showResult) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: isMobile ? '2.5rem 1.5rem' : '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '550px', width: '100%', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.5s', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>

                    <div style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>TEST COMPLETE</div>

                    <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '900', margin: '0 0 0.5rem 0' }}>
                        你剛剛答對了：<span style={{ color: '#fca311' }}>{score} / 3</span>
                    </h1>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', margin: '2rem 0', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', margin: '0 0 1rem 0', lineHeight: '1.6' }}>
                            👉 這代表：<br />
                            <strong style={{ color: '#fff', fontSize: '1.3rem' }}>你已經開始「感覺到 Groove」了。</strong>
                        </p>

                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #f97316', marginBottom: '1.5rem' }}>
                            <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>一般人：聽歌 = 聽背景音樂</p>
                            <p style={{ color: '#fca311', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>你現在：開始聽到裡面的「動力」</p>
                        </div>

                        <p style={{ color: '#ef4444', fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                            但，你的直覺還不穩定。
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                            這也就是為什麼，你做出來的 Beat 有時候聽起來很讚，有時候卻覺得哪裡怪怪的，但你不知道怎麼修。
                        </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', margin: '0 0 2rem 0', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <p style={{ color: '#fca311', fontWeight: 'bold', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>接下來你會學到：</p>
                        <ul style={{ color: '#cbd5e1', lineHeight: '2', margin: 0, paddingLeft: '1.5rem', fontSize: '1.05rem' }}>
                            <li>✔ 怎麼讓鼓跟貝斯鎖在一起</li>
                            <li>✔ 怎麼做出會讓人點頭的節奏</li>
                            <li>✔ 為什麼你的 Beat 有時候會「垮掉」</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => router.push('/courses/arrangement/groove-chapter')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(234, 88, 12, 0.4)' }}>
                            🚀 我要變穩 (進入正式訓練) ➔
                        </button>

                        <button onClick={resetGame} style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                            🎮 再挑戰一次
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🎮 遊戲本體畫面
    // 🚨 修正重點：改用 justifyContent: 'center' 讓內容自然居中，移除 flex: 1 避免擠壓
    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '2rem 1rem' : '4rem 1rem', fontFamily: 'sans-serif' }}>

            <audio ref={audioARef} loop muted={currentTrack !== 'A'} />
            <audio ref={audioBRef} loop muted={currentTrack !== 'B'} />

            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>

                {/* 標題與進度條 */}
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '0.5rem' }}>GROOVE 感知測試</div>
                    <div style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem' }}>你真的聽得出節奏在動嗎？</div>

                    {streak >= 2 && (
                        <div style={{ color: '#fca311', fontWeight: '900', fontSize: '1.1rem', marginBottom: '1rem', animation: 'popIn 0.3s' }}>
                            🔥 連續命中：{streak} <br />
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{getStreakMessage()}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                        <span>{q?.title}</span>
                        <span>{currentIndex + 1} / {grooveQuestions.length}</span>
                    </div>
                    <div style={{ height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${((currentIndex + 1) / grooveQuestions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #a78bfa, #f97316)', transition: 'width 0.4s ease' }} />
                    </div>
                </div>

                {/* ⚠️ 提醒區 */}
                {currentIndex === 0 && !selectedAnswer && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca311', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        <strong>⚠️ 提醒：</strong> 大部分人第一題都會選錯。<br />
                        但只要你撐到第三題，你會開始真正「聽懂」。
                    </div>
                )}

                <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.4', textAlign: 'center' }}>
                    {q?.question}
                </h1>

                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <button onClick={togglePlay} style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#38bdf8' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: isMobile ? '0.8rem 2rem' : '1rem 3rem', fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)' }}>
                        {isPlaying ? '🔁 持續播放中' : '▶ 開始聽'}
                    </button>
                </div>

                {/* 🎧 聽力切換區 */}
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.8rem', textAlign: 'center' }}>👉 點擊切換聆聽，兩者在「同一時間點」播放</div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => switchTrack('A')}
                        disabled={isAutoContrasting || cheatMode !== 'idle'}
                        style={{
                            flex: 1, padding: isMobile ? '1rem 0' : '1.5rem 0', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'A' ? '#334155' : '#0f172a', color: currentTrack === 'A' ? '#fff' : '#64748b',
                            border: currentTrack === 'A' ? '2px solid #f97316' : '1px solid #334155',
                        }}
                    >
                        🎵 A（版本一）
                    </button>
                    <button
                        onClick={() => switchTrack('B')}
                        disabled={isAutoContrasting || cheatMode !== 'idle'}
                        style={{
                            flex: 1, padding: isMobile ? '1rem 0' : '1.5rem 0', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'B' ? '#334155' : '#0f172a', color: currentTrack === 'B' ? '#fff' : '#64748b',
                            border: currentTrack === 'B' ? '2px solid #a78bfa' : '1px solid #334155',
                        }}
                    >
                        🎵 B（版本二）
                    </button>
                </div>

                {/* ⚡ 兩段式作弊按鈕 */}
                {!selectedAnswer && (
                    <button
                        onClick={handleFastSwitch}
                        disabled={cheatMode === 'fast' || !isPlaying}
                        style={{ background: 'transparent', color: '#fca311', border: '1px dashed #fca311', padding: isMobile ? '0.8rem' : '1rem', borderRadius: '50px', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1.5rem', opacity: isPlaying ? 1 : 0.5, width: '100%' }}
                    >
                        {cheatMode === 'idle' ? '🔄 幫我對比（慢）' : cheatMode === 'slow' ? '⚡ 極速對比（快）' : '👂 自動對比中...'}
                    </button>
                )}

                {/* 🎯 作答區 */}
                {!selectedAnswer ? (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>決定好了嗎？</div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => handleSelect('A')} disabled={cheatMode !== 'idle'} style={{ flex: 1, padding: isMobile ? '0.8rem 0' : '1rem 0', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', background: '#f97316', color: '#000', border: 'none', cursor: 'pointer' }}>👉 我選 A</button>
                            <button onClick={() => handleSelect('B')} disabled={cheatMode !== 'idle'} style={{ flex: 1, padding: isMobile ? '0.8rem 0' : '1rem 0', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', background: '#a78bfa', color: '#000', border: 'none', cursor: 'pointer' }}>👉 我選 B</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '20px', animation: 'fadeIn 0.3s' }}>

                        {isAutoContrasting ? (
                            <div style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold', padding: '2rem 0', textAlign: 'center', animation: 'pulseText 1s infinite' }}>
                                🤯 仔細聽！抓到差異了嗎...
                            </div>
                        ) : (
                            <>
                                <div style={{ color: selectedAnswer === q?.correct ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    {selectedAnswer === q?.correct ? q?.feedbackCorrect : q?.feedbackIncorrect}
                                </div>
                                <div style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6', textAlign: 'center' }}>
                                    {q?.insight}
                                </div>
                                <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                                    {currentIndex === grooveQuestions.length - 1 ? '查看診斷結果 ➔' : '下一題 ➔'}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes pulseText { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
            ` }} />
        </div>
    );
}