import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null, // { name: 'Ahmed', role: 'admin' }
            users: [
                { id: 1, name: 'Admin', pin: '1234', role: 'admin' },
                { id: 2, name: 'Staff', pin: '0000', role: 'staff' },
            ],
            login: (pin) => set((state) => {
                const user = state.users.find((u) => u.pin === pin);
                if (user) {
                    return { user };
                }
                return {};
            }),
            logout: () => set({ user: null }),
            updateUserPin: (id, newPin) => set((state) => ({
                users: state.users.map((u) => (u.id === id ? { ...u, pin: newPin } : u)),
            })),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, users: state.users }),
        }
    )
);
