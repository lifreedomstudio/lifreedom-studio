"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 🚀 架構與狀態定義
type Mode = "free" | "guided";

interface GuidedState {
  step: number;
  issue?: string;
  completedTasks: string[];
}

// 🛡️ 定義 AI 回傳的 JSON 結構
interface AiData {
  problems: string[];
  tasks: string[];
  check: string;
}

// 🃏 傳說級卡牌資料庫
const MAGIC_CARDS = [
  { id: 'pingpong', name: '空間撕裂者 · 乒乓延遲', type: '傳說魔法', stars: 3, condition: '當人聲與伴奏黏在一起時可發動。', params: 'Time: 1/4 | Feedback: 25% | High-Pass: 300Hz', flavor: '「讓聲音在左右聲道瘋狂橫跳，創造極致寬廣的異次元空間。」' },
  { id: 'compressor', name: '重力束縛 · 爸爸壓縮器', type: '實戰魔法', stars: 2, condition: '當訊號超過忍耐極限 (Threshold) 時發動。', params: 'Ratio: 4:1 | Attack: 30ms | Release: Auto', flavor: '「這是老爸最後的慈悲，讓你的音量乖乖聽話，否則皮帶候教。」' },
  { id: 'parallel', name: '幻影分身 · 平行壓縮', type: '傳說魔法', stars: 3, condition: '當鼓組聽起來軟弱無力時發動。', params: 'Mix: 30-50% | Ratio: 10:1 (Heavy) | Makeup: +4dB', flavor: '「召喚一個充滿力量的影子分身，與原聲融合，創造拳拳到肉的撞擊感。」' },
  { id: 'ms_eq', name: '維度切割 · M/S 等化器', type: '史詩魔法', stars: 3, condition: '當混音中間太擠、兩旁太空時發動。', params: 'Side: High Shelf +2dB | Mid: Low Cut 100Hz', flavor: '「切開聲音的維度，將亮麗留給兩旁，將力道留給中間。」' },
  { id: 'deesser', name: '蛇語者 · 齒音獵人', type: '實戰魔法', stars: 2, condition: '當歌手的『嘶』聲刺耳如蛇鳴時發動。', params: 'Freq: 5-8kHz | Range: -4dB | Threshold: 恰到好處', flavor: '「在不經意間，溫柔地按住那些尖銳的齒音。」' }
];

