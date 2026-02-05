import React, { useState, useMemo } from 'react';
import { useOrderStore } from '../../stores/useOrderStore';
import { DollarSign, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';


const DashboardView = () => {
    const orders = useOrderStore((state) => state.orders);
    const [filter, setFilter] = useState('Today');

    const filteredOrders = useMemo(() => {
        const now = new Date();
        if (filter === 'All') return orders;

        return orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            if (filter === 'Today') {
                return orderDate.toDateString() === now.toDateString();
            }
            if (filter === 'Month') {
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [orders, filter]);

    const metrics = useMemo(() => {
        let revenue = 0;
        let tips = 0;
        let totalItems = 0;
        let methodCounts = { Cash: 0, Card: 0, Account: 0, Wastage: 0 };
        let itemSales = {};
        let hourlyTraffic = new Array(24).fill(0);

        filteredOrders.forEach(order => {
            const orderRevenue = order.total - (order.tip || 0);
            if (order.method !== 'Wastage') {
                revenue += orderRevenue;
                tips += (order.tip || 0);
            }

            if (methodCounts[order.method] !== undefined) {
                methodCounts[order.method]++;
            } else {
                methodCounts[order.method] = 1;
            }

            // Hourly analysis
            const hour = new Date(order.date).getHours();
            hourlyTraffic[hour]++;

            order.items.forEach(item => {
                totalItems += item.quantity;
                if (itemSales[item.name]) {
                    itemSales[item.name] += item.quantity;
                } else {
                    itemSales[item.name] = item.quantity;
                }
            });
        });

        const topItems = Object.entries(itemSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const aov = filteredOrders.length > 0 ? revenue / filteredOrders.length : 0;

        return { revenue, tips, totalItems, aov, methodCounts, topItems, hourlyTraffic };
    }, [filteredOrders]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-maroon mb-1">Performance Overview</h2>
                    <p className="text-maroon/60">Track your verified sales metrics.</p>
                </div>
                <div className="flex bg-white/50 backdrop-blur rounded-xl p-1.5 shadow-sm border border-white/40">
                    {['Today', 'This Month', 'All Time'].map((f) => {
                        const val = f === 'This Month' ? 'Month' : f === 'All Time' ? 'All' : 'Today';
                        return (
                            <button
                                key={val}
                                onClick={() => setFilter(val)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === val
                                    ? 'bg-maroon text-cream shadow-lg'
                                    : 'text-maroon/60 hover:bg-white/50'
                                    }`}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Revenue", value: `R${metrics.revenue.toFixed(2)}`, icon: DollarSign, color: "bg-green-100 text-green-700" },
                    { title: "Average Order", value: `R${metrics.aov.toFixed(2)}`, icon: TrendingUp, color: "bg-purple-100 text-purple-700" },
                    { title: "Items Sold", value: metrics.totalItems, icon: Calendar, color: "bg-orange-100 text-orange-700" },
                    { title: "Total Orders", value: filteredOrders.length, icon: Calendar, color: "bg-blue-100 text-blue-700" }
                ].map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg flex items-center gap-5"
                    >
                        <div className={`p-4 rounded-2xl ${card.color} shadow-sm`}>
                            <card.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-maroon/50 text-xs font-bold uppercase tracking-wider mb-1">{card.title}</p>
                            <p className="text-3xl font-extrabold text-maroon font-sans">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Hourly Traffic Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg"
            >
                <h3 className="text-xl font-bold text-maroon mb-6">Hourly Sales Power</h3>
                <div className="flex items-end justify-between h-40 gap-2">
                    {metrics.hourlyTraffic.map((count, hour) => {
                        const height = Math.max(count > 0 ? (count / Math.max(...metrics.hourlyTraffic)) * 100 : 5, 5);
                        return (
                            <div key={hour} className="flex-1 flex flex-col items-center group relative">
                                <div
                                    className="w-full bg-maroon rounded-t-lg transition-all duration-500 ease-out group-hover:bg-gold"
                                    style={{ height: `${height}%`, opacity: count > 0 ? 1 : 0.1 }}
                                >
                                    {count > 0 && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-maroon text-cream text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {count}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold text-maroon/40 mt-2">{hour}h</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg"
                >
                    <h3 className="text-xl font-bold text-maroon mb-6">Payment Methods</h3>
                    <div className="space-y-4">
                        {Object.entries(metrics.methodCounts).map(([method, count], i) => (
                            <div key={method} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full shadow-sm ${method === 'Wastage' ? 'bg-red-500 shadow-red-200' : 'bg-maroon shadow-maroon/30'
                                        }`} />
                                    <span className="font-bold text-maroon/80">{method}</span>
                                </div>
                                <span className="font-extrabold text-xl text-maroon">{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Items */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg"
                >
                    <h3 className="text-xl font-bold text-maroon mb-6">Top Selling Items</h3>
                    <div className="space-y-4">
                        {metrics.topItems.length > 0 ? (
                            metrics.topItems.map(([name, qty], idx) => (
                                <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 flex items-center justify-center bg-white shadow-sm text-maroon/60 rounded-lg text-sm font-bold border border-maroon/5">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-maroon/80">{name}</span>
                                    </div>
                                    <span className="font-bold text-maroon bg-maroon/5 px-3 py-1 rounded-lg text-sm">{qty} sold</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-maroon/40 font-medium">No sales data recorded yet.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardView;
