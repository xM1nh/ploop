import './_HomeItemContainer.css'

import { Link, useLocation } from 'react-router-dom'
import { forwardRef, useEffect, useState } from 'react';
import { useLikeMutation, useUnlikeMutation, useLazyGetLikeQuery } from '../../features/spray/likeApiSlice';
import { useGetUserQuery, useFollowMutation, useUnfollowMutation } from '../../features/user/userApiSlice';

import Avatar from '../avatar/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TextsmsIcon from '@mui/icons-material/Textsms';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';

type HomeItemContainerProps = {
    userId: number,
    spray: {
        id: number,
        url: string,
        cover_url: string,
        created_on: string,
        creator_id: number,
        caption: string,
        likes: number,
        edits: number,
        comments: number,
        saves: number,
        shares: number
    }
}

const HomeItemContainer = forwardRef<HTMLDivElement | null, HomeItemContainerProps>(({
    userId,
    spray
}: HomeItemContainerProps, ref) => {
    const location = useLocation()
    const [isLiked, setIsLiked] = useState(false)
    const [getLike] = useLazyGetLikeQuery()
    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userIsSuccess
    } = useGetUserQuery(spray.creator_id)
    const [like] = useLikeMutation()
    const [unlike] = useUnlikeMutation()
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()

    const handleFollowButtonClick = () => {
        //
    }

    const handleLikeButtonClick = async () => {
        if (!isLiked) {
            const response = await like({id: spray.id, actorId: userId, notifierId: user.id}).unwrap()
            console.log(response)
            setIsLiked(response)
        }
        else {
            const response = await unlike({id: spray.id, actorId: userId}).unwrap()
            setIsLiked(response)
        }
    }

    let followButton = 
        <div className='followButton'>
            <div className='followButtonContent'>
                <div className='followButtonLabel'>
                    Follow
                </div>
            </div>
        </div>
    if (userId) {
        followButton = 
            <div className='followButton'>
                <div className='followButtonContent'>
                    <div className='followButtonLabel'>
                        Following
                    </div>
                </div>
            </div>
    }

    if (userId && userId === spray.creator_id) followButton = <></>

    let userContent
    if (userIsLoading) userContent = <>...</>
    if (userIsSuccess) {
        userContent = 
            <div className='textInfoContainer'>
                <div className='creatorContainer'>
                    <Link className='creatorAnchor' to={`/${user.username}`}>
                        <h3 className='creatorUsername'>
                            {user.username}
                        </h3>
                        <h4 className='creatorNickname'>
                            {user.nickname}
                        </h4>
                    </Link>
                </div>
                {followButton}
                <div className='captionWrapper'>
                    <div className='captionContainer'>
                        <div className='captionText'>
                            <span className='caption'>
                                {spray.caption}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='contributorWrapper'>
                        <h4>
                            {`${new Date(spray.created_on).toLocaleString()}`}
                        </h4>
                    </div>
            </div>
    }

    let likeButton = 
        <button className='sprayActionButton'>
            <span className='actionIconWrapper' onClick={handleLikeButtonClick}>
                <FavoriteIcon />
            </span>
            <strong className='actionText'>{spray.likes}</strong>
        </button>
    if (userId && isLiked) {
        likeButton = <button className='sprayActionButton'>
            <span className='actionIconWrapper' onClick={handleLikeButtonClick}>
                <FavoriteIcon sx={{
                    color: 'red'
                }}/>
            </span>
            <strong className='actionText'>{spray.likes}</strong>
        </button>
    }

    useEffect(() => {
        if (userId) {
            getLike({sprayId: spray.id, userId}).then(result => setIsLiked(result.data))
        }
    }, [userId, getLike, spray.id])

    return (
        <div className='homeItemContainer' ref={ref}>
            <Avatar url={user?.avatar_url} />
            <div className='contentContainer'>
                {userContent}
                <div className='sprayWrapper'>
                    <div className='sprayContainer'>
                        <div className='videoWrapper'>
                            <video preload='auto' loop controls poster={spray.cover_url}>
                                <source src={spray.url} type='video/mp4'/>
                            </video>
                        </div>
                    </div>
                    <div className='sprayActionContainer'>
                        {likeButton}
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <EditIcon />
                            </span>
                            <strong className='actionText'>{spray.shares}</strong>
                        </button>
                        <Link to={`/spray/${spray.id}`} state={{previousLocation: location}}>
                            <button className='sprayActionButton'>
                                <span className='actionIconWrapper'>
                                    <TextsmsIcon />
                                </span>
                                <strong className='actionText'>{spray.comments}</strong>
                            </button>
                        </Link>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <BookmarkIcon />
                            </span>
                            <strong className='actionText'>{spray.saves}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <ReplyIcon   />
                            </span>
                            <strong className='actionText'>{spray.shares}</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default HomeItemContainer