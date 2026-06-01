"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 遊戲題庫：Groove 感知測試
const grooveQuestions = [
    {
        id: 1,
        title: 'Round 1: 穩定與死板',
        question: '哪一個比較讓你想「點頭」？',
        fileA: '/audio/groove/q1_a_dead.mp3', // 全量化 (死)
        fileB: '/audio/groove/q1_b_alive.mp3', // 微 humanize (活)
        correct: 'B',
        feedbackCorrect: '你感受到了！微小的時間偏移反而帶來了律動。',
        feedbackIncorrect: '完全對齊 (Quantized) 的節奏聽起來其實會像機器人。',
        insight: '🎧 好的 Groove 不是 100% 準準對在格子上，而是有呼吸的空間。'
    },
    {
        id: 2,
        title: 'Round 2: 重量的錨點',
        question: '哪一個聽起來比較「有重量」？',
        fileA: '/audio/groove/q2_a_unaligned.mp3', // 沒對齊
        fileB: '/audio/groove/q2_b_locked.mp3', // Lock
        correct: 'B',
        feedbackCorrect: '沒錯，這就是頻率與節奏「鎖死」的威力！',
        feedbackIncorrect: '當 Kick 跟 Bass 沒有對齊，低頻會互相拉扯，聽起來反而虛浮。',
        insight: '🎧 黏度 = Kick (大鼓) 與 Bass (貝斯) 的發聲點與釋放點完全貼合。'
    },
    {
        id: 3,
        title: 'Round 3: 隱形的推進器',
        question: '哪一個聽起來比較「有速度感」？',
        fileA: '/audio/groove/q3_a_flat.mp3', // 平的 Hi-hat
        fileB: '/audio/groove/q3_b_groove.mp3', // 有輕重音的 Hi-hat
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A');
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0); // 🔥 連續命中系統
    const [showResult, setShowResult] = useState(false);

    // 狀態：是否正在進行自動 A/B 對比展示
    const [isAutoContrasting, setIsAutoContrasting] = useState(false);
    const [isFastSwitching, setIsFastSwitching] = useState(false);

    const audioARef = useRef<HTMLAudioElement | null>(null);
    const audioBRef = useRef<HTMLAudioElement | null>(null);
    const isMounted = useRef(true);

    const q = grooveQuestions[currentIndex];

    // 🔒 離開頁面時自動停止音樂 (避免音訊洩漏)
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
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
    }, [currentIndex, showResult, q]); // isPlaying 移除，避免重複 load

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

    // ⚡ 作弊級功能：自動快速 A/B 瞬切
    const handleFastSwitch = async () => {
        if (isFastSwitching || selectedAnswer) return;
        setIsFastSwitching(true);
        const originalTrack = currentTrack;

        switchTrack('A'); await delay(800); if (!isMounted.current) return;
        switchTrack('B'); await delay(800); if (!isMounted.current) return;
        switchTrack('A'); await delay(800); if (!isMounted.current) return;
        switchTrack('B'); await delay(800); if (!isMounted.current) return;

        switchTrack(originalTrack);
        setIsFastSwitching(false);
    };

    // 🎯 答題與爆點瞬間 (Aha Moment)
    const handleSelect = async (answer: 'A' | 'B') => {
        if (selectedAnswer || isAutoContrasting || isFastSwitching) return;
        setSelectedAnswer(answer);

        if (answer === q.correct) {
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1); // 連續命中 +1
        } else {
            setStreak(0); // 答錯歸零
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

        // 💥 強制對比瞬間 (讓玩家聽出差異)
        setIsAutoContrasting(true);
        switchTrack('A'); await delay(1000); if (!isMounted.current) return;
        switchTrack('B'); await delay(1000); if (!isMounted.current) return;
        switchTrack('A'); await delay(1000); if (!isMounted.current) return;
        switchTrack('B'); await delay(1000); if (!isMounted.current) return;

        // 最後停留在正確答案上
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

    // 🎬 結算畫面 (轉換引爆點)
    if (showResult) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '550px', width: '100%', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.5s', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>

                    <div style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>TEST COMPLETE</div>

                    <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '900', margin: '0 0 0.5rem 0' }}>
                        你剛剛答對了：<span style={{ color: '#fca311' }}>{score} / 3</span>
                    </h1>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', margin: '2rem 0', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', margin: '0 0 1rem 0', lineHeight: '1.6' }}>
                            👉 這代表：<br />
                            <strong style={{ color: '#fff', fontSize: '1.3rem' }}>你已經開始「感覺到 Groove」了。</strong>
                        </p>

                        {/* 🔥 對比身份 (核彈級轉換) */}
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
    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>

            <audio ref={audioARef} loop muted={currentTrack !== 'A'} />
            <audio ref={audioBRef} loop muted={currentTrack !== 'B'} />

            {/* 標題與進度條 */}
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '0.5rem' }}>GROOVE 感知測試</div>
                <div style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem' }}>你真的聽得出節奏在動嗎？</div>

                {/* 🔥 連續命中系統 UI */}
                {streak >= 2 && (
                    <div style={{ color: '#fca311', fontWeight: '900', fontSize: '1.1rem', marginBottom: '1rem', animation: 'popIn 0.3s' }}>
                        🔥 連續命中：{streak}
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

            {/* ⚠️ 降低挫折感的提醒 (僅在第一題顯示) */}
            {currentIndex === 0 && !selectedAnswer && (
                <div style={{ maxWidth: '500px', width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca311', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    <strong>⚠️ 提醒：</strong> 大部分人第一題都會選錯。<br />
                    但只要你撐到第三題，你會開始真正「聽懂」。
                </div>
            )}

            <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>

                <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.4' }}>
                    {q?.question}
                </h1>

                {/* 狀態式播放按鈕 UX */}
                <div style={{ marginBottom: '2rem' }}>
                    <button onClick={togglePlay} style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#38bdf8' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)' }}>
                        {isPlaying ? '🔁 持續播放中' : '▶ 開始聽'}
                    </button>
                </div>

                {/* 🎧 第一層：純聆聽切換區 (不觸發答題) */}
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.8rem' }}>👉 點擊切換聆聽，兩者在「同一時間點」播放</div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => switchTrack('A')}
                        disabled={isAutoContrasting || isFastSwitching}
                        style={{
                            flex: 1, padding: '1.5rem 0', fontSize: '1.3rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'A' ? '#334155' : '#0f172a',
                            color: currentTrack === 'A' ? '#fff' : '#64748b',
                            border: currentTrack === 'A' ? '2px solid #f97316' : '1px solid #334155',
                        }}
                    >
                        🎵 聽 A 版
                    </button>
                    <button
                        onClick={() => switchTrack('B')}
                        disabled={isAutoContrasting || isFastSwitching}
                        style={{
                            flex: 1, padding: '1.5rem 0', fontSize: '1.3rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'B' ? '#334155' : '#0f172a',
                            color: currentTrack === 'B' ? '#fff' : '#64748b',
                            border: currentTrack === 'B' ? '2px solid #a78bfa' : '1px solid #334155',
                        }}
                    >
                        🎵 聽 B 版
                    </button>
                </div>

                {/* ⚡ 作弊按鈕：快速 A/B 對比 */}
                {!selectedAnswer && (
                    <button
                        onClick={handleFastSwitch}
                        disabled={isFastSwitching || !isPlaying}
                        style={{ background: 'transparent', color: '#fca311', border: '1px dashed #fca311', padding: '0.8rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '2.5rem', opacity: isPlaying ? 1 : 0.5 }}
                    >
                        {isFastSwitching ? '👂 自動對比中...' : '🔄 幫我快速 A/B 瞬切對比'}
                    </button>
                )}

                {/* 🎯 第二層：作答區 */}
                {!selectedAnswer ? (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>決定好了嗎？</div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => handleSelect('A')} disabled={isFastSwitching} style={{ flex: 1, padding: '1rem 0', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', background: '#f97316', color: '#000', border: 'none', cursor: 'pointer' }}>👉 我選 A</button>
                            <button onClick={() => handleSelect('B')} disabled={isFastSwitching} style={{ flex: 1, padding: '1rem 0', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', background: '#a78bfa', color: '#000', border: 'none', cursor: 'pointer' }}>👉 我選 B</button>
                        </div>
                    </div>
                ) : (
                    /* 回饋區 & 強制對比特效 */
                    <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '20px', animation: 'fadeIn 0.3s' }}>

                        {isAutoContrasting ? (
                            <div style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold', padding: '2rem 0', animation: 'pulseText 1s infinite' }}>
                                🤯 仔細聽！自動對比差異中...
                            </div>
                        ) : (
                            <>
                                <div style={{ color: selectedAnswer === q?.correct ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    {selectedAnswer === q?.correct ? q?.feedbackCorrect : q?.feedbackIncorrect}
                                </div>
                                <div style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
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