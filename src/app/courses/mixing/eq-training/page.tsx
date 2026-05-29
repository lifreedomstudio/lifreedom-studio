"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ----------------------------------------------------
// 🔊 核心升級 1：安全相容 Next.js 的 A/B Audio Hook
// ----------------------------------------------------
const useABAudio = () => {
    const audioA = useRef<HTMLAudioElement | null>(null);
    const audioB = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 在 Client 端才初始化，避免 SSR 報錯
        audioA.current = new Audio("/audio/mud_A_clean.mp3");
        audioB.current = new Audio("/audio/mud_B_muddy.mp3");

        if (audioA.current) audioA.current.loop = true;
        if (audioB.current) audioB.current.loop = true;

        return () => stopAll();
    }, []);

    const stopAll = () => {
        if (audioA.current) { audioA.current.pause(); audioA.current.currentTime = 0; }
        if (audioB.current) { audioB.current.pause(); audioB.current.currentTime = 0; }
    };

    const playA = () => { stopAll(); audioA.current?.play(); };
    const playB = () => { stopAll(); audioB.current?.play(); };

    return { playA, playB, stopAll };
};

// --- 原本的實驗室資料 ---
const TRACKS = {
    guitar: { id: 'guitar', name: '🎸 木吉他', file: '/audio/guitar-loop.mp3' },
    drum: { id: 'drum', name: '🥁 大鼓', file: '/audio/drum-loop.mp3' },
    vocal: { id: 'vocal', name: '🎤 主唱', file: '/audio/vocal-dry.mp3' }
};

