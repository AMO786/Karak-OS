import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoTeapot } from '../components/ui/Logo';

const Login = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const user = useAuthStore((state) => state.user);

    const handleLogin = (currentPin = pin) => {
        login(currentPin);
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
            setError('Invalid Access Code');
            setPin('');
        }
    };

    const handleNumClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');
            if (newPin.length === 4) {
                handleLogin(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/pos');
        }
    }, [user, navigate]);

    // Numpad Support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
                if (pin.length < 4) handleNumClick(e.key);
            } else if (e.key === 'Backspace') {
                handleDelete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pin]);

    return (

        <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-y-auto">
            {/* Left Side - Visuals */}
            <div className="w-full lg:w-1/2 bg-velvet relative overflow-hidden flex items-center justify-center p-12 min-h-[300px] lg:min-h-screen">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-velvet to-black" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/10 rounded-full animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gold/20 rounded-full" />

                <div className="relative z-10 text-center">
                    <LogoTeapot className="w-32 h-32 lg:w-48 lg:h-48 text-gold mx-auto mb-6 drop-shadow-2xl" />
                    <h1 className="text-4xl lg:text-6xl font-serif text-cream mb-2 tracking-tight">KarakOS</h1>
                    <div className="h-1 w-24 bg-gold mx-auto rounded-full" />
                    <p className="text-gold/60 mt-4 tracking-[0.3em] text-xs lg:text-sm uppercase">Luxury Point of Sale</p>
                </div>
            </div>

            {/* Right Side - Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
                <div className="max-w-md w-full space-y-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-serif text-velvet">Welcome Back</h2>
                        <p className="text-velvet/50">Enter your access code to begin</p>
                    </div>

                    {/* PIN Display */}
                    <div className="flex justify-center gap-4 mb-8">
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={false}
                                animate={{
                                    height: pin[i] ? 20 : 4,
                                    width: pin[i] ? 20 : 20,
                                    backgroundColor: pin[i] ? '#d4af37' : '#2d020020'
                                }}
                                className="rounded-full"
                            />
                        ))}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumClick(num.toString())}
                                className="h-16 w-16 rounded-full text-xl font-serif text-velvet border border-velvet/10 flex items-center justify-center hover:bg-velvet hover:text-gold hover:border-transparent transition-all active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                        <div />
                        <button
                            onClick={() => handleNumClick('0')}
                            className="h-16 w-16 rounded-full text-xl font-serif text-velvet border border-velvet/10 flex items-center justify-center hover:bg-velvet hover:text-gold hover:border-transparent transition-all active:scale-95"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="h-16 w-16 rounded-full text-velvet/50 flex items-center justify-center hover:text-red-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-500 text-sm text-center py-3 rounded-lg border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="text-center lg:text-left space-y-2 pt-10">
                        <p className="text-velvet/30 text-xs font-mono">System ID: KarakOS-V1.0</p>
                        <p className="text-velvet/20 text-[10px] font-sans">© The Software Concierge 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
