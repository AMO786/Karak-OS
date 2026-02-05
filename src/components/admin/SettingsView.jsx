import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Shield, Key, Save } from 'lucide-react';

const SettingsView = () => {
    const { users, updateUserPin } = useAuthStore();
    const [editingId, setEditingId] = useState(null);
    const [newPin, setNewPin] = useState('');

    const handleSave = (id) => {
        if (newPin.length >= 4) {
            updateUserPin(id, newPin);
            setEditingId(null);
            setNewPin('');
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-maroon mb-6">System Settings</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-maroon/5 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-maroon" />
                    <h3 className="text-lg font-bold text-gray-800">User Management</h3>
                </div>

                <div className="grid gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {editingId === user.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                            className="w-24 p-2 border rounded-lg text-center font-mono tracking-widest outline-none focus:border-maroon"
                                            placeholder="NEW"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSave(user.id)}
                                            className="p-2 bg-maroon text-cream rounded-lg hover:bg-maroon/90"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-2 text-gray-500 hover:bg-gray-200 rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditingId(user.id); setNewPin(''); }}
                                        className="flex items-center gap-2 text-maroon hover:bg-maroon/5 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Key className="w-4 h-4" />
                                        Reset PIN
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-maroon/5 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Application Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Version</p>
                        <p className="font-medium">1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
