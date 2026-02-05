import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMenuStore = create(
    persist(
        (set) => ({
            categories: ['Karak', 'Savoury Paratha', 'Dessert Paratha'],
            items: [
                // Karak
                { id: 1, name: 'Signature Karak', price: 45, category: 'Karak' },
                { id: 2, name: 'Less Sugar Karak', price: 45, category: 'Karak' },

                // Savoury Paratha
                { id: 3, name: 'Plain Paratha', price: 20, category: 'Savoury Paratha' },
                { id: 4, name: 'Aloo & Cheese Paratha', price: 30, category: 'Savoury Paratha' },
                { id: 5, name: 'Chicken Mince Paratha', price: 35, category: 'Savoury Paratha' },
                { id: 6, name: 'Beef Mince Paratha', price: 35, category: 'Savoury Paratha' },

                // Dessert Paratha
                { id: 7, name: 'Nutella Paratha', price: 40, category: 'Dessert Paratha' },
                { id: 8, name: 'Caramel Drizzle Paratha', price: 30, category: 'Dessert Paratha' },
                { id: 9, name: 'Chocolate Drizzle Paratha', price: 30, category: 'Dessert Paratha' },
                { id: 10, name: 'White Choc Drizzle Paratha', price: 30, category: 'Dessert Paratha' },
            ],
            addItem: (item) => set((state) => ({ items: [...state.items, { ...item, id: Date.now() }] })),
            updateItem: (id, updatedItem) => set((state) => ({
                items: state.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
            })),
            deleteItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
            addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
        }),
        {
            name: 'menu-storage',
        }
    )
);
