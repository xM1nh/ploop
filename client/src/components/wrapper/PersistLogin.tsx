import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../features/auth/authSlice";

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)

    const [refresh] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true) {
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

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default PersistLogin