"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 🚀 一、核心設計：模式與精準的狀態機定義
type Mode = "free" | "guided";
type GuidedStep = "ask_instrument" | "ask_role" | "ask_problem" | "upload_eq" | "analyzing" | "show_tasks" | "done";

interface MixContext {
  instrument: string | null;
  role: string | null;
  problem: string | null;
}

interface GuidedState {
  step: GuidedStep;
  context: MixContext;
  completedTasks: string[];
}

interface AiData {
  problems: string[];
  tasks: string[];
  check: string;
  recommended_card?: string;
}

const MAGIC_CARDS = [
  { id: 'pingpong', name: '空間撕裂者 · 乒乓延遲', type: '傳說魔法', stars: 3, condition: '當人聲與伴奏黏在一起時可發動。', params: 'Time: 1/4 | Feedback: 25% | High-Pass: 300Hz', flavor: '「讓聲音在左右聲道瘋狂橫跳，創造極致寬廣的異次元空間。」' },
  { id: 'compressor', name: '重力束縛 · 爸爸壓縮器', type: '實戰魔法', stars: 2, condition: '當訊號超過忍耐極限 (Threshold) 時發動。', params: 'Ratio: 4:1 | Attack: 30ms | Release: Auto', flavor: '「這是老爸最後的慈悲，讓你的音量乖乖聽話，否則皮帶候教。」' },
  { id: 'parallel', name: '幻影分身 · 平行壓縮', type: '傳說魔法', stars: 3, condition: '當鼓組聽起來軟弱無力時發動。', params: 'Mix: 30-50% | Ratio: 10:1 (Heavy) | Makeup: +4dB', flavor: '「召喚一個充滿力量的影子分身，與原聲融合，創造拳拳到肉的撞擊感。」' },
  { id: 'ms_eq', name: '維度切割 · M/S 等化器', type: '史詩魔法', stars: 3, condition: '當混音中間太擠、兩旁太空時發動。', params: 'Side: High Shelf +2dB | Mid: Low Cut 100Hz', flavor: '「切開聲音的維度，將亮麗留給兩旁，將力道留給中間。」' },
  { id: 'deesser', name: '蛇語者 · 齒音獵人', type: '實戰魔法', stars: 2, condition: '當歌手的『嘶』聲刺耳如蛇鳴時發動。', params: 'Freq: 5-8kHz | Range: -4dB | Threshold: 恰到好處', flavor: '「在不經意間，溫柔地按住那些尖銳的齒音。」' }
];

const INSTRUMENT_OPTIONS = [
  { label: "🎤 人聲 (Vocal)", value: "vocal" },
  { label: "🎸 吉他 (Guitar)", value: "guitar" },
  { label: "🥁 鼓組 (Drums)", value: "drums" },
  { label: "🎸 貝斯 (Bass)", value: "bass" },
  { label: "🎹 合成器 (Synth)", value: "synth" },
  { label: "其他", value: "other" }
];

const ROLE_OPTIONS = [
  { label: "👑 絕對主角 (Lead)", value: "lead" },
  { label: "🧱 節奏與支撐 (Rhythm / Pad)", value: "support" },
  { label: "✨ 穿插點綴 (FX / Fill)", value: "fx" }
];

const PROBLEM_OPTIONS = [
  { label: "太悶 / 糊", value: "muddy" },
  { label: "太刺 / 尖銳", value: "harsh" },
  { label: "太薄 / 沒力", value: "thin" },
  { label: "完全沒存在感", value: "hidden" },
  { label: "不知道，就是怪", value: "unknown" }
];

const issueMap: Record<string, string> = {
  muddy: "頻率重疊與低頻淤積",
  harsh: "中高頻衝突或過度突出",
  thin: "低頻不足或動態不佳",
  hidden: "整體頻率被遮蔽",
  unknown: "整體頻率分佈不均"
};

