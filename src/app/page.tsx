"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* 🌟 1. 英雄視覺區 (Hero Section) */}
      <div style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.15) 0%, #020617 60%)', padding: '2rem'
      }}>
        <p style={{ color: '#38bdf8', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '1rem' }}>LIFREEDOM STUDIO</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', margin: '0 0 1.5rem 0', background: 'linear-gradient(to right, #38bdf8, #fca311)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          聲學建築所
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
          不再憑感覺轉動旋鈕。加入「製作人孵化計畫」，用建築師的思維重塑你的音樂空間，找回混音的絕對主導權。
        </p>
        <Link href="/courses" style={{
          padding: '1rem 3rem', background: '#fca311', color: '#000', fontSize: '1.2rem', fontWeight: 'bold',
          borderRadius: '50px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(252, 163, 17, 0.3)', transition: 'transform 0.2s'
        }}>
          進入建築所大廳 🚀
        </Link>
      </div>

      {/* 🔥 2. 痛點共鳴區 (Pain Points) */}
      <div style={{ padding: '6rem 2rem', background: '#0f172a', borderTop: '1px solid rgba(56, 189, 248, 0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>您是否也受困於這些<span style={{ color: '#ef4444' }}>混音泥淖</span>？</h2>
          <p style={{ color: '#94a3b8', marginBottom: '4rem', fontSize: '1.1rem' }}>這些問題正在消耗你創作的熱情與時間</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📺</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>教學與實戰的巨大斷層</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>看了上百小時的教學，但打開專案時依然不知從何下手。別人的參數套在自己的音軌上總是格格不入，缺乏針對當下問題的即時引導。</p>
            </div>
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😵‍💫</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>聽覺疲勞與決策迷失</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>在同一個循環中聽了 4 小時，耳朵已經麻痺，無法客觀判斷 500Hz 是否還在打架。缺乏即時的聽診回饋，導致輸出品質參差不齊。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏗️ 3. 橋段：打破迷思，帶入編曲觀念 (The Truth: Arrangement) */}
      <div style={{ padding: '6rem 2rem', background: '#020617', borderBottom: '1px solid rgba(56, 189, 248, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#fca311', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem' }}>THE TRUTH</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', margin: '1rem 0' }}>其實，混音的終點在<span style={{ color: '#38bdf8' }}>「編曲的起點」</span></h2>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
              如果樂器的頻段與空間一開始就撞車，再好的 EQ 也救不回來。我們帶你切換「製作人視野」，從源頭解決混音的渾濁感。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'LCR 擺位法則', desc: '將節奏組硬推向極左與極右，為中間的主唱與貝斯騰出「聽覺高速公路」。', icon: '↔️', color: '#38bdf8' },
              { title: '八度音錯位魔法', desc: '透過編曲把位的垂直交錯，讓樂器在天然頻段中完美共存，捨棄破壞性 EQ。', icon: '🪄', color: '#fca311' },
              { title: '低頻口袋拼圖', desc: '在製作階段就規劃大鼓與貝斯的發力點，建立拳拳到肉、絕不渾濁的低頻基石。', icon: '🧩', color: '#ef4444' },
              { title: '哈斯效應假身術', desc: '利用人耳錯覺創造寬度。僅需微秒延遲，讓單聲道樂器變身為沉浸式立體音牆。', icon: '👻', color: '#a78bfa' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '20px', border: `1px solid ${item.color}33` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.3rem', color: item.color, marginBottom: '0.8rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🤖 4. Meet the AI (修復引號 Bug 的區塊) */}
      <div style={{ padding: '8rem 2rem', background: '#0f172a', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Meet <span style={{ color: '#38bdf8' }}>Lifreedom AI</span></h2>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#e2e8f0' }}>你的思考、共同討論的製作好夥伴</h3>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 5rem' }}>
            為了解決上述的所有痛點與編曲難題，Lifreedom 不是冷冰冰的效果器，而是一個集結理論與實戰的線上導師。它能協助你從繁瑣的頻率糾結中解放，專注於真正重要的事——音樂的靈魂與空間的魔法。
          </p>

          {/* 💎 核心系統 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div style={{ padding: '3rem 2rem', background: 'linear-gradient(145deg, #1e293b, #020617)', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎙️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#38bdf8' }}>AI 聽覺診斷助理</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>上傳截圖或音檔，24/7 為你分析頻率遮蔽與動態問題，告別盲目猜測。</p>
            </div>
            <div style={{ padding: '3rem 2rem', background: 'linear-gradient(145deg, #1e293b, #020617)', borderRadius: '24px', border: '1px solid rgba(252, 163, 17, 0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fca311' }}>空間構築實驗室</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>搭載真實 Web Audio 引擎！親手拖曳 LCR 擺位，立刻聽見立體聲場被拉開的震撼。</p>
            </div>
            <div style={{ padding: '3rem 2rem', background: 'linear-gradient(145deg, #1e293b, #020617)', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#a78bfa' }}>混音魔法圖鑑</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>透過實戰解鎖傳說級技巧卡片，將隱形知識視覺化，打造專屬兵器庫。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 5. 擴充功能：魔法卡與每日挑戰 (Gamification) */}
      <div style={{ padding: '6rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>

          {/* 左側：每日互動 */}
          <div style={{ flex: '1 1 400px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold', letterSpacing: '2px' }}>DAILY CHALLENGE</span>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: '1rem 0' }}>混音界的 Duolingo</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              每天 5 分鐘，建立你的聽覺肌肉記憶。透過聽辨頻段與空間深度的挑戰，累積經驗值，將實戰技巧深深烙印在腦海中。
            </p>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '20px', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>🎯</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>今日：頻率聽診器</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>聽出哪個頻率正在打架？</p>
                </div>
              </div>
              <div style={{ height: '8px', background: '#020617', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ width: '75%', height: '100%', background: '#10b981' }}></div>
              </div>
              <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>🔥 連續修煉 5 天！再兩天解鎖稀有碎片。</p>
            </div>
          </div>

          {/* 右側：傳說卡片預覽 */}
          <div style={{ flex: '1 1 500px', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <div style={{ width: '220px', background: '#1e293b', borderRadius: '16px', border: '2px solid #38bdf8', overflow: 'hidden', transform: 'rotate(-5deg) translateY(20px)', boxShadow: '-10px 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ height: '140px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>🎧</div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#38bdf8', fontWeight: 'bold' }}>LEGENDARY</div>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '5px 0' }}>空間撕裂者</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>解鎖 LCR 極端擺位實驗室模組。</p>
              </div>
            </div>
            <div style={{ width: '220px', background: '#1e293b', borderRadius: '16px', border: '2px solid #fca311', overflow: 'hidden', transform: 'rotate(5deg)', zIndex: 2, boxShadow: '10px 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ height: '140px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>🎛️</div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#fca311', fontWeight: 'bold' }}>EPIC</div>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '5px 0' }}>音程煉金術</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>解鎖八度音編曲檢核表。</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🗺️ 6. 發展藍圖 (Roadmap) */}
      <div style={{ padding: '6rem 2rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>聲學建築 <span style={{ color: '#38bdf8' }}>進化藍圖</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '25px', left: '10%', right: '10%', height: '2px', background: 'rgba(56, 189, 248, 0.2)', zIndex: 0 }}></div>
            {[
              { date: 'Phase 1', title: '核心引擎上線', desc: 'LCR 即時混音沙盒與首批魔法卡片' },
              { date: 'Phase 2', title: '社群與大師榜', desc: '開放每日挑戰賽與社群成就分享' },
              { date: 'Phase 3', title: '聲學建築師認證', desc: '正式發布綜合實戰認證與廠牌媒合' }
            ].map((step, idx) => (
              <div key={idx} style={{ position: 'relative', zIndex: 1, background: '#020617', padding: '2rem', borderRadius: '16px', border: '1px solid #1e293b' }}>
                <div style={{ width: '40px', height: '40px', background: '#38bdf8', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#020617' }}>{idx + 1}</div>
                <h4 style={{ color: '#fca311', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{step.date}</h4>
                <h5 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>{step.title}</h5>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💰 7. SaaS 三階層定價方案 (Pricing) */}
      <div style={{ padding: '8rem 2rem', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>選擇適合您的<span style={{ color: '#ef4444' }}>方案</span></h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '4rem' }}>從 Basic 到 Master，滿足各種音樂人的成長需求</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* 方案 1: Basic */}
            <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Basic</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f8fafc' }}>$0 TWD</div>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', minHeight: '40px' }}>包含基礎導覽與個人輕量使用</p>
              <button style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold', marginBottom: '2rem' }}>開始免費體驗</button>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '2.2' }}>
                <li>✔️ 每日 3 次 AI 聽診對話</li>
                <li>✔️ 解鎖基礎心法道場</li>
                <li>✔️ 基礎 LCR 實驗室 (單聲道/流行)</li>
                <li>✔️ 收集上限 5 張魔法卡</li>
              </ul>
            </div>

            {/* 方案 2: Producer (高亮推薦) */}
            <div style={{ background: 'linear-gradient(180deg, #1e293b, #020617)', padding: '3rem 2rem', borderRadius: '24px', border: '2px solid #fca311', position: 'relative', transform: 'scale(1.05)', boxShadow: '0 10px 40px rgba(252, 163, 17, 0.15)' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#fca311', color: '#000', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>最受歡迎</div>
              <h3 style={{ color: '#fca311', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Producer</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f8fafc' }}>$590 TWD <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/月</span></div>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', minHeight: '40px' }}>適合建立完整工作流的獨立製作人</p>
              <button style={{ width: '100%', padding: '1rem', background: '#fca311', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(252, 163, 17, 0.3)', cursor: 'pointer' }}>取得授權</button>
              <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '2.2' }}>
                <li>✔️ 包含 Basic 全部優勢</li>
                <li>✔️ <b>無限制</b> AI 聽診與參數診斷</li>
                <li>✔️ 解鎖完整高階實驗室 (含真・立體聲引擎)</li>
                <li>✔️ <b>無限制</b> 收集與圖鑑進度雲端儲存</li>
                <li>✔️ 大師綜合認證考試資格</li>
              </ul>
            </div>

            {/* 方案 3: Master */}
            <div style={{ background: '#0f172a', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Master</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f8fafc' }}>客製報價</div>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', minHeight: '40px' }}>適合需要深度專案體檢的廠牌或樂團</p>
              <button style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold', marginBottom: '2rem' }}>聯絡我們</button>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '2.2' }}>
                <li>✔️ 包含 Producer 全部優勢</li>
                <li>✔️ 專屬 Logic Pro 專案檔健檢</li>
                <li>✔️ 1對1 主理人線上混音指導</li>
                <li>✔️ 客製化音效庫與預設包</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ❓ 8. 常見問題 (FAQ) */}
      <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>常見問題</h2>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ borderLeft: '4px solid #38bdf8', paddingLeft: '1.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#e2e8f0' }}>我沒有 IT 背景，也能使用 Lifreedom 嗎？</h4>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>絕對可以。本系統專為音樂人打造，無需設定複雜的 API Key 或伺服器，只要會用瀏覽器，就能開始你的混音道場修煉。</p>
          </div>
          <div style={{ borderLeft: '4px solid #38bdf8', paddingLeft: '1.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#e2e8f0' }}>這與一般的混音教學影片有什麼不同？</h4>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>教學影片是單向的，而我們是「雙向互動」。透過 Web Audio 實驗室與 AI 聽診，你可以親自拖曳滑桿、聽見改變，在實作中獲得頓悟。</p>
          </div>
          <div style={{ borderLeft: '4px solid #38bdf8', paddingLeft: '1.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#e2e8f0' }}>免費版有哪些限制？</h4>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>免費版提供您每日基本的 AI 助理對話額度，以及部分實驗室的體驗。升級至 Producer 方案後，即可解鎖無限對話與所有互動音軌功能。</p>
          </div>
        </div>
      </div>

      {/* 🚀 9. 底部引導 (Footer CTA) */}
      <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 100%, #1e1b4b 0%, #020617 70%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#f8fafc' }}>準備好開啟音樂煉金術了嗎？</h2>
        <Link href="/courses" style={{ display: 'inline-block', padding: '1rem 4rem', background: '#38bdf8', color: '#020617', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)' }}>
          立即登入道場
        </Link>
        <div style={{ marginTop: '4rem', color: '#475569', fontSize: '0.9rem' }}>
          © 2026 Lifreedom Studio. All rights reserved.
        </div>
      </div>

    </div>
  );
}