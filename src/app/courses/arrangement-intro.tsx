import React from 'react';

export default function ArrangementIntro() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header 區塊 */}
                <header className="text-center space-y-4">
                    <div className="inline-block bg-orange-900/30 text-orange-400 px-4 py-1 rounded-full text-sm font-semibold tracking-wider mb-2 border border-orange-800/50">
                        ARRANGEMENT STAGE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 pb-2">
                        🎹 編曲學：從 0 到 1 的劇本與選角
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        在進入混音之前，你必須先給樂團一份好劇本。編曲決定了這首歌的靈魂、情緒起伏，以及誰是真正的主角。
                    </p>
                </header>

                {/* 觀念建立區塊 */}
                <section className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">🎬</span>
                        <h2 className="text-2xl font-bold text-white">如果這首歌是一部電影...</h2>
                    </div>

                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>
                            很多人以為把所有好聽的樂器全部疊在一起，歌就會好聽。但這就像一部電影裡，如果蜘蛛人、鋼鐵人、蝙蝠俠同時在畫面上大吼大叫，觀眾只會覺得頭很痛。
                        </p>
                        <div className="bg-gray-900/50 p-6 rounded-xl border-l-4 border-orange-500">
                            <ul className="space-y-3">
                                <li><strong className="text-orange-400">📝 決定曲風與節奏：</strong> 就像是寫劇本，這是一部浪漫愛情片還是動作爽片？</li>
                                <li><strong className="text-yellow-400">🎸 選擇樂器 (選角)：</strong> 該用溫暖的木吉他，還是侵略性極強的合成器？</li>
                                <li><strong className="text-white">📈 安排情緒起伏：</strong> 什麼時候該安靜只留人聲？什麼時候大鼓跟貝斯要一起炸出來帶動高潮？</li>
                            </ul>
                        </div>
                        <p className="text-sm text-gray-400 italic mt-4">
                            💡 記住：一個好的編曲，會讓後面的「混音」工作變得超級輕鬆；反之，再神級的混音師，也救不了一首樂器全部擠在一起打架的編曲。
                        </p>
                    </div>
                </section>

                {/* 課程關卡列表 */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 border-b border-gray-700 pb-2">
                        🗺️ 編曲破關路線圖
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* 卡片 1 */}
                        <div className="group bg-gradient-to-b from-gray-800 to-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.1)]">
                            <div className="text-4xl mb-4">🥁</div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                1. Groove (節奏骨架)
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                讓歌曲有呼吸感。搞懂大鼓與 Bass 的鎖定關係，建立讓聽眾想跟著點頭的基底。
                            </p>
                            <span className="text-orange-500 font-semibold text-sm">進入關卡 ➔</span>
                        </div>

                        {/* 卡片 2 */}
                        <div className="group bg-gradient-to-b from-gray-800 to-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(234,179,8,0.1)]">
                            <div className="text-4xl mb-4">🎹</div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                                2. Voicing (把位與音區)
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                中頻樂器生存指南！解決吉他、鋼琴同時擠在一起打架的問題，學會完美錯開空間。
                            </p>
                            <span className="text-yellow-500 font-semibold text-sm">進入關卡 ➔</span>
                        </div>

                        {/* 卡片 3 */}
                        <div className="group bg-gradient-to-b from-gray-800 to-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(34,197,94,0.1)]">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                                3. Frequency Masking (頻率遮蔽預防)
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                在編曲階段就搞定混音。知道為什麼不要讓兩個樂器彈一模一樣的音域，學會留白。
                            </p>
                            <span className="text-green-500 font-semibold text-sm">進入關卡 ➔</span>
                        </div>

                        {/* 卡片 4 */}
                        <div className="group bg-gradient-to-b from-gray-800 to-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(59,130,246,0.1)]">
                            <div className="text-4xl mb-4">🎢</div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                4. Dynamics (動態與曲式結構)
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                打造情緒的過山車。運用樂器的加減法創造歌曲張力，讓副歌炸得痛快。
                            </p>
                            <span className="text-blue-500 font-semibold text-sm">進入關卡 ➔</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}