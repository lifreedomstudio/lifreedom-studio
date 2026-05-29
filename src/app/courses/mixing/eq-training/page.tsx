"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ----------------------------------------------------
// 🔊 核心升級 1：安全相容 Next.js 的 A/B Audio Hook
// ----------------------------------------------------
const useABAudio = () => {
    const audioA = useRef<HTMLAudioElement | null>(null);
    const audioB = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 在 Client 端才初始化，避免 SSR 報錯
        audioA.current = new Audio("/audio/mud_A_clean.mp3");
        audioB.current = new Audio("/audio/mud_B_muddy.mp3");

        // 為了確保重複播放順利，設定 loop
        if (audioA.current) audioA.current.loop = true;
        if (audioB.current) audioB.current.loop = true;

        return () => stopAll(); // 離開頁面時停止
    }, []);

    const stopAll = () => {
        if (audioA.current) { audioA.current.pause(); audioA.current.currentTime = 0; }
        if (audioB.current) { audioB.current.pause(); audioB.current.currentTime = 0; }
    };

    const playA = () => { stopAll(); audioA.current?.play(); };
    const playB = () => { stopAll(); audioB.current?.play(); };

    return { playA, playB, stopAll };
};

function EQTrainingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mission = searchParams.get('mission');

    // 🎮 狀態管理
    const [playing, setPlaying] = useState<"A" | "B" | null>(null);
    const { playA, playB, stopAll } = useABAudio();
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    // 離開頁面時切斷音訊
    useEffect(() => { return () => stopAll(); }, []);

    const handlePlay = (type: "A" | "B") => {
        setPlaying(type);
        if (type === "A") playA();
        if (type === "B") playB();
    };

    // 🧠 核心升級 2：AI 動態評語生成
    const generateFeedback = (correct: boolean, currentAttempts: number) => {
        if (correct && currentAttempts === 1) {
            return "🔥 太準了，你已經有職業級耳朵了！";
        }
        if (correct) {
            return "✅ 有進步，你開始抓到 mud 的位置了！";
        }
        return "👂 再試一次，注意聽音檔低中頻「轟轟糊糊」的堆積感。";
    };

    const submitAnswer = (answer: string) => {
        const correctAnswer = "B"; // 假設 B 是有 Mud 的音檔
        const isCorrect = answer === correctAnswer;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        const msg = generateFeedback(isCorrect, newAttempts);
        setFeedback(msg);

        if (isCorrect) {
            stopAll();
            setPlaying(null);

            // 更新進度到 LocalStorage
            const stored = localStorage.getItem('mix_progress');
            let progress = stored ? JSON.parse(stored) : {};
            if (mission) {
                progress[mission] = { ...progress[mission], unlocked: true, progress: 100, attempts: newAttempts };
                localStorage.setItem('mix_progress', JSON.stringify(progress));
            }

            // 延遲跳出成功畫面，讓玩家先看到 AI 評語
            setTimeout(() => setShowSuccess(true), 800);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* 🎯 核心升級 4：完整 Mud 任務 UI */}
                {mission === "mud_250hz" && (
                    <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #312e81)', padding: '3rem', borderRadius: '24px', border: '2px solid #4f46e5', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)', textAlign: 'center' }}>
                        <div style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '1rem', marginBottom: '10px', letterSpacing: '2px' }}>
                            🧠 訓練目標：學會「用耳朵找到問題頻率」
                        </div>
                        <h2 style={{ color: '#e0e7ff', fontSize: '2rem', margin: '0 0 20px 0' }}>🎯 找出混濁 (Mud)</h2>
                        <p style={{ color: '#a5b4fc', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            這兩段大鼓音軌中，有一段的 250Hz 附近嚴重堆積。<br />請依賴你的耳朵，找出哪一段比較「混濁、轟鳴」？
                        </p>

                        {/* 🎧 UI 按鈕（帶「正在播放」狀態） */}
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
                            <button
                                onClick={() => handlePlay("A")}
                                style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', border: playing === "A" ? '2px solid #10b981' : '2px solid #6366f1', background: playing === "A" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: playing === "A" ? '#10b981' : '#fff', boxShadow: playing === "A" ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none' }}
                            >
                                {playing === "A" ? '🔊 播放中 (A)' : '▶ 試聽 A'}
                            </button>
                            <button
                                onClick={() => handlePlay("B")}
                                style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', border: playing === "B" ? '2px solid #10b981' : '2px solid #6366f1', background: playing === "B" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: playing === "B" ? '#10b981' : '#fff', boxShadow: playing === "B" ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none' }}
                            >
                                {playing === "B" ? '🔊 播放中 (B)' : '▶ 試聽 B'}
                            </button>
                        </div>

                        <p style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: '15px' }}>👇 誰是造成 Mud 的兇手？</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                            <button onClick={() => submitAnswer("A")} style={{ padding: '12px 40px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4338ca'} onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}>選 A</button>
                            <button onClick={() => submitAnswer("B")} style={{ padding: '12px 40px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4338ca'} onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}>選 B</button>
                        </div>

                        {/* 動態 AI 評語 */}
                        {feedback && (
                            <div className="feedback-box" style={{ padding: '15px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', color: feedback.includes('🔥') || feedback.includes('✅') ? '#6ee7b7' : '#fca5a5', fontWeight: 'bold', fontSize: '1.1rem', animation: 'fadeIn 0.4s ease' }}>
                                {feedback}
                            </div>
                        )}
                    </div>
                )}

                {/* 🎉 核心升級 5：超加分成功動畫 */}
                {showSuccess && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div className="success-modal" style={{ background: 'linear-gradient(145deg, #022c22, #064e3b)', border: '2px solid #10b981', padding: '3rem 4rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🔥</div>
                            <h2 style={{ color: '#6ee7b7', fontSize: '2.5rem', margin: '0 0 10px 0' }}>能力解鎖！</h2>
                            <p style={{ color: '#a7f3d0', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                恭喜！你現在能精準分辨 250Hz 的 Mud。<br />
                                <span style={{ fontSize: '1rem', color: '#10b981' }}>(本次通關共嘗試了 {attempts} 次)</span>
                            </p>
                            <button
                                onClick={() => router.push('/collection')}
                                style={{ padding: '15px 40px', background: '#10b981', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.5)', transition: '0.2s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                回到訓練地圖 ➔
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 加入全域動畫 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .success-modal { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}

export default function EQTrainingPage() {
    return (
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>載入中...</div>}>
            <EQTrainingContent />
        </Suspense>
    );
}