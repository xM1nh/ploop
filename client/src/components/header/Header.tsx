import './_Header.css'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectAuthentication, selectUser } from '../../features/auth/authSlice';
import { toggleAuth } from '../../features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { useGetUserQuery } from '../../features/user/userApiSlice';
import Notification from '../modal/notification/Notification';

import LogoWhite from '../../assets/Logo Header White.png'
import AddIcon from '@mui/icons-material/Add';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Header = () => {
    const userId = useSelector(selectUser)
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(selectAuthentication)

    const {
        data: userData,
    } = useGetUserQuery({userId: userId as string, currentUserId: userId}, {skip: !userId})

    const toggleLoginModal = () => {
        dispatch(toggleAuth())
    }

    let uploadButton

    if (isLoggedIn) {
        uploadButton = 
                    <Link to='/create'>
                        <AddIcon />
                        <span className='uploadText'>Create</span>
                    </Link>
    }

    if (!isLoggedIn) {
        uploadButton = 
                    <a onClick={toggleLoginModal}>
                        <AddIcon />
                        <span className='uploadText'>Create</span>
                    </a>
    }


    let headerRightContainer

    if (isLoggedIn) {
        headerRightContainer = 
            <div className="headerRightContainer">
                <div className='uploadContainer'>
                    {uploadButton}
                </div>
                
                <div className='messageContainer'>
                    <InboxOutlinedIcon sx={{color: 'white', cursor: 'pointer'}}/>
                    <sup>2</sup>
                </div>
                <Notification />
                <Link to={`/${userId}`}>
                    <div className='profileContainer' style={{backgroundImage: `url(${userData?.avatar_url})`}}></div>
                </Link>
            </div>
    }

    if (!isLoggedIn) {
        headerRightContainer = 
            <div className="headerRightContainer">
                <div className='uploadContainer'>
                    {uploadButton}
                </div>
                
                <button className='headerLoginButton' onClick={toggleLoginModal}>Log in</button>
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