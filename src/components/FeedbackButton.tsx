"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/feedback')}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 9999, // 確保它永遠浮在最上層
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(56, 189, 248, 0.6)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.4)';
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <span>給點建議</span>
        </button>
    );
}