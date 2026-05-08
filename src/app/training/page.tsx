"use client";
import { useState } from 'react';
import Link from 'next/link';

// 💡 這裡載入你之前做好的兩大高級道場組件
// (請確認這兩個檔案是否與 page.tsx 放在同一個資料夾，如果放在 components 資料夾，請修改路徑)
import EQTrainingRoom from '../courses/EQTrainingRoom';
import CompressorTrainingRoom from '../courses/CompressorTrainingRoom';

export default function TrainingHubPage() {
    // 狀態管理：目前選擇進入哪個道場 (預設為大廳選單 'menu')
    const [activeRoom, setActiveRoom] = useState<'menu' | 'eq' | 'compressor'>('menu');

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* 🔝 頂部導航 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <span style={{ color: '#ea580c', fontWeight: 'bold', letterSpacing: '4px', fontSize: '0.9rem' }}>TRAINING DOJO</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#fff' }}>聽覺試煉大廳</h1>
                        <p style={{ color: '#64748b', margin: 0 }}>選擇你要鍛鍊的聽覺肌肉。累積經驗值解鎖傳說級卡片。</p>
                    </div>
                    <Link href="/courses" style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textDecoration: 'none', color: '#e2e8f0', border: '1px solid #1e293b', fontWeight: 'bold', transition: 'all 0.2s' }}>
                        ⬅️ 返回建築所大廳
                    </Link>
                </div>

                {/* ⛩️ 動態切換顯示內容 */}

                {/* 狀態一：大廳選單 */}
                {activeRoom === 'menu' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                        {/* EQ 道場入口 */}
                        <div
                            onClick={() => setActiveRoom('eq')}
                            style={{
                                background: 'linear-gradient(145deg, #1e293b, #0f172a)', padding: '3rem 2rem', borderRadius: '24px',
                                border: '2px solid #38bdf8', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s',
                                boxShadow: '0 10px 30px rgba(56, 189, 248, 0.1)', textAlign: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(56, 189, 248, 0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(56, 189, 248, 0.1)'; }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎛️</div>
                            <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '1rem' }}>頻率獵人：EQ 盲測</h2>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>利用 Web Audio 模擬真實頻段提升。訓練你在極短時間內聽出打架的頻率位置。</p>
                            <div style={{ marginTop: '2rem', padding: '0.8rem', background: '#38bdf8', color: '#000', borderRadius: '50px', fontWeight: 'bold' }}>進入道場</div>
                        </div>

                        {/* Compressor 道場入口 */}
                        <div
                            onClick={() => setActiveRoom('compressor')}
                            style={{
                                background: 'linear-gradient(145deg, #1e293b, #0f172a)', padding: '3rem 2rem', borderRadius: '24px',
                                border: '2px solid #a78bfa', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s',
                                boxShadow: '0 10px 30px rgba(167, 139, 250, 0.1)', textAlign: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(167, 139, 250, 0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(167, 139, 250, 0.1)'; }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗜️</div>
                            <h2 style={{ fontSize: '1.8rem', color: '#a78bfa', marginBottom: '1rem' }}>動態掌控：壓縮器實戰</h2>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>視覺化 Gain Reduction。親手轉動 Ratio 與 Release，學會控制聲音的打擊感與尾音。</p>
                            <div style={{ marginTop: '2rem', padding: '0.8rem', background: '#a78bfa', color: '#000', borderRadius: '50px', fontWeight: 'bold' }}>進入道場</div>
                        </div>

                    </div>
                )}

                {/* 狀態二：EQ 訓練室 */}
                {activeRoom === 'eq' && (
                    <div>
                        <button onClick={() => setActiveRoom('menu')} style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem' }}>
                            🔙 回到試煉大廳
                        </button>
                        {/* 載入你原本寫好的神級 EQ 組件 */}
                        <EQTrainingRoom />
                    </div>
                )}

                {/* 狀態三：Compressor 訓練室 */}
                {activeRoom === 'compressor' && (
                    <div>
                        <button onClick={() => setActiveRoom('menu')} style={{ background: 'transparent', color: '#a78bfa', border: '1px solid #a78bfa', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem' }}>
                            🔙 回到試煉大廳
                        </button>
                        {/* 載入你原本寫好的神級 Compressor 組件 */}
                        <CompressorTrainingRoom />
                    </div>
                )}

            </div>
        </div>
    );
}