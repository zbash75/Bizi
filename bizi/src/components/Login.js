import React, { Component } from 'react'
import Nav from './Nav'
import { Link, withRouter } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import Loader from 'react-loader-spinner'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEmail: '',
            userPassword: '',
            errorMessage: '',
            loggingIn: false
        };
    }

    getCurrentUser = async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        }
        catch (error) {
            console.log('error checking auth', error);
        }
    }

    setUserEmail = (e) => {
        this.setState({
            userEmail: e.target.value
        });
    }

    setUserPassword = (e) => {
        this.setState({
            userPassword: e.target.value
        });
    }

    setErrorMessage = (msg) => {
        this.setState({
            errorMessage: msg
        });
    }

    doLogin = async(e) => {
        const { userEmail, userPassword } = this.state;
        console.log('logging in');
        e.preventDefault();
        const username = userEmail;
        const password = userPassword;
        this.setState({
            loggingIn: true
        });
        try {
            const user = await Auth.signIn(username, password);
            this.props.history.push('/account');
        }
        catch (error) {
            console.log('error signing in', error);
            let message = 'User does not exist.';
            this.setState({
                loggingIn: false
            });
            return message;
        }
    }

    async componentDidMount() {
        const currentUser = await this.getCurrentUser();
        currentUser && this.props.history.push('/account')
    }


    render() {
        const {
            errorMessage,
            loggingIn
        } = this.state;


        return (
            <div className="login">
                <Nav light={false} />
                <div className="loginHeader">
                    <h1>Welcome Back!</h1>
                    <p>New to Bizi? <Link to="/create">Create an Account</Link></p>
                </div>

                <div className="loginBody">
                    <form onSubmit={async(e) => {
                        const error = await this.doLogin(e);
                        console.log(error);
                        if (error) {
                            this.setErrorMessage(error);
                        }
                    }}>
                        <div className="inputGroup">                    
                            <label className="loginLabel" for="email">E-mail</label>
                            <input type="text" name="email" onInput={this.setUserEmail}/>
                        </div>
                        
                        <div className="inputGroup">                    
                            <label className="loginLabel" for="password">Password</label>
                            <input type="password" name="password" onInput={this.setUserPassword}/>
                            <p>{errorMessage}</p>         
                        </div>        

                        <div className="checkboxGroup">
                            <label for="rememberMe">Remember Me</label>
                            <input type="checkbox" name="rememberMe"/>                            
                        </div>

                        <div className='inputGroup'>
                            <input className='loginBtn' type='submit' value='Log In'/>
                        </div>
                        {
                            loggingIn && <Loader
                                type="TailSpin"
                                color="#385FDC"
                                height={40}
                            />
                        }

                        {/* <button className="loginBtn" onClick={() => {this.doLogin();}}>Log In</button> */}
                        <Link className="smallText" to="forgot-password">Forgot your password?</Link>
                    </form>
                    <div className="socialLogin">
                        <button className="facebook">Log in with Facebook</button>
                        <button className="google">Log in with Google</button>
                    </div>
                    
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>                     
            </div>
        );
    }
}

export default withRouter(Login);