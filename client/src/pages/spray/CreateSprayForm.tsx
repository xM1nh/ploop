import './_CreateSpray.css'

import { Ref } from 'react'

import Canvas from '../../components/canvas/Canvas'
import { CanvasRef } from './CreateSpray'

import IOSSwitch from '../../components/switch/Switch';
import { Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type CreateCanvasFormProps = {
    canvasRef: Ref<CanvasRef>,
    handleBack: () => void,
    handleSubmit: () => void
}

const CreateCanvasForm = ({canvasRef, handleBack, handleSubmit} :CreateCanvasFormProps) => {
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
                                <input type='text' className='sprayCaption' name='sprayCaption'/>
                            </div>
                            <div className='formFieldContainer'>
                                <label>Who can draw on this Spray</label>
                                <Select sx={{maxWidth: '300px'}}>
                                    <MenuItem sx={{backgroundColor: 'rgb(255, 255, 255)'}}>Public</MenuItem>
                                    <MenuItem>Friends</MenuItem>
                                    <MenuItem>Private</MenuItem>
                                </Select>
                            </div>
                            <div className='formFieldContainer switch'>
                                <div>
                                    <label>Limited</label>
                                    <div className='inputInfoHover'>
                                        <ErrorOutlineIcon sx={{width: 18.33, height: 18.33}}/>
                                    </div>
                                    <IOSSwitch />
                                </div>
                                <div className='dateTimeWrapper'>
                                    <div className='endDatePicker'>
                                        <DatePicker sx={{
                                            backgroundColor: 'rgba(46, 50, 56, 0.05)',
                                        }}/>
                                    </div>
                                    <div className='endTimePicker'>
                                        <TimePicker sx={{
                                            backgroundColor: 'rgba(46, 50, 56, 0.05)',
                                        }}/>
                                    </div>
                                </div>
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
                            <button className='buttonNext' onClick={handleSubmit}>
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