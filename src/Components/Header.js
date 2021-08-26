import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Modal from 'react-modal'
import '../Styles/header.css'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import axios from 'axios'

const constants = require('../Constants')
const API_URL = constants.API_URL;

// copied from react-modal
const customStyles = {   
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '450px'
    },
  };
  Modal.setAppElement('#root');



 class Header extends Component {
    constructor(){
        super();
        this.state = {
            backgroundStyle: '',
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined
        }
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname
        this.setHeaderStyle(initialPath)

        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname)
        })
    }

    setHeaderStyle = (path) => {
        let bg='';
        if(path ==='/' || path ==='/home'){
            bg = 'transparent'
        }
        else{
            bg = 'coloured'
        }
        this.setState({
            backgroundStyle: bg
        });
    }

    goToHome = ()=> {
        this.props.history.push('/')
    }

    openLoginModel = () => {
        this.setState({
            isLoginModalOpen: true
        })
    }

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false
        })
    }

    loginHandler = () => {
        const {username, password} = this.state;

        const obj = {
            username: username,
            password:password
        }

        axios({
            method: 'POST',
            url:`${API_URL}/api/login`,
            headers: {'Content-Type': 'application/json'},
            data:obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user))
            localStorage.setItem("isLoggedIn", true)
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            })
        }).catch(error => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or Password is wrong"
            })
        })
    }

    loginCancelHandler = () => {
        this.closeLoginModal()
    }

    openSignUpModel = () => {
        this.setState({
            isSignUpModalOpen: true
        })  
    }

    closeSignUpModal = () => {
        this.setState({
            isSignUpModalOpen:false
        }) 
    }

    SignUpHandler = () => {
        const {firstName, lastName, username, password} = this.state;

        const obj = {
            firstName: firstName,
            lastName: lastName,
            email: username,
            password:password
        }

        axios({
            method: 'POST',
            url:`${API_URL}/api/signUp`,
            headers: {'Content-Type': 'application/json'},
            data:obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user))
            localStorage.setItem("isLoggedIn", true)
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                signUpError: undefined,
                openSignUpModel: false
            })
        }).catch(error => {
            this.setState({
                isLoggedIn: false,
               // loginError: "Username or Password is wrong"
            })
        })
    }

    SignUpCancelHandler = () => {
        this.closeSignUpModal()
    }

    responseFacebook = (data) => {
        debugger
        // take the data to make API calls to login/signup the user
    }

    responseGoogle = (data) => {
        debugger
        // take the data to make API calls to login/signup the user
    }

    toggleAuth = (auth) => {
        if(auth === 'login'){
            this.SignUpCancelHandler()
            this.openLoginModel()
        }else{
            this.loginCancelHandler()
            this.openSignUpModel()
        }
    }

    handleChange = (e, field) => {
        const val = e.target.value;

        this.setState({
            [field]:val,
            loginError: undefined,
            signUpError: undefined
        })
    }

    logout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
        this.setState({
            user: undefined,
            isLoggedIn: false
        })
    }

    render() {
        const { backgroundStyle, isLoginModalOpen, isSignUpModalOpen, username, password, firstName, lastName, user, loginError, signUpError, isLoggedIn } = this.state;
        return (
            <React.Fragment>
                <div className="header" style={{'background': backgroundStyle == 'transparent' ? 'transparent' : '#ce0505'}} > 
                    <div className="container">
                        <div className="row">
                            <div className="logoSection col-6">
                                {
                                    backgroundStyle == 'transparent'
                                    ?
                                    null
                                    :
                                    <div className="logo-small" onClick={this.goToHome}>e!</div>
                                }
                            </div>
                            <div className="loginSection col-6">
                                {
                                    isLoggedIn
                                    ?

                                    <>
                                        <span className="text-white m-4">{user.firstName}</span>
                                        <button className="signup-button" onClick={this.logout}>Logout</button>
                                    </>
                                    :
                                    <>
                                       <button className="login-button" onClick={this.openLoginModel}>Login</button>
                                       <button className="signup-button" onClick={this.openSignUpModel}>SignUp</button>
                                    </>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>




                <Modal isOpen={ isLoginModalOpen } style={customStyles} >

                    <h2 className="popup-heading">Login
                        <button className="float-end btn btn-close mt-2" onClick={this.closeLoginModal}></button>
                    </h2>

                    <form className="my-4">
                        <input className="form-control" type="text" placeholder="Email" value={username} onChange={(e) => this.handleChange(e, 'username')} />
                        <input className="form-control my-2" type="password" placeholder="Password" value={password} onChange={(e) => this.handleChange(e, 'password')} />

                        <input type="button" className="btn form-control btn-primary login-btn my-1" onClick={this.loginHandler} value="Login"/>
                        <button className="btn form-control btn-secondary my-1" onClick={this.loginCancelHandler}>Cancel</button>
                    </form>

                    <div className="text-center">
                        <FacebookLogin
                        appId="580780759764053"
                        textButton="Continue with Facebook"
                        size=""
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass="my-facebook-button-class"
                        icon="fa-facebook "
                    />

                    <GoogleLogin
                        clientId="458768078632-irvctbfkb37il4rnrl3fsfhv3odhvjd4.apps.googleusercontent.com"
                        buttonText="Continue with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="my-facebook-button-class"
                    />
                    </div>
                    <hr/>
                    <div className="text-bottom">
                        Don't have an account? <button className="text-danger btn m-0 p-0" onClick = {() => this.toggleAuth('signup')}>SignUp</button>
                    </div>
                </Modal>




                <Modal isOpen={ isSignUpModalOpen } style={customStyles} >

                    <h2 className="popup-heading">SignUp
                        <button className="float-end btn btn-close mt-2" onClick={this.closeSignUpModal}></button>
                    </h2>

                    <form>
                        <input className="form-control" type="text" placeholder="First Name" value={firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                        <input className="form-control my-2" type="text" placeholder="Last Name" value={lastName} onChange={(e) => this.handleChange(e, 'lastName')} />
                        <input className="form-control" type="text" placeholder="Email" value={username} onChange={(e) => this.handleChange(e, 'username')} />
                        <input className="form-control my-2" type="password" placeholder="Password" value={password} onChange={(e) => this.handleChange(e, 'password')} />

                        <button className="btn form-control btn-primary login-btn my-1" onClick={this.SignUpHandler}>SignUp</button>
                        <button className="btn form-control btn-secondary my-1" onClick={this.SignUpCancelHandler}>Cancel</button>
                    </form>

                    <div className="text-center">
                        <FacebookLogin
                        appId="580780759764053"
                        textButton="Continue with Facebook"
                        size=""
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass="my-facebook-button-class"
                        icon="fa-facebook "
                    />

                    <GoogleLogin
                        clientId="458768078632-irvctbfkb37il4rnrl3fsfhv3odhvjd4.apps.googleusercontent.com"
                        buttonText="Continue with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="my-facebook-button-class"
                    />
                    </div>
                    <hr/>
                    <div className="text-bottom">
                        Already have an account? <button className="text-danger btn m-0 p-0" onClick = {() => this.toggleAuth('login')}>Login</button>
                    </div>
                </Modal>

            </React.Fragment>
        )
    }
}

export default withRouter(Header);
