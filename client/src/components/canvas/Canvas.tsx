import './_Canvas.css'

import { useState, MouseEventHandler, useRef, useEffect, forwardRef, useImperativeHandle} from 'react'

import { useOnDraw } from '../../hooks/useOnDraw'
import { CanvasRef } from '../../pages/spray/CreateSpray'

import { tools } from './tools'
import ToolSelector from './ToolSelector'
import ColorSelector from './ColorSelector'
import LineWidthSelector from './LineWidthSelector'

interface CanvasProps {
    width: string | number | undefined,
    height: string | number | undefined,
    drawable: boolean,
    initState?: string
}

export type Point = {
    x: number,
    y: number
} | null

const Canvas = forwardRef<CanvasRef, CanvasProps>(({
    width, 
    height,
    drawable,
    initState
}: CanvasProps, ref) => {
    const [tool, setTool] = useState('free')
    const [isToolOpen, setIsToolOpen] = useState(false)
    const [color, setColor] = useState('#000000')
    const [isColorOpen, setIsColorOpen] = useState(false)
    const [lineWidth, setLineWidth] = useState(5)
    const [isLineWidthOpen, setIsLineWidthOpen] = useState(false)

    const toolSelectorRef = useRef<HTMLDivElement>(null)
    const colorSelectorRef = useRef<HTMLDivElement>(null)
    const lineWidthSelectorRef = useRef<HTMLDivElement>(null)

    const { 
        setCanvasRef, 
        setPermanentCanvasRef, 
        undo, 
        redo,
        getHistory,
        setHistory
    } = useOnDraw(tool, color, lineWidth, initState)

    const handleSelectTool: MouseEventHandler = (e) => {
        const tool = e.currentTarget.getAttribute('data-tool') as string
        if (tool === 'undo') undo()
        else if (tool === 'redo') redo()
        else setTool(tool)
    }

    const handleSelectColor: MouseEventHandler = (e) => {
        const color = e.currentTarget.getAttribute('data-color') as string
        setColor(color)
    }

    const handleSelectLineWidth: MouseEventHandler = (e) => {
        const lineWidth = parseInt(e.currentTarget.getAttribute('data-linewidth') as string)
        setLineWidth(lineWidth)
    }

    const toggleOpenSelector: MouseEventHandler = (e) => {
        const type = e.currentTarget.getAttribute('data-type')
        switch (type) {
            case 'tool' : {
                setIsToolOpen(prev => !prev)
                setIsLineWidthOpen(false)
                setIsColorOpen(false)
                break
            }
            case 'color': {
                setIsToolOpen(false)
                setIsLineWidthOpen(false)
                setIsColorOpen(prev => !prev)
                break
            }
            case 'lineWidth': {
                setIsToolOpen(false)
                setIsLineWidthOpen(prev => !prev)
                setIsColorOpen(false)
                break
            }
            default: //do nothing
        }
    }

    const selectedTool = tools.filter(e => e.name === tool)[0].icon

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (toolSelectorRef.current &&
                isToolOpen &&
                !toolSelectorRef.current.contains(e.target as Node) &&
                (e.target as HTMLElement).className !== 'canvas') {
                    setIsToolOpen(false)
                    setIsColorOpen(false)
                    setIsLineWidthOpen(false)
                }
            if (colorSelectorRef.current &&
                isColorOpen &&
                !colorSelectorRef.current.contains(e.target as Node) &&
                (e.target as HTMLElement).className !== 'canvas') {
                    setIsToolOpen(false)
                    setIsColorOpen(false)
                    setIsLineWidthOpen(false)
                }
            if (lineWidthSelectorRef.current &&
                isLineWidthOpen &&
                !lineWidthSelectorRef.current.contains(e.target as Node) &&
                (e.target as HTMLElement).className !== 'canvas') {
                    setIsToolOpen(false)
                    setIsColorOpen(false)
                    setIsLineWidthOpen(false)
                }
        }
        document.addEventListener('mousedown', listener)

        return () => document.removeEventListener('mousedown', listener)
    }, [isColorOpen, isToolOpen, isLineWidthOpen])

    useImperativeHandle(ref, () => ({
        getHistory,
        setHistory
    }))

    return (
        <div className='canvasContainer'>
            <div className='canvasWrapper'>
                {drawable &&
                <canvas
                    className='canvas'
                    id='tempCanvas'
                    width={width}
                    height={height}
                    ref={setCanvasRef}
                />
                }
                <canvas 
                    className='canvas'
                    id='permCanvas'
                    width={width}
                    height={height}
                    ref={setPermanentCanvasRef}
                />
            </div>
            {drawable &&
            <div className='featuresContainer'>
                <div className='toolWrapper' ref={toolSelectorRef}>
                    <div className='toolSelectorTrigger' data-type='tool' onClick={toggleOpenSelector}>
                        <div className='toolContainer active'>
                            {selectedTool}
                        </div>
                    </div>
                    <div className={isToolOpen ? 'toolSelectorWrapper active' : 'toolSelectorWrapper inactive'}>
                        <ToolSelector
                            activeTool={tool}
                            handleClick={handleSelectTool} 
                        />
                    </div>
                </div>

                <div className='colorWrapper' ref={colorSelectorRef}>
                    <div className='colorSelectorTrigger' data-type='color' onClick={toggleOpenSelector}>
                        <div className='colorContainer active' style={{backgroundColor: color}} />
                    </div>
                    <div className={isColorOpen ? 'colorSelectorWrapper active' : 'colorSelectorWrapper inactive'}>
                        <ColorSelector 
                            handleClick={handleSelectColor}   
                        />
                    </div>
                </div>

                <div className='lineWidthWrapper' ref={lineWidthSelectorRef}>
                    <div className='lineWidthSelectorTrigger' data-type='lineWidth' onClick={toggleOpenSelector}>
                        <div className='thickWrapper active'>
                            <div
                                className='thick active'
                                style={{
                                    height: lineWidth*2,
                                    width: lineWidth*2,
                                }}
                            />
                        </div>
                    </div>
                    <div className={isLineWidthOpen ? 'lineWidthSelectorWrapper active' : 'lineWidthSelectorWrapper inactive'}>
                        <LineWidthSelector 
                            handleClick={handleSelectLineWidth}
                            activeLineWidth={lineWidth}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    )
})

export default Canvas