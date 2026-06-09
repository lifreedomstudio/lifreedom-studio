"use client";
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '3rem 1.5rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* 返回按鈕 */}
                <button
                    onClick={() => router.push('/')}
                    style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.6rem 1.4rem', borderRadius: '50px', cursor: 'pointer', marginBottom: '2.5rem', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#64748b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                    ← 返回首頁 Back to Home
                </button>

                {/* 標題區 */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '3rem' }}>
                    {/* 💡 統一的 Early Access 頂部提醒 */}
                    <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        🚀 YOU&apos;RE CURRENTLY USING AN EARLY ACCESS VERSION OF LIFREEDOM.
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>隱私權政策 (Privacy Policy)</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontFamily: 'monospace' }}>最後更新日期：2026 年 6 月</p>
                </div>

                {/* 內文區 */}
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <section>
                        {/* 💡 產品感理念 Intro */}
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #818cf8', marginBottom: '1.5rem' }}>
                            👋 我們非常重視您的隱私安全。這份政策將清楚說明當您使用 Lifreedom 時，我們如何收集、保護並妥善運用您的資料。
                        </p>
                        <p>
                            LiFreedom Studio（以下簡稱「我們」）負責營運 Lifreedom - AI Ear Training for Musicians 網頁版互動式訓練平台（以下簡稱「本服務」）。
                            藉由存取或使用本服務，即表示您同意本政策所描述的資料收集與使用方式。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. 資訊收集與使用 (Information Collection and Use)</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            為了向您提供並持續優化本服務，我們會收集幾種不同類型的資訊。
                        </p>

                        <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '1rem' }}>收集的資料類型：</h3>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li>
                                <strong style={{ color: '#fff' }}>個人資料 (Personal Data)：</strong> 當您使用本服務時，我們可能會要求您提供某些可用於聯絡或識別您身分的個人資訊，這包含但不限於您的 電子郵件信箱 (Email address)。
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>裝置權限 (Device Permissions)：</strong> 我們的服務可能會要求存取您的相機與相簿，以便您在使用 AI 分析功能時，能夠拍攝或上傳音訊軟硬體介面的截圖。
                            </li>
                            <li>
                                <strong style={{ color: '#fca311' }}>音訊與 AI 數據 (Audio & AI Data)：</strong> 我們可能會對您上傳的音訊互動內容與對話進行分析，以提供專屬的個人化 AI 回饋，並藉此持續提升聽覺訓練的整體體驗。
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>本地儲存與工作階段 (Local Storage & Sessions)：</strong> 我們使用本地儲存 (Local Storage) 與 Session 技術來記憶您在平台中的訓練進度與個人偏好設定。
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. 資料的使用方式 (Use of Data)</h2>
                        <p style={{ marginBottom: '1rem' }}>LiFreedom Studio 將收集來的資料用於以下用途：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>提供並維護本服務的正常運作</li>
                            <li>讓您能夠順利參與本服務的互動式訓練功能</li>
                            <li>提供客戶服務與技術支援</li>
                            <li>監測本服務的使用情況以進行系統優化</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. 資料的轉移與揭露 (Transfer and Disclosure of Data)</h2>
                        <p>
                            您的所有資訊（包含個人資料）<strong style={{ color: '#fff' }}>絕對不會</strong>被出售、分享或出租給任何第三方。我們僅使用安全可靠的資料庫管理系統與身分驗證機制來存儲與保護您的資料。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. 資料安全 (Security of Data)</h2>
                        <p>
                            您的資料安全對我們至關重要，我們致力於使用商業上可接受的高標準來保護您的個人資料。但請注意，網際網路上的傳輸方法或電子儲存方式皆無法保證 100% 的絕對安全。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>5. 隱私權政策的變更 (Changes to This Privacy Policy)</h2>
                        <p>
                            我們可能會不定期更新這份隱私權政策。若有任何變更，我們將會在此頁面上發布新的政策內容以通知您。
                        </p>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>6. 聯絡我們 (Contact Us)</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            如果您對本隱私權政策有任何疑問，歡迎透過電子郵件與我們聯繫：
                        </p>
                        <a href="mailto:xlifreedom305x@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', fontSize: '1.1rem' }}>
                            xlifreedom305x@gmail.com
                        </a>
                    </section>

                </div>

                {/* 統一的 Footer 標示 */}
                <div style={{ textAlign: 'center', marginTop: '5rem', color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    © 2026 LiFreedom Studio. All rights reserved.
                </div>

            </div>
        </div>
    );
}