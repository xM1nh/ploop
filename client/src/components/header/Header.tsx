import './_Header.css'

import { Link } from 'react-router-dom'

import LogoWhite from '../../assets/Logo Header White.png'
import AddIcon from '@mui/icons-material/Add';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Header = () => {
    return (
        <header>
            <div className="headerLeftContainer">
                <div className='logoImageContainer'>
                    <img className='logo' src={LogoWhite}/>
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
            <div className="headerRightContainer">
                <div className='uploadContainer'>
                    <Link to='/'>
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
        </header>
    )
}

export default Header