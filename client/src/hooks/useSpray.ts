import { useState, useEffect } from "react"
import { Like, Follow, Save, Spray } from '../utils/types';

import { useDispatch } from "react-redux";
import { useLikeMutation, useUnlikeMutation } from '../features/spray/likeApiSlice';
import { useFollowMutation, useUnfollowMutation } from '../features/user/userApiSlice';
import { useSaveMutation, useUnsaveMutation } from '../features/spray/saveApiSlice';
import { toggleAuth } from '../features/modal/modalSlice';

const useSpray = (userId: string, spray: Spray) => {
    const [like] = useLikeMutation()
    const [unlike] = useUnlikeMutation()
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const [save] = useSaveMutation()
    const [unsave] = useUnsaveMutation()
    const [isLike, setIsLike] = useState<Like | null | undefined>(null)
    const [isFollow, setIsFollow] = useState<Follow | null | undefined>(null)
    const [isSave, setIsSave] = useState<Save | null | undefined>(null)
    const [likeCount, setLikeCount] = useState<number>()
    const [saveCount, setSaveCount] = useState<number>()
    const [shareCount, setShareCount] = useState<number>()
    const [commentCount, setCommnetCount] = useState<number>()
    const dispatch = useDispatch()

    const handleFollowButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth())
        } else {
            if (!isFollow) {
                const response = await follow({userId, followeeId: (spray?.user.id as number).toString()}).unwrap()
                setIsFollow(response)
            } else {
                await unfollow({userId, followeeId: (spray?.user.id as number).toString()})
                setIsFollow(null)
            }
        }
    }

    const handleLikeButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth())
        } else {
            if (!isLike) {
                const response = await like({sprayId: (spray?.id as number).toString(), userId: userId.toString(), notifierId: (spray?.user.id as number).toString()}).unwrap()
                setIsLike(response)
                setLikeCount(response.spray.likes)
            }
            else {
                const response = await unlike({sprayId: (spray?.id as number).toString(), userId: userId.toString()}).unwrap()
                setIsLike(null)
                setLikeCount(response.spray.likes)
            }
        }
    }

    const handleSaveButtonClick = async () => {
        if (!userId) {
            dispatch(toggleAuth())
        } else {
            if (!isSave) {
                const response = await save({sprayId: (spray?.id as number).toString(), userId: userId.toString()}).unwrap()
                setIsSave(response)
                setSaveCount(response.spray.saves)
            } else {
                const response = await unsave({sprayId: (spray?.id as number).toString(), userId: userId.toString()}).unwrap()
                setIsSave(null)
                setSaveCount(response.spray.saves)
            }
        }
    }

    useEffect(() => {
        if (spray) {
            setIsLike(spray.isLike)
            setIsSave(spray.isSave)
            setLikeCount(spray.likes)
            setSaveCount(spray.saves)
            setShareCount(spray.shares)
            setCommnetCount(spray.comments)
        }
    }, [spray])

    return {
        isLike,
        isSave,
        isFollow,
        likeCount,
        saveCount,
        shareCount,
        commentCount,
        setCommnetCount,
        handleFollowButtonClick,
        handleLikeButtonClick,
        handleSaveButtonClick,
        like,
        unlike,
        follow,
        unfollow,
        save,
        unsave
    }
}

export default useSpray