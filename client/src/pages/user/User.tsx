import './_User.css'

import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useGetUserQuery, useFollowMutation, useUnfollowMutation } from '../../features/user/userApiSlice';
import { useGetSpraysForUserQuery } from '../../features/spray/sprayApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { toggleAuth } from '../../features/modal/modalSlice';

import Layout from '../../components/layout/Layout'
import EditProfile from '../../components/modal/user/EditProfile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserItemContainer from '../../components/spray/UserItemContainer';
import { Follow, Spray, User } from '../../utils/types';

const UserPage = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const userId = useSelector(selectUser)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollow, setIsFollow] = useState<Follow | null>()
    const [followers, setFollowers] = useState<number>()
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)

    const closeEditModal = () => setIsEdit(false)
    const openEditModal = () => setIsEdit(true)

    const {
        data: user,
        isSuccess: userIsSuccess,
    } = useGetUserQuery({userId: id as string, currentUserId: userId}, {skip: isLoggedIn && !userId})

    const {
        data: sprays,
        isSuccess: sprayIsSuccess
    } = useGetSpraysForUserQuery({id: id as string, page: 1, count: 10})

    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()

    const handleFollowButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth())
        } else {
            if (!isFollow) {
                const response = await follow({userId, followeeId: id as string}).unwrap()
                setIsFollow(response)
                setFollowers(response.followee.followers)
            } else {
                const response = await unfollow({userId, followeeId: id as string}).unwrap()
                setIsFollow(null)
                setFollowers(response.followee.followers)
            }
        }
    }

    let button
    if (userId === id) {
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
                <div className={isFollow ? `followButtonWrapper false` : `followButtonWrapper true`}>
                    <button onClick={handleFollowButtonClick}>
                        {isFollow ? 'Following' : 'Follow'}
                    </button>
                </div>
                <div className={isFollow ? `messageButtonWrapper true` : `messageButtonWrapper false`}>
                    <Link to=''>
                        <button className=''>Messages</button>
                    </Link>
                    <div className='editIconContainer' onClick={handleFollowButtonClick}>
                        <HowToRegIcon />
                    </div>
                </div>
            </div>
    }

    useEffect(() => {
        if (user) {
            setIsFollow(user.isFollow)
            setFollowers(user.followers)
        }
    }, [user])

    let content

    if (userIsSuccess && user) {
        content = 
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
                            <strong className='number'>{followers}</strong>
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
                        <div className='feedMain'>
                            {sprayIsSuccess && sprays.map((spray: Spray, i: number) => <UserItemContainer key={i} spray={spray} />)}
                        </div>
                    </div>
                </div>
            </div>
    }

    if (userIsSuccess && !user) {
        content = <div className='content'>
            <div className='userErrorContainer'>
                <div className='userErrorWrapper'>
                    <PersonOutlineOutlinedIcon sx={{width: 180, height: 180, stroke: 'rgba(255,255,255)', strokeWidth: 1.2, color: 'rgba(22, 24, 35, 0.34)'}}/>
                    <p className='userErrorMessage'>Couldn't find this account</p>
                    <p className='userErrorDescription'>Looking for sprayss? Try browsing our trending creators, hashtags, and sounds.</p>
                </div>
            </div>
        </div>
    }

    return (
        <>
        <Layout>
            <div className='userPage'>
                {content}
            </div>
        </Layout>
        {isEdit && <EditProfile handleCloseButtonClick={closeEditModal} user={user as User}/>}
        </>
    )
}

export default UserPage