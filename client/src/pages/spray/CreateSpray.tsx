import './_CreateSpray.css'
import {v4 as uuidv4} from 'uuid'

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

import Layout from '../../components/layout/Layout';
import CreateSprayCanvas from './CreateSprayCanvas';
import CreateCanvasForm from './CreateSprayForm';
import { SelectChangeEvent } from '@mui/material';

export interface CanvasRef {
    getHistory: () => string[][],
    setHistory: (newHistory: string[][]) => void
}

const CreateSpray = () => {
    const canvasRef = useRef<CanvasRef>(null)
    const [step, setStep] = useState(0)
    const [sprayHistory, setSprayHistory] = useState<string[][]>([])
    const [caption, setCaption] = useState('')
    const [viewPermission, setViewPermission] = useState('1')
    const [drawPermission, setDrawPermission] = useState('1')
    const [isLimited, setIsLimited] = useState(false)
    const [deadline, setDeadline] = useState<Event | null>(null)

    const user = useSelector(selectUser)

    const handleNext = () => {
        if (canvasRef.current) {
            const data = canvasRef.current.getHistory()
            if (data.length === 1 && sprayHistory.length !== 1) {
                setStep(1)
                return
            }
            setSprayHistory(data)
        }
        setStep(1)
    }

    const handleBack = () => {
        setStep(0)
    }

    const handleDiscard = () => {
        setSprayHistory([])
    }

    const handleCaptionChange = (e: ChangeEvent) =>  setCaption((e.target as HTMLInputElement).value)
    const handleViewPermissionChange = (e: SelectChangeEvent<string>) => setViewPermission(e.target.value)
    const handleDrawPermissionChange = (e: SelectChangeEvent<string>) => setDrawPermission(e.target.value)
    const handleLimitedChange = () => setIsLimited(prev => !prev)
    const handleDeadlineChange = (e: Event | null) => setDeadline(e)

    const handleSubmit = async () => {
        const uploadWorker = new Worker(new URL('../../serviceWorker.ts', import.meta.url))
        const id = uuidv4()
        const data = {
            userId: user,
            spray: sprayHistory,
            caption,
            viewPermission,
            drawPermission,
            isLimited,
            deadline
        }
        uploadWorker.postMessage({id, data})
        uploadWorker.onmessage = () => {
            uploadWorker.terminate()
        }
        
        setSprayHistory([])
    }

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.setHistory(sprayHistory)
        }
    })

    useEffect(() => {
        setSprayHistory([])
    }, [])

    let content
    if (step === 0) {
        content = <CreateSprayCanvas canvasRef={canvasRef} handleNext={handleNext} handleDiscard={handleDiscard}/>
    }
    if (step === 1) {
        content = <CreateCanvasForm 
            canvasRef={canvasRef} 
            handleBack={handleBack} 
            handleSubmit={handleSubmit}
            caption={caption}
            setCaption={handleCaptionChange}
            viewPermission={viewPermission}
            setViewPermission={handleViewPermissionChange}
            drawPermission={drawPermission}
            setDrawPermission={handleDrawPermissionChange}
            isLimited={isLimited}
            setIsLimited={handleLimitedChange}
            deadline={deadline}
            setDeadline={handleDeadlineChange}
            />
    }

    return (
        <Layout>
            {content}
        </Layout>
    )
}

export default CreateSpray