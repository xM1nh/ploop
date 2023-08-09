import './_CreateSpray.css'
import {v4 as uuidv4} from 'uuid'

import { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { addSpray, discard } from '../../features/spray/createSpraySlice';
import { RootState } from '../../app/store';

import Layout from '../../components/layout/Layout';
import CreateSprayCanvas from './CreateSprayCanvas';
import CreateCanvasForm from './CreateSprayForm';

export interface CanvasRef {
    getHistory: () => string[][],
    setHistory: (newHistory: string[][]) => void
}

const CreateSpray = () => {
    const canvasRef = useRef<CanvasRef>(null)
    const [step, setStep] = useState(0)

    const dispatch = useDispatch()
    const sprayHistory = useSelector((state: RootState) => state.createSpray.spray)

    const handleNext = () => {
        if (canvasRef.current) {
            const data = canvasRef.current.getHistory()
            if (data.length === 1 && sprayHistory.length !== 1) {
                setStep(1)
                return
            }
            dispatch(addSpray(data))
        }
        setStep(1)
    }

    const handleDiscard = () => {
        dispatch(discard())
    }

    const handleBack = () => {
        setStep(0)
    }

    const handleSubmit = async () => {
        const uploadWorker = new Worker(new URL('../../serviceWorker.ts', import.meta.url))
        const id = uuidv4()
        uploadWorker.postMessage({id, data: sprayHistory})
        uploadWorker.onmessage = () => {
            uploadWorker.terminate()
        }
        
        //dispatch(addSpray([]))
    }

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.setHistory(sprayHistory)
        }
    })

    useEffect(() => {
        dispatch(discard())
    }, [dispatch])

    let content
    if (step === 0) {
        content = <CreateSprayCanvas canvasRef={canvasRef} handleNext={handleNext} handleDiscard={handleDiscard}/>
    }
    if (step === 1) {
        content = <CreateCanvasForm canvasRef={canvasRef} handleBack={handleBack} handleSubmit={handleSubmit}/>
    }

    return (
        <Layout>
            {content}
        </Layout>
    )
}

export default CreateSpray