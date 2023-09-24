import './_HomeItemContainer.css'

import { Link, useLocation } from 'react-router-dom'
import { forwardRef, useRef } from 'react';
import { useInView } from 'react-cool-inview';
import useSpray from '../../hooks/useSpray';
import { formatDate } from '../../utils';

import Avatar from '../avatar/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TextsmsIcon from '@mui/icons-material/Textsms';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import { Spray } from '../../utils/types';

type HomeItemContainerProps = {
    userId: string | undefined,
    spray: Spray
}

const HomeItemContainer = forwardRef<HTMLDivElement | null, HomeItemContainerProps>(({
    userId,
    spray
}: HomeItemContainerProps, ref) => {
    const location = useLocation()
    const videoRef = useRef<HTMLVideoElement>()

    const {
        isFollow,
        isLike,
        isSave,
        likeCount,
        saveCount,
        shareCount,
        handleFollowButtonClick,
        handleLikeButtonClick,
        handleSaveButtonClick
    } = useSpray(userId as string, spray as Spray)

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
                            {`${formatDate(spray.created_on)}`}
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
                        <Link to={`/create`} state={{initState: spray.cover_url, id: spray.id}}>
                            <button className='sprayActionButton'>
                                <span className='actionIconWrapper'>
                                    <EditIcon />
                                </span>
                                <strong className='actionText'>{spray.shares}</strong>
                            </button>
                        </Link>
                        <Link to={`/spray/${spray.id}`} state={{previousLocation: location}}>
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