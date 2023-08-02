import './_Header.css'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectAuthentication } from '../../features/auth/authSlice';
import { toggle } from '../../features/signup/modalSlice';
import { useDispatch } from 'react-redux';

import LogoWhite from '../../assets/Logo Header White.png'
import AddIcon from '@mui/icons-material/Add';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Header = () => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(selectAuthentication)

    const handleLoginButtonClick = () => {
        dispatch(toggle())
    }

    let headerRightContainer

    if (isLoggedIn) {
        headerRightContainer = 
            <div className="headerRightContainer">
                <div className='uploadContainer'>
                    <Link to='/create'>
                        <AddIcon />
                        <span className='uploadText'>Create</span>
                    </Link>
                </div>
                
                <div className='messageContainer'>
                    <InboxOutlinedIcon sx={{color: 'white'}}/>
                </div>
                <div className='notificationContainer'>
                    <NotificationsNoneOutlinedIcon sx={{color: 'white'}}/>
                </div>
                <div className='profileContainer'>More</div>
            </div>
    }

    if (!isLoggedIn) {
        headerRightContainer = 
            <div className="headerRightContainer">
                <div className='uploadContainer'>
                    <Link to='/create'>
                        <AddIcon />
                        <span className='uploadText'>Create</span>
                    </Link>
                </div>
                
                <button className='headerLoginButton' onClick={handleLoginButtonClick}>Log in</button>
            </div>
    }

    return (
        <header>
            <div className='headerWrapper'>
                <div className="headerLeftContainer">
                    <div className='logoImageContainer'>
                        <Link to='/'>
                            <img className='logo' src={LogoWhite}/>
                        </Link>
                    </div>
                </div>
                <div className="headerCenterContainer">
                    <div className="searchFormContainer">
                        <form className="searchForm">
                            <input className='searchInput' name='searchQuery' type='search'></input>
                            <span className='splitter'></span>
                            <button className='searchButton'>
                                <SearchOutlinedIcon sx={{color: 'rgba(255, 255, 255, 0.34)'}}/>
                            </button>
                        </form>
                    </div>
                </div>
                {headerRightContainer}
            </div>
        </header>
    )
}

export default Header