import './_Notification.css'

import NotificationItem from './NotificationItem';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface NotificationProps {
    isOpen: boolean
}

const Notification = ({isOpen} :NotificationProps) => {
    return (
        <div className={`notificationModalWrapper ${isOpen}`}>
            <ArrowDropUpIcon sx={{
                position: 'absolute',
                top: '-15px',
                right: '67px',
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
                        <NotificationItem />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Notification