import { Routes, Route, useLocation } from "react-router-dom"

import CreateSpray from '../pages/spray/CreateSpray'
import User from "../pages/user/User"
import App from "../App"
import PersistLogin from "../components/wrapper/PersistLogin"
import SprayModal from "../components/modal/spray/SprayModal"

const RouteSwitch = () => {
    const location = useLocation()
    const previousLocation = location.state?.previousLocation

    return (
        <>
        <Routes location={previousLocation || location}>
            <Route element={<PersistLogin />}>
                <Route path='/' element={<App />}/>
                <Route path='/create' element={<CreateSpray />}/>
                <Route path='/:id' element={<User />}/>
            </Route>
        </Routes>
        {
            previousLocation && (
                <Routes>
                    <Route path="/spray/:id" element={<SprayModal />} />
                </Routes>
            )
        }
        </>
    )
}

export default RouteSwitch