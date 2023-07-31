import './_HomeItemContainer.css'

import { Link } from 'react-router-dom'

import FavoriteIcon from '@mui/icons-material/Favorite';
import TextsmsIcon from '@mui/icons-material/Textsms';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';

type HomeItemContainerProps = {
    avartarSrc: string,
    username: string,
    nickname: string,
    caption: string,
    contributor: string,
    spraySrc: string,
    likes: number,
    comments: number,
    saves: number,
    shares: number
}

const HomeItemContainer = ({
    avartarSrc,
    username,
    nickname,
    caption,
    contributor,
    spraySrc,
    likes,
    comments,
    saves,
    shares
}: HomeItemContainerProps) => {
    return (
        <div className='homeItemContainer'>
            <Link className='avartarAnchor' to=''>
                <div className='avartarContainer'>
                    <span className='avartarWrapper'>
                        <img className='avartar' loading='lazy' src={avartarSrc} />
                    </span>
                </div>
            </Link>
            <div className='contentContainer'>
                <div className='textInfoContainer'>
                    <div className='creatorContainer'>
                        <Link className='creatorAnchor' to=''>
                            <h3 className='creatorUsername'>
                                {username}
                            </h3>
                            <h4 className='creatorNickname'>
                                {nickname}
                            </h4>
                        </Link>
                    </div>
                    <div className='followButton'>
                        <div className='followButtonContent'>
                            <div className='followButtonLabel'>
                                Follow
                            </div>
                        </div>
                    </div>
                    <div className='captionWrapper'>
                        <div className='captionContainer'>
                            <div className='captionText'>
                                <span className='caption'>
                                    {caption}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='contributorWrapper'>
                        <h4>
                            <Link to='/'>{contributor}</Link>
                        </h4>
                    </div>
                </div>
                <div className='sprayWrapper'>
                    <div className='sprayContainer'>
                        <img src={spraySrc}></img>
                        <div className='sprayControl'></div>
                    </div>
                    <div className='sprayActionContainer'>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <FavoriteIcon />
                            </span>
                            <strong className='actionText'>{likes}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <EditIcon />
                            </span>
                            <strong className='actionText'>{shares}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <TextsmsIcon />
                            </span>
                            <strong className='actionText'>{comments}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <BookmarkIcon />
                            </span>
                            <strong className='actionText'>{saves}</strong>
                        </button>
                        <button className='sprayActionButton'>
                            <span className='actionIconWrapper'>
                                <ReplyIcon   />
                            </span>
                            <strong className='actionText'>{shares}</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeItemContainer