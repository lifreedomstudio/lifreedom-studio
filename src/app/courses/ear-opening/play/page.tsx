"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🎯 定義題庫結構，支援插入「中場知識卡 (interstitial)」與「陷阱題 (acceptAny)」
const basicQuestions = [
    {
        id: 1, title: '覺醒 01: 第一次聽見低頻', question: '哪一個比較「有重量」？', fileA: '/audio/step0/q1_a_full.mp3', fileB: '/audio/step0/q1_b_nobass.mp3', correct: 'A',
        feedbackCorrect: '你已經開始抓到聲音的「厚度」！', feedbackIncorrect: '很多人一開始會忽略這個差異 👂',
        insight: '🎧 聽感重量 = 低頻是否站得住'
    },
    {
        id: 2, title: '覺醒 02: 感受空間的維度', question: '哪一個感覺比較「遠」？', fileA: '/audio/step0/q2_a_dry.mp3', fileB: '/audio/step0/q2_b_wet.mp3', correct: 'B',
        feedbackCorrect: '你抓到了空間感！', feedbackIncorrect: '這需要一點直覺，再試試看。',
        insight: '🎧 距離不是遠近，是乾濕比例',
        interstitial: { type: 'knowledge', title: '🎧 小知識', text: '低頻不是「聽到」，而是「感受到」' }
    },
    {
        id: 3, title: '進化 01: 分辨聲音的邊界', question: '哪一個比較「清晰」？', fileA: '/audio/step0/q3_a_bright.mp3', fileB: '/audio/step0/q3_b_dark.mp3', correct: 'A',
        feedbackCorrect: '你的耳朵正在進化！', feedbackIncorrect: '有時候清晰與刺耳只有一線之隔。',
        insight: '🎧 清晰 ≠ 亮，是「頻率不打架」',
        interstitial: { type: 'real-world', title: '🎧 真實應用', text: '下次聽歌時，先不要聽旋律，試著單純找尋低頻是不是穩穩在下面跳動。' }
    },
    {
        id: 4, title: '進化 02: 捕捉兩側的細節', question: '哪一個聽起來比較「寬」？', fileA: '/audio/step0/q4_a_stereo.mp3', fileB: '/audio/step0/q4_b_mono.mp3', correct: 'A',
        feedbackCorrect: '你開始注意到左右的細節了！', feedbackIncorrect: '把注意力放在耳朵的兩側邊緣試試看。',
        insight: '🎧 寬度 = 左右聲道資訊的差異度',
        interstitial: { type: 'knowledge', title: '🎧 小知識', text: '清晰 ≠ 亮，是“頻率不打架”' }
    },
    {
        id: 5, title: '陷阱 01: 聽覺的錯覺', question: '哪一個聽起來比較「好聽」？', fileA: '/audio/step0/q5_a_normal.mp3', fileB: '/audio/step0/q5_b_louder.mp3', correct: 'B',
        acceptAny: true, // 🚨 不使用 hardcode，改用屬性標記陷阱題
        feedbackCorrect: '這是專業混音師也會中招的錯覺！', feedbackIncorrect: '這是專業混音師也會中招的錯覺！',
        insight: '🎧 假好聽 = 單純的音量膨脹 (+1dB 錯覺)'
    },
    {
        id: 6, title: '挑戰 01: 隱形的動態控制', question: '哪一個聲音比較「穩」？', fileA: '/audio/step0/q6_a_unstable.mp3', fileB: '/audio/step0/q6_b_stable.mp3', correct: 'B',
        feedbackCorrect: '你連這種微小的動態都能察覺！', feedbackIncorrect: '這題很難，聽不出差異是正常的。',
        insight: '🎧 穩定 = 動態被妥善地壓縮控制',
        interstitial: { type: 'real-world', title: '🎧 真實應用', text: '去聽你最愛的那首歌，注意大聲爆發時，聲音是否依然穩如泰山。' }
    },
    {
        id: 7, title: '綜合 01: 畫面平衡感', question: '哪一個整體比較「平衡」？', fileA: '/audio/step0/q7_a_balanced.mp3', fileB: '/audio/step0/q7_b_muddy.mp3', correct: 'A',
        feedbackCorrect: '你對整體畫面的掌握度很高。', feedbackIncorrect: '平衡是最難判斷的指標之一。',
        insight: '🎧 平衡 = 沒有任何頻段特別搶戲'
    },
    {
        id: 8, title: '直覺 01: 製作人視角', question: '哪一個聽起來比較「專業」？', fileA: '/audio/step0/q8_a_amateur.mp3', fileB: '/audio/step0/q8_b_pro.mp3', correct: 'B',
        feedbackCorrect: '你已經具備製作人的直覺了！', feedbackIncorrect: '專業感來自無數個微小的細節堆疊。',
        insight: '🎧 專業感 = 無數微小正確決策的堆疊'
    }
];

