import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Coffee, Settings, LogOut, ClipboardList } from 'lucide-react';
import DashboardView from '../components/admin/DashboardView';
import MenuView from '../components/admin/MenuView';
import SettingsView from '../components/admin/SettingsView';
import OrdersView from '../components/admin/OrdersView';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders Queue', icon: ClipboardList },
        { id: 'menu', label: 'Menu Manager', icon: Coffee },
        { id: 'settings', label: 'System Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-transparent">
            {/* Glass Sidebar */}
            <div className="w-72 glass-dark m-4 rounded-3xl flex flex-col p-6 z-20">
                <div className="mb-10 flex items-center gap-4 px-2">
                    <div className="bg-cream/10 p-2 rounded-xl">
                        <span className="font-bold text-cream text-lg">KK</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl leading-none text-cream tracking-tight">KARAK</h1>
                        <p className="text-[10px] opacity-50 tracking-[0.2em] font-medium mt-1">ADMINISTRATOR</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-medium transition-all relative overflow-hidden group ${activeTab === tab.id ? 'text-maroon' : 'text-cream/60 hover:text-cream hover:bg-white/5'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-cream rounded-2xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-4">
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-200 hover:bg-white/10 hover:text-red-100 transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 pl-0 overflow-y-auto">
                <div className="h-full bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'dashboard' && <DashboardView />}
                                {activeTab === 'orders' && <OrdersView />}
                                {activeTab === 'menu' && <MenuView />}
                                {activeTab === 'settings' && <SettingsView />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
