import './_Navbar.css'

import { Link } from 'react-router-dom'

import HomeIcon from '@mui/icons-material/Home';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';

const Navbar = () => {
    return (
        <div>
        <div style={{position: 'relative', width: '240px'}}>
        <div className="sideNavBar">
            <div className='sideNavBarContainer'>
                <nav className='mainNavContainer'>
                    <ul className='mainNav'>
                        <li>
                            <div>
                                <Link to=''>
                                    <HomeIcon />
                                    <span>For You</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Link to=''>
                                    <PeopleAltOutlinedIcon />
                                    <span>Following</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Link to=''>
                                    <ExploreOutlinedIcon />
                                    <span>Explore</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Link to=''>
                                    <HourglassEmptyOutlinedIcon />
                                    <span>Your Queue</span>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </nav>
                <div className='userNavContainer'>
                    <h2>Following accounts</h2>
                    <ul className='acountList'>

                    </ul>
                </div>
                <div className='placeholderNavContainer'></div>
                <div className='footerNavContainer'>
                    <span className='copyright'>
                    © Ploob
                    </span>
                </div>
            </div>
        </div>
        </div>
        </div>
    )
}

export default Navbar