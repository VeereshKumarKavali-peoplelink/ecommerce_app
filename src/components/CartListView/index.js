import CartItem from '../CartItem'
import CartContext from '../../context/CartContext'

import './index.css'
import CartSummary from '../CartSummary'

const CartListView = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
      return (
        <ul className="cart-list">
          {cartList.map(eachCartItem => (
            <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
          ))}
          <div className='cart-summary'>
            <CartSummary/>
          </div>
        </ul>
      )
    }}
  </CartContext.Consumer>
)

export default CartListView
