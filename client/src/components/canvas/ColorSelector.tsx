import './_ColorSelector.css'

import { MouseEventHandler } from "react"
import {v4 as uuidv4} from 'uuid'

type ColorSelectorProps = {
    handleClick: MouseEventHandler,
    currentColor: string
}

const ColorSelector = ({ handleClick, currentColor } :ColorSelectorProps) => {
    const colors = [
        'black #000000', //black
        'white #ffffff', //white
        'pine #017420', //pine
        'green #11b03c', //green
        'gold #b0701c', //gold
        'yellow #ffc126', //yellow
        'darkgray #666666', //dark gray
        'silver #aaaaaa', //silver
        'burgundy #990000', //burgundy
        'red #ff0013', //red
        'plum #99004e', //plum
        'pink #ff008f', //pink
        'blue #0050cd', //blue
        'cyan #26c9ff', //cyan
        'brown #964112', //brown
        'orange #ff7829', //orange
        'coral #cb5a57', //coral
        'beige #feafa8', //beige
    ]

    const content = colors.map(color => {
        const colorName = color.split(' ')[0]
        const colorCode = color.split(' ')[1]
        return (
            <div
                className="color"
                key={uuidv4()}
                data-color={colorCode}
                style={{
                    backgroundColor: colorCode, 
                    gridArea: colorName
                }}
                onClick = {handleClick}
            />
        )
    })

    return (
        <div className="colorSelector">
            {content}
            <div className='current' style={{backgroundColor: currentColor}}/>
        </div>
    )
}

export default ColorSelector