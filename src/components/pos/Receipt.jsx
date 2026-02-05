import React from 'react';
import { Coffee } from 'lucide-react';

const Receipt = ({ cart, total, tip, method, note, date }) => {
    return (
        <div className="w-[380px] bg-white p-6 rounded-none text-maroon font-mono flex flex-col items-center border border-gray-200">
            {/* Header */}
            <div className="flex flex-col items-center mb-6 border-b border-dashed border-gray-300 w-full pb-4">
                <img src="/logo.png" alt="Karak Kulture Logo" className="w-32 h-auto mb-2 grayscale opacity-80" />
                {/* <h1 className="text-xl font-bold uppercase tracking-widest">Karak Kulture</h1> */}
                <p className="text-xs text-center text-gray-500">Authentic Tea & Vibes</p>
                <p className="text-xs mt-2">{date}</p>
            </div>

            {/* Items */}
            <div className="w-full space-y-2 mb-6 border-b border-dashed border-gray-300 pb-4">
                {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="w-full space-y-1 mb-6">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R{(total - tip).toFixed(2)}</span>
                </div>
                {tip > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>Tip</span>
                        <span>R{tip.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-maroon">
                    <span>TOTAL</span>
                    <span>R{total.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 w-full">
                <p>Payment: {method}</p>
                {note && <p>Ref: {note}</p>}
                <p className="mt-4">Thank you for visiting!</p>
            </div>
        </div>
    );
};

export default Receipt;
