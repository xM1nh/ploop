import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../features/auth/authSlice";

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)

    const [refresh, {
        isLoading,
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    await refresh()
                } catch(e) {
                    console.error(e)
                }
            }

            if (!token && isLoggedIn) verifyRefreshToken()
        }

        return () => {effectRan.current = true}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let content = <Outlet />
    if (isLoading) {
        content = <p>Please wait...</p>
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default PersistLogin