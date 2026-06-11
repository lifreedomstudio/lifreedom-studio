"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
    const router = useRouter();

    useEffect(() => {
        // 1. 進入頁面瞬間，強制將畫面推回最上方
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // 2. 為了防止 Tally iframe 載入完成瞬間的自動對焦把畫面往下拉，加一個短延遲保護
        const scrollTimeout = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 300);

        // 3. 安全載入 Tally 的腳本，確保 iframe 高度會自動展開
        const script = document.createElement("script");
        script.src = "https://tally.so/widgets/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            clearTimeout(scrollTimeout);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#64748b'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                    ⬅️ 返回
                </button>
            </div>

            {/* 這裡已經自動幫你換成你的 Tally ID (ZjelzB) 了！ */}
            <iframe
                data-tally-src="https://tally.so/embed/ZjelzB?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="200"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title="聲音實驗室：早期體驗回饋"
                style={{ maxWidth: '800px', border: 'none' }}
            ></iframe>
        </div>
    );
}