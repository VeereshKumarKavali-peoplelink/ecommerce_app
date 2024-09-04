import { Component } from 'react'
import './index.css'

class SignUpForm extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        gender: 'Male',
        showSubmitError: false,
        errorMsg: '',
    }

    handleGenderChange = (event) => {
        this.setState({ gender: event.target.value })
    };


    onChangeUsername = event => {
        this.setState({ username: event.target.value })
    }

    onChangePassword = event => {
        this.setState({ password: event.target.value })
    }

    onSubmitSuccess = () => {
        const { history } = this.props
        history.replace('/login')
    }

    onSubmitFailure = errorMsg => {
        this.setState({ showSubmitError: true, errorMsg })
    }

    submitForm = async event => {
        event.preventDefault()
        const { username, password, email } = this.state
        const userDetails = { username, password, email }
        const url = 'http://localhost:3000/signup'
        const options = {
            method: 'POST',
            body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok === true) {
            this.onSubmitSuccess()
        } else {
            this.onSubmitFailure(data.error_msg)
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

    renderUsernameField = () => {
        const { username } = this.state
        return (
            <>
                <label className="input-label" htmlFor="username">
                    USERNAME
                </label>
                <input
                    type="text"
                    id="username"
                    className="username-input-filed"
                    value={username}
                    onChange={this.onChangeUsername}
                />
            </>
        )
    }

    renderEmailField = () => {
        const { username } = this.state
        return (
            <>
                <label className="input-label" htmlFor="email">
                    EMAIL
                </label>
                <input
                    type="text"
                    id="email"
                    className="username-input-filed"
                    value={email}
                    onChange={this.onChangeEmail}
                />
            </>
        )
    }

    render() {
        const { showSubmitError, errorMsg } = this.state
        return (
            <div className="signup-form-container">
                <form className="form-container" onSubmit={this.submitForm}>
                    <div className="input-container">{this.renderUsernameField()}</div>
                    <div className="input-container">{this.renderPasswordField()}</div>
                    <div className="input-container">{this.renderEmailField()}</div>
                    <div style={{ marginBottom: '5px', marginTop: '5px' }}>
                        <h1 class="gender-field-heading">Gender</h1>
                        <input type="radio" name="gender" id="genderMale" value="Male" checked={gender === 'Male'}
                            onChange={this.handleGenderChange} />
                        <label for="genderMale" style={{ marginLeft: '5px' }}>Male</label>
                        <input type="radio" name="gender" id="genderFemale" value="Female" checked={gender === 'Female'}
                            onChange={this.handleGenderChange} />
                        <label for="genderFemale" style={{ marginLeft: '5px' }}>Female</label>
                    </div>
                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                    {showSubmitError && <p className="error-message">*{errorMsg}</p>}
                    <p className="login-text"><Link to="/login" className="login-link">LOGIN</Link></p>
                </form>
            </div>
        )
    }
}

export default SignUpForm