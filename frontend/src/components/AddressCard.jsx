import React, { useEffect, useState } from 'react';
import { fetchAddressesStart, fetchAddressesSuccess, fetchAddressesFailure, deleteAddressStart, deleteAddressSuccess, deleteAddressFailure } from '../redux/slices/addressSlice';
import { addAddressStart, addAddressSuccess, addAddressFailure } from '../redux/slices/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';

function AddressCard({ onAddressSelect }) {
    const dispatch = useDispatch();
    const { addresses, loading } = useSelector(state => state.address);
    const { currentUser } = useSelector(state => state.user);
    const userId = currentUser._id;

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', addressLine1: '', addressLine2: '',
        city: '', postalCode: '', country: '', phoneNumber: ''
    });

    useEffect(() => {
        fetchAddress(userId);
    }, [userId]);

    const fetchAddress = async (uid, preferAddressId) => {
        dispatch(fetchAddressesStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/address/${uid}`);
            if (!res.ok) throw new Error('Failed to fetch addresses');
            const data = await res.json();
            dispatch(fetchAddressesSuccess(data));
            if (data.length > 0) {
                const targetId = preferAddressId || selectedAddress?._id;
                const matched = targetId ? data.find(a => a._id === targetId) : null;
                const defaultAddr = data.find(a => a.isDefault);
                const chosen = matched || defaultAddr || data[0];
                setSelectedAddress(chosen);
                if (onAddressSelect) onAddressSelect(chosen);
            } else {
                setSelectedAddress(null);
                if (onAddressSelect) onAddressSelect(null);
            }
        } catch (err) {
            dispatch(fetchAddressesFailure(err.message));
        }
    };

    const handleSelect = (addr) => {
        setSelectedAddress(addr);
        if (onAddressSelect) onAddressSelect(addr);
        setShowAll(false);
    };

    const handleDelete = async (addressId) => {
        dispatch(deleteAddressStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/deleteaddress/${addressId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            dispatch(deleteAddressSuccess(addressId));
            toast.success('Address removed');
            const remaining = addresses.filter(a => a._id !== addressId);
            const nextAddr = selectedAddress?._id === addressId 
                ? (remaining.find(a => a.isDefault) || remaining[0] || null)
                : selectedAddress;
            setSelectedAddress(nextAddr);
            if (onAddressSelect) onAddressSelect(nextAddr);
            fetchAddress(userId, nextAddr?._id);
        } catch (err) {
            dispatch(deleteAddressFailure(err.message));
        }
    };

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setSaving(true);
        dispatch(addAddressStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/createaddress/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to add address');
            const data = await res.json();
            const newAddr = data.address || data;
            dispatch(addAddressSuccess(newAddr));
            toast.success('Address added');
            setShowAddForm(false);
            setFormData({ fullName: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: '', phoneNumber: '' });
            await fetchAddress(userId, newAddr._id);
            setShowAll(false);
        } catch (err) {
            dispatch(addAddressFailure(err.message));
            toast.error('Could not add address');
        } finally {
            setSaving(false);
        }
    };

    const formatAddress = (addr) =>
        [addr.addressLine1, addr.addressLine2, addr.city, addr.postalCode, addr.country]
            .filter(Boolean).join(', ');

    return (
        <div className="space-y-6">
            {loading && <p className="text-xs text-gray-400 uppercase tracking-widest animate-pulse">Loading addresses...</p>}

            {/* Selected address display */}
            {selectedAddress && !showAll && (
                <div className="border border-black p-6 space-y-3 bg-gray-50/50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <FaMapMarkerAlt className="text-black mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-black">{selectedAddress.fullName}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{formatAddress(selectedAddress)}</p>
                                <p className="text-xs text-gray-500">{selectedAddress.phoneNumber}</p>
                            </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">Selected</span>
                    </div>
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-400 text-gray-500 hover:text-black hover:border-black transition-all pb-0.5"
                    >
                        Change Address
                    </button>
                </div>
            )}

            {/* All addresses list */}
            {showAll && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Select Delivery Address
                        </span>
                        {selectedAddress && (
                            <button
                                type="button"
                                onClick={() => setShowAll(false)}
                                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                Done
                            </button>
                        )}
                    </div>
                    {addresses.map((addr) => (
                        <button
                            key={addr._id}
                            onClick={() => handleSelect(addr)}
                            className={`w-full text-left p-5 border transition-all flex items-start justify-between group ${
                                selectedAddress?._id === addr._id
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <div className="flex items-start space-x-3 flex-1">
                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    selectedAddress?._id === addr._id ? 'border-black bg-black' : 'border-gray-300'
                                }`}>
                                    {selectedAddress?._id === addr._id && <FaCheck className="text-white text-[6px]" />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{addr.fullName}</p>
                                    <p className="text-xs text-gray-500">{formatAddress(addr)}</p>
                                    <p className="text-xs text-gray-400">{addr.phoneNumber}</p>
                                </div>
                            </div>
                            <span
                                onClick={(e) => { e.stopPropagation(); handleDelete(addr._id); }}
                                className="text-gray-300 hover:text-red-500 transition-colors ml-4 flex-shrink-0 p-1"
                            >
                                <FaTimes className="h-3 w-3" />
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* No address state */}
            {addresses.length === 0 && !loading && (
                <div className="text-center py-8 border border-dashed border-gray-200">
                    <FaMapMarkerAlt className="text-gray-200 h-8 w-8 mx-auto mb-3" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest">No saved addresses</p>
                </div>
            )}

            {/* Add Address Button */}
            <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors group"
            >
                <div className="w-6 h-6 border border-gray-300 group-hover:border-black rounded-sm flex items-center justify-center transition-colors">
                    <FaPlus className="h-2.5 w-2.5" />
                </div>
                <span>Add New Address</span>
            </button>

            {/* Inline Add Address Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
                    <div className="relative bg-white w-full max-w-lg mx-4 shadow-2xl animate-fadeIn overflow-y-auto max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-serif italic text-gray-800">New Delivery Address</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-black transition-colors">
                                <FaTimes className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddAddress} className="px-8 py-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                <input
                                    name="fullName" value={formData.fullName} onChange={handleFormChange}
                                    placeholder="Recipient's full name" required
                                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                                    <input
                                        name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange}
                                        placeholder="+91..." required
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                                    <input
                                        name="postalCode" value={formData.postalCode} onChange={handleFormChange}
                                        placeholder="Pincode" required
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 1</label>
                                <input
                                    name="addressLine1" value={formData.addressLine1} onChange={handleFormChange}
                                    placeholder="House No., Building, Street" required
                                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 2 (Optional)</label>
                                <input
                                    name="addressLine2" value={formData.addressLine2} onChange={handleFormChange}
                                    placeholder="Locality, Landmark"
                                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                                    <input
                                        name="city" value={formData.city} onChange={handleFormChange}
                                        placeholder="City" required
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                                    <input
                                        name="country" value={formData.country} onChange={handleFormChange}
                                        placeholder="Country" required
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all disabled:bg-gray-400"
                                >
                                    {saving ? 'Saving...' : 'Save Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:border-black transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddressCard;