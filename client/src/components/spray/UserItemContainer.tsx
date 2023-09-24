import { Spray } from '../../utils/types'
import './_UserItemContainer.css'

import { Link, useLocation } from 'react-router-dom'

interface UserItemContainerProps {
    spray: Spray
}

const UserItemContainer = ({spray}: UserItemContainerProps) => {
    const location = useLocation()

    return (
        <div className='userItemContainer'>
            <div className='userSprayContainer'>
                <div style={{paddingTop: '132.653%'}}>
                    <div className='userSprayWrapper'>
                    <Link to={`/spray/${spray.id}`} state={{previousLocation: location}}>
                        <img src={spray.cover_url}></img>
                    </Link>
                    </div>
                </div>
            </div>
            <div className='userSprayDesc'>
                <Link to={`/spray/${spray.id}`} state={{previousLocation: location}}>
                    <div className='userSprayDescTextContainer'>
                        <span>{spray.caption}</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default UserItemContainer