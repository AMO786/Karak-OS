import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
    persist(
        (set) => ({
            orders: [],
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, { ...order, id: Date.now(), date: new Date().toISOString(), status: 'pending' }]
            })),
            updateOrderStatus: (id, status) => set((state) => ({
                orders: state.orders.map((o) => o.id === id ? { ...o, status } : o)
            })),
            updateOrder: (id, updatedFields) => set((state) => ({
                orders: state.orders.map((o) => o.id === id ? { ...o, ...updatedFields } : o)
            })),
        }),
        {
            name: 'order-storage',
        }
    )
);
