"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 輔助函數：精準延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 🔥 狀態機升級：將所有流程整合，取代散落的 boolean
type Phase = 'listen' | 'diagnose' | 'fix' | 'contrast' | 'result';

// 🎓 知識錨點：建立修正與問題的強連結
const fixKnowledge: Record<string, { name: string, problem: string }> = {
    'fix1': { name: 'Kick/Bass Lock', problem: '低頻互相拉扯、產生漂浮虛弱感' },
    'fix2': { name: 'Humanize', problem: '節奏完全死板僵硬、像機器人' },
    'fix3': { name: 'Groove Push', problem: 'Hi-hat 力度平坦、失去前進推進力' }
};

export default function GrooveCorrectionLabPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // 遊戲狀態機
    const [phase, setPhase] = useState<Phase>('listen');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<'bad' | 'fixed'>('bad');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
    const [activeFix, setActiveFix] = useState<string | null>(null);

    const audioBadRef = useRef<HTMLAudioElement | null>(null);
    const audioFixedRef = useRef<HTMLAudioElement | null>(null);
    const isMounted = useRef(true);

    // 視窗偵測與音檔清理
    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        isMounted.current = true;
        return () => {
            isMounted.current = false;
            window.removeEventListener('resize', checkMobile);
            if (audioBadRef.current) { audioBadRef.current.pause(); audioBadRef.current.src = ""; }
            if (audioFixedRef.current) { audioFixedRef.current.pause(); audioFixedRef.current.src = ""; }
        };
    }, []);

    // 載入音檔並防範音量錯覺
    useEffect(() => {
        if (audioBadRef.current && audioFixedRef.current) {
            audioBadRef.current.volume = 0.8;
            audioFixedRef.current.volume = 0.8;
            audioBadRef.current.src = '/audio/groove/bad_groove.mp3';
            audioFixedRef.current.src = '/audio/groove/fixed_groove.mp3';
            audioBadRef.current.load();
            audioFixedRef.current.load();
        }
    }, []);

    // ⚙️ 音訊同步優化 (解決 Safari 與播放延遲不同步問題)
    const togglePlay = async () => {
        if (!audioBadRef.current || !audioFixedRef.current) return;
        if (isPlaying) {
            audioBadRef.current.pause();
            audioFixedRef.current.pause();
        } else {
            // 強制對齊時間軸
            audioFixedRef.current.currentTime = audioBadRef.current.currentTime;
            try {
                await Promise.all([
                    audioBadRef.current.play(),
                    audioFixedRef.current.play()
                ]);
            } catch (error) {
                console.error("Audio play failed:", error);
            }
        }
        setIsPlaying(!isPlaying);
    };

    const switchTrack = (track: 'bad' | 'fixed') => {
        if (!isMounted.current) return;
        setCurrentTrack(track);
        if (audioBadRef.current && audioFixedRef.current) {
            audioBadRef.current.muted = track !== 'bad';
            audioFixedRef.current.muted = track !== 'fixed';
        }
    };

    const handleDiagnose = (diagnosis: string) => {
        if (phase !== 'listen' && phase !== 'diagnose') return;
        setSelectedDiagnosis(diagnosis);
        setPhase('fix');
    };

    // 執行修正，觸發爆點對比
    const handleApplyFix = async (fixId: string) => {
        if (phase === 'contrast' || !isPlaying) return;
        setActiveFix(fixId);
        setPhase('contrast'); // 進入對比狀態

        // 💥 移除 overkill 的 date.now()，單純依賴 isMounted 檢查
        switchTrack('bad'); await delay(800); if (!isMounted.current) return;
        switchTrack('fixed'); await delay(800); if (!isMounted.current) return;
        switchTrack('bad'); await delay(800); if (!isMounted.current) return;
        switchTrack('fixed');

        setPhase('result');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '2rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>

            <audio ref={audioBadRef} loop muted={currentTrack !== 'bad'} />
            <audio ref={audioFixedRef} loop muted={currentTrack !== 'fixed'} />

            {/* 🧠 HEADER (認知重置) */}
            <header style={{ width: '100%', maxWidth: '700px', textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: '900', margin: '0 0 1rem 0', letterSpacing: '2px', color: '#f8fafc' }}>
                    GROOVE 修正實驗室
                </h1>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: isMobile ? '1rem' : '1.15rem' }}>
                        你現在不是在學理論。<br />
                        <strong style={{ color: '#fca311' }}>你是在「修一段壞掉的音樂」。</strong>
                    </p>
                </div>

                {/* 🎯 狀態導航 UI (主引導) */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: isMobile ? '0.85rem' : '1rem', fontWeight: 'bold' }}>
                    <span style={{ color: phase === 'listen' ? '#38bdf8' : '#64748b', transition: 'color 0.3s' }}>🎧 聆聽</span>
                    <span style={{ color: '#475569' }}>→</span>
                    <span style={{ color: (phase === 'diagnose' || phase === 'fix') && !activeFix ? '#fca311' : '#64748b', transition: 'color 0.3s' }}>🤔 診斷</span>
                    <span style={{ color: '#475569' }}>→</span>
                    <span style={{ color: (phase === 'contrast' || phase === 'result') ? '#10b981' : '#64748b', transition: 'color 0.3s' }}>🔧 修正</span>
                </div>
            </header>

            <div style={{ maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {/* 🎧 SECTION 1: 問題音 (核心刺激) */}
                <section style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center', position: 'relative' }}>
                    {phase === 'contrast' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px', zIndex: 0, animation: 'pulseBg 0.8s infinite alternate' }} />
                    )}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>這段 Groove 聽起來怪怪的...</h2>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
                            問題不是「不好聽」，而是<strong style={{ color: '#ef4444' }}>「失去推進力」</strong>。<br />
                            點擊播放，先聽聽看哪裡出了狀況。
                        </p>

                        <button onClick={togglePlay} style={{ background: isPlaying ? '#1e293b' : '#fff', color: isPlaying ? '#38bdf8' : '#000', border: isPlaying ? '1px solid #475569' : 'none', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(255,255,255,0.2)', marginBottom: '1.5rem', width: isMobile ? '100%' : 'auto' }}>
                            {isPlaying ? '🔁 音軌播放中' : '▶ 聽問題版本'}
                        </button>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => switchTrack('bad')} disabled={phase === 'contrast'} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: currentTrack === 'bad' ? '2px solid #ef4444' : '1px solid #334155', background: currentTrack === 'bad' ? 'rgba(239, 68, 68, 0.1)' : '#0f172a', color: currentTrack === 'bad' ? '#ef4444' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}>
                                ❌ 問題版 (Bad)
                            </button>
                            <button onClick={() => switchTrack('fixed')} disabled={phase !== 'result' && phase !== 'fix' && phase !== 'contrast'} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: currentTrack === 'fixed' ? '2px solid #10b981' : '1px solid #334155', background: currentTrack === 'fixed' ? 'rgba(16, 185, 129, 0.1)' : '#0f172a', color: currentTrack === 'fixed' ? '#10b981' : '#64748b', fontWeight: 'bold', cursor: phase === 'listen' || phase === 'diagnose' ? 'not-allowed' : 'pointer', opacity: phase === 'listen' || phase === 'diagnose' ? 0.5 : 1, transition: 'all 0.2s', flex: 1 }}>
                                {phase === 'listen' || phase === 'diagnose' ? '🔒 正常版 (未解鎖)' : '✅ 對照版 (Good)'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* 🧠 SECTION 2: 診斷選擇 */}
                {(phase === 'listen' || phase === 'diagnose') && (
                    <section style={{ animation: 'fadeInUp 0.5s', padding: '1rem 0' }}>
                        <h3 style={{ textAlign: 'center', fontSize: '1.3rem', color: '#fca311', marginBottom: '1.5rem', fontWeight: 'bold' }}>聽完了嗎？你覺得問題在哪？</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'A', text: 'Kick 跟 Bass 沒有鎖在一起 ' },
                                { id: 'B', text: '節奏太死，沒有 Human feel(人味) ' },
                                { id: 'C', text: 'Hi-hat 沒有推進感 ' }
                            ].map((opt) => (
                                <button key={opt.id} onClick={() => handleDiagnose(opt.id)} style={{ background: selectedDiagnosis === opt.id ? 'rgba(56, 189, 248, 0.1)' : '#1e293b', border: selectedDiagnosis === opt.id ? '1px solid #38bdf8' : '1px solid transparent', padding: '1.2rem', borderRadius: '16px', color: '#fff', fontSize: '1.1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: '1rem' }}>
                                    <span style={{ color: selectedDiagnosis === opt.id ? '#38bdf8' : '#64748b', fontWeight: 'bold' }}>{opt.id}.</span> {opt.text}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* 🔧 SECTION 3 & 4: 修正工具與即時對比 */}
                {(phase === 'fix' || phase === 'contrast' || phase === 'result') && (
                    <section style={{ animation: 'fadeInUp 0.5s' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ background: '#10b981', color: '#020617', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>TOOLS UNLOCKED</span>
                            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '1rem', fontWeight: 'bold' }}>現在，親手修復這段 Groove</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>點擊下方工具，套用修正並聽聽改變 (請確保播放中)</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'fix1', icon: '🥁', name: 'Fix 1: Kick/Bass Lock', desc: '鎖定 Kick + Bass', effect: '👉 低頻瞬間變穩' },
                                { id: 'fix2', icon: '🤖', name: 'Fix 2: Humanize', desc: '加入微時間偏移', effect: '👉 音樂開始「呼吸」' },
                                { id: 'fix3', icon: '🔥', name: 'Fix 3: Groove Push', desc: 'Hi-hat 加 Accent', effect: '👉 開始「往前走」' }
                            ].map((fix) => (
                                <button key={fix.id} onClick={() => handleApplyFix(fix.id)} disabled={phase === 'contrast' || !isPlaying || phase === 'result'} style={{ background: activeFix === fix.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.03)', border: activeFix === fix.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: (phase === 'contrast' || !isPlaying || phase === 'result') ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: (phase === 'contrast' || !isPlaying) && activeFix !== fix.id ? 0.5 : 1, textAlign: 'left' }}>
                                    <div style={{ fontSize: '2rem' }}>{fix.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: activeFix === fix.id ? '#fff' : '#e2e8f0', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{fix.name}</div>
                                        <div style={{ color: activeFix === fix.id ? 'rgba(255,255,255,0.8)' : '#94a3b8', fontSize: '0.9rem' }}>🔧 {fix.desc}</div>
                                    </div>
                                    <div style={{ color: activeFix === fix.id ? '#020617' : '#fca311', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                        {fix.effect}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* 🧨 爆點視覺提示 */}
                        {phase === 'contrast' && (
                            <div style={{ textAlign: 'center', marginTop: '2rem', animation: 'fadeIn 0.3s' }}>
                                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', animation: 'pulseText 0.8s infinite' }}>
                                    ✨ 正在套用修正... (Before ➔ After)
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '40px', alignItems: 'center' }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} style={{ width: '6px', background: '#38bdf8', borderRadius: '3px', animation: `wave 1s infinite alternate ${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* 🧠 SECTION 5 & 6: 認知重塑與下一章鉤子 */}
                {phase === 'result' && (
                    <section style={{ animation: 'fadeInUp 0.8s', marginTop: '2rem' }}>
                        <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #0f172a)', border: '1px solid #a78bfa', padding: '2.5rem 2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <h2 style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: '900', marginBottom: '1rem' }}>
                                👏 你剛剛修好了 Groove！
                            </h2>

                            {/* 🎓 強化記憶：錯誤對應關係 */}
                            {activeFix && fixKnowledge[activeFix] && (
                                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed #38bdf8', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>你剛剛套用的是：<strong style={{ color: '#fff' }}>{fixKnowledge[activeFix].name}</strong></div>
                                    <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 'bold' }}>
                                        成功解決了：{fixKnowledge[activeFix].problem}
                                    </div>
                                </div>
                            )}

                            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                發現了嗎？這不是在修音檔，<br />
                                <strong style={{ color: '#fca311' }}>這是在訓練你「耳朵的決策權」。</strong>
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'left' }}>
                                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Lv1：只會聽 (Consumer)</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Lv2：開始分辨 (Observer)</div>
                                <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 'bold', borderLeft: '3px solid #38bdf8', paddingLeft: '10px' }}>Lv3：可以修正 (👉 你現在在這)</div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center' }}>
                                <div style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}>NEXT STAGE</div>
                                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 'bold' }}>下一關：Voicing (聲音位置戰場)</h3>
                                <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
                                    當底盤 Groove 解決後，下一個最常讓作品毀滅的問題是：<br />
                                    <strong style={{ color: '#fff' }}>👉 「中高頻聲音放在哪裡，才不會打架？」</strong>
                                </p>

                                <button onClick={() => router.push('/courses/arrangement/voicing-intro')} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.4)' }}>
                                    🚀 進入 Voicing 實驗室 ➔
                                </button>
                            </div>
                        </div>
                    </section>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseBg { 0% { opacity: 0.3; } 100% { opacity: 0.8; } }
                @keyframes pulseText { 0% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } 100% { opacity: 0.6; transform: scale(0.98); } }
                @keyframes wave { 0% { height: 10px; } 100% { height: 40px; } }
            ` }} />
        </div>
    );
}