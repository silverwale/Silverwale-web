import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersFailure, getOrdersStart, getOrdersSuccess, updateOrderStatusFailure, updateOrderStatusStart, updateOrderStatusSuccess } from '../redux/slices/orderSlice';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function MyOrders() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const userId = currentUser._id;
  const { orders, loading, error } = useSelector((state) => state.order)
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    getAllOrders(userId)
  }, [userId])

  const getAllOrders = async (userId) => {
    dispatch(getOrdersStart())
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/getorders/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (!res.ok) { throw new Error("invalid response: ", res) }
      const data = await res.json()
      dispatch(getOrdersSuccess(data))
    } catch (error) {
      dispatch(getOrdersFailure(error.message))
    }
  }

  const handleCancelOrder = async (orderId) => {
    dispatch(updateOrderStatusStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/orders/updatestatus/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      })
      if (!res.ok) { console.log("invalid response: ", res) }
      // Assuming successful response means the status was updated
      dispatch(updateOrderStatusSuccess({ orderId, status: 'cancelled' }))
    } catch (error) {
      dispatch(updateOrderStatusFailure(error.message))
    }
    setShowCancelModal(false);
    setOrderToCancel(null);
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 px-4 sm:px-0">
        <h2 className="text-3xl font-bold mb-4">My Orders</h2>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {orders && Object.keys(orders).length > 0 ? (
          <div>
            {Object.values(orders)
              .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
              .map((order) => (
                <div key={order._id} className="my-6 border relative border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-2">
                      <div className="bg-gray-200 rounded-full px-4 py-2 text-md font-semibold">
                        Order ID: {order._id}
                      </div>
                      {(order.paymentMethod === 'online' || order.razorpay_order_id) && (
                        <div className="flex flex-col gap-1 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-[10px] font-bold tracking-widest text-blue-800"><span className="uppercase">Razorpay Order:</span> <span className="font-mono text-blue-600">{order.razorpay_order_id}</span></p>
                          {order.paymentId?.razorpay_payment_id && (
                            <p className="text-[10px] font-bold tracking-widest text-blue-800"><span className="uppercase">Razorpay Payment:</span> <span className="font-mono text-blue-600">{order.paymentId.razorpay_payment_id}</span></p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-500">
                        Order Placed on:{' '}
                        {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(
                          new Date(order.orderDate)
                        )}
                      </p>
                      <p className="text-sm font-bold text-black mt-1">
                        Expected Delivery: {(() => {
                          const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
                          const displayDate = order.expectedDeliveryDate 
                            ? new Date(order.expectedDeliveryDate) 
                            : new Date(orderDate.getTime() + 10 * 24 * 60 * 60 * 1000);
                          return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(displayDate);
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="bg-[#fafafa] border border-gray-200/80 rounded-md p-4 mb-4 text-xs">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-black">
                        <FaMapMarkerAlt className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Delivery Address</span>
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 bg-white px-2 py-0.5 border border-gray-100">
                        Selected for this order
                      </span>
                    </div>
                    {order.address && (order.address.addressLine1 || order.address.fullName) ? (
                      <div className="space-y-0.5 text-gray-600 pl-5">
                        <p className="font-bold text-black text-xs uppercase tracking-wider">{order.address.fullName}</p>
                        <p className="leading-relaxed">
                          {order.address.addressLine1}
                          {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}
                        </p>
                        <p className="text-gray-500">
                          {[order.address.city, order.address.postalCode, order.address.country].filter(Boolean).join(', ')}
                        </p>
                        {order.address.phoneNumber && (
                          <p className="text-gray-500 pt-0.5">Contact: <span className="font-medium text-black">{order.address.phoneNumber}</span></p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-[11px] pl-5">No delivery address recorded for this order.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.products &&
                      order.products.length > 0 &&
                      order.products.map((product) => {
                        const { productId } = product;
                        // Debug: log productId structure
                        console.log('MyOrders productId:', productId);
                        return (
                          <div
                            key={product._id}
                            className="border border-gray-300 rounded-lg p-4 flex md:gap-10 md:flex-row flex-col md:items-start items-center justify-around"
                          >
                            <Link to={`/products/${productId._id}`} className="md:flex">
                              <img
                                src={(() => {
                                  const coverIdx = productId?.coverImageIndex ?? 0;
                                  const filename = productId?.image?.[coverIdx] || productId?.image?.[0];
                                  console.log('MyOrders productId.image:', productId?.image, 'filename chosen:', filename);
                                  return filename ? `${import.meta.env.VITE_PORT}/${filename}` : '/ErrorImage.png';
                                })()}
                                alt="product"
                                className="w-24 h-24 object-cover mb-2 md:mr-20"
                                onError={(e) => { console.log('MyOrders failed to load image:', filename); e.target.src = '/ErrorImage.png'; }}
                              />
                              <div className="text-center md:text-left">
                                <p className="font-semibold">{productId.name}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                  {product.size && <p>Size: {product.size}</p>}
                                  {product.metalType && (
                                    <p>
                                      Metal: {
                                        product.metalType === 'SS' ? '925 Silver' :
                                        product.metalType === 'RS' ? 'Rose Silver' :
                                        product.metalType === 'YS' ? 'Yellow Silver' :
                                        product.metalType
                                      }
                                    </p>
                                  )}
                                  {product.quantity && <p>Quantity: {product.quantity}</p>}
                                  {product.unitPriceAtPurchase && <p>Price: ₹{product.unitPriceAtPurchase}</p>}
                                  {product.engraving && <p className="text-blue-600 italic font-serif">Engraving: "{product.engraving}"</p>}
                                  {product.stone && (
                                    <p className={`font-medium ${
                                      product.stone.toLowerCase().includes('ruby') ? 'text-red-600' :
                                      product.stone.toLowerCase().includes('emerald') ? 'text-emerald-600' :
                                      product.stone.toLowerCase().includes('sapphire') && !product.stone.toLowerCase().includes('pink') ? 'text-blue-600' :
                                      product.stone.toLowerCase().includes('citrine') ? 'text-amber-600' :
                                      product.stone.toLowerCase().includes('amethyst') ? 'text-purple-600' :
                                      product.stone.toLowerCase().includes('pink') ? 'text-pink-600' :
                                      product.stone.toLowerCase().includes('black') ? 'text-gray-900' :
                                      'text-gray-600'
                                    }`}>
                                      Stone: {product.stone}
                                    </p>
                                  )}
                                  {product.finish && <p className="text-amber-600">Finish: {product.finish}</p>}
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    {order.status == 'cancelled' ? (
                      <p className="text-red-600">Cancelled</p>
                    ) : (
                      <>
                        <button
                          onClick={() => { setOrderToCancel(order._id); setShowCancelModal(true); }}
                          className="text-white px-4 py-2 bg-red-500 absolute bottom-5 right-5 rounded-xl uppercase tracking-widest text-[10px] md:text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <p className="mt-4">Order Status: {order.status}</p>
                      </>
                    )}
                  </div>
                  <p className="font-bold mt-2">Total Amount: ₹{order.totalAmount}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">No orders found.</p>
        )}
      </div >

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-xl w-full max-w-sm relative">
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-black mb-4 text-center border-b border-gray-100 pb-4">
              Cancel Order?
            </h3>
            <p className="text-xs text-gray-500 mb-8 text-center leading-relaxed">
              Are you sure you want to cancel this order? If you paid online securely, your refund will be automatically initiated to the source account.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowCancelModal(false); setOrderToCancel(null); }}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                No
              </button>
              <button
                onClick={() => handleCancelOrder(orderToCancel)}
                className="flex-1 bg-black text-white font-bold py-3 uppercase tracking-[0.2em] text-[10px] hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyOrders
