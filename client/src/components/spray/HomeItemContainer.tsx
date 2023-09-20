import './_HomeItemContainer.css'

import { Link, useLocation } from 'react-router-dom'
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useLikeMutation, useUnlikeMutation } from '../../features/spray/likeApiSlice';
import { useFollowMutation, useUnfollowMutation } from '../../features/user/userApiSlice';
import { useSaveMutation, useUnsaveMutation } from '../../features/spray/saveApiSlice';
import { toggleAuth } from '../../features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { useInView } from 'react-cool-inview';

import Avatar from '../avatar/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TextsmsIcon from '@mui/icons-material/Textsms';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import { Follow, Like, Save, Spray } from '../../utils/types';

type HomeItemContainerProps = {
    userId: string | undefined,
    spray: Spray
}

const HomeItemContainer = forwardRef<HTMLDivElement | null, HomeItemContainerProps>(({
    userId,
    spray
}: HomeItemContainerProps, ref) => {
    const location = useLocation()
    const dispatch = useDispatch()
    const videoRef = useRef<HTMLVideoElement>()
    const [like] = useLikeMutation()
    const [unlike] = useUnlikeMutation()
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const [save] = useSaveMutation()
    const [unsave] = useUnsaveMutation()

    const [isLike, setIsLike] = useState<Like | null | undefined>(null)
    const [isFollow, setIsFollow] = useState<Follow | null | undefined>(null)
    const [isSave, setIsSave] = useState<Save | null | undefined>(null)
    const [likeCount, setLikeCount] = useState<number>()
    const [saveCount, setSaveCount] = useState<number>()
    const [shareCount, setShareCount] = useState<number>()

    const { observe: itemRef} = useInView<HTMLVideoElement>({
        threshold: 0.8,
        onEnter: () => {
            videoRef.current?.play()
        },
        onLeave: ({unobserve}) => {
            unobserve()
            videoRef.current?.pause()
        }
    })

    const handleFollowButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth)
        } else {
            if (!isFollow) {
                const response = await follow({userId, followeeId: spray.user.id.toString()}).unwrap()
                setIsFollow(response)
            } else {
                await unfollow({userId, followeeId: spray.user.id.toString()})
                setIsFollow(null)
            }
        }
    }

    const handleLikeButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth)
        } else {
            if (!isLike) {
                const response = await like({sprayId: spray.id.toString(), userId: userId.toString(), notifierId: spray.user.id.toString()}).unwrap()
                setIsLike(response)
                setLikeCount(response.spray.likes)
            }
            else {
                const response = await unlike({sprayId: spray.id.toString(), userId: userId.toString()}).unwrap()
                setIsLike(null)
                setLikeCount(response.spray.likes)
            }
        }
    }

    const handleSaveButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth)
        } else {
            if (!isSave) {
                const response = await save({sprayId: spray.id.toString(), userId: userId.toString()}).unwrap()
                setIsSave(response)
                setSaveCount(response.spray.saves)
            } else {
                const response = await unsave({sprayId: spray.id.toString(), userId: userId.toString()}).unwrap()
                setIsSave(null)
                setSaveCount(response.spray.saves)
            }
        }
    }

    let followButton = 
        <div className='followButton' onClick={handleFollowButtonClick}>
            <div className='followButtonContent'>
                <div className='followButtonLabel'>
                    Follow
                </div>
            </div>
        </div>
    if (isFollow) {
        followButton = 
            <div className='followButton' onClick={handleFollowButtonClick}>
                <div className='followButtonContent'>
                    <div className='followButtonLabel'>
                        Following
                    </div>
                </div>
            </div>
    }
    if (parseInt(userId as string) === spray.user.id) followButton = <></>

    useEffect(() => {
        setIsLike(spray.isLike)
        setIsSave(spray.isSave)
        setLikeCount(spray.likes)
        setSaveCount(spray.saves)
        setShareCount(spray.shares)
    }, [spray.isLike, spray.isSave, spray.likes, spray.saves, spray.shares])

    return (
        <div className='homeItemContainer' ref={ref}>
            <Avatar url={spray.user.avatar_url} />
            <div className='contentContainer'>
                <div className='textInfoContainer'>
                    <div className='creatorContainer'>
                        <Link className='creatorAnchor' to={`/${spray.user.username}`}>
                            <h3 className='creatorUsername'>
                                {spray.user.username}
                            </h3>
                            <h4 className='creatorNickname'>
                                {spray.user.nickname}
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
                <div className='sprayWrapper'>
                    <div className='sprayContainer'>
                        <div className='videoWrapper'>
                            <video preload='auto' loop controls poster={spray.cover_url} ref={((el: HTMLVideoElement) => {itemRef(el); videoRef.current= el})}>
                                <source src={spray.url} type='video/mp4'/>
                            </video>
                        </div>
                    </div>
                    <div className='sprayActionContainer'>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper' onClick={handleLikeButtonClick}>
                                {isLike ? <FavoriteIcon sx={{color: 'red'}}/> : <FavoriteIcon />}
                            </span>
                            <strong className='actionText'>{likeCount}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <EditIcon />
                            </span>
                            <strong className='actionText'>{spray.shares}</strong>
                        </button>
                        <Link to={`/spray/${spray.id}`} state={{previousLocation: location, spray}}>
                            <button className='sprayActionButton'>
                                <span className='actionIconWrapper'>
                                    <TextsmsIcon />
                                </span>
                                <strong className='actionText'>{spray.comments}</strong>
                            </button>
                        </Link>
                        <button className='sprayActionButton' onClick={handleSaveButtonClick}>
                            <span className='actionIconWrapper'>
                                {isSave ? <BookmarkIcon sx={{color: 'red'}}/> : <BookmarkIcon />}
                            </span>
                            <strong className='actionText'>{saveCount}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <ReplyIcon   />
                            </span>
                            <strong className='actionText'>{shareCount}</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default HomeItemContainer