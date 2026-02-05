import React, { useState } from 'react';
import { useOrderStore } from '../../stores/useOrderStore';
import { useMenuStore } from '../../stores/useMenuStore';
import { CheckCircle, Clock, Edit2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersView = () => {
    const { orders, updateOrderStatus, updateOrder } = useOrderStore();
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
    const [editingOrder, setEditingOrder] = useState(null);

    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const filteredOrders = orders
        .filter(o => {
            if (activeTab === 'active') return o.status === 'pending' || !o.status;
            // History filtering
            const orderDate = new Date(o.date);
            const orderMonth = orderDate.toISOString().slice(0, 7);
            return o.status === 'completed' && orderMonth === selectedMonth;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const handleComplete = (id) => updateOrderStatus(id, 'completed');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-maroon/10 pb-4">
                <h2 className="text-2xl font-bold text-maroon">Order Management</h2>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-maroon/5">
                    {['active', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                ? 'bg-maroon text-cream shadow'
                                : 'text-maroon/40 hover:text-maroon'
                                }`}
                        >
                            {tab === 'active' ? 'Active Queue' : 'Order History'}
                        </button>
                    ))}

                </div>
                {activeTab === 'history' && (
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-white border border-maroon/10 rounded-lg px-4 py-2 text-maroon font-bold text-sm focus:outline-none focus:ring-2 focus:ring-maroon/20"
                    />
                )}
            </div>


            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={order.id}
                            className={`bg-white rounded-2xl p-6 border shadow-sm relative overflow-hidden ${activeTab === 'active' ? 'border-maroon/10' : 'border-gray-100 opacity-80'
                                }`}
                        >
                            {/* Status Indicator */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${activeTab === 'active' ? 'bg-gold' : 'bg-green-500/50'}`} />

                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div>
                                    <span className="text-xs font-bold text-maroon/40 uppercase tracking-widest">Order #{order.id.toString().slice(-4)}</span>
                                    <p className="font-serif text-xl font-bold text-maroon">
                                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-maroon text-lg">R{order.total.toFixed(2)}</p>
                                    <p className="text-xs text-maroon/50">{order.method}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6 pl-3 max-h-40 overflow-y-auto scrollbar-hide">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-maroon/80 font-medium">
                                            <span className="text-maroon/40 mr-2">{item.quantity}x</span>
                                            {item.name}
                                        </span>
                                        <span className="text-maroon/40">R{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {activeTab === 'active' && (
                                <div className="flex gap-3 pl-3">
                                    <button
                                        onClick={() => setEditingOrder(order)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-maroon/10 text-maroon font-bold text-sm hover:bg-maroon/5 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleComplete(order.id)}
                                        className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-maroon text-cream font-bold text-sm hover:bg-maroon/90 shadow-lg shadow-maroon/20 transition-all hover:-translate-y-0.5"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Complete
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredOrders.length === 0 && (
                    <div className="col-span-full py-20 text-center text-maroon/30 italic">
                        No orders found in {activeTab === 'active' ? 'queue' : 'history'}.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {
                editingOrder && (
                    <EditOrderModal
                        order={editingOrder}
                        onClose={() => setEditingOrder(null)}
                        onSave={(updated) => {
                            updateOrder(editingOrder.id, updated);
                            setEditingOrder(null);
                        }}
                    />
                )
            }
        </div >
    );
};

const EditOrderModal = ({ order, onClose, onSave }) => {
    // Determine the max unique ID for generating keys if needed, though we won't add new unique items heavily here.
    // Deep copy items to avoid mutating state directly
    const [items, setItems] = useState([...order.items]);
    const [method, setMethod] = useState(order.method || 'Cash');

    const handleQuantityChange = (index, delta) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        item.quantity += delta;
        if (item.quantity <= 0) {
            newItems.splice(index, 1);
        } else {
            newItems[index] = item;
        }
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSave = () => {
        onSave({
            items,
            method,
            total: calculateTotal() + (order.tip || 0) // Recalculate total preserving tip
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="bg-maroon p-6 text-cream flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-xl font-bold">Edit Order #{order.id.toString().slice(-4)}</h3>
                        <p className="text-white/60 text-xs uppercase tracking-widest">Adjust items or quantities</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-red-500 flex flex-col items-center gap-2">
                            <AlertCircle className="w-8 h-8 opacity-50" />
                            <p className="font-bold">Order cannot be empty.</p>
                            <p className="text-xs text-gray-400">Please add items or cancel order via void (not implemented).</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">R{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => handleQuantityChange(idx, -1)}
                                            className="w-6 h-6 flex items-center justify-center text-maroon hover:bg-maroon/10 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(idx, 1)}
                                            className="w-6 h-6 flex items-center justify-center text-maroon hover:bg-maroon/10 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 font-bold uppercase text-xs">Payment</span>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="bg-gray-100 border-none rounded-lg text-sm font-bold text-maroon focus:ring-0 cursor-pointer"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Account">Account</option>
                            </select>
                        </div>
                        <span className="text-2xl font-serif font-bold text-maroon">R{(calculateTotal() + (order.tip || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={items.length === 0}
                            className="flex-1 py-3 rounded-xl bg-maroon text-cream font-bold hover:bg-maroon/90 shadow-lg shadow-maroon/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrdersView;
