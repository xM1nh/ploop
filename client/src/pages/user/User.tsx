import './_User.css'

import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

import { useGetUserQuery, useFollowMutation, useUnfollowMutation } from '../../features/user/userApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectAuthentication } from '../../features/auth/authSlice';
import { toggleAuth } from '../../features/modal/modalSlice';

import Layout from '../../components/layout/Layout'
import EditProfile from '../../components/modal/user/EditProfile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const User = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const currentUser = useSelector(selectUser)
    const isAuthenticated = useSelector(selectAuthentication)
    const [isEdit, setIsEdit] = useState(false)

    const closeEditModal = () => setIsEdit(false)
    const openEditModal = () => setIsEdit(true)

    const {
        data: user,
        isSuccess: userIsSuccess,
    } = useGetUserQuery({userId: id as string})

    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()

    const handleFollow = () => {
        follow({
            followerId: currentUser,
            followeeId: parseInt(id as string)
        })
    }

    const handleUnfollow = () => {
        unfollow({followerId: currentUser, id})
    }

    let button
    if (currentUser === id) {
        button = 
            <div className='editButtonContainer'>
                <button className='editButton' onClick={openEditModal}>
                    <EditIcon sx={{width: '20px', height: '20px', color: 'rgb(22,24,35)', marginRight: '6px'}}/>
                    <span style={{whiteSpace: 'nowrap'}}>Edit profile</span>
                </button>
            </div>
    } else {
        button =
            <div className='followButtonContainer'>
                <div className='followButtonWrapper'>
                    <button
                        onClick={isAuthenticated ? handleFollow : () => dispatch(toggleAuth())}
                    >
                        Follow
                    </button>
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

    if (userIsSuccess) {
        return (
            <>
            <Layout>
                <div className='userPage'>
                    <div className='content'>
                        <div className='header'>

                            <div className='userInfo'>
                                <div className='avatarContainer'>
                                    <span className='avatar'>
                                        <img src={user.avatar_url}/>
                                    </span>
                                </div>
                                <div className='infoContainer'>
                                    <h1 className='username'>
                                        {user.username}
                                    </h1>
                                    <h2 className='nickname'>
                                        {user.nickname}
                                    </h2>
                                    {button}
                                </div>
                            </div>

                            <h3 className='numberInfo'>
                                <div className='numberContainer'>
                                    <strong className='number'>{user.followings}</strong>
                                    <span className='text'>Following</span>
                                </div>
                                <div className='numberContainer'>
                                    <strong className='number'>{user.followers}</strong>
                                    <span className='text'>Followers</span>
                                </div>
                            </h3>

                            <h2 className='description'>
                                {user.bio}
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
            {isEdit && <EditProfile handleCloseButtonClick={closeEditModal}/>}
            </>
        )
    }
}

export default User