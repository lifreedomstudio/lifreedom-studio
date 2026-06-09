"use client";
import { useRouter } from 'next/navigation';

export default function RefundPolicyPage() {
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
                <div style={{ paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        🚀 YOU&apos;RE CURRENTLY USING AN EARLY ACCESS VERSION OF LIFREEDOM.
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>退款政策 (Refund Policy)</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontFamily: 'monospace' }}>最後更新日期：2026 年 6 月</p>
                </div>

                {/* 💡 UX 加分：快速總覽 (TL;DR) */}
                <div style={{ background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
                    <h3 style={{ color: '#fbbf24', fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⚡ 快速總覽 (Quick Summary)
                    </h3>
                    <ul style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li><strong style={{ color: '#fff' }}>數位產品性質：</strong>原則上授權開通後不予退款。</li>
                        <li><strong style={{ color: '#fff' }}>例外狀況：</strong>僅限系統錯誤扣款，或出現無法修復的嚴重技術 Bug。</li>
                        <li><strong style={{ color: '#fff' }}>期限：</strong>任何退款申請皆須於購買日起 <strong style={{ color: '#fca311' }}>7 天內</strong>提出。</li>
                        <li><strong style={{ color: '#fff' }}>訂閱制：</strong>隨時可取消，但已扣款的週期恕無「依比例」退費。</li>
                    </ul>
                </div>

                {/* 內文區 */}
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <section>
                        {/* 💡 產品感理念 Intro */}
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #818cf8', marginBottom: '1.5rem' }}>
                            👋 我們深信建立一個公平、透明的學習體驗是產品的基石（We believe in building a fair and transparent learning experience）。這份政策旨在保障您的權益，同時也確保我們能永續提供優質的服務。
                        </p>
                        <p>
                            {/* 💡 修正重點：將產品名稱更正為最新品牌副標 */}
                            感謝您使用 Lifreedom - AI Ear Training for Musicians（以下簡稱「本服務」）。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. 一般政策 (General Policy)</h2>
                        <p>
                            由於本產品為「數位內容與線上服務」之性質，一旦您的帳號獲得授權並開通存取權限，原則上所有購買皆<strong style={{ color: '#fca311' }}>不予退款</strong>。
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. 例外情況 (Exceptions)</h2>
                        <p style={{ marginBottom: '1rem' }}>在以下情況中，我們可能會為您提供退款：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>系統錯誤導致重複扣款或錯誤收費。</li>
                            <li>您遇到了嚴重的技術性問題導致完全無法使用平台核心功能，<strong style={{ color: '#fff' }}>且在聯繫客服後仍無法於合理時間內修復解決</strong>。</li>
                            <li>您在<strong style={{ color: '#fff' }}>原始購買日起的 7 天內</strong>主動與我們聯繫。</li>
                        </ul>
                        <p>所有退款申請我們將會進行個案審查（case-by-case basis）。</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. 退款處理與金流責任 (Payments & Refund Process)</h2>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>退款方式：</strong>若退款獲核准，款項將退回您的原始付款方式（Approved refunds will be issued to the original payment method）。</li>
                            <li><strong style={{ color: '#fff' }}>第三方金流：</strong>所有的付款皆透過第三方支付供應商（如 Stripe、Apple Pay 等）處理。我們不儲存您的信用卡資訊，亦不對第三方支付服務本身造成的系統異常或延遲負責。</li>
                            <li><strong style={{ color: '#fff' }}>手續費：</strong>由第三方支付供應商或銀行端所收取的任何交易手續費，可能無法退還。</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. 搶先體驗須知 (Early Access Notice)</h2>
                        <p style={{ marginBottom: '1rem' }}>本產品目前處於搶先體驗（Early Access）階段。購買即表示您了解並同意以下事項：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>系統功能與介面可能會隨時間進行調整或更新</li>
                            <li>部分訓練內容可能仍處於未完成或持續演進的狀態</li>
                        </ul>
                        <p>上述產品狀態的不確定性，已經反映在我們當前提供的定價策略中，因此不能單純以「功能未完善」作為退款理由。</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>5. 訂閱取消 (Subscription Cancellation)</h2>
                        <p style={{ marginBottom: '1rem' }}>如果您使用的是定期扣款的訂閱方案：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>您可以隨時取消訂閱，系統將不會在下一個週期向您收費。</li>
                            <li>取消後，您的帳號權限將會保留，直到目前的計費週期結束為止。</li>
                            <li>針對已扣款的計費週期，我們<strong style={{ color: '#fff' }}>不提供</strong>依比例（未使用的天數）退款。</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>6. 濫用防範政策 (Abuse Policy)</h2>
                        <p style={{ marginBottom: '1rem' }}>為保護平台生態，在以下情況下，我們保留拒絕退款的權利：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>該帳號已被大量使用，或已完成大部分的訓練內容。</li>
                            <li>有證據顯示使用者惡意濫用平台資源（例如：大量且異常地請求 AI 分析功能）或違反使用條款。</li>
                        </ul>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>7. 申請退款 (Contact)</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            如需申請退款，請來信至客服信箱：<br />
                            <a href="mailto:xlifreedom305x@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '0.6rem', fontSize: '1.1rem' }}>
                                xlifreedom305x@gmail.com
                            </a>
                        </p>
                        <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>來信時請務必包含以下資訊，以利我們加速處理您的申請：</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>
                            <li>您的註冊帳號 Email</li>
                            <li>原始購買日期</li>
                            <li>申請退款的具體原因</li>
                        </ul>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>
                            ⏳ 我們將會在 3–5 個工作天內盡快回覆您的請求。
                        </p>
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