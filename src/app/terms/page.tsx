"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TermsPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '3rem 1.5rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* 💡 UX 升級 3️⃣：更具國際產品感的雙語返回按鈕 */}
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
                    {/* 💡 UX 升級 2️⃣：人性化的 Early Access 頂部提醒 */}
                    <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        🚀 YOU&apos;RE CURRENTLY USING AN EARLY ACCESS VERSION OF LIFREEDOM.
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>使用條款 (Terms of Service)</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontFamily: 'monospace' }}>最後更新日期：2026 年 6 月</p>
                </div>

                {/* 內文區 */}
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <section>
                        {/* 💡 UX 升級 1️⃣：更溫暖、具備「產品感」的非正式語氣 Intro */}
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #818cf8', marginBottom: '1.5rem' }}>
                            👋 這些條款的目的是確保每位使用者在使用 Lifreedom 時，都能獲得清晰且公平的體驗。
                        </p>
                        <p>
                            歡迎使用由 LiFreedom Studio（以下簡稱「我們」）營運的 Lifreedom - AI Ear Training for Musicians（以下簡稱「本服務」）。
                            藉由存取或使用本服務，即表示您同意受本條款之約束。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. 服務說明 (Description of Service)</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Lifreedom 是一個互動式的網頁版 AI 聽覺訓練平台，旨在幫助音樂人與創作者提升對聲音、空間及混音概念的感知與理解能力。本服務可能包含：
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>音訊播放與對比工具</li>
                            <li>互動式訓練任務</li>
                            <li>AI 輔助回饋功能</li>
                            <li>與音樂製作及聲音設計相關之教育內容</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. 搶先體驗免責聲明 (Early Access Disclaimer)</h2>
                        <p style={{ marginBottom: '1rem' }}>本服務目前處於搶先體驗（Early Access）階段。使用本服務即表示您了解並同意：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>系統功能可能會隨時更改、改進或移除</li>
                            <li>內容仍在持續開發與擴進中</li>
                            <li>系統可能會出現 Bug 或不一致的情況</li>
                            <li>我們非常感謝您提供回饋，協助我們持續改善產品</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. 帳號與存取 (Account & Access)</h2>
                        <p style={{ marginBottom: '1rem' }}>您可能需要建立帳號才能使用部分功能。在此規範下：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>您有責任妥善保管您的帳號與登入資訊之機密性。</li>
                            <li>您同意對您帳號下發生的所有活動負責。</li>
                            <li>對於因未經授權存取您帳號所造成的任何損失或損害，我們概不負責。</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. 使用者責任 (User Responsibilities)</h2>
                        <p style={{ marginBottom: '1rem' }}>您同意：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>僅將本服務用於合法用途</li>
                            <li>不試圖剝削、反向工程或破壞本平台</li>
                            <li>不濫用 AI 功能（例如：發送過多自動化請求或惡意抓取）</li>
                        </ul>
                        <p>您須對自己的學習進度與使用行為負最終責任。</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>5. 智慧財產權 (Intellectual Property)</h2>
                        <p style={{ marginBottom: '1rem' }}>本平台上的所有內容，包含：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>音訊檔案與專屬訓練音軌</li>
                            <li>教育性排版、藍圖與訓練教材</li>
                            <li>UI/UX 設計、視覺化工具與互動元件</li>
                        </ul>
                        <p>除非另有說明，否則皆歸 LiFreedom Studio 所有。未經明確的書面許可，您不得複製、重新發布或重複使用這些內容。</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>6. AI 功能規範 (AI Features)</h2>
                        <p style={{ marginBottom: '1rem' }}>本服務的部分內容可能包含 AI 生成之回饋與輔助。您了解並同意：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>AI 的回覆僅供教育指導與聽覺特訓參考</li>
                            <li>這些回覆可能無法保證 100% 準確、完整，或完全符合特定 DAW 的設定參數</li>
                            <li>這些回覆不應被視為專業或決定性的技術建議</li>
                        </ul>
                        <p>我們保留限制或調整 AI 使用量的權利，以確保公平存取、處理速度及系統穩定性。</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>7. 付款與存取權限 (Payments & Access)</h2>
                        <p style={{ marginBottom: '1rem' }}>若您購買了進階或訂閱制訓練方案：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>您將獲得額外結構模組與工具的存取權限</li>
                            <li>權限可能基於訂閱制，且除非手動取消，否則將自動續訂</li>
                            <li>特定方案所包含的功能可能會隨時間演進以保持內容更新</li>
                        </ul>
                        <p style={{ marginBottom: 0 }}>
                            我們保留修改定價與結構功能的權利。退款相關規定，請另行參閱我們的 <Link href="/refund" style={{ color: '#38bdf8', textDecoration: 'none' }}>退款政策 (Refund Policy)</Link> 頁面。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>8. 服務終止 (Termination)</h2>
                        <p style={{ marginBottom: '1rem' }}>若發生以下情況，我們保留立即暫停或終止您存取本平台之權利：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>您違反本使用條款</li>
                            <li>您濫用本平台、系統資產或自動化服務</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>9. 責任限制 (Limitation of Liability)</h2>
                        <p style={{ marginBottom: '1rem' }}>本服務是按「現況 (as is)」及「現有 (as available)」基礎提供。</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>我們不對任何特定的學習成果或技能掌握速度負責。</li>
                            <li>我們不對因使用本服務而導致的任何直接、間接或附帶之損失或損害負責。</li>
                        </ul>
                        <p style={{ fontWeight: 'bold', color: '#fca311' }}>
                            在法律允許的最大範圍內，我們免除所有明示或暗示的保證 (To the maximum extent permitted by law, we disclaim all warranties)。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>10. 準據法 (Governing Law)</h2>
                        <p style={{ margin: 0 }}>
                            本條款之解釋與適用，應以台灣（Taiwan）法律為準據法，且不適用其衝突法原則。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>11. 條款變更 (Changes to Terms)</h2>
                        <p style={{ margin: 0 }}>
                            我們保留隨時更新或更改本條款的權利。若您在我們發布任何變更後繼續使用本服務，即表示您接受該更新後之條款。
                        </p>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>12. 聯絡我們 (Contact)</h2>
                        <p style={{ margin: 0 }}>
                            如果您對本條款有任何疑問，請透過以下信箱聯絡 LiFreedom Studio：<br />
                            <a href="mailto:xlifreedom305x@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '0.6rem', fontSize: '1.1rem' }}>
                                xlifreedom305x@gmail.com
                            </a>
                        </p>
                    </section>

                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem', color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    © 2026 LiFreedom Studio. All rights reserved.
                </div>

            </div>
        </div>
    );
}