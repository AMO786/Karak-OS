import React, { useState, useRef } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { useOrderStore } from '../../stores/useOrderStore';
import html2canvas from 'html2canvas';
import { X, CreditCard, Banknote, User, Trash, Loader2, CheckCircle2 } from 'lucide-react';
import Receipt from './Receipt';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cart, tip, clearCart, getTotal } = useCartStore();
    const addOrder = useOrderStore((state) => state.addOrder);

    const [step, setStep] = useState('method');
    const [method, setMethod] = useState(null);
    const [note, setNote] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const receiptRef = useRef(null);
    const total = getTotal();

    if (!isOpen) return null;

    const handleMethodSelect = (selectedMethod) => {
        setMethod(selectedMethod);
        if (selectedMethod === 'Account' || selectedMethod === 'Wastage') {
            setStep('details');
        } else {
            processOrder(selectedMethod);
        }
    };

    const processOrder = async (finalMethod, finalNote = '') => {
        setStep('processing');
        setIsGenerating(true);

        const order = {
            items: cart,
            tip,
            total,
            method: finalMethod,
            note: finalNote,
            timestamp: new Date().toISOString(),
        };

        addOrder(order);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Cinematic delay for spinner

            if (receiptRef.current) {
                const canvas = await html2canvas(receiptRef.current, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                });

                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = image;
                // eslint-disable-next-line react-hooks/purity
                link.download = `receipt-${Date.now()}.png`;
                link.click();
            }
        } catch (err) {
            console.error("Receipt generation failed", err);
        }

        setIsGenerating(false);
        setStep('success');

        setTimeout(() => {
            clearCart();
            onClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-maroon/20 backdrop-blur-md flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] w-[650px] overflow-hidden shadow-2xl border border-white/50"
                >
                    <div className="p-8 border-b border-black/5 flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-maroon tracking-tight">
                            {step === 'method' && 'Select Payment'}
                            {step === 'details' && (method === 'Account' ? 'Customer Details' : 'Wastage Reason')}
                            {step === 'processing' && 'Processing Sale'}
                            {step === 'success' && 'Transaction Complete'}
                        </h2>
                        {step !== 'processing' && step !== 'success' && (
                            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-maroon transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <div className="p-10 min-h-[400px] flex flex-col justify-center">
                        {step === 'method' && (
                            <div className="grid grid-cols-2 gap-5">
                                {[
                                    { id: 'Cash', icon: Banknote, label: 'Standard Cash', color: 'text-maroon' },
                                    { id: 'Card', icon: CreditCard, label: 'Credit Card', color: 'text-purple-700' },
                                    { id: 'Account', icon: User, label: 'On Account', color: 'text-blue-700' },
                                    { id: 'Wastage', icon: Trash, label: 'Record Wastage', color: 'text-red-600' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.8)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleMethodSelect(opt.id)}
                                        className="h-40 rounded-3xl bg-white/40 border border-white/50 shadow-sm hover:shadow-xl transition-all flex flex-col items-center justify-center gap-3"
                                    >
                                        <div className={`p-4 rounded-2xl bg-white shadow-sm ${opt.color}`}>
                                            <opt.icon className="w-8 h-8" />
                                        </div>
                                        <span className={`text-lg font-bold ${opt.color}`}>{opt.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {step === 'details' && (
                            <div className="space-y-6">
                                <label className="block text-lg font-bold text-maroon/80 ml-1">
                                    {method === 'Account' ? 'Enter Customer Name / Ref' : 'Why is this item being discarded?'}
                                </label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    autoFocus
                                    className="w-full p-6 text-2xl border-2 border-maroon/10 rounded-2xl focus:border-maroon/50 outline-none bg-white/50"
                                    placeholder={method === 'Account' ? 'e.g., VIP Guest' : 'e.g., Spilled on floor'}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => processOrder(method, note)}
                                    disabled={!note.trim()}
                                    className="w-full py-5 bg-maroon text-cream font-bold text-xl rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl transition-all"
                                >
                                    Confirm Transaction
                                </motion.button>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center py-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mb-8"
                                >
                                    <Loader2 className="w-16 h-16 text-maroon" />
                                </motion.div>
                                <p className="text-xl font-medium text-maroon/60">Generating Receipt...</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    type="spring"
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-inner"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-maroon mb-2">Payment Successful</h3>
                                <p className="text-maroon/50 text-lg">Receipt has been saved.</p>
                            </div>
                        )}
                    </div>

                    <div className="absolute opacity-0 pointer-events-none">
                        <div ref={receiptRef}>
                            <Receipt cart={cart} total={total} tip={tip} method={method} note={note} date={new Date().toLocaleString()} />
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CheckoutModal;
