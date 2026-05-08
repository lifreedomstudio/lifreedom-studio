"use client";
import { useState } from 'react';
import Link from 'next/link';

// 🎓 混音大師綜合實戰題庫 (10 題完全體)
const MASTER_QUIZ = [
    {
        id: 1, topic: "頻率遮蔽與避讓 (Level 1 EQ)",
        question: "【實戰】你發現木吉他與主唱在 500Hz 附近『打架』了，導致聲音聽起來很混濁 (Muddy)。最專業的操作是？",
        options: ["把主唱音量推到最大", "在木吉他軌的 500Hz 處做一個 Notch Cut", "同時推高兩者的 500Hz", "在總線掛上 Limiter"],
        answer: 1, feedback: "🎯 沒錯！混音是『減法的藝術』，為主音頻譜騰出空間才是上策。"
    },
    {
        id: 2, topic: "動態控制與 Punch (Level 1 Comp)",
        question: "【實戰】你想讓小鼓更有『Punch (打擊感)』，但目前的壓縮器讓小鼓聽起來悶悶的。該如何修正？",
        options: ["縮短 Attack 時間", "增加 Ratio 比例", "拉長 Attack 時間", "直接關掉壓縮器"],
        answer: 2, feedback: "🎯 正確！拉長 Attack 能保留聲音開頭的瞬態 (Transient)，這就是擊穿力的來源。"
    },
    {
        id: 3, topic: "相位關係 (Phase)",
        question: "【實戰】你錄製鼓組時使用了兩支麥克風收小鼓（上皮與下皮），混合後發現聲音變得非常薄、低頻消失。這最可能是什麼問題？",
        options: ["麥克風壞了", "相位抵銷 (Phase Cancellation)", "錄音室底噪太大", "小鼓皮太鬆"],
        answer: 1, feedback: "🎯 沒錯！這時只要按下一個『相位反轉 (Phase Flip)』鈕，低頻就會瞬間炸出來了。"
    },
    {
        id: 4, topic: "飽和度與諧波 (Harmonics)",
        question: "【實戰】你覺得數位錄音的人聲太『乾扁、冰冷』，想增加一點暖意與厚度，你會優先使用哪種效果？",
        options: ["強力的 Reverb", "Saturation (飽和度) 或 Analog 模擬插件", "極高的 High Pass Filter", "Noise Gate"],
        answer: 1, feedback: "🎯 正確！諧波 (Harmonics) 產生的微量失真會為數位聲音加上類比設備特有的溫暖感。"
    },
    {
        id: 5, topic: "壓縮器學派 (VCA vs Opto)",
        question: "【實戰】你正準備幫整個 Drum Bus 做『Glue (黏合)』處理，需要極度精準、透明且快速的反應。你會挑選哪種壓縮器模型？",
        options: ["Opto (例如 LA-2A)", "Tube (真空管型)", "VCA (例如 SSL Bus Comp)", "這題無解"],
        answer: 2, feedback: "🎯 賓果！VCA 以精準透明著稱，是總線黏合處理的標準配置。"
    },
    {
        id: 6, topic: "錄音訊號源 (Inst vs Line)",
        question: "【實戰】你拿著導線準備直接錄製電吉他，錄音介面上有個按鈕寫著『Hi-Z』或『Inst』。你應該？",
        options: ["一定要按下去，因為電吉他是高阻抗訊號", "不能按，那是給麥克風用的", "隨便，沒差", "按了會導致電腦燒毀"],
        answer: 0, feedback: "🎯 正確！電吉他訊號弱且阻抗高，必須透過 Hi-Z (Instrument) 電路才能完整捕捉頻率。"
    },
    {
        id: 7, topic: "低頻避讓 (Sidechain)",
        question: "【實戰】大鼓 (Kick) 與 Bass 打架打得不可開交。你決定使用 Sidechain，請問觸發端 (Input) 應該是誰？",
        options: ["用 Bass 觸發 Kick 的壓縮", "用 Kick 觸發 Bass 的壓縮", "用主唱觸發兩者的壓縮", "用 Reverb 觸發"],
        answer: 1, feedback: "🎯 正確！讓 Kick 打下去的瞬間 Bass 讓路，低頻才會拳拳到肉。"
    },
    {
        id: 8, topic: "空間深度 (Delay/Reverb)",
        question: "【實戰】你想要增加人聲的寬度，但不想讓它聽起來像在山洞裡唱歌。你會選用？",
        options: ["將 Reverb Time 設為 5 秒", "使用 Ping Pong Delay 搭配濾波器處理回音", "把 High Cut 切到 500Hz", "關掉所有效果"],
        answer: 1, feedback: "🎯 正確！Delay 比 Reverb 更乾淨，能提供空間感卻不佔據頻譜。"
    },
    {
        id: 9, topic: "數位音訊理論 (Dither)",
        question: "【實戰】你的專案是以 32-bit 製作，現在要輸出成 16-bit 的 CD 格式。在導出的最後一關，你必須掛上什麼？",
        options: ["Limiter", "Dither (抖動)", "Gain Staging", "De-esser"],
        answer: 1, feedback: "🎯 專業！Dither 能防止位元深度轉換時產生的截斷失真 (Quantization Error)。"
    },
    {
        id: 10, topic: "增益架構 (Gain Staging)",
        question: "【實戰】你的總線 (Master) 已經紅燈了，最專業的做法是？",
        options: ["直接拉低 Master 推桿", "回到每一軌調整 Gain，確保留有 -6dB Headroom", "不管它，紅燈比較好聽", "加一個 Distortion 插件"],
        answer: 1, feedback: "🎯 正確！Headroom 是母帶處理的命脈，絕不能在混音階段就爆掉。"
    }
];

