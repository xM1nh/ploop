import './_NotificationItem.css'

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Notification as NotificationType } from '../../../utils/types'
import { formatDate, generateNotificationMessage } from '../../../utils'

type NotificationProps = {
    notification: NotificationType
}

const NotificationItem = forwardRef<HTMLDivElement | null, NotificationProps>(({notification}: NotificationProps, ref) => {
    return (
        <li>
            <div className='notiItemContainer' ref={ref}>
                <Link to={`/${notification.actor.id}`}>
                    <span className='notiAvatarContainer'>
                        <img src={notification.actor.avatar_url}/>
                    </span>
                </Link>
                <div className='notiContentContainer'>
                    <Link to={`/${notification.actor.id}`} className='notiUsername'>
                        {notification.actor.username}
                    </Link>
                    <p className='notiDesc'>
                        <span>
                            {generateNotificationMessage(notification.entity_type_id)} &nbsp;
                        </span>
                        {formatDate(notification.created_on)}
                    </p>
                </div>
            </div>
        </li>
    )
})

export default NotificationItem