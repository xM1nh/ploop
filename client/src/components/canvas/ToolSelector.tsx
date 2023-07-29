import './_ToolSelector.css'

import { MouseEventHandler} from "react"
import {v4 as uuidv4} from 'uuid'

import { tools } from './tools'

type ToolSelectorProps = {
    handleClick: MouseEventHandler,
    activeTool: string
}

const ToolSelector = (
    {
    handleClick,
    activeTool,
    } :ToolSelectorProps
) => {

    const content = tools.map(tool => {
        return (
            <div key={uuidv4()} className={activeTool === tool.name ? 'toolContainer active' : 'toolContainer'} data-tool={tool.name} onClick={handleClick}>
                {tool.icon}
            </div>
        )
    })

    return (
        <div className="toolSelector">
            {content}
        </div>
    )
}

export default ToolSelector