import './_Canvas.css'

import { useState, MouseEventHandler} from 'react'

import { useOnDraw } from '../../hooks/useOnDraw'

import ToolSelector from './ToolSelector'
import ColorSelector from './ColorSelector'
import LineWidthSelector from './LineWidthSelector'

interface CanvasProps {
    width: string | number | undefined,
    height: string | number | undefined,
}

export type Point = {
    x: number,
    y: number
} | null

const Canvas = ({
    width, 
    height,
}: CanvasProps) => {
    const [tool, setTool] = useState('free')
    const [color, setColor] = useState('#000000')
    const [lineWidth, setLineWidth] = useState(5)

    const { 
        setCanvasRef, 
        setPermanentCanvasRef, 
        undo, 
        redo,
    } = useOnDraw(tool, color, lineWidth)

    const handleSelectTool: MouseEventHandler = (e) => {
        const tool = e.currentTarget.getAttribute('data-tool') as string
        setTool(tool)
    }

    const handleSelectColor: MouseEventHandler = (e) => {
        const color = e.currentTarget.getAttribute('data-color') as string
        setColor(color)
    }

    const handleSelectLineWidth: MouseEventHandler = (e) => {
        const lineWidth = parseInt(e.currentTarget.getAttribute('data-linewidth') as string)
        setLineWidth(lineWidth)
    }

    return (
        <div className='canvasContainer'>
            <div className='canvasWrapper'>
                <canvas
                    className='canvas'
                    id='tempCanvas'
                    width={width}
                    height={height}
                    ref={setCanvasRef}
                />
                <canvas 
                    className='canvas'
                    id='permCanvas'
                    width={width}
                    height={height}
                    ref={setPermanentCanvasRef}
                />
            </div>
            <ToolSelector
                handleClick={handleSelectTool} 
                undo={undo} 
                redo={redo}
            />

            <ColorSelector 
                handleClick={handleSelectColor}
                currentColor={color}    
            />

            <LineWidthSelector 
                handleClick={handleSelectLineWidth}
            />
        </div>
    )
}

export default Canvas