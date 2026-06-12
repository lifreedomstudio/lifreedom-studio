"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 定義題目的精準型別
type QuizQuestion = {
    id: number;
    title: string;
    question: string;
    fileA: string;
    fileB: string;
    correct: 'A' | 'B';
    feedbackCorrect: string;
    feedbackIncorrect: string;
    insight: string;
    acceptAny?: boolean;
};

// 🎯 核心 7 題 (基礎測驗)
const QUESTIONS: QuizQuestion[] = [
    {
        id: 1, title: '覺醒 01: 第一次聽見低頻', question: '哪一個比較「有重量」？', fileA: '/audio/step0/q1bass.mp3', fileB: '/audio/step0/q1nobass.mp3', correct: 'A',
        feedbackCorrect: '你已經開始抓到聲音的「厚度」！', feedbackIncorrect: '很多人一開始會忽略這個差異 👂',
        insight: '🎧 聽感重量 = 低頻是否站得住'
    },
    {
        id: 2, title: '覺醒 02: 感受空間的維度', question: '哪一個感覺比較「遠」？', fileA: '/audio/step0/q2dry.mp3', fileB: '/audio/step0/q2wet.mp3', correct: 'B',
        feedbackCorrect: '你抓到了空間感！', feedbackIncorrect: '這需要一點直覺，再試試看。',
        insight: '🎧 距離不是遠近，是乾濕比例'
    },
    {
        id: 3, title: '進化 01: 分辨聲音的邊界', question: '哪一個聽起來比較「清晰」且耐聽？', fileA: '/audio/step0/q3balanced.mp3', fileB: '/audio/step0/q3bright.mp3', correct: 'A',
        feedbackCorrect: '沒錯！你的耳朵正在進化，能辨別出真正的清晰度！', feedbackIncorrect: '被騙了吧！有時候「清晰」與「刺耳」只有一線之隔。',
        insight: '🎧 明亮 ≠ 清晰。真正的清晰是「頻率不打架」。'
    },
    {
        id: 4, title: '進化 02: 捕捉兩側的細節', question: '哪一個聽起來比較「寬」？', fileA: '/audio/step0/q4stereo.mp3', fileB: '/audio/step0/q4mono.mp3', correct: 'A',
        feedbackCorrect: '你開始注意到左右的細節了！', feedbackIncorrect: '把注意力放在耳朵的兩側邊緣試試看。',
        insight: '🎧 寬度 = 左右聲道資訊的差異度'
    },
    {
        id: 5, title: '陷阱 01: 聽覺的錯覺', question: '哪一個聽起來比較爽？', fileA: '/audio/step0/q5normal.mp3', fileB: '/audio/step0/q5louder.mp3', correct: 'B',
        acceptAny: true,
        feedbackCorrect: '這是專業混音師也會中招的錯覺！', feedbackIncorrect: '這是專業混音師也會中招的錯覺！',
        insight: '🎧 假好聽 = 單純的音量膨脹 (+1dB 錯覺)'
    },
    {
        id: 6, title: '挑戰 01: 隱形的動態控制', question: '哪一個聲音比較「穩」，不會忽大忽小？', fileA: '/audio/step0/q6unstable.mp3', fileB: '/audio/step0/q6stable.mp3', correct: 'B',
        feedbackCorrect: '你連這種微小的動態都能察覺！', feedbackIncorrect: '這題很難，聽不出差異是正常的。',
        insight: '🎧 穩定 = 動態被妥善地壓縮控制 (Compressor)'
    },
    {
        id: 7, title: '綜合 01: 畫面平衡感', question: '哪一個整體比較「平衡」？', fileA: '/audio/step0/q7balanced.mp3', fileB: '/audio/step0/q7muddy.mp3', correct: 'A',
        feedbackCorrect: '你對整體畫面的掌握度很高。', feedbackIncorrect: '平衡是最難判斷的指標之一。',
        insight: '🎧 平衡 = 沒有任何頻段特別搶戲'
    }
];

