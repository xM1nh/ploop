import './_CreateSpray.css'

import { ChangeEvent, Ref } from 'react'

import Canvas from '../../components/canvas/Canvas'
import { CanvasRef } from './CreateSpray'

import IOSSwitch from '../../components/switch/Switch';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type CreateCanvasFormProps = {
    canvasRef: Ref<CanvasRef>,
    handleBack: () => void,
    handleSubmit: () => void,
    caption: string,
    setCaption: (e: ChangeEvent) => void,
    viewPermission: string,
    setViewPermission: (e: SelectChangeEvent<string>) => void,
    drawPermission: string,
    setDrawPermission: (e: SelectChangeEvent<string>) => void,
    isLimited: boolean,
    setIsLimited: () => void,
    deadline: Event | null,
    setDeadline: (e: Event | null) => void,
}

const CreateCanvasForm = ({
    canvasRef, 
    handleBack, 
    handleSubmit,
    caption,
    setCaption,
    viewPermission,
    setViewPermission,
    drawPermission,
    setDrawPermission,
    isLimited,
    setIsLimited,
    deadline,
    setDeadline
} :CreateCanvasFormProps) => {
    return (
        <div className='createMainContainer'>
            <div className='subContainer two'>
                <Canvas 
                    width={450}
                    height={800}
                    drawable={false}
                    ref={canvasRef}
                />
                <div className='formWrapper'>
                    <div>
                        <h1>Create your Spray</h1>
                        <div className='subtitle'>
                            <span>Give your Spray some information to make it easier for people to discover it</span>
                        </div>
                    </div>
                    <div className='formContainer'>
                        <form>
                            <div className='formFieldContainer'>
                                <label>Caption</label>
                                <input 
                                    type='text' 
                                    className='sprayCaption' 
                                    name='caption'
                                    value={caption}
                                    onChange={setCaption}
                                    />
                            </div>
                            <div className='formFieldContainer'>
                                <label>Who can view this Spray</label>
                                <Select 
                                    sx={{maxWidth: '300px'}} 
                                    defaultValue='1' 
                                    value={viewPermission} 
                                    onChange={setViewPermission}
                                >
                                    <MenuItem value='1'>Public</MenuItem>
                                    <MenuItem value='2'>Private</MenuItem>
                                </Select>
                            </div>
                            <div className='formFieldContainer'>
                                <label>Who can draw on this Spray</label>
                                <Select 
                                    sx={{maxWidth: '300px'}} 
                                    defaultValue='1'
                                    value={drawPermission} 
                                    onChange={setDrawPermission}
                                >
                                    <MenuItem value='1'>Public</MenuItem>
                                    <MenuItem value='2'>Followers</MenuItem>
                                    <MenuItem value='3'>Private</MenuItem>
                                </Select>
                            </div>
                            <div className='formFieldContainer switch'>
                                <div>
                                    <label>Limited</label>
                                    <div className='inputInfoHover'>
                                        <ErrorOutlineIcon sx={{width: 18.33, height: 18.33}}/>
                                    </div>
                                    <IOSSwitch onChange={setIsLimited} checked={isLimited}/>
                                </div>
                                {isLimited &&
                                    <div className='dateTimeWrapper'>
                                        <div className='endDatePicker'>
                                            <DateTimePicker 
                                                sx={{
                                                    backgroundColor: 'rgba(46, 50, 56, 0.05)',
                                                }}
                                                value={deadline}
                                                onChange={setDeadline}
                                                slotProps={{
                                                    toolbar: {
                                                        toolbarFormat: 'dd MMMM, yyyy',
                                                        hidden: false
                                                    }
                                                }}
                                                disablePast
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>


                    <div className='subButtonContainer'>
                        <div className='buttonDiscardContainer'>
                            <button className='buttonDiscard' onClick={handleBack}>
                                <div className='textContainer'>
                                    Back
                                </div>
                            </button>
                        </div>
                        <div className='buttonNextContainer'>
                            <button className='buttonNext' onClick={handleSubmit} disabled={isLimited && !deadline}>
                                <div className='textContainer'>
                                    Create
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCanvasForm