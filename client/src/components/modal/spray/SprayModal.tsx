import './_SprayModal.css'
import { Comment, Spray } from '../../../utils/types';

import { useRef, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useGetSprayQuery } from '../../../features/spray/sprayApiSlice';
import { useGetCommentsQuery, useAddCommentMutation } from '../../../features/spray/commentApiSlice';
import { selectUser } from '../../../features/auth/authSlice';
import { toggleAuth } from '../../../features/modal/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-cool-inview';
import { gql, useSubscription } from '@apollo/client';
import useSpray from '../../../hooks/useSpray';
import { formatDate } from '../../../utils';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from '../../avatar/Avatar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import SprayModalSkeleton from './SprayModalSkeleton';
import CommentItem from '../../comment/Comment';

const COMMENT_ADDED_SUBSCRIPTION = gql `
    subscription CommentAdded($sprayId: ID!, $userId: ID!) {
        commentAdded(sprayId: $sprayId, userId: $userId) {
            id
            description
            created_on
            user {
                id
                avatar_url
                nickname
                username
            }
            spray {
                comments
            }
        }
}
`

const SprayModal = () => {
    const dispatch = useDispatch()
    const userId = useSelector(selectUser)
    const {id} = useParams()
    const navigate = useNavigate()
    const modalRef = useRef<HTMLDivElement>(null)
    const [page, setPage] = useState<number>(1)
    const [addComment] = useAddCommentMutation()
    const [newComments, setNewComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState<string>('')

    const {
        data: spray,
        isLoading: sprayIsLoading
    } = useGetSprayQuery({id: id as string, userId: userId ? userId : '0'})

    const {
        isFollow,
        isLike,
        isSave,
        likeCount,
        saveCount,
        shareCount,
        commentCount,
        setCommnetCount,
        handleFollowButtonClick,
        handleLikeButtonClick,
        handleSaveButtonClick
    } = useSpray(userId, spray as Spray)

    const {
        data,
        isLoading,
        isFetching,
        refetch
    } = useGetCommentsQuery({sprayId: id as string, page, count: 10})

    const { observe: endItemRef } = useInView({
        threshold: 0.8,
        onEnter: ({unobserve}) => {
            unobserve()
            if (!isFetching) {
                setPage(page => page + 1)
            }
        }
    })

    const { data: subData } = useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
        variables: {
            sprayId: id,
            userId: userId ? userId : '0'
        }
    })

    const handleCloseSpray = () => {
        navigate(-1)
    }

    const handleSubmit = async () => {
        if (!userId) {
            dispatch(toggleAuth())
        } else {
            const response = await addComment({sprayId: id as string, userId, notifierId: (spray?.user.id as number).toString(), comment: commentInput}).unwrap()
            setNewComments([])
            setCommentInput('')
            setCommnetCount(response.spray.comments)
            if (page === 1) refetch()
            else {
                setPage(1)
            }
        }
    }

    let followButton = 
        <div className='followButton' onClick={handleFollowButtonClick}>
            <div className='followButtonContent'>
                <div className='followButtonLabel'>
                    {isFollow ? 'Following' : 'Follow'}
                </div>
            </div>
        </div>
    if (userId === spray?.user.id.toString()) followButton = <></> 

    let content
    if (commentCount === 0 && newComments.length === 0) content = <div className='emptyComment'>
                                            Be the first to comment!
                                        </div>
    else if (isLoading) {
        content = <div className='emptyComment'>
                    Loading...
                </div>
    } else {
        content = <>
            {newComments.map((comment: Comment, i: number) => {
                return <CommentItem key={`subs${i}`} comment={comment}/>
            })}
            {data?.map((comment: Comment, i: number) => <CommentItem key={`query${i}`} comment={comment} ref={i === data?.length - 1 ? endItemRef : null}/>)}
        </>
    }

    useEffect(() => {
        const observerRefValue = modalRef.current
        if (observerRefValue) disableBodyScroll(observerRefValue)

        return () => {
            if (observerRefValue) {
                enableBodyScroll(observerRefValue)
            }
        }
    }, [])

    useEffect(() => {
        if (subData) {
            if (subData.commentAdded.user.id !== parseInt(userId)) {
                setNewComments(prev => [subData.commentAdded, ...prev])
            }
        }
        return () => setNewComments([])
    }, [subData, userId])

    if (sprayIsLoading) return <SprayModalSkeleton />
    return (
        <div className="sprayModal" ref={modalRef}>
            <div className='modalVideoContainer'>
                <div className='blurBackground'></div>
                <div className='modalVideoWrapper'>
                    <div className='modalVideoInnerWrapper'>
                        <div className='playerWrapper'>
                            <div style={{width: '100%', height: '100%'}}>
                                <video preload='auto' loop controls poster={spray?.cover_url} autoPlay>
                                    <source src={spray?.url} type='video/mp4'/>
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='control close' onClick={handleCloseSpray}>
                    <CloseIcon />
                </button>
            </div>
            <div className='modalContentContainer'>
                <div className='modalDescContentWrapper'>
                    <div className='modalInfoContainer'>
                        <Avatar url={spray?.user.avatar_url as string}/>
                        <Link to={`/${spray?.user.id}`} className='nameContainer'>
                            <span className='modalUsername'>{spray?.user.username}</span>
                            <br />
                            <span className='modalNickname'>
                                {spray?.user.nickname}
                                <span style={{margin: '0px 4px'}}>.</span>
                                <span>{formatDate(spray?.created_on as Date)}</span>
                            </span>
                        </Link>
                        {followButton}
                    </div>
                    <div className='modalDescContainer'>
                        <div className='descWrapper'>
                            <div className='descText'>
                                <div style={{fill: 'rgb(22, 24, 35)'}}>
                                    <div className='descRealText'>
                                        {spray?.caption}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modalMainContainer'>
                    <div style={{position: 'relative', padding: '16px 0px 0px'}}>
                        <div className='modalNumber'>
                            <div className='modalNumberWrapper'>
                                <button className='modalNumber' onClick={handleLikeButtonClick}>
                                    <span className='modalSpanIconWrapper'>
                                        {isLike ? <FavoriteIcon sx={{color: 'red'}}/> : <FavoriteIcon />}
                                    </span>
                                    <strong>{likeCount}</strong>
                                </button>
                                <button className='modalNumber' style={{marginLeft: '20px'}} onClick={handleSaveButtonClick}>
                                    <span className='modalSpanIconWrapper'>
                                        {isSave ? <BookmarkIcon sx={{color: 'red'}}/> : <BookmarkIcon />}
                                    </span>
                                    <strong>{saveCount}</strong>
                                </button>
                                <button className='modalNumber' style={{marginLeft: '20px'}}>
                                    <span className='modalSpanIconWrapper'>
                                        <ReplyIcon />
                                    </span>
                                    <strong>{shareCount}</strong>
                                </button>
                            </div>
                        </div>
                        <div className='modalTabContainer'>
                            <div className='modalTabItem'>
                                {`Comment (${commentCount})`}
                            </div>
                        </div>
                        <div className='tabBorder'></div>
                    </div>
                </div>
                <div className='modalCommentContainer'>
                        <div className='modalCommentListContainer'>
                            {content}
                        </div>
                    </div>
                    <div className='modalBottomCommentContainer'>
                        <div className='modalBottomInnerContainer'>
                            <div style={{flex: '1 1 auto'}}>
                                <div className='bottomInputAreaContainer'>
                                    <div className='textAreaWrapper'>
                                        <textarea placeholder='Add a comment...' value={commentInput} onChange={(e) => setCommentInput(e.target.value)}></textarea>
                                    </div>
                                </div>
                            </div>
                            <button className='bottomInputButton' onClick={handleSubmit} disabled={!commentInput}>Post</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default SprayModal