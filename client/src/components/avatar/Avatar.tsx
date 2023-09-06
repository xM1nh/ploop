import './_Avatar.css'

import { Link } from "react-router-dom"

interface AvatarProps {
    url: string
}

const Avatar = ({
    url
}: AvatarProps) => {
    return (
        <Link className='avartarAnchor' to=''>
            <div className='avartarContainer'>
                <span className='avartarWrapper'>
                    <img className='avartar' loading='lazy' src={url} />
                </span>
            </div>
        </Link>
    )
}

export default Avatar