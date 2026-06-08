"use client";
import { useRouter } from 'next/navigation';

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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem 0' }}>Terms of Service</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontFamily: 'monospace' }}>Last updated: June 2026</p>
                </div>

                {/* 內文區 */}
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <section>
                        {/* 💡 UX 升級 1️⃣：更溫暖、具備「產品感」的非正式語氣 Intro */}
                        <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #818cf8', marginBottom: '1.5rem' }}>
                            👋 These Terms are here to make sure everyone has a clear and fair experience while using Lifreedom.
                        </p>
                        <p>
                            Welcome to Lifreedom Auditory Training System (&quot;Service&quot;), operated by LiFreedom Studio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                            By accessing or using this Service, you agree to be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. Description of Service</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Lifreedom is an interactive, web-based auditory training platform designed to help users improve their ability to perceive and understand sound, music, and audio mixing concepts. This Service may include:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>Audio playback and comparison tools</li>
                            <li>Interactive training exercises</li>
                            <li>AI-assisted feedback features</li>
                            <li>Educational content related to music production and sound design</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. Early Access Disclaimer</h2>
                        <p style={{ marginBottom: '1rem' }}>This is an early-access version of the Service. By using this Service, you acknowledge that:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>Features may change, improve, or be removed at any time</li>
                            <li>Content is still under development</li>
                            <li>Bugs or inconsistencies may occur</li>
                            <li>We appreciate your feedback as part of improving the product.</li>
                        </ul>
                    </section>

                    {/* 💡 修正 1️⃣：新增「帳號與存取」安全責任條款 */}
                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. Account & Access</h2>
                        <p style={{ marginBottom: '1rem' }}>You may need to create an account to access certain features. Under this provision:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>You are responsible for maintaining the confidentiality of your account and login information.</li>
                            <li>You agree to accept responsibility for all activities that occur under your account.</li>
                            <li>We are not liable for any loss or damage resulting from unauthorized access to your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. User Responsibilities</h2>
                        <p style={{ marginBottom: '1rem' }}>You agree to:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>Use the Service for lawful purposes only</li>
                            <li>Not attempt to exploit, reverse engineer, or disrupt the platform</li>
                            <li>Not misuse AI features (e.g. excessive automated requests)</li>
                        </ul>
                        <p>You are responsible for your own learning progress and usage.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>5. Intellectual Property</h2>
                        <p style={{ marginBottom: '1rem' }}>All content on this platform, including:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>Audio files and specialized training tracks</li>
                            <li>Educational layouts, blueprints, and training materials</li>
                            <li>UI/UX design, visual visualizers, and interactive components</li>
                        </ul>
                        {/* 💡 修正 5️⃣：公司名稱統一為 LiFreedom Studio */}
                        <p>are owned by LiFreedom Studio unless otherwise stated. You may not copy, redistribute, or reuse content without explicit written permission.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>6. AI Features</h2>
                        <p style={{ marginBottom: '1rem' }}>Some parts of the Service may include AI-generated feedback and assistance. You acknowledge that:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>AI responses are for educational guidance and mental ear-training purposes only</li>
                            <li>They may not always be accurate, complete, or perfectly aligned with specific DAW setups</li>
                            <li>They should not be considered professional or definitive technical advice</li>
                        </ul>
                        <p>We reserve the right to limit or adjust AI usage to ensure fair access, processing speed, and system stability.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>7. Payments & Access</h2>
                        <p style={{ marginBottom: '1rem' }}>If you purchase a premium or subscription-based training plan:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>You will receive access to additional structural modules and tools</li>
                            <li>Access may be subscription-based and renew automatically unless canceled</li>
                            <li>Features included in specific tiers may evolve over time to stay current</li>
                        </ul>
                        {/* 💡 修正 2️⃣：新增與 Refund Policy 頁面的關聯宣告 */}
                        <p style={{ marginBottom: 0 }}>
                            We reserve the right to modify pricing and structural features. Refund policies are described separately on our Refund Policy page.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>8. Termination</h2>
                        <p style={{ marginBottom: '1rem' }}>We reserve the right to suspend or terminate your access to the platform immediately if:</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>You violate these Terms of Service</li>
                            <li>You misuse the platform, system assets, or automated services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>9. Limitation of Liability</h2>
                        <p style={{ marginBottom: '1rem' }}>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.</p>
                        <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <li>We are not liable for any specific learning outcomes or skill mastery speed.</li>
                            <li>We are not liable for any direct, indirect, or incidental loss or damage resulting from the use of the Service.</li>
                        </ul>
                        {/* 💡 修正 3️⃣：強化法律防禦力的標準核心免責句 */}
                        <p style={{ fontWeight: 'bold', color: '#fca311' }}>
                            To the maximum extent permitted by law, we disclaim all warranties, whether express or implied.
                        </p>
                    </section>

                    {/* 💡 修正 4️⃣：新增「適用法律」管轄條款 */}
                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>10. Governing Law</h2>
                        <p style={{ margin: 0 }}>
                            These Terms shall be governed by and construed in accordance with the laws of Taiwan, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>11. Changes to Terms</h2>
                        <p style={{ margin: 0 }}>
                            We reserve the right to update or change these Terms at any time. Your continued use of the Service following the posting of any changes constitutes acceptance of those updated Terms.
                        </p>
                    </section>

                    {/* 💡 修正 5️⃣：聯絡區塊統一改為 LiFreedom Studio */}
                    <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>12. Contact</h2>
                        <p style={{ margin: 0 }}>
                            If you have any questions regarding these Terms, please contact LiFreedom Studio at:<br />
                            <a href="mailto:luoweikai@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '0.6rem', fontSize: '1.1rem' }}>
                                xlifreedom305x@gmail.com
                            </a>
                        </p>
                    </section>

                </div>

                {/* 💡 修正 5️⃣：頁尾統一改為 LiFreedom Studio */}
                <div style={{ textAlign: 'center', marginTop: '5rem', color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    © 2026 LiFreedom Studio. All rights reserved.
                </div>

            </div>
        </div>
    );
}