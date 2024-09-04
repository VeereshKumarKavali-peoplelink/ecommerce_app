import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  addCartItem: () => {},
  deleteCartItem: () => {},
  incrementQuantity: ()=>{},
  decrementQuantity: ()=>{}
})

export default CartContext
