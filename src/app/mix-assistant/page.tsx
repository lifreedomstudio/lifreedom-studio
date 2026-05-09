"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // 👈 確保導線接通

// 🃏 傳說級卡牌資料庫 (放在組件外，節省運算資源)
const MAGIC_CARDS = [
  {
    id: 'pingpong',
    name: '空間撕裂者 · 乒乓延遲',
    type: '傳說魔法',
    stars: 3,
    condition: '當人聲與伴奏黏在一起時可發動。',
    params: 'Time: 1/4 | Feedback: 25% | High-Pass: 300Hz',
    flavor: '「讓聲音在左右聲道瘋狂橫跳，創造極致寬廣的異次元空間。」'
  },
  {
    id: 'compressor',
    name: '重力束縛 · 爸爸壓縮器',
    type: '實戰魔法',
    stars: 2,
    condition: '當訊號超過忍耐極限 (Threshold) 時發動。',
    params: 'Ratio: 4:1 | Attack: 30ms | Release: Auto',
    flavor: '「這是老爸最後的慈悲，讓你的音量乖乖聽話，否則皮帶候教。」'
  },
  {
    id: 'parallel',
    name: '幻影分身 · 平行壓縮',
    type: '傳說魔法',
    stars: 3,
    condition: '當鼓組聽起來軟弱無力時發動。',
    params: 'Mix: 30-50% | Ratio: 10:1 (Heavy) | Makeup: +4dB',
    flavor: '「召喚一個充滿力量的影子分身，與原聲融合，創造拳拳到肉的撞擊感。」'
  },
  {
    id: 'ms_eq',
    name: '維度切割 · M/S 等化器',
    type: '史詩魔法',
    stars: 3,
    condition: '當混音中間太擠、兩旁太空時發動。',
    params: 'Side: High Shelf +2dB | Mid: Low Cut 100Hz',
    flavor: '「切開聲音的維度，將亮麗留給兩旁，將力道留給中間。」'
  },
  {
    id: 'deesser',
    name: '蛇語者 · 齒音獵人',
    type: '實戰魔法',
    stars: 2,
    condition: '當歌手的『嘶』聲刺耳如蛇鳴時發動。',
    params: 'Freq: 5-8kHz | Range: -4dB | Threshold: 恰到好處',
    flavor: '「在不經意間，溫柔地按住那些尖銳的齒音。」'
  }
];

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

  // 🛡️ 守門員邏輯：進入包廂前先驗票
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (queryParam) {
      setPrompt(queryParam);
    }
  }, [queryParam]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setError(null);
    } else if (file) {
      setError("請上傳正確的音訊檔案格式 (MP3, WAV 等)！");
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) processFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

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
        const randomIndex = Math.floor(Math.random() * MAGIC_CARDS.length);
        setDroppedCard(MAGIC_CARDS[randomIndex]);
        setTimeout(() => setShowGacha(true), 1200);
      }
    } catch (err: any) {
      setError(err.message || '分析失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const forceGacha = () => {
    setDroppedCard(MAGIC_CARDS[0]);
    setShowGacha(true);
  };

  const pillStyle = {
    padding: '8px 16px', borderRadius: '20px', backgroundColor: '#1a1a2e', border: '1px solid #4a4e69', color: '#e0e1dd',
    cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.4)', transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 'bold'
  };
  const specialPillStyle = {
    ...pillStyle, backgroundColor: '#3c096c', borderColor: '#9d4edd', color: '#ff9e00', boxShadow: '0 0 12px rgba(157, 78, 221, 0.4)'
  };
  const goldenPillStyle = {
    ...pillStyle, border: '1px solid #fbbf24', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.05)'
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>

      {/* 🔝 助理頁面頂部導航 - 修正結構後的單一版本 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>AI 混音助理</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/collection" style={{
            padding: '0.6rem 1.2rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24',
            borderRadius: '8px', textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem'
          }}>
            📜 魔法圖鑑
          </Link>
          <Link href="/courses" style={{
            padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px',
            textDecoration: 'none', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem'
          }}>
            📚 返回道場
          </Link>
        </div>
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
          <button style={pillStyle} onClick={() => setPrompt('💡 我目前的 Project 裡有一軌音軌，我不知道該對它做什麼處理比較好，請幫我分析：')}>💡 我有一軌不知道該對它做什麼</button>
          <button style={pillStyle} onClick={() => setPrompt('🤖 我上傳了一個 AI 生成的音檔，請針對數位雜訊與頻率分佈提供優化建議：')}>🤖 AI 音檔音質優化</button>
          <button style={goldenPillStyle} onClick={() => setPrompt('📂 我現在面對一整個混音專案，完全不知道該從何下手。請擔任我的「混音導師」，從 Gain Staging 開始一步步引導我，並在每個階段詢問我的進度與問題：')}>🎯 一整個專案不知從何下手？</button>
          <button style={specialPillStyle} onClick={() => router.push('/courses')}>📚 我想瞭解更多理論</button>
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

      {error && <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>⚠️ {error}</div>}

      {result && (
        <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>分析結果與建議</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{result}</div>
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
          <button onClick={() => setShowGacha(false)} style={{ marginTop: '3.5rem', padding: '1.2rem 3rem', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            收下魔法卡並繼續修煉
          </button>
        </div>
      )}
    </div>
  );
}

// 🏆 最終導出頁面：使用 Suspense 包裹以支援 useSearchParams
export default function MixAssistantPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', paddingTop: '5rem' }}>混音助理載入中...</div>}>
      <AssistantContent />
    </Suspense>
  );
}