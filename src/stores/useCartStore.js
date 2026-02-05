import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    cart: [],
    tip: 0,
    addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        if (existing) {
            return {
                cart: state.cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
    removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
    updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) return { cart: state.cart.filter((i) => i.id !== id) };
        return {
            cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        };
    }),
    setTip: (amount) => set({ tip: amount }),
    clearCart: () => set({ cart: [], tip: 0 }),
    getTotal: () => {
        const { cart, tip } = get();
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        return subtotal + tip;
    }
}));
