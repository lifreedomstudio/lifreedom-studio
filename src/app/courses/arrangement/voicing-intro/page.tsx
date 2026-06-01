"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FrequencyShiftPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // Mini 互動的狀態
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            minHeight: '100vh', background: '#020617', color: '#f8fafc',
            padding: isMobile ? '2rem 1rem' : '4rem 2rem',
            fontFamily: 'sans-serif', overflowX: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                {/* 🎉 SECTION 1: 成就結算 (強化版) */}
                <section style={{ textAlign: 'center', animation: 'fadeInDown 0.8s ease-out' }}>
                    <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>
                        SYSTEM STATUS: STABILIZED
                    </div>

                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#10b981', textShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
                        MISSION COMPLETE<br />
                        <span style={{ color: '#fff', fontSize: isMobile ? '1.5rem' : '2rem' }}>GROOVE REPAIR</span>
                    </h1>

                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        你剛剛修好的不是「音樂」，<br />
                        而是 <strong style={{ color: '#10b981' }}>👉 節奏不會再互相撞車的能力</strong>。
                    </p>

                    {/* 頻譜穩定動畫 */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', gap: '6px', marginBottom: '2.5rem' }}>
                        {[...Array(15)].map((_, i) => (
                            <div key={i} style={{
                                width: '8px', background: 'linear-gradient(180deg, #34d399, #10b981)', borderRadius: '4px',
                                animation: `stabilizeWave 2s ease-in-out forwards ${i * 0.1}s`
                            }} />
                        ))}
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                        <div style={{ color: '#86efac', fontWeight: 'bold', display: 'flex', gap: '10px' }}><span>✅</span> Kick & Bass Lock：完成</div>
                        <div style={{ color: '#86efac', fontWeight: 'bold', display: 'flex', gap: '10px' }}><span>✅</span> Human Feel 修正：完成</div>
                        <div style={{ color: '#86efac', fontWeight: 'bold', display: 'flex', gap: '10px' }}><span>✅</span> Groove 推進力：恢復</div>
                    </div>

                    {/* ⚡ 新增認知打擊句 */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        borderLeft: '4px solid #ef4444',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        margin: '2rem auto 0 auto',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: 0, color: '#fca5a5', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            ❌ 但先記住一件事：<br />
                            Groove 解決的，只是「大家什麼時候出聲」。<br />
                            <strong style={{ color: '#fff' }}>
                                但真正讓音樂變糊的，是「大家站在哪裡」。
                            </strong>
                        </p>
                    </div>
                </section>

                {/* 🧠 SECTION 2: 認知崩壞 (升級版) */}
                <section style={{ animation: 'fadeIn 1s ease-out 1s both' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>

                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#fca311', marginBottom: '1.5rem', fontWeight: '900' }}>
                            你以為你修完 Groove 了，<br />
                            但你只是「讓交通變順」而已。
                        </h2>

                        <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                            Groove 解決的是<strong style={{ color: '#ef4444' }}>「時間問題」</strong>。<br />
                            但音樂真正開始變糊的地方，是——<br /><br />

                            <strong style={{ color: '#38bdf8', fontSize: '1.4rem' }}>
                                「所有聲音都在同一個空間打架」
                            </strong>
                            <br /><br />

                            想像一下：<br />
                            木吉他、電吉他、鋼琴、合成器全部都在 C3 用力彈。<br />
                            <strong style={{ color: '#fff' }}>
                                這不是編曲，這是聲音車禍現場。
                            </strong>
                        </p>

                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', alignItems: 'stretch' }}>
                            <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ color: '#fca5a5', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '10px' }}>HORIZONTAL (水平)</div>
                                <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>⏱️ 時間軸</div>
                                <div style={{ color: '#cbd5e1' }}>Kick + Bass 何時發聲<br />(Groove 思維)</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold' }}>
                                VS
                            </div>

                            <div style={{ flex: 1, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 0 30px rgba(56, 189, 248, 0.2)' }}>
                                <div style={{ color: '#bae6fd', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '10px' }}>VERTICAL (垂直)</div>
                                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🏢 空間區塊</div>
                                <div style={{ color: '#cbd5e1' }}>吉他與鋼琴站在哪裡<br />(Voicing 思維)</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🧭 SECTION 3: 世界切換動畫 (強化) */}
                <section style={{ textAlign: 'center', padding: '2rem 0', position: 'relative' }}>
                    <div style={{ color: '#a78bfa', fontSize: '1.2rem', fontWeight: '900', letterSpacing: '6px', marginBottom: '1rem', animation: 'glitch 2s infinite' }}>
                        SYSTEM SHIFTING...
                    </div>
                    <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', color: '#fff', fontWeight: '900', margin: '0 0 2rem 0', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>
                        NEW DIMENSION UNLOCKED
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', lineHeight: '1.8' }}>
                        在 Groove 的世界裡，你在修「時間」。<br />
                        在 Voicing 的世界裡，你開始管理——<br /><br />

                        <strong style={{ color: '#a78bfa', fontSize: '1.5rem' }}>
                            「誰可以待在哪個頻率空間」
                        </strong>
                        <br /><br />

                        一旦你理解這件事，<br />
                        你就再也回不去「只調音量」的混音方式。
                    </p>
                </section>

                {/* 🧪 SECTION 4: Mini 互動 (升級版) */}
                <section style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', textAlign: 'center' }}>
                    <h3 style={{ color: '#fca311', fontSize: '1.3rem', marginBottom: '1.5rem' }}>🤔 製作人測驗：切換你的大腦</h3>

                    <p style={{ color: '#f8fafc', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        如果現在三個樂器都在中頻同時演奏，你會怎麼處理？
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        <button
                            onClick={() => setSelectedAnswer('A')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedAnswer === 'A' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedAnswer === 'A' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            A：全部一起彈
                        </button>
                        <button
                            onClick={() => setSelectedAnswer('B')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedAnswer === 'B' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedAnswer === 'B' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            B：錯開時間
                        </button>
                        <button
                            onClick={() => setSelectedAnswer('C')}
                            style={{ padding: '1.2rem', borderRadius: '12px', background: selectedAnswer === 'C' ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.03)', border: selectedAnswer === 'C' ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            C：錯開「音高區域與位置」
                        </button>
                    </div>

                    {selectedAnswer && (
                        <div style={{ marginTop: '2rem', animation: 'fadeInUp 0.3s' }}>
                            {selectedAnswer === 'C' ? (
                                <div style={{ color: '#a78bfa', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    🎯 正確。你已經開始進入「空間編曲」思維。
                                    A：全部一起彈 (結果：聲音糊成一團)
                                    B：錯開時間 (Groove 思維)
                                    C：錯開「音高區域與位置」 (Voicing 思維)
                                </div>
                            ) : (
                                <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    還停留在「時間控制」。真正的關鍵是空間分配。
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 🚪 SECTION 5: CTA (最重要升級) */}
                <section style={{ textAlign: 'center', paddingBottom: '4rem', marginTop: '2rem' }}>

                    {/* ⚡ 不可逆門檻 */}
                    <div style={{
                        background: 'rgba(167, 139, 250, 0.05)',
                        borderLeft: '4px solid #a78bfa',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        textAlign: 'left',
                        display: 'inline-block'
                    }}>
                        <p style={{ color: '#cbd5e1', margin: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>
                            🎧 如果你還覺得混音是「誰比較大聲」的問題，<br />
                            那你在下一關會開始理解：<br />
                            <strong style={{ color: '#fff' }}>
                                音樂其實是「誰站在哪裡說話」的設計問題。
                            </strong>
                        </p>
                    </div>

                    <div style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>
                        WELCOME TO
                    </div>
                    <h2 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: '900', color: '#fff', margin: '0 0 1.5rem 0' }}>
                        VOICING LAB
                    </h2>

                    <button
                        onClick={() => router.push('/courses/arrangement/voicing-training')}
                        disabled={!selectedAnswer}
                        style={{
                            background: selectedAnswer ? 'linear-gradient(135deg, #a78bfa, #7c3aed)' : '#1e293b',
                            color: selectedAnswer ? '#fff' : '#64748b',
                            border: 'none', padding: isMobile ? '1.2rem 1.5rem' : '1.5rem 4rem',
                            fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: '900',
                            borderRadius: '50px', cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                            boxShadow: selectedAnswer ? '0 10px 30px rgba(124, 58, 237, 0.4)' : 'none',
                            transition: 'all 0.3s', width: isMobile ? '100%' : 'auto', marginTop: '1rem'
                        }}
                    >
                        {selectedAnswer ? '🚀 進入 Voicing 空間戰場 ➔' : '🔒 請先完成製作人思維測驗'}
                    </button>
                </section>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes stabilizeWave {
                    0% { height: 10px; transform: scaleY(3); }
                    70% { height: 40px; transform: scaleY(0.5); }
                    100% { height: 20px; transform: scaleY(1); background: #10b981; }
                }
                @keyframes glitch {
                    0% { opacity: 1; transform: translateX(0); }
                    5% { opacity: 0.8; transform: translateX(-2px); }
                    10% { opacity: 1; transform: translateX(2px); }
                    15% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 1; transform: translateX(0); }
                }
            ` }} />
        </div>
    );
}