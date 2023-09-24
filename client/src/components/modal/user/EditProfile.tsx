import './_EditProfile.css'

import { useState, ChangeEvent } from 'react';
import { useEditUserAvatarMutation, useEditUserInfoMutation } from '../../../features/user/userApiSlice';

import CloseIcon from '@mui/icons-material/Close';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { User } from '../../../utils/types';

interface EditProfile {
    user: User,
    handleCloseButtonClick: () => void,
}

const EditProfile = ({
    handleCloseButtonClick,
    user
}: EditProfile) => {
    const [username, setUsername] = useState<string>(user.username)
    const [nickname, setNickname] = useState<string>(user.nickname)
    const [bio, setBio] = useState<string>(user.bio)
    const [previewImage, setPreviewImage] = useState<string>(user.avatar_url)
    const [uploadImage, setUploadImage] = useState<File | null>(null)
    const [avatarIsDirty, setAvatarIsDiry] = useState<boolean>(false)
    const [infoIsDirty, setInfoIsDirty] = useState<boolean>(false)

    const [editAvatar] = useEditUserAvatarMutation()
    const [editInfo] = useEditUserInfoMutation()

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const dataUrl = URL.createObjectURL(file)
            setPreviewImage(dataUrl)
            setUploadImage(file)
            setAvatarIsDiry(true)
        }
    }

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
        setInfoIsDirty(true)
    }

    const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
        setInfoIsDirty(true)
    }

    const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value)
        setInfoIsDirty(true)
    }

    const handleSubmit = async () => {
        if (uploadImage) {
            await editAvatar({id: user.id.toString(), imageFile: uploadImage})
        }
        if (infoIsDirty) {
            await editInfo({id: user.id.toString(), username, nickname, bio})
        }
        handleCloseButtonClick()
        setTimeout(() => window.location.reload(), 3000)
    }

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
                                                        <img src={previewImage}/>
                                                    </span>
                                                </div>
                                                <div className='avatarEditIcon'>
                                                    <BorderColorIcon sx={{height: 16}}/>
                                                    <input className='inputUpload' type='file' accept=".jpg,.jpeg,.png,.tiff,.heic,.webp" onChange={handleImageUpload}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='editModalField'>
                                            <label>Username</label>
                                            <div className='editModalInputContainer'>
                                                <input name='username' value={username} onChange={handleUsernameChange}></input>
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
                                                <input name='nickname' value={nickname} onChange={handleNicknameChange}></input>
                                                <p className='inputTip'>
                                                    Consider using your real name so people can regconize you.
                                                </p>
                                            </div>
                                        </div>

                                        <div className='editModalField' style={{border: 0}}>
                                            <label>Bio</label>
                                            <div className='editModalInputContainer'>
                                                <textarea name='bio' value={bio} onChange={handleBioChange}/>
                                                <div className='bioTextCount'>
                                                    <span>{}/</span>
                                                    <span>80</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='editModalFooterContainer'>
                                        <button className='cancel' onClick={handleCloseButtonClick}>Cancel</button>
                                        <button className='save' disabled={!avatarIsDirty && !infoIsDirty} onClick={handleSubmit}>Save</button>
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