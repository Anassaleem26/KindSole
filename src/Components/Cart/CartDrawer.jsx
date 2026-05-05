import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useCart } from "../../Context/CartContext.jsx";
import { Link } from "react-router-dom";



const CartDrawer = ({ isOpen, setIsOpen }) => {
  const { cartItems, addToCart, decreaseQty, deleteFromCart } = useCart(); // given these data from CartContext.jsx


  // Stop backward scrooling when cart open-----------------------------------------------------------


  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "unset");
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);



  // Calculate total price ------------------------------------------------------------------------------

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const totalPrice = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
      return total + (totalPrice * item.quantity);
    }, 0);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">


          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800">Your Cart</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Icon icon="heroicons:x-mark-20-solid" className="size-6 text-gray-600" />
            </button>
          </div>


          {/* Cart Items  */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">

            {cartItems.length === 0 ? (

              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <Icon icon="ph:shopping-cart-light" className="size-16" />
                <p className="text-lg font-medium">Your cart is empty</p>
              </div>

            ) : (
              <div className="space-y-6">

                {cartItems.map((item) => (

                  <div key={item.cartId} className="flex gap-4 border-b border-gray-100 pb-6 group">

                    {/* Image Section */}
                    <div className="w-28 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">

                      <img src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 "
                      />
                    </div>


                    {/* Details Section */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>

                        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-2">{item.productName}</h3>

                        <p className="text-[13px] text-gray-500 uppercase tracking-tight mb-3">

                          <div className="text-gray-500">Size: {item.size}</div>

                          <div className="flex gap-2">
                            Color: <span
                              className="w-5 h-5 flex rounded-sm border border-black transition-all duration-200 p-2"
                              style={{ backgroundColor: item.color.toLowerCase() }}
                              title={item.color}
                            >
                            </span>

                          </div>
                        </p>

                      </div>


                      {/* Price section */}
                      <div className="flex gap-2 items-start">
                        {item.discountPrice > 0 ? (
                          <>
                            <span className="text-md font-bold text-red-600">$ {item.discountPrice}</span>
                            <span className="text-[13px] text-gray-400 line-through tracking-tighter pt-0.5">$ {item.regularPrice}</span>
                          </>
                        ) : (
                          <span className="text-md font-bold text-gray-900">$ {item.regularPrice}</span>
                        )}
                      </div>


                      <div className="flex items-center justify-between mt-4">


                        {/* Quantity Controls */}

                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">



                          <button
                            onClick={() => decreaseQty(item.cartId)}
                            disabled={item.quantity === 1}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-20 transition-colors"
                          >

                            <Icon icon="ph:minus-bold" className="size-3" />

                          </button>

                          <span className="px-2 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item)}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                          >
                            <Icon icon="ph:plus-bold" className="size-3" />
                          </button>
                        </div>

                        {/* Remove btn */}
                        <div className="flex flex-col items-end gap-1">


                          <button
                            onClick={() => deleteFromCart(item.cartId)}
                            className="text-[10px] uppercase font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors mt-1"
                          >
                            <Icon icon="ph:trash" className="size-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Subtotal: </span>
              <span className="text-xl font-bold text-gray-900 italic">$ {calculateTotal()}</span>
            </div>

            <p className="text-[10px] text-gray-500 text-center mb-4 uppercase tracking-widest">
              Shipping & taxes free
            </p>

            <Link
              to="/checkout"
              className="w-full bg-[#212a2f] hover:bg-black text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;