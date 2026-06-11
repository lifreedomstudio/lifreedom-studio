"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 核心 7 題
const QUESTIONS = [
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

type Phase = 'quiz' | 'calculating' | 'result';

export default function EarOpeningPlayPage() {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>('quiz');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A');
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

    // 數據追蹤
    const [score, setScore] = useState(0);
    const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const q = QUESTIONS[currentIndex];

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

        // @ts-ignore
        if (answer === q.correct || q.acceptAny) {
            setScore(prev => prev + 1);
        } else {
            setWrongQuestions(prev => [...prev, q.id]);
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (audioRef.current) audioRef.current.pause();

            // 💡 假裝在計算，增加神秘感與儀式感
            setPhase('calculating');
            setTimeout(() => {
                setPhase('result');
            }, 2500);
        }
    };

    // 📊 等級演算 (白話文版)
    const getEarLevel = () => {
        if (score === 7) return {
            name: 'Level 4：混音腦',
            state: '聽得出差異，且能精準定位問題在哪裡。',
            consequence: '你已經具備製作人的直覺。但要保證每次輸出都不翻車，你需要的是系統化的流程，而不是只靠直覺。',
            color: '#a78bfa'
        };
        if (score >= 5) return {
            name: 'Level 3：準確辨識',
            state: '能抓到大致方向，但對微小的動態變化還會猶豫。',
            consequence: '你不是聽不出來，是你的耳朵「還沒被系統化訓練過怎麼聽」。這導致你的判斷時常飄忽不定。',
            color: '#10b981'
        };
        if (score >= 3) return {
            name: 'Level 2：模糊辨識',
            state: '聽得出哪個比較好聽，但完全不知道為什麼。',
            consequence: '這就是為什麼你的混音總是「靠運氣」。套個設定祈禱好聽，只要換個耳機或到車上聽就全毀了。',
            color: '#38bdf8'
        };
        return {
            name: 'Level 1：感覺派',
            state: '聽得出有一點點差異，但完全說不出來差在哪。',
            consequence: '你目前極容易被「大聲就是好聽」的錯覺欺騙。如果不找出盲點，買再貴的設備跟軟體也是白費力氣。',
            color: '#fca311'
        };
    };

    // 🧠 動態弱點診斷 (白話文解釋)
    const getDynamicWeaknesses = () => {
        const weaknesses = [];
        if (wrongQuestions.includes(1) || wrongQuestions.includes(7)) weaknesses.push('低頻判斷偏弱：你容易忽視大鼓與貝斯的衝突，這會造成作品聽起來鬆散、糊糊的。');
        if (wrongQuestions.includes(3) || wrongQuestions.includes(4)) weaknesses.push('刺耳頻率辨識不穩：你對 2–4kHz 這種人耳最敏感的頻段掌握度較弱，容易讓作品聽起來刺耳或扁平。');
        if (wrongQuestions.includes(2) || wrongQuestions.includes(6)) weaknesses.push('微小動態較難察覺：你還感受不太到聲音的「穩度」與「遠近」（也就是壓縮器與空間效果的運用）。');
        if (wrongQuestions.includes(5)) weaknesses.push('容易被「音量」欺騙：這是新手最常踩的坑，覺得聲音大就是好聽，導致混音越推越大聲，最後完全失真。');

        if (weaknesses.length === 0) weaknesses.push('你的聽覺非常精準，幾乎沒有基礎盲點！');
        return weaknesses;
    };

    // ==========================================
    // 渲染：階段一 (測驗)
    // ==========================================
    if (phase === 'quiz') {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
                <audio ref={audioRef} preload="auto" loop />

                <div style={{ width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                        <span>{q?.title}</span>
                        <span>{currentIndex + 1} / {QUESTIONS.length}</span>
                    </div>
                    <div style={{ height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.4s ease' }} />
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
                        {/* @ts-ignore */}
                        <div style={{ color: selectedAnswer === q?.correct || q?.acceptAny ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            {/* @ts-ignore */}
                            {selectedAnswer === q?.correct || q?.acceptAny ? q?.feedbackCorrect : q?.feedbackIncorrect}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{q?.insight}</div>
                        <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            {currentIndex === QUESTIONS.length - 1 ? '分析聽覺能力 ➔' : '下一題 ➔'}
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
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
                <h2 style={{ fontWeight: 'bold', animation: 'pulse 1s infinite alternate' }}>正在分析你的聽覺盲區...</h2>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }` }} />
            </div>
        )
    }

    // ==========================================
    // 渲染：階段三 (完整報告揭曉 & 問卷 CTA)
    // ==========================================
    if (phase === 'result') {
        const level = getEarLevel();
        const weaknesses = getDynamicWeaknesses();

        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
                <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.6s' }}>

                    {/* 揭曉等級 */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 'bold' }}>你的耳朵目前屬於：</h2>
                        <h1 style={{ fontSize: '2.8rem', color: level.color, fontWeight: '900', margin: '0 0 1.5rem 0' }}>{level.name}</h1>
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>👉 你目前的狀態：</p>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: '0 0 1rem 0', lineHeight: '1.6' }}>{level.state}</p>
                        <p style={{ color: '#fca5a5', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>{level.consequence}</p>
                    </div>

                    {/* 弱點區 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
                        <h3 style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚠️</span> 你的聽覺盲區分析：
                        </h3>
                        <ul style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                            {weaknesses.map((w, i) => (
                                <li key={i} style={{ marginBottom: '15px' }}>{w}</li>
                            ))}
                        </ul>
                    </div>

                    {/* 恐懼放大區 */}
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
                        <h3 style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.2rem' }}>
                            🚨 如果這些問題沒有被解決，你會繼續遇到：
                        </h3>
                        <ul style={{ color: '#fca5a5', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '8px' }}>每次混音結果都不穩，<strong>就像在買彩券</strong></li>
                            <li style={{ marginBottom: '8px' }}>在自己耳機聽很棒，<strong>換到車上或手機聽就直接崩掉</strong></li>
                            <li style={{ marginBottom: '8px' }}>永遠覺得「差了一點點」，但<strong>死都不知道要轉哪個旋鈕</strong></li>
                        </ul>
                    </div>

                    {/* 建議區 */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2rem', borderRadius: '20px', marginBottom: '3rem' }}>
                        <h3 style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>💡</span> 建議你從這幾個練習開始：
                        </h3>
                        <ul style={{ color: '#a7f3d0', fontSize: '1.05rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '10px' }}><strong>互動 EQ 實驗室：</strong>親自掃頻，記住「刺」與「悶」的真實聲音。</li>
                            <li style={{ marginBottom: '10px' }}><strong>Groove 律動感知：</strong>訓練耳朵捕捉細微的節奏推拉感。</li>
                            <li style={{ marginBottom: '10px' }}><strong>空間感重塑：</strong>學習如何把樂器分配到不打架的位置。</li>
                        </ul>
                    </div>

                    {/* 🟣 問卷/共創者 CTA (不留 Email，直接引導去填問卷) */}
                    <div style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', borderRadius: '24px', border: '1px solid #a78bfa', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <div style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>CO-CREATOR PROGRAM</div>
                        <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '1rem' }}>我們正在打造「完整版聽覺訓練系統」</h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                            與其自己閉門造車，我們更想聽聽你的聲音。<br />
                            告訴我們你最想解決的混音痛點，幫我們打造最適合你的功能！
                        </p>

                        <p style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                            🎁 填寫問卷，可於表單內留下 Email 領取上線 5 折優惠。
                        </p>

                        <button
                            // 💡 這裡放你的 Google Form 或 Typeform 連結
                            onClick={() => window.open('https://your-survey-link.com', '_blank')}
                            style={{ width: '100%', padding: '1.2rem', background: '#a78bfa', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            📝 參與開發調查 (約需 1 分鐘) 🚀
                        </button>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={() => router.push('/courses/ear-opening/bridge')} style={{ background: 'transparent', color: '#38bdf8', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}>
                                不了，我想繼續前往下一個教學 ➔
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