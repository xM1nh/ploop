import Avatar from '../avatar/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TextsmsIcon from '@mui/icons-material/Textsms';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';

const HomeItemContainerSkeleton = () => {
    return (
        <div className='homeItemContainer'>
            <Avatar url='' />
            <div className='contentContainer'>
                <div className='textInfoContainer'>
                    <div className='creatorContainer'>
                        <div className='creatorAnchor'>
                            <h3 className='creatorUsername'>
                                
                            </h3>
                            <h4 className='creatorNickname'>
                                
                            </h4>
                        </div>
                    </div>
                    <div className='followButton'>
                        <div className='followButtonContent'>
                            <div className='followButtonLabel'>
                                
                            </div>
                        </div>
                    </div>
                    <div className='captionWrapper'>
                        <div className='captionContainer'>
                            <div className='captionText'>
                                <span className='caption'>
                                    
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='contributorWrapper'>
                        <h4>
                            
                        </h4>
                    </div>
                </div>
                <div className='sprayWrapper'>
                    <div className='sprayContainer'>
                        <div className='videoWrapper'>
                            <div style={{backgroundColor: 'lightgray', height: '100%', width: '100%'}} />
                        </div>
                    </div>
                    <div className='sprayActionContainer'>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <FavoriteIcon />
                            </span>
                            <strong className='actionText'></strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <EditIcon />
                            </span>
                            <strong className='actionText'></strong>
                        </button>
                        <div>
                            <button className='sprayActionButton'>
                                <span className='actionIconWrapper'>
                                    <TextsmsIcon />
                                </span>
                                <strong className='actionText'></strong>
                            </button>
                        </div>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <BookmarkIcon />
                            </span>
                            <strong className='actionText'></strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <ReplyIcon   />
                            </span>
                            <strong className='actionText'></strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeItemContainerSkeleton