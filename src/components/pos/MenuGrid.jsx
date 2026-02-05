import React, { useState } from 'react';
import { useMenuStore } from '../../stores/useMenuStore';
import { useCartStore } from '../../stores/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const MenuGrid = () => {
    const { items, categories, addCategory } = useMenuStore();
    const addToCart = useCartStore((state) => state.addToCart);
    const [activeCategory, setActiveCategory] = useState('All');

    const handleAddCategory = () => {
        const name = prompt("Enter new category name:");
        if (name && !categories.includes(name)) {
            addCategory(name);
            setActiveCategory(name);
        }
    };

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.category === activeCategory);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden px-4 lg:px-10 pb-4 pt-4">
            {/* Elegant Category Filter */}
            <div className="flex space-x-8 mb-8 overflow-x-auto pb-4 pt-2 scrollbar-hide shrink-0 items-center">
                <button
                    onClick={() => setActiveCategory('All')}
                    className={`text-lg font-serif transition-all duration-300 relative px-2 ${activeCategory === 'All'
                        ? 'text-velvet font-bold'
                        : 'text-velvet/40 hover:text-velvet/70'
                        }`}
                >
                    All Collection
                    {activeCategory === 'All' && (
                        <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold" />
                    )}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-lg font-serif transition-all duration-300 relative px-2 whitespace-nowrap ${activeCategory === cat
                            ? 'text-velvet font-bold'
                            : 'text-velvet/40 hover:text-velvet/70'
                            }`}
                    >
                        {cat}
                        {activeCategory === cat && (
                            <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold" />
                        )}
                    </button>
                ))}

                {/* Add Category Button */}
                <button
                    onClick={handleAddCategory}
                    className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-dashed border-velvet/20 text-velvet/40 hover:text-gold hover:border-gold hover:bg-velvet/5 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Add New</span>
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 lg:pr-4 lg:-mr-4 scrollbar-hide">
                <motion.div
                    layout
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-20"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.button
                                layout
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="group relative bg-white p-6 rounded-none shadow-sm hover:shadow-gold border border-transparent hover:border-gold/30 transition-all duration-500 flex flex-col items-start text-left h-[200px] lg:h-[220px] justify-between overflow-hidden"
                            >
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-full relative z-10">
                                    <span className="text-[10px] font-bold text-gold tracking-[0.2em] uppercase mb-3 block">
                                        {item.category}
                                    </span>
                                    <h3 className="font-serif text-2xl lg:text-3xl text-velvet leading-none group-hover:text-gold-dark transition-colors duration-300">
                                        {item.name}
                                    </h3>
                                </div>

                                <div className="w-full relative z-10 mt-4 border-t border-velvet/5 pt-4 group-hover:border-gold/20 transition-colors flex justify-center items-center">
                                    <div className="text-2xl font-light text-velvet">
                                        <span className="text-sm align-top opacity-50">R</span>{item.price.toFixed(2)}
                                    </div>
                                    <div className="absolute right-0 bottom-0 w-10 h-10 rounded-full border border-velvet/10 flex items-center justify-center text-velvet/30 group-hover:bg-velvet group-hover:text-gold group-hover:border-velvet transition-all duration-300 opacity-50 group-hover:opacity-100">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Footer - Now inside scroll container */}
                <div className="pb-8 pt-8 text-center shrink-0">
                    <p className="text-velvet/20 text-[10px] font-sans">© The Software Concierge 2026</p>
                </div>
            </div>
        </div>
    );
};

export default MenuGrid;
