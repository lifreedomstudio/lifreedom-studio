"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 📝 新手村 12 大核心題 (涵蓋：混音觀念 + 基礎編曲 + 空間佈局)
const QUESTIONS = [
    // --- 【混音觀念篇】 ---
    {
        id: 1, question: "根據「室內設計師」的比喻，如果混音時把所有樂器的音量都推到最大，並且都放在正中間 (Pan = 0)，會發生什麼事？",
        options: ["聲音會變得最清晰且有力量", "就像把客廳所有傢俱全擠在正中間，會互相干擾、沒有立體感", "會產生好聽的類比飽和與溫暖感", "代表混音已經完美結束"],
        correct: 1, explanation: "混音就是整理空間。讓每個樂器都有專屬的呼吸空間，聽起來才會立體！"
    },
    {
        id: 2, question: "關於 Gain 的「水龍頭」比喻，如果一開始錄音就把 Gain 開得太大，導致波形撞到天花板，會造成什麼後果？",
        options: ["增加聲音的動態範圍", "讓後面的 Compressor 運作更順暢", "產生刺耳且無法後期修復的「數位截斷失真 (Clipping)」", "獲得完美的真空管聲音"],
        correct: 2, explanation: "數位爆音是毀滅性的。維持在 -12dB 到 -18dB 保留 Headroom 才是混音的第一步。"
    },
    {
        id: 3, question: "當主唱的聲音聽起來像「被關在紙箱裡唱歌」一樣悶悶糊糊的 (Muddy)，通常是哪個頻段堆積了太多？",
        options: ["20Hz - 60Hz (極低頻)", "200Hz - 500Hz (中低頻)", "2kHz - 5kHz (中高頻)", "10kHz 以上 (極高頻)"],
        correct: 1, explanation: "200-500Hz 是厚度的來源，但太多就會變「渾濁 (Muddy)」。"
    },
    {
        id: 4, question: "在 EQ 的「公寓社區」比喻中，大鼓和貝斯的專屬樓層是「地下室」。如果吉他手也跑來佔空間，主委 (EQ) 該怎麼做？",
        options: ["用 Low Cut (低通) 把吉他趕回屬於它的中間樓層", "用 High Cut 把吉他的高頻砍掉", "把地下室的音量全部推大", "幫吉他加上厚重的 Reverb"],
        correct: 0, explanation: "低頻空間非常珍貴，切除其他樂器不需要的低頻，能讓大鼓和貝斯更扎實。"
    },
    {
        id: 5, question: "用「暴躁老爸」理解 Compressor，其中「Ratio (壓縮比)」代表什麼意思？",
        options: ["多大聲老爸才開始打人 (Threshold)", "老爸衝過來打你的速度 (Attack)", "老爸放過你的時間 (Release)", "老爸拿什麼武器教訓你 (壓縮的狠度與比例)"],
        correct: 3, explanation: "Ratio 決定了壓縮強度。2:1 像原子筆，4:1 像愛的小手，無限大就是平底鍋！"
    },
    {
        id: 6, question: "你想讓大鼓聽起來很有「Punch (拳頭打擊感)」，老爸衝過來的速度 (Attack) 應該怎麼設定？",
        options: ["設定極快 (例如 1ms)，瞬間把聲音壓扁", "設定偏慢 (例如 30ms)，讓你能先逃跑偷打一下", "Attack 參數與打擊感無關", "將 Ratio 調到無限大"],
        correct: 1, explanation: "Attack 設慢一點，可以讓聲音開頭的瞬態 (Transient) 溜過去，這就是 Punch 的來源！"
    },

    // --- 【基礎編曲與配器篇】 ---
    {
        id: 7, question: "【編曲實戰】你編了一把木吉他跟一台鋼琴，結果兩者在副歌彈奏相同的音域，頻率嚴重打架。最不破壞音色的解決方法是？",
        options: ["用 EQ 把吉他砍得剩高頻", "掛上兩台 Compressor 死命壓縮", "使用『八度音錯位術』，把鋼琴移高或移低一個八度", "把兩個樂器都 Pan 到極左"],
        correct: 2, explanation: "編曲問題就該用編曲解決！錯開八度能瞬間讓兩者擁有各自的發揮空間，不用動任何 EQ。"
    },
    {
        id: 8, question: "【編曲實戰】歌曲到了副歌，你覺得聽起來很雜亂。根據『減法藝術』，你應該做的第一步是什麼？",
        options: ["再疊三把吉他進去撐場面", "勇敢按下 Mute 鍵，把非必要的裝飾音軌靜音", "把所有軌道都加上 Reverb 融合在一起", "在 Master 軌掛上 Limiter 硬壓"],
        correct: 1, explanation: "好的編曲是懂得留白。與其用 EQ 搶空間，不如直接刪減不必要的軌道。"
    },
    {
        id: 9, question: "【編曲實戰】大家都在正拍彈奏，導致音樂聽起來像一堵笨重的牆。你該如何建立歌曲的 Groove (律動)？",
        options: ["把所有人的音量調小", "學會『節奏的交錯』，你彈我休、你休我彈", "全部改用合成器彈", "把 BPM 調快 20"],
        correct: 1, explanation: "節奏交錯 (Rhythmic Interlocking) 能讓樂器之間產生對話感，音樂才會『跳動』起來。"
    },
    {
        id: 10, question: "【頻段配器法】如果你已經決定用 Bass 負責所有的低頻流動，那你的合成器 (Synth) 在編寫時應該注意什麼？",
        options: ["盡量往下彈低音，跟 Bass 一起讓低頻更厚", "避免在低頻區間彈奏複雜的旋律，把空間讓給 Bass", "掛上破音讓它蓋過 Bass", "Pan 到極左"],
        correct: 1, explanation: "如果頻段已經被某個樂器佔據，其他樂器就該避開該頻段，這就是頻段配器的核心邏輯。"
    },

    // --- 【空間構築篇】 ---
    {
        id: 11, question: "在「立體聲場構築實驗室」中，日系搖滾常用的「LCR 擺位法」最核心的策略是什麼？",
        options: ["把主唱、大鼓、Bass 全部分配到極左或極右", "把所有樂器都維持在正中央", "主唱和節奏地基留中間，把雙吉他極端分配到 L100 與 R100", "隨機把樂器分配在左右 50 之間"],
        correct: 2, explanation: "將配器硬分左右，能極限拉寬聽覺舞台，同時確保正中間精華區保留給主唱與節奏組。"
    },
    {
        id: 12, question: "承上題，現代流行樂 (Modern Pop) 為了營造『溫暖緊密的包覆感』，吉他通常會怎麼擺位？",
        options: ["一樣推到 L100 跟 R100", "稍微往中間靠攏 (約 L40 / R40)", "全部擠在正中間 (C)", "Pan 到同一邊"],
        correct: 1, explanation: "稍微靠攏能犧牲一點極致的寬度，換來樂器之間更凝聚、溫柔的融合感。"
    }
];

export default function NoviceCertificationPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 考試狀態
    const [isStarted, setIsStarted] = useState(false);
    const [currentQIdx, setCurrentQIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answersRec, setAnswersRec] = useState<boolean[]>([]);

    const MAX_SCORE = QUESTIONS.length * 10; // 滿分 120

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleNext = () => {
        if (selectedOption === null) return;
        const isCorrect = selectedOption === QUESTIONS[currentQIdx].correct;
        if (isCorrect) setScore(prev => prev + 10); // 每題 10 分

        setAnswersRec(prev => [...prev, isCorrect]);

        if (currentQIdx < QUESTIONS.length - 1) {
            setCurrentQIdx(prev => prev + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    const restartExam = () => {
        setIsStarted(false);
        setCurrentQIdx(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setAnswersRec([]);
    };

    // 🎯 結算評語邏輯 (依照你的需求客製化級距)
    const getFeedback = (currentScore: number) => {
        const percentage = currentScore / MAX_SCORE;
        if (percentage === 1) return { text: "完美滿分！你已經具備無懈可擊的觀念，直接邁向大師之路吧！", color: '#fca311', icon: '🏆' };
        if (percentage >= 0.75) return { text: "很不錯！再努力些，你會成為混音大師的！", color: '#10b981', icon: '🌟' };
        if (percentage >= 0.5) return { text: "觀念正在成形中，但還有進步空間。建議回頭複習錯題的章節喔！", color: '#38bdf8', icon: '📈' };
        return { text: "看來你需要再認真學習囉！先回頭把魔導書跟實驗室重新摸熟吧。", color: '#ef4444', icon: '💥' };
    };

    // 🏆 畫面 1：考試首頁
    if (!isStarted) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ maxWidth: '600px', textAlign: 'center', background: 'linear-gradient(145deg, #0f172a, #1e293b)', padding: isMobile ? '2.5rem 1.5rem' : '4rem 3rem', borderRadius: '24px', border: '1px solid #10b981', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                    <h1 style={{ color: '#10b981', fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '900' }}>新手全面認證大會考</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                        這場測驗將驗證你是否真正吸收了 Gain、EQ、Compressor 以及「基礎編曲配器」的核心思維。<br /><br />
                        全卷共 {QUESTIONS.length} 題，每題 10 分，滿分 {MAX_SCORE} 分。<br />
                        準備好證明自己的實力了嗎？
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => router.push('/courses')} style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #334155', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>返回複習</button>
                        <button onClick={() => setIsStarted(true)} style={{ padding: '1rem 3rem', background: '#10b981', color: '#020617', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>開始測驗 ➔</button>
                    </div>
                </div>
            </div>
        );
    }

    // 🏆 畫面 3：結算成績單
    if (showResult) {
        const feedback = getFeedback(score);
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '3rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '800px', width: '100%', background: '#0f172a', padding: isMobile ? '2rem 1.5rem' : '4rem', borderRadius: '32px', border: `2px solid ${feedback.color}`, boxShadow: `0 20px 50px ${feedback.color}30` }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{feedback.icon}</div>
                        <h2 style={{ fontSize: '2rem', color: feedback.color, margin: '0 0 1rem 0' }}>{feedback.text}</h2>
                        <div style={{ fontSize: '4.5rem', fontWeight: '900', color: '#fff', textShadow: `0 0 20px ${feedback.color}` }}>
                            {score} <span style={{ fontSize: '1.8rem', color: '#94a3b8' }}>/ {MAX_SCORE}</span>
                        </div>
                    </div>

                    {/* 錯題檢討區 */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1.5rem' }}>📋 考卷批改報告</h3>
                        {QUESTIONS.map((q, idx) => (
                            <div key={q.id} style={{ padding: '1rem', background: answersRec[idx] ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', marginBottom: '1rem', borderLeft: `4px solid ${answersRec[idx] ? '#10b981' : '#ef4444'}` }}>
                                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>第 {idx + 1} 題 {answersRec[idx] ? '✅' : '❌'}</div>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' }}>{q.question}</div>
                                {!answersRec[idx] && (
                                    <div style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', lineHeight: '1.5' }}>
                                        💡 <b>重點複習：</b>{q.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                        <button onClick={restartExam} style={{ flex: 1, padding: '1.2rem', background: 'transparent', color: '#fff', border: '1px solid #334155', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 重新測驗</button>
                        <button onClick={() => router.push('/courses')} style={{ flex: 2, padding: '1.2rem', background: feedback.color, color: '#020617', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '900', fontSize: '1.1rem' }}>
                            返回課程大廳 ➔
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🏆 畫面 2：考試進行中
    const currentQ = QUESTIONS[currentQIdx];

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', letterSpacing: '2px' }}>NOVICE EXAM</span>
                    <span style={{ color: '#94a3b8' }}>Question {currentQIdx + 1} of {QUESTIONS.length}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '10px', marginBottom: '3rem', overflow: 'hidden' }}>
                    <div style={{ width: `${((currentQIdx) / QUESTIONS.length) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }}></div>
                </div>

                <div style={{ background: '#0f172a', padding: isMobile ? '2rem 1.5rem' : '3rem', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', lineHeight: '1.6', marginBottom: '2.5rem', color: '#f8fafc' }}>
                        {currentQ.question}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedOption(idx)}
                                style={{
                                    textAlign: 'left', padding: '1.2rem 1.5rem', borderRadius: '16px', fontSize: '1.05rem', lineHeight: '1.5', cursor: 'pointer', transition: 'all 0.2s',
                                    background: selectedOption === idx ? 'rgba(16, 185, 129, 0.1)' : '#1e293b',
                                    color: selectedOption === idx ? '#10b981' : '#cbd5e1',
                                    border: `2px solid ${selectedOption === idx ? '#10b981' : 'transparent'}`,
                                }}
                            >
                                <span style={{ fontWeight: 'bold', marginRight: '15px', color: selectedOption === idx ? '#10b981' : '#64748b' }}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleNext}
                            disabled={selectedOption === null}
                            style={{
                                padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', border: 'none',
                                background: selectedOption !== null ? '#10b981' : '#334155', color: selectedOption !== null ? '#020617' : '#94a3b8',
                                cursor: selectedOption !== null ? 'pointer' : 'not-allowed', boxShadow: selectedOption !== null ? '0 10px 20px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                        >
                            {currentQIdx === QUESTIONS.length - 1 ? '交卷查看成績 📝' : '下一題 ➔'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}