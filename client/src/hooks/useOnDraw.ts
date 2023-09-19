import { useRef, useEffect, } from "react"
import * as features from '../components/canvas/features'

export type Point = {
    x: number,
    y: number
} | null

export const useOnDraw = (tool: string, color: string, lineWidth: number, initState?: Blob) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const permanentCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef<boolean | null>(false)
    
    const prevPointRef = useRef<Point | null>(null)
    const startPointRef = useRef<Point | null>(null)
    const endPointRef = useRef<Point | null>(null)

    //Store history as an array to capture user trace
    //when drawing using the free draw tool
    const historyStack = useRef<string[][]>([])
    const historyStep = useRef<number>(-1)
    const freeDrawHistory = useRef<string[]>([])

    const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
    const mouseUpListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
    const mouseDownListenerRef = useRef<((e: MouseEvent) => void) | null>(null)

    const setCanvasRef = (ref: HTMLCanvasElement | null) => {
        canvasRef.current = ref
    }

    const setPermanentCanvasRef = (ref: HTMLCanvasElement | null) => {
        permanentCanvasRef.current = ref
    }

    const init = () => {
        if (permanentCanvasRef.current) {
            const ctx = permanentCanvasRef.current.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                if (initState) {
                    const image = new Image()
                    const blobUrl = URL.createObjectURL(initState)
                    image.src = blobUrl
                    image.onload = () => {
                        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height)
                        URL.revokeObjectURL(blobUrl)
                    }
                }
            }
        }
    }

    const getHistory = () => {
        return historyStack.current
    }

    const setHistory = (newHistory: string[][]) => {
        if (!newHistory.length) return
        historyStack.current = newHistory
        historyStep.current = newHistory.length - 1
        if (permanentCanvasRef.current) {
            const ctx = permanentCanvasRef.current.getContext('2d')
            if (ctx) {
                const index = historyStack.current[historyStep.current].length - 1
                const imageData = new Image()
                imageData.src = historyStack.current[historyStep.current][index]
                imageData.onload = () => {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.drawImage(imageData, 0, 0)
                }
            }
        }
    }

    const save = () => {
        if (permanentCanvasRef.current) {
            historyStep.current++
            if (historyStep.current < historyStack.current.length) {
                historyStack.current = historyStack.current.slice(0, historyStep.current)
            }
            historyStack.current = [...historyStack.current, [permanentCanvasRef.current.toDataURL()]]
        }
    }

    const undo = () => {
        if (permanentCanvasRef.current) {
            const ctx = permanentCanvasRef.current.getContext('2d')
            if (ctx) {
                if (historyStep.current > 0) {
                    historyStep.current--
                    const imageData = new Image()
                    const index = historyStack.current[historyStep.current].length - 1
                    imageData.src = historyStack.current[historyStep.current][index]
                    imageData.onload = () => {
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                        ctx.drawImage(imageData, 0, 0)
                    }
                }
            }
        }
    }

    const redo = () => {
        if (permanentCanvasRef.current) {
            const ctx = permanentCanvasRef.current.getContext('2d')
            if (ctx) {
                if (historyStep.current < historyStack.current.length-1) {
                    historyStep.current++
                    const imageData = new Image()
                    const index = historyStack.current[historyStep.current].length - 1
                    imageData.src = historyStack.current[historyStep.current][index]
                    imageData.onload = () => {
                        ctx.drawImage(imageData, 0, 0)
                    }
                }
            }
        }
    }

    useEffect(() => {
        //Auto save on first render
        //In case the component renders multiple time,
        //Manually set the stack and step to default value
        historyStack.current = []
        historyStep.current = -1
        init()
        save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const computePointInCanvas = (clientX: number, clientY: number) => {
            if (canvasRef.current) {
                const boundingRect = canvasRef.current.getBoundingClientRect()
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                }
            } else {
                return null
            }

        }

        const initMouseDownListener = () => {
            if (!canvasRef.current) return
            const listener = (e: MouseEvent) => {
                isDrawingRef.current = true
                const currentPoint = computePointInCanvas(e.clientX, e.clientY)
                startPointRef.current = currentPoint
                //Has to initialized prevPointRef for starting point
                //otherwise, shape will not draw on temp Canvas
                prevPointRef.current = currentPoint
            }
            mouseDownListenerRef.current = listener
            canvasRef.current.addEventListener('mousedown', listener)
        }

        const initMouseMoveListener = () => {
            const mouseMoveListener = (e: MouseEvent) => {
                if (isDrawingRef.current && canvasRef.current && permanentCanvasRef.current) {
                    const currentPoint = computePointInCanvas(e.clientX, e.clientY)
                    const ctx = canvasRef.current.getContext('2d')
                    const permCtx = permanentCanvasRef.current.getContext('2d')

                    switch (tool) {
                        case 'free' : {
                            features.drawFree(prevPointRef.current, currentPoint, ctx, color, lineWidth)
                            features.drawFree(prevPointRef.current, currentPoint, permCtx, color, lineWidth)    
                            prevPointRef.current = currentPoint
                            freeDrawHistory.current.push(permanentCanvasRef.current.toDataURL())
                            break
                        }
                        case 'eraser' : {
                            features.erase(prevPointRef.current, currentPoint, ctx, 5)
                            features.erase(prevPointRef.current, currentPoint, permCtx, 5)
                            prevPointRef.current = currentPoint
                            freeDrawHistory.current.push(permanentCanvasRef.current.toDataURL())
                            break
                        }
                        //End Point has to be defined for mouseup event to work
                        //Can't change prevPointRef to keep initial click static
                        case 'rectangle' : {
                            features.drawRect(prevPointRef.current, currentPoint, ctx, color, lineWidth)
                            endPointRef.current = currentPoint
                            break
                        }
                        case 'filledRectangle' : {
                            features.drawRect(prevPointRef.current, currentPoint, ctx, color, lineWidth, color)
                            endPointRef.current = currentPoint
                            break
                        }
                        case 'oval' : {
                            features.drawOval(prevPointRef.current, currentPoint, ctx, color, lineWidth)
                            endPointRef.current = currentPoint
                            break
                        }
                        case 'filledOval' : {
                            features.drawOval(prevPointRef.current, currentPoint, ctx, color, lineWidth, color)
                            endPointRef.current = currentPoint
                            break
                        }
                        case 'line': {
                            features.drawLine(prevPointRef.current, currentPoint, ctx, color, lineWidth)
                            endPointRef.current = currentPoint
                            break
                        }
                        default: //do nothing
                    }
                }
            }  
            mouseMoveListenerRef.current = mouseMoveListener
            window.addEventListener("mousemove", mouseMoveListener)
        }

        const initMouseUpListener = () => {
            const listener = () => {
                if (canvasRef.current && permanentCanvasRef.current) {
                    const permCtx = permanentCanvasRef.current.getContext('2d')
                    const ctx = canvasRef.current.getContext('2d')
                    if (isDrawingRef.current) {
                        switch (tool) {
                            case 'rectangle':
                                features.drawRectPermanent(startPointRef.current, endPointRef.current, permCtx, color, lineWidth)
                                break
                            case 'filledRectangle':
                                features.drawRectPermanent(startPointRef.current, endPointRef.current, permCtx, color, lineWidth, color)
                                break    
                            case 'oval':
                                features.drawOvalPermanent(startPointRef.current, endPointRef.current, permCtx, color, lineWidth)
                                break
                            case 'filledOval':
                                features.drawOvalPermanent(startPointRef.current, endPointRef.current, permCtx, color, lineWidth, color)
                                break
                            case 'line':
                                features.drawLinePermanent(startPointRef.current, endPointRef.current, permCtx, color, lineWidth)
                                break
                            case 'bucket':
                                features.bucketTool(startPointRef.current, permCtx, color)
                                break
                            default: //do nothing
                        }
                        features.clearCanvas(ctx)
                        save()
                        if (tool === 'free' || tool === 'eraser') {
                            historyStack.current[historyStack.current.length - 1] = freeDrawHistory.current
                        }
                    }
                }
                freeDrawHistory.current = []
                startPointRef.current = null
                endPointRef.current = null
                isDrawingRef.current = false
                prevPointRef.current = null
            }
            mouseUpListenerRef.current = listener
            window.addEventListener("mouseup", listener)
        }

        const cleanup = () => {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current)
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current)
            }
            if (mouseDownListenerRef.current) {
                window.removeEventListener('mousedown', mouseDownListenerRef.current)
            }
        }

        initMouseDownListener()
        initMouseMoveListener()
        initMouseUpListener()
        return () => cleanup()

    }, [tool, color, lineWidth])

    return {
        setCanvasRef,
        setPermanentCanvasRef,
        undo,
        redo,
        getHistory,
        setHistory
    }
}