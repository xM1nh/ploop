import './_SprayModal.css'

import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import CloseIcon from '@mui/icons-material/Close';
import Avatar from '../../avatar/Avatar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';

const SprayModal = () => {
    const navigate = useNavigate()
    const modalRef = useRef<HTMLDivElement>(null)

    const handleCloseSpray = () => {
        navigate('/')
    }

    const content = <div className='emptyComment'>
        Be the first to comment!
    </div>

    useEffect(() => {
        const observerRefValue = modalRef.current
        disableBodyScroll(observerRefValue as HTMLDivElement)

        return () => {
            if (observerRefValue) {
                enableBodyScroll(observerRefValue)
            }
        }
    }, [])

    return (
        <div className="sprayModal" ref={modalRef}>
            <div className='modalVideoContainer'>
                <div className='blurBackground'></div>
                <div className='modalVideoWrapper'>
                    <div className='modalVideoInnerWrapper'>
                        <div className='playerWrapper'>
                            <div style={{width: '100%', height: '100%'}}>
                                <video></video>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='control close' onClick={handleCloseSpray}>
                    <CloseIcon />
                </button>
                <button className='control prev'></button> 
                <button className='control next'></button>
            </div>
            <div className='modalContentContainer'>
                <div className='modalDescContentWrapper'>
                    <div className='modalInfoContainer'>
                        <Avatar url=''/>
                        <div className='nameContainer'>
                            <span className='modalUsername'>xM1nh</span>
                            <br />
                            <span className='modalNickname'>
                                Minh Le
                                <span style={{margin: '0px 4px'}}>.</span>
                                <span>30-8</span>
                            </span>
                        </div>
                    </div>
                    <div className='modalDescContainer'>
                        <div className='descWrapper'>
                            <div className='descText'>
                                <div style={{fill: 'rgb(22, 24, 35)'}}>
                                    <div className='descRealText'>
                                        hello yes yes
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
                                <button className='modalNumber'>
                                    <span className='modalSpanIconWrapper'>
                                        <FavoriteIcon />
                                    </span>
                                    <strong>1999</strong>
                                </button>
                                <button className='modalNumber' style={{marginLeft: '20px'}}>
                                    <span className='modalSpanIconWrapper'>
                                        <BookmarkIcon />
                                    </span>
                                    <strong>1999</strong>
                                </button>
                                <button className='modalNumber' style={{marginLeft: '20px'}}>
                                    <span className='modalSpanIconWrapper'>
                                        <ReplyIcon />
                                    </span>
                                    <strong>1999</strong>
                                </button>
                            </div>
                        </div>
                        <div className='modalTabContainer'>
                            <div className='modalTabItem'>
                                Comment
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
                                        <textarea placeholder='Add a comment...'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='bottomInputButton'>Post</div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default SprayModal