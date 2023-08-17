import './_LoginModal.css'

import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggle } from '../../../features/signup/modalSlice';
import { useLoginMutation, useSignupMutation } from '../../../features/auth/authApiSlice';
import { setCredentials } from '../../../features/auth/authSlice'; 

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const LoginModal = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [signUpEmail, setSignUpEmail] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [signUpName, setSignUpName] = useState('')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [showValidation, setShowValidation] = useState(false)
    const [showEmailValidation, setShowEmailValidation] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    const dispatch = useDispatch()

    const [signup] = useSignupMutation()

    const [login] = useLoginMutation()

    const handleSUEmailChange = (e: FormEvent<HTMLInputElement>) => setSignUpEmail(e.currentTarget.value)
    const handleSUPwChange = (e: FormEvent<HTMLInputElement>) => setSignUpPassword(e.currentTarget.value)
    const handleLoginEmailChange = (e: FormEvent<HTMLInputElement>) => setLoginEmail(e.currentTarget.value)
    const handleLoginPwChange = (e: FormEvent<HTMLInputElement>) => setLoginPassword(e.currentTarget.value)

    const signUpLengthValidation = () => {
        if (signUpPassword.length >= 8 && signUpPassword.length <= 20) return true
        return false
    }

    const signUpCharValidation = () => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/
        return regex.test(signUpPassword)
    }

    const signUpEmailValidation = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(signUpEmail)
    }

    const isSignUpDisabled = () => {
        return !(signUpCharValidation() && signUpLengthValidation() && signUpEmailValidation())
    }

    const isLoginDisabled = () => {
        return loginEmail === '' || loginPassword === ''
    }
    
    const handleCloseButtonClick = () => {
        dispatch(toggle())
    }

    const handleClick = () => {
        setIsSignUp(prev => !prev)
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const {id, accessToken} = await login({email: loginEmail, password: loginPassword}).unwrap()
            dispatch(setCredentials({userId: id, accessToken}))
            dispatch(toggle())
            localStorage.setItem('isLoggedIn', JSON.stringify(true))
        } catch (e) {
            console.log(e)
        }
    }

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const {userId} = await signup({email: signUpEmail, password: signUpPassword, nickname: signUpName}).unwrap()
            if (userId) {
                const {id, accessToken} = await login({email: signUpEmail, password: signUpPassword}).unwrap()
                dispatch(setCredentials({userId: id, accessToken}))
                dispatch(toggle())
            } else {
                console.log('else')
            }
        } catch (e) {
            console.log(e)
        }
    }

    let content 

    if (!isSignUp) {
        content = 
            <div className='loginModalContent'>
                <div className='loginContainer'>
                    <div className='formContainer'>
                        <h2 className='loginModalTitle'>Log in</h2>
                        <div className='description'>Email or username</div>
                        <form onSubmit={handleLogin}>
                            <div className='inputContainer'>
                                <input className='login username' name='username' placeholder="Email or username" value={loginEmail} onChange={handleLoginEmailChange}/>
                                <div className='inputIconContainer'></div>
                            </div>
                            <div className='inputContainer'>
                                <input 
                                    className='login password' 
                                    name='password' 
                                    placeholder="Password" 
                                    type={passwordVisibility ? 'text' : 'password'}  
                                    value={loginPassword} 
                                    onChange={handleLoginPwChange}/>
                                <div className='inputIconContainer' onClick={() => setPasswordVisibility(prev => !prev)}>
                                    <i className='passwordIcon' role='button'>
                                        {
                                            passwordVisibility 
                                                ? <VisibilityIcon />
                                                : <VisibilityOffIcon />
                                        }
                                    </i>
                                </div>
                            </div>
                            <Link to=''>Forgot password?</Link>
                            <button className='loginButton' type='submit' disabled={isLoginDisabled()}>
                                Log in
                            </button>
                        </form>
                    </div>
                </div>

                <div className='footer'>
                    <div className='bottomText'>Don't have an account?</div>
                    <Link to='' className='bottomTextLink' onClick={handleClick}>
                        <span className='bottomTextSpan'>Sign up</span>
                    </Link>
                </div>

            </div>
    }

    if (isSignUp) {
        content = 
            <div className='loginModalContent'>
                <div className='loginContainer'>
                    <div className='formContainer'>
                        <form onSubmit={handleSignup}>
                            <h2 className='loginModalTitle'>Sign up</h2>
                            <div className='description'>Email</div>
                            <div className='inputContainer'>
                                <input 
                                    className='signup email' 
                                    placeholder="Email address" 
                                    value={signUpEmail} 
                                    onChange={handleSUEmailChange}
                                    onFocus={() => setShowEmailValidation(true)}
                                    onBlur={() => setShowEmailValidation(false)}/>
                                <div className='inputIconContainer'></div>
                            </div>
                            {(showEmailValidation && !signUpEmailValidation()) &&
                                <div className='pwVerificationReq' data-validate={signUpEmailValidation()}>
                                    <span>Please enter a valid email</span>
                                </div>
                            }
                            {/*
                                <p className='alRegisterErr'>
                                    You've already signed up, 

                                    <Link to='' className='bottomTextLink' onClick={handleClick}>
                                        <span className='bottomTextSpan'> Log in</span>
                                    </Link>  
                                </p>
                            */}
                            <div className='inputContainer'>
                                <input 
                                    className='signup password' 
                                    placeholder="Password" 
                                    type={passwordVisibility ? 'text' : 'password'} 
                                    value={signUpPassword} 
                                    onChange={handleSUPwChange}
                                    onFocus={() => setShowValidation(true)}
                                    onBlur={() => setShowValidation(false)}/>
                                <div className='inputIconContainer' onClick={() => setPasswordVisibility(prev => !prev)}>
                                    <i className='passwordIcon' role='button'>
                                        {
                                            passwordVisibility 
                                                ? <VisibilityIcon />
                                                : <VisibilityOffIcon />
                                        }
                                    </i>
                                </div>
                            </div>
                            {showValidation &&
                                <>
                                    <p className='pwVerificationText'>Your password must have:</p>
                                    <div className='pwVerificationReq' data-validate={signUpLengthValidation()}>
                                        <CheckIcon sx={{height: 12}}/>
                                        <span>8 to 20 characters</span>
                                    </div>
                                    <div className='pwVerificationReq' data-validate={signUpCharValidation()}>
                                        <CheckIcon sx={{height: 12}}/>
                                        <span>Letters, numbers, and special characters</span>
                                    </div>
                                </>
                            }
                            <div className='inputContainer'>
                                <input 
                                    className='signup name'
                                    placeholder='Your Name'
                                    value={signUpName}
                                    onChange={e => setSignUpName(e.target.value)}    
                                />
                            </div>
                            <button className='loginButton' type='submit' disabled={isSignUpDisabled()}>
                                Signup
                            </button>
                        </form>
                    </div>
                </div>

                <div className='agreement'>
                    <p className='agreementText'>
                        By continuing, you agree to 
                        <span style={{color: 'rgba(22,24,35,1)'}}> HAVE FUN </span>
                        and confirm that you are ready to 
                        <span style={{color: 'rgba(22,24,35,1)'}}> HAVE FUN</span>
                        .
                    </p>
                </div>

                <div className='footer'>
                    <div className='bottomText'>Already have an account?</div>
                    <Link to='' className='bottomTextLink' onClick={handleClick}>
                        <span className='bottomTextSpan'>Log in</span>
                    </Link>
                </div>
            </div>
    }

    return (
        <div className='loginModalContainer'>
            <div className='modalMask'></div>
            <div className='loginModalWrapper'>
                <div className='loginModal'>
                    {content}
                    <div className='modalCloseButton' onClick={handleCloseButtonClick}>
                        <CloseIcon sx={{width: 15, height: 15}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal