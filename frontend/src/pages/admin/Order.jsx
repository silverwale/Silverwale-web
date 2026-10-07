import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAdminOrdersStart, getAllAdminOrdersSuccess, getAllAdminOrdersFailure } from '../../redux/slices/orderSlice';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Order() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const pageSize = 10

    useEffect(() => {
        fetchAllOrders(currentPage)
        return () => {
            dispatch(getAllAdminOrdersSuccess([]))
        }
    }, [currentPage])

    const fetchAllOrders = async (page) => {
        dispatch(getAllAdminOrdersStart())
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/getadminorders?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) { throw new Error("invalid response: ", res) }
            const data = await res.json()
            setTotalOrders(data.totalOrders)
            dispatch(getAllAdminOrdersSuccess(data))
        } catch (error) {
            dispatch(getAllAdminOrdersFailure(error.message))
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/updatestatus/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error('Failed to update status');
            fetchAllOrders(currentPage); // refresh list
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status');
        }
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const renderPagination = () => {
        const disableNext = currentPage * pageSize >= totalOrders;
        return (
            <div className='w-[100%] flex justify-between items-center my-8 pt-6 border-t border-gray-100'>
                <button 
                  className='bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50' 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase"> Page {currentPage} </span>
                <button 
                  className='bg-black text-white px-6 py-2 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50' 
                  onClick={nextPage} 
                  disabled={currentPage * pageSize >= totalOrders}
                >
                  Next
                </button>
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-serif italic text-gray-800">Admin Orders</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {orders && orders.map((order) => {
                console.log('Admin order:', order);
                return (
                <div key={order._id} className="bg-white border border-gray-100 rounded-sm p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-50">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID: <span className="text-gray-800">{order._id}</span></p>
                            <p className="text-sm font-medium">User: {order.userId?.username || 'N/A'} ({order.userId?.email || 'N/A'})</p>
                            <p className="text-xs text-gray-500">Order Date: {formatDate(order.orderDate)} • Method: <span className="uppercase font-bold text-black">{order.paymentMethod || 'COD'}</span></p>
                            <p className="text-xs font-semibold text-gray-800 pt-1">
                                Expected Delivery: {order.expectedDeliveryDate 
                                    ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                    : new Date(new Date(order.orderDate).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                                <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter font-bold ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                                {order.paymentMethod === 'online' && (
                                    <div className="flex flex-col gap-1 mt-2 p-2 bg-blue-50 border border-blue-100 rounded-sm">
                                        <p className="text-[10px] font-bold tracking-widest text-blue-800"><span className="uppercase">Razorpay Order:</span> <span className="font-mono text-blue-600">{order.razorpay_order_id}</span></p>
                                        {order.paymentId?.razorpay_payment_id && (
                                            <p className="text-[10px] font-bold tracking-widest text-blue-800"><span className="uppercase">Razorpay Payment:</span> <span className="font-mono text-blue-600">{order.paymentId.razorpay_payment_id}</span></p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {order.status === 'pending' && (
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                    className="bg-black text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                    className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Shipping / Delivery Address */}
                    <div className="bg-[#faf9f6] border border-gray-200/80 rounded-sm p-4 mb-6">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200/60">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-black text-xs" />
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800">
                                    Shipping / Delivery Address
                                </h4>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-sm">
                                Selected at Checkout
                            </span>
                        </div>
                        {order.address && (order.address.addressLine1 || order.address.fullName) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 uppercase tracking-wider text-xs">
                                        {order.address.fullName}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        {order.address.addressLine1}
                                        {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}
                                    </p>
                                    <p className="text-gray-600 font-medium">
                                        {[order.address.city, order.address.postalCode, order.address.country].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-start md:items-end space-y-1 text-xs">
                                    {order.address.phoneNumber && (
                                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                                            <FaPhoneAlt className="text-gray-400 text-[10px]" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone:</span>
                                            <span>{order.address.phoneNumber}</span>
                                        </div>
                                    )}
                                    {order.userId?.email && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaEnvelope className="text-gray-400 text-[10px]" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email:</span>
                                            <span>{order.userId.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No specific delivery address recorded for this order.</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Products</h4>
                        {order.products && order.products.map((item) => {
                            console.log('Admin order item:', item);
                            const coverIdx = item.productId?.coverImageIndex ?? 0;
                            const filename = item.productId?.image?.[coverIdx] || item.productId?.image?.[0];
                            const displayImg = filename ? (filename.includes('cloudinary.com') ? filename : `/${filename.split(/[\\/]/).pop()}`) : '/ErrorImage.png';
                            return (
                            <div key={item._id} className="flex items-center gap-6 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <a href={`/products/${item.productId?._id}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={displayImg}
                                        alt={item.productId?.name}
                                        className="w-20 h-20 object-contain bg-gray-50 border border-gray-100 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
                                        onError={(e) => e.target.src = '/ErrorImage.png'}
                                    />
                                </a>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-gray-800">{item.productId?.name}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                       {item.size && <span>Size: {item.size}</span>}
                                       {item.metalType && (
                                         <span>
                                           Metal: {
                                             item.metalType === 'SS' ? '925 Silver' :
                                             item.metalType === 'RS' ? 'Rose Silver' :
                                             item.metalType === 'YS' ? 'Yellow Silver' :
                                             item.metalType
                                           }
                                         </span>
                                       )}
                                       {item.engraving && <span className="text-blue-600 bg-blue-50 px-2 rounded-sm border border-blue-100 italic font-serif">"{item.engraving}"</span>}
                                       {item.stone && (
                                         <span className={`px-2 rounded-sm border whitespace-nowrap ${
                                           item.stone.toLowerCase().includes('ruby') ? 'text-red-600 bg-red-50 border-red-100' :
                                           item.stone.toLowerCase().includes('emerald') ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                           item.stone.toLowerCase().includes('sapphire') && !item.stone.toLowerCase().includes('pink') ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                           item.stone.toLowerCase().includes('citrine') ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                           item.stone.toLowerCase().includes('amethyst') ? 'text-purple-600 bg-purple-50 border-purple-100' :
                                           item.stone.toLowerCase().includes('pink') ? 'text-pink-600 bg-pink-50 border-pink-100' :
                                           item.stone.toLowerCase().includes('black') ? 'text-gray-900 bg-gray-100 border-gray-200' :
                                           'text-gray-600 bg-gray-50 border-gray-100'
                                         }`}>
                                           {item.stone}
                                         </span>
                                       )}
                                       {item.finish && <span className="text-amber-600 bg-amber-50 px-2 rounded-sm border border-amber-100 whitespace-nowrap">{item.finish}</span>}
                                    </div>
                                    <p className="text-xs text-gray-500">Quantity: <span className="font-bold text-gray-800">{item.quantity}</span></p>
                                    <p className="text-xs text-gray-500">Unit Price: <span className="font-bold text-gray-800">₹{item.unitPriceAtPurchase}</span></p>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
                )})}
            {renderPagination()}
        </div>
    )
}

export default Order