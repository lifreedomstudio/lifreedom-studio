"use client";
import { useState, useRef, useEffect } from 'react';

export default function EQTrainingRoom() {
    // 💡 改用 0~1000 的線性滑桿值，在後台轉換成對數頻率
    const [sliderValue, setSliderValue] = useState(420);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState<null | { diff: number, title: string, color: string }>(null);

    const audioContext = useRef<AudioContext | null>(null);
    const audioBuffer = useRef<AudioBuffer | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const filterNode = useRef<BiquadFilterNode | null>(null);

    const TARGET_FREQ = 350;

    // 🎛️ 真實 DAW 的對數運算邏輯 (20Hz - 20000Hz)
    const minFreq = 20;
    const maxFreq = 20000;
    const minLog = Math.log10(minFreq);
    const maxLog = Math.log10(maxFreq);

    // 根據滑桿位置，計算出對應的真實頻率
    const frequency = Math.round(Math.pow(10, minLog + ((maxLog - minLog) * (sliderValue / 1000))));

    useEffect(() => {
        const initAudio = async () => {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const response = await fetch('/guitar-loop.mp3');
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer.current = await audioContext.current.decodeAudioData(arrayBuffer);
        };
        initAudio();

        return () => {
            if (sourceNode.current) sourceNode.current.stop();
            if (audioContext.current) audioContext.current.close();
        };
    }, []);

    useEffect(() => {
        if (filterNode.current) {
            filterNode.current.frequency.value = frequency;
        }
    }, [frequency]);

    const togglePlay = () => {
        if (!audioContext.current || !audioBuffer.current) return;

        if (isPlaying) {
            sourceNode.current?.stop();
            setIsPlaying(false);
        } else {
            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = audioBuffer.current;
            sourceNode.current.loop = true;

            filterNode.current = audioContext.current.createBiquadFilter();
            filterNode.current.type = 'peaking';
            filterNode.current.frequency.value = frequency;
            filterNode.current.Q.value = 5.0;
            filterNode.current.gain.value = 15;

            sourceNode.current.connect(filterNode.current);
            filterNode.current.connect(audioContext.current.destination);

            sourceNode.current.start();
            setIsPlaying(true);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        const diff = Math.abs(frequency - TARGET_FREQ);
        if (diff <= 50) {
            setScore({ diff, title: '🏆 絕對音感！(金耳朵學徒)', color: '#10b981' });
        } else if (diff <= 200) {
            setScore({ diff, title: '👍 差一點點！(方向是對的)', color: '#fbbf24' });
        } else {
            setScore({ diff, title: '❌ 偏離目標！(再聽仔細一點)', color: '#ef4444' });
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setScore(null);
        setSliderValue(420); // 重置回 1000Hz 左右的位置
    };

    // 📺 視覺化：讓 X 座標也照著對數比例走
    const mapFreqToX = (freq: number) => {
        return ((Math.log10(freq) - minLog) / (maxLog - minLog)) * 1000;
    };
    const peakX = mapFreqToX(frequency);
    const qWidth = 80; // 配合 20k 寬度稍微收窄一點 Q 值視覺
    const eqPath = `M 0,150 L ${Math.max(0, peakX - qWidth)},150 C ${peakX - qWidth / 2},150 ${peakX - qWidth / 4},40 ${peakX},40 C ${peakX + qWidth / 4},40 ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', background: '#0f172a', borderRadius: '1rem', color: '#fff', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>🎧 第一關：尋找木吉他的「紙箱悶音」</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>全頻段掃描 (20Hz - 20kHz)，鎖定刺耳目標！</p>
            </div>

            {/* 📺 擬真 DAW EQ 頻譜顯示器 */}
            <div style={{ width: '100%', height: '200px', background: '#020617', borderRadius: '8px', border: '2px solid #1e293b', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>

                {/* 背景格線：改為對數分佈的感覺 */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {[100, 500, 1000, 5000, 10000].map((f) => (
                        <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(148, 163, 184, 0.2)' }}>
                            <span style={{ position: 'absolute', bottom: '5px', left: '5px', color: '#64748b', fontSize: '0.7rem' }}>{f >= 1000 ? `${f / 1000}k` : f}</span>
                        </div>
                    ))}
                </div>

                <svg viewBox="0 0 1000 200" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <path d={`${eqPath} L 1000,200 L 0,200 Z`} fill="rgba(2, 132, 199, 0.2)" />
                    <path d={eqPath} fill="none" stroke="#38bdf8" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.8))' }} />
                    <circle cx={peakX} cy="40" r="8" fill="#fff" stroke="#0284c7" strokeWidth="3" />
                </svg>

                <div style={{ position: 'absolute', top: '10px', left: '15px', color: '#fca311', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    Freq: {frequency} Hz <span style={{ color: '#10b981', fontSize: '0.9rem' }}>(+15dB)</span>
                </div>
            </div>

            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={togglePlay}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', background: isPlaying ? '#ef4444' : '#10b981', border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0, boxShadow: `0 0 15px ${isPlaying ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}` }}
                >
                    {isPlaying ? '停止' : '播放'}
                </button>

                <div style={{ flex: 1 }}>
                    {/* 滑桿改為控制 0~1000 的值 */}
                    <input
                        type="range" min="0" max="1000" step="1" value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))} disabled={isSubmitted}
                        style={{ width: '100%', cursor: isSubmitted ? 'not-allowed' : 'pointer', accentColor: '#38bdf8' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span>20 Hz</span><span>20k Hz</span>
                    </div>
                </div>
            </div>

            {!isSubmitted ? (
                <button
                    onClick={handleSubmit} disabled={!isPlaying}
                    style={{ width: '100%', padding: '1rem', background: isPlaying ? '#3b82f6' : '#475569', border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', cursor: isPlaying ? 'pointer' : 'not-allowed' }}
                >
                    {isPlaying ? '🎯 鎖定目標頻率！' : '請先播放音檔'}
                </button>
            ) : (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                    <h3 style={{ color: score?.color, fontSize: '1.5rem', marginBottom: '1rem' }}>{score?.title}</h3>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0' }}>正確答案：<span style={{ color: '#10b981', fontWeight: 'bold' }}>{TARGET_FREQ} Hz</span></p>
                        <p style={{ margin: 0, color: '#e2e8f0' }}>你的選擇：<span style={{ color: '#fca311', fontWeight: 'bold' }}>{frequency} Hz</span></p>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>(誤差: {score?.diff} Hz)</p>
                    </div>
                    <button onClick={handleReset} style={{ padding: '0.8rem 2rem', background: '#4b5563', border: 'none', borderRadius: '2rem', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                        🔄 再試一次
                    </button>
                </div>
            )}
        </div>
    );
}