const advancedQuestions = [
    {
        id: 9, title: '極限 01: 微量體感', question: '哪一個低頻比較「滿」？', fileA: '/audio/step0/q9_a_bass2db.mp3', fileB: '/audio/step0/q9_b_bass5db.mp3', correct: 'B',
        feedbackCorrect: '太神了，你連這麼細微的變化都抓到了！', feedbackIncorrect: '這題非常進階，聽不出來很正常。',
        insight: '🎧 飽滿度 = 極微小音量差異的敏銳捕捉'
    },
    {
        id: 10, title: '感知 01: 情緒的形狀', question: '哪一個聽起來比較「溫暖」？', fileA: '/audio/step0/q10_a_warm.mp3', fileB: '/audio/step0/q10_b_cold.mp3', correct: 'A',
        feedbackCorrect: '沒錯，這就是「溫暖」的感覺。', feedbackIncorrect: '溫暖通常來自中低頻的包覆感。',
        insight: '🎧 溫暖 = 頻率與空間被設計出來的情感包覆'
    },
    {
        id: 11, title: '感知 02: 空間的重量', question: '哪一個聽起來比較有「壓迫感」？', fileA: '/audio/step0/q11_a_open.mp3', fileB: '/audio/step0/q11_b_compressed.mp3', correct: 'B',
        feedbackCorrect: '你感受到聲音的「重量與擠壓」了！', feedbackIncorrect: '壓迫感是一種很主觀但真實存在的聽覺感受。',
        insight: '🎧 壓迫感 = 過度壓縮導致聲音喘不過氣'
    }
];

type Phase = 'basic' | 'intermediate-result' | 'advanced' | 'final-result';