// 🔥 進階 4 題 (路線 A：魔王挑戰)
const ADVANCED_QUESTIONS: QuizQuestion[] = [
    {
        id: 8, title: '直覺 01: 製作人視角', question: '哪一個聽起來比較「穩定、清楚、不刺耳」？', fileA: '/audio/step0/q8amateur.mp3', fileB: '/audio/step0/q8pro.mp3', correct: 'B',
        feedbackCorrect: '你已經具備製作人的直覺了！', feedbackIncorrect: '專業感來自無數個微小的細節堆疊。',
        insight: '🎧 專業感 = 無數微小正確決策的堆疊'
    },
    {
        id: 9, title: '極限 01: 微量體感', question: '哪一個低頻比較「滿」？', fileA: '/audio/step0/q9bass2db.mp3', fileB: '/audio/step0/q9bass5db.mp3', correct: 'B',
        feedbackCorrect: '太神了，你連這麼細微的變化都抓到了！', feedbackIncorrect: '這題非常進階，聽不出來很正常。',
        insight: '🎧 飽滿度 = 極微小音量差異的敏銳捕捉'
    },
    {
        id: 10, title: '感知 01: 情緒的形狀', question: '哪一個聽起來比較「溫暖」？', fileA: '/audio/step0/q10warm.mp3', fileB: '/audio/step0/q10cold.mp3', correct: 'A',
        feedbackCorrect: '沒錯，這就是「溫暖」的感覺。', feedbackIncorrect: '溫暖通常來自中低頻的包覆感。',
        insight: '🎧 溫暖 = 頻率與空間被設計出來的情感包覆'
    },
    {
        id: 11, title: '感知 02: 空間的重量', question: '哪一個聽起來比較有「壓迫感」？', fileA: '/audio/step0/q11open.mp3', fileB: '/audio/step0/q11compressed.mp3', correct: 'B',
        feedbackCorrect: '你感受到聲音的「重量與擠壓」了！', feedbackIncorrect: '壓迫感是一種很主觀但真實存在的聽覺感受。',
        insight: '🎧 壓迫感 = 過度壓縮導致聲音喘不過氣'
    }
];

// 正確的 Phase 定義
type Phase = 'quiz' | 'calculating' | 'result';

