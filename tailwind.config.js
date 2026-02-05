/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                cream: '#fcfbf7',
                velvet: '#2d0200',
                maroon: '#570401',
                gold: '#d4af37',
                'gold-light': '#f3e5ab',
                'glass-white': 'rgba(255, 255, 255, 0.9)',
                'glass-dark': 'rgba(45, 2, 0, 0.9)',
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #d4af37 100%)',
                'luxury-gradient': 'radial-gradient(circle at top left, #fcfbf7, #f0e6d2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'shimmer': 'shimmer 3s infinite linear',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            },
            boxShadow: {
                'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
                'velvet': '0 10px 30px rgba(45, 2, 0, 0.2)',
            }
        },
    },
    plugins: [],
}
