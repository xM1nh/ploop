import './_User.css'

import { Link } from 'react-router-dom';
import { useState } from 'react';

import Layout from '../../components/layout/Layout'
import EditProfile from '../../components/modal/user/EditProfile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const User = () => {
    const [isEdit, setIsEdit] = useState(false)

    const closeModal = () => setIsEdit(false)
    const openModal = () => setIsEdit(true)

    let button

    const x = 2

    if (x === 1) {
        button =
            <div className='followButtonContainer'>
                <div className='followButtonWrapper'>
                    <button>Follow</button>
                </div>
                <div className='messageButtonWrapper'>
                    <Link to=''>
                        <button className=''>Messages</button>
                    </Link>
                    <div className='editIconContainer'>
                        <HowToRegIcon />
                    </div>
                </div>
            </div>
    }

    if (x !== 1) {
        button = 
            <div className='editButtonContainer'>
                <button className='editButton' onClick={openModal}>
                    <EditIcon sx={{width: '20px', height: '20px', color: 'rgb(22,24,35)', marginRight: '6px'}}/>
                    <span style={{whiteSpace: 'nowrap'}}>Edit profile</span>
                </button>
            </div>
    }

    return (
        <>
        <Layout>
            <div className='userPage'>
                <div className='content'>
                    <div className='header'>

                        <div className='userInfo'>
                            <div className='avatarContainer'>
                                <span className='avatar'>
                                    <img src={''}/>
                                </span>
                            </div>
                            <div className='infoContainer'>
                                <h1 className='username'>
                                    {'xM1nh'}
                                </h1>
                                <h2 className='nickname'>
                                    {'Minh Le'}
                                </h2>
                                {button}
                            </div>
                        </div>

                        <h3 className='numberInfo'>
                            <div className='numberContainer'>
                                <strong className='number'>{0}</strong>
                                <span className='text'>Following</span>
                            </div>
                            <div className='numberContainer'>
                                <strong className='number'>{0}</strong>
                                <span className='text'>Followers</span>
                            </div>
                        </h3>

                        <h2 className='description'>
                            Hello Yes yes
                        </h2>

                        <div className='moreButton'>
                            <MoreHorizIcon />
                        </div>
                    </div>
                    <div className='main'>
                        <div className='feedTab'>
                            <p className='tab'>
                                <span>Sprays</span>
                            </p>
                            <p className='tab'>
                                <span>Liked</span>
                            </p>
                            <p className='tab'>
                                <span>Saved</span>
                            </p>
                            <div className='bottomLine'></div>
                        </div>
                        <div className='feedMainContainer'>
                            <div className='feedMain'></div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
        {isEdit && <EditProfile handleCloseButtonClick={closeModal}/>}
        </>
    )
}

export default User