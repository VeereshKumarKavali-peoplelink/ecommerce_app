import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'
import CartItem from './components/CartItem';



class App extends Component {
   userId = JSON.parse(localStorage.getItem("userId")); 

  state = {
    cartList: JSON.parse(localStorage.getItem(this.userId)) || []
  }

  addCartItem = product => {
    this.setState(prevState => {
      const { cartList } = prevState;
  
      // Check if the product is already in the cart
      const productExists = cartList.some(eachItem => eachItem.id === product.id);
  
      if (productExists) {
        // If product exists, map over the cart and update the quantity
        const updatedCartList = cartList.map(eachItem => {
          if (eachItem.id === product.id) {
            return { ...eachItem, quantity: eachItem.quantity + product.quantity };
          }
          return eachItem;
        });
  
        return { cartList: updatedCartList };
      } else {
        // If product doesn't exist, add it to the cart with an initial quantity
        return { cartList: [...cartList, product]};
      }
    }, ()=>{
      const {cartList} = this.state;
      localStorage.setItem(this.userId, JSON.stringify(cartList));
     console.log(cartList);
    });

  }

  deleteCartItem = (id) => {
    const {cartList} = this.state
    const filteredList = cartList.filter((eachItem)=> eachItem.id !== id);
    localStorage.setItem(this.userId, JSON.stringify(filteredList));
    this.setState({cartList: filteredList})
  }

  incrementQuantity = (id)=>{
    const {cartList} = this.state
    const updatedList = cartList.map((eachItem)=> {
      if (eachItem.id === id){
        return {...eachItem, quantity: eachItem.quantity + 1}
      }
      return eachItem
    })
    localStorage.setItem(this.userId, JSON.stringify(updatedList));
    this.setState({cartList: updatedList})
  }

  decrementQuantity = (id)=>{
    const {cartList} = this.state
    const updatedList = cartList.map((eachItem)=> {
      if (eachItem.id === id && eachItem.quantity > 1){
        return {...eachItem, quantity: eachItem.quantity - 1}
      }
      return eachItem
    })
   localStorage.setItem(this.userId, JSON.stringify(updatedList));
    this.setState({cartList: updatedList})
  }


  render() {
    const {cartList} = this.state

    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            incrementQuantity: this.incrementQuantity,
            decrementQuantity: this.decrementQuantity
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/signup" component={SignUpForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App
