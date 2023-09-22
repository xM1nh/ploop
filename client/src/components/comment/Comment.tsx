import './_Comment.css'
import Avatar from '../avatar/Avatar'
import { Link } from 'react-router-dom'
import { Comment as CommentType } from '../../utils/types'
import { forwardRef } from 'react'

type CommentProps = {
    comment: CommentType
}

const Comment = forwardRef<HTMLDivElement | null, CommentProps>(({comment}: CommentProps, ref) => {
    return (
        <div className='commentContainer' ref={ref}>
            <div className='commentContentContainer'>
                <Avatar url={comment.user.avatar_url}/>
                <div className='commentMainContentContainer'>
                    <Link className='commentName' to={`/${comment.user.id}`}>
                        <span>{comment.user.nickname}</span>
                    </Link>
                    <p className='commentText'>
                        {comment.description}
                    </p>
                    <p className='commentSubContent'>
                        <span className='commentCreatedOn'>
                            {comment.created_on.toLocaleString()}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
})

export default Comment