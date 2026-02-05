import React from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = ({ onCheckout }) => {
    const { cart, updateQuantity, removeFromCart, clearCart, tip, setTip } = useCartStore();

    const [isCustomTip, setIsCustomTip] = React.useState(false);
    const [customAmount, setCustomAmount] = React.useState('');

    const handleCustomTip = (e) => {
        const val = e.target.value;
        setCustomAmount(val);
        if (val && !isNaN(val)) {
            setTip(parseFloat(val));
        } else {
            setTip(0);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + tip;

    return (
        <div className="w-[400px] bg-white shadow-2xl z-30 flex flex-col h-full border-l border-velvet/5 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent opacity-50" />

            {/* Header */}
            <div className="p-8 pb-6 flex justify-between items-end border-b border-velvet/5">
                <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase block mb-1">Current Session</span>
                    <h2 className="text-3xl font-serif text-velvet">Order Details</h2>
                </div>
                <button
                    onClick={clearCart}
                    className="text-[10px] uppercase font-bold tracking-widest text-velvet/40 hover:text-red-700 transition-colors pb-1"
                >
                    Clear
                </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <AnimatePresence initial={false}>
                    {cart.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-velvet/20 space-y-4"
                        >
                            <div className="w-16 h-16 border border-velvet/10 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-serif italic">0</span>
                            </div>
                            <p className="font-serif italic text-lg opacity-60">Your tray is empty</p>
                        </motion.div>
                    ) : (
                        cart.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                key={item.id}
                                className="flex items-start justify-between group"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="font-serif text-xl text-velvet leading-tight mb-1">{item.name}</h4>
                                    <div className="text-sm text-velvet/50 font-medium">
                                        ${item.price.toFixed(2)} <span className="text-xs mx-1 opacity-50">x</span> {item.quantity}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-velvet/10 rounded-full h-8">
                                        <button
                                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                                            className="w-8 h-full flex items-center justify-center hover:bg-velvet/5 text-velvet/60 transition-colors rounded-l-full"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-bold text-sm w-6 text-center text-velvet">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-full flex items-center justify-center hover:bg-velvet/5 text-velvet/60 transition-colors rounded-r-full"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="font-bold text-velvet w-14 text-right">
                                        R{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Area */}
            <div className="p-8 bg-cream/30 border-t border-velvet/5 space-y-6">
                {/* Simplified Tips */}
                <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-velvet/40">Gratuity (ZAR)</span>
                    <div className="flex flex-wrap gap-2">
                        {[0, 5, 10, 20].map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                    setIsCustomTip(false);
                                    setTip(amount);
                                    setCustomAmount('');
                                }}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${!isCustomTip && tip === amount
                                    ? 'bg-velvet text-gold border-velvet'
                                    : 'bg-transparent text-velvet/40 border-velvet/10 hover:border-velvet/30'
                                    }`}
                            >
                                {amount === 0 ? 'None' : `R${amount}`}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomTip(true)}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${isCustomTip
                                ? 'bg-velvet text-gold border-velvet'
                                : 'bg-transparent text-velvet/40 border-velvet/10 hover:border-velvet/30'
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {isCustomTip && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-velvet/10"
                        >
                            <span className="font-bold text-velvet text-sm pl-2">R</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={customAmount}
                                onChange={handleCustomTip}
                                className="bg-transparent outline-none font-bold text-velvet w-full text-sm"
                                autoFocus
                            />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-2 pt-4 border-t border-velvet/5">
                    <div className="flex justify-between text-velvet/60 font-light">
                        <span>Subtotal</span>
                        <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    {tip > 0 && (
                        <div className="flex justify-between text-gold font-medium">
                            <span className="flex items-center gap-2">Gratuity</span>
                            <span>+R{tip.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-baseline pt-2">
                        <span className="text-lg font-serif text-velvet">Total Amount</span>
                        <span className="text-4xl font-serif text-velvet font-medium">R{total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="w-full py-5 bg-velvet text-gold text-lg font-medium tracking-wide shadow-velvet hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-between px-8 group relative overflow-hidden"
                >
                    <span className="relative z-10 font-serif italic">Proceed to Payment</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
            </div>
        </div>
    );
};

export default CartSidebar;