export default function CertificationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionClick = (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
        if (idx === MASTER_QUIZ[currentStep].answer) {
            setScore(prev => prev + 10); // 10 題，每題 10 分
        }
    };

    const nextQuestion = () => {
        setSelected(null);
        setShowResult(false);
        setCurrentStep(prev => prev + 1);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '4rem 2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {currentStep < MASTER_QUIZ.length ? (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#38bdf8' }}>
                                <span>混音戰力評測中...</span>
                                <span>{currentStep + 1} / {MASTER_QUIZ.length}</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px' }}>
                                <div style={{ width: `${((currentStep + 1) / MASTER_QUIZ.length) * 100}%`, height: '100%', background: '#38bdf8', transition: 'width 0.3s ease', boxShadow: '0 0 10px #38bdf8' }}></div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(30,41,59,0.5)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <span style={{ background: '#1e3a8a', color: '#93c5fd', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{MASTER_QUIZ[currentStep].topic}</span>
                            <h2 style={{ fontSize: '1.8rem', lineHeight: '1.4', margin: '1.5rem 0 2.5rem 0', fontWeight: 'bold' }}>{MASTER_QUIZ[currentStep].question}</h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {MASTER_QUIZ[currentStep].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionClick(i)}
                                        style={{
                                            textAlign: 'left', padding: '1.5rem', borderRadius: '16px', border: '1px solid',
                                            borderColor: showResult ? (i === MASTER_QUIZ[currentStep].answer ? '#10b981' : i === selected ? '#ef4444' : '#334155') : '#334155',
                                            background: showResult ? (i === MASTER_QUIZ[currentStep].answer ? 'rgba(16, 185, 129, 0.1)' : i === selected ? 'rgba(239, 68, 68, 0.1)' : '#0f172a') : '#0f172a',
                                            color: '#fff', cursor: showResult ? 'default' : 'pointer', transition: 'all 0.2s', fontSize: '1.1rem'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {showResult && (
                                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#1e293b', borderRadius: '16px', borderLeft: '6px solid #fbbf24' }}>
                                    <p style={{ margin: 0, color: '#fcd34d', fontWeight: 'bold', marginBottom: '8px' }}>💡 專業教官評析：</p>
                                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.6' }}>{MASTER_QUIZ[currentStep].feedback}</p>
                                    <button onClick={nextQuestion} style={{ marginTop: '1.5rem', padding: '12px 32px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                                        {currentStep === MASTER_QUIZ.length - 1 ? '查看認證結果' : '下一題 ➡️'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', background: 'rgba(30,41,59,0.8)', padding: '5rem 2rem', borderRadius: '32px', border: '2px solid #38bdf8', boxShadow: '0 0 50px rgba(56, 189, 248, 0.2)' }}>
                        <h1 style={{ fontSize: '5rem', margin: 0 }}>{score >= 80 ? '🏆' : '🎓'}</h1>
                        <h2 style={{ fontSize: '3rem', margin: '1rem 0', color: '#fff' }}>認證得分：{score}</h2>
                        <p style={{ fontSize: '1.3rem', color: '#94a3b8', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
                            {score === 100 ? '完美！你已經掌握了 Lifreedom Studio 的核心心法，具備成為大師的潛力！' :
                                score >= 60 ? '表現優秀！你對混音流程已有清晰認知，多去聽覺道場實踐吧。' :
                                    '還差一點點！建議再回魔導書翻閱「混音神技」分類。'}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link href="/courses" style={{ padding: '1rem 2.5rem', background: '#38bdf8', color: '#000', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>返回學院大廳</Link>
                            <button onClick={() => window.location.reload()} style={{ padding: '1rem 2.5rem', background: 'transparent', color: '#38bdf8', borderRadius: '50px', border: '1px solid #38bdf8', fontWeight: 'bold', cursor: 'pointer' }}>再挑戰一次</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}