import './_CreateSpray.css'

import { Ref } from "react";

import Canvas from "../../components/canvas/Canvas";
import { CanvasRef } from "./CreateSpray";

type CreateSprayCanvasProps = {
    canvasRef: Ref<CanvasRef>,
    handleDiscard: () => void,
    handleNext: () => void
}

const CreateSprayCanvas = ({canvasRef, handleDiscard, handleNext} :CreateSprayCanvasProps) => {
    return (
        <div className='createMainContainer'>
                    <div className='subContainer one'>
                        <div style={{marginTop: '24px'}}>
                            <h1>Create your Spray</h1>
                            <div className='subtitle'>
                                <span>Start by drawing something on the canvas</span>
                            </div>
                            <Canvas 
                                width={450}
                                height={800}
                                drawable={true}
                                ref={canvasRef}
                            />
                        </div>

                        <div className='subButtonContainer'>
                            <div className='buttonDiscardContainer'>
                                <button className='buttonDiscard' onClick={handleDiscard}>
                                    <div className='textContainer'>
                                        Discard
                                    </div>
                                </button>
                            </div>
                            <div className='buttonNextContainer'>
                                <button className='buttonNext' onClick={handleNext}>
                                    <div className='textContainer'>
                                        Next
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default CreateSprayCanvas