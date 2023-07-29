import './_LineWidthSelector.css'

import { MouseEventHandler } from 'react'
import {v4 as uuidv4} from 'uuid'

type LineWidthSelectorProps = {
    handleClick: MouseEventHandler,
    activeLineWidth: number
}

const LineWidthSelector = ({handleClick, activeLineWidth} :LineWidthSelectorProps) => {
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
                className={activeLineWidth === thick ? 'thickWrapper active' : 'thickWrapper'}
                key={uuidv4()}
                onClick={handleClick}
                data-linewidth={thick}>
                <div
                    className={activeLineWidth === thick ? 'thick active' : 'thick'}
                    style={{
                        height: thick*2,
                        width: thick*2,
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