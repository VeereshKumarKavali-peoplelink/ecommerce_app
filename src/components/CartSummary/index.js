import CartContext from '../../context/CartContext';
import {useState} from 'react';

import './index.css';

const CartSummary = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleConfirm = ()=>{
    setModalIsOpen(false);
  }

    return (<CartContext.Consumer>
        {value => {
            const { cartList } = value;
            let totalAmount = 0;
            cartList.forEach((eachItem) => {
                totalAmount += eachItem.price * eachItem.quantity
            })
            return (
                <>
                    <p className="order-text">Order Total: <span className="order-amount">{totalAmount}/-</span><br />{cartList.length} items in cart</p>
                    <button className="proceed-btn" onClick={openModal}>Proceed</button>

                    {modalIsOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Are you sure you want to check out?</h2>
                                    <div className="payment-options">
                                        <label>
                                            <input
                                                type="radio"
                                                value="Cash on Delivery"
                                                checked={paymentMethod === 'Cash on Delivery'}
                                                onChange={handlePaymentChange}
                                            />
                                            Cash on Delivery
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="Online"
                                                checked={paymentMethod === 'Online'}
                                                onChange={handlePaymentChange}
                                            />
                                            Online
                                        </label>
                                    </div>
                                    <div className="modal-actions">
                                        <button onClick={handleConfirm}>OK</button>
                                        <button onClick={closeModal}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                   
                </>
            )
        }}
    </CartContext.Consumer>)
}

export default CartSummary