const DICTIONARIES = {
    guitar: [
        { range: [20, 75], name: '50Hz：極低頻 (Sub Bass)', tags: ['地板震動 📳', '無謂能量 🗑️'], hint: '這段頻率通常只有震動，聽不到具體的音高。', theory: '【主委筆記：拿掉它就對了】\n對木吉他來說，這裡通常是冷氣或環境震動。建議用 High-pass Filter (HPF) 切掉，把地下室空間讓給大鼓和貝斯。' },
        { range: [76, 150], name: '100Hz：琴身低頻 (Boom)', tags: ['溫暖 ☕️', '轟轟聲 💣'], hint: '注意聽琴身共鳴最深沉的部位。', theory: '【主委筆記：溫暖還是轟炸？】\n琴身共鳴基音。保留會讓吉他很溫暖；但編制大時，這裡是第一個要被 Cut 的地方。' },
        { range: [151, 280], name: '200Hz：厚度與泥濘 (Warmth)', tags: ['厚實 🧱', '鼻音 👃'], hint: '試著注意聲音開始變得糊、像是有鼻音的地方。', theory: '【主委筆記：肉感的來源】\n給予吉他「肉感」。如果太單薄可稍加；但環境不好時，這裡最容易積聚糊糊髒髒的聲音。' },
        { range: [281, 560], name: '400Hz：紙箱悶音區 (Boxiness)', tags: ['紙箱味 📦', '悶悶的 🕳️'], hint: '聽起來像是在紙箱裡面彈吉他的聲音。', theory: '【主委筆記：傳說中的紙箱聲】\n適度挖空 (Cut) 這裡，是讓木吉他獲得現代流行樂「透明感」的魔法秘訣。' },
        { range: [561, 1100], name: '800Hz：廉價感與硬度', tags: ['便宜喇叭 📻', '塑膠味 🪣'], hint: '聽起來像便宜塑膠玩具或收音機發出的聲音。', theory: '【主委筆記：木頭變塑膠】\n太多會聽起來像便宜玩具。稍微 Cut 掉能有效提升音色的「高級感」。' },
        { range: [1101, 2200], name: '1.5kHz：鼻音與攻擊性', tags: ['電話聲 ☎️', '攻擊性 🤺'], hint: '注意刷扣時最有衝擊力、甚至有點刺耳的頻段。', theory: '【主委筆記：刷扣的衝擊力】\n用力刷扣的衝擊力就在這。太刺耳就挖掉一點；快被淹沒了就推高讓它跳出來。' },
        { range: [2201, 4500], name: '3kHz：穿透力與刺耳', tags: ['刺耳 🔪', '穿透力 💎'], hint: '人類耳朵最敏感的區域，推高會覺得非常刺耳。', theory: '【主委筆記：人類最敏感區域】\n耳朵對這極度敏感！推太多聽眾很快就會疲勞，需要小心處理。' },
        { range: [4501, 9000], name: '6kHz：清脆撥弦區', tags: ['清脆 ✨', '金屬弦 🎸'], hint: '專注聽金屬弦摩擦與 Pick 彈撥的高頻亮點。', theory: '【主委筆記：決定的亮點】\n這是鋼弦摩擦與 Pick 彈撥的聲音。想要清脆明亮的吉他，稍微 Boost 這裡！' },
        { range: [9001, 20000], name: '12kHz：空氣感 (Air)', tags: ['空氣感 🌬️', '昂貴感 💎'], hint: '非常高頻的嘶嘶聲，像呼吸一樣的質感。', theory: '【主委筆記：百萬錄音室秘密】\n提升這裡會讓聲音充滿呼吸感與細節，賦予吉他一種「昂貴」的質感。' }
    ],
    drum: [
        { range: [20, 60], name: '50Hz：超低頻下潛', tags: ['褲管震動 👖', '深沉 🌊'], hint: '感覺褲管震動，但音高不明顯的極低頻。', theory: '【主委筆記：舞池的靈魂】\n讓地板震動的頻率！EDM 必備；但流行搖滾推太多會變混濁且吃掉動態。' },
        { range: [61, 150], name: '100Hz：衝擊力 (Punch)', tags: ['拳拳到肉 🥊', '胸腔震擊 🫁'], hint: '大鼓打在胸口那種拳拳到肉的力量感。', theory: '【主委筆記：胸口碎大石】\n力量來源。Boost 會讓大鼓結實有力；注意不要跟貝斯 (Bass) 打架。' },
        { range: [151, 350], name: '250Hz：混濁泥濘區 (Mud)', tags: ['糊糊的 💩', '轟鳴 🌪️'], hint: '大鼓尾音轟轟作響，讓整個低頻變得混濁的區塊。', theory: '【主委筆記：大鼓清道夫】\n大鼓最容易聽起來「髒」的地方。專業混音師常做 Cut，讓貝斯有呼吸空間。' },
        { range: [351, 800], name: '500Hz：紙盒敲擊 (Cardboard)', tags: ['敲紙盒 📦', '塑膠桶 🪣'], hint: '聽起來像在敲塑膠桶或厚紙板的聲音。', theory: '【主委筆記：傳說中紙箱味】\n大膽挖空這裡吧，你會得到經典「微笑 EQ」大鼓聲，不再像在拍塑膠桶。' },
        { range: [801, 2500], name: '1.5kHz：籃球拍打聲', tags: ['拍皮球 🏀', '木頭敲擊 🪵'], hint: '像是在體育館拍籃球的空洞回音。', theory: '【主委筆記：尷尬中頻】\n通常沒什麼好處。大部分情況會避開這裡，把頻段讓給人聲與吉他。' },
        { range: [2501, 6000], name: '4kHz：鼓槌撞擊 (Click)', tags: ['噠噠聲 🥢', '穿透力 ⚡️'], hint: '鼓槌接觸鼓皮瞬間那聲「噠」的清脆聲。', theory: '【主委筆記：穿透混音關鍵】\n鼓槌撞擊鼓皮瞬間。金屬或現代搖滾 Boost 這裡能讓大鼓「穿透」厚重吉他牆。' },
        { range: [6001, 20000], name: '8kHz：銅鈸串音 (Bleed)', tags: ['嘶嘶聲 🐍', '串音 🎧'], hint: '幾乎沒有大鼓的聲音，只剩下背景的銅鈸嘶嘶聲。', theory: '【主委筆記：小心漏音】\n大鼓本身在這幾乎沒聲。Boost 通常只會放大背景銅鈸聲，有時建議直接切掉。' }
    ],
    vocal: [
        { range: [20, 80], name: '50Hz：噴麥噪音 (Plosives)', tags: ['蹦蹦聲 💥', '震動 🎤'], hint: '非常低沉的砰砰聲，通常伴隨 P 或 B 的發音。', theory: '【主委筆記：低頻殺手】\n人聲不會到這麼低！通常是發「P、B」子音時的噴麥聲。毫不猶豫地切掉它吧！' },
        { range: [81, 150], name: '120Hz：胸腔共鳴 (Chest)', tags: ['胸腔 🫁', '溫暖 ☕️'], hint: '男歌手聲音中最深厚、有磁性的底氣。', theory: '【主委筆記：男聲底氣】\n男聲磁性的來源。對女聲來說這裡偏低，太多反而會顯得沉重。' },
        { range: [151, 300], name: '250Hz：鼻音與泥濘 (Mud)', tags: ['鼻音 👃', '糊糊的 🌧️'], hint: '聽起來像是感冒鼻塞，或者蒙著被子唱歌。', theory: '【主委筆記：溫暖 vs 混濁】\n男聲易產生感冒鼻音需 Cut；但對偏尖的女聲，保留這裡能增加溫暖度。' },
        { range: [301, 800], name: '500Hz：廉價麥克風味', tags: ['電話聲 ☎️', '紙筒聲 🧻'], hint: '聲音變得很窄，像透過塑膠水管或電話傳出來。', theory: '【主委筆記：塑膠感】\n太多會像用便宜麥克風在唱歌。稍微挖空能讓人聲立刻變得自然、昂貴。' },
        { range: [801, 2000], name: '1.5kHz：咬字清晰度', tags: ['捏鼻子 🤏', '清晰 📢'], hint: '決定字字句句能不能被聽清楚的關鍵區域。', theory: '【主委筆記：存在感】\n掌管咬字清晰。密集的配器中 Boost 能殺出重圍；但在抒情歌中太多會很刺。' },
        { range: [2001, 5000], name: '3.5kHz：穿透與貼近', tags: ['貼近感 💋', '穿透 💎'], hint: '最容易讓耳朵感到刺痛的高亢頻段。', theory: '【主委筆記：警報區】\n適當提升會有貼在耳邊唱的親密感；但也是最容易讓聽眾耳朵痛的區域。' },
        { range: [5001, 9000], name: '7kHz：唇齒音 (Sibilance)', tags: ['嘶嘶聲 🐍', '氣音 💨'], hint: '發出「斯、疵、ㄘ」等音時特別刺耳的部分。', theory: '【主委筆記：齒音戰場】\n「斯、疵」等摩擦音。太多會極度不適（尤其戴耳機），需用 De-esser 壓制。' },
        { range: [9001, 20000], name: '12kHz：空氣感與光澤', tags: ['空氣感 🌬️', '光澤 🌟'], hint: '充滿仙氣、像在耳邊吹氣的高級質感。', theory: '【主委筆記：公關行銷部】\n想讓女聲有「天使光環」？推高這裡吧！它能賦予人聲高貴的呼吸感與細節。' }
    ]
};

