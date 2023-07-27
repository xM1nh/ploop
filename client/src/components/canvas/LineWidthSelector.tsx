import './_LineWidthSelector.css'

import { MouseEventHandler } from 'react'
import {v4 as uuidv4} from 'uuid'

type LineWidthSelectorProps = {
    handleClick: MouseEventHandler,
}

const LineWidthSelector = ({handleClick} :LineWidthSelectorProps) => {
    const thickness = [
        1,
        5,
        10,
        15,
        20
    ]

    const content = thickness.map(thick => {
        return (
            <div 
                className='thickWrapper' 
                key={uuidv4()}
                onClick={handleClick}
                data-linewidth={thick}>
                <div
                    className='thick'
                    style={{
                        height: thick*2,
                        width: thick*2,
                        borderRadius: '50%',
                        backgroundColor: 'gray'
                    }}
                />
            </div>
        )
    })

    return (
        <div className='lineWidthSelector'>
            {content}
        </div>
    )
}

export default LineWidthSelector