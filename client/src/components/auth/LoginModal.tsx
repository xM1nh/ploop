import './_LoginModal.css'

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggle } from '../../features/signup/modalSlice';
import { useState } from 'react';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const LoginModal = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const dispatch = useDispatch()

    const handleCloseButtonClick = () => {
        dispatch(toggle())
    }

    const handleClick = () => {
        setIsSignUp(prev => !prev)
    }

    let content 

    if (!isSignUp) {
        content = 
            <div className='loginModalContent'>
                <div className='loginContainer'>
                    <div className='formContainer'>
                        <h2 className='loginModalTitle'>Log in</h2>
                        <div className='description'>Email or username</div>
                        <form>
                            <div className='inputContainer'>
                                <input className='login username' placeholder="Email or username"/>
                                <div className='inputIconContainer'></div>
                            </div>
                            <div className='inputContainer'>
                                <input className='login password' placeholder="Password" type='password'/>
                                <div className='inputIconContainer'>
                                    <i className='passwordIcon' role='button'>
                                        <VisibilityOffIcon />
                                    </i>
                                </div>
                            </div>
                            <Link to=''>Forgot password?</Link>
                            <button className='loginButton' type='button' disabled={true}>
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
                        <form>
                            <h2 className='loginModalTitle'>Sign up</h2>
                            <div className='description'>Email</div>
                            <div className='inputContainer'>
                                <input className='signup email' placeholder="Email address"/>
                                <div className='inputIconContainer'></div>
                            </div>
                            {<p className='alRegisterErr'>
                                You've already signed up, 

                                <Link to='' className='bottomTextLink' onClick={handleClick}>
                                     <span className='bottomTextSpan'> Log in</span>
                                </Link>  
                            </p>}
                            <div className='inputContainer'>
                                <input className='signup password' placeholder="Password" type='password'/>
                                <div className='inputIconContainer'>
                                    <i className='passwordIcon' role='button'>
                                        <VisibilityOffIcon />
                                    </i>
                                </div>
                            </div>
                            <p className='pwVerificationText'>Your password must have:</p>
                            <div className='pwVerificationReq'>
                                <CheckIcon sx={{height: 12}}/>
                                <span>8 to 20 characters</span>
                            </div>
                            <div className='pwVerificationReq'>
                                <CheckIcon sx={{height: 12}}/>
                                <span>Letters, numbers, and special characters</span>
                            </div>
                            <button className='loginButton' type='button' disabled={true}>
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