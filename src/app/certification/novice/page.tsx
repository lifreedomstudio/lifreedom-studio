"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 📝 新手村終極大會考：16 題滿血版 (涵蓋：混音觀念 + 編曲四大學派)
const QUESTIONS = [
    // --- 【第 1 章：混音觀念與 Gain】 ---
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

    // --- 【第 2 章：EQ 與 Muddy】 ---
    {
        id: 3, question: "當主唱的聲音聽起來像「被關在紙箱裡唱歌」一樣悶悶糊糊的 (Muddy)，通常是哪個頻段堆積了太多？",
        options: ["20Hz - 60Hz (極低頻)", "200Hz - 500Hz (中低頻)", "2kHz - 5kHz (中高頻)", "10kHz 以上 (極高頻)"],
        correct: 1, explanation: "200-500Hz 是厚度的來源，但太多就會變「渾濁 (Muddy)」。"
    },
    {
        id: 4, question: "在 EQ 的「公寓社區」比喻中，大鼓和貝斯的專屬樓層是「地下室」。如果吉他手也跑來佔空間，主委 (EQ) 該怎麼做？",
        options: ["用 Low Cut (低通濾波) 把吉他趕回屬於它的中間樓層", "用 High Cut 把吉他的高頻砍掉", "把地下室的音量全部推大", "幫吉他加上厚重的 Reverb"],
        correct: 0, explanation: "低頻空間非常珍貴，切除其他樂器不需要的低頻，能讓大鼓和貝斯更扎實。"
    },

    // --- 【第 3 章：Compressor 動態管理】 ---
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

    // --- 【🥁 第 4 章：編曲學 - Groove 律動】 ---
    {
        id: 7, question: "【注入人味】在軟體中編輯鼓組 MIDI 時，如果將所有音符都『100% 貼齊網格線 (Quantize)』且力度都調到最大，會產生什麼問題？",
        options: ["聲音聽起來會非常專業且有律動感", "這是一種叫做 Lock-in 的高級技巧", "聽起來會像機關槍一樣死板的機器人，毫無人類真實打鼓的呼吸感", "會讓大鼓跟貝斯不會打架"],
        correct: 2, explanation: "完美對齊會殺死 Groove！微小的時間偏差 (Micro-timing) 與輕重力度 (Velocity) 才是律動的來源。"
    },
    {
        id: 8, question: "【終極奧義】為了解決大鼓與貝斯各走各的路，我們學到了『Lock-in (鎖定)』技巧。這代表我們在編曲時應該怎麼做？",
        options: ["大鼓踩下去的那一瞬間，貝斯剛好也要彈出那個音，特別是在重拍上", "讓貝斯手隨便彈，不要理大鼓", "讓大鼓和貝斯分配到左右兩個不同的聲道 (Pan)", "用 EQ 把大鼓完全切掉"],
        correct: 0, explanation: "Lock-in 就是把它們變成同一個超級樂器！大鼓是發聲的瞬間，貝斯是聲音的延續。"
    },
    {
        id: 9, question: "【Bass 手的秘密】當吉他手彈奏 C ➔ G ➔ Am ➔ Em ➔ F 時，Bass 手如果不想死死地只彈根音，可以使用什麼高級技巧讓情緒像樓梯一樣滑順推進？",
        options: ["使用『平行壓縮 (Parallel Compression)』", "使用『根音下行』(如彈奏 C ➔ B ➔ A ➔ G ➔ F)，利用和弦的組成音轉位往下走", "用力踩下 Distortion 效果器", "停止彈奏"],
        correct: 1, explanation: "根音下行 (Descending Bassline) 能把呆板的伴奏變成一條引導情緒的絕美旋律線。"
    },

    // --- 【🎹 第 5 章：編曲學 - Voicing 與 Masking】 ---
    {
        id: 10, question: "【空間錯位】如果木吉他正在彈奏「紅色警戒區(C3附近)」的開放和弦，此時鋼琴也要加入，鋼琴手最聰明的選擇是什麼？",
        options: ["跟著吉他一起在 C3 彈奏厚實的柱式和弦", "使用 Octave Up (移高八度) 往綠色安全區 (C4-C5) 彈奏，避開吉他的頻率", "加入大量的 Reverb 把它蓋過去", "也拿一把吉他來彈"],
        correct: 1, explanation: "吉他在一樓，鋼琴就去二樓！這就是八度音錯位 (Octave Displacement) 的物理空間魔法。"
    },
    {
        id: 11, question: "【頻率遮蔽】多個同頻樂器擠在一起，就像五個人同時要擠過一道門，這稱為 Masking。其中 300Hz - 2kHz 這個被稱為「車禍層」的區塊，我們必須盡量留白給誰？",
        options: ["大鼓 (Kick)", "Bass", "人聲 (Vocal)", "銅鈸 (Crash)"],
        correct: 2, explanation: "300Hz-2kHz 是人耳最敏感的區域，也是人聲的專屬領空，必須時刻為其護航。"
    },

    // --- 【🎢 第 6 章：編曲學 - Dynamics 動態與曲式 (New!)】 ---
    {
        id: 12, question: "【情緒劇本】在流行音樂中，負責「能量最高點，重複性強的主題」的段落稱為什麼？",
        options: ["Verse (主歌)", "Pre-Chorus (導歌)", "Chorus (副歌)", "Bridge (橋段)"],
        correct: 2, explanation: "Chorus (副歌) 是全曲情緒爆發的核心，也是最容易被聽眾記住的段落。"
    },
    {
        id: 13, question: "【留白的力量】在進入大副歌的前一刻 (約 200-500 毫秒)，專業編曲人經常會使用一種「退一步，進兩步」的技巧，指的是什麼？",
        options: ["把所有樂器的音量推到最大", "將所有背景音樂『抽乾』(Silence)，讓聲響瞬間消失", "加入大量的 Delay (回音)", "讓吉他手瘋狂 Solo"],
        correct: 1, explanation: "這短暫的「真空狀態」會產生強烈的補償心理，讓隨後的副歌爆發具備無比的撞擊力！"
    },
    {
        id: 14, question: "【轉場吸力】為了在進入副歌時創造「被吸進去」的強大張力，我們可以將銅鈸 (Crash) 的音檔進行什麼處理？",
        options: ["加上 Distortion (破音)", "Reverse (反轉倒放)，並將最大音量點對齊重拍", "Tune (調音) 到最高", "Pan 到極左"],
        correct: 1, explanation: "Reverse 會讓聲音從「碰—斯」變成「斯—碰」，創造出完美的真空吸力直到爆發點。"
    },
    {
        id: 15, question: "【Automation 戰術】為了讓主唱在副歌的龐大樂團中保持權威感，我們可以利用 Automation 針對主唱的 Reverb (殘響) 做什麼設定？",
        options: ["在進入副歌瞬間，把 Reverb 調到最濕 (100%)", "在進入副歌瞬間，自動向下把 Reverb 調『乾』", "讓 Reverb 左右快速搖擺", "完全關掉主唱軌"],
        correct: 1, explanation: "調乾 Reverb 能讓主唱的聲音瞬間「跳到最前面」，顯得清晰且具備能量權威。"
    },
    {
        id: 16, question: "【聲場佈局】在「立體聲場構築實驗室」中，日系搖滾常用的「LCR 擺位法」是將雙吉他如何配置？",
        options: ["全部放在正中間", "分配到極左 (L100) 與極右 (R100) 拉寬舞台", "隨機分配在 L50 到 R50 之間", "只放在左邊"],
        correct: 1, explanation: "將配器硬分左右，能極限拉寬聽覺舞台，同時確保正中間精華區保留給主唱與節奏組。"
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

    const MAX_SCORE = QUESTIONS.length * 10; // 滿分 160

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

    // 🎯 動態級距評語
    const getFeedback = (currentScore: number) => {
        const percentage = currentScore / MAX_SCORE;
        if (percentage === 1) return { text: "完美滿分！你已經具備無懈可擊的觀念，直接邁向大師之路吧！", color: '#fca311', icon: '🏆' };
        if (percentage >= 0.75) return { text: "非常優秀！再努力些，你會成為混音大師的！", color: '#10b981', icon: '🌟' };
        if (percentage >= 0.5) return { text: "觀念正在成形中，但還有進步空間。建議回頭複習錯題的章節喔！", color: '#38bdf8', icon: '📈' };
        return { text: "看來你需要再認真學習囉！先回頭把魔導書跟各個關卡重新摸熟吧。", color: '#ef4444', icon: '💥' };
    };

    // 🏆 畫面 1：考試首頁
    if (!isStarted) {
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ maxWidth: '600px', textAlign: 'center', background: 'linear-gradient(145deg, #0f172a, #1e293b)', padding: isMobile ? '2.5rem 1.5rem' : '4rem 3rem', borderRadius: '24px', border: '1px solid #10b981', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                    <h1 style={{ color: '#10b981', fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '900' }}>新手全面認證大會考</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                        這場終極測驗將驗證你是否真正吸收了 Gain、EQ、Compressor 以及「基礎編曲四大學派」的核心思維。<br /><br />
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