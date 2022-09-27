import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { base_url } from '../../constants';
import './Register.css'

function Register() {
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const navigate = useNavigate();
    
    const [isSignUp, setIsSignUp] = useState(false);
    // login form states
    const [registerData, setRegisterData] = useState({
        name : "",
        email : "",
        password : "",
    });
    const [registerFormErrs, setRegisterFormErrs] = useState({});
    const [canRagister, setCanRagister] = useState(false);

    // login form states
    const [loginData, setLoginData] = useState({
        email : "",
        password : "",
    });
    const [loginFormErrs, setLoginFormErrs] = useState({});
    const [canLogin, setCanLogin] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState();
    // const [first, setfirst] = useState(second)
    
    // contactUs detail form handler 
    const handleRagisterChange = (e) => {
        // console.log(e.target);
        const { name, value } = e.target;
        setRegisterData({...registerData, [name]: value});
        // console.log(registerData);
    }

    const handleRagister = (e) => {
        e.preventDefault();
        setRegisterFormErrs(validateRagister(registerData));
        setCanRagister(true);
    }
    // console.log("canRagister", canRagister);
    
    const validateRagister = (values) => {
        const errors = {};
        const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!values.name) {
            errors.name = "name is required!";
        }
        if(!values.email) {
            errors.email = "email is required!";
        }else if(!regexEmail.test(values.email)){
            errors.email = "please enter a valid email!";
        }
        if(!values.password) {
            errors.password = "password is required!";
        }
        if(!confirmPassword) {
            errors.confirmPassword = "confirm password is required!";
        }else if(values.password !== confirmPassword) {
            errors.confirmPassword = "password mismatch!";
        }
        return errors;
    }
    
    useEffect(() => {
        if(Object.keys(registerFormErrs).length > 0) {
            toast.warning( "Please enter valid information" );
        }else if (Object.keys(registerFormErrs).length === 0 && canRagister) {
            registerApi();
        }else {
            return
        }
    }, [registerFormErrs, canRagister]);

    // Api call using axios
    const registerApi = () => {
        setRegisterLoading(true);
        axios({
            url: `${base_url}/register`,
            method: 'POST',
            data: registerData,
        })
        .then((responce) => {
            if(responce){
                setRegisterLoading(false);
                // console.log("registerApi", responce.data);
                toast.success( responce.data.message );
                setIsSignUp(false);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error( err.message );
            setRegisterLoading(false);
        })
    }

    // contactUs detail form handler 
    const handleLoginChange = (e) => {
        // console.log(e.target);
        const { name, value } = e.target;
        setLoginData({...loginData, [name]: value});
        // console.log(loginData);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginFormErrs(validateLogin(loginData));
        setCanLogin(true);
    }
    // console.log("canLogin", canLogin);
    
    const validateLogin = (values) => {
        const errors = {};
        const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!values.email) {
            errors.email = "email is required!";
        }else if(!regexEmail.test(values.email)){
            errors.email = "please enter a valid email!";
        }
        if(!values.password) {
            errors.password = "password is required!";
        }
        return errors;
    }

    useEffect(() => {
        if(Object.keys(loginFormErrs).length > 0) {
            toast.warning( "Please enter valid information" );
        }else if (Object.keys(loginFormErrs).length === 0 && canLogin) {
            loginApi();
        }else {
            return
        }
    }, [loginFormErrs, canLogin]);

    // Api call using axios
    const loginApi = () => {
        setLoginLoading(true);
        axios({
            url: `${base_url}/login`,
            method: 'POST',
            data: loginData,
        })
        .then((responce) => {
            if(responce){
                if(responce.data.token){
                    localStorage.setItem("clock_access_token", responce.data.token)
                    setLoginLoading(false);
                    // console.log("loginApi", responce.data.token);
                    navigate('/dashboard')
                }
            }
        })
        .catch(err => {
            toast.error( err.message );
            console.log(err);
            setLoginLoading(false);
        })
    }

    // to refresh form's data on switching forms
    useEffect(() => {
        if(isSignUp){
            setRegisterData({
                ...registerData,
                name : "",
                email : "",
                password : "",
            });
            setConfirmPassword('');
            setRegisterFormErrs({});
        }else {
            setLoginData({...loginData,
                email : "",
                password : "",
            });
            setLoginFormErrs({});
        }
    }, [isSignUp])
    
    return (
        <div className='register'>
            <p class="sign" align="center">{isSignUp ? "Sign up" : "Log in"}</p>
            {!isSignUp ?
                <form class="form1" onSubmit={handleLogin}>
                    <input 
                        class="email" 
                        name="email" 
                        type="email" 
                        align="center" 
                        placeholder="Email" 
                        value={loginData.email}
                        onChange={handleLoginChange}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {loginFormErrs.email && `* ${loginFormErrs.email}`}
                        {/* * please enter a valid email! */}
                    </span>
                    <input 
                        class="pass" 
                        name="password" 
                        type="password" 
                        align="center" 
                        placeholder="Password" 
                        value={loginData.password}
                        onChange={handleLoginChange}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {loginFormErrs.password && `* ${loginFormErrs.password}`}
                    </span>
                    <button type="submit" class="submit" align="center">log in</button>
                    <p class="forgot" align="center">
                        <a href="#">Forgot Password? </a>
                    </p>
                </form>
                :
                <form class="form1 mb-5" onSubmit={handleRagister}>
                    <input 
                        class="text" 
                        name="name" 
                        type="text" 
                        align="center" 
                        placeholder="Name" 
                        value={registerData.name}
                        onChange={handleRagisterChange}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {registerFormErrs.name && `* ${registerFormErrs.name}`}
                    </span>
                    <input 
                        class="email" 
                        name="email" 
                        type="email" 
                        align="center" 
                        placeholder="Email" 
                        value={registerData.email}
                        onChange={handleRagisterChange}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {registerFormErrs.email && `* ${registerFormErrs.email}`}
                    </span>
                    <input 
                        class="pass" 
                        name="password" 
                        type="password" 
                        align="center" 
                        placeholder="Password" 
                        value={registerData.password}
                        onChange={handleRagisterChange}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {registerFormErrs.password && `* ${registerFormErrs.password}`}
                    </span>
                    <input 
                        class="pass" 
                        name="confirmPassword" 
                        type="password" 
                        align="center" 
                        placeholder="confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value)}}
                    />
                    <span className="form-errs position-relative text-danger text-sm d-flex justify-content-end">
                        {registerFormErrs.confirmPassword && `* ${registerFormErrs.confirmPassword}`}
                    </span>
                    <button type="submit" class="submit" align="center">Sign up</button>
                </form>
            }
            <p class="signup" align="center">
                <a href="#" className='text-primary' onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ?"Already have account, Login?" : "Don't have account, SignUp?"} 
                </a>
            </p>
        </div>
    )
}

export default Register