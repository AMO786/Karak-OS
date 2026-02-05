import React, { useState } from 'react';
import { useMenuStore } from '../../stores/useMenuStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MenuView = () => {
    const { items, categories, addItem, updateItem, deleteItem, addCategory } = useMenuStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Teas' });

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, price: item.price, category: item.category });
        } else {
            setEditingItem(null);
            setFormData({ name: '', price: '', category: categories[0] || 'Teas' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: parseFloat(formData.price),
        };

        if (editingItem) {
            updateItem(editingItem.id, data);
        } else {
            addItem(data);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-maroon">Menu Management</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-maroon text-cream px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-maroon/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-maroon/5 text-maroon font-bold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-maroon">{item.price.toFixed(2)}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-maroon">
                                {editingItem ? 'Edit Item' : 'New Item'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded-lg focus:border-maroon outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 border rounded-lg focus:border-maroon outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:border-maroon outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-maroon text-cream py-3 rounded-xl font-bold">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuView;
