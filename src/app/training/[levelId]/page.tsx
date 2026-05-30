"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LEVELS, initialProgress, UserProgressType } from '@/lib/gameData';

export default function TrainingRoom() {
    const router = useRouter();
    const params = useParams();
    const levelId = params.levelId as string;

    const [level, setLevel] = useState<typeof LEVELS[0] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'A' | 'B'>('A'); // 目前聽的是 A 還是 B
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // 建立兩個獨立的 Audio 參考，用來做無縫靜音切換
    const audioARef = useRef<HTMLAudioElement | null>(null);
    const audioBRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!levelId) return;
        const targetLevel = LEVELS.find(l => l.id === levelId);
        if (targetLevel) setLevel(targetLevel);
    }, [levelId]);

    // 負責同步播放與暫停
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

    // 負責 A/B 無縫切換 (透過靜音)
    const switchTrack = (track: 'A' | 'B') => {
        setCurrentTrack(track);
        if (audioARef.current && audioBRef.current) {
            audioARef.current.muted = track !== 'A';
            audioBRef.current.muted = track !== 'B';
        }
    };

    // 提交答案
    const submitAnswer = (answer: 'A' | 'B') => {
        if (!level) return;

        // 停止播放
        if (audioARef.current && audioBRef.current) {
            audioARef.current.pause();
            audioBRef.current.pause();
            setIsPlaying(false);
        }

        setIsCorrect(answer === level.correct);
        setShowResult(true);

        // TODO: 這裡未來可以加入寫入 localStorage (XP增加、解鎖下一關) 的邏輯
    };

    if (!level) return <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>讀取關卡中...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '2rem 1rem', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* 隱藏的音軌播放器：負責讀取 public/audio 裡的檔案 */}
            <audio ref={audioARef} src={level.audio.A} loop muted={currentTrack !== 'A'} />
            <audio ref={audioBRef} src={level.audio.B} loop muted={currentTrack !== 'B'} />

            <div style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                        ❌ 放棄特訓
                    </button>
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>Level {level.order}</div>
                </div>

                <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    {level.question}
                </h1>

                {/* 🎛️ A/B 切換控制器 */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => switchTrack('A')}
                        style={{
                            flex: 1, padding: '2rem', fontSize: '2rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'A' ? '#38bdf8' : '#1e293b',
                            color: currentTrack === 'A' ? '#000' : '#475569',
                            border: `4px solid ${currentTrack === 'A' ? '#0284c7' : '#0f172a'}`
                        }}
                    >
                        A
                    </button>
                    <button
                        onClick={() => switchTrack('B')}
                        style={{
                            flex: 1, padding: '2rem', fontSize: '2rem', fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                            background: currentTrack === 'B' ? '#38bdf8' : '#1e293b',
                            color: currentTrack === 'B' ? '#000' : '#475569',
                            border: `4px solid ${currentTrack === 'B' ? '#0284c7' : '#0f172a'}`
                        }}
                    >
                        B
                    </button>
                </div>

                {/* 播放/暫停 按鈕 */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                    <button
                        onClick={togglePlay}
                        style={{ background: '#10b981', color: '#000', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
                    >
                        {isPlaying ? '⏸️ 暫停' : '▶️ 播放音軌'}
                    </button>
                </div>

                {/* 提交答案區塊 */}
                {!showResult ? (
                    <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid #1e293b' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>聽出來了嗎？</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => submitAnswer('A')} style={{ background: '#475569', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>答案是 A</button>
                            <button onClick={() => submitAnswer('B')} style={{ background: '#475569', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>答案是 B</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`, padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                        <h2 style={{ color: isCorrect ? '#34d399' : '#f87171', margin: '0 0 1rem 0' }}>
                            {isCorrect ? '🎉 完全正確！' : '❌ 差一點點！'}
                        </h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            {isCorrect ? level.feedback.correct[0] : level.feedback.wrong[0]}
                        </p>
                        <button onClick={() => router.push('/collection')} style={{ background: isCorrect ? '#10b981' : '#ef4444', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isCorrect ? '繼續挑戰下一關 🚀' : '回大廳重新特訓'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}