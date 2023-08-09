import './_NotificationItem.css'

import { Link } from 'react-router-dom'

const NotificationItem = () => {
    return (
        <li>
            <div className='notiItemContainer'>
                <Link to=''>
                    <span className='notiAvatarContainer'>
                        <img src=''/>
                    </span>
                </Link>
                <div className='notiContentContainer'>
                    <Link to='' className='notiUsername'>
                        Minh
                    </Link>
                    <p className='notiDesc'>
                        <span>
                            stuff happened. &nbsp;
                        </span>
                        10m ago
                    </p>
                </div>
            </div>
        </li>
    )
}

export default NotificationItem