import React, { useState, useRef, useEffect } from 'react';

// --- 🎧 A/B 試聽播放器元件 ---
interface AudioComparerProps {
    title: string;
    description: string;
    drySrc: string;
    wetSrc: string;
    wetLabel: string;
}

const AudioComparer: React.FC<AudioComparerProps> = ({ title, description, drySrc, wetSrc, wetLabel }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWet, setIsWet] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 切換乾濕音時，保持播放進度
    useEffect(() => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const wasPlaying = !audioRef.current.paused;

            audioRef.current.src = isWet ? wetSrc : drySrc;
            audioRef.current.currentTime = currentTime;

            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Play interrupted:", e));
            }
        }
    }, [isWet, drySrc, wetSrc]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 my-4 shadow-lg">
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-gray-300 mb-4 text-sm">{description}</p>

            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="bg-blue-600 hover:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <div className="flex bg-gray-900 rounded-lg p-1">
                    <button
                        onClick={() => setIsWet(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isWet ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Dry (乾音)
                    </button>
                    <button
                        onClick={() => setIsWet(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isWet ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        {wetLabel}
                    </button>
                </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};


// --- 📖 課程主頁面元件 ---
export default function ReverbTrainingRoom() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        📖 【殘響尾巴的解剖學】
                    </h1>
                    <p className="text-lg text-gray-400">
                        一個完美的 Reverb 其實是由「三個時間段」組成的，搞懂它們，你就能精準捏出想要的空間感。
                    </p>
                </header>

                {/* Section 1: Pre-delay */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-300 border-b border-gray-700 pb-2">
                        1. Pre-delay (預延遲) ＝ 聲音撞到第一面牆之前的「飛行時間」
                    </h2>
                    <p className="text-gray-300">
                        <strong className="text-white">這是什麼：</strong> 歌手發聲後，到你聽見「第一聲回音」之間的時間差。
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/50">
                        <p className="font-semibold text-blue-200">🔥 實戰怎麼調：</p>
                        <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                            <li>主唱想要大空間，但聲音要貼耳？ ➡️ <span className="text-white">調大 Pre-delay (約 20-40ms)</span>。讓乾淨人聲先出來，殘響才跟上，確保咬字不被吃掉。</li>
                            <li>想把樂器推到最深處 (如背景 Pad)？ ➡️ <span className="text-white">調小 Pre-delay (0-5ms)</span>。聲音瞬間被殘響包覆，聽起來就會退到後方。</li>
                        </ul>
                    </div>
                    <AudioComparer
                        title="🎧 人聲實測：大空間但保持貼耳"
                        description="聽聽看加了 30ms Pre-delay 的殘響，人聲是不是依然清晰，但背後多了一層空間包覆？"
                        drySrc="/audio/vocal-dry.mp3"
                        wetSrc="/audio/vocal-wet-predelay.mp3" /* 需從 Logic 匯出此音檔 */
                        wetLabel="Wet (大空間 + 30ms 預延遲)"
                    />
                </section>

                {/* Section 2: Early Reflection */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-300 border-b border-gray-700 pb-2">
                        2. Early Reflection (早期反射) ＝ 房間形狀的「身分證」
                    </h2>
                    <p className="text-gray-300">
                        <strong className="text-white">這是什麼：</strong> 聲音撞到最近的幾面牆後，最先彈回來的清晰回音，決定了這是「木頭房」還是「浴室」。
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/50">
                        <p className="font-semibold text-blue-200">🔥 實戰怎麼調：</p>
                        <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                            <li>鼓組想要真實空間感又不能拖泥帶水？ ➡️ <span className="text-white">拉高 Early Reflection，關小後面的 Tail</span>。創造真實「小空間厚度」且絕不渾濁。</li>
                        </ul>
                    </div>
                    <AudioComparer
                        title="🎧 鼓組實測：Punch 有力的小房間"
                        description="注意聽小鼓，只有早反射沒有長尾音，鼓聲變肥了但完全不會糊！"
                        drySrc="/audio/drum-loop.mp3"
                        wetSrc="/audio/drum-wet-earlyref.mp3" /* 需從 Logic 匯出此音檔 */
                        wetLabel="Wet (高早反射 + 零尾音)"
                    />
                </section>

                {/* Section 3: Reverb Tail / Decay */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-300 border-b border-gray-700 pb-2">
                        3. Reverb Tail / Decay (殘響尾音) ＝ 空間的「容積與浪漫」
                    </h2>
                    <p className="text-gray-300">
                        <strong className="text-white">這是什麼：</strong> 聲音在空間中無數次反彈，最後融合成逐漸衰減的綿密音牆。
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/50">
                        <p className="font-semibold text-blue-200">🔥 實戰怎麼調：</p>
                        <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                            <li>快節奏流行/搖滾？ ➡️ <span className="text-white">縮短 Tail (約 0.8s-1.5s)</span>，才不會干擾下一個節拍。</li>
                            <li>空靈抒情、木吉他 Solo？ ➡️ <span className="text-white">拉長 Tail (2.5s-4s+)</span>，創造漂浮在雲端的夢幻感。</li>
                        </ul>
                    </div>
                    <AudioComparer
                        title="🎧 木吉他實測：空靈長尾音"
                        description="比較乾音刷弦與長達 3 秒的夢幻殘響尾巴，感受空間的容積變化。"
                        drySrc="/audio/guitar-loop.mp3"
                        wetSrc="/audio/guitar-wet-longtail.mp3" /* 需從 Logic 匯出此音檔 */
                        wetLabel="Wet (長尾音 3.5s)"
                    />
                </section>

                {/* Section 4: Dry/Wet 業界標準 */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-purple-400 border-b border-gray-700 pb-2">
                        🎛️ 【Dry/Wet (乾濕比) 的業界標準做法】
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* 新手作法卡片 */}
                        <div className="bg-red-900/10 p-6 rounded-xl border border-red-800/30">
                            <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-3">
                                <span>❌</span> 新手作法 (Insert)
                            </h3>
                            <p className="text-gray-300 mb-2">直接把 Reverb 掛在「主唱音軌」上，Dry/Wet 轉到 15%。</p>
                            <div className="text-sm text-red-300/80 mt-4">
                                <strong>缺點：</strong> 佔用 CPU，且殘響與人聲糊在一起，無法單獨處理殘響。
                            </div>
                        </div>

                        {/* 業界標準卡片 */}
                        <div className="bg-green-900/10 p-6 rounded-xl border border-green-800/30">
                            <h3 className="text-xl font-bold text-green-400 flex items-center gap-2 mb-3">
                                <span>✅</span> 業界標準 (Send / Aux Return)
                            </h3>
                            <ul className="text-gray-300 list-decimal list-inside space-y-2 mb-2">
                                <li>開啟全新輔助音軌 (Aux/Bus)，掛上 Reverb，並將 Dry/Wet 轉到 100% 破表 (全濕)。</li>
                                <li>從主唱/樂器音軌，拉「發送量 (Send)」到這條 Reverb 音軌。</li>
                            </ul>
                            <div className="text-sm text-green-300/80 mt-4">
                                <strong>優點：</strong> 就像蓋了一間「殘響專屬房間」，把主唱、木吉他、小鼓都發送進去，創造完美的空間黏合度 (Glue)。你還能單獨對這房間做 Low Cut (低頻切除)——這就是大名鼎鼎的 Abbey Road 秘技，保證混音不渾濁！
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Damping / Color */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-purple-400 border-b border-gray-700 pb-2">
                        🧠 【看懂 Damping / Color (空間裝潢材質)】
                    </h2>
                    <p className="text-gray-300">
                        如果你看到「High-Frequency Damping (高頻阻尼)」或「Color (空間色彩)」不知所措，其實它只代表一件事：房間裡的裝潢材質。
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-bold text-yellow-500 mb-2">高阻尼 (掛滿厚窗簾、鋪地毯)</h4>
                            <p className="text-sm text-gray-400">高頻被吸收，殘響聽起來「暗、溫暖、復古」，適合不搶戲的背景樂器。</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-bold text-cyan-400 mb-2">低阻尼 (空蕩蕩的混凝土大教堂)</h4>
                            <p className="text-sm text-gray-400">高頻一直彈射，殘響聽起來「亮、清脆、現代」，適合點綴空靈主唱或木吉他。</p>
                        </div>
                    </div>
                </section>

                {/* Section 6: CTA */}
                <section className="pt-8 text-center">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">🚀 想使用 Reverb 卻不知道該怎麼調嗎？</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            別讓複雜的參數卡住你的靈感！快打開 「AI 混音助理」，只要告訴它你的樂器和想要的感覺，助理會立刻為你算出最完美的設定值！
                        </p>
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all transform hover:scale-105">
                            👉 點擊進入混音助理診斷室
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}