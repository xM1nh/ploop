import './_EditProfile.css'

import CloseIcon from '@mui/icons-material/Close';
import BorderColorIcon from '@mui/icons-material/BorderColor';

interface EditProfile {
    handleCloseButtonClick: () => void
}

const EditProfile = ({
    handleCloseButtonClick
}: EditProfile) => {
    return (
        <div className='editModalContainer'>
            <div className='editModalBackdrop'>
                <div className='editModalContentContainer'>
                    <div className='editModalAnotherContainer'>
                        <div className='notAnotherContainer'>
                            <section className='editModalContentSection'>
                                <div style={{height: '700px'}}>

                                    <div className='editModalHeaderContainer'>
                                        <h1>Edit Profile</h1>
                                        <div className='modalCloseButton' onClick={handleCloseButtonClick}>
                                            <CloseIcon sx={{width: 15, height: 15}}/>
                                        </div>
                                    </div>

                                    <div className='editModalBodyContainer'>

                                        <div className='editModalField'>
                                            <label>Profile photo</label>
                                            <div className='avatarContent'>
                                                <div className='avatarContainer'>
                                                    <span>
                                                        <img />
                                                    </span>
                                                </div>
                                                <div className='avatarEditIcon'>
                                                    <BorderColorIcon sx={{height: 16}}/>
                                                    <input className='inputUpload' type='file' accept=".jpg,.jpeg,.png,.tiff,.heic,.webp" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='editModalField'>
                                            <label>Username</label>
                                            <div className='editModalInputContainer'>
                                                <input name='username'></input>
                                                <p className='profileUrl'></p>
                                                <p className='inputTip'>
                                                    Usernames can only contain letters, numbers, underscores, and periods. 
                                                    Changing your username will also change your profile link.
                                                </p>
                                            </div>
                                        </div>

                                        <div className='editModalField'>
                                            <label>Name</label>
                                            <div className='editModalInputContainer'>
                                                <input name='nickname'></input>
                                                <p className='inputTip'>
                                                    Consider using your real name so people can regconize you.
                                                </p>
                                            </div>
                                        </div>

                                        <div className='editModalField' style={{border: 0}}>
                                            <label>Bio</label>
                                            <div className='editModalInputContainer'>
                                                <textarea name='bio'/>
                                                <div className='bioTextCount'>
                                                    <span>{}/</span>
                                                    <span>80</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='editModalFooterContainer'>
                                        <button className='cancel'>Cancel</button>
                                        <button className='save' disabled={true}>Save</button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile