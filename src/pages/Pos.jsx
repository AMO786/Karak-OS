import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import MenuGrid from '../components/pos/MenuGrid';
import CartSidebar from '../components/pos/CartSidebar';
import { LogOut, ClipboardList } from 'lucide-react';
import CheckoutModal from '../components/pos/CheckoutModal';
import OrdersView from '../components/admin/OrdersView';
import { motion, AnimatePresence } from 'framer-motion';

import { LogoTeapot } from '../components/ui/Logo';
import { Menu, X } from 'lucide-react'; // Import Menu/X for mobile toggle

const Pos = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile sidebar toggle
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-screen w-screen bg-cream overflow-hidden font-sans relative"
        >
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
                {/* Minimalist Header */}
                <header className="h-20 lg:h-28 px-4 lg:px-8 flex items-center justify-between shrink-0 bg-transparent pt-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <LogoTeapot className="h-16 w-16 lg:h-24 lg:w-24 text-velvet drop-shadow-sm" />
                        <div>
                            {/* <h1 className="text-3xl font-serif text-velvet tracking-tight leading-none">Karak Kulture</h1> */}
                            <div className="flex items-center gap-3 mt-1 pl-2">
                                <span className="h-px w-8 bg-gold/50 block"></span>
                                <p className="text-[10px] text-velvet/50 font-bold tracking-[0.2em] uppercase">KarakOS Terminal</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center gap-6">
                        {/* Clock */}
                        <div className="hidden lg:block text-right mr-4">
                            <p className="text-xl font-serif text-velvet font-bold leading-none">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs text-velvet/40 font-medium uppercase tracking-wider">
                                {currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                            </p>
                        </div>

                        <div className="text-right hidden md:block">
                            <p className="text-xs text-velvet/40 font-bold uppercase tracking-widest mb-0.5">Operator</p>
                            <p className="text-velvet font-serif text-lg leading-none">{user?.name || 'Staff'}</p>
                        </div>
                        <div className="h-10 w-px bg-velvet/10 mx-2 hidden md:block" />
                        <button
                            onClick={() => setIsQueueOpen(true)}
                            className="hidden md:flex group items-center gap-2 text-velvet/60 hover:text-velvet transition-colors mr-4"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">Queue</span>
                            <div className="w-10 h-10 rounded-full border border-velvet/20 flex items-center justify-center group-hover:bg-velvet group-hover:text-gold transition-all">
                                <ClipboardList className="w-4 h-4" />
                            </div>
                        </button>
                        <div className="h-10 w-px bg-velvet/10 mx-2 hidden md:block" />
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex group items-center gap-2 text-velvet/60 hover:text-velvet transition-colors"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">Exit</span>
                            <div className="w-10 h-10 rounded-full border border-velvet/20 flex items-center justify-center group-hover:bg-velvet group-hover:text-gold transition-all">
                                <LogOut className="w-4 h-4" />
                            </div>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-velvet"
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </header >

                <MenuGrid />
            </div >

            {/* Right Sidebar - Desktop: Visible, Mobile: Slide-over */}
            <div className={`
                fixed inset-y-0 right-0 z-50 w-80 lg:w-96 bg-cream border-l border-velvet/5 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:block
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
                {/* Mobile Logout/Queue in Sidebar */}
                <div className="lg:hidden absolute bottom-0 w-full p-4 bg-cream border-t border-velvet/10 flex justify-between">
                    <button onClick={() => setIsQueueOpen(true)} className="flex flex-col items-center gap-1 text-velvet/60"><ClipboardList size={20} /><span className="text-[10px]">Queue</span></button>
                    <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400"><LogOut size={20} /><span className="text-[10px]">Exit</span></button>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {
                isCheckoutOpen && (
                    <CheckoutModal
                        isOpen={isCheckoutOpen}
                        onClose={() => setIsCheckoutOpen(false)}
                    />
                )
            }

            {/* Queue Modal */}
            <AnimatePresence>
                {isQueueOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-cream rounded-3xl w-full max-w-6xl h-[85vh] overflow-hidden shadow-2xl flex flex-col relative"
                        >
                            <button
                                onClick={() => setIsQueueOpen(false)}
                                className="absolute top-6 right-6 z-50 bg-white/50 hover:bg-white p-2 rounded-full transition-colors"
                            >
                                <LogOut className="w-5 h-5 text-velvet" />
                            </button>
                            <div className="flex-1 overflow-y-auto p-8">
                                <OrdersView />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div >
    );
};

export default Pos;
