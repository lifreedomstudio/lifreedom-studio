"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ArrangementIntro() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-gray-100 font-sans selection:bg-orange-500/30">
            {/* 背景裝飾光暈 */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">

                {/* --- Header 區塊 --- */}
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-500 text-xs font-bold tracking-[0.2em] uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        Arrangement Stage
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500">
                            編曲學：
                        </span>
                        <br className="md:hidden" />
                        從 0 到 1 的劇本設計
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        在動手錄音之前，你必須先給樂團一份好劇本。編曲決定了這首歌的靈魂、情緒起伏，以及誰是真正的主角。
                    </p>
                </header>

                {/* --- 核心觀念：電影比喻 --- */}
                <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">🎬</div>
                                    <h2 className="text-3xl font-bold text-white">如果這首歌是一部電影...</h2>
                                </div>
                                <div className="space-y-4 text-gray-300 text-lg">
                                    <p>
                                        編曲就像是「選角」與「執導」。如果同時特寫蜘蛛人、美國隊長、雷神索爾及鋼鐵人每個英雄的動作畫面，觀眾會感到混亂，無法好好去感受每個角色；正如太多樂器同時擠在中頻，聽眾會覺得混濁。
                                    </p>
                                    <p className="p-4 bg-orange-500/5 border-l-4 border-orange-500 rounded-r-xl italic">
                                        「好的編曲決定了誰是當下的英雄，誰該退居幕後。一個亂疊樂器的編曲，再神級的混音師也救不回來。」
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 gap-4">
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <h4 className="text-orange-400 font-bold mb-1">📝 決定類型</h4>
                                    <p className="text-sm text-gray-400">浪漫愛情片還是動作爽片？決定曲風與節奏速度。</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <h4 className="text-yellow-400 font-bold mb-1">🎸 角色分配</h4>
                                    <p className="text-sm text-gray-400">該用溫暖的木吉他，還是具備侵略性的合成器？</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <h4 className="text-white font-bold mb-1">🎢 劇情轉折</h4>
                                    <p className="text-sm text-gray-400">運用 Reverse FX 與 Build-up 巧思，引爆副歌能量。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 四大里程碑 --- */}
                <section className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white">🗺️ 編曲破關路線圖</h2>
                            <p className="text-gray-400 mt-2 text-lg">四大核心關卡，帶你從地基蓋到雲端。</p>
                        </div>
                        <div className="text-orange-500/50 font-mono text-sm tracking-widest uppercase">Phase 01 / 04</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* 卡片 1 */}
                        <div className="group relative p-8 rounded-3xl bg-gray-900 border border-white/10 hover:border-orange-500/50 transition-all duration-500">
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🥁</div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">1. Groove (節奏骨架)</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                音樂的地基。搞懂 Kick 與 Bass 的鎖定關係，建立歌曲的「脈搏」與呼吸感。
                            </p>
                            <div className="h-1 w-0 group-hover:w-full bg-orange-500 transition-all duration-700 rounded-full" />
                        </div>

                        {/* 卡片 2 */}
                        <div className="group relative p-8 rounded-3xl bg-gray-900 border border-white/10 hover:border-yellow-500/50 transition-all duration-500">
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🎹</div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">2. Voicing (把位與音區)</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                中頻生存指南。解決吉他與鋼琴同時擠在一起打架的問題，學會完美錯開物理空間。
                            </p>
                            <div className="h-1 w-0 group-hover:w-full bg-yellow-500 transition-all duration-700 rounded-full" />
                        </div>

                        {/* 卡片 3 */}
                        <div className="group relative p-8 rounded-3xl bg-gray-900 border border-white/10 hover:border-green-500/50 transition-all duration-500">
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🛡️</div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">3. Masking (頻率遮蔽預防)</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                在編曲階段就搞定混音。學會不彈奏的「留白藝術」，為每個聲音留出專屬窗口。
                            </p>
                            <div className="h-1 w-0 group-hover:w-full bg-green-500 transition-all duration-700 rounded-full" />
                        </div>

                        {/* 卡片 4 */}
                        <div className="group relative p-8 rounded-3xl bg-gray-900 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🎢</div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">4. Dynamics (動態與曲式)</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                情緒的過山車。運用 Reverse、濾波器掃描與加減法，讓副歌能量瞬間引爆。
                            </p>
                            <div className="h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-700 rounded-full" />
                        </div>
                    </div>
                </section>

                {/* --- 下一關 CTA --- */}
                <section className="pt-12 text-center">
                    <button
                        onClick={() => router.push('/courses/groove-training')}
                        className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-6 px-12 rounded-full text-xl shadow-[0_10px_40px_rgba(249,115,22,0.3)] transition-all transform hover:scale-105 active:scale-95"
                    >
                        進入 1. Groove (節奏骨架)
                        <span className="text-2xl group-hover:translate-x-2 transition-transform">➔</span>
                    </button>
                    <p className="mt-8 text-gray-500 font-mono text-xs tracking-widest uppercase">
                        LIFREEDOM STUDIO | ACADEMY SYSTEM
                    </p>
                </section>

            </div>
        </div>
    );
}