"use client";
import { useState, useRef, useEffect } from 'react';

export default function CompressorTrainingRoom() {
    const [gameState, setGameState] = useState<'playing' | 'answer'>('playing');
    const [isPlaying, setIsPlaying] = useState(false);
    const [grValue, setGrValue] = useState(0);

    // 🎚️ 參數狀態
    const [userSettings, setUserSettings] = useState({ threshold: -20, ratio: 4, attack: 15, release: 150 });
    const [targetSettings, setTargetSettings] = useState({ threshold: -35, ratio: 8, attack: 5, release: 100 });

    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const compRef = useRef<DynamicsCompressorNode | null>(null);
    const animationRef = useRef<number>(0);

    // 隨機出題邏輯
    const generateChallenge = () => {
        setTargetSettings({
            threshold: Math.floor(Math.random() * -30) - 15,
            ratio: Math.floor(Math.random() * 10) + 2,
            attack: Math.floor(Math.random() * 40) + 5,
            release: Math.floor(Math.random() * 300) + 50
        });
    };

    const togglePlay = () => {
        if (!audioCtxRef.current) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = ctx;
            const audio = new Audio('/audio/kick.mp3');
            audio.loop = true;
            audioRef.current = audio;

            const source = ctx.createMediaElementSource(audio);
            const compressor = ctx.createDynamicsCompressor();
            compRef.current = compressor;

            source.connect(compressor);
            compressor.connect(ctx.destination);
            generateChallenge();
        }

        if (isPlaying) {
            audioRef.current?.pause();
            cancelAnimationFrame(animationRef.current);
            setGrValue(0);
        } else {
            audioCtxRef.current?.resume();
            audioRef.current?.play();
            updateAnimation();
        }
        setIsPlaying(!isPlaying);
    };

    const updateAnimation = () => {
        if (compRef.current) {
            // 使用原生的 reduction 值，最穩定
            const reduction = compRef.current.reduction;
            const currentGR = typeof reduction === 'number' ? reduction : (reduction as any).value;
            setGrValue(currentGR || 0);
        }
        animationRef.current = requestAnimationFrame(updateAnimation);
    };

    useEffect(() => {
        if (!compRef.current || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        compRef.current.threshold.setTargetAtTime(userSettings.threshold, ctx.currentTime, 0.05);
        compRef.current.ratio.setTargetAtTime(userSettings.ratio, ctx.currentTime, 0.05);
        compRef.current.attack.setTargetAtTime(userSettings.attack / 1000, ctx.currentTime, 0.05);
        compRef.current.release.setTargetAtTime(userSettings.release / 1000, ctx.currentTime, 0.05);
    }, [userSettings]);

    const CompareRow = ({ label, user, target, unit, color, min, max }: any) => (
        <div style={{ marginBottom: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span>{label}</span>
                <span>大師: {target}{unit} | 你的: {user}{unit}</span>
            </div>
            <div style={{ position: 'relative', height: '10px', background: '#020617', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', left: `${((target - min) / (max - min)) * 100}%`, width: '4px', height: '100%', background: '#10b981', zIndex: 2 }}></div>
                <div style={{ position: 'absolute', left: `${((user - min) / (max - min)) * 100}%`, width: '10px', height: '10px', background: color, borderRadius: '50%', transform: 'translateX(-50%)' }}></div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: '#fbbf24', marginBottom: '2rem' }}>⚔️ 壓縮器道場</h1>

                {gameState === 'playing' ? (
                    <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '24px' }}>
                        <div style={{ background: '#020617', height: '60px', borderRadius: '12px', marginBottom: '2rem', position: 'relative', overflow: 'hidden', border: '1px solid #334155' }}>
                            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${Math.min(100, Math.abs(grValue) * 5)}%`, background: '#10b981' }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#38bdf8' }}>GAIN REDUCTION</span>
                                <span>{grValue.toFixed(1)} dB</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>THRESHOLD ({userSettings.threshold} dB)</label>
                                <input type="range" min="-60" max="0" value={userSettings.threshold} onChange={e => setUserSettings({ ...userSettings, threshold: +e.target.value })} style={{ width: '100%' }} />
                                <label style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem', display: 'block' }}>RATIO ({userSettings.ratio}:1)</label>
                                <input type="range" min="1" max="20" step="0.1" value={userSettings.ratio} onChange={e => setUserSettings({ ...userSettings, ratio: +e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>ATTACK ({userSettings.attack} ms)</label>
                                <input type="range" min="1" max="100" value={userSettings.attack} onChange={e => setUserSettings({ ...userSettings, attack: +e.target.value })} style={{ width: '100%' }} />
                                <label style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem', display: 'block' }}>RELEASE ({userSettings.release} ms)</label>
                                <input type="range" min="10" max="1000" value={userSettings.release} onChange={e => setUserSettings({ ...userSettings, release: +e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={togglePlay} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                {isPlaying ? '停止播放' : '🔊 播放測試音'}
                            </button>
                            <button onClick={() => { setIsPlaying(false); audioRef.current?.pause(); setGameState('answer'); }} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #fbbf24', color: '#fbbf24', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>
                                ⚔️ 提交解答
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '2px solid #fbbf24' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>大師鑑定報告</h2>
                        <CompareRow label="Threshold" user={userSettings.threshold} target={targetSettings.threshold} unit="dB" color="#fbbf24" min={-60} max={0} />
                        <CompareRow label="Ratio" user={userSettings.ratio} target={targetSettings.ratio} unit=":1" color="#38bdf8" min={1} max={20} />
                        <CompareRow label="Attack" user={userSettings.attack} target={targetSettings.attack} unit="ms" color="#fca311" min={1} max={100} />
                        <CompareRow label="Release" user={userSettings.release} target={targetSettings.release} unit="ms" color="#a78bfa" min={10} max={1000} />
                        <button onClick={() => { setGameState('playing'); generateChallenge(); }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#fbbf24', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>🔥 挑戰下一關</button>
                    </div>
                )}
            </div>
        </div>
    );
}