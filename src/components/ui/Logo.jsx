import React from 'react';

export const Logo = ({ className }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Teapot Body */}
            <path d="M20 16V9a3 3 0 0 0-3-3h-3.6c-2.8 0-3.8 2.5-3.8 2.5" />
            <path d="M4 10h12v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7z" />
            <line x1="8" y1="10" x2="8" y2="6" />
            <path d="M7 6h6l-1-2H8z" />

            {/* Spout filling cup */}
            <path d="M20 12l2 1" /> {/* Spout tip */}

            {/* Liquid Stream */}
            <path d="M20 16c0 1.5-1 3-2.5 3" strokeDasharray="2 2" />

            {/* Cup */}
            <path d="M15 19v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1" />

            {/* Decorative Steam */}
            <path d="M10 3s1-1 3 0" />
            <path d="M7 3s1-1 3 0" />
        </svg>
    );
};

export const LogoTeapot = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
    >
        {/* Abstract Teapot */}
        <path d="M30 40 Q20 40 20 60 Q20 85 50 85 Q80 85 80 60 Q80 40 70 40 Z" />
        <path d="M30 40 C30 25 70 25 70 40" /> {/* Lid */}
        <path d="M50 25 V20" /> {/* Knob */}

        {/* Handle */}
        <path d="M80 50 Q95 50 95 65 Q95 80 75 75" strokeLinecap="round" />

        {/* Spout */}
        <path d="M20 50 Q5 45 10 35" strokeLinecap="round" />

        {/* Pouring Liquid */}
        <path d="M10 35 Q12 50 12 70" strokeDasharray="4 4" className="animate-pulse" />

        {/* Cup */}
        <path d="M5 75 Q5 90 20 90 H25" strokeLinecap="round" />
    </svg>
);
