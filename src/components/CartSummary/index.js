import CartContext from '../../context/CartContext';
import Modal from 'react-modal';
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
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Confirmation Modal"
                        className="confirmation-modal"
                        overlayClassName="modal-overlay"
                    >
                        <h2>Are you sure you want to checkout?</h2>
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
                                    value="Online Payment"
                                    checked={paymentMethod === 'Online Payment'}
                                    onChange={handlePaymentChange}
                                />
                                Online Payment
                            </label>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={closeModal}>Cancel</button>
                            <button onClick={() => {
                                closeModal();
                                console.log('Payment Method:', paymentMethod);
                                alert(`You chose ${paymentMethod}. Proceeding to checkout.`);
                            }}>Confirm</button>
                        </div>
                    </Modal>
                </>
            )
        }}
    </CartContext.Consumer>)
}

export default CartSummary