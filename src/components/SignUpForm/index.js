import { Component } from 'react'
import {Link} from 'react-router-dom';
import './index.css';
import config from '../../config';

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

    onChangeEmail = event => {
        this.setState({ email: event.target.value })
    }


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
        const url = `${config.API_BASE_URL}/signup`
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
       
        console.log(data);
        if (data.msg === "User created successfully") {
            this.onSubmitSuccess()
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
        const { email} = this.state
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
        const { showSubmitError, errorMsg, gender, email } = this.state
        return (
            <div className="signup-form-container">
                <form className="form-container" onSubmit={this.submitForm}>
                    <div className="input-container">{this.renderUsernameField()}</div>
                    <div className="input-container">{this.renderPasswordField()}</div>
                    <div className="input-container">{this.renderEmailField()}</div>
                    <div className="input-container-gender"  style={{ marginBottom: '5px', marginTop: '5px' }}>
                        <h1 className="input-label">Gender</h1>
                        <div>
                        <input type="radio" name="gender" id="genderMale" value="Male" checked={gender === 'Male'}
                            onChange={this.handleGenderChange} />
                        <label htmlFor="genderMale" >Male</label>
                        </div>
                        <div>
                        <input type="radio" name="gender" id="genderFemale" value="Female" checked={gender === 'Female'}
                            onChange={this.handleGenderChange} />
                        <label htmlFor="genderFemale" style={{ marginLeft: '5px' }}>Female</label>
                        </div>
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