export default function EarOpeningPlayPage() {
    const router = useRouter();
    const [currentPhase, setCurrentPhase] = useState<Phase>('basic');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A');
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
    const [score, setScore] = useState(0);
    const [showInterstitial, setShowInterstitial] = useState(false); // 🎴 知識卡彈出狀態

    const audioARef = useRef<HTMLAudioElement | null>(null);
    const audioBRef = useRef<HTMLAudioElement | null>(null);

    const activeQuestions = currentPhase === 'advanced' ? advancedQuestions : basicQuestions;
    const q = activeQuestions[currentIndex];

    // 初始化與切換音檔
    useEffect(() => {
        if (currentPhase === 'intermediate-result' || currentPhase === 'final-result' || showInterstitial) return;
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
    }, [currentIndex, currentPhase, showInterstitial, q]);

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
        setCurrentTrack(track);
        if (audioARef.current && audioBRef.current) {
            audioARef.current.muted = track !== 'A';
            audioBRef.current.muted = track !== 'B';
        }
    };

    const handleSelect = (answer: 'A' | 'B') => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);

        // 🚨 陷阱題邏輯修正：利用 q.acceptAny 讓邏輯不再 Hardcode ID
        // @ts-ignore (確保 ts 不會因為有些物件沒有 acceptAny 報錯)
        if (currentPhase === 'basic' && (answer === q.correct || q.acceptAny)) {
            setScore(prev => prev + 1);
        }
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleNext = () => {
        // @ts-ignore
        if (q.interstitial && !showInterstitial) {
            // 如果這關有掛載小知識卡，且還沒顯示過，就先彈出卡片
            setShowInterstitial(true);
            if (audioARef.current) audioARef.current.pause();
            if (audioBRef.current) audioBRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // 正常前往下一關或結算
        setShowInterstitial(false);
        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (audioARef.current) audioARef.current.pause();
            if (audioBRef.current) audioBRef.current.pause();

            if (currentPhase === 'basic') {
                setCurrentPhase('intermediate-result');
            } else if (currentPhase === 'advanced') {
                setCurrentPhase('final-result');
            }
        }
    };

    const getEarLevel = () => {
        if (score >= 7) return { title: '潛在製作人', desc: '你的耳朵極度敏銳，具備成為頂級工程師的潛力。', icon: '🔥' };
        if (score >= 4) return { title: '聲音觀察者', desc: '你已經超越了一般聽眾，能捕捉到隱藏在細節中的魔鬼。', icon: '👀' };
        return { title: '初學感知型', desc: '你的聽覺才剛被喚醒，還有巨大的開發潛能。', icon: '🌱' };
    };

    // 🎴 中場知識卡 (Interstitial) 畫面
    // @ts-ignore
    if (showInterstitial && q.interstitial) {
        // @ts-ignore
        const isKnowledge = q.interstitial.type === 'knowledge';
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s', maxWidth: '500px' }}>
                    <div style={{
                        color: isKnowledge ? '#38bdf8' : '#10b981',
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        letterSpacing: '2px',
                        marginBottom: '1.5rem'
                    }}>
                        {/* @ts-ignore */}
                        {q.interstitial.title}
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', lineHeight: '1.6', marginBottom: '3rem', fontWeight: 'bold' }}>
                        {/* @ts-ignore */}
                        {q.interstitial.text}
                    </h2>
                    <button onClick={handleNext} style={{ padding: '1rem 3.5rem', background: '#fff', color: '#000', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
                        繼續 ➔
                    </button>
                </div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
            </div>
        );
    }

    // 🎬 第一階段結束 (加入學習摘要)
    if (currentPhase === 'intermediate-result') {
        const level = getEarLevel();
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', width: '100%', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.5s' }}>

                    <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: '900', marginBottom: '1.5rem' }}>你剛剛不是在亂猜</h1>

                    <div style={{ background: '#0f172a', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{level.icon}</div>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>你的結果：</div>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 1rem 0' }}>{level.title}</h2>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{level.desc}</p>
                    </div>

                    {/* 🔥 記憶錨點：你學到的事 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: '#fca311', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>🔥 你剛剛學到的 3 件事：</div>
                        <ul style={{ color: '#cbd5e1', lineHeight: '2', margin: 0, paddingLeft: '1.5rem', fontSize: '1.05rem' }}>
                            <li>低頻 = <strong style={{ color: '#fff' }}>重量</strong></li>
                            <li>殘響 (Reverb) = <strong style={{ color: '#fff' }}>距離</strong></li>
                            <li>單純變大聲 = <strong style={{ color: '#ef4444' }}>假好聽</strong> (聽覺錯覺)</li>
                        </ul>
                    </div>

                    <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                        你已經開始能分辨聲音的差異。<br />
                        <strong style={{ color: '#fca311' }}>大多數人其實從來沒有練過這件事。</strong>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => router.push('/courses/arrangement/intro')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #10b981, #38bdf8)', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                            🎧 我想知道這些聲音怎麼做
                        </button>
                        <button onClick={() => { setCurrentPhase('advanced'); setCurrentIndex(0); }} style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                            🎮 再玩幾個聽音挑戰
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🎬 進階階段結束
    if (currentPhase === 'final-result') {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '550px', width: '100%', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.5s', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>

                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤯</div>

                    <h1 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                        你剛剛做的事情<br />
                        <span style={{ color: '#ef4444' }}>不是在「猜答案」</span>
                    </h1>

                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '2.5rem', fontSize: '1.15rem' }}>
                        而是在建立：<br />
                        <strong style={{ color: '#38bdf8', fontSize: '1.4rem', letterSpacing: '1px', display: 'inline-block', margin: '10px 0' }}>👉 聲音判斷能力</strong><br /><br />
                        <span style={{ color: '#fca311', fontWeight: 'bold' }}>大多數人聽音樂 10 年，<br />也從來沒有做過你剛剛這件事。</span>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => router.push('/courses/ear-opening/bridge')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #fca311, #f97316)', color: '#020617', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(252, 163, 17, 0.3)' }}>
                            🎧 進入學習系統 (開始做出自己的聲音)
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

            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                    <span>{q?.title}</span>
                    <span>{currentIndex + 1} / {activeQuestions.length}</span>
                </div>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`, height: '100%', background: currentPhase === 'advanced' ? 'linear-gradient(90deg, #fca311, #ef4444)' : 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.4s ease' }} />
                </div>
            </div>

            <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '3rem', lineHeight: '1.4' }}>
                    {q?.question}
                </h1>

                <div style={{ marginBottom: '3rem' }}>
                    <button onClick={togglePlay} style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#fff' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)' }}>
                        {isPlaying ? '⏸ 暫停' : '▶ 播放音訊'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => { switchTrack('A'); if (!selectedAnswer) handleSelect('A'); }}
                        style={{
                            flex: 1, padding: '2rem 0', fontSize: '1.5rem', fontWeight: '900', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'A' ? '#38bdf8' : '#1e293b',
                            color: currentTrack === 'A' ? '#020617' : '#94a3b8',
                            border: selectedAnswer === 'A' ? '2px solid #fff' : '2px solid transparent',
                            transform: currentTrack === 'A' ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        A
                    </button>
                    <button
                        onClick={() => { switchTrack('B'); if (!selectedAnswer) handleSelect('B'); }}
                        style={{
                            flex: 1, padding: '2rem 0', fontSize: '1.5rem', fontWeight: '900', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'B' ? '#10b981' : '#1e293b',
                            color: currentTrack === 'B' ? '#020617' : '#94a3b8',
                            border: selectedAnswer === 'B' ? '2px solid #fff' : '2px solid transparent',
                            transform: currentTrack === 'B' ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        B
                    </button>
                </div>

                <div style={{ opacity: selectedAnswer ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: selectedAnswer ? 'auto' : 'none', marginTop: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '20px' }}>
                    {/* @ts-ignore */}
                    <div style={{ color: selectedAnswer === q?.correct || q?.acceptAny ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {/* @ts-ignore */}
                        {selectedAnswer === q?.correct || q?.acceptAny ? q?.feedbackCorrect : q?.feedbackIncorrect}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        {q?.insight}
                    </div>
                    <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                        {currentIndex === activeQuestions.length - 1 ? '查看分析結果 ➔' : '下一關 ➔'}
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
        </div>
    );
}