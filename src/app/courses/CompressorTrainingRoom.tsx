"use client";
import { useState, useRef, useEffect } from 'react';

export default function CompressorTrainingRoom() {
    const [gameState, setGameState] = useState<'playing' | 'answer'>('playing');
    const [isPlaying, setIsPlaying] = useState(false);
    const [grValue, setGrValue] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [tipTab, setTipTab] = useState<'dad' | 'wiwi'>('dad'); // 秘笈分頁狀態

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 🎚️ 參數狀態 (新增了 Knee)
    const [userSettings, setUserSettings] = useState({ threshold: -20, ratio: 4, attack: 15, release: 150, knee: 15 });
    const [targetSettings, setTargetSettings] = useState({ threshold: -35, ratio: 8, attack: 5, release: 100, knee: 30 });

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
            release: Math.floor(Math.random() * 300) + 50,
            knee: Math.floor(Math.random() * 40) // Web Audio API Knee 範圍 0~40
        });
    };

    const togglePlay = () => {
        if (!audioCtxRef.current) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = ctx;
            const audio = new Audio('/drum-loop.mp3'); // 🚨 確保你有大鼓音檔
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
            const reduction = compRef.current.reduction;
            const currentGR = typeof reduction === 'number' ? reduction : (reduction as any).value;
            setGrValue(currentGR || 0);
        }
        animationRef.current = requestAnimationFrame(updateAnimation);
    };

    // 參數即時更新到 Web Audio API
    useEffect(() => {
        if (!compRef.current || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        compRef.current.threshold.setTargetAtTime(userSettings.threshold, ctx.currentTime, 0.05);
        compRef.current.ratio.setTargetAtTime(userSettings.ratio, ctx.currentTime, 0.05);
        compRef.current.attack.setTargetAtTime(userSettings.attack / 1000, ctx.currentTime, 0.05);
        compRef.current.release.setTargetAtTime(userSettings.release / 1000, ctx.currentTime, 0.05);
        compRef.current.knee.setTargetAtTime(userSettings.knee, ctx.currentTime, 0.05);
    }, [userSettings]);

    const CompareRow = ({ label, user, target, unit, color, min, max }: any) => (
        <div style={{ marginBottom: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>{label}</span>
                <span>大師: <b style={{ color }}>{target}</b> {unit} | 你的: <b>{user}</b> {unit}</span>
            </div>
            <div style={{ position: 'relative', height: '10px', background: '#020617', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', left: `${((target - min) / (max - min)) * 100}%`, width: '4px', height: '14px', background: color, zIndex: 2, top: '-2px', boxShadow: `0 0 10px ${color}` }}></div>
                <div style={{ position: 'absolute', left: `${((user - min) / (max - min)) * 100}%`, width: '12px', height: '12px', background: '#fff', borderRadius: '50%', transform: 'translateX(-50%)', top: '-1px' }}></div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: isMobile ? '1.5rem 1rem' : '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#fbbf24', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 0.5rem 0' }}>⚔️ 壓縮器道場</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>聽出大師的設定！觀察 Gain Reduction (GR) 表，找出隱藏的參數。</p>
                </div>

                {/* 📖 知識補帖：道場秘笈 */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => setShowTips(!showTips)}
                        style={{ width: '100%', padding: '1rem', background: '#1e293b', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>📖 壓縮器道場秘笈 (破除迷思必看)</span>
                        <span>{showTips ? '▲ 收起' : '▼ 展開'}</span>
                    </button>

                    {showTips && (
                        <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0 0 12px 12px', borderTop: 'none', overflow: 'hidden', animation: 'fadeIn 0.3s' }}>
                            <div style={{ display: 'flex', background: '#1e293b' }}>
                                <button onClick={() => setTipTab('dad')} style={{ flex: 1, padding: '0.8rem', background: tipTab === 'dad' ? 'transparent' : 'rgba(0,0,0,0.2)', color: tipTab === 'dad' ? '#fbbf24' : '#64748b', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🧔 爸爸舉例法 (秒懂)</button>
                                <button onClick={() => setTipTab('wiwi')} style={{ flex: 1, padding: '0.8rem', background: tipTab === 'wiwi' ? 'transparent' : 'rgba(0,0,0,0.2)', color: tipTab === 'wiwi' ? '#38bdf8' : '#64748b', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🎹 動態原理解析 (進階)</button>
                            </div>

                            <div style={{ padding: '1.5rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.7' }}>
                                {tipTab === 'dad' ? (
                                    <>
                                        <p>把 Compressor 想像成一個<b>正在教訓你的老爸</b>：</p>
                                        <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                                            <li style={{ marginBottom: '0.5rem' }}><b>Threshold (爸爸的容忍度)：</b> 超過這條底線，爸爸就發火開扁。</li>
                                            <li style={{ marginBottom: '0.5rem' }}><b>Ratio (教訓的武器)：</b> 2:1 是徒手，4:1 是愛的小手，無限大 (Limiter) 就是直接休學。數值越大壓越扁。</li>
                                            <li style={{ marginBottom: '0.5rem' }}><b>Knee (爸爸的脾氣)：</b> 硬膝 (0) 代表瞬間暴怒開扁；軟膝 (40) 代表會先碎碎念警告，慢慢增加力道。</li>
                                            <li style={{ marginBottom: '0.5rem' }}><b>Attack (衝過來的速度)：</b> 衝得慢，你還能先逃跑偷打一下 (保留 Punch)；衝得快，你一出聲就被瞬間按在地上。</li>
                                            <li><b>Release (多久放過你)：</b> 放太快，你又會開始作怪 (抽吸效應)；放太慢，你整天都被壓抑著。</li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p><b>破除迷思：壓縮器不是用來變大聲的工具！</b></p>
                                        <p>它其實是把「大聲」與「小聲」的差距縮小 (縮小動態範圍)。配合 <b>Auto Gain (自動音量補償)</b>，把壓下去失去的總音量補回來後，原本聽不見的「小細節、尾音、呼吸聲」就會被放大，聲音就變「厚」了。</p>
                                        <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                                            <li style={{ marginBottom: '0.5rem' }}><b>Attack 決定打擊感：</b> 設慢一點 (例如 15ms)，讓鼓聲最初的瞬態 (Transient) 溜過去再壓縮，就會產生強烈的 Punch 衝擊力。</li>
                                            <li><b>Release 決定呼吸律動：</b> 如果 Release 超快，聲音會被拉長；太慢的話，下一個聲音出來時還在被壓抑，整體會變悶。找到配合歌曲 BPM 的 Release，樂器就會跟著「呼吸」！</li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {gameState === 'playing' ? (
                    <div style={{ background: '#0f172a', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>

                        {/* GR 儀表板 */}
                        <div style={{ background: '#020617', height: '60px', borderRadius: '12px', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden', border: '1px solid #334155', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${Math.min(100, Math.abs(grValue) * 5)}%`, background: '#ef4444', transition: 'width 0.05s linear' }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#fca311', fontSize: isMobile ? '0.85rem' : '1rem', letterSpacing: '1px' }}>GAIN REDUCTION</span>
                                <span style={{ color: '#fff', textShadow: '0 0 5px #000' }}>{grValue.toFixed(1)} dB</span>
                            </div>
                        </div>

                        {/* 控制面板區 */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '3rem', marginBottom: '2.5rem' }}>
                            {/* 左側：門檻與武器 */}
                            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#fbbf24', fontWeight: 'bold' }}>THRESHOLD</label>
                                        <span style={{ color: '#fff' }}>{userSettings.threshold} dB</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>容忍度：多大聲才開始壓？</p>
                                    <input type="range" min="-60" max="0" value={userSettings.threshold} onChange={e => setUserSettings({ ...userSettings, threshold: +e.target.value })} style={{ width: '100%', accentColor: '#fbbf24' }} />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#38bdf8', fontWeight: 'bold' }}>RATIO</label>
                                        <span style={{ color: '#fff' }}>{userSettings.ratio}:1</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>壓縮武器：超過底線後，壓多扁？</p>
                                    <input type="range" min="1" max="20" step="0.1" value={userSettings.ratio} onChange={e => setUserSettings({ ...userSettings, ratio: +e.target.value })} style={{ width: '100%', accentColor: '#38bdf8' }} />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#ec4899', fontWeight: 'bold' }}>KNEE</label>
                                        <span style={{ color: '#fff' }}>{userSettings.knee}</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>脾氣：0為瞬間暴怒，越大越平滑。</p>
                                    <input type="range" min="0" max="40" value={userSettings.knee} onChange={e => setUserSettings({ ...userSettings, knee: +e.target.value })} style={{ width: '100%', accentColor: '#ec4899' }} />
                                </div>
                            </div>

                            {/* 右側：時間控制 */}
                            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#fca311', fontWeight: 'bold' }}>ATTACK</label>
                                        <span style={{ color: '#fff' }}>{userSettings.attack} ms</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>出拳速度：決定打擊感 (Punch)</p>
                                    <input type="range" min="1" max="100" value={userSettings.attack} onChange={e => setUserSettings({ ...userSettings, attack: +e.target.value })} style={{ width: '100%', accentColor: '#fca311' }} />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ color: '#a78bfa', fontWeight: 'bold' }}>RELEASE</label>
                                        <span style={{ color: '#fff' }}>{userSettings.release} ms</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>放過時間：決定律動與呼吸感</p>
                                    <input type="range" min="10" max="1000" value={userSettings.release} onChange={e => setUserSettings({ ...userSettings, release: +e.target.value })} style={{ width: '100%', accentColor: '#a78bfa' }} />
                                </div>
                            </div>
                        </div>

                        {/* 動作按鈕 */}
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
                            <button onClick={togglePlay} style={{ flex: 1, padding: '1.2rem', borderRadius: '12px', background: isPlaying ? '#ef4444' : '#10b981', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer' }}>
                                {isPlaying ? '⏹️ 停止播放' : '🔊 播放測試大鼓'}
                            </button>
                            <button onClick={() => { if (isPlaying) { setIsPlaying(false); audioRef.current?.pause(); } setGameState('answer'); }} style={{ flex: 1, padding: '1.2rem', borderRadius: '12px', border: '2px solid #fbbf24', color: '#fbbf24', background: 'transparent', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer' }}>
                                ⚔️ 提交解答，對決大師
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#0f172a', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '24px', border: '2px solid #fbbf24', animation: 'slideUp 0.4s ease' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fbbf24' }}>大師鑑定報告</h2>
                        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>來看看你的耳朵有多銳利！</p>

                        <CompareRow label="THRESHOLD (容忍度)" user={userSettings.threshold} target={targetSettings.threshold} unit="dB" color="#fbbf24" min={-60} max={0} />
                        <CompareRow label="RATIO (武器)" user={userSettings.ratio} target={targetSettings.ratio} unit=":1" color="#38bdf8" min={1} max={20} />
                        <CompareRow label="KNEE (脾氣)" user={userSettings.knee} target={targetSettings.knee} unit="" color="#ec4899" min={0} max={40} />
                        <CompareRow label="ATTACK (打擊感)" user={userSettings.attack} target={targetSettings.attack} unit="ms" color="#fca311" min={1} max={100} />
                        <CompareRow label="RELEASE (呼吸感)" user={userSettings.release} target={targetSettings.release} unit="ms" color="#a78bfa" min={10} max={1000} />

                        <button onClick={() => { setGameState('playing'); generateChallenge(); }} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', background: '#fbbf24', color: '#020617', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', marginTop: '1.5rem' }}>
                            🔥 挑戰下一回合
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}