// 🧠 教練模式專屬 Prompt
const buildGuidedPrompt = (issue: string) => `
你是一位「混音教練」，不是分析師。
目標：讓新手「動手調整」，而不是只看說明。

使用者目前問題：${issue}

請務必使用 JSON 格式輸出，不要加入任何其他說明文字或 Markdown 標記。格式必須嚴格如下：
{
  "problems": ["問題1 (非常白話說明)", "問題2"],
  "tasks": ["動作1 (例：把 200Hz 降 2dB)", "動作2"],
  "check": "驗證聽覺的問題 (例：有沒有比較清楚？)"
}
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

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');

  // --- 引導模式狀態 ---
  const [mode, setMode] = useState<Mode>("free");
  const [guidedState, setGuidedState] = useState<GuidedState>({
    step: 0,
    completedTasks: [],
  });
  const [aiData, setAiData] = useState<AiData | null>(null);

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
      if (mode === 'guided' && guidedState.step === 2) {
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

  // 🦅 原有自由模式
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
        body: JSON.stringify({ prompt, image })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);

      if (Math.random() < 0.2) {
        forceGacha();
      }
    } catch (err: any) {
      setError(err.message || '分析失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  // 🧪 引導模式
  const handleGuidedAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setAiData(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setImage(base64Image);

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: buildGuidedPrompt(guidedState.issue || 'unknown'),
            image: base64Image
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        // 🔒 安全解析 JSON，避免破壞 VS Code 語法樹
        const safeParse = (text: string) => {
          try {
            const cleaned = text
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();

            return JSON.parse(cleaned);
          } catch {
            return null;
          }
        };

        // 使用
        const parsed = safeParse(data.text);
        if (!parsed) throw new Error("AI 格式錯誤");

        setAiData(parsed);

        setGuidedState(prev => ({ ...prev, step: 2.5, completedTasks: [] }));
      } catch (err: any) {
        setError('解析 AI 診斷書時發生錯誤，請重新上傳試試看。');
        console.error("JSON Parsing Error:", err);
      } finally {
        setLoading(false);
      }
    };
  };

  const forceGacha = () => {
    const randomIndex = Math.floor(Math.random() * MAGIC_CARDS.length);
    setDroppedCard(MAGIC_CARDS[randomIndex]);
    setShowGacha(true);
  };

  const tasks = aiData?.tasks || [];

  // --- 共用樣式 ---
  const pillStyle = { padding: '8px 16px', borderRadius: '20px', backgroundColor: '#1a1a2e', border: '1px solid #4a4e69', color: '#e0e1dd', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.4)', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 'bold' };
  const specialPillStyle = { ...pillStyle, backgroundColor: '#3c096c', borderColor: '#9d4edd', color: '#ff9e00', boxShadow: '0 0 12px rgba(157, 78, 221, 0.4)' };
  const goldenPillStyle = { ...pillStyle, border: '1px solid #fbbf24', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.05)' };
  const stepContainerStyle = { background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #4f46e5', textAlign: 'center' as const };
  const taskButtonStyle = { display: 'block', width: '100%', padding: '1rem', marginBottom: '1rem', background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: '0.5rem', color: 'white', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>

      {/* 🔝 頂部導航 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>AI 混音助理</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/collection" style={{ padding: '0.6rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem' }}>
            📜 魔法圖鑑
          </Link>
          <button onClick={() => { setMode("free"); setResult(null); setImage(null); setAiData(null); }} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🔄 重新 / 自由模式
          </button>
        </div>
      </div>

      {error && <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>⚠️ {error}</div>}

      {/* ======================================= */}
      {/* 🧭 教練引導模式 */}
      {/* ======================================= */}
      {mode === 'guided' && (
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>

          {/* Step 1：選問題 */}
          {guidedState.step === 1 && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 1 / 4</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>👉 哪一個最困擾你？</p>

              {[
                { label: "🌫️ 聲音很糊", value: "muddy" },
                { label: "🎤 人聲不清楚", value: "vocal" },
                { label: "🥁 鼓沒有力", value: "drums" },
                { label: "🤔 不知道哪裡怪", value: "unknown" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  style={taskButtonStyle}
                  onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#1e1b4b'}
                  onClick={() => {
                    setGuidedState((prev) => ({ ...prev, step: 2, issue: opt.value }));
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Step 2：上傳截圖 */}
          {guidedState.step === 2 && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Step 2 / 4</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                👉 你現在遇到的不是「技術問題」
              </p>

              <p style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                是👇
              </p>

              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fca311' }}>
                {guidedState.issue === "muddy"
                  ? "聲音在打架（頻率重疊）"
                  : guidedState.issue === "vocal"
                    ? "人聲被卡住（中頻衝突）"
                    : guidedState.issue === "drums"
                      ? "沒有打出來（動態與瞬態不足）"
                      : "整體沒有分開（頻率分佈不均）"}
              </p>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#a78bfa' }}>👉 請打開你的 EQ，拍一張截圖上傳：</p>

              {loading ? (
                <div style={{ padding: '3rem', fontSize: '1.2rem', color: '#fca311' }}>教練正在分析你的 EQ 頻譜... ⏳</div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '3rem', cursor: 'pointer', border: '2px dashed #4f46e5' }} onClick={() => fileInputRef.current?.click()}>
                  <p style={{ fontSize: '1.2rem', margin: 0 }}>🖼️ 點此上傳你的 EQ 截圖</p>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                </div>
              )}
            </div>
          )}

          {/* Step 2.5：確認過渡 */}
          {guidedState.step === 2.5 && aiData && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#818cf8', fontSize: '1.8rem', marginBottom: '1rem' }}>🔍 診斷結果出爐</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>我先幫你看了一下問題 👇</p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                <ul style={{ color: '#fca311', lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '1.1rem', margin: 0 }}>
                  {aiData.problems.map((p, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{p}</li>)}
                </ul>
              </div>

              <button
                style={{ ...taskButtonStyle, background: '#4f46e5', fontWeight: 'bold' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#4338ca'}
                onMouseOut={(e) => e.currentTarget.style.background = '#4f46e5'}
                onClick={() => setGuidedState(prev => ({ ...prev, step: 3 }))}
              >
                👉 好，開始修正（進入實戰任務）
              </button>
            </div>
          )}

          {/* Step 3：任務清單 */}
          {guidedState.step === 3 && aiData && (
            <div style={{ ...stepContainerStyle, textAlign: 'left' }}>
              <h3 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Step 3 / 4：動手時間</h3>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>你的混音能力：{guidedState.completedTasks.length} / {tasks.length}</p>
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

              <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>👉 現在不要想，直接做👇
                （做完你一定會聽出差別）</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {tasks.map((task, i) => {
                  const isChecked = guidedState.completedTasks.includes(task);
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isChecked ? '#10b981' : '#4a4e69'}`, borderRadius: '0.5rem', cursor: 'pointer', transition: '0.3s' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        style={{ width: '24px', height: '24px', accentColor: '#10b981', cursor: 'pointer' }}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGuidedState((prev) => ({ ...prev, completedTasks: [...prev.completedTasks, task] }));
                          } else {
                            setGuidedState((prev) => ({ ...prev, completedTasks: prev.completedTasks.filter(t => t !== task) }));
                          }
                        }}
                      />
                      <span style={{ fontSize: '1.1rem', color: isChecked ? '#a7f3d0' : '#fff', textDecoration: isChecked ? 'line-through' : 'none', transition: '0.3s' }}>
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>

              {tasks.length > 0 && guidedState.completedTasks.length >= tasks.length && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s', padding: '2rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '1rem', border: '1px solid #fbbf24' }}>
                  <h3 style={{ color: '#fbbf24', fontSize: '1.8rem', marginBottom: '0.5rem' }}>{aiData.check}</h3>
                  <p style={{ color: '#fef3c7', marginBottom: '1.5rem' }}>聽聽看，是不是很不一樣了？</p>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>🔥 你剛剛做到一件很多新手做不到的事：</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0', color: '#10b981', fontSize: '1.1rem' }}>
                      <li style={{ marginBottom: '0.5rem' }}>✔ 分辨混濁與問題點</li>
                      <li>✔ 主動修正頻率</li>
                    </ul>
                    <p style={{ fontSize: '1.2rem', margin: 0, color: '#fca311', fontWeight: 'bold' }}>👉 這就是「混音耳朵開始打開」的瞬間！</p>
                  </div>

                  <button
                    onClick={() => { forceGacha(); setGuidedState((prev) => ({ ...prev, step: 4 })); }}
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)' }}
                  >
                    🎁 領取本次修煉獎勵
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4：下一步迴圈 */}
          {guidedState.step === 4 && !showGacha && (
            <div style={stepContainerStyle}>
              <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '0.5rem' }}>修煉完成！</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>👉 接下來你想優化哪裡？</p>

              {["🎤 人聲更突出", "🌌 更有空間感", "🥁 鼓更有力", "🏠 回到自由模式"].map((opt) => (
                <button
                  key={opt}
                  style={taskButtonStyle}
                  onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#1e1b4b'}
                  onClick={() => {
                    if (opt === "🏠 回到自由模式") {
                      setMode('free');
                      setImage(null);
                      setAiData(null);
                    } else {
                      const issueMap: Record<string, string> = {
                        "🎤 人聲更突出": "vocal",
                        "🌌 更有空間感": "space",
                        "🥁 鼓更有力": "drums",
                      };
                      setGuidedState({ step: 2, issue: issueMap[opt], completedTasks: [] });
                      setImage(null);
                      setAiData(null);
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 🦅 自由模式 */}
      {/* ======================================= */}
      {mode === 'free' && (
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>

          <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #6366f1', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#a5b4fc', fontSize: '1.3rem' }}> 🎧 你的混音為什麼聽起來像一團霧？</h2>
              <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.95rem' }}>👉 用 3 分鐘，我讓你第一次「真的聽出差別」</p>
            </div>
            <button
              onClick={() => { setMode("guided"); setGuidedState({ step: 1, completedTasks: [] }); }}
              style={{ padding: '0.8rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}
            >
              👉 開始引導
            </button>
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
              <button style={goldenPillStyle} onClick={() => setPrompt('📂 我現在面對一整個混音專案，完全不知道該從何下手。請擔任我的「混音導師」，從 Gain Staging 開始一步步引導我：')}>🎯 專案不知從何下手？</button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="輸入問題..." style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', background: '#111', color: '#fff', border: '1px solid #333', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleAnalyze} disabled={loading} style={{ flex: 3, padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold', background: '#d90429', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>
              {loading ? 'AI 聽診中...' : '發送診斷 🚀'}
            </button>
            <button onClick={forceGacha} style={{ flex: 1, padding: '1.2rem', background: '#fbbf24', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>🎲 測試抽卡</button>
          </div>

          {result && (
            <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>分析結果與建議</h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{result}</div>
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 🎁 抽卡特效疊加層 */}
      {/* ======================================= */}
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
          <button onClick={() => setShowGacha(false)} style={{ marginTop: '3.5rem', padding: '1.2rem 3rem', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            收下魔法卡並繼續修煉
          </button>
        </div>
      )}
    </div>
  );
}

// 🏆 最終導出頁面
export default function MixAssistantPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', paddingTop: '5rem' }}>混音助理載入中...</div>}>
      <AssistantContent />
    </Suspense>
  );
}