export default function EarOpeningPlayPage() {
    const router = useRouter();
    const [isInit, setIsInit] = useState(false); // 確保在讀取 localStorage 前不閃爍
    const [phase, setPhase] = useState<Phase>('quiz');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A');
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

    // 狀態追蹤
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    const [score, setScore] = useState(0);
    const [advancedScore, setAdvancedScore] = useState(0);
    const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const activeQuestions = isAdvancedMode ? ADVANCED_QUESTIONS : QUESTIONS;
    const q = activeQuestions[currentIndex];

    // 🧠 1. 頁面載入時，檢查是否有暫存紀錄
    useEffect(() => {
        const savedProgress = localStorage.getItem('ear_training_progress');
        if (savedProgress) {
            try {
                const data = JSON.parse(savedProgress);
                setScore(data.score || 0);
                setAdvancedScore(data.advancedScore || 0);
                setWrongQuestions(data.wrongQuestions || []);
                setIsAdvancedMode(data.isAdvancedMode || false);
                setPhase('result');
            } catch (e) {
                console.error("無法讀取測驗紀錄", e);
            }
        }
        setIsInit(true);
    }, []);

    // 🧠 2. 只要進到 result 階段，就將成績寫入 localStorage
    useEffect(() => {
        if (phase === 'result' && isInit) {
            localStorage.setItem('ear_training_progress', JSON.stringify({
                score,
                advancedScore,
                wrongQuestions,
                isAdvancedMode
            }));
        }
    }, [phase, score, advancedScore, wrongQuestions, isAdvancedMode, isInit]);

    // 🔁 換題時的初始化
    useEffect(() => {
        if (!audioRef.current || !q || phase !== 'quiz') return;
        audioRef.current.src = q.fileA;
        audioRef.current.currentTime = 0;
        setCurrentTrack('A');
        setIsPlaying(false);
        setSelectedAnswer(null);
    }, [currentIndex, phase, q]);

    const playTrack = (track: 'A' | 'B') => {
        if (!audioRef.current || !q) return;
        if (currentTrack === track && isPlaying) return;

        const src = track === 'A' ? q.fileA : q.fileB;
        audioRef.current.pause();
        audioRef.current.src = src;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Play error:', e));

        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log('Play error:', e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSelect = (answer: 'A' | 'B') => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);

        if (answer === q.correct || q.acceptAny) {
            if (isAdvancedMode) setAdvancedScore(prev => prev + 1);
            else setScore(prev => prev + 1);
        } else {
            if (!isAdvancedMode) setWrongQuestions(prev => [...prev, q.id]);
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (audioRef.current) audioRef.current.pause();

            setPhase('calculating');
            setTimeout(() => {
                setPhase('result');
            }, 2000);
        }
    };

    // 啟動進階魔王關 (路線 A)
    const startAdvancedChallenges = () => {
        setIsAdvancedMode(true);
        setCurrentIndex(0);
        setPhase('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 🔄 重新測驗機制
    const handleRestart = () => {
        if (window.confirm('確定要清除目前的測驗紀錄並重新開始嗎？')) {
            localStorage.removeItem('ear_training_progress');
            setScore(0);
            setAdvancedScore(0);
            setWrongQuestions([]);
            setIsAdvancedMode(false);
            setCurrentIndex(0);
            setPhase('quiz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 📊 基礎等級演算
    const getEarLevel = () => {
        if (score === 7) return { name: 'Level 4：混音腦', state: '聽得出差異，且能精準定位問題在哪裡。', color: '#a78bfa' };
        if (score >= 5) return { name: 'Level 3：準確辨識', state: '能抓到大致方向，但對微小的動態變化還會猶豫。', color: '#10b981' };
        if (score >= 3) return { name: 'Level 2：模糊辨識', state: '聽得出哪個比較好聽，但還不知道為什麼。', color: '#38bdf8' };
        return { name: 'Level 1：感覺派', state: '聽得出有一點點差異，但說不出來差在哪。', color: '#fca311' };
    };

    const getDynamicWeaknesses = () => {
        const weaknesses = [];
        if (wrongQuestions.includes(1) || wrongQuestions.includes(7)) weaknesses.push('低頻判斷偏弱：你容易忽視大鼓與貝斯的衝突，這會造成作品聽起來鬆散、糊糊的。');
        if (wrongQuestions.includes(3) || wrongQuestions.includes(4)) weaknesses.push('刺耳頻率辨識不穩：你對 2–4kHz 這種人耳最敏感的頻段掌握度較弱，容易讓作品聽起來刺耳或扁平。');
        if (wrongQuestions.includes(2) || wrongQuestions.includes(6)) weaknesses.push('微小動態較難察覺：你還感受不太到聲音的「穩度」與「遠近」（也就是壓縮器與空間效果的運用）。');
        if (wrongQuestions.includes(5)) weaknesses.push('容易被「音量」欺騙：這是新手最常踩的坑，覺得聲音大就是好聽，導致混音越推越大聲，最後容易失真。');

        if (weaknesses.length === 0) weaknesses.push('你的聽覺非常精準，幾乎沒有基礎盲點！');
        return weaknesses;
    };

    // 避免 Hydration 閃爍
    if (!isInit) return null;

    // ==========================================
    // 渲染：階段一 (測驗)
    // ==========================================
    if (phase === 'quiz') {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
                <audio ref={audioRef} preload="auto" loop />

                <div style={{ width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                        <span>{isAdvancedMode ? `🔥 進階極限盲測: ${q?.title}` : q?.title}</span>
                        <span>{currentIndex + 1} / {activeQuestions.length}</span>
                    </div>
                    <div style={{ height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`, height: '100%', background: isAdvancedMode ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.4s ease' }} />
                    </div>
                </div>

                <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.4' }}>{q?.question}</h1>

                    <div style={{ color: isPlaying ? '#38bdf8' : '#64748b', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', transition: 'color 0.3s' }}>
                        {isPlaying ? `🎵 現在播放：版本 ${currentTrack}` : '⏸ 點擊下方播放音訊'}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <button onClick={togglePlay} style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#fff' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)' }}>
                            {isPlaying ? '暫停' : '開始播放'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        <button onClick={() => playTrack('A')} style={{ flex: 1, padding: '1.2rem 0', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', background: currentTrack === 'A' && isPlaying ? 'rgba(56, 189, 248, 0.2)' : '#1e293b', color: currentTrack === 'A' && isPlaying ? '#38bdf8' : '#94a3b8', border: currentTrack === 'A' && isPlaying ? '2px solid #38bdf8' : '2px solid transparent' }}>
                            聽聽看 A
                        </button>
                        <button onClick={() => playTrack('B')} style={{ flex: 1, padding: '1.2rem 0', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', background: currentTrack === 'B' && isPlaying ? 'rgba(16, 185, 129, 0.2)' : '#1e293b', color: currentTrack === 'B' && isPlaying ? '#10b981' : '#94a3b8', border: currentTrack === 'B' && isPlaying ? '2px solid #10b981' : '2px solid transparent' }}>
                            聽聽看 B
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', opacity: selectedAnswer ? 0.5 : 1, pointerEvents: selectedAnswer ? 'none' : 'auto' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>準備好就鎖定答案：</div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => handleSelect('A')} style={{ flex: 1, padding: '1.2rem 0', fontSize: '1.3rem', fontWeight: '900', borderRadius: '16px', cursor: 'pointer', background: selectedAnswer === 'A' ? '#fff' : '#0f172a', color: selectedAnswer === 'A' ? '#000' : '#fff', border: '1px solid #475569' }}>✅ 選擇 A</button>
                            <button onClick={() => handleSelect('B')} style={{ flex: 1, padding: '1.2rem 0', fontSize: '1.3rem', fontWeight: '900', borderRadius: '16px', cursor: 'pointer', background: selectedAnswer === 'B' ? '#fff' : '#0f172a', color: selectedAnswer === 'B' ? '#000' : '#fff', border: '1px solid #475569' }}>✅ 選擇 B</button>
                        </div>
                    </div>

                    <div style={{ opacity: selectedAnswer ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: selectedAnswer ? 'auto' : 'none', marginTop: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '20px' }}>
                        <div style={{ color: selectedAnswer === q?.correct || q?.acceptAny ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            {selectedAnswer === q?.correct || q?.acceptAny ? q?.feedbackCorrect : q?.feedbackIncorrect}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{q?.insight}</div>
                        <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: '#fff', color: '#020617', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            {currentIndex === activeQuestions.length - 1 ? (isAdvancedMode ? '看最終極限報告 ➔' : '分析聽覺能力 ➔') : '下一題 ➔'}
                        </button>
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
            </div>
        );
    }

    // ==========================================
    // 渲染：過場動畫
    // ==========================================
    if (phase === 'calculating') {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: isAdvancedMode ? '#f97316' : '#38bdf8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
                <h2 style={{ fontWeight: 'bold', animation: 'pulse 1s infinite alternate' }}>{isAdvancedMode ? '正在核算極限聽力指標...' : '正在分析你的聽覺盲區...'}</h2>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }` }} />
            </div>
        )
    }

    // ==========================================
    // 渲染：階段三 (結果頁 & 路線分流)
    // ==========================================
    if (phase === 'result') {
        const level = getEarLevel();
        const weaknesses = getDynamicWeaknesses();
        const isLevel4 = score === 7;

        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
                <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.6s' }}>

                    {/* 🏆 進階魔王關結算 */}
                    {isAdvancedMode ? (
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{ color: '#f97316', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '0.5rem' }}>🔥 ULTIMATE TEST RESULT</div>
                            <h1 style={{ fontSize: '3rem', color: '#fff', fontWeight: '900', margin: '0 0 1rem 0' }}>極限測試完成</h1>
                            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '2rem' }}>你在高階盲測中答對了 <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>{advancedScore} / 4</span> 題。</p>

                            {advancedScore === 4 ? (
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '1.5rem', borderRadius: '16px', color: '#86efac', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    你擁有一雙怪物級的耳朵！這種微小的動態與空間變化，連很多職業混音師都要猶豫。
                                </div>
                            ) : (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '1.5rem', borderRadius: '16px', color: '#fca5a5', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    這 4 題是混音作品「聽起來到底貴不貴」的關鍵。聽不出來很正常，因為這需要系統化的訓練，而不是單靠天份。
                                </div>
                            )}
                        </div>
                    ) : (
                        /* 🟢 基礎 7 題結算 */
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>你的耳朵目前屬於：</h2>
                            <h1 style={{ fontSize: '2.8rem', color: level.color, fontWeight: '900', margin: '0 0 1.5rem 0' }}>{level.name}</h1>
                            <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>👉 你目前的狀態：</p>
                            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: '0 0 1rem 0', lineHeight: '1.6' }}>{level.state}</p>

                            {/* 盲區分析區塊 */}
                            {!isLevel4 && (
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px', marginTop: '2rem', textAlign: 'left' }}>
                                    <h3 style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>⚠️</span> 你的聽覺盲區分析：
                                    </h3>
                                    <ul style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                                        {weaknesses.map((w, i) => <li key={i} style={{ marginBottom: '15px' }}>{w}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 🔥 核心升級：能力橋接層 (引導向痛點與解決方案) */}
                    <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '2.5rem', borderRadius: '24px', marginBottom: '3rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                            🧠 {isAdvancedMode ? '現在你已經清楚知道好聲音長怎樣了' : '你的下一個瓶頸'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '2rem', background: '#0f172a', padding: '1.5rem', borderRadius: '16px' }}>
                            <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span>✔</span>
                                <span>你現在可以做到：<br /><span style={{ color: '#a7f3d0', fontSize: '1rem', fontWeight: 'normal' }}>準確分辨「好聽 vs 不好聽」的差異。</span></span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span>❌</span>
                                <span>但你還做不到：<br /><span style={{ color: '#fca5a5', fontSize: '1rem', fontWeight: 'normal' }}>在軟體裡「自己動手做出」那種好聽的聲音。</span></span>
                            </div>
                        </div>

                        <p style={{ color: '#fca311', fontSize: '1.15rem', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
                            👉 這就是大多數創作者卡住的地方。
                        </p>
                    </div>

                    {/* 🚀 雙路線分流 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>

                        {/* 路線 B (強 Call To Action - 核心轉換) */}
                        <div style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', borderRadius: '24px', border: '2px solid #a78bfa', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#a78bfa', color: '#020617', padding: '5px 15px', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '2px' }}>
                                HIGHLY RECOMMENDED
                            </div>

                            {/* 💡 修正：主 CTA 文案直接切中痛點 */}
                            <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '1rem', marginTop: '1rem' }}>我想學會怎麼讓聲音變清楚，不再靠運氣</h2>
                            <p style={{ color: '#a7f3d0', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', fontWeight: 'bold' }}>

                            </p>

                            {/* 按鈕文字改為更具行動力的實戰導向 */}
                            <button
                                onClick={() => router.push('/courses/ear-opening/bridge')}
                                style={{ width: '100%', padding: '1.2rem', background: '#a78bfa', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.4)', transition: 'transform 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                🚀 進入實戰訓練 ➔
                            </button>
                        </div>

                        {/* 路線 A (輕度用戶 - 繼續玩進階挑戰，若已是進階模式則引導回課程地圖) */}
                        {!isAdvancedMode ? (
                            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>我還想再測試一下耳朵</h3>
                                <button
                                    onClick={startAdvancedChallenges}
                                    style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    🎮 挑戰進階聽力極限
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => router.push('/courses')}
                                    style={{ background: 'transparent', color: '#64748b', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    ⬅️ 先回到課程總部地圖
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ⬇️ 重新測驗按鈕 & 極小化的意見回饋 (降低干擾) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={handleRestart}
                            style={{ background: 'transparent', color: '#64748b', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
                            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                        >
                            🔄 清除紀錄並重新測驗
                        </button>

                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button
                                onClick={() => router.push('/feedback')}
                                style={{ background: 'transparent', color: '#475569', border: 'none', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                💡 有意見或遇到 Bug？點此回報
                            </button>
                        </div>
                    </div>

                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
            </div>
        );
    }

    return null;
}