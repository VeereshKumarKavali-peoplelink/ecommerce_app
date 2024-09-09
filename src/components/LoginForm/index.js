import { Component } from 'react'
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie'
import './index.css'
import config from '../../config';

class LoginForm extends Component {
    state = {
        email: '',
        password: '',
        showSubmitError: false,
        errorMsg: '',
    }

    onChangeEmail = event => {
        this.setState({ email: event.target.value })
    }

    onChangePassword = event => {
        this.setState({ password: event.target.value })
    }

    onSubmitSuccess = async(jwtToken) => {

        const url = `${config.API_BASE_URL}/user`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwtToken}`
              },

        }
        const response = await fetch(url, options)
        const data = await response.json()
        localStorage.setItem("userId", JSON.stringify(data.userId))
        const { history } = this.props

        Cookies.set('jwt_token', jwtToken, { expires: 30 })
        history.replace('/')
    }

    onSubmitFailure = errorMsg => {
        this.setState({ showSubmitError: true, errorMsg })
    }

    submitForm = async event => {
        event.preventDefault()
        const { email, password } = this.state
        const userDetails = { email, password }
        const url = `${config.API_BASE_URL}/login`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
            body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (data.ok === true) {
            this.onSubmitSuccess(data.jwtToken)
        } else {
            this.onSubmitFailure(data.err_msg)
        }
    }

    renderPasswordField = () => {
        const { password } = this.state
        return (
            <>
                <label className="input-label" htmlFor="password">
                    PASSWORD
                </label>
                <input
                    type="password"
                    id="password"
                    className="password-input-filed"
                    value={password}
                    onChange={this.onChangePassword}
                />
            </>
        )
    }

    renderEmailField = () => {
        const { email } = this.state
        return (
            <>
                <label className="input-label" htmlFor="email">
                    EMAIL
                </label>
                <input
                    type="text"
                    id="email"
                    className="email-input-filed"
                    value={email}
                    onChange={this.onChangeEmail}
                />
            </>
        )
    }

    render() {
        const { showSubmitError, errorMsg } = this.state
        return (
            <div className="login-form-container">
                <form className="form-container" onSubmit={this.submitForm}>
                    <div className="input-container">{this.renderEmailField()}</div>
                    <div className="input-container">{this.renderPasswordField()}</div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    {showSubmitError && <p className="error-message">*{errorMsg}</p>}
                    <p className="signup-text">
                        Don't have an account?{' '}
                        <Link to="/signup" className="signup-link">Sign Up</Link>
                    </p>
                </form>
            </div>
        )
    }
}

export default LoginForm