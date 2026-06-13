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

type Phase = 'quiz' | 'calculating' | 'result';

export default function EarOpeningPlayPage() {
    const router = useRouter();
    const [isInit, setIsInit] = useState(false);
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

    // Email 解鎖機制
    const [email, setEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const activeQuestions = isAdvancedMode ? ADVANCED_QUESTIONS : QUESTIONS;
    const q = activeQuestions[currentIndex];

    // 🧠 1. 載入暫存紀錄
    useEffect(() => {
        const savedProgress = localStorage.getItem('ear_training_progress');
        const savedUnlocked = localStorage.getItem('ear_training_unlocked');
        if (savedUnlocked === 'true') setIsUnlocked(true);

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

    // 🧠 2. 存入暫存
    useEffect(() => {
        if (phase === 'result' && isInit) {
            localStorage.setItem('ear_training_progress', JSON.stringify({
                score, advancedScore, wrongQuestions, isAdvancedMode
            }));
        }
    }, [phase, score, advancedScore, wrongQuestions, isAdvancedMode, isInit]);

    // 🔁 換題初始化
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
        if (isPlaying) { audioRef.current.pause(); }
        else { audioRef.current.play().catch(e => console.log('Play error:', e)); }
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
        if (typeof navigator !== 'undefined' && navigator.vibrate) { navigator.vibrate(50); }
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (audioRef.current) audioRef.current.pause();
            setPhase('calculating');
            setTimeout(() => { setPhase('result'); }, 2000);
        }
    };

    const startAdvancedChallenges = () => {
        setIsAdvancedMode(true);
        setCurrentIndex(0);
        setPhase('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRestart = () => {
        if (window.confirm('確定要清除目前的測驗紀錄並重新開始嗎？')) {
            localStorage.removeItem('ear_training_progress');
            setScore(0); setAdvancedScore(0); setWrongQuestions([]);
            setIsAdvancedMode(false); setCurrentIndex(0); setPhase('quiz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleEmailSubmit = () => {
        if (!email || !email.includes('@')) {
            alert('請輸入正確的 Email 以解鎖弱點診斷報告！');
            return;
        }
        setIsUnlocked(true);
        localStorage.setItem('ear_training_unlocked', 'true');
    };

    // 📊 等級系統與排位
    const getEarLevel = () => {
        if (score === 7) return {
            name: 'Level 4 — 製作人耳朵',
            state: '你不只是聽得出差異，你開始知道怎麼修。',
            keySentence: '👉「這就是製作人跟一般人的差別」',
            percentile: 95, color: '#a78bfa'
        };
        if (score >= 5) return {
            name: 'Level 3 — 可用的耳朵',
            state: '你可以穩定抓出問題，但還不夠精準。',
            keySentence: '👉「你已經具備做音樂的耳朵了」',
            percentile: 80, color: '#10b981'
        };
        if (score >= 3) return {
            name: 'Level 2 — 開始察覺',
            state: '你已經能分辨「好不好聽」，但說不出原因。',
            keySentence: '👉「你已經跨過 80% 人做不到的第一關」',
            percentile: 50, color: '#38bdf8'
        };
        return {
            name: 'Level 1 — 未覺醒耳朵',
            state: '你聽音樂主要靠感覺，但還抓不到關鍵差異。',
            keySentence: '👉「你不是聽不到，是還沒被訓練過」',
            percentile: 20, color: '#fca311'
        };
    };

    // 🔬 更具體的深度診斷邏輯
    const getDetailedAnalysis = () => {
        const insights = [];
        if (wrongQuestions.includes(1) || wrongQuestions.includes(7)) {
            insights.push({
                label: '🧱 低頻重量感知不穩定',
                desc: '你在判斷「低頻厚度」時容易分心。這會導致你做出來的音樂在大喇叭上聽起來太單薄，或者低頻太噴。'
            });
        }
        if (wrongQuestions.includes(3) || wrongQuestions.includes(4)) {
            insights.push({
                label: '🌫 聲音層次辨識力待加強',
                desc: '你對頻率的「遮蔽效應」較不敏感。這正是導致你調整 EQ 時，明明變亮了但聲音卻變得更刺、更糊的原因。'
            });
        }
        if (wrongQuestions.includes(2) || wrongQuestions.includes(6)) {
            insights.push({
                label: '🫁 空間與動態觀察較弱',
                desc: '你還不太容易察覺聲音的「呼吸感」與「遠近比例」。這會讓你在調整 Compressor 或 Reverb 時感覺像在碰運氣。'
            });
        }
        if (wrongQuestions.includes(5)) {
            insights.push({
                label: '🔊 容易陷入音量錯覺 (Trap)',
                desc: '你的大腦目前非常容易被「大聲一點」就誤判為「好聽一點」。這是區分新手與專業混音師最關鍵的心理門檻。'
            });
        }
        if (insights.length === 0) insights.push({ label: '✨ 聽覺判斷極度精準', desc: '你的基礎聽覺指標非常健康，目前沒有明顯的判斷死角。' });
        return insights;
    };

    if (!isInit) return null;

    // ==========================================
    // 渲染：結果頁
    // ==========================================
    if (phase === 'result') {
        const level = getEarLevel();
        const analysis = getDetailedAnalysis();

        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
                <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.6s' }}>

                    {/* 🏆 等級呈現區 (高潮區) */}
                    {!isAdvancedMode && (
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>你的耳朵目前屬於：</h2>
                            <h1 style={{ fontSize: '2.8rem', color: level.color, fontWeight: '900', margin: '0 0 1rem 0' }}>{level.name}</h1>
                            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>{level.state}</p>
                            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '10px 24px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', color: level.color, fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                                {level.keySentence}
                            </div>

                            {/* 📊 實時百分比排位 */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1rem', color: '#94a3b8', fontWeight: 'bold' }}>
                                    <span>📊 全體測試中：</span>
                                    <span style={{ color: level.color }}>你超過了 {level.percentile}% 的人</span>
                                </div>
                                <div style={{ height: '8px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${level.percentile}%`, height: '100%', background: level.color, transition: 'width 1.2s ease-out' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 進階模式顯示 (簡化) */}
                    {isAdvancedMode && (
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '3rem', color: '#fff', fontWeight: '900', margin: '0 0 1rem 0' }}>極限挑戰完成</h1>
                            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '2rem' }}>你在進階盲測中答對了 <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>{advancedScore} / 4</span> 題。</p>
                        </div>
                    )}

                    {/* 🔐 Email 解鎖閘門 (針對深度診斷) */}
                    {!isUnlocked && !isAdvancedMode && (
                        <div style={{ background: 'linear-gradient(145deg, #0f172a, #020617)', border: '1px solid #38bdf8', padding: '2.5rem 2rem', borderRadius: '24px', boxSizing: 'border-box', boxShadow: '0 15px 40px rgba(56,189,248,0.15)', textAlign: 'center', marginBottom: '4rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: '900', marginBottom: '0.8rem' }}>🔓 解鎖你的深度診斷報告</h3>
                            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                想知道你錯在哪、為何錯嗎？<br />輸入 Email 立刻獲取個人專屬的<strong>「聽覺盲區分析數據」</strong>。
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="email" placeholder="輸入 Email 解鎖分析" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '1.1rem', borderRadius: '50px', border: '1px solid #334155', background: '#020617', color: '#fff', fontSize: '1.1rem', outline: 'none', textAlign: 'center' }} />
                                <button onClick={handleEmailSubmit} style={{ width: '100%', padding: '1.1rem', background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer' }}>解鎖報告內容 ➔</button>
                            </div>
                        </div>
                    )}

                    {/* 🔓 顯示深度診斷 (僅解鎖後顯示) */}
                    {isUnlocked && !isAdvancedMode && (
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '24px', textAlign: 'left', marginBottom: '4rem', animation: 'fadeIn 0.5s ease' }}>
                            <h3 style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>🔍</span> 專屬弱點診斷：
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {analysis.map((item, i) => (
                                    <div key={i} style={{ borderLeft: '3px solid #475569', paddingLeft: '1.2rem' }}>
                                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '6px' }}>{item.label}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6' }}>{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 💥 痛點轉折區 (始終顯示，但在解鎖後顯得更合理) */}
                    {!isAdvancedMode && (
                        <div style={{ padding: '2.5rem 1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)', marginBottom: '3.5rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '0 0 1.2rem 0' }}>現在問題不是你聽不聽得出來</h3>
                            <p style={{ fontSize: '1.25rem', color: '#fca5a5', fontWeight: 'bold', margin: '0 0 12px 0' }}>問題是—— 你「做不做得出來」。</p>
                            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0, fontWeight: 'bold' }}>大部分人卡在這裡卡了好幾年。</p>
                        </div>
                    )}

                    {/* 🚀 CTA 動作區 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>

                        {/* 路線 B：核心轉換 */}
                        <div style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', borderRadius: '24px', border: '2px solid #a78bfa', boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#a78bfa', color: '#020617', padding: '5px 15px', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '2px' }}>HIGHLY RECOMMENDED</div>
                            <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '2rem', marginTop: '1rem' }}>我想學會怎麼讓聲音變清楚，不再靠運氣</h2>
                            <button onClick={() => router.push('/courses/ear-opening/bridge')} style={{ width: '100%', padding: '1.2rem', background: '#a78bfa', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.4)', transition: 'transform 0.2s' }}>🚀 進入實戰訓練計畫 ➔</button>
                        </div>

                        {/* 路線 A：進階測驗 */}
                        {!isAdvancedMode && (
                            <div style={{ textAlign: 'center', padding: '1.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>我還想再測試一下耳朵</h3>
                                <button onClick={startAdvancedChallenges} style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', opacity: '0.7' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'; e.currentTarget.style.opacity = '1'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.7'; }}>控制狂挑戰：進行進階 4 題盲測</button>
                            </div>
                        )}

                        {isAdvancedMode && (
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => router.push('/courses')} style={{ background: 'transparent', color: '#64748b', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>⬅️ 先回到課程總部地圖</button>
                            </div>
                        )}
                    </div>

                    {/* ⬇️ 清除紀錄與極小化意見回饋 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <button onClick={handleRestart} style={{ background: 'transparent', color: '#475569', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>🔄 清除紀錄並重新測驗</button>
                        <button onClick={() => router.push('/feedback')} style={{ background: 'transparent', color: '#334155', border: 'none', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>💡 有意見或遇到 Bug？點此回報</button>
                    </div>

                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
            </div>
        );
    }

    return null;
}