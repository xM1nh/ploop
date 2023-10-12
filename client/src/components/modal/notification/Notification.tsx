import './_Notification.css'

import { useGetNotificationsQuery, useMarkAllAsReadMutation, useGetUnreadNotificationsCountQuery } from '../../../features/notification/notificationApiSlice';
import { selectUser } from '../../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useInView } from 'react-cool-inview';
import { useState, useRef, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Notification as NotificationType } from '../../../utils/types';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { gql, useSubscription } from '@apollo/client';

const NOTIFICATION_SUBSCRIPTION = gql `
    subscription NotificationAdded($userId: ID!) {
        notificationAdded(userId: $userId) {
            id
            created_on
            status
            actor {
                avatar_url
                id
                nickname
                username
            }
            entity_type_id
            entity {
            ... on User {
                id
            }
            ... on Spray {
                id
            }
            }
        }
    }
`

const Notification = () => {
    const [page, setPage] = useState(1)
    const [isNotiOpen, setIsNotiOpen] = useState(false)
    const [unread, setUnread] = useState<number>(0)
    const [newNotification, setNewNotification] = useState<NotificationType[]>([])
    const notificationRef = useRef<HTMLDivElement>(null)
    const userId = useSelector(selectUser)

    const [markAllAsRead] = useMarkAllAsReadMutation()
    const {
        data: unreadCount,
        isSuccess: unreadCountSuccess
    } = useGetUnreadNotificationsCountQuery({userId})
    const {
        data: notifications,
        isSuccess,
        isFetching,
    } = useGetNotificationsQuery({userId, page, count: 10})

    const {data: subData} = useSubscription(NOTIFICATION_SUBSCRIPTION, {
        variables: {
            userId
        }
    })

    const handleNotificationClick = async () => {
        setIsNotiOpen(prev => !prev)
        if (!isNotiOpen) await markAllAsRead({userId})
        setUnread(0)
        setNewNotification([])
    }

    const { observe: endItemRef } = useInView({
        threshold: 0.8,
        onEnter: ({unobserve}) => {
            unobserve()
            if (!isFetching) {
                setPage(page => page + 1)
            }
        }
    })

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!notificationRef.current?.contains(e.target as Node)) {
                setIsNotiOpen(false)
            }
        }

        document.addEventListener('mousedown', handler)

        return () => {
            document.removeEventListener('mousedown', handler)
        }
    })

    useEffect(() => {
        if (unreadCountSuccess) setUnread(unreadCount)
    }, [unreadCount, unreadCountSuccess])

    useEffect(() => {
        if (subData) {
            setNewNotification(prev => [subData.notificationAdded, ...prev])
        }
    }, [subData])

    return (
        <div ref={notificationRef}>
            <div className='notificationContainer' onClick={handleNotificationClick}>
                {
                    isNotiOpen
                        ? <NotificationsIcon sx={{color: 'white', cursor: 'pointer'}} className='notificationIcon'/>
                        : <NotificationsNoneOutlinedIcon sx={{color: 'white', cursor: 'pointer'}} className='notificationIcon'/>
                }
                {unread || newNotification.length > 0 ? <sup>{unread + newNotification.length}</sup> : <></>}
            </div>
            {
                isNotiOpen &&
                <div className={`notificationModalWrapper ${isNotiOpen}`}>
                    <ArrowDropUpIcon sx={{
                        position: 'absolute',
                        top: '-14px',
                        right: '86px',
                        color: 'rgb(255,255,255)'
                    }}/>
                    <div className='notificationModalContainer'>
                        <div className='header'>
                            <h2 className='notificationHeaderTitle'>
                                Notifications
                            </h2>
                        </div>
                        <div className='notificationList'>
                            <ul>
                                {
                                    isSuccess &&
                                    notifications.map((notification: NotificationType, i: number) => <NotificationItem key={`noti${i}`} notification={notification} ref={i === notifications?.length - 1 ? endItemRef : null}/>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Notification