const buildGuidedPrompt = (context: MixContext) => `
你是一位「混音教練」，不是分析師。
目標：讓新手「動手調整」，而不是只看說明。

目前資訊：
- 樂器：${context.instrument}
- 角色：${context.role}
- 核心問題：${context.problem}

⚠️ 輸出規則（嚴格）：
你只能輸出 JSON，不可以有任何多餘文字。
如果格式錯誤，整個系統會壞掉。

格式：
{
  "problems": string[],
  "tasks": string[],
  "check": string,
  "recommended_card": string
}

rules:
- tasks 必須是「可操作動作」（例如：把 200Hz 降 2dB）
- 每個 task 不可超過一句話
- 不要抽象建議
- recommended_card 請根據痛點從以下 ID 挑選最適合的一張（無關聯填 "random"）：
  ["pingpong", "compressor", "parallel", "ms_eq", "deesser"]
`;

function AssistantContent() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [showGacha, setShowGacha] = useState(false);
  const [droppedCard, setDroppedCard] = useState<any>(null);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number | null>(null);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, nextLevelXp: 100 });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');

  const [mode, setMode] = useState<Mode>("free");
  const [guidedState, setGuidedState] = useState<GuidedState>({
    step: "ask_instrument",
    context: { instrument: null, role: null, problem: null },
    completedTasks: [],
  });
  const [aiData, setAiData] = useState<AiData | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (queryParam) setPrompt(queryParam);
  }, [queryParam]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      if (mode === 'guided' && guidedState.step === "upload_eq") {
        handleGuidedAnalyze(file);
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setError(null);
    } else if (file) {
      setError("請上傳正確的音訊檔案格式！");
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim() && !image && !audioFile) {
      setError("請上傳圖片、音檔或輸入問題！");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          image,
          // ⚠️ TODO: 目前 audioUrl 是 blob，後端讀不到，未來需改為上傳 FormData 或轉 Base64
          audio: audioUrl,
          history: chatHistory
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data.text);
      setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: prompt + (image ? " [圖]" : "") + (audioFile ? " [音檔]" : "") }] },
        { role: "model", parts: [{ text: data.text }] }
      ]);
      setPrompt('');

      if (Math.random() < 0.2) {
        const randomIndex = Math.floor(Math.random() * MAGIC_CARDS.length);
        setDroppedCard(MAGIC_CARDS[randomIndex]);
        setShowGacha(true);
      }
    } catch (err: any) {
      setError(err.message || '分析失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleGuidedAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setAiData(null);
    setGuidedState(prev => ({ ...prev, step: "analyzing" }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setImage(base64Image);

      try {
        const finalPrompt = buildGuidedPrompt(guidedState.context);
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: finalPrompt, image: base64Image })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const safeParse = (text: string) => {
          try {
            const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(cleaned);
          } catch { return null; }
        };

        const parsed = safeParse(data.text);
        if (!parsed || !parsed.tasks || !Array.isArray(parsed.tasks)) {
          throw new Error("AI 格式錯誤，請重新上傳一次截圖讓它重想！");
        }

        setAiData(parsed);
        setGuidedState(prev => ({ ...prev, step: "show_tasks", completedTasks: [] }));
      } catch (err: any) {
        setError(err.message || '解析 AI 診斷書時發生錯誤。');
        setGuidedState(prev => ({ ...prev, step: "upload_eq" }));
      } finally {
        setLoading(false);
      }
    };
  };

  const handleClaimReward = () => {
    setUserStats(prev => {
      let newXp = prev.xp + 40;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newXp -= prev.nextLevelXp;
        newNextLevelXp = Math.floor(prev.nextLevelXp * 1.3);
      }
      return { level: newLevel, xp: newXp, nextLevelXp: newNextLevelXp };
    });

    let cardToDrop = null;
    if (aiData?.recommended_card && aiData.recommended_card !== "random") {
      cardToDrop = MAGIC_CARDS.find(c => c.id === aiData.recommended_card);
    }
    if (!cardToDrop) {
      const randomIndex = Math.floor(Math.random() * MAGIC_CARDS.length);
      cardToDrop = MAGIC_CARDS[randomIndex];
    }

    setDroppedCard(cardToDrop);
    setShowGacha(true);
    setGuidedState(prev => ({ ...prev, step: "done" }));
  };

  const resetApp = () => {
    setMode("free");
    setResult(null);
    setImage(null);
    setAudioFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAiData(null);
    setPrompt('');
    setChatHistory([]);
    setGuidedState({ step: "ask_instrument", context: { instrument: null, role: null, problem: null }, completedTasks: [] });
  };

  const tasks = aiData?.tasks || [];

  const pillStyle = { padding: '8px 16px', borderRadius: '20px', backgroundColor: '#1a1a2e', border: '1px solid #4a4e69', color: '#e0e1dd', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.4)', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 'bold' };
  const stepContainerStyle = { background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #4f46e5', textAlign: 'center' as const };
  const taskButtonStyle = { display: 'block', width: '100%', padding: '1.2rem', marginBottom: '1rem', background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: '0.8rem', color: 'white', fontSize: '1.15rem', cursor: 'pointer', transition: '0.2s', fontWeight: '500' };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.2rem 0' }}>AI 混音助理</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>
            <span>🏆 Lv.{userStats.level} 混音學徒</span>
            <div style={{ width: '100px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%`, background: '#10b981', height: '100%' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>{userStats.xp}/{userStats.nextLevelXp} XP</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/collection" style={{ padding: '0.6rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem' }}>
            📜 魔法圖鑑
          </Link>
          <button onClick={resetApp} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🔄 重置 / 自由模式
          </button>
        </div>
      </div>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>⚠️ {error}</div>}

      {mode === 'guided' && (
        <div key={`guided-${guidedState.step}`} style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          {guidedState.step === "ask_instrument" && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 1 / 4</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>👉 我們一步一步來，先告訴我這是什麼聲音？</p>
              {INSTRUMENT_OPTIONS.map((opt) => (
                <button key={opt.value} style={taskButtonStyle} onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'} onMouseOut={(e) => e.currentTarget.style.background = '#1e1b4b'} onClick={() => setGuidedState(prev => ({ ...prev, step: "ask_role", context: { ...prev.context, instrument: opt.value } }))}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {guidedState.step === "ask_role" && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 2 / 4</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>👉 這個聲音在歌曲裡扮演什麼角色？</p>
              {ROLE_OPTIONS.map((opt) => (
                <button key={opt.value} style={taskButtonStyle} onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'} onMouseOut={(e) => e.currentTarget.style.background = '#1e1b4b'} onClick={() => setGuidedState(prev => ({ ...prev, step: "ask_problem", context: { ...prev.context, role: opt.value } }))}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {guidedState.step === "ask_problem" && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 3 / 4</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>👉 聽起來，你覺得它的問題比較接近哪一種？</p>
              {PROBLEM_OPTIONS.map((opt) => (
                <button key={opt.value} style={taskButtonStyle} onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'} onMouseOut={(e) => e.currentTarget.style.background = '#1e1b4b'} onClick={() => setGuidedState(prev => ({ ...prev, step: "upload_eq", context: { ...prev.context, problem: opt.value } }))}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {(guidedState.step === "upload_eq" || guidedState.step === "analyzing") && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 4 / 4</h3>
              {!loading && (
                <>
                  <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>👍 很好，這通常跟這件事有關👇</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fca311', marginBottom: '1.5rem' }}>
                    {issueMap[guidedState.context.problem ?? "unknown"] || "整體頻率分佈"}
                  </p>
                  <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#a78bfa' }}>👉 請打開你的 EQ，拍一張截圖上傳：</p>
                </>
              )}
              {loading ? (
                <div style={{ padding: '3rem', fontSize: '1.2rem', color: '#fca311' }}>
                  <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>⚙️</div>
                  教練正在綜合你的回報與 EQ 頻譜進行精準分析... ⏳
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '3rem', cursor: 'pointer', border: '2px dashed #4f46e5' }} onClick={() => fileInputRef.current?.click()}>
                  <p style={{ fontSize: '1.2rem', margin: 0 }}>🖼️ 點此上傳你的 EQ 截圖</p>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                </div>
              )}
            </div>
          )}

          {guidedState.step === "show_tasks" && aiData && (
            <div style={{ ...stepContainerStyle, textAlign: 'left' }}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '1rem' }}>🔍 診斷結果出爐</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                <ul style={{ color: '#fca311', lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '1.1rem', margin: 0 }}>
                  {aiData.problems.map((p, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{p}</li>)}
                </ul>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>你的修正進度：{guidedState.completedTasks.length} / {tasks.length}</p>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', height: '12px' }}>
                  <div style={{
                    width: `${tasks.length > 0 ? (guidedState.completedTasks.length / tasks.length) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    height: '100%',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                  }} />
                </div>
              </div>

              <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>👉 現在不要想，直接照做 👇</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {tasks.map((task, i) => {
                  const isChecked = guidedState.completedTasks.includes(task);
                  return (
                    <div key={i}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isChecked ? '#10b981' : '#4a4e69'}`, borderRadius: '0.5rem', cursor: 'pointer', transition: '0.3s' }}>
                        <input type="checkbox" checked={isChecked} style={{ width: '24px', height: '24px', accentColor: '#10b981', cursor: 'pointer' }} onChange={(e) => {
                          if (e.target.checked) {
                            setGuidedState((prev) => ({ ...prev, completedTasks: [...prev.completedTasks, task] }));
                            // 💡 修正這裡：已經更新為正確的路徑 👇
                            try { new Audio('/audio/click.mp3').play().catch(() => { }); } catch (err) { }
                            setActiveFeedbackIndex(i);
                            setTimeout(() => setActiveFeedbackIndex(null), 2500);
                          } else {
                            setGuidedState((prev) => ({ ...prev, completedTasks: prev.completedTasks.filter(t => t !== task) }));
                            setActiveFeedbackIndex(null);
                          }
                        }} />
                        <span style={{ fontSize: '1.1rem', color: isChecked ? '#a7f3d0' : '#fff', textDecoration: isChecked ? 'line-through' : 'none', transition: '0.3s' }}>{task}</span>
                      </label>
                      {activeFeedbackIndex === i && (
                        <div style={{ marginTop: '0.5rem', padding: '0.6rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '0.5rem', color: '#a7f3d0', fontSize: '0.95rem', animation: 'fadeIn 0.3s ease' }}>
                          ✅ 很好，你剛剛已經開始在「用耳朵判斷」了
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {guidedState.completedTasks.length === tasks.length && tasks.length > 0 && (
                <button
                  onClick={handleClaimReward}
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    width: '100%',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}
                >
                  🎁 完成訓練，領取獎勵
                </button>
              )}
            </div>
          )}

          {guidedState.step === "done" && !showGacha && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              border: '1px solid #4f46e5'
            }}>
              <h2 style={{ fontSize: '1.5rem', color: '#6ee7b7' }}>
                🎧 訓練完成
              </h2>
              <p style={{ marginTop: '1rem', color: '#d1fae5' }}>
                👉 你已經能辨認這類問題了
              </p>
              <button
                onClick={resetApp}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.8rem 1.5rem',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔁 再來一次
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'free' && (
        <div key="free-mode" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #6366f1', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#a5b4fc', fontSize: '1.3rem' }}> 🎧 你的混音為什麼聽起來像一團霧？</h2>
              <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.95rem' }}>👉 用 3 分鐘，我讓你第一次「真的聽出差別」</p>
            </div>
            <button onClick={() => { setMode("guided"); setGuidedState({ step: "ask_instrument", context: { instrument: null, role: null, problem: null }, completedTasks: [] }); setChatHistory([]); }} style={{ padding: '0.8rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}>👉 開始引導</button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexDirection: 'column' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '2px dashed #4f46e5' }} onClick={() => fileInputRef.current?.click()}>
              {image ? <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem' }} /> : <p>🖼️ 點擊上傳、拖曳或 Ctrl+V 貼上 EQ 截圖</p>}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
            </div>

            <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '2px dashed #0284c7', borderRadius: '1rem', padding: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => audioInputRef.current?.click()}>
              {audioUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'linear-gradient(to bottom, #0284c7, #0369a1)', padding: '8px 16px', borderRadius: '20px', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>🎵 音檔已載入</div>
                  <p style={{ color: '#bae6fd', fontWeight: 'bold', margin: 0 }}>{audioFile?.name}</p>
                  <audio controls src={audioUrl} style={{ width: '100%', maxWidth: '400px' }} />
                </div>
              ) : (
                <p style={{ color: '#bae6fd', margin: 0 }}>🎙️ 上傳短篇人聲軌 (MP3/WAV) 讓 AI 聽診</p>
              )}
              <input type="file" ref={audioInputRef} style={{ display: 'none' }} accept="audio/*" onChange={handleAudioUpload} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', background: 'rgba(20,20,30,0.6)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fca311', fontSize: '1.1rem' }}>✨ 今天混音卡在哪裡？讓我給你一點靈感</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button style={pillStyle} onClick={() => setPrompt('🎛️ 想問 Plugin 的具體功能與推薦設定：')}>🎛️ Plugin 功能與設定</button>
              <button style={pillStyle} onClick={() => setPrompt('🌫️ 為什麼聲音聽起來很糊？這是我目前的設定：')}>🌫️ 為什麼聲音聽起來很糊？</button>
              <button style={pillStyle} onClick={() => setPrompt('🥁 鼓組的打擊感出不來怎麼調？')}>🥁 鼓組打擊感優化</button>
              <button style={pillStyle} onClick={() => setPrompt('💡 我目前的 Project 裡有一軌音軌，我不知道該對它做什麼處理比較好，請幫我分析：')}>💡 不知道該做什麼處理</button>
            </div>
          </div>

          {chatHistory.length > 0 && (
            <div style={{ marginBottom: '1rem', color: '#10b981', fontSize: '0.9rem', textAlign: 'right' }}>💬 助理已記住之前的 {chatHistory.length / 2} 次對話內容</div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="輸入問題或回答..." style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', background: '#111', color: '#fff', border: '1px solid #333', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleAnalyze} disabled={loading} style={{ flex: 3, padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold', background: '#d90429', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>{loading ? 'AI 聽診中...' : '發送診斷 🚀'}</button>
          </div>

          {result && (
            <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>助理回應</h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{result}</div>
            </div>
          )}
        </div>
      )}

      {showGacha && droppedCard && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: '#fbbf24', fontSize: '2.5rem', marginBottom: '2.5rem' }}>🎉 獲得稀有混音魔法卡！ 🎉</h2>
          <div style={{ padding: '5px', background: 'linear-gradient(135deg, #fef08a 0%, #ca8a04 50%, #fef08a 100%)', borderRadius: '20px' }}>
            <div style={{ padding: '2px', background: '#1a1a1a', borderRadius: '17px' }}>
              <div style={{ padding: '3px', background: 'linear-gradient(135deg, #eab308, #854d0e)', borderRadius: '15px' }}>
                <div style={{ width: '330px', background: 'linear-gradient(145deg, #206a5d 0%, #0d3b33 100%)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(234, 179, 8, 0.6)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#fef3c7' }}>{droppedCard.name}</h3>
                    <div style={{ background: '#0284c7', color: '#fff', padding: '3px 10px', borderRadius: '15px', fontSize: '0.85rem' }}>魔法卡</div>
                  </div>
                  <div style={{ width: '100%', height: '210px', background: 'linear-gradient(45deg, #1e1b4b, #701a75)', border: '3px solid #ca8a04', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>[ 魔法陣插圖 ]</span>
                  </div>
                  <div style={{ background: 'linear-gradient(to bottom, #fffbeb, #fef08a)', padding: '12px', borderRadius: '6px', color: '#1c1917' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>【發動條件】 {droppedCard.condition}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🗡️ 實戰參數: {droppedCard.params}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => setShowGacha(false)} style={{ marginTop: '3.5rem', padding: '1.2rem 3rem', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>收下魔法卡並繼續修煉</button>
        </div>
      )}

      {/* 音效 preload */}
      <audio id="click-sound" src="/audio/click.mp3" preload="auto" style={{ display: 'none' }}></audio>
    </div>
  );
}

export default function MixAssistantPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', paddingTop: '5rem' }}>混音助理載入中...</div>}>
      <AssistantContent />
    </Suspense>
  );
}