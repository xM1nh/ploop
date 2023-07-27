import './_ToolSelector.css'

import { MouseEventHandler } from "react"

type ToolSelectorProps = {
    handleClick: MouseEventHandler,
    undo: () => void,
    redo: () => void
}

const ToolSelector = (
    {
    handleClick, 
    undo, 
    redo
    } :ToolSelectorProps
) => {
    return (
        <div className="toolSelector">
            <button data-tool='free' onClick={handleClick}>Free</button>
            <button data-tool='eraser' onClick={handleClick}>Eraser</button>
            <button data-tool='rectangle' onClick={handleClick}>Rectangle</button>
            <button data-tool='filledRectangle' onClick={handleClick}>Filled Rectangle</button>
            <button data-tool='oval' onClick={handleClick}>Oval</button>
            <button data-tool='filledOval' onClick={handleClick}>Filled Oval</button>
            <button data-tool='bucket' onClick={handleClick}>Bucket</button>
            <button data-tool='line' onClick={handleClick}>Line</button>
            <button data-tool='undo' onClick={undo}>Undo</button>
            <button data-tool='redo' onClick={redo}>Redo</button>
        </div>
    )
}

export default ToolSelector