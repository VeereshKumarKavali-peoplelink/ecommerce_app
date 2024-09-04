import {Link} from 'react-router-dom'


import './index.css'


const EmptyCartView = () => (
  <div className="cart-empty-view-container">
  
    <h1 className="cart-empty-heading">Your Cart Is Empty</h1>
    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Shop Now
      </button>
    </Link>
  </div>
)

export default EmptyCartView