const EqSvgCard = ({ type, color }: { type: 'filters' | 'subtractive' | 'sweeping' | 'complementary', color: string }) => {
    const renderSvg = () => {
        switch (type) {
            case 'filters':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 20,130 C 40,130 50,50 80,50 L 100,50" fill="none" stroke="#ef4444" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }} />
                        <text x="50" y="30" fill="#ef4444" fontSize="14" fontWeight="bold">HPF</text>
                        <path d="M 120,90 C 140,90 150,30 160,30 C 170,30 180,90 200,90" fill="none" stroke="#10b981" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 6px #10b981)' }} />
                        <text x="145" y="15" fill="#10b981" fontSize="14" fontWeight="bold">Bell</text>
                        <path d="M 220,90 L 250,90 C 270,90 270,40 290,40 L 320,40" fill="none" stroke="#f59e0b" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
                        <text x="255" y="25" fill="#f59e0b" fontSize="14" fontWeight="bold">Shelf</text>
                        <path d="M 340,50 L 360,50 C 380,50 380,130 400,130" fill="none" stroke="#38bdf8" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }} />
                        <text x="355" y="30" fill="#38bdf8" fontSize="14" fontWeight="bold">LPF</text>
                    </svg>
                );
            case 'subtractive':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0,140 C 60,140 80,75 150,75 L 400,75" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                        <path d="M 0,75 L 150,75 C 80,75 60,140 0,140 Z" fill="rgba(239, 68, 68, 0.3)" />
                        <text x="30" y="100" fill="#fca5a5" fontSize="16" fontWeight="bold">CUT</text>
                    </svg>
                );
            case 'sweeping':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0,100 L 150,100 C 170,100 190,20 200,20 C 210,20 230,100 250,100 L 400,100" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                        <circle cx="200" cy="20" r="8" fill="#fff" />
                        <text x="220" y="35" fill="#fff" fontSize="16" fontWeight="bold">+15dB</text>
                    </svg>
                );
            case 'complementary':
                return (
                    <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                        <path d="M 0,75 L 120,75 C 160,75 180,20 200,20 C 220,20 240,75 280,75 L 400,75" fill="none" stroke="#10b981" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                        <path d="M 0,75 L 120,75 C 160,75 180,130 200,130 C 220,130 240,75 280,75 L 400,75" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5,5" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    </svg>
                );
        }
    };

    return (
        <div style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', marginBottom: '15px', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>{renderSvg()}</div>
        </div>
    );
};

// ----------------------------------------------------
// 🧠 主元件：整合探索實驗室與 A/B 盲聽任務
// ----------------------------------------------------
function EQTrainingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mission = searchParams.get('mission');
    const [isMobile, setIsMobile] = useState(false);

    // 🎧 A/B 任務狀態
    const [playingAB, setPlayingAB] = useState<"A" | "B" | null>(null);
    const { playA, playB, stopAll } = useABAudio();
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    // 🎛️ 探索模式狀態
    const [activeTrack, setActiveTrack] = useState<'guitar' | 'drum' | 'vocal'>('guitar');
    const [sliderValue, setSliderValue] = useState(420);
    const [isPlayingManual, setIsPlayingManual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [eqMode, setEqMode] = useState<'boost' | 'cut' | 'flat'>('boost');

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    const minFreq = 20;
    const maxFreq = 20000;
    const minLog = Math.log10(minFreq);
    const maxLog = Math.log10(maxFreq);
    const frequency = Math.round(Math.pow(10, minLog + ((maxLog - minLog) * (sliderValue / 1000))));

    const currentDictionary = DICTIONARIES[activeTrack];
    const currentZone = currentDictionary.find(z => frequency >= z.range[0] && frequency <= z.range[1]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => { window.removeEventListener('resize', checkMobile); stopAll(); };
    }, []);

    const loadAudio = async (trackId: 'guitar' | 'drum' | 'vocal') => {
        if (isPlayingManual) { sourceRef.current?.stop(); setIsPlayingManual(false); }
        setIsLoading(true);
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        try {
            const response = await fetch(TRACKS[trackId].file);
            if (!response.ok) throw new Error('音檔路徑錯誤');
            const arrayBuffer = await response.arrayBuffer();
            bufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    useEffect(() => { loadAudio(activeTrack); }, [activeTrack]);

    useEffect(() => {
        if (!filterRef.current || !audioCtxRef.current) return;
        filterRef.current.frequency.setTargetAtTime(frequency, audioCtxRef.current.currentTime, 0.05);

        if (eqMode === 'boost') {
            filterRef.current.gain.setTargetAtTime(15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(6.0, audioCtxRef.current.currentTime, 0.1);
        } else if (eqMode === 'cut') {
            filterRef.current.gain.setTargetAtTime(-15, audioCtxRef.current.currentTime, 0.1);
            filterRef.current.Q.setTargetAtTime(3.0, audioCtxRef.current.currentTime, 0.1);
        } else {
            filterRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        }
    }, [frequency, eqMode]);

    const togglePlayManual = async () => {
        if (!audioCtxRef.current || !bufferRef.current) return;
        if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();

        if (isPlayingManual) {
            sourceRef.current?.stop();
            setIsPlayingManual(false);
        } else {
            const ctx = audioCtxRef.current;
            sourceRef.current = ctx.createBufferSource();
            sourceRef.current.buffer = bufferRef.current;
            sourceRef.current.loop = true;

            filterRef.current = ctx.createBiquadFilter();
            filterRef.current.type = 'peaking';
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = eqMode === 'cut' ? 3.0 : 6.0;
            filterRef.current.gain.value = eqMode === 'flat' ? 0 : (eqMode === 'boost' ? 15 : -15);

            sourceRef.current.connect(filterRef.current);
            filterRef.current.connect(ctx.destination);
            sourceRef.current.start();
            setIsPlayingManual(true);
        }
    };

    // 🎮 A/B 控制邏輯
    const handlePlayAB = (type: "A" | "B") => {
        if (isPlayingManual) togglePlayManual(); // 先關掉探索模式的聲音
        setPlayingAB(type);
        if (type === "A") playA();
        if (type === "B") playB();
    };

    const generateFeedback = (correct: boolean, currentAttempts: number) => {
        if (correct && currentAttempts === 1) return "🔥 太準了，你已經有職業級耳朵了！";
        if (correct) return "✅ 有進步，你開始抓到 mud 的位置了！";
        return "👂 再試一次，注意聽音檔低中頻「轟轟糊糊」的堆積感。";
    };

    const submitAnswer = (answer: string) => {
        const correctAnswer = "B"; // 假設 B 比較 Muddy
        const isCorrect = answer === correctAnswer;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        const msg = generateFeedback(isCorrect, newAttempts);
        setFeedback(msg);

        if (isCorrect) {
            stopAll();
            setPlayingAB(null);

            const stored = localStorage.getItem('mix_progress');
            let progress = stored ? JSON.parse(stored) : {};
            if (mission) {
                progress[mission] = { ...progress[mission], unlocked: true, progress: 100, attempts: newAttempts };
                localStorage.setItem('mix_progress', JSON.stringify(progress));
            }

            setTimeout(() => setShowSuccess(true), 800);
        }
    };

    const mapFreqToX = (f: number) => ((Math.log10(f) - minLog) / (maxLog - minLog)) * 1000;
    const peakX = mapFreqToX(frequency);
    const gainOffset = eqMode === 'boost' ? -100 : (eqMode === 'cut' ? 80 : 0);
    const qWidth = eqMode === 'cut' ? 120 : 60;

    const eqPath = eqMode === 'flat'
        ? `M 0,150 L 1000,150`
        : `M 0,150 L ${peakX - qWidth},150 C ${peakX - qWidth / 2},150 ${peakX - 10},${150 + gainOffset} ${peakX},${150 + gainOffset} C ${peakX + 10},${150 + gainOffset} ${peakX + qWidth / 2},150 ${peakX + qWidth},150 L 1000,150`;

    const themeColor = eqMode === 'cut' ? '#ef4444' : (eqMode === 'boost' ? '#10b981' : '#64748b');

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: isMobile ? '1.5rem 1rem' : '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* --- 🎮 任務模式：如果從圖鑑點過來就顯示 --- */}
                {mission === "mud_250hz" ? (
                    <div style={{ background: 'linear-gradient(145deg, #1e1b4b, #312e81)', padding: isMobile ? '2rem 1.5rem' : '3rem', borderRadius: '24px', border: '2px solid #4f46e5', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)', textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '1rem', marginBottom: '10px', letterSpacing: '2px' }}>
                            🧠 訓練目標：學會「用耳朵找到問題頻率」
                        </div>
                        <h2 style={{ color: '#e0e7ff', fontSize: '2rem', margin: '0 0 20px 0' }}>🎯 找出混濁 (Mud)</h2>
                        <p style={{ color: '#a5b4fc', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            請戴上耳機！這兩段音軌中，有一段的 250Hz 附近嚴重堆積。<br />聽聽看哪一段比較「轟鳴、混濁、像在紙箱裡」？
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                            <button onClick={() => handlePlayAB("A")} style={{ flex: 1, minWidth: '150px', padding: '20px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', border: playingAB === "A" ? '2px solid #10b981' : '2px solid #6366f1', background: playingAB === "A" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: playingAB === "A" ? '#10b981' : '#fff', boxShadow: playingAB === "A" ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none' }}>
                                {playingAB === "A" ? '🔊 播放中 (A)' : '▶ 試聽 A'}
                            </button>
                            <button onClick={() => handlePlayAB("B")} style={{ flex: 1, minWidth: '150px', padding: '20px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', border: playingAB === "B" ? '2px solid #10b981' : '2px solid #6366f1', background: playingAB === "B" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: playingAB === "B" ? '#10b981' : '#fff', boxShadow: playingAB === "B" ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none' }}>
                                {playingAB === "B" ? '🔊 播放中 (B)' : '▶ 試聽 B'}
                            </button>
                        </div>

                        <p style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: '15px' }}>👇 誰是造成 Mud 的兇手？</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                            <button onClick={() => submitAnswer("A")} style={{ padding: '12px 40px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4338ca'} onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}>選 A</button>
                            <button onClick={() => submitAnswer("B")} style={{ padding: '12px 40px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4338ca'} onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}>選 B</button>
                        </div>

                        {feedback && (
                            <div className="feedback-box" style={{ padding: '15px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', color: feedback.includes('🔥') || feedback.includes('✅') ? '#6ee7b7' : '#fca5a5', fontWeight: 'bold', fontSize: '1.1rem', animation: 'fadeIn 0.4s ease' }}>
                                {feedback}
                            </div>
                        )}
                    </div>
                ) : (
                    // --- 📖 理論與原本的解說區塊 (只有在探索模式才顯示) ---
                    <>
                        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <div style={{ display: 'inline-block', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                                PHASE 02 : THE FREQUENCY MANAGER
                            </div>
                            <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '900', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                EQ 頻率管理學
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                                歡迎來到社區管委會！在這裡我們不調音量，我們調的是「特徵」。<br />
                                先搞懂大師的手法，再進入下方的實驗室訓練你的耳朵。
                            </p>
                        </header>

                        <section style={{ marginBottom: '5rem' }}>
                            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '2rem', borderLeft: '6px solid #10b981', paddingLeft: '15px' }}>
                                1. 混音師的溝通語言
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', padding: '25px', borderRadius: '20px' }}>
                                    <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', margin: '0 0 10px 0' }}>頻率 (Frequency) / Hz</h3>
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>聲音的高度。數字越小越低沉，數字越大越尖銳。這就是我們在頻譜上鎖定的「目標樓層」。</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', padding: '25px', borderRadius: '20px' }}>
                                    <h3 style={{ color: '#10b981', fontSize: '1.4rem', margin: '0 0 10px 0' }}>增益 (Gain) / dB</h3>
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>對該頻率進行的操作。往上拉叫 <strong>Boost (放大)</strong>；往下拉叫 <strong>Cut (挖空/衰減)</strong>。</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', padding: '25px', borderRadius: '20px', gridColumn: isMobile ? '1' : '1 / 3' }}>
                                    <h3 style={{ color: '#f59e0b', fontSize: '1.4rem', margin: '0 0 10px 0' }}>頻寬 (Q Value / Resonance)</h3>
                                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginTop: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>🗡️ 高 Q 值 (High Q) = 窄頻寬</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>像一把手術刀。用來精準切除特定頻率的雜音，不影響旁邊的好聲音。</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>🖌️ 低 Q 值 (Low Q) = 寬頻寬</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>像一把大水彩筆。用來大範圍地改變音色，聽起來非常自然。</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', padding: '25px', borderRadius: '20px', gridColumn: isMobile ? '1' : '1 / 3' }}>
                                    <h3 style={{ color: '#a855f7', fontSize: '1.4rem', margin: '0 0 15px 0' }}>濾波器種類 (Filter Types)</h3>
                                    <EqSvgCard type="filters" color="#a855f7" />
                                    <ul style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <li><strong>HPF (高通濾波器)：</strong> 一刀切掉指定頻率「以下」的所有聲音。用來清除低頻底噪。</li>
                                        <li><strong>LPF (低通濾波器)：</strong> 一刀切掉指定頻率「以上」的所有聲音。用來消除數位毛刺感。</li>
                                        <li><strong>Bell (鐘型)：</strong> 最常見的形狀，針對特定頻段進行凸起 (Boost) 或凹陷 (Cut)。</li>
                                        <li><strong>Shelf (擱架型)：</strong> 像樓梯一樣，將某個頻率之後的聲音「整體」抬高或降低（常見於高音提亮）。</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section style={{ marginBottom: '5rem' }}>
                            <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))', padding: isMobile ? '2rem' : '3.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                                <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                                    核心理論：頻率遮蔽效應 (Masking Effect)
                                </h2>
                                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', textAlign: 'justify' }}>
                                    為什麼你錄的木吉他和人聲單獨聽都很好聽，但放在一起播放時，卻覺得糊成一團、誰都聽不清？這就是遇到了<strong>「頻率遮蔽」</strong>。
                                </p>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '0 12px 12px 0' }}>
                                    <p style={{ color: '#f8fafc', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
                                        <strong>🎵 聲學物理現象：</strong> 當兩個樂器（例如木吉他與男主唱）的聲音都大量集中在 <strong>300Hz - 800Hz</strong> 這個中頻區間時，音量較大、或頻率較寬的那個，會「吃掉（掩蓋）」另一個樂器的細節。<br /><br />
                                        這也是為什麼前面說 EQ 像大廈主委——你必須強制規定：「吉他，你把 500Hz 讓出來給主唱，你去負責 3kHz 的清脆感！」這就叫做<strong>頻率分工</strong>。
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section style={{ marginBottom: '6rem' }}>
                            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#fff', marginBottom: '2rem', borderLeft: '6px solid #facc15', paddingLeft: '15px' }}>
                                3. 混音師的實戰 S.O.P
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ color: '#ef4444', fontSize: '1.2rem', margin: '0 0 15px 0' }}>✂️ Step 1: 減法優先</h3>
                                    <EqSvgCard type="subtractive" color="#ef4444" />
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem', marginTop: '15px' }}>
                                        新手最愛 Boost，但大師永遠先 Cut。推高會吃掉 Headroom。第一步永遠是掛上 HPF，把除了大鼓與貝斯之外的所有樂器，100Hz 以下的底噪切乾淨！
                                    </p>
                                </div>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 15px 0' }}>🔍 Step 2: 掃頻抓蟲法</h3>
                                    <EqSvgCard type="sweeping" color="#38bdf8" />
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem', marginTop: '15px' }}>
                                        1. 將 Q 值調窄 (High Q)<br />2. 將 Gain 暴力推高 (+15dB)<br />3. 左右拖曳滑桿尋找極度刺耳的聲音 (抓蟲)<br />4. 找到後反向拉低 (-6dB) 殺掉蟲子。
                                    </p>
                                </div>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ color: '#10b981', fontSize: '1.2rem', margin: '0 0 15px 0' }}>🧩 Step 3: 互補 EQ</h3>
                                    <EqSvgCard type="complementary" color="#10b981" />
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.9rem', marginTop: '15px' }}>
                                        解決遮蔽的高級技巧。大鼓 60Hz 推高 3dB，貝斯 60Hz 就挖空 3dB。像拼圖一樣，一凸一凹，聲音就會完美融合。
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* 🎛️ 共同的實驗室主體 */}
                <h2 id="lab" style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
                    👇 立刻進入聽覺實驗室 👇
                </h2>
                <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', padding: isMobile ? '1.5rem' : '3rem', borderRadius: '32px', border: '1px solid #1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                    {/* 任務感 UI */}
                    {!mission && (
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', padding: '15px 20px', borderRadius: '0 12px 12px 0', marginBottom: '25px' }}>
                            <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1rem', marginBottom: '5px' }}>🎧 試試看（探索任務）：</div>
                            <ul style={{ color: '#bae6fd', fontSize: '0.95rem', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                                <li>點擊「放大特徵」，找出主唱最<strong>刺耳</strong>的頻率在哪裡。</li>
                                <li>點擊「挖空差異」，聽聽看吉他的<strong>溫暖度</strong>會不會消失。</li>
                            </ul>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {Object.values(TRACKS).map(track => (
                            <button
                                key={track.id} onClick={() => setActiveTrack(track.id as any)}
                                style={{ padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem', background: activeTrack === track.id ? '#10b981' : 'rgba(255,255,255,0.05)', color: activeTrack === track.id ? '#020617' : '#94a3b8', border: `1px solid ${activeTrack === track.id ? '#10b981' : '#334155'}`, boxShadow: activeTrack === track.id ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none' }}
                            >
                                {track.name}
                            </button>
                        ))}
                    </div>

                    <div style={{ width: '100%', height: isMobile ? '200px' : '280px', background: '#020617', borderRadius: '20px', border: '2px solid #1e293b', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                            {[50, 100, 500, 1000, 5000, 10000].map(f => (
                                <div key={f} style={{ position: 'absolute', left: `${mapFreqToX(f) / 10}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255, 255, 255, 0.05)' }}>
                                    <span style={{ position: 'absolute', bottom: '10px', left: '6px', color: '#475569', fontSize: '0.75rem', fontWeight: 'bold' }}>{f >= 1000 ? `${f / 1000}k` : f}Hz</span>
                                </div>
                            ))}
                            <div style={{ position: 'absolute', top: '150px', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.2)' }}></div>
                        </div>

                        <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.3))' }}>
                            <path d={eqPath} fill="none" stroke={themeColor} strokeWidth="5" style={{ transition: 'all 0.1s ease' }} />
                            {eqMode !== 'flat' && (
                                <g style={{ transition: 'all 0.1s ease' }}>
                                    <circle cx={peakX} cy={150 + gainOffset} r="10" fill={themeColor} />
                                    <circle cx={peakX} cy={150 + gainOffset} r="4" fill="#020617" />
                                </g>
                            )}
                        </svg>

                        <div style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '2rem', fontWeight: '900', color: themeColor, fontFamily: 'monospace', textShadow: `0 0 20px ${themeColor}80` }}>
                            {frequency} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Hz</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', marginBottom: '2rem' }}>
                        <button onClick={togglePlayManual} disabled={isLoading} style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: isPlayingManual ? '#ef4444' : '#10b981', color: '#fff', boxShadow: isPlayingManual ? '0 0 30px rgba(239,68,68,0.4)' : '0 10px 30px rgba(16,185,129,0.3)' }}>
                            {isLoading ? '⏳ 載入音檔中...' : isPlayingManual ? '⏹️ 停止掃頻' : '▶️ 開始監聽'}
                        </button>

                        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '6px', flex: 1.5, border: '1px solid #1e293b' }}>
                            <button onClick={() => setEqMode('flat')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'flat' ? '#334155' : 'transparent', color: eqMode === 'flat' ? '#fff' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Bypass (原聲)</button>
                            <button onClick={() => setEqMode('boost')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'boost' ? 'rgba(16,185,129,0.2)' : 'transparent', color: eqMode === 'boost' ? '#10b981' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔼 放大特徵 (抓蟲)</button>
                            <button onClick={() => setEqMode('cut')} style={{ flex: 1, padding: '10px', border: 'none', background: eqMode === 'cut' ? 'rgba(239,68,68,0.2)' : 'transparent', color: eqMode === 'cut' ? '#ef4444' : '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🔽 挖空差異 (殺蟲)</button>
                        </div>
                    </div>

                    <div style={{ background: '#020617', padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>
                        <p style={{ color: '#94a3b8', margin: '0 0 15px 0', fontSize: '0.9rem', textAlign: 'center' }}>左右拖曳滑桿，進行 Frequency Sweeping (頻率掃描)</p>
                        <input type="range" min="0" max="1000" value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: themeColor }} />
                    </div>

                    <div style={{ minHeight: '220px' }}>
                        {currentZone && (
                            <div style={{ animation: 'fadeIn 0.4s ease', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px dashed #334155' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>{currentZone.name}</h3>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {currentZone.tags.map(tag => (
                                            <span key={tag} style={{ background: themeColor, color: eqMode === 'cut' ? '#fff' : '#020617', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ borderLeft: `4px solid ${themeColor}`, paddingLeft: '1.5rem' }}>
                                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>{currentZone.theory}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🎉 成功回饋 Modal */}
                {showSuccess && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div className="success-modal" style={{ background: 'linear-gradient(145deg, #022c22, #064e3b)', border: '2px solid #10b981', padding: '3rem 4rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🔥</div>
                            <h2 style={{ color: '#6ee7b7', fontSize: '2.5rem', margin: '0 0 10px 0' }}>能力解鎖！</h2>
                            <p style={{ color: '#a7f3d0', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                恭喜！你現在能精準分辨 250Hz 的 Mud。<br />
                                <span style={{ fontSize: '1rem', color: '#10b981' }}>(本次通關共嘗試了 {attempts} 次)</span>
                            </p>
                            <button onClick={() => router.push('/collection')} style={{ padding: '15px 40px', background: '#10b981', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.5)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                回到訓練地圖 ➔
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .success-modal { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
        </div>
    );
}

export default function EQTrainingPage() {
    return (
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>載入中...</div>}>
            <EQTrainingContent />
        </Suspense>
    );
}