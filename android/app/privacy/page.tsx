import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 prose prose-slate">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy for MixDojo</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: May 28, 2026</p>

            <p className="mb-6">
                LiFreedom Studio ("us", "we", or "our") operates the MixDojo mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information Collection and Use</h2>
            <p className="mb-4">
                We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">Types of Data Collected:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                    <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes, but is not limited to, your <strong>Email address</strong> (used for authentication via Supabase).
                </li>
                <li>
                    <strong>Device Permissions:</strong> Our Service may request access to your <strong>Camera and Photo Library</strong> to allow you to take and upload photos of audio hardware/software interfaces for AI analysis features.
                </li>
                <li>
                    <strong>Local Storage & Sessions:</strong> We use local storage and session technologies to remember your training progress and preferences within the app.
                </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Data</h2>
            <p className="mb-4">MixDojo uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>To provide and maintain the Service</li>
                <li>To allow you to participate in interactive features of our Service</li>
                <li>To provide customer care and support</li>
                <li>To monitor the usage of the Service</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Transfer and Disclosure of Data</h2>
            <p className="mb-6">
                Your information, including Personal Data, will NOT be sold, shared, or rented to any third parties. We only use Supabase for secure database management and authentication.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Security of Data</h2>
            <p className="mb-6">
                The security of your data is important to us, and we strive to use commercially acceptable means to protect your Personal Data.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
            <p className="mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us by email:
            </p>
            <a href="mailto:luoweikai@gmail.com" className="text-blue-600 hover:underline">
                luoweikai@gmail.com
            </a>
        </div>
    );
}