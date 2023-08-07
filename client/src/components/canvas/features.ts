import { Point } from "./Canvas"

export const clearCanvas = (
    ctx: CanvasRenderingContext2D | null,
) => {
    if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
}

export const erase = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    width: number
) => {
    start = start ?? end
    if (ctx && start && end) {
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = '#FFFFFF'
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI)
        ctx.fill()
    }
}

export const drawFree = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    color: string,
    width: number
) => {
    start = start ?? end
    if (ctx && start && end) {
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(start.x, start.y, width/2, 0, 2 * Math.PI)
        ctx.fill()
    }
}

export const drawRect = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
    fillColor?: string
) => {
    if (ctx && start && end) {
        const rectWidth = end.x - start.x
        const rectHeight = end.y - start.y
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        if (fillColor) {
            ctx.fillStyle = fillColor
            ctx.fillRect(start.x, start.y, rectWidth, rectHeight)
        } else {
            ctx.strokeRect(start.x, start.y, rectWidth, rectHeight)
        }
    }
}

export const drawRectPermanent = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
    fillColor?: string
) => {
    if (ctx && start && end) {
        const rectWidth = end.x - start.x
        const rectHeight = end.y - start.y
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        if (fillColor) {
            ctx.fillStyle = fillColor
            ctx.fillRect(start.x, start.y, rectWidth, rectHeight)
        } else {
            ctx.strokeRect(start.x, start.y, rectWidth, rectHeight)
        }
    }
}

export const drawOval = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
    fillColor?: string
) => {
    if (ctx && start && end) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(start.x, start.y + (end.y - start.y) / 2)
        ctx.bezierCurveTo(start.x, start.y, end.x, start.y, end.x, start.y + (end.y - start.y) / 2)
        ctx.bezierCurveTo(end.x, end.y, start.x, end.y, start.x, start.y + (end.y - start.y) / 2)
        ctx.closePath()
        if (fillColor) {
            ctx.fillStyle = fillColor
            ctx.fill()
        }
        ctx.stroke()
    }
}

export const drawOvalPermanent = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
    fillColor?: string
) => {
    if (ctx && start && end) {
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(start.x, start.y + (end.y - start.y) / 2)
        ctx.bezierCurveTo(start.x, start.y, end.x, start.y, end.x, start.y + (end.y - start.y) / 2)
        ctx.bezierCurveTo(end.x, end.y, start.x, end.y, start.x, start.y + (end.y - start.y) / 2)
        ctx.closePath()
        ctx.stroke()
        if (fillColor) {
            ctx.fillStyle = fillColor
            ctx.fill()
        }
    }
}

export const drawLine = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
) => {
    if (ctx && start && end) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }
}

export const drawLinePermanent = (
    start: Point,
    end: Point,
    ctx: CanvasRenderingContext2D | null,
    lineColor: string,
    lineWidth: number,
) => {
    if (ctx && start && end) {
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }
}

export const bucketTool = (
    start: Point,
    ctx: CanvasRenderingContext2D | null,
    fillColor: string
) => {
    interface Span {
        left: number,
        right: number,
        y: number,
        direction: number
    }

    const convertColor = function() {
        let ctx :CanvasRenderingContext2D;
        return function(color: string) {
            if (!ctx) {
                ctx = <CanvasRenderingContext2D>document.createElement('canvas').getContext('2d');
                ctx.canvas.width = 1;
                ctx.canvas.height = 1;
            }
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const imgData = ctx.getImageData(0, 0, 1, 1);
            return new Uint32Array(imgData.data.buffer)[0];
        }
    }()

    const fillColorConverted = convertColor(fillColor)

    const getPixel = (
        pixelData: {
            width: number,
            height: number,
            data: Uint32Array
        }, 
        x: number,
        y: number
        ) => {
            if ( x < 0 || 
                y < 0 || 
                x >= pixelData.width ||
                y >= pixelData.height) {
                    return -1
            } else {
                return pixelData.data[y * pixelData.width + x]
            }
        }

    const floodFill = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        fillColor: number
    ) => {
        const  imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

        // make a Uint32Array view on the pixels so we can manipulate pixels
        // one 32bit value at a time instead of as 4 bytes per pixel
        const pixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer)
        }
        
        //Get color we're filling
        const targetColor = getPixel(pixelData, x, y)

        if (targetColor !== fillColor) {
            const spansToCheck: Array<Span> = []

            const addSpan = (
                left: number,
                right: number,
                y: number,
                direction: number
            ) => {
                spansToCheck.push({left, right, y, direction})
            }

            const checkSpan =(
                left: number,
                right: number,
                y: number,
                direction: number
            ) => {
                let inSpan = false
                let start
                let x
                for (x = left; x < right; x++) {
                    const color = getPixel(pixelData, x, y)
                    if (color === targetColor) {
                        if (!inSpan) {
                            inSpan = true
                            start = x
                        }
                    } else {
                        if (inSpan) {
                            inSpan = false
                            addSpan(<number>start, x - 1, y , direction)
                        }
                    }
                }
                if (inSpan) {
                    inSpan = false
                    addSpan(<number>start, x - 1, y, direction)
                }
            }

            addSpan(x, x, y, 0)

            while (spansToCheck.length > 0) {
                const {left, right, y, direction} = <Span>spansToCheck.pop()
                
                // do left until we hit something, while we do this check above and below and add
                let l = left
                for (;;) {
                    l--
                    const color = getPixel(pixelData, l, y)
                    if (color !== targetColor || l < 0 || l > ctx.canvas.width) {
                        break
                    }
                }
                l++
                
                let r = right
                for (;;) {
                    r++
                    const color = getPixel(pixelData, r, y)
                    if (color !== targetColor || r < 0 || r > ctx.canvas.height) {
                        break
                    }
                }
            
                const lineOffset = y * pixelData.width
                pixelData.data.fill(fillColor, lineOffset + l, lineOffset + r)
                
                if (direction <= 0) {
                    checkSpan(l, r, y - 1, -1)
                } else {
                    checkSpan(l, left, y - 1, -1)
                    checkSpan(right, r, y - 1, -1)
                }
                
                if (direction >= 0) {
                    checkSpan(l, r, y + 1, +1)
                } else {
                    checkSpan(l, left, y + 1, +1)
                    checkSpan(right, r, y + 1, +1)
                }     
            }
            // put the data back
            ctx.putImageData(imageData, 0, 0)
        }
    }

    if (ctx && start) {
        floodFill(ctx, start.x, start.y, fillColorConverted)
    }
}