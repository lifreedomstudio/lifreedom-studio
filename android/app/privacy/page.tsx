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
                    {/* 💡 必改清單 4️⃣：Early Access 橫幅提醒 */}
                    <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        🚀 THIS IS AN EARLY-ACCESS VERSION OF THE PRODUCT.
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>Privacy Policy</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontFamily: 'monospace' }}>Last updated: June 2026</p>
                </div>

                {/* 內文區 */}
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <section>
                        {/* 💡 必改清單 1️⃣ & 3️⃣：品牌名稱統一與平台性質修正 */}
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #818cf8', marginBottom: '1.5rem' }}>
                            LiFreedom Studio (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates Lifreedom - AI Ear Training for Musicians, a web-based interactive training platform (the &quot;Service&quot;).
                        </p>
                        <p>
                            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. Information Collection and Use</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We collect several different types of information for various purposes to provide and improve our Service to you.
                        </p>

                        <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '1rem' }}>Types of Data Collected:</h3>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li>
                                <strong style={{ color: '#fff' }}>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes, but is not limited to, your Email address.
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>Device Permissions:</strong> Our Service may request access to your Camera and Photo Library to allow you to take and upload photos of audio hardware/software interfaces for AI analysis features.
                            </li>
                            {/* 💡 必改清單 2️⃣：加入 AI / 音訊分析的免責宣告 */}
                            <li>
                                <strong style={{ color: '#fca311' }}>Audio & AI Data:</strong> Audio interactions may be analyzed to improve the training experience and provide personalized feedback.
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>Local Storage & Sessions:</strong> We use local storage and session technologies to remember your training progress and preferences within the app.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. Use of Data</h2>
                        <p style={{ marginBottom: '1rem' }}>LiFreedom Studio uses the collected data for various purposes:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>To provide and maintain the Service</li>
                            <li>To allow you to participate in interactive features of our Service</li>
                            <li>To provide customer care and support</li>
                            <li>To monitor the usage of the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. Transfer and Disclosure of Data</h2>
                        <p>
                            Your information, including Personal Data, will NOT be sold, shared, or rented to any third parties. We only use secure database management and authentication.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. Security of Data</h2>
                        <p>
                            The security of your data is important to us, and we strive to use commercially acceptable means to protect your Personal Data. However, remember that no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>5. Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>
                    </section>

                    <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>6. Contact Us</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            If you have any questions about this Privacy Policy, please contact us by email:
                        </p>
                        {/* 💡 修正 5️⃣：確保 mailto 的信箱與顯示的信箱完全一